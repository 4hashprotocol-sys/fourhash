async function readText(request) {
  try { const t = await request.text(); if (typeof t === 'string') return t; } catch(_e) {}
  return '{}';
}

function getEnv(c, key, fallback) {
  try {
    const e = c.env;
    if (e) {
      if (typeof e.get === 'function') { try { const v = e.get(key); if (typeof v === 'string' && v !== '') return v; } catch(_) {} }
      const v = e[key]; if (typeof v === 'string' && v !== '') return v;
    }
  } catch(_) {}
  try {
    const v = globalThis.process && globalThis.process.env ? globalThis.process.env[key] : undefined;
    if (typeof v === 'string' && v !== '') return v;
  } catch(_) {}
  return fallback || '';
}

function corsHeaders(extra) {
  const base = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nowpayments-sig',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (extra) for (const k of Object.keys(extra)) base[k] = extra[k];
  return base;
}

function json(status, body) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsHeaders() });
}

async function validSignature(IPN_SECRET, rawBody, sigHeader) {
  if (!IPN_SECRET || !sigHeader) return false;
  try {
    let sorted = rawBody;
    try { sorted = JSON.stringify(JSON.parse(rawBody)); } catch(_) {}
    const enc = new TextEncoder();
    const w = globalThis.crypto && globalThis.crypto.subtle;
    if (!w) return false;
    async function hmacHex(secret) {
      const key = await w.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
      const buf = await w.sign('HMAC', key, enc.encode(sorted));
      return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    }
    const candidates = [IPN_SECRET];
    const s = String(IPN_SECRET);
    if (!s.startsWith('/')) candidates.push('/' + s);
    if (s.startsWith('/')) candidates.push(s.slice(1));
    const need = String(sigHeader || '').toLowerCase();
    for (let i = 0; i < candidates.length; i++) {
      const h = await hmacHex(candidates[i]);
      if (h.toLowerCase() === need) return true;
    }
    return false;
  } catch(_e) { return false; }
}

function sbHeaders(c) {
  const k = getEnv(c, 'SUPABASE_SERVICE_ROLE_KEY') || getEnv(c, 'SUPABASE_ANON_KEY') || getEnv(c, 'SUPABASE_PUBLISHABLE_KEY') || '';
  return {
    'apikey': k,
    'Authorization': 'Bearer ' + k,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

async function sbInsertWebhook(c, row) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/nowpayments_webhooks') : (base + '/rest/v1/nowpayments_webhooks'));
    const r = await fetch(url, { method: 'POST', headers: sbHeaders(c), body: JSON.stringify(row || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbGetTransactions(c, q) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/transactions?' + q) : (base + '/rest/v1/transactions?' + q));
    const r = await fetch(url, { method: 'GET', headers: sbHeaders(c) });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : [];
  } catch(_) { return []; }
}

async function sbInsertOrIgnorePosition(c, profileId) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const H = sbHeaders(c);
    const exists = await sbGetTransactions(c, 'rest/v1/linear_network?profile_id=eq.' + encodeURIComponent(profileId) + '&select=profile_id&limit=1');
    if (Array.isArray(exists) && exists.length && exists[0] && exists[0].profile_id) return true;

    const now = new Date().toISOString();
    const baseObj = { profile_id: profileId, level_number: 1, created_at: now, updated_at: now };
    const attempts = [
      Object.assign({}, baseObj, { seat_number: 1, row_number: 1, filled_at: now, filled_by: null, commission_paid: false, commission_tx: null }),
      Object.assign({}, baseObj, { seat: 1, row: 1, filled_at: now }),
      Object.assign({}, baseObj, { position_index: 1, line_row: 1, line_seat: 1 }),
      Object.assign({}, baseObj, { seat_number: 1 }),
      Object.assign({}, baseObj)
    ];
    const insertUrl = base + '/rest/v1/linear_network';
    for (let i = 0; i < attempts.length; i++) {
      try {
        const r = await fetch(insertUrl, {
          method: 'POST',
          headers: Object.assign({}, H, { 'Prefer': 'return=minimal,resolution=ignore-duplicates' }),
          body: JSON.stringify(attempts[i])
        });
        if (r.ok) return true;
      } catch(_) {}
    }
    return false;
  } catch(_) { return false; }
}

async function ensureActivated(c, profileId, amount) {
  let changes = 0;
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const H = sbHeaders(c);
    const now = new Date().toISOString();
    const patchProfile = { status: 'active', level_number: 1, updated_at: now };
    try {
      const cur = await sbGetTransactions(c, 'rest/v1/profiles?id=eq.' + encodeURIComponent(profileId) + '&select=status,activated_at,level_number&limit=1');
      if (Array.isArray(cur) && cur.length && cur[0]) {
        const st = String(cur[0].status || 'pending').toUpperCase();
        if (st !== 'ACTIVE' && st !== 'ATIVO') patchProfile.activated_at = cur[0].activated_at || now;
        else patchProfile.activated_at = cur[0].activated_at || now;
      } else {
        patchProfile.activated_at = now;
      }
    } catch(_) { patchProfile.activated_at = now; }
    const rp = await fetch(base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId), {
      method: 'PATCH', headers: H, body: JSON.stringify(patchProfile)
    });
    if (rp.ok) changes++;

    try {
      const wlist = await sbGetTransactions(c, 'rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=profile_id,total_deposited&limit=1');
      const amt = Number(amount || 0) > 0 ? Number(amount) : 10;
      if (Array.isArray(wlist) && wlist.length && wlist[0].profile_id) {
        const curTot = Number(wlist[0].total_deposited || 0);
        if (curTot < amt) {
          const rw = await fetch(base + '/rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId), {
            method: 'PATCH', headers: H, body: JSON.stringify({ total_deposited: amt, updated_at: now })
          });
          if (rw.ok) changes++;
        } else changes++;
      } else {
        const ri = await fetch(base + '/rest/v1/wallets', {
          method: 'POST', headers: Object.assign({}, H, { 'Prefer': 'return=minimal,resolution=ignore-duplicates' }),
          body: JSON.stringify({ profile_id: profileId, total_deposited: amt, total_bonus_team: 0, total_bonus_matrix: 0, total_withdrawn: 0, updated_at: now })
        });
        if (ri.ok) changes++;
      }
    } catch(_) {}

    if (await sbInsertOrIgnorePosition(c, profileId)) changes++;
  } catch(_) {}
  return changes;
}

async function sbRpc(c, name, params) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/rpc/' + name) : (base + '/rest/v1/rpc/' + name));
    const r = await fetch(url, { method: 'POST', headers: sbHeaders(c), body: JSON.stringify(params || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateProfile(c, profileId, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/profiles?id=eq.' + encodeURIComponent(profileId)) : (base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId)));
    const H = sbHeaders(c);
    const BASE_KEYS = ['status','updated_at','username','email','full_name','avatar_url','bio','country','phone','last_active_at','raw_user_meta_data','activated_at','level_number'];
    const tryUpd = async (p) => {
      try {
        const r = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(p || {}) });
        if (r.ok) return true;
        try {
          const t = await r.text();
          if (/42703|column .* of relation (\"|')?profiles(\"|')? does not exist/i.test(t)) return { error: 'missing', text: t };
        } catch(_) {}
        return false;
      } catch(_e) { return false; }
    };
    const full = {}; Object.keys(patch || {}).forEach(k => { full[k] = patch[k]; });
    const a = await tryUpd(full);
    if (a === true) return true;
    const mini = {};
    Object.keys(full).forEach(k => {
      const key = String(k).toLowerCase();
      if (BASE_KEYS.indexOf(key) >= 0) mini[k] = full[k];
    });
    if (!mini.status) mini.status = full.status || 'active';
    if (!mini.updated_at) mini.updated_at = full.updated_at || new Date().toISOString();
    const b = await tryUpd(mini);
    if (b === true) return true;
    const c2 = await tryUpd({ status: mini.status, updated_at: mini.updated_at });
    if (c2 === true) return true;
    return false;
  } catch(_e) { return false; }
}

async function sbGetProfileByPartialId(c, partial8) {
  try {
    if (!partial8 || partial8.length < 6) return null;
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const q = 'id=like.' + encodeURIComponent(partial8 + '%') + '&select=id,username,status,activated_at,level_number,upline_id&limit=50';
    const url = (base.endsWith('/') ? (base + 'rest/v1/profiles?' + q) : (base + '/rest/v1/profiles?' + q));
    const r = await fetch(url, { headers: sbHeaders(c) });
    if (!r.ok) return null;
    const d = await r.json();
    if (Array.isArray(d) && d.length === 1) return d[0];
    if (Array.isArray(d) && d.length > 1) {
      for (let i = 0; i < d.length; i++) {
        const rawId = String(d[i].id || '').toLowerCase();
        if (rawId.startsWith(String(partial8 || '').toLowerCase())) {
          try { console.log('[sbGetProfileByPartialId] AMBÍGUO (' + d.length + '), escolhido primeiro: @' + (d[i].username || '') + ' id=' + rawId.slice(0, 8)); } catch(_) {}
          return d[i];
        }
      }
      return d[0];
    }
    return null;
  } catch(_) { return null; }
}

async function sbUpdateTransactions(c, q, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/transactions?' + q) : (base + '/rest/v1/transactions?' + q));
    const H = sbHeaders(c);
    const tryPatch = async (p) => {
      try {
        const r = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(p || {}) });
        if (r.ok) return { ok: true, retry: false };
        try {
          const t = await r.text();
          if (txMissingField(t)) return { ok: false, retry: true, text: t };
        } catch(_) {}
        return { ok: false, retry: false };
      } catch(_e) { return { ok: false, retry: false }; }
    };
    const cleanPatch = {};
    for (const k of Object.keys(patch || {})) cleanPatch[k] = patch[k];
    let a = await tryPatch(cleanPatch);
    if (a.ok) return true;
    if (a.retry) {
      const tryHard = { ...cleanPatch };
      delete tryHard.error_message;
      delete tryHard.order_id;
      delete tryHard.gateway_payment_id;
      delete tryHard.gateway_provider;
      delete tryHard.method;
      delete tryHard.description;
      if (updatedAtFieldError(a.text)) delete tryHard.updated_at;
      try { await rpcEnsureTxColumns(c, a.text); } catch(_) {}
      const b = await tryPatch(tryHard);
      if (b.ok) return true;
    }
    return false;
  } catch(_e) { return false; }
}

async function sbInsertTransactions(c, row) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/transactions') : (base + '/rest/v1/transactions'));
    const H = sbHeaders(c);
    const now = new Date().toISOString();
    const baseRow = {
      profile_id: null,
      kind: 'deposit',
      currency: 'USDT',
      network: 'BEP20',
      amount: 0,
      fee: 0,
      status: 'pending',
      confirmations: 0,
      metadata: {},
      created_at: now,
      updated_at: now
    };
    const cleanRow = Object.assign({}, baseRow, row || {});
    if (cleanRow.amount !== undefined && cleanRow.amount !== null) cleanRow.amount = Number(cleanRow.amount) || 0;
    if (cleanRow.confirmed_at === undefined && cleanRow.status === 'confirmed') cleanRow.confirmed_at = now;
    const attempts = [];
    attempts.push(Object.assign({}, cleanRow));
    const mini = Object.assign({}, cleanRow);
    delete mini.updated_at; delete mini.note; delete mini.from_address; delete mini.to_address; delete mini.network;
    attempts.push(mini);
    const mini2 = {
      profile_id: cleanRow.profile_id,
      kind: cleanRow.kind || 'deposit',
      amount: Number(cleanRow.amount || 0),
      status: cleanRow.status || 'pending',
      nowpayments_id: cleanRow.nowpayments_id || null,
      tx_hash: cleanRow.tx_hash || null,
      confirmed_at: cleanRow.confirmed_at || null,
      created_at: now
    };
    attempts.push(mini2);
    for (let i = 0; i < attempts.length; i++) {
      try {
        const headers = Object.assign({}, H, { 'Prefer': 'return=representation,resolution=ignore-duplicates' });
        const r = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(attempts[i]) });
        if (r.ok) {
          try {
            const d = await r.json();
            if (Array.isArray(d) && d.length) return d[0];
            if (d && d.id) return d;
            return true;
          } catch(_) { return true; }
        }
      } catch(_) {}
    }
    return false;
  } catch(_e) { return false; }
}

function txMissingField(msg) { return /42703|column (error_message|order_id|gateway_payment_id|gateway_provider|method|description|updated_at|network|from_address|to_address|note) of relation "transactions" does not exist/i.test(msg || ''); }
function updatedAtFieldError(msg) { return /42703:.*updated_at|column.*updated_at.*does not exist/i.test(msg || ''); }
async function rpcEnsureTxColumns(c, text) {
  try { return false; } catch(_) { return false; }
}

async function sbWalletFallback(c, profileId, amount) {
  try {
    const H = sbHeaders(c);
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const add = Number(amount) || 0;
    const tryWallet = async (minimal) => {
      try {
        const listUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&limit=1') : (base + '/rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&limit=1'));
        const list = await fetch(listUrl, { headers: H });
        const data = list.ok ? await list.json() : [];
        if (Array.isArray(data) && data.length) {
          const w = data[0];
          const patch = {};
          if (!minimal) patch.updated_at = new Date().toISOString();
          if (typeof w.available_balance === 'number' || (w.available_balance !== null && w.available_balance !== undefined))
            patch.available_balance = Number(w.available_balance || 0) + add;
          if (typeof w.total_deposited === 'number' || (w.total_deposited !== null && w.total_deposited !== undefined))
            patch.total_deposited = Number(w.total_deposited || 0) + add;
          if (typeof w.balance_usd === 'number' || (w.balance_usd !== null && w.balance_usd !== undefined))
            patch.balance_usd = Number(w.balance_usd || 0) + add;
          if (typeof w.total_deposits_usd === 'number' || (w.total_deposits_usd !== null && w.total_deposits_usd !== undefined))
            patch.total_deposits_usd = Number(w.total_deposits_usd || 0) + add;
          if (typeof w.total_balance === 'number' || (w.total_balance !== null && w.total_balance !== undefined))
            patch.total_balance = Number(w.total_balance || 0) + add;
          if (typeof w.pending_balance === 'number' || (w.pending_balance !== null && w.pending_balance !== undefined))
            patch.pending_balance = Number(w.pending_balance || 0);
          if (typeof w.frozen_balance === 'number' || (w.frozen_balance !== null && w.frozen_balance !== undefined))
            patch.frozen_balance = Number(w.frozen_balance || 0);
          if (minimal) { delete patch.updated_at; delete patch.pending_balance; delete patch.frozen_balance; delete patch.total_balance; delete patch.total_deposits_usd; delete patch.balance_usd; delete patch.currency; }
          const updUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets?id=eq.' + encodeURIComponent(w.id)) : (base + '/rest/v1/wallets?id=eq.' + encodeURIComponent(w.id)));
          let r = await fetch(updUrl, { method: 'PATCH', headers: H, body: JSON.stringify(patch) });
          if (r.ok) return true;
          try {
            const t = await r.text();
            if (walletMissingField(t)) {
              const mini = {};
              if (typeof w.available_balance !== 'undefined') mini.available_balance = Number(w.available_balance || 0) + add;
              if (typeof w.total_deposited !== 'undefined') mini.total_deposited = Number(w.total_deposited || 0) + add;
              if (typeof w.balance_usd !== 'undefined') mini.balance_usd = Number(w.balance_usd || 0) + add;
              r = await fetch(updUrl, { method: 'PATCH', headers: H, body: JSON.stringify(mini) });
              if (r.ok) return true;
            }
          } catch(_) {}
          return false;
        } else {
          const insUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets') : (base + '/rest/v1/wallets'));
          const now = new Date().toISOString();
          const fullInsert = {
            profile_id: profileId,
            available_balance: add,
            pending_balance: 0,
            frozen_balance: 0,
            total_deposited: add,
            total_withdrawn: 0,
            total_bonus_team: 0,
            total_bonus_matrix: 0,
            created_at: now,
            updated_at: now
          };
          let r = await fetch(insUrl, { method: 'POST', headers: H, body: JSON.stringify(fullInsert) });
          if (r.ok) return true;
          try {
            const t = await r.text();
            if (walletMissingField(t)) {
              const mini = { profile_id: profileId, available_balance: add, total_deposited: add, created_at: now };
              r = await fetch(insUrl, { method: 'POST', headers: H, body: JSON.stringify(mini) });
              if (r.ok) return true;
            }
          } catch(_) {}
          return false;
        }
      } catch(_e) { return false; }
    };
    const a = await tryWallet(false);
    if (a) return true;
    return await tryWallet(true);
  } catch(_e) { return false; }
}

function walletMissingField(msg) { return /42703|column (updated_at|total_balance|pending_balance|frozen_balance|total_deposits_usd|available_balance|balance_usd|total_deposited|currency|bep20_address|trc20_address|erc20_address|btc_address|total_withdrawn|total_bonus_team|total_bonus_matrix) of relation "wallets" does not exist/i.test(msg || ''); }

function extractProfileIdFromOrderId(orderId) {
  try {
    const s = String(orderId || '').trim();
    if (!s) return '';
    const mFull = s.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
    if (mFull) return mFull[1];
    const parts = s.split('-');
    for (let i = 0; i < parts.length; i++) {
      if (/^[0-9a-fA-F]{8}$/.test(parts[i])) {
        if (i + 4 < parts.length
            && /^[0-9a-fA-F]{4}$/.test(parts[i+1])
            && /^[0-9a-fA-F]{4}$/.test(parts[i+2])
            && /^[0-9a-fA-F]{4}$/.test(parts[i+3])
            && /^[0-9a-fA-F]{12}$/.test(parts[i+4])) {
          return parts.slice(i, i + 5).join('-');
        }
        return parts[i];
      }
    }
    const m8 = s.match(/4H-[-_a-zA-Z0-9]+-([0-9a-fA-F]{8})-/);
    if (m8) return m8[1];
    const m8b = s.match(/activation-([0-9a-fA-F]{8})-/i);
    if (m8b) return m8b[1];
  } catch(_) {}
  return '';
}

async function doPost(context) {
  const { request } = context;
  try {
    const url = new URL(request.url);
    let profileId = String(url.searchParams.get('profile_id') || '').trim();
    let kind = String(url.searchParams.get('kind') || '').toLowerCase() || 'activation';
    const amountQs = Number(url.searchParams.get('amount') || 0);

    let sigHeader = '';
    try {
      sigHeader = request.headers.get('x-nowpayments-sig') || request.headers.get('X-Nowpayments-Sig') || '';
    } catch(_) {}

    const rawBody = await readText(request);
    let body; try { body = JSON.parse(rawBody || '{}'); } catch(_e) { body = {}; }

    const paymentId = String(body.payment_id || body.id || '').trim();
    const orderId = String(body.order_id || '').trim();
    const payStatus = String(body.payment_status || body.status || '').toLowerCase();
    const amountPaid = Number(body.price_amount || body.amount || amountQs || 0);
    if (!kind) {
      if (orderId) {
        const k = String(orderId.split('-')[1] || '').toLowerCase();
        if (k === 'activation' || k === 'deposit' || k === 'withdraw' || k === 'adjustment' || k === 'bonus') kind = k;
      }
    }

    if (!paymentId && !orderId) {
      try {
        await sbInsertWebhook(context, {
          payment_id: paymentId || null, order_id: orderId || null,
          payment_status: payStatus || null,
          request_ip: null, sig_header: sigHeader || null, sig_validated: false,
          order_description: (body && body.order_description) ? String(body.order_description).slice(0, 255) : null,
          raw_body: rawBody ? rawBody.slice(0, 200000) : null,
          error_message: 'missing_identifiers',
          created_at: new Date().toISOString()
        });
      } catch(_) {}
      return json(400, { ok: false, error: 'missing_identifiers' });
    }

    const IPN_SECRET = getEnv(context, 'NOWPAYMENTS_IPN_SECRET', '');
    let sigOk = !IPN_SECRET ? true : false;
    if (IPN_SECRET) {
      try { sigOk = Boolean(await validSignature(IPN_SECRET, rawBody, sigHeader)); } catch(_) { sigOk = false; }
    }

    let resolvedProfile = null;
    let profilePartial8 = '';
    if (!profileId && orderId) {
      const parsed = extractProfileIdFromOrderId(orderId);
      if (parsed && /^[0-9a-fA-F]{8}$/.test(parsed)) {
        profilePartial8 = parsed;
        resolvedProfile = await sbGetProfileByPartialId(context, parsed);
        if (resolvedProfile && resolvedProfile.id) profileId = String(resolvedProfile.id);
      } else if (parsed && /^[0-9a-fA-F]{8}-/.test(parsed)) {
        profileId = parsed;
      }
    }

    try {
      await sbInsertWebhook(context, {
        payment_id: paymentId || null, order_id: orderId || null,
        payment_status: payStatus || null,
        request_ip: null, sig_header: sigHeader || null, sig_validated: !!sigOk,
        order_description: (body && body.order_description) ? String(body.order_description).slice(0, 255) : null,
        raw_body: rawBody ? rawBody.slice(0, 200000) : null,
        profile_id: profileId || null,
        error_message: null,
        created_at: new Date().toISOString()
      });
    } catch(_) {}

    if (IPN_SECRET && !sigOk) {
      try {
        await sbInsertWebhook(context, {
          payment_id: paymentId || null, order_id: orderId || null,
          payment_status: payStatus || null,
          request_ip: null, sig_header: sigHeader || null, sig_validated: false,
          order_description: (body && body.order_description) ? String(body.order_description).slice(0, 255) : null,
          raw_body: null, profile_id: profileId || null,
          error_message: 'invalid_signature',
          created_at: new Date().toISOString()
        });
      } catch(_) {}
      return json(401, { ok: false, error: 'invalid_signature', profile_id: profileId, order_id: orderId });
    }

    function isPaidAmountOk(statusStr, amountReceived, expectedUsd) {
      const finalStates = ['finished','confirmed','completed','success','paid','payment_received','settled','partially_paid','wrong_asset'];
      const st = String(statusStr || '').toLowerCase().trim();
      let full = false;
      if (finalStates.indexOf(st) >= 0) full = true;
      else if (/(paid|finish|confirm|complete|success|settle|received)/i.test(st)) full = true;
      if (!full) return false;
      const ex = Number(expectedUsd || 0) > 0 ? Number(expectedUsd) : 10;
      const recv = Number(amountReceived || 0);
      if (recv <= 0) return true;
      let minPct = 0.985;
      if (st === 'partially_paid' || st === 'wrong_asset' || st === 'payment_received') {
        minPct = 0.94;
      }
      if (ex <= 10 && (st === 'partially_paid' || st === 'wrong_asset')) minPct = 0.93;
      return recv >= Number((ex * minPct).toFixed(6));
    }

    const amountReceived = Number(body.amount_received || body.pay_amount || body.outcome_amount || body.amount || amountPaid || 0);
    let expectedAmount = 10;
    try {
      const vRaw = Number(body.price_amount || body.expected_amount || amountPaid || 0);
      if (body && body.order_id && /^4H-(activation|deposit)-/.test(body.order_id)) {
        expectedAmount = 10;
      } else if (vRaw && Number(vRaw) > 0) {
          expectedAmount = Number(vRaw);
        } else {
          expectedAmount = 10;
        }
    } catch(_) { expectedAmount = 10; }
    expectedAmount = Number(expectedAmount) || 10;
    const finalStates = ['finished','confirmed','completed','success','partially_paid','wrong_asset','paid','payment_received','settled'];
    const isPaid = isPaidAmountOk(payStatus, amountReceived, expectedAmount);
    const isFailed = ['failed','expired','refunded','rejected','cancelled','canceled','timeout','time_out'].indexOf(payStatus) >= 0;

    const parentPaymentId = String(body && (body.parent_payment_id || body.original_payment_id || body.original_id || body.payment_id_of_failed_tx || '') || '').trim();
    if (!profileId && orderId) {
      const parsedFull = extractProfileIdFromOrderId(orderId);
      if (parsedFull && parsedFull.length >= 32) profileId = parsedFull;
    }

    let activation = false;
    let walletUpdated = false;
    let txMatched = false;
    let attemptedMissing = null;
    try {
      if ((profileId && profileId.length >= 10) || orderId || paymentId) {
        const patchTx = {
          status: isPaid ? 'confirmed' : (isFailed ? 'failed' : 'pending'),
          confirmed_at: isPaid ? new Date().toISOString() : (isFailed ? new Date().toISOString() : null),
          note: (isFailed ? ('[status_pagamento=' + payStatus + '] ') : '') +
                ((body && body.order_description) ? String(body.order_description).slice(0, 120) : ''),
          nowpayments_status: payStatus,
          network: (body && (body.network || body.payin_network || body.pay_network)) ? String(body.network || body.payin_network || body.pay_network).toUpperCase() : null,
          from_address: (body && (body.pay_address || body.payout_address)) ? String(body.pay_address || body.payout_address) : null,
          to_address: (body && (body.payin_extra_id || body.withdraw_address)) ? String(body.payin_extra_id || body.withdraw_address) : null
        };
        if (body && body.payin_hash) patchTx.tx_hash = String(body.payin_hash);
        if (body && typeof body === 'object') {
          try {
            patchTx.metadata = {
              gateway: {
                provider: 'nowpayments',
                payment_id: paymentId || null,
                order_id: orderId || null,
                ipn: body,
                signature_validated: sigOk,
                processed_at: new Date().toISOString()
              }
            };
          } catch(_) {}
        }
        const filters = [];
        if (paymentId) {
          filters.push('nowpayments_id=eq.' + encodeURIComponent(paymentId));
          filters.push('tx_hash=eq.' + encodeURIComponent(paymentId));
        }
        if (parentPaymentId) {
          filters.push('nowpayments_id=eq.' + encodeURIComponent(parentPaymentId));
          filters.push('tx_hash=eq.' + encodeURIComponent(parentPaymentId));
        }
        if (body && body.payin_hash) filters.push('tx_hash=eq.' + encodeURIComponent(String(body.payin_hash)));
        if (orderId) filters.push('or=(nowpayments_id.eq.' + encodeURIComponent(orderId) + ',metadata->>order_id.eq.' + encodeURIComponent(orderId) + ')');
        let q = '';
        if (filters.length) {
          const idOr = 'or=(' + filters.join(',') + ')';
          if (profileId) {
            q = 'and=(' + idOr + ',profile_id=eq.' + encodeURIComponent(profileId) + ')';
          } else {
            q = idOr;
          }
        } else if (profileId) {
          q = 'profile_id=eq.' + encodeURIComponent(profileId);
        } else {
          q = 'id=is.null';
        }
        try { txMatched = Boolean(await sbUpdateTransactions(context, q, patchTx)); } catch(_) { txMatched = false; }
        if (!txMatched) {
          try {
            const qFallback = (profileId ? ('and=(profile_id.eq.' + encodeURIComponent(profileId) + ',') : 'and=(') +
              'kind=in.(deposit,adjustment_credit),or=(status.eq.pending,status.eq.created),created_at.gt.' + encodeURIComponent(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()) + ')';
            const okFb = await sbUpdateTransactions(context, qFallback, patchTx);
            if (okFb) txMatched = true;
          } catch(_) {}
        }
        if (!txMatched && profileId && profileId.length >= 10 && (isPaid || isFailed)) {
          try {
            const kindTx = (kind && (kind === 'deposit' || kind === 'activation' || /deposit|activation/i.test(String(kind)))) ? 'deposit' : 'deposit';
            const nowTx = new Date().toISOString();
            const insertRow = {
              profile_id: profileId,
              kind: kindTx,
              currency: String(body.price_currency || body.pay_currency || 'USDT').toUpperCase() || 'USDT',
              network: (body && (body.network || body.payin_network || body.pay_network)) ? String(String(body.network || body.payin_network || body.pay_network).toUpperCase()).slice(0, 32) : 'BSC',
              amount: Number(expectedAmount || amountReceived || (isPaid ? 10 : 0)) || 0,
              fee: 0,
              status: isPaid ? 'confirmed' : (isFailed ? 'failed' : 'pending'),
              confirmations: isPaid ? 12 : 0,
              confirmed_at: isPaid ? nowTx : (isFailed ? nowTx : null),
              tx_hash: (body && body.payin_hash) ? String(body.payin_hash) : (paymentId ? String(paymentId) : null),
              nowpayments_id: paymentId || null,
              nowpayments_status: payStatus || null,
              related_profile_id: null,
              note: (orderId ? ('IPN fallback insert. order_id=' + String(orderId).slice(0, 80) + '. ') : '') +
                    (isFailed ? ('[status_pagamento=' + payStatus + '] ') : '') +
                    ((body && body.order_description) ? String(body.order_description).slice(0, 120) : ''),
              metadata: {
                gateway: {
                  provider: 'nowpayments',
                  payment_id: paymentId || null,
                  order_id: orderId || null,
                  ipn: body || null,
                  signature_validated: sigOk,
                  processed_at: nowTx,
                  fallback_insert: true
                }
              },
              created_at: nowTx,
              updated_at: nowTx
            };
            const okIns = await sbInsertTransactions(context, insertRow);
            if (okIns) { txMatched = true; }
          } catch(_) {}
        }
        if (!profileId && orderId) {
          try {
            const rows = await sbGetTransactions(context, ('or=(nowpayments_id.eq.' + encodeURIComponent(orderId) + ',metadata->>order_id.eq.' + encodeURIComponent(orderId) + ')&select=profile_id,id,amount&limit=1'));
            if (Array.isArray(rows) && rows.length && rows[0].profile_id) {
              profileId = String(rows[0].profile_id);
            }
          } catch(_) {}
        }
        if (!profileId && paymentId) {
          try {
            const rows2 = await sbGetTransactions(context, ('or=(nowpayments_id.eq.' + encodeURIComponent(paymentId) + ',tx_hash.eq.' + encodeURIComponent(paymentId) + ')&select=profile_id,id,amount&limit=1'));
            if (Array.isArray(rows2) && rows2.length && rows2[0].profile_id) {
              profileId = String(rows2[0].profile_id);
            }
          } catch(_) {}
        }
        if (!profileId && parentPaymentId) {
          try {
            const rows3 = await sbGetTransactions(context, ('or=(nowpayments_id.eq.' + encodeURIComponent(parentPaymentId) + ',tx_hash.eq.' + encodeURIComponent(parentPaymentId) + ')&select=profile_id,id,amount&limit=1'));
            if (Array.isArray(rows3) && rows3.length && rows3[0].profile_id) {
              profileId = String(rows3[0].profile_id);
            }
          } catch(_) {}
        }
        if (!profileId && (paymentId || parentPaymentId)) {
          try {
            const allIds = [paymentId, parentPaymentId].filter(Boolean);
            const rowsAny = await sbGetTransactions(context, 'status=in.(pending)&kind=in.(deposit,adjustment_credit)&created_at.gt.' + encodeURIComponent(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()) + '&select=profile_id,id,amount,nowpayments_id,tx_hash&order=created_at.desc&limit=50');
            if (Array.isArray(rowsAny) && rowsAny.length) {
              for (let i = 0; i < rowsAny.length; i++) {
                const r = rowsAny[i];
                const cand = [String(r.nowpayments_id || ''), String(r.tx_hash || '')].map(s => s.trim());
                if (allIds.some(id => cand.some(c => c && c.length > 2 && (c === id || id.indexOf(c) >= 0 || c.indexOf(id) >= 0)))) {
                  if (r.profile_id) { profileId = String(r.profile_id); break; }
                }
              }
            }
          } catch(_) {}
        }
        if (!profileId && paymentId) {
          try {
            const rowsDirect = await sbGetTransactions(context, 'nowpayments_id=eq.' + encodeURIComponent(paymentId) + '&select=profile_id,id,amount,kind,status&limit=3');
            if (Array.isArray(rowsDirect) && rowsDirect.length && rowsDirect[0].profile_id) {
              profileId = String(rowsDirect[0].profile_id);
              txMatched = true;
            }
          } catch(_) {}
        }
        if (!profileId && body && body.payin_hash) {
          try {
            const rowsHash = await sbGetTransactions(context, 'tx_hash=eq.' + encodeURIComponent(String(body.payin_hash)) + '&select=profile_id,id,amount,kind,status&limit=3');
            if (Array.isArray(rowsHash) && rowsHash.length && rowsHash[0].profile_id) {
              profileId = String(rowsHash[0].profile_id);
              txMatched = true;
            }
          } catch(_) {}
        }

        if (isPaid && profileId && profileId.length >= 10) {
          const amount = amountPaid || amountQs || Number(body.outcome_amount || body.pay_amount || 0) || 10;
          try {
            let okInc = await sbRpc(context, 'increment_wallet_balance', {
              target_profile_id: profileId, add_amount: amount
            });
            if (!okInc) okInc = await sbWalletFallback(context, profileId, amount);
            walletUpdated = !!okInc;

            const c = await ensureActivated(context, profileId, amount);
            activation = (c >= 2);
          } catch(_act) {}
        }
      }
    } catch(_err) {}

    return json(200, {
      ok: true, received: true,
      sig_ok: sigOk,
      payment_id: paymentId, order_id: orderId,
      payment_status: payStatus, is_paid: isPaid,
      profile_id: profileId, kind: kind,
      amount: amountPaid || amountQs,
      activation: activation,
      wallet_updated: walletUpdated,
      tx_matched: txMatched,
      profile_resolved_via_order_id: !!(profilePartial8 || (profileId && !url.searchParams.get('profile_id')))
    });
  } catch(err) {
    try {
      await sbInsertWebhook(context, {
        payment_id: null, order_id: null,
        payment_status: null,
        request_ip: null, sig_header: null, sig_validated: false,
        order_description: null, raw_body: null, profile_id: null,
        error_message: 'internal: ' + String((err && (err.message || String(err))) || String(err)).slice(0, 500),
        created_at: new Date().toISOString()
      });
    } catch(_) {}
    return json(500, { ok: false, error: 'internal_error', message: (err && (err.message || String(err))) || String(err) });
  }
}

export async function onRequest(context) {
  try {
    const req = context && context.request;
    const m = (req && (req.method || 'GET') || 'GET').toUpperCase();
    if (m === 'OPTIONS') { try { return new Response(null, { status: 204, headers: corsHeaders() }); } catch(_) { return new Response(null, { status: 204 }); } }
    if (m !== 'POST') return json(405, { ok: false, error: 'method_not_allowed', method: m });
    try { return await doPost(context); }
    catch (innerErr) { try { return json(500, { ok: false, error: 'doPost_error', message: String((innerErr && (innerErr.message || String(innerErr))) || String(innerErr)) }); } catch(_) { return new Response('{"ok":false,"error":"doPost_fail"}', { status: 500, headers: { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*' } }); } }
  } catch(outerErr) {
    try { return new Response(JSON.stringify({ ok: false, error: 'fatal', message: String((outerErr && outerErr.message) || outerErr) }), { status: 500, headers: corsHeaders() }); }
    catch(_) { return new Response('{"ok":false,"error":"fatal"}', { status: 500, headers: { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*' } }); }
  }
}

export async function onRequestOptions(context) { try { return new Response(null, { status: 204, headers: corsHeaders() }); } catch(_){ return new Response(null,{status:204});} }
export async function onRequestPost(context) { try { return onRequest(context); } catch(e){ try{ return json(500,{ok:false,error:String(e.message||e)});}catch(_){return new Response('err',{status:500});} } }

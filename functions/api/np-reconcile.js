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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nowpayments-sig, x-admin-key',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (extra) for (const k of Object.keys(extra)) base[k] = extra[k];
  return base;
}

function json(status, body) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsHeaders() });
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

function isPaidStatus(s) {
  const st = String(s || '').toLowerCase().trim();
  if (!st) return false;
  const finalStates = ['finished','confirmed','completed','success','partially_paid','wrong_asset','paid','payment_received','settled'];
  if (finalStates.indexOf(st) >= 0) return true;
  return /(paid|finish|confirm|complete|success|settle|wrong.?asset|received)/i.test(st);
}

function isFailedStatus(s) {
  const st = String(s || '').toLowerCase().trim();
  return ['failed','expired','refunded','rejected','cancelled','canceled','timeout','time_out'].indexOf(st) >= 0;
}

async function sbGet(c, pathAndQs) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + pathAndQs) : (base + '/' + pathAndQs));
    const r = await fetch(url, { method: 'GET', headers: sbHeaders(c) });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : [];
  } catch(_) { return []; }
}

async function sbPatch(c, pathAndQs, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + pathAndQs) : (base + '/' + pathAndQs));
    const r = await fetch(url, { method: 'PATCH', headers: sbHeaders(c), body: JSON.stringify(patch || {}) });
    if (r.ok) return true;
    try {
      const t = await r.text();
      if (/42703|column .* of relation .* does not exist/i.test(t)) return { missing: true, text: t };
    } catch(_) {}
    return false;
  } catch(_) { return false; }
}

async function npGetPayment(c, paymentId) {
  if (!paymentId) return null;
  const NP_API_URL = getEnv(c, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
  const NP_API_KEY = getEnv(c, 'NOWPAYMENTS_API_KEY', '');
  if (!NP_API_KEY) return null;
  try {
    const u = NP_API_URL.endsWith('/') ? (NP_API_URL + 'payment/' + encodeURIComponent(paymentId)) : (NP_API_URL + '/payment/' + encodeURIComponent(paymentId));
    const r = await fetch(u, {
      method: 'GET',
      headers: { 'x-api-key': NP_API_KEY, 'User-Agent': 'fourhash.app-reconcile/1.0' }
    });
    const txt = await r.text();
    let d = null; try { d = JSON.parse(txt); } catch(_) {}
    return { ok: r.ok, status: r.status, body: d, raw: (typeof txt === 'string' ? txt.slice(0,1200) : null) };
  } catch(err) {
    return { ok: false, error: (err && err.message) || String(err), status: 0, body: null };
  }
}

async function sbWalletFallback(c, profileId, amount) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const now = new Date().toISOString();
    const H = sbHeaders(c);
    const list = await sbGet(c, 'rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=id,available_balance,total_deposited&limit=1');
    if (Array.isArray(list) && list.length && list[0].id) {
      const curAv = Number(list[0].available_balance || 0);
      const curTot = Number(list[0].total_deposited || 0);
      const url = base + '/rest/v1/wallets?id=eq.' + encodeURIComponent(list[0].id);
      const r = await fetch(url, {
        method: 'PATCH', headers: H,
        body: JSON.stringify({ available_balance: curAv + Number(amount || 0), total_deposited: curTot + Number(amount || 0), updated_at: now })
      });
      return r.ok;
    } else {
      const urlIns = base + '/rest/v1/wallets';
      const r = await fetch(urlIns, {
        method: 'POST', headers: H,
        body: JSON.stringify({ profile_id: profileId, available_balance: Number(amount || 0), total_deposited: Number(amount || 0), updated_at: now, created_at: now })
      });
      if (!r.ok) {
        try {
          const t = await r.text();
          if (/42703|column .* of relation .*wallets.* does not exist/i.test(t)) {
            const mini = { profile_id: profileId, available_balance: Number(amount || 0), total_deposited: Number(amount || 0) };
            const r2 = await fetch(urlIns, { method: 'POST', headers: H, body: JSON.stringify(mini) });
            return r2.ok;
          }
        } catch(_) {}
      }
      return r.ok;
    }
  } catch(_) { return false; }
}

async function sbRpcIncrement(c, profileId, amount) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = base + '/rest/v1/rpc/increment_wallet_balance';
    const r = await fetch(url, {
      method: 'POST',
      headers: sbHeaders(c),
      body: JSON.stringify({ target_profile_id: profileId, add_amount: Number(amount || 0) })
    });
    return r.ok;
  } catch(_) { return false; }
}

async function sbInsertPositionIfMissing(c, profileId) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const H = sbHeaders(c);
    const list = await sbGet(c, 'rest/v1/linear_network?profile_id=eq.' + encodeURIComponent(profileId) + '&level_number=eq.1&select=id&limit=1');
    if (Array.isArray(list) && list.length) return true;
    let seat = 1;
    try {
      const top = await sbGet(c, 'rest/v1/linear_network?level_number=eq.1&select=seat_number&order=seat_number.desc&limit=1');
      if (Array.isArray(top) && top.length && Number(top[0].seat_number) >= 1) seat = Number(top[0].seat_number) + 1;
    } catch(_) {}
    const url = base + '/rest/v1/linear_network';
    const now = new Date().toISOString();
    const p = { profile_id: profileId, level_number: 1, seat_number: seat, row_number: 1, filled_at: now };
    const r = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(p) });
    if (r.ok) return true;
    try {
      const t = await r.text();
      if (/42703|column .* of relation .*linear_network.* does not exist|unique constraint/i.test(t)) {
        const mini = { profile_id: profileId, level_number: 1, seat_number: seat };
        const r2 = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(mini) });
        return r2.ok;
      }
    } catch(_) {}
    return false;
  } catch(_) { return false; }
}

async function activateProfile(c, profileId, amount) {
  const result = { profile: false, wallet: false, position: false };
  if (!profileId || profileId.length < 10) return result;
  const now = new Date().toISOString();
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const urlProfile = base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId);
    const H = sbHeaders(c);
    const patchProfile = { status: 'active', level_number: 1, activated_at: now, updated_at: now, last_active_at: now };
    const r1 = await fetch(urlProfile, { method: 'PATCH', headers: H, body: JSON.stringify(patchProfile) });
    if (!r1.ok) {
      try {
        const t = await r1.text();
        if (/42703|column .* of relation .*profiles.* does not exist/i.test(t)) {
          const mini = { status: 'active', level_number: 1, updated_at: now };
          const r1b = await fetch(urlProfile, { method: 'PATCH', headers: H, body: JSON.stringify(mini) });
          result.profile = r1b.ok;
        } else {
          result.profile = false;
        }
      } catch(_) { result.profile = false; }
    } else {
      result.profile = true;
    }
  } catch(_) {}
  try {
    const amt = Number(amount || 0) > 0 ? Number(amount) : 10;
    const ok = await sbRpcIncrement(c, profileId, amt);
    if (ok) result.wallet = true;
    else result.wallet = await sbWalletFallback(c, profileId, amt);
  } catch(_) {}
  try { result.position = Boolean(await sbInsertPositionIfMissing(c, profileId)); } catch(_) {}
  return result;
}

export async function onRequest(context) {
  const m = (context.request.method || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
  if (m !== 'POST' && m !== 'GET') return json(405, { ok: false, error: 'method_not_allowed' });
  return doReconcile(context);
}

export async function onRequestPost(context) { return doReconcile(context); }
export async function onRequestGet(context)  { return doReconcile(context); }
export async function onRequestOptions(context) { return new Response(null, { status: 204, headers: corsHeaders() }); }

async function doReconcile(context) {
  const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');
  const SUPA_KEY = getEnv(context, 'SUPABASE_SERVICE_ROLE_KEY', '');
  if (!NP_API_KEY || !SUPA_KEY) return json(503, { ok: false, error: 'missing_secrets', msg: 'NOWPAYMENTS_API_KEY ou SUPABASE_SERVICE_ROLE_KEY não configurados em Secrets Cloudflare Pages.' });

  const nowIso = new Date().toISOString();
  const twoDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString();
  const minAgeMs = 1000 * 30;
  const result = { ok: true, started_at: nowIso, total_scanned: 0, checked: 0, activated: 0, already_confirmed: 0, failed_or_expired: 0, still_pending: 0, items: [] };

  try {
    const rows = await sbGet(context, 'rest/v1/transactions?select=id,profile_id,amount,nowpayments_id,tx_hash,status,kind,created_at,currency,network&status=in.(pending,created,waiting)&kind=in.(deposit,adjustment_credit)&created_at=gt.' + encodeURIComponent(twoDaysAgo) + '&order=created_at.desc&limit=100');
    result.total_scanned = Array.isArray(rows) ? rows.length : 0;
    if (!Array.isArray(rows) || rows.length === 0) return json(200, Object.assign(result, { msg: 'Nenhum pagamento pendente para reconciliar.' }));

    const seen = new Set();
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r) continue;
      const ageMs = Date.now() - new Date(r.created_at || nowIso).getTime();
      if (ageMs < minAgeMs) { result.still_pending++; continue; }

      const candidates = [String(r.nowpayments_id || ''), String(r.tx_hash || '')].map(s => s.trim()).filter(s => /^\d{6,20}$/.test(s));
      if (!candidates.length) { result.still_pending++; continue; }
      const paymentId = candidates[0];
      if (seen.has(paymentId)) continue;
      seen.add(paymentId);

      result.checked++;
      const info = { id: r.id, profile_id: r.profile_id, payment_id: paymentId, amount: r.amount };
      const np = await npGetPayment(context, paymentId);
      info.np_status = (np && np.body && typeof np.body.payment_status === 'string') ? np.body.payment_status : null;
      info.np_ok = np && !!np.ok;

      if (!np || !np.ok || !np.body) {
        info.result = 'gateway_error';
        info.error = np ? (np.error || 'status=' + np.status) : 'network';
        result.items.push(info);
        continue;
      }

      const status = String(np.body.payment_status || np.body.status || '').toLowerCase().trim();
      info.payment_status = status;
      const parent = String(np.body.parent_payment_id || np.body.original_payment_id || '').trim() || null;
      if (parent) info.parent_payment_id = parent;
      const amt = Number(np.body.price_amount || np.body.pay_amount || r.amount || 10) || 10;

      if (isPaidStatus(status)) {
        let netw = null;
        try {
          const netRaw = String(np.body.network || np.body.payin_network || np.body.pay_network || r.network || '').toLowerCase();
          if (/trc|tron|trx/.test(netRaw)) netw = 'TRC20';
          else if (/erc|ethereum|eth/.test(netRaw)) netw = 'ERC20';
          else if (/bep|bsc|binance/.test(netRaw)) netw = 'BEP20';
        } catch(_) {}
        const patchTx = {
          status: 'confirmed',
          confirmed_at: (np.body.updated_at || np.body.created_at || nowIso),
          nowpayments_status: status,
          currency: 'USDT'
        };
        if (netw) patchTx.network = netw;
        if (np.body.payin_hash) patchTx.tx_hash = String(np.body.payin_hash);
        try {
          const txidAll = [paymentId, parent].filter(Boolean);
          const qParts = [];
          txidAll.forEach(p => { qParts.push('nowpayments_id=eq.' + encodeURIComponent(p)); qParts.push('tx_hash=eq.' + encodeURIComponent(p)); });
          if (r.id) qParts.push('id=eq.' + encodeURIComponent(r.id));
          if (r.profile_id) qParts.push('profile_id=eq.' + encodeURIComponent(r.profile_id));
          const q = qParts.slice(0, 8).join(',');
          await sbPatch(context, 'rest/v1/transactions?' + q, patchTx);
        } catch(_) {}
        if (r.profile_id) {
          try {
            const act = await activateProfile(context, r.profile_id, amt);
            info.activation = act;
            if (act.profile) result.activated++;
          } catch(_eAct) { info.error = 'activation: ' + String(_eAct && _eAct.message || _eAct); }
        }
        info.result = 'activated_or_confirmed';
        result.items.push(info);
        continue;
      }

      if (isFailedStatus(status)) {
        try {
          await sbPatch(context, 'rest/v1/transactions?id=eq.' + encodeURIComponent(r.id), { status: 'failed', nowpayments_status: status, updated_at: nowIso });
        } catch(_) {}
        result.failed_or_expired++;
        info.result = 'failed';
        result.items.push(info);
        continue;
      }

      result.still_pending++;
      info.result = 'still_waiting';
      result.items.push(info);
    }

    result.finished_at = new Date().toISOString();
    return json(200, result);
  } catch(err) {
    return json(500, { ok: false, error: 'internal', message: (err && (err.message || String(err))) || String(err), at: new Date().toISOString() });
  }
}

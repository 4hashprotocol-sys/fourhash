/* ==========================================================
   /api/np-cron-ping
   Cloudflare Pages Cron Trigger endpoint.
   Chamado AUTOMATICAMENTE a cada 1 minuto via Pages Cron Trigger
   (ou pode ser chamado manualmente via HTTP GET).

   Reusa INTEGRALMENTE a função doReconcile() do np-reconcile.js
   para não duplicar lógica de ativação.
   ========================================================== */

export async function onRequest(context) {
  const m = (context.request.method || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsH() });
  if (m !== 'GET' && m !== 'POST' && m !== 'HEAD') return json(405, { ok: false, error: 'method_not_allowed' });

  let auth = false;
  try {
    if (context && context.request && context.request.cf && context.request.cf.cron) {
      auth = true;
    }
  } catch(_) {}
  if (!auth) {
    try {
      const u = new URL(context.request.url);
      const k = String(u.searchParams.get('k') || '').trim();
      const SECRET = getE(context, 'NP_CRON_SECRET') || getE(context, 'NOWPAYMENTS_IPN_SECRET') || '';
      if (SECRET && k && k === SECRET) auth = true;
      const h = String(context.request.headers.get('x-admin-key') || context.request.headers.get('Authorization') || '').replace('Bearer ','').trim();
      if (SECRET && h && h === SECRET) auth = true;
    } catch(_) {}
  }
  if (!auth) return json(403, { ok: false, error: 'forbidden', hint: 'Chame via Pages Cron Trigger ou ?k=NP_CRON_SECRET ou x-admin-key' });

  try {
    const r = await internalReconcile(context);
    return json(200, Object.assign({ ok: true, via: 'np-cron-ping' }, r || {}));
  } catch(err) {
    return json(500, { ok: false, error: 'internal', message: String((err && (err.message || String(err))) || String(err)) });
  }
}

export async function onRequestGet(context)  { return onRequest(context); }
export async function onRequestPost(context) { return onRequest(context); }
export async function onRequestOptions(context) { return new Response(null, { status: 204, headers: corsH() }); }

async function internalReconcile(context) {
  const getEnv = (c, key, fallback) => {
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
  };
  const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');
  const SUPA_KEY = getEnv(context, 'SUPABASE_SERVICE_ROLE_KEY', '');
  if (!NP_API_KEY || !SUPA_KEY) return { ok: false, error: 'missing_secrets' };
  const nowIso = new Date().toISOString();
  const twoDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString();
  const minAgeMs = 1000 * 30;
  const result = { ok: true, cron: true, started_at: nowIso, total_scanned: 0, checked: 0, activated: 0, already_confirmed: 0, failed_or_expired: 0, still_pending: 0, items: [] };
  try {
    const base = getEnv(context, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const H = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' };
    const g = async (p) => { try { const r = await fetch(base + (base.endsWith('/') ? p.slice(1) : '/' + p), { method: 'GET', headers: H }); if (!r.ok) return []; const d = await r.json(); return Array.isArray(d) ? d : []; } catch(_) { return []; } };
    const p = async (pt, body) => { try { const r = await fetch(base + (base.endsWith('/') ? pt.slice(1) : '/' + pt), { method: 'PATCH', headers: H, body: JSON.stringify(body || {}) }); return r.ok; } catch(_) { return false; } };
    const npGet = async (pid) => {
      if (!pid) return null;
      const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
      const u = NP_API_URL.endsWith('/') ? (NP_API_URL + 'payment/' + encodeURIComponent(pid)) : (NP_API_URL + '/payment/' + encodeURIComponent(pid));
      try {
        const r = await fetch(u, { method: 'GET', headers: { 'x-api-key': NP_API_KEY, 'User-Agent': 'fourhash.app-cron/1.0' } });
        let d = null; try { d = await r.json(); } catch(_) {}
        return { ok: r.ok, status: r.status, body: d };
      } catch(e) { return { ok: false, status: 0, body: null, error: (e && e.message) || String(e) }; }
    };
    const activate = async (profileId, amount) => {
      const res = { profile: false, wallet: false, position: false };
      if (!profileId || String(profileId).length < 10) return res;
      const now = new Date().toISOString();
      try {
        const r1 = await p('rest/v1/profiles?id=eq.' + encodeURIComponent(profileId), { status: 'active', level_number: 1, activated_at: now, updated_at: now, last_active_at: now });
        res.profile = !!r1;
      } catch(_) {}
      try {
        const rows = await g('rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=id,available_balance,total_deposited&limit=1');
        const amt = Number(amount || 0) > 0 ? Number(amount) : 10;
        if (Array.isArray(rows) && rows.length && rows[0].id) {
          const curAv = Number(rows[0].available_balance || 0);
          const curTot = Number(rows[0].total_deposited || 0);
          const r2 = await p('rest/v1/wallets?id=eq.' + encodeURIComponent(rows[0].id), { available_balance: curAv + amt, total_deposited: curTot + amt, updated_at: now });
          res.wallet = !!r2;
        } else {
          try {
            const ur = base + '/rest/v1/wallets';
            const r2 = await fetch(ur, { method: 'POST', headers: H, body: JSON.stringify({ profile_id: profileId, available_balance: amt, total_deposited: amt, pending_balance: 0, frozen_balance: 0, total_withdrawn: 0, total_bonus_team: 0, total_bonus_matrix: 0, updated_at: now, created_at: now }) });
            res.wallet = r2.ok;
          } catch(_) {}
        }
      } catch(_) {}
      try {
        const posRows = await g('rest/v1/linear_network?profile_id=eq.' + encodeURIComponent(profileId) + '&level_number=eq.1&select=id&limit=1');
        if (!Array.isArray(posRows) || posRows.length === 0) {
          const tops = await g('rest/v1/linear_network?level_number=eq.1&select=seat_number&order=seat_number.desc&limit=1');
          const seat = (Array.isArray(tops) && tops.length && Number(tops[0].seat_number) >= 1) ? Number(tops[0].seat_number) + 1 : 1;
          try {
            const ur = base + '/rest/v1/linear_network';
            const ins = await fetch(ur, { method: 'POST', headers: H, body: JSON.stringify({ profile_id: profileId, level_number: 1, seat_number: seat, row_number: 1, filled_at: now }) });
            res.position = ins.ok;
          } catch(_) {}
        } else {
          res.position = true;
        }
      } catch(_) {}
      return res;
    };
    const isPaid = (s) => {
      const st = String(s || '').toLowerCase().trim();
      if (!st) return false;
      if (['finished','confirmed','completed','success','partially_paid','wrong_asset','paid','payment_received','settled'].indexOf(st) >= 0) return true;
      return /(paid|finish|confirm|complete|success|settle|wrong.?asset|received)/i.test(st);
    };
    const isFail = (s) => ['failed','expired','refunded','rejected','cancelled','canceled','timeout','time_out'].indexOf(String(s || '').toLowerCase().trim()) >= 0;

    const rows = await g('rest/v1/transactions?select=id,profile_id,amount,nowpayments_id,tx_hash,status,kind,created_at,currency,network&status=in.(pending,created,waiting)&kind=in.(deposit,adjustment_credit)&created_at=gt.' + encodeURIComponent(twoDaysAgo) + '&order=created_at.desc&limit=100');
    result.total_scanned = Array.isArray(rows) ? rows.length : 0;
    if (!Array.isArray(rows) || rows.length === 0) { result.msg = 'Nenhum pagamento pendente.'; return result; }
    const seen = new Set();
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]; if (!r) continue;
      const ageMs = Date.now() - new Date(r.created_at || nowIso).getTime();
      if (ageMs < minAgeMs) { result.still_pending++; continue; }
      const cands = [String(r.nowpayments_id || ''), String(r.tx_hash || '')].map(s => s.trim()).filter(s => /^\d{6,20}$/.test(s));
      if (!cands.length) { result.still_pending++; continue; }
      const paymentId = cands[0]; if (seen.has(paymentId)) continue; seen.add(paymentId);
      result.checked++;
      const info = { id: r.id, profile_id: r.profile_id, payment_id };
      const np = await npGet(paymentId);
      info.np_ok = np && !!np.ok;
      const st = String(((np && np.body) ? (np.body.payment_status || np.body.status || '') : '')).toLowerCase().trim();
      info.payment_status = st || null;
      const parent = (np && np.body) ? String(np.body.parent_payment_id || np.body.original_payment_id || '').trim() : null;
      if (parent) info.parent = parent;
      const amt = Number(((np && np.body) ? (np.body.price_amount || np.body.pay_amount || r.amount || 10) : 10)) || 10;
      if (!np || !np.ok || !np.body) { info.result = 'gateway_error'; result.items.push(info); continue; }
      if (isPaid(st)) {
        let netw = null;
        try {
          const nraw = String(((np && np.body) ? (np.body.network || np.body.payin_network || np.body.pay_network || r.network || '') : '')).toLowerCase();
          if (/trc|tron|trx/.test(nraw)) netw = 'TRC20';
          else if (/erc|ethereum|eth/.test(nraw)) netw = 'ERC20';
          else if (/bep|bsc|binance/.test(nraw)) netw = 'BEP20';
        } catch(_) {}
        const patch = { status: 'confirmed', confirmed_at: (np.body.updated_at || np.body.created_at || nowIso), nowpayments_status: st, currency: 'USDT' };
        if (netw) patch.network = netw;
        if (np.body.payin_hash) patch.tx_hash = String(np.body.payin_hash);
        try {
          const all = [paymentId, parent].filter(Boolean);
          const q = [];
          all.forEach(x => { q.push('nowpayments_id=eq.' + encodeURIComponent(x)); q.push('tx_hash=eq.' + encodeURIComponent(x)); });
          if (r.id) q.push('id=eq.' + encodeURIComponent(r.id));
          if (r.profile_id) q.push('profile_id=eq.' + encodeURIComponent(r.profile_id));
          await p('rest/v1/transactions?' + q.slice(0, 8).join(','), patch);
        } catch(_) {}
        if (r.profile_id) {
          try {
            const act = await activate(r.profile_id, amt);
            info.activation = act;
            if (act.profile) result.activated++;
          } catch(e) { info.error = 'activation: ' + String((e && e.message) || e); }
        }
        info.result = 'activated_or_confirmed';
      } else if (isFail(st)) {
        try { await p('rest/v1/transactions?id=eq.' + encodeURIComponent(r.id), { status: 'failed', nowpayments_status: st, updated_at: nowIso }); } catch(_) {}
        result.failed_or_expired++; info.result = 'failed';
      } else {
        result.still_pending++; info.result = 'still_waiting';
      }
      result.items.push(info);
    }
    result.finished_at = new Date().toISOString();
    return result;
  } catch(err) {
    return { ok: false, error: 'internal', message: String((err && (err.message || String(err))) || String(err)) };
  }
}

function corsH(extra) {
  const base = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key, x-nowpayments-sig', 'Content-Type': 'application/json; charset=utf-8' };
  if (extra) for (const k of Object.keys(extra)) base[k] = extra[k];
  return base;
}
function json(status, body) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsH() });
}
function getE(c, key, fallback) {
  try {
    const e = c && c.env;
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

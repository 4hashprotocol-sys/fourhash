// =============================================================================
//  NowPayments WATCHDOG Pages Function — 0 intervenção humana.
//  Endpoint: /api/np-watchdog
//  Autenticação (header X-NP-Cron-Secret) = NOWPAYMENTS_IPN_SECRET (env NP_CRON_SECRET.)
//
//  Usar:
//   · Manual:  POST { "secret": "...", "payment_ids": ["4551858701","5465113916"] }
//   · Auto:    cron-job.org a cada 5 min → auth OK → scan pendentes/partially_paid
//              < 24h created; se NP já marcou finished/partially_paid → credita.
// =============================================================================

function corsHeaders(extra) {
  const base = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-NP-Cron-Secret, x-nowpayments-sig',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (extra) for (const k of Object.keys(extra)) base[k] = extra[k];
  return base;
}
function json(status, body) { return new Response(JSON.stringify(body || {}), { status, headers: corsHeaders() }); }
function getEnv(c, key, fallback) {
  try { const e = c && c.env; if (e) {
    if (typeof e.get === 'function') { try { const v = e.get(key); if (typeof v === 'string' && v !== '') return v; } catch(_) {} }
    const v = e[key]; if (typeof v === 'string' && v !== '') return v;
  } } catch(_) {}
  try { const v = globalThis.process && globalThis.process.env ? globalThis.process.env[key] : undefined; if (typeof v === 'string' && v !== '') return v; } catch(_) {}
  return fallback || '';
}
function sbHeaders(c) {
  const k = getEnv(c, 'SUPABASE_SERVICE_ROLE_KEY') || getEnv(c, 'SUPABASE_ANON_KEY') || '';
  return { 'apikey': k, 'Authorization': 'Bearer ' + k, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
}
function isPaidFinal(st) {
  const s = String(st || '').toLowerCase().trim();
  return ['finished','confirmed','completed','success','paid','payment_received','settled','partially_paid','wrong_asset'].indexOf(s) >= 0
      || /(paid|finish|confirm|complete|success|settle|received)/i.test(s);
}

async function sbGet(c, table, q) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? base + 'rest/v1/' + table + '?' + q : base + '/rest/v1/' + table + '?' + q);
    const r = await fetch(url, { method: 'GET', headers: sbHeaders(c) });
    if (!r.ok) return [];
    const d = await r.json(); return Array.isArray(d) ? d : [];
  } catch(_) { return []; }
}
async function sbPatch(c, table, q, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? base + 'rest/v1/' + table + '?' + q : base + '/rest/v1/' + table + '?' + q);
    const r = await fetch(url, { method: 'PATCH', headers: sbHeaders(c), body: JSON.stringify(patch || {}) });
    return r.ok;
  } catch(_) { return false; }
}
async function sbPost(c, table, row) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? base + 'rest/v1/' + table : base + '/rest/v1/' + table);
    const r = await fetch(url, { method: 'POST',
      headers: Object.assign({}, sbHeaders(c), { 'Prefer': 'return=representation,resolution=ignore-duplicates' }),
      body: JSON.stringify(row || {}) });
    if (!r.ok) return false;
    try { const d = await r.json(); return (Array.isArray(d) && d.length) ? d[0] : (d && d.id ? d : true); } catch(_) { return true; }
  } catch(_) { return false; }
}

async function ensureActivated(c, profileId, amount) {
  if (!profileId || profileId.length < 10) return 0;
  let changes = 0; const now = new Date().toISOString();
  try {
    const listP = await sbGet(c, 'profiles', 'id=eq.' + encodeURIComponent(profileId) + '&select=id,status,activated_at,level_number,upline_id&limit=1');
    const cur = (Array.isArray(listP) && listP.length) ? listP[0] : null;
    const patch = { status: 'active', level_number: 1, updated_at: now };
    if (!cur || String(cur.status || '').toLowerCase() !== 'active') patch.activated_at = cur && cur.activated_at ? cur.activated_at : now;
    else patch.activated_at = cur && cur.activated_at ? cur.activated_at : now;
    if (await sbPatch(c, 'profiles', 'id=eq.' + encodeURIComponent(profileId), patch)) changes++;
  } catch(_) {}

  try {
    const listW = await sbGet(c, 'wallets', 'profile_id=eq.' + encodeURIComponent(profileId) + '&select=id,profile_id,total_deposited,available_balance,total_bonus_team,total_bonus_matrix,total_withdrawn&limit=1');
    const amt = Number(amount || 0) > 0 ? Number(amount) : 10;
    if (Array.isArray(listW) && listW.length && listW[0].profile_id) {
      const tot = Number(listW[0].total_deposited || 0);
      if (tot < amt) { if (await sbPatch(c, 'wallets', 'profile_id=eq.' + encodeURIComponent(profileId), { total_deposited: amt, updated_at: now })) changes++; }
      else changes++;
    } else {
      if (await sbPost(c, 'wallets', { profile_id: profileId, total_deposited: amt, available_balance: 0, pending_balance: 0, frozen_balance: 0, total_withdrawn: 0, total_bonus_team: 0, total_bonus_matrix: 0, created_at: now, updated_at: now })) changes++;
    }
  } catch(_) {}

  try {
    const lnExist = await sbGet(c, 'linear_network', 'profile_id=eq.' + encodeURIComponent(profileId) + '&select=profile_id&limit=1');
    if (!(Array.isArray(lnExist) && lnExist.length && lnExist[0])) {
      if (await sbPost(c, 'linear_network', { profile_id: profileId, level_number: 1, seat_number: 1, row_number: 1, filled_at: now, filled_by: null, commission_paid: false, commission_tx: null })) changes++;
    } else changes++;
  } catch(_) {}
  return changes;
}

async function npGetPayment(c, paymentId) {
  try {
    if (!paymentId) return null;
    const apiKey = getEnv(c, 'NOWPAYMENTS_API_KEY', '');
    const base = getEnv(c, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
    const url = (base.endsWith('/') ? base + 'payment/' + String(paymentId) : base + '/payment/' + String(paymentId));
    const r = await fetch(url, { method: 'GET', headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' } });
    if (!r.ok) return null;
    return await r.json();
  } catch(_) { return null; }
}

function extractProfileFromOrder(orderId) {
  try {
    const s = String(orderId || '').trim(); if (!s) return null;
    const mFull = s.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
    if (mFull) return { id: mFull[1], partial: null };
    const m8 = s.match(/4H-[-_a-zA-Z0-9]+-([0-9a-fA-F]{8})-/);
    if (m8) return { id: null, partial: m8[1] };
    const m8b = s.match(/activation-([0-9a-fA-F]{8})-/i);
    if (m8b) return { id: null, partial: m8b[1] };
  } catch(_) {}
  return null;
}

async function resolveProfileId(c, info) {
  try {
    if (info.id && info.id.length >= 32) return info.id;
    if (info.partial) {
      const rows = await sbGet(c, 'profiles', 'id=like.' + encodeURIComponent(info.partial + '%') + '&select=id,username&limit=50');
      if (Array.isArray(rows) && rows.length === 1 && rows[0].id) return rows[0].id;
      if (Array.isArray(rows) && rows.length > 1) {
        for (let i=0; i<rows.length; i++) { if (String(rows[i].id || '').toLowerCase().startsWith(String(info.partial).toLowerCase())) return rows[i].id; }
        return rows[0].id;
      }
    }
  } catch(_) {}
  return null;
}

async function processPaymentWatchdog(c, paymentId, opts) {
  const dry = !!(opts && opts.dry);
  const np = await npGetPayment(c, paymentId);
  if (!np || typeof np !== 'object') { return { payment_id: paymentId, ok: false, skipped: true, reason: 'np_api_unreachable_or_unknown' }; }
  const npStatus = String(np.payment_status || np.status || '').toLowerCase();
  const orderId = String(np.order_id || np.orderId || '');
  const priceAmount = Number(np.price_amount || 0);
  const payAmount = Number(np.pay_amount || np.outcome_amount || np.actually_paid || 0);
  const isPaidFinal = isPaidFinal(npStatus);

  const expectedUsd = (priceAmount && priceAmount > 0) ? priceAmount : (orderId && /^4H-(activation|deposit)-/.test(orderId) ? 10 : 10);
  const minPct = (npStatus === 'partially_paid' || npStatus === 'wrong_asset') ? 0.93 : 0.985;
  const passes = isPaidFinal && (payAmount <= 0 || payAmount >= Number((expectedUsd * minPct).toFixed(6)));

  let profileId = null;
  const info = extractProfileFromOrder(orderId);
  if (info) profileId = await resolveProfileId(c, info);

  if (dry) { return { payment_id: paymentId, ok: true, dry: true, np_status: npStatus, is_paid_final: isPaidFinal, expected_usd: expectedUsd, paid: payAmount, min_pct: minPct, passes_threshold: passes, order_id: orderId, profile_resolved: !!profileId, profile_id: profileId || null }; }
  if (!passes) return { payment_id: paymentId, ok: false, skipped: true, reason: 'np_not_final_yet_or_below_threshold', np_status: npStatus, paid: payAmount, min_pct: minPct, expected_usd: expectedUsd, order_id: orderId };
  if (!profileId) return { payment_id: paymentId, ok: false, skipped: true, reason: 'profile_not_resolved_from_order_id', order_id: orderId, np_status: npStatus };

  const nowIso = new Date().toISOString();
  let txMatched = false;
  let foundTxs = await sbGet(c, 'transactions',
    'or=(nowpayments_id.eq.' + encodeURIComponent(String(paymentId)) + ',tx_hash.eq.' + encodeURIComponent(String(paymentId)) + (orderId ? (',metadata->>order_id.eq.' + encodeURIComponent(orderId)) : '') + ')' +
    (profileId ? '&and=(profile_id.eq.' + encodeURIComponent(profileId) + ')' : '') +
    '&select=id,profile_id,amount,status,nowpayments_id&limit=10');
  if (Array.isArray(foundTxs) && foundTxs.length) {
    const txRow = foundTxs[0];
    const patchTx = { status: 'confirmed', confirmed_at: nowIso, nowpayments_status: npStatus, note: (txRow.note ? String(txRow.note).slice(0,200) : '') + ' [watchdog auto resolved ' + nowIso.slice(0,16).replace('T',' ') + ']', updated_at: nowIso };
    if (await sbPatch(c, 'transactions', 'id=eq.' + encodeURIComponent(String(txRow.id)), patchTx)) { txMatched = true; profileId = profileId || String(txRow.profile_id); }
  }
  if (!txMatched) {
    const okIns = await sbPost(c, 'transactions', {
      profile_id: profileId,
      kind: 'deposit',
      currency: String(np.price_currency || np.pay_currency || 'USDT').toUpperCase() || 'USDT',
      network: (np.network || np.payin_network || 'BSC').toString().toUpperCase().slice(0, 32),
      amount: Number(expectedUsd || 10) || 10,
      fee: 0,
      status: 'confirmed',
      confirmations: 12,
      confirmed_at: nowIso,
      nowpayments_id: String(paymentId),
      nowpayments_status: npStatus,
      tx_hash: np.payin_hash ? String(np.payin_hash) : String(paymentId),
      from_address: np.pay_address ? String(np.pay_address) : null,
      note: 'Watchdog auto resolved NowPayments ' + npStatus + '. order_id=' + String(orderId).slice(0,80),
      metadata: { gateway: { provider: 'nowpayments', payment_id: String(paymentId), order_id: orderId || null, watchdog: true, np_raw: np, processed_at: nowIso, threshold_pct: minPct } },
      created_at: nowIso, updated_at: nowIso
    });
    if (okIns) txMatched = true;
  }

  // wallets total_deposited + ensure activated
  try {
    const listW = await sbGet(c, 'wallets', 'profile_id=eq.' + encodeURIComponent(profileId) + '&select=id,profile_id,total_deposited&limit=1');
    const amt = Number(expectedUsd || 10) || 10;
    if (Array.isArray(listW) && listW.length && listW[0].profile_id) {
      const curT = Number(listW[0].total_deposited || 0);
      if (curT < amt) await sbPatch(c, 'wallets', 'profile_id=eq.' + encodeURIComponent(profileId), { total_deposited: amt, updated_at: nowIso });
    } else {
      await sbPost(c, 'wallets', { profile_id: profileId, available_balance: 0, total_deposited: amt, total_withdrawn: 0, total_bonus_team: 0, total_bonus_matrix: 0, pending_balance: 0, frozen_balance: 0, created_at: nowIso, updated_at: nowIso });
    }
  } catch(_) {}

  const activatedChanges = await ensureActivated(c, profileId, expectedUsd || 10);

  return { payment_id: paymentId, ok: true, processed: true, tx_matched: txMatched, activated_changes: activatedChanges, profile_id: profileId, np_status: npStatus, amount_expected: expectedUsd, amount_paid_np: payAmount, threshold_pct: minPct };
}

async function doPost(c, req) {
  const cronSecretHeader = (req.headers && (req.headers.get('X-NP-Cron-Secret') || req.headers.get('x-np-cron-secret') || req.headers.get('X-Cron-Secret'))) || '';
  let body = {}; try { body = await req.json(); } catch(_) { body = {}; }
  const bodySecret = body && typeof body === 'object' ? String(body.secret || body.cron_secret || body.x_np_cron_secret || '') : '';
  const querySecret = (req && req.url) ? (new URL(req.url, 'http://localhost').searchParams.get('secret') || '') : '';
  const expectedSecret = getEnv(c, 'NP_CRON_SECRET', '') || getEnv(c, 'NOWPAYMENTS_IPN_SECRET', '');
  const secret = cronSecretHeader || bodySecret || querySecret;
  if (!expectedSecret || secret !== expectedSecret) {
    return json(401, { ok: false, error: 'unauthorized', reason: 'secret_missing_or_invalid (X-NP-Cron-Secret header)' });
  }

  const paymentIds = Array.isArray(body && body.payment_ids) ? body.payment_ids.filter(Boolean) : [];
  const dry = !!(body && (body.dry === true || body.dry === 1 || body.dry === '1'));
  const scanLimit = Number(body && body.limit) || 100;
  const hoursLookback = Number(body && body.hours) || 24;

  const processed = [];
  const skipped = [];

  if (paymentIds.length > 0) {
    for (let i=0; i<paymentIds.length; i++) {
      try {
        const r = await processPaymentWatchdog(c, String(paymentIds[i]), { dry });
        (r.ok && r.processed) || (r.dry && r.passes_threshold) ? processed.push(r) : skipped.push(r);
      } catch(e) { skipped.push({ payment_id: String(paymentIds[i]), ok: false, skipped: true, reason: 'exception: ' + String((e && (e.message || String(e))) || '').slice(0,100) }); }
    }
  } else {
    const after = new Date(Date.now() - 1000 * 60 * 60 * hoursLookback).toISOString();
    const pendTx = await sbGet(c, 'transactions',
      'and=(or=(status.eq.pending,status.eq.created),created_at.gt.' + encodeURIComponent(after) + ')' +
      '&or=(nowpayments_status.eq.waiting,nowpayments_status.eq.partially_paid,nowpayments_status.eq.confirming,nowpayments_status.eq.pending,nowpayments_status.is.null)' +
      '&select=id,profile_id,nowpayments_id,amount,created_at,metadata,nowpayments_status,status' +
      '&order=created_at.desc&limit=' + encodeURIComponent(String(scanLimit)));
    const scanList = Array.isArray(pendTx) ? pendTx : [];

    const dedup = {}; const arr = [];
    for (let i=0; i<scanList.length; i++) { const pid = String(scanList[i].nowpayments_id || '').trim(); if (pid && pid.length > 4 && !dedup[pid]) { dedup[pid]=true; arr.push(pid); } }

    for (let i=0; i<arr.length; i++) {
      try {
        const r = await processPaymentWatchdog(c, arr[i], { dry });
        (r.ok && (r.processed || (r.dry && r.passes_threshold))) ? processed.push(r) : skipped.push(r);
      } catch(e) { skipped.push({ payment_id: arr[i], ok:false, skipped: true, reason: 'exception_watchdog: ' + String((e && (e.message || String(e))) || '').slice(0, 100) }); }
    }
  }

  return json(200, { ok: true, watchdog: true, dry_run: dry, ts: new Date().toISOString(),
    total_processed: processed.length, total_skipped: skipped.length, processed, skipped });
}

export async function onRequest(context) {
  try {
    const req = context && context.request;
    const m = ((req && (req.method || 'GET')) || 'GET').toUpperCase();
    if (m === 'OPTIONS') try { return new Response(null, { status: 204, headers: corsHeaders() }); } catch(_) { return new Response(null, { status: 204 }); }
    if (m !== 'POST' && m !== 'GET') return json(405, { ok: false, error: 'method_not_allowed', method: m });
    try { return await doPost(context, req); }
    catch (e) { return json(500, { ok: false, error: 'doPost_fail', message: String((e && (e.message || String(e))) || String(e)).slice(0,500) }); }
  } catch (outerErr) {
    try { return json(500, { ok: false, error: 'fatal', message: String((outerErr && (outerErr.message || String(outerErr))) || String(outerErr)).slice(0,500) }); }
    catch(_) { return new Response('{"ok":false,"error":"fatal"}', { status: 500, headers: corsHeaders() }); }
  }
}
export async function onRequestOptions(context) { try { return new Response(null, { status: 204, headers: corsHeaders() }); } catch(_){ return new Response(null, {status: 204});} }
export async function onRequestPost(context) { try { return onRequest(context); } catch(e){ try{ return json(500, { ok:false, error:String((e && (e.message||e))||e)}); } catch(_){ return new Response('err',{status:500});} } }
export async function onRequestGet(context)  { try { return onRequest(context); } catch(e){ try{ return json(500, { ok:false, error:String((e && (e.message||e))||e)}); } catch(_){ return new Response('err',{status:500});} } }

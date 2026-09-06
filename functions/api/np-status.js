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

export async function onRequest(context) {
  const r = context.request;
  const m = (r.method || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
  return onRequestAny(context, m);
}

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

async function onRequestAny(context, method) {
  const { request } = context;
  try {
    const u = new URL(request.url);
    const pid = String((u.searchParams.get('payment_id') || u.searchParams.get('id') || '') + '').trim();
    if (!pid) return json(400, { ok: false, error: 'id_required' });

    const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
    const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');
    if (!NP_API_KEY) return json(200, { ok: true, mode: 'simulated', payment_id: pid, payment_status: 'waiting', note: 'Configure NOWPAYMENTS_API_KEY.' });

    const url = NP_API_URL.endsWith('/') ? (NP_API_URL + 'payment/' + encodeURIComponent(pid)) : (NP_API_URL + '/payment/' + encodeURIComponent(pid));
    const r = await fetch(url, {
      method: 'GET',
      headers: { 'x-api-key': NP_API_KEY, 'Content-Type': 'application/json', 'User-Agent': 'fourhash.app/1.0' }
    });
    const txt = await r.text();
    let data; try { data = JSON.parse(txt); } catch(e) { data = { raw: txt }; }
    return json(r.ok ? 200 : 502, {
      ok: r.ok, status_code: r.status,
      payment_id: pid,
      payment_status: data.payment_status || null,
      price_amount: Number(data.price_amount || 0),
      pay_amount: Number(data.pay_amount || 0),
      pay_address: data.pay_address || null,
      network: data.network || null,
      amount_received: Number(data.amount_received || 0),
      pay_currency: data.pay_currency || null,
      order_id: data.order_id || null,
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
      detail: data && (data.message || data.error) ? (data.message || data.error) : undefined
    });
  } catch(err) {
    return json(500, { ok: false, error: 'internal_error', message: (err && (err.message || String(err))) || String(err) });
  }
}

export async function onRequestGet(context) { return onRequestAny(context, 'GET'); }
export async function onRequestPost(context) { return onRequestAny(context, 'POST'); }

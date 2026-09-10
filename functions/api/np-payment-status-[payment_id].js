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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-nowpayments-sig',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
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
  try {
    const pid = String(((context.params && context.params.payment_id) || '') + '').trim();
    if (!pid) return json(400, { ok: false, error: 'payment_id_required' });

    const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
    const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');

    if (!NP_API_KEY) {
      return json(200, {
        ok: true,
        mode: 'simulated',
        note: 'Configure NOWPAYMENTS_API_KEY secret no Cloudflare Pages.',
        data: { payment_id: pid, payment_status: 'waiting', created_at: null }
      });
    }

    const base = NP_API_URL.endsWith('/') ? NP_API_URL : (NP_API_URL + '/');
    const url = base + 'payment/' + encodeURIComponent(pid);

    const raw = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': NP_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'fourhash.app/1.0'
      }
    });

    const txt = await raw.text();
    let data;
    try { data = JSON.parse(txt); } catch(_e) { data = { raw: txt, parse_error: true }; }

    if (!raw.ok) {
      return json(502, {
        ok: false,
        status_code: raw.status,
        payment_id: pid,
        error: (data && (data.message || data.error)) ? (data.message || data.error) : ('np_http_' + raw.status),
        data
      });
    }

    return json(200, {
      ok: true,
      payment_id: pid,
      status: data.payment_status || null,
      data: data || {},
      price_amount: Number(data.price_amount || 0),
      pay_amount: Number(data.pay_amount || 0),
      pay_address: data.pay_address || null,
      pay_currency: data.pay_currency || null,
      network: data.network || null,
      order_id: data.order_id || null,
      amount_received: Number(data.amount_received || 0),
      created_at: data.created_at || null,
      updated_at: data.updated_at || null,
      payment_url: data.payment_url || null
    });
  } catch(err) {
    return json(500, {
      ok: false,
      error: 'internal_error',
      message: (err && (err.message || String(err))) || String(err)
    });
  }
}

export async function onRequestGet(context) { return onRequestAny(context, 'GET'); }

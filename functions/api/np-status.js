function getEnv(c, key, fallback) {
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
  try {
    return new Response(JSON.stringify(body || {}), { status: Number(status) || 500, headers: corsHeaders() });
  } catch(e) {
    return new Response('{"ok":false,"error":"encode_fail","m":' + JSON.stringify(String((e && e.message) || e)) + '}', { status: 500, headers: corsHeaders() });
  }
}

export async function onRequest(context) {
  try {
    const r = context && context.request;
    const method = (r && (r.method || 'GET') || 'GET').toUpperCase();
    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });

    try {
      const u = new URL(r.url);
      const pid = String(((u.searchParams.get('payment_id') || u.searchParams.get('id') || '')) + '').trim();
      if (!pid) return json(400, { ok: false, error: 'id_required', note: '?id=PAYMENT_ID ou ?payment_id=ID' });

      const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
      const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');

      if (!NP_API_KEY) {
        return json(200, {
          ok: true,
          mode: 'simulated',
          payment_id: pid,
          payment_status: 'waiting',
          note: 'NOWPAYMENTS_API_KEY não definida em Secrets Pages (simulated mode).'
        });
      }

      const baseUrl = (NP_API_URL || '').endsWith('/') ? NP_API_URL : (NP_API_URL + '/');
      const url = baseUrl + 'payment/' + encodeURIComponent(pid);

      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': String(NP_API_KEY || ''),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'fourhash.app/1.0'
        }
      }).catch(function(fetchErr){ return { ok: false, status: 0, text: async function(){ return ''+String((fetchErr&&fetchErr.message)||'fetch_fail'); } }; });

      let statusCode = 502;
      try { statusCode = Number(resp.status) || 502; } catch(_) {}

      let txt = '';
      try { txt = String(await resp.text() || ''); } catch(_) { txt = ''; }

      let data = null;
      try { data = JSON.parse(txt || '{}'); } catch(_) { data = { raw: (txt || '').slice(0, 512) }; }

      const isOk = !!resp.ok && statusCode >= 200 && statusCode < 400;

      return json(isOk ? 200 : 502, {
        ok: isOk,
        status_code: statusCode,
        payment_id: pid,
        payment_status: (data && (data.payment_status || data.status)) || null,
        price_amount: Number((data && (data.price_amount || data.priceAmount)) || 0),
        pay_amount: Number((data && (data.pay_amount || data.payAmount)) || 0),
        pay_address: (data && (data.pay_address || data.payAddress)) || null,
        network: (data && (data.network || data.pay_network || data.payin_network)) || null,
        amount_received: Number((data && (data.amount_received || data.outcome_amount)) || 0),
        pay_currency: (data && (data.pay_currency || data.payCurrency)) || null,
        order_id: (data && (data.order_id || data.orderId)) || null,
        created_at: (data && (data.created_at || data.createdAt)) || null,
        updated_at: (data && (data.updated_at || data.updatedAt)) || null,
        detail: (data && (data.message || data.error)) ? (data.message || data.error) : undefined
      });
    } catch (innerErr) {
      return json(500, { ok: false, error: 'handler_error', message: String((innerErr && (innerErr.message || String(innerErr))) || String(innerErr)) });
    }
  } catch (outerErr) {
    try {
      return new Response(JSON.stringify({ ok: false, error: 'fatal', message: String((outerErr && outerErr.message) || outerErr) }), { status: 500, headers: corsHeaders() });
    } catch(_) {
      return new Response('{"ok":false,"error":"fatal"}', { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  }
}

export async function onRequestOptions(context) {
  try { return new Response(null, { status: 204, headers: corsHeaders() }); }
  catch(_) { return new Response(null, { status: 204 }); }
}

export async function onRequestGet(context) { try { return onRequest(context); } catch(e){ try{ return json(500,{ok:false,error:String(e.message||e)});}catch(_){return new Response('err',{status:500});} } }
export async function onRequestPost(context) { try { return onRequest(context); } catch(e){ try{ return json(500,{ok:false,error:String(e.message||e)});}catch(_){return new Response('err',{status:500});} } }

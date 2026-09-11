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
  try { return new Response(JSON.stringify(body || {}), { status: Number(status) || 500, headers: corsHeaders() }); }
  catch(e) { return new Response('{"ok":false,"error":"json_fail"}', { status: 500, headers: corsHeaders() }); }
}

export async function onRequest(context) {
  try {
    const r = context && context.request;
    const m = (r && (r.method || 'GET') || 'GET').toUpperCase();
    if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
    try {
      const pid = String(((context && context.params && context.params.payment_id) || '')) + ''.trim();
      if (!pid) return json(400, { ok: false, error: 'payment_id_required', note: 'Rota: /api/np-payment-status/PAYMENT_ID' });

      const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
      const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');

      if (!NP_API_KEY) {
        return json(200, {
          ok: true,
          mode: 'simulated',
          note: 'Configure NOWPAYMENTS_API_KEY Secret Pages.',
          payment_id: pid, payment_status: 'waiting'
        });
      }

      const base = (NP_API_URL || '').endsWith('/') ? NP_API_URL : (NP_API_URL + '/');
      const url = base + 'payment/' + encodeURIComponent(pid);

      const raw = await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': String(NP_API_KEY || ''), 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'fourhash.app/1.0' }
      }).catch(function(err){ return { ok: false, status: 0, text: async function(){ return String((err&&err.message)||'fetch_fail'); } }; });

      let sc = 502; try { sc = Number(raw.status) || 502; } catch(_) {}
      let txt = ''; try { txt = String(await raw.text() || ''); } catch(_) { txt = ''; }
      let data = null; try { data = JSON.parse(txt || '{}'); } catch(_) { data = { raw: (txt || '').slice(0, 512) }; }

      const isOk = !!raw.ok && sc >= 200 && sc < 400;

      if (!isOk) {
        return json(502, {
          ok: false,
          status_code: sc,
          payment_id: pid,
          error: (data && (data.message || data.error)) ? (data.message || data.error) : ('np_http_' + sc),
          data
        });
      }

      return json(200, {
        ok: true,
        status_code: sc,
        payment_id: pid,
        payment_status: (data && (data.payment_status || data.status)) || null,
        data: data || {},
        price_amount: Number((data && data.price_amount) || 0),
        pay_amount: Number((data && data.pay_amount) || 0),
        pay_address: (data && data.pay_address) || null,
        pay_currency: (data && data.pay_currency) || null,
        network: (data && (data.network || data.pay_network || data.payin_network)) || null,
        order_id: (data && data.order_id) || null,
        amount_received: Number((data && data.amount_received) || 0),
        created_at: (data && data.created_at) || null,
        updated_at: (data && data.updated_at) || null,
        payment_url: (data && data.payment_url) || null
      });
    } catch (innerErr) {
      return json(500, { ok: false, error: 'handler_error', message: String((innerErr && (innerErr.message || String(innerErr))) || String(innerErr)) });
    }
  } catch (outerErr) {
    try { return new Response(JSON.stringify({ ok: false, error: 'fatal', message: String((outerErr && outerErr.message) || outerErr) }), { status: 500, headers: corsHeaders() }); }
    catch(_) { return new Response('{"ok":false,"error":"fatal"}', { status: 500, headers: { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*' } }); }
  }
}

export async function onRequestOptions(context) { try { return new Response(null, { status: 204, headers: corsHeaders() }); } catch(_){ return new Response(null,{status:204});} }
export async function onRequestGet(context) { try { return onRequest(context); } catch(e){ try{ return json(500,{ok:false,error:String(e.message||e)});}catch(_){return new Response('err',{status:500});} } }

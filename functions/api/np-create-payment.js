async function readJson(request) {
  try { return await request.json(); } catch(_e) { return {}; }
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

function json(status, body, extra) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsHeaders(extra) });
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

async function sbUpdateProfile(c, profileId, patch) {
  try {
    const url = `${getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co')}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`;
    const r = await fetch(url, { method: 'PATCH', headers: sbHeaders(c), body: JSON.stringify(patch || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbInsertTransaction(c, obj) {
  try {
    const url = `${getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co')}/rest/v1/transactions`;
    const r = await fetch(url, { method: 'POST', headers: sbHeaders(c), body: JSON.stringify(obj || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

export async function onRequest(context) {
  const m = (context.request.method || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
  if (m !== 'POST') return json(405, { ok: false, error: 'method_not_allowed', method: m });
  return doPost(context);
}

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

async function doPost(context) {
  const { request } = context;
  try {
    const body = (await readJson(request)) || {};
    const amount = Number(body.amount || 10);
    const currency = String(body.price_currency || body.currency || 'usd').toUpperCase();
    const payCurrency = String((body.pay_currency || 'usdt').split(',')[0] || 'usdt').trim().toLowerCase();
    const profileId = String(body.profile_id || '').trim();
    const username = String(body.username || 'user').trim();
    const email = String(body.email || '').trim();
    const kind = String(body.kind || 'activation').toLowerCase();
    const orderDesc = String(body.order_description || `Ativacao FourHash @${username} - US$ ${amount}`).slice(0, 200);

    if (!profileId) return json(400, { ok: false, error: 'profile_id_required' });
    if (!amount || amount < 1) return json(400, { ok: false, error: 'amount_invalid' });

    const orderId = `4H-${kind}-${profileId.slice(0, 8)}-${Date.now()}`;
    const origin = (function(){
      try {
        const h = context.request.headers.get('origin'); if (h) return h;
      } catch(_) {}
      const d = getEnv(context, 'DOMAIN_OFFICIAL');
      if (d) return d;
      const v = getEnv(context, 'VERCEL_URL') || getEnv(context, 'CF_PAGES_URL');
      if (v) return 'https://' + v;
      return 'https://fourhash.app';
    })();
    const successUrl = `${origin}/#/deposit?np_success=1&order_id=${encodeURIComponent(orderId)}`;
    const cancelUrl = `${origin}/#/deposit?np_cancel=1&order_id=${encodeURIComponent(orderId)}`;
    const NP_CALLBACK = getEnv(context, 'NOWPAYMENTS_CALLBACK_URL') || `${origin}/api/np-ipn`;
    const ipnCallback = NP_CALLBACK + (NP_CALLBACK.includes('?') ? '&' : '?') + `profile_id=${encodeURIComponent(profileId)}&kind=${encodeURIComponent(kind)}&amount=${amount}`;

    const NP_API_URL = getEnv(context, 'NOWPAYMENTS_API_URL', 'https://api.nowpayments.io/v1');
    const NP_API_KEY = getEnv(context, 'NOWPAYMENTS_API_KEY', '');

    let np = null, npStatus = 500, npText = '', npOk = false;
    if (NP_API_KEY) {
      try {
        const payload = {
          price_amount: amount, price_currency: currency, pay_currency: payCurrency,
          order_id: orderId, order_description: orderDesc,
          is_fixed_rate: true, ipn_callback_url: ipnCallback,
          success_url: successUrl, cancel_url: cancelUrl
        };
        if (email) payload.customer_email = email;
        const u = NP_API_URL.endsWith('/') ? (NP_API_URL + 'payment') : (NP_API_URL + '/payment');
        const npRes = await fetch(u, {
          method: 'POST',
          headers: { 'x-api-key': NP_API_KEY, 'Content-Type': 'application/json', 'User-Agent': 'fourhash.app/1.0' },
          body: JSON.stringify(payload)
        });
        npStatus = npRes.status;
        npText = await npRes.text();
        try { np = JSON.parse(npText); } catch(e) { np = { raw: npText }; }
        npOk = npRes.ok && np && np.payment_id;
      } catch(err) {
        return json(502, { ok: false, error: 'nowpayments_network', message: (err && (err.message || String(err))) || String(err) });
      }
    }

    if (!NP_API_KEY) {
      return json(200, {
        ok: true, mode: 'simulated',
        note: 'NOWPAYMENTS_API_KEY nao configurada. No frontend caira no fallback Simular.',
        order_id: orderId, profile_id: profileId,
        payment_id: 'sim-' + orderId,
        payment_status: 'waiting',
        price_amount: amount, price_currency: currency,
        pay_amount: amount, pay_currency: 'USDT',
        pay_address: '0x71C4HashBEP20ProtocolVault99F4A810d7E8',
        network: 'BEP20', payment_url: null,
        order_description: orderDesc, created_at: new Date().toISOString(),
        ipn_callback_url: ipnCallback, success_url: successUrl, cancel_url: cancelUrl
      });
    }

    if (!npOk) {
      return json(502, {
        ok: false, error: 'nowpayments_error',
        status_code: npStatus,
        detail: np && (np.message || np.error) ? (np.message || np.error) : undefined
      });
    }

    const paymentId = np.payment_id || null;
    const metaPayload = {
      nowpayments: {
        payment_id: paymentId, order_id: orderId,
        amount, currency, kind,
        status: np.payment_status || 'created',
        created_at: new Date().toISOString(), raw: np || null
      }
    };
    try {
      const note = '[' + new Date().toISOString().slice(0,16) + '] Pagamento ' + kind + ' criado via Gateway #' + (paymentId || orderId) + ' US$' + amount + '.';
      await sbUpdateProfile(context, profileId, { internal_note: note, updated_at: new Date().toISOString() });
      try {
        await sbInsertTransaction(context, {
          profile_id: profileId, type: 'deposit', currency: 'USD', amount: amount,
          method: 'nowpayments', tx_hash: paymentId || orderId, network: np.network || 'nowpayments',
          from_address: np.pay_address || null, to_address: np.payin_extra_id || null,
          status: 'pending', description: orderDesc, metadata: metaPayload
        });
      } catch(_) {}
    } catch(_) {}

    return json(200, {
      ok: true, order_id: orderId, profile_id: profileId,
      payment_id: paymentId,
      payment_status: np.payment_status || 'waiting',
      price_amount: Number(np.price_amount || amount),
      price_currency: String(np.price_currency || currency),
      pay_amount: Number(np.pay_amount || 0),
      pay_currency: String(np.pay_currency || ''),
      pay_address: np.pay_address || null,
      payin_extra_id: np.payin_extra_id || null,
      network: np.network || null,
      amount_received: Number(np.amount_received || 0),
      payment_url: np.payment_url || (paymentId ? ('https://nowpayments.io/payment/' + paymentId) : null),
      order_description: orderDesc,
      created_at: np.created_at || new Date().toISOString(),
      ipn_callback_url: ipnCallback, success_url: successUrl, cancel_url: cancelUrl
    });
  } catch(err) {
    return json(500, { ok: false, error: 'internal_error', message: (err && (err.message || String(err))) || String(err) });
  }
}

export async function onRequestPost(context) { return doPost(context); }

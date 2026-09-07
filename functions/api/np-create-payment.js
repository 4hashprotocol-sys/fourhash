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
    const ALLOWED_COLS = ['profile_id','kind','currency','network','amount','fee','status','tx_hash','block_number','confirmations','from_address','to_address','nowpayments_id','nowpayments_status','related_profile_id','level_reference','note','metadata','order_id','gateway_provider','gateway_payment_id','description'];
    const clean = {};
    for (const k of Object.keys(obj || {})) {
      const key = String(k).toLowerCase();
      if (key === 'type' && !ALLOWED_COLS.includes('type') && ALLOWED_COLS.includes('kind')) {
        if (!clean.kind) clean.kind = obj[k]; continue;
      }
      if (key === 'description' || key === 'note') {
        if (!clean.note) clean.note = String(obj[k]);
      }
      if (ALLOWED_COLS.includes(key)) clean[key] = obj[k];
    }
    if (!clean.kind) clean.kind = 'deposit';
    const url = `${getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co')}/rest/v1/transactions`;
    const r = await fetch(url, { method: 'POST', headers: sbHeaders(c), body: JSON.stringify(clean) });
    if (!r.ok) {
      try { const t = await r.text(); console.log('SB INSERT TX FAIL status=' + r.status + ' body=' + t.slice(0, 256)); } catch(_) {}
    }
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

    if (!amount || amount < 1) return json(400, { ok: false, error: 'amount_invalid' });
    const safeProfileId = profileId || ('anon-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));

    const orderId = `4H-${kind}-${safeProfileId.slice(0, 8)}-${Date.now()}`;
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
    const ipnCallback = NP_CALLBACK + (NP_CALLBACK.includes('?') ? '&' : '?') + `profile_id=${encodeURIComponent(safeProfileId)}&kind=${encodeURIComponent(kind)}&amount=${amount}`;

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
        const netErr = (err && (err.message || String(err))) || String(err);
        let rsn = 'network';
        if (/timeout|abort/i.test(netErr)) rsn = 'timeout';
        return json(502, { ok: false, error: rsn, _np_raw: { network_message: netErr } });
      }
    }

    if (!NP_API_KEY) {
      return json(200, {
        ok: true, mode: 'simulated',
        note: 'NOWPAYMENTS_API_KEY nao configurada. No frontend caira no fallback Simular.',
        order_id: orderId, profile_id: safeProfileId,
        payment_id: 'sim-' + orderId,
        payment_status: 'waiting',
        price_amount: amount, price_currency: currency,
        pay_amount: amount, pay_currency: 'USDT',
        pay_address: null,
        network: null, payment_url: null,
        order_description: orderDesc, created_at: new Date().toISOString(),
        ipn_callback_url: ipnCallback, success_url: successUrl, cancel_url: cancelUrl
      });
    }

    if (!npOk) {
      const rawMsg = np && (np.message || np.error) ? String(np.message || np.error).toLowerCase() : '';
      let reason = 'gateway_error';
      if (/pay.?currency|not.enabled|not.allowed|invalid.*currency|unsupported/i.test(rawMsg)) reason = 'code_not_allowed';
      else if (/quota|rate|limit/i.test(rawMsg)) reason = 'rate_limited';
      else if (/network|fetch|econnrefused|timeout/i.test(rawMsg)) reason = 'network';
      return json(502, {
        ok: false, error: reason,
        status_code: npStatus,
        _np_raw: np
      });
    }

    const paymentId = np.payment_id || null;
    const metaPayload = {
      gateway: {
        provider: 'nowpayments',
        payment_id: paymentId, order_id: orderId,
        amount, currency, kind,
        pay_currency: np.pay_currency || null,
        network: np.network || null,
        pay_address: np.pay_address || null,
        payin_extra_id: np.payin_extra_id || null,
        status: np.payment_status || 'created',
        ipn_signature_validated: false,
        created_at: new Date().toISOString(),
        raw_response: np || null
      }
    };
    try {
      if (!/^anon-/.test(safeProfileId)) {
        const note = '[' + new Date().toISOString().slice(0,16) + '] Pagamento ' + kind + ' criado via Gateway #' + (paymentId || orderId) + ' US$' + amount + ' (rede=' + (np.network || 'n/a') + ').';
        await sbUpdateProfile(context, safeProfileId, { internal_note: note, updated_at: new Date().toISOString() });
        try {
          await sbInsertTransaction(context, {
            profile_id: safeProfileId,
            kind: (kind === 'activation') ? 'deposit' : kind,
            currency: String(np.price_currency || currency || 'USD').toUpperCase(),
            amount: Number(np.price_amount || amount || 0),
            method: 'gateway',
            tx_hash: paymentId || orderId,
            order_id: orderId,
            nowpayments_id: paymentId || null,
            nowpayments_status: np.payment_status || 'created',
            gateway_provider: 'nowpayments',
            gateway_payment_id: paymentId || null,
            network: np.network || 'nowpayments',
            from_address: np.pay_address || null,
            to_address: np.payin_extra_id || null,
            status: 'pending',
            description: orderDesc,
            metadata: metaPayload
          });
        } catch(e) {
          try { console.log('WARN sbInsertTransaction fail', e && e.message); } catch(_) {}
        }
      }
    } catch(_) {}

    return json(200, {
      ok: true, order_id: orderId, profile_id: safeProfileId,
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

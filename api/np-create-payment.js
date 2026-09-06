const crypto = require('crypto');

const NP_API_URL = process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1';
const NP_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://psxzgidozduecpaxwcny.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeHpnaWRvemR1ZWNwYXh3Y255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzkyOTcsImV4cCI6MjEwNDAxNTI5N30.a6LneIKWumm3kcdzi2PryNExiHdBw3cgHYphqdvCagY';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function sbHeaders(anonFallback) {
  const key = SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY || anonFallback || '';
  return {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

async function sbUpdateProfile(profileId, patch) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
      method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(patch)
    });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbInsertTransaction(obj) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      method: 'POST', headers: sbHeaders(), body: JSON.stringify(obj)
    });
    return r.ok;
  } catch(_e) { return false; }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-nowpayments-sig');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  try {
    const body = req.body || {};
    const amount = Number(body.amount || 10);
    const currency = String(body.price_currency || body.currency || 'usd').toUpperCase();
    const payCurrency = String(body.pay_currency || 'usdtbep20,usdttrc20,usdterc20,btc,eth,ltc,xrp').toLowerCase();
    const profileId = String(body.profile_id || '').trim();
    const username = String(body.username || 'user').trim();
    const email = String(body.email || '').trim();
    const kind = String(body.kind || 'activation').toLowerCase();
    const orderDesc = String(body.order_description || `Ativacao FourHash @${username} - US$ ${amount}`).slice(0, 200);

    if (!profileId) return res.status(400).json({ ok: false, error: 'profile_id_required' });
    if (!amount || amount < 1) return res.status(400).json({ ok: false, error: 'amount_invalid' });

    const orderId = `4H-${kind}-${profileId.slice(0, 8)}-${Date.now()}`;
    const origin = process.env.DOMAIN_OFFICIAL
      ? process.env.DOMAIN_OFFICIAL
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://fourhash.app');
    const successUrl = `${origin}/#/deposit?np_success=1&order_id=${encodeURIComponent(orderId)}`;
    const cancelUrl = `${origin}/#/deposit?np_cancel=1&order_id=${encodeURIComponent(orderId)}`;
    const NP_CALLBACK = process.env.NOWPAYMENTS_CALLBACK_URL || `${origin}/api/np-ipn`;
    const ipnCallback = NP_CALLBACK + (NP_CALLBACK.includes('?') ? '&' : '?') + `profile_id=${encodeURIComponent(profileId)}&kind=${encodeURIComponent(kind)}&amount=${amount}`;

    let np = null, npStatus = 500, npText = '', npOk = false;
    if (NP_API_KEY) {
      try {
        const payload = {
          price_amount: amount,
          price_currency: currency,
          pay_currency: payCurrency,
          order_id: orderId,
          order_description: orderDesc,
          is_fixed_rate: true,
          ipn_callback_url: ipnCallback,
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer_email: email || undefined
        };
        const npRes = await fetch(`${NP_API_URL}/payment`, {
          method: 'POST',
          headers: {
            'x-api-key': NP_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        npStatus = npRes.status;
        npText = await npRes.text();
        try { np = JSON.parse(npText); } catch(e) { np = { raw: npText }; }
        npOk = npRes.ok && np && np.payment_id;
      } catch(err) {
        return res.status(502).json({ ok: false, error: 'nowpayments_network', message: err && err.message });
      }
    }

    if (!NP_API_KEY) {
      return res.status(200).json({
        ok: true,
        mode: 'simulated',
        note: 'NOWPAYMENTS_API_KEY não configurada. No frontend cairá no fallback Simular.',
        order_id: orderId,
        profile_id: profileId,
        payment_id: 'sim-' + orderId,
        payment_status: 'waiting',
        price_amount: amount,
        price_currency: currency,
        pay_amount: amount,
        pay_currency: 'USDT',
        pay_address: '0x71C4HashBEP20ProtocolVault99F4A810d7E8',
        network: 'BEP20',
        payment_url: null,
        order_description: orderDesc,
        created_at: new Date().toISOString(),
        ipn_callback_url: ipnCallback,
        success_url: successUrl,
        cancel_url: cancelUrl
      });
    }

    if (!npOk) {
      return res.status(502).json({
        ok: false,
        error: 'nowpayments_error',
        status_code: npStatus,
        detail: np && (np.message || np.error) ? (np.message || np.error) : undefined
      });
    }

    const paymentId = np.payment_id || null;
    const metaPayload = {
      nowpayments: {
        payment_id: paymentId,
        order_id: orderId,
        amount, currency, kind,
        status: np.payment_status || 'created',
        created_at: new Date().toISOString(),
        raw: np || null
      }
    };
    try {
      const note = `[${new Date().toISOString().slice(0,16)}] Pagamento ${kind} criado via Gateway #${paymentId || orderId} US$${amount}.`;
      await sbUpdateProfile(profileId, { internal_note: note, updated_at: new Date().toISOString() });
      try {
        await sbInsertTransaction({
          profile_id: profileId,
          type: 'deposit',
          currency: 'USD',
          amount: amount,
          method: 'nowpayments',
          tx_hash: paymentId || orderId,
          network: np.network || 'nowpayments',
          from_address: np.pay_address || null,
          to_address: np.payin_extra_id || null,
          status: 'pending',
          description: orderDesc,
          metadata: metaPayload
        });
      } catch(_) { /* ignore */ }
    } catch(_) { /* ignore */ }

    return res.status(200).json({
      ok: true,
      order_id: orderId,
      profile_id: profileId,
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
      payment_url: np.payment_url || (paymentId ? `https://nowpayments.io/payment/${paymentId}` : null),
      order_description: orderDesc,
      created_at: np.created_at || new Date().toISOString(),
      ipn_callback_url: ipnCallback,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
  } catch(err) {
    console.error('[np-create] fatal', err && err.stack);
    return res.status(500).json({ ok: false, error: 'internal_error', message: err && err.message });
  }
};

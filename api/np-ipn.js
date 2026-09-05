const crypto = require('crypto');

const NP_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || '';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://psxzgidozduecpaxwcny.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeHpnaWRvemR1ZWNwYXh3Y255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzkyOTcsImV4cCI6MjEwNDAxNTI5N30.a6LneIKWumm3kcdzi2PryNExiHdBw3cgHYphqdvCagY';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function sbHeaders() {
  const key = SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY || '';
  return {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

function validSignature(rawBody, sigHeader) {
  if (!NP_IPN_SECRET || !sigHeader) return false;
  try {
    const sorted = JSON.stringify(JSON.parse(rawBody));
    const expected = crypto.createHmac('sha512', NP_IPN_SECRET).update(sorted).digest('hex').toLowerCase();
    return expected === String(sigHeader || '').toLowerCase();
  } catch(_e) { return false; }
}

async function sbRpc(name, params) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: 'POST', headers: sbHeaders(), body: JSON.stringify(params || {})
    });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateProfile(profileId, patch) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(profileId)}`, {
      method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(patch)
    });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateTransactions(cond, patch) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/transactions?${cond}`, {
      method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(patch)
    });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateWalletFallback(profileId, amount) {
  try {
    const h = sbHeaders();
    const list = await fetch(`${SUPABASE_URL}/rest/v1/wallets?profile_id=eq.${encodeURIComponent(profileId)}&select=*&limit=1`, { headers: h });
    const data = list.ok ? await list.json() : [];
    if (Array.isArray(data) && data.length) {
      const w = data[0];
      return await fetch(`${SUPABASE_URL}/rest/v1/wallets?id=eq.${encodeURIComponent(w.id)}`, {
        method: 'PATCH', headers: h, body: JSON.stringify({
          balance_usd: Number(w.balance_usd || 0) + amount,
          total_deposits_usd: Number(w.total_deposits_usd || 0) + amount,
          updated_at: new Date().toISOString()
        })
      }).then(r => r.ok);
    } else {
      return await fetch(`${SUPABASE_URL}/rest/v1/wallets`, {
        method: 'POST', headers: h, body: JSON.stringify({
          profile_id: profileId, balance_usd: amount,
          total_deposits_usd: amount, currency: 'USD',
          updated_at: new Date().toISOString()
        })
      }).then(r => r.ok);
    }
  } catch(_e) { return false; }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-nowpayments-sig');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const qs = req.query || {};
  const profileId = String(qs.profile_id || '').trim();
  const kind = String(qs.kind || 'activation').toLowerCase();
  const amountQs = Number(qs.amount || 0);

  const sigHeader = (req.headers && (req.headers['x-nowpayments-sig'] || req.headers['X-Nowpayments-Sig'])) || '';
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const body = typeof req.body === 'string' ? (JSON.parse(req.body || '{}') || {}) : (req.body || {});

  const paymentId = String(body.payment_id || body.id || '').trim();
  const orderId = String(body.order_id || '').trim();
  const payStatus = String(body.payment_status || body.status || '').toLowerCase();
  const amountPaid = Number(body.price_amount || body.amount || amountQs || 0);

  if (!paymentId && !orderId) return res.status(400).json({ ok: false, error: 'missing_identifiers' });

  const sigOk = NP_IPN_SECRET ? validSignature(rawBody, sigHeader) : true;
  if (!sigOk) {
    console.warn('[np-ipn] invalid signature', paymentId, sigHeader);
    return res.status(401).json({ ok: false, error: 'invalid_signature' });
  }

  const finalStates = ['finished','confirmed','completed','success'];
  const isPaid = finalStates.indexOf(payStatus) >= 0;
  const isFailed = ['failed','expired','refunded','partially_paid','rejected'].indexOf(payStatus) >= 0;

  let activation = false;
  try {
    if (profileId.length > 10) {
      if (orderId || paymentId) {
        const patchTx = {
          status: isPaid ? 'confirmed' : (isFailed ? 'failed' : 'pending'),
          confirmed_at: isPaid ? new Date().toISOString() : null,
          error_message: isFailed ? `NowPayments status=${payStatus}` : null
        };
        const q = (orderId && paymentId)
          ? `or=(order_id.eq.${encodeURIComponent(orderId)},tx_hash.eq.${encodeURIComponent(paymentId)})`
          : (orderId ? `order_id=eq.${encodeURIComponent(orderId)}` : `tx_hash=eq.${encodeURIComponent(paymentId)}`);
        try { await sbUpdateTransactions(q, patchTx); } catch(_) {}
      }

      if (isPaid) {
        const amount = amountPaid || amountQs || 10;
        try {
          const note = `[${new Date().toISOString().slice(0,16)}] Conta ativada via NowPayments #${paymentId || orderId} US$${amount}.`;
          const okUp = await sbUpdateProfile(profileId, {
            status: 'active',
            level_number: 1,
            activated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            internal_note: note
          });
          let okInc = await sbRpc('increment_wallet_balance', {
            target_profile_id: profileId, add_amount: amount
          });
          if (!okInc) okInc = await sbUpdateWalletFallback(profileId, amount);
          activation = okUp;
        } catch(_act) { console.warn('[np-ipn] activation err', _act.message); }
      }
    }
  } catch(err) { console.error('[np-ipn] fatal', err && err.stack); }

  return res.status(200).json({
    ok: true,
    received: true,
    sig_ok: sigOk,
    payment_id: paymentId,
    order_id: orderId,
    payment_status: payStatus,
    is_paid: isPaid,
    profile_id: profileId,
    kind,
    amount: amountPaid || amountQs,
    activation
  });
};

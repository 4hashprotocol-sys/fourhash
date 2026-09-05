const NP_API_URL = process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1';
const NP_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-nowpayments-sig');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const q = req.query || {};
  const pid = String((q.payment_id || q.id || (req.body && req.body.payment_id) || '') + '').trim();
  if (!pid) return res.status(400).json({ ok: false, error: 'id_required' });

  if (!NP_API_KEY) return res.status(200).json({
    ok: true, mode: 'simulated',
    payment_id: pid,
    payment_status: 'waiting',
    note: 'Configure NOWPAYMENTS_API_KEY para status real.'
  });

  try {
    const r = await fetch(`${NP_API_URL}/payment/${encodeURIComponent(pid)}`, {
      method: 'GET',
      headers: {
        'x-api-key': NP_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const txt = await r.text();
    let data; try { data = JSON.parse(txt); } catch(e) { data = { raw: txt }; }
    return res.status(r.ok ? 200 : 502).json({
      ok: r.ok,
      status_code: r.status,
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
    return res.status(500).json({ ok: false, error: 'internal_error', message: err && err.message });
  }
};

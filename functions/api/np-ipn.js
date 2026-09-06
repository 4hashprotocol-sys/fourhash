async function readText(request) {
  try { const t = await request.text(); if (typeof t === 'string') return t; } catch(_e) {}
  return '{}';
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

function json(status, body) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsHeaders() });
}

async function validSignature(IPN_SECRET, rawBody, sigHeader) {
  if (!IPN_SECRET || !sigHeader) return false;
  try {
    let sorted = rawBody;
    try { sorted = JSON.stringify(JSON.parse(rawBody)); } catch(_) {}
    const enc = new TextEncoder();
    const w = globalThis.crypto && globalThis.crypto.subtle;
    if (!w) return false;
    const key = await w.importKey('raw', enc.encode(IPN_SECRET), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
    const buf = await w.sign('HMAC', key, enc.encode(sorted));
    const hex = Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    return hex.toLowerCase() === String(sigHeader || '').toLowerCase();
  } catch(_e) { return false; }
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

async function sbRpc(c, name, params) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/rpc/' + name) : (base + '/rest/v1/rpc/' + name));
    const r = await fetch(url, { method: 'POST', headers: sbHeaders(c), body: JSON.stringify(params || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateProfile(c, profileId, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/profiles?id=eq.' + encodeURIComponent(profileId)) : (base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId)));
    const r = await fetch(url, { method: 'PATCH', headers: sbHeaders(c), body: JSON.stringify(patch || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbUpdateTransactions(c, q, patch) {
  try {
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const url = (base.endsWith('/') ? (base + 'rest/v1/transactions?' + q) : (base + '/rest/v1/transactions?' + q));
    const r = await fetch(url, { method: 'PATCH', headers: sbHeaders(c), body: JSON.stringify(patch || {}) });
    return r.ok;
  } catch(_e) { return false; }
}

async function sbWalletFallback(c, profileId, amount) {
  try {
    const H = sbHeaders(c);
    const base = getEnv(c, 'SUPABASE_URL', 'https://psxzgidozduecpaxwcny.supabase.co');
    const listUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&limit=1') : (base + '/rest/v1/wallets?profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&limit=1'));
    const list = await fetch(listUrl, { headers: H });
    const data = list.ok ? await list.json() : [];
    if (Array.isArray(data) && data.length) {
      const w = data[0];
      const updUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets?id=eq.' + encodeURIComponent(w.id)) : (base + '/rest/v1/wallets?id=eq.' + encodeURIComponent(w.id)));
      const r = await fetch(updUrl, {
        method: 'PATCH', headers: H, body: JSON.stringify({
          balance_usd: Number(w.balance_usd || 0) + amount,
          total_deposits_usd: Number(w.total_deposits_usd || 0) + amount,
          updated_at: new Date().toISOString()
        })
      });
      return r.ok;
    } else {
      const insUrl = (base.endsWith('/') ? (base + 'rest/v1/wallets') : (base + '/rest/v1/wallets'));
      const r = await fetch(insUrl, {
        method: 'POST', headers: H, body: JSON.stringify({
          profile_id: profileId, balance_usd: amount,
          total_deposits_usd: amount, currency: 'USD',
          updated_at: new Date().toISOString()
        })
      });
      return r.ok;
    }
  } catch(_e) { return false; }
}

export async function onRequest(context) {
  const m = (context.request.method || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
  if (m === 'GET') return json(405, { ok: false, error: 'method_not_allowed' });
  if (m !== 'POST') return json(405, { ok: false, error: 'method_not_allowed', method: m });
  return doPost(context);
}

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) { return json(405, { ok: false, error: 'method_not_allowed' }); }
export async function onRequestPost(context) { return doPost(context); }

async function doPost(context) {
  const { request } = context;
  try {
    const url = new URL(request.url);
    const profileId = String(url.searchParams.get('profile_id') || '').trim();
    const kind = String(url.searchParams.get('kind') || 'activation').toLowerCase();
    const amountQs = Number(url.searchParams.get('amount') || 0);

    let sigHeader = '';
    try {
      sigHeader = request.headers.get('x-nowpayments-sig') || request.headers.get('X-Nowpayments-Sig') || '';
    } catch(_) {}

    const rawBody = await readText(request);
    let body; try { body = JSON.parse(rawBody || '{}'); } catch(_e) { body = {}; }

    const paymentId = String(body.payment_id || body.id || '').trim();
    const orderId = String(body.order_id || '').trim();
    const payStatus = String(body.payment_status || body.status || '').toLowerCase();
    const amountPaid = Number(body.price_amount || body.amount || amountQs || 0);

    if (!paymentId && !orderId) return json(400, { ok: false, error: 'missing_identifiers' });

    const IPN_SECRET = getEnv(context, 'NOWPAYMENTS_IPN_SECRET', '');
    let sigOk = !IPN_SECRET ? true : false;
    if (IPN_SECRET) {
      try { sigOk = Boolean(await validSignature(IPN_SECRET, rawBody, sigHeader)); } catch(_) { sigOk = false; }
      if (!sigOk) {
        return json(401, { ok: false, error: 'invalid_signature' });
      }
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
            error_message: isFailed ? ('status_pagamento=' + payStatus) : null
          };
          const q = (orderId && paymentId)
            ? 'or=(order_id.eq.' + encodeURIComponent(orderId) + ',tx_hash.eq.' + encodeURIComponent(paymentId) + ')'
            : (orderId ? ('order_id=eq.' + encodeURIComponent(orderId)) : ('tx_hash=eq.' + encodeURIComponent(paymentId)));
          try { await sbUpdateTransactions(context, q, patchTx); } catch(_) {}
        }

        if (isPaid) {
          const amount = amountPaid || amountQs || 10;
          try {
            const note = '[' + new Date().toISOString().slice(0,16) + '] Conta ativada via Gateway #' + (paymentId || orderId) + ' US$' + amount + '.';
            const okUp = await sbUpdateProfile(context, profileId, {
              status: 'active',
              level_number: 1,
              activated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              internal_note: note
            });
            let okInc = await sbRpc(context, 'increment_wallet_balance', {
              target_profile_id: profileId, add_amount: amount
            });
            if (!okInc) okInc = await sbWalletFallback(context, profileId, amount);
            activation = okUp;
          } catch(_act) {}
        }
      }
    } catch(_err) {}

    return json(200, {
      ok: true, received: true,
      sig_ok: sigOk,
      payment_id: paymentId, order_id: orderId,
      payment_status: payStatus, is_paid: isPaid,
      profile_id: profileId, kind: kind,
      amount: amountPaid || amountQs,
      activation: activation
    });
  } catch(err) {
    return json(500, { ok: false, error: 'internal_error', message: (err && (err.message || String(err))) || String(err) });
  }
}

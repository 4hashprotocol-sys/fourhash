function corsH(extra) {
  const base = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (extra) for (const k of Object.keys(extra)) base[k] = extra[k];
  return base;
}
function json(status, body) {
  return new Response(JSON.stringify(body || {}), { status, headers: corsH() });
}

export async function onRequest(context) {
  const m = String((context && context.request && context.request.method) || 'GET').toUpperCase();
  if (m === 'OPTIONS') return new Response(null, { status: 204, headers: corsH() });
  try {
    const keys = [
      'DOMAIN_OFFICIAL',
      'NOWPAYMENTS_API_URL',
      'NOWPAYMENTS_CALLBACK_URL',
      'NOWPAYMENTS_API_KEY',
      'NOWPAYMENTS_IPN_SECRET',
      'NOWPAYMENTS_PUBLIC_KEY',
      'NP_CRON_SECRET',
      'SUPABASE_ANON_KEY',
      'SUPABASE_PUBLISHABLE_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_PROJECT_REF',
      'SUPABASE_URL',
      'VERCEL_URL',
      'CF_PAGES_URL'
    ];
    const report = {};
    let missing = 0;
    for (const k of keys) {
      let v = '';
      try {
        const e = context && context.env;
        if (e) {
          if (typeof e.get === 'function') { try { v = String(e.get(k) || ''); } catch(_) {} }
          if (!v) { const raw = e[k]; v = (typeof raw === 'string') ? raw : ''; }
        }
      } catch(_) { v = ''; }
      const isSet = v.length > 0;
      if (!isSet) missing++;
      report[k] = isSet ? (k.includes('KEY') || k.includes('SECRET') ? ('****' + v.slice(-4)) : v) : '(MISSING!)';
    }
    return json(200, {
      ok: true,
      status: 'healthy',
      now: new Date().toISOString(),
      missing_secrets_count: missing,
      secrets: report,
      note: missing === 0 ? 'Todas variaveis OK. Pages Functions bundle carregou com sucesso.' : ('Faltam ' + missing + ' variaveis Secrets nas Pages Settings.')
    });
  } catch(err) {
    return json(500, { ok: false, error: 'internal', message: (err && (err.message || String(err))) || String(err) });
  }
}

export async function onRequestGet(context) { return onRequest(context); }
export async function onRequestPost(context) { return onRequest(context); }
export async function onRequestOptions(context) { return new Response(null, { status: 204, headers: corsH() }); }

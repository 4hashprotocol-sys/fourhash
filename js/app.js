/* ============================================================
   FOURHASH — Entry Point / Bootstrap da Aplicação
   Ordem de carregamento dos módulos (no index.html):
   1. translations.js   (dados puros)
   2. AppState.js       (estado global, usa translations)
   3. UI.js             (utilitários de interface, usa AppState, I18n lazy)
   4. i18n.js           (motor i18n, usa translations + AppState)
   5. Theme.js          (tema, usa AppState + UI)
   6. Countdown.js      (contador, usa I18n)
   7. TreeEngine.js     (organograma, usa AppState + UI)
   8. Views.js          (templates, usam AppState, I18n, Router, UI)
   9. Router.js         (roteador, orquestra tudo)
   10. app.js           (bootstrap, global listeners, onload)
   ============================================================ */

// #region debug-point BOOTSTRAP:debug-server-env
(function () {
  try {
    var __dbg = window.__dbg || (window.__dbg = {});
    var _hn = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '';
    var isLocal = (_hn === 'localhost' || _hn === '127.0.0.1' || _hn.indexOf('localhost') >= 0);
    __dbg._isLocalDev = isLocal;
    if (!isLocal) {
      // EM PRODUÇÃO (fourhash.app) — desativar 100% o debug forwarder para não poluir console e não gerar ERR_CONNECTION_REFUSED
      __dbg.store = function () {};
      __dbg.flush = function () {};
      __dbg.queue = [];
      __dbg.disabled = true;
      return;
    }
    __dbg.sessionId = 'admin-oscillation-wallet-empty';
    __dbg.runId = 'pre-fix';
    __dbg.url = 'http://127.0.0.1:7777/event';
    __dbg.port = 7777;
    __dbg.queue = [];
    __dbg.lastFlush = 0;
    __dbg.sent = 0;
    __dbg.total = 0;
    __dbg.store = function (hypothesisId, location, msg, data, traceId) {
      try {
        __dbg.total++;
        var evt = {
          sessionId: __dbg.sessionId,
          runId: __dbg.runId,
          hypothesisId: hypothesisId || 'A',
          ts: Date.now(),
          location: location || '',
          msg: '[DEBUG] ' + (msg || ''),
          data: data || {},
          traceId: traceId || ('tr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))
        };
        __dbg.queue.push(evt);
        try { console.log('[DEBUG:event][' + evt.hypothesisId + '] ' + evt.msg + ' | ' + JSON.stringify(evt.data || {})); } catch(_lc){}
        __dbg.flush();
      } catch(_es) {}
    };
    __dbg.flush = function () {
      try {
        if (!__dbg.queue.length) return;
        if (navigator && typeof navigator.sendBeacon === 'function') {
          try {
            while (__dbg.queue.length) {
              var ev = __dbg.queue.shift();
              try {
                navigator.sendBeacon(__dbg.url, new Blob([JSON.stringify(ev)], { type: 'application/json' }));
                __dbg.sent++;
              } catch(_bea){ __dbg.queue.unshift(ev); break; }
            }
            return;
          } catch(_beaconErr){}
        }
        var batch = __dbg.queue.slice(0, 8);
        var doFetch = function () {
          try {
            var evB = batch.shift();
            if (!evB) { if (!batch.length) __dbg.queue = __dbg.queue.slice(8); return; }
            fetch(__dbg.url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evB) }).then(function(){ __dbg.sent++; doFetch(); }).catch(function(){ batch.unshift(evB); setTimeout(doFetch, 500); });
          } catch(_ef){}
        };
        doFetch();
      } catch(_efl){}
    };
    setInterval(function(){ try { __dbg.flush(); } catch(_t){} }, 800);
    __dbg.store('BOOT', 'app.js:16', 'debugger bootstrap | queue ready', { runId: __dbg.runId, url: __dbg.url });
  } catch(_eb){}
})();
// #endregion

window.addEventListener('DOMContentLoaded', function() {
  // Auto-atualiza DDI do Telefone quando usuário troca País no Cadastro
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'reg-country') {
      const c = (COUNTRIES || window.COUNTRIES || []).find(function(x){ return x.code === e.target.value; });
      const p = document.getElementById('reg-phone');
      if (c && p) {
        const raw = (p.value || '').replace(/^\+[\d\s-]+/, '');
        p.value = c.dial + ' ' + raw;
        p.placeholder = c.dial + ' ' + (c.code === 'BR' ? '(11) 99999-9999' : '9XXXXXXXXX');
        p.setAttribute('data-dial', c.dial);
      }
    }
  });
  bindFormHandlers();
});

window.addEventListener('click', (e) => {
  if (!e.target.closest('#lang-btn') && !e.target.closest('#lang-dropdown')) {
    const d = document.getElementById('lang-dropdown');
    if (d) d.classList.add('hidden');
  }
  if (!e.target.closest('.auth-only') && !e.target.closest('#notif-dropdown')) {
    const nd = document.getElementById('notif-dropdown');
    if (nd) nd.classList.add('hidden');
  }
  if (e.target.id === 'modal-backdrop') {
    UI.closeModal();
  }
});

function bindFormHandlers() {
  try {
    var loginForm = document.getElementById('login-form');
    if (loginForm && !loginForm.getAttribute('data-bound')) {
      loginForm.setAttribute('data-bound', '1');
      loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        handleLoginSubmit();
      });
      if (window.console && console.log) console.log('[BIND OK] login-form listener atachado');
    }
    var regForm = document.getElementById('register-form');
    if (regForm && !regForm.getAttribute('data-bound')) {
      regForm.setAttribute('data-bound', '1');
      regForm.addEventListener('submit', function(e){
        e.preventDefault();
        handleRegisterSubmit();
      });
      if (window.console && console.log) console.log('[BIND OK] register-form listener atachado. Sponsor data-sponsor:', regForm.getAttribute('data-sponsor'));
    }
  } catch(e) { console.error('[BIND FAIL] bindFormHandlers:', e); }
}

if (typeof Router !== 'undefined') {
  var _origRNav = Router.navigate;
  Router.navigate = function() {
    try { _origRNav.apply(this, arguments); } catch(e) { console.error('[Router.navigate FAIL]', e); }
    setTimeout(bindFormHandlers, 60);
  };
  var _origRRefresh = Router.refresh;
  Router.refresh = function() {
    try { _origRRefresh.apply(this, arguments); } catch(e) { console.error('[Router.refresh FAIL]', e); }
    setTimeout(bindFormHandlers, 60);
  };
}

function handleLoginSubmit() {
  var emailEl = document.getElementById('login-email');
  var passEl  = document.getElementById('login-pass');
  var btnEl   = document.getElementById('login-submit');
  var email = emailEl ? (emailEl.value || '').trim() : '';
  var pass  = passEl  ? (passEl.value  || '') : '';
  if (!email || !pass) { UI.showToast('Preencha o e-mail e a senha.', 'warning', 'fa-triangle-exclamation'); return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    UI.showToast('Acesso exclusivo por e-mail. Informe um e-mail válido.', 'warning', 'fa-envelope');
    if (emailEl) try { emailEl.focus(); } catch(_) {}
    return;
  }
  if (btnEl) { btnEl.disabled = true; btnEl.style.opacity = '0.6'; }
  var finalize = function(errMsg){
    if (btnEl) { btnEl.disabled = false; btnEl.style.opacity = '1'; }
    if (errMsg) UI.showToast(errMsg, 'error', 'fa-circle-xmark');
  };
  if (window.SupabaseOK && window.SupabaseOK() && typeof AppState !== 'undefined' && typeof AppState.sbSignIn === 'function') {
    Promise.resolve(AppState.sbSignIn(email, pass)).then(function(ok){
      if (!ok) { /* sbSignIn já mostrou toast/modal */ try { finalize(); } catch(_) {} }
    }).catch(function(err){ finalize((err && err.message) || 'Erro no login.'); });
    return;
  }
  if (typeof Router !== 'undefined' && typeof Router.loginMock === 'function') {
    try { Router.loginMock(); } catch(e) {}
    if (btnEl) btnEl.disabled = false;
    return;
  }
  UI.showToast('Modo offline: login demo ativado.', 'info');
  if (AppState) AppState.isAuthenticated = true;
  if (Router) Router.navigate('dashboard');
  if (btnEl) btnEl.disabled = false;
}

function handleRegisterSubmit() {
  if (window.console && console.log) console.log('[REGISTER] handleRegisterSubmit INICIADO às', new Date().toISOString());
  var fullnameEl = document.getElementById('reg-fullname');
  var userEl     = document.getElementById('reg-username');
  var emailEl    = document.getElementById('reg-email');
  var passEl     = document.getElementById('reg-pass');
  var pass2El    = document.getElementById('reg-pass-confirm');
  var countryEl  = document.getElementById('reg-country');
  var phoneEl    = document.getElementById('reg-phone');
  var btnEl      = document.getElementById('register-submit');
  var sponsorRef = '';
  var regForm = document.getElementById('register-form');
  if (regForm) sponsorRef = (regForm.getAttribute('data-sponsor') || '').trim();
  if (!sponsorRef) sponsorRef = (new URLSearchParams(window.location.search).get('ref') || '').trim();
  if (!sponsorRef) try { if (window.localStorage) sponsorRef = (window.localStorage.getItem('fh_register_ref') || '').trim(); } catch(_lSp){}
  if (!sponsorRef && typeof Router !== 'undefined' && Router._lastRegisterRef) sponsorRef = String(Router._lastRegisterRef).trim();
  if (!sponsorRef) sponsorRef = '4hashprotocol';
  if (window.console && console.log) console.log('[REGISTER] sponsorRef resolvido =', sponsorRef);

  var fullname = fullnameEl ? fullnameEl.value.trim() : '';
  var username = userEl     ? userEl.value.replace(/^@/,'').trim() : '';
  var email    = emailEl    ? emailEl.value.trim() : '';
  var pass     = passEl     ? passEl.value  : '';
  var pass2    = pass2El    ? pass2El.value : '';
  var country  = countryEl  ? countryEl.value : 'BR';
  var phone    = phoneEl    ? phoneEl.value.trim() : '';
  if (window.console && console.log) console.log('[REGISTER] campos preenchidos. fullname:', !!fullname, 'username:', username, 'email:', email, 'pass.length:', pass.length, 'pass2.length:', pass2.length);

  if (!fullname || !username || !email || !pass || !pass2) {
    var m1 = 'Preencha todos os campos.';
    console.error('[REGISTER VALIDATION]', m1, {fullname:!!fullname,username:!!username,email:!!email,pass:!!pass,pass2:!!pass2});
    UI.showToast(m1, 'warning', 'fa-triangle-exclamation'); return;
  }
  if (username.length < 3 || username.length > 20) {
    var m2 = 'Username precisa ter 3–20 caracteres.';
    console.error('[REGISTER VALIDATION]', m2, 'username.length:', username.length);
    UI.showToast(m2, 'warning'); return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    var m3 = 'Username: apenas letras, números e underline.';
    console.error('[REGISTER VALIDATION]', m3, 'username:', username);
    UI.showToast(m3, 'warning'); return;
  }
  var FORBIDDEN_UN = ['guest','register','login','logout','signin','signup','sign-in','sign_up','sign-up','admin','administrator','adm','root','owner','staff','team','profile','user','users','account','accounts','support','ticket','tickets','wallet','wallets','deposit','deposits','withdraw','withdrawal','withdrawals','dashboard','dash','home','landing','index','referral','referrals','ref','sponsor','sponsors','tree','matrix','network','plan','plans','system','sys','config','settings','setup','app','4h','fourhash','four-hash','four_hash','protocol','official','oficial','ceo','founder','supabase','resend','support-team','financeiro','backoffice','painel','painel-admin'];
  var lowUn = username.toLowerCase();
  for (var ifb = 0; ifb < FORBIDDEN_UN.length; ifb++) { if (lowUn === FORBIDDEN_UN[ifb]) {
    var m4 = 'Username "'+username+'" reservado. Escolha outro.';
    console.error('[REGISTER VALIDATION]', m4);
    UI.showToast(m4, 'warning'); return;
  }}
  var PREFIX = ['admin','adm_','staff_','root_','official_','fourhash','4h','support_'];
  for (var ip = 0; ip < PREFIX.length; ip++) { if (lowUn.indexOf(PREFIX[ip]) === 0) {
    var m5 = 'Prefixo de username reservado. Tente outro.';
    console.error('[REGISTER VALIDATION]', m5, 'prefixo:', PREFIX[ip]);
    UI.showToast(m5, 'warning'); return;
  }}
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    var m6 = 'E-mail inválido.';
    console.error('[REGISTER VALIDATION]', m6, 'email:', email);
    UI.showToast(m6, 'warning'); return;
  }
  if (pass.length < 6) {
    var m7 = 'Senha mínima de 6 dígitos.';
    console.error('[REGISTER VALIDATION]', m7, 'length:', pass.length);
    UI.showToast(m7, 'warning'); return;
  }
  if (pass !== pass2) {
    var m8 = 'Senhas não correspondem.';
    console.error('[REGISTER VALIDATION]', m8);
    UI.showToast(m8, 'warning'); return;
  }

  var first_name = fullname, last_name = '';
  var sp = fullname.indexOf(' ');
  if (sp > 0) { first_name = fullname.slice(0, sp); last_name = fullname.slice(sp+1).trim(); }

  if (btnEl) { btnEl.disabled = true; btnEl.style.opacity = '0.6'; try { var origBtnHtml = btnEl.innerHTML; var procTxt = ''; try { procTxt = (typeof I18n !== 'undefined' && I18n && typeof I18n.t === 'function') ? String(I18n.t('processing') || '') : ''; } catch(_i1){} if (!procTxt || procTxt === 'processing') procTxt = 'Processando'; btnEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>' + procTxt + '…'; } catch(_orig) {} }
  var finalize = function(errMsg){
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.style.opacity = '1';
      try { if (typeof origBtnHtml !== 'undefined') btnEl.innerHTML = origBtnHtml; } catch(_btn) {}
    }
    if (errMsg) { console.error('[REGISTER FINALIZE ERROR]', errMsg); UI.showToast(errMsg, 'error', 'fa-circle-xmark'); }
    else { if (window.console && console.log) console.log('[REGISTER FINALIZE] OK (sem erro)'); }
  };

  var meta = {
    username: username,
    upline_code: (sponsorRef || '4hashprotocol').replace(/^@/,''),
    sponsor_code: (sponsorRef || '4hashprotocol').replace(/^@/,''),
    first_name: first_name,
    last_name: last_name,
    full_name: fullname,
    country: country,
    phone: phone,
    lang: (I18n && I18n.currentLang) ? I18n.currentLang : 'pt'
  };

  if (window.SupabaseOK && window.SupabaseOK() && typeof AppState !== 'undefined' && typeof AppState.sbSignUp === 'function') {
    if (window.console && console.log) console.log('[REGISTER] Chamando AppState.sbSignUp. email:', email, 'meta:', meta);
    Promise.resolve(AppState.sbSignUp(email, pass, meta)).then(function(ok){
      console.log('[REGISTER] AppState.sbSignUp PROMISE RESOLVIDA. ok =', ok);
      if (ok) {
        UI.showToast('Conta criada com sucesso! Verifique seu e-mail (' + email + ') para confirmar o cadastro.', 'success', 'fa-envelope-circle-check', 6000);
        try { Router.navigate('login'); } catch(_navL) { console.error('[REGISTER FAIL Router.navigate login pós sucesso]', _navL); }
      }
      finalize(ok ? null : 'Não foi possível criar a conta. Tente novamente.');
    }).catch(function(err){
      console.error('[REGISTER AppState.sbSignUp PROMISE CATCH] err =', err, 'raw =', JSON.stringify(err));
      var m = (err && err.message) ? String(err.message) : ('Erro ao criar conta.');
      if (/already.*regist|user.*already.*exist|email.*already.*taken/i.test(m.toLowerCase())) m = 'Este e-mail já está cadastrado. Faça login ou recupere a senha.';
      if (/password.*at least|weak.*password|password.*length/i.test(m.toLowerCase())) m = 'Senha muito fraca. Use pelo menos 6 caracteres com letra e número.';
      finalize(m);
    });
    return;
  }
  console.error('[REGISTER] NÃO ROLOU AppState.sbSignUp. SupabaseOK:', window.SupabaseOK && window.SupabaseOK(), 'AppState existe:', typeof AppState !== 'undefined', 'sbSignUp:', typeof (AppState && AppState.sbSignUp));
  /* Fallback offline demo */
  UI.showToast('Modo offline: Conta criada (demo). Redirecionando...', 'success');
  setTimeout(function(){ if (Router) Router.navigate('deposit'); }, 900);
  if (btnEl) btnEl.disabled = false;
}

window.onload = async function() {
  AppState.init();
  try { if (window.Theme && typeof Theme.init === 'function') Theme.init(); } catch(_ti){}

  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.setAttribute('title', I18n.t('toggleTheme'));

  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  if (refCode) {
    try { if (window.localStorage) window.localStorage.setItem('fh_register_ref', String(refCode).trim()); } catch(_lsRef){}
    try { if (window.Router) window.Router._lastRegisterRef = String(refCode).trim(); } catch(_lrRef){}
  }

  // ============ RENDER PRIMEIRO, DEPOIS CARREGA (tela NÃO FICA PRETA) ============
  try {
    if (typeof Router !== 'undefined' && Router.renderNav) {
      try { Router.renderNav(); } catch(e) {}
    }
    setTimeout(bindFormHandlers, 40);
  } catch(e) {}

  if (refCode) {
    try { Router.navigate('register', { ref: refCode }); } catch(e) {}
    try { UI.showToast(`Cadastro iniciado através do link de @${refCode}`, 'info'); } catch(e) {}
    // sbInit em background
    Promise.resolve().then(function(){
      if (window.SupabaseOK && typeof AppState.sbInit === 'function') {
        try { return AppState.sbInit(); } catch(_e1) { return false; }
      }
      return false;
    }).then(function(okSb){
      if (okSb && typeof Router !== 'undefined') try { Router.refreshCurrentView(); } catch(_rr){}
    }).catch(function(){});
    return;
  }

  var hasAuth = false;
  try { hasAuth = (typeof Router !== 'undefined' && Router.isAuthenticated) ? Router.isAuthenticated() : !!AppState.isAuthenticated; } catch(e) {}

  var initialRoute = 'landing';
  var hash = window.location.hash || '';
  if (hash.startsWith('#/')) {
    initialRoute = hash.slice(2).split('?')[0].split('&')[0] || 'landing';
  }

  var _privRoutes = ['dashboard','position','wallet','deposit','referrals','profile','security','admin','notifications'];
  if (!hasAuth && _privRoutes.includes(initialRoute)) {
    initialRoute = 'landing';
    try { UI.showToast('É necessário iniciar sessão para aceder a esta página.', 'warning', 'fa-triangle-exclamation'); } catch(e) {}
  }

  try { Router.navigate(initialRoute, {}); }
  catch(e) { try { Router.navigate('landing'); } catch(e2) {} }

  // ============ sbInit EM BACKGROUND (após render já visível) ============
  Promise.resolve().then(function(){
    if (window.SupabaseOK && typeof AppState.sbInit === 'function') {
      try { return AppState.sbInit(); } catch(_e2) { return false; }
    }
    return false;
  }).then(function(okSb2){
    if (!okSb2) return;
    // atualizar para a rota correta se o sbInit mudou o estado de auth
    try {
      var isAuthNow = false;
      try { isAuthNow = (typeof Router !== 'undefined' && Router.isAuthenticated) ? Router.isAuthenticated() : !!AppState.isAuthenticated; } catch(_ea) {}
      var nowRoute = (Router && Router.currentRoute) ? Router.currentRoute : initialRoute;
      var userNowIsPriv = _privRoutes.includes(nowRoute);
      if (!isAuthNow && userNowIsPriv) {
        try { Router.navigate('landing'); return; } catch(_en){}
      }
      var isAdminNow = false;
      try { if (Router && Router.isAdmin) isAdminNow = Router.isAdmin(); } catch(_ead){}
      if (isAuthNow && isAdminNow && nowRoute === 'landing') { try { Router.navigate('admin'); return; } catch(_eadm){} }
      if (isAuthNow && (nowRoute === 'landing' || nowRoute === 'login' || nowRoute === 'register')) {
        try { Router.navigate('dashboard'); return; } catch(_eld){}
      }
      try { if (typeof Router !== 'undefined') Router.refreshCurrentView(); } catch(_rrf){}
    } catch(_erf) {}
  }).catch(function(){});
};

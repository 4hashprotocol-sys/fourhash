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
    }
    var regForm = document.getElementById('register-form');
    if (regForm && !regForm.getAttribute('data-bound')) {
      regForm.setAttribute('data-bound', '1');
      regForm.addEventListener('submit', function(e){
        e.preventDefault();
        handleRegisterSubmit();
      });
    }
  } catch(e) { /* forms ainda não montados; Router vai ligar de novo via onRoute */ }
}

if (typeof Router !== 'undefined') {
  var _origRNav = Router.navigate;
  Router.navigate = function() {
    try { _origRNav.apply(this, arguments); } catch(e) {}
    setTimeout(bindFormHandlers, 60);
  };
  var _origRRefresh = Router.refresh;
  Router.refresh = function() {
    try { _origRRefresh.apply(this, arguments); } catch(e) {}
    setTimeout(bindFormHandlers, 60);
  };
}

function handleLoginSubmit() {
  var emailEl = document.getElementById('login-email');
  var passEl  = document.getElementById('login-pass');
  var btnEl   = document.getElementById('login-submit');
  var email = emailEl ? (emailEl.value || '').trim() : '';
  var pass  = passEl  ? (passEl.value  || '') : '';
  if (!email || !pass) { UI.showToast('Preencha e-mail/usuário e senha.', 'warning', 'fa-triangle-exclamation'); return; }
  if (email.startsWith('@')) email = email.slice(1);
  if (btnEl) { btnEl.disabled = true; btnEl.style.opacity = '0.6'; }
  var finalize = function(errMsg){
    if (btnEl) { btnEl.disabled = false; btnEl.style.opacity = '1'; }
    if (errMsg) UI.showToast(errMsg, 'error', 'fa-circle-xmark');
  };
  if (window.SupabaseOK && window.SupabaseOK() && typeof AppState !== 'undefined' && typeof AppState.sbSignIn === 'function') {
    Promise.resolve(AppState.sbSignIn(email, pass)).then(function(ok){
      if (!ok) finalize('Login inválido. Verifique as credenciais.');
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

  var fullname = fullnameEl ? fullnameEl.value.trim() : '';
  var username = userEl     ? userEl.value.replace(/^@/,'').trim() : '';
  var email    = emailEl    ? emailEl.value.trim() : '';
  var pass     = passEl     ? passEl.value  : '';
  var pass2    = pass2El    ? pass2El.value : '';
  var country  = countryEl  ? countryEl.value : 'BR';
  var phone    = phoneEl    ? phoneEl.value.trim() : '';

  if (!fullname || !username || !email || !pass || !pass2) { UI.showToast('Preencha todos os campos.', 'warning', 'fa-triangle-exclamation'); return; }
  if (username.length < 3 || username.length > 20) { UI.showToast('Username precisa ter 3–20 caracteres.', 'warning'); return; }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) { UI.showToast('Username: apenas letras, números e underline.', 'warning'); return; }
  var FORBIDDEN_UN = ['guest','register','login','logout','signin','signup','sign-in','sign_up','sign-up','admin','administrator','adm','root','owner','staff','team','profile','user','users','account','accounts','support','ticket','tickets','wallet','wallets','deposit','deposits','withdraw','withdrawal','withdrawals','dashboard','dash','home','landing','index','referral','referrals','ref','sponsor','sponsors','tree','matrix','network','plan','plans','system','sys','config','settings','setup','app','4h','fourhash','four-hash','four_hash','protocol','official','oficial','ceo','founder','supabase','resend','support-team','financeiro','backoffice','painel','painel-admin'];
  var lowUn = username.toLowerCase();
  for (var ifb = 0; ifb < FORBIDDEN_UN.length; ifb++) { if (lowUn === FORBIDDEN_UN[ifb]) { UI.showToast('Username "'+username+'" reservado. Escolha outro.', 'warning'); return; } }
  var PREFIX = ['admin','adm_','staff_','root_','official_','fourhash','4h','support_'];
  for (var ip = 0; ip < PREFIX.length; ip++) { if (lowUn.indexOf(PREFIX[ip]) === 0) { UI.showToast('Prefixo de username reservado. Tente outro.', 'warning'); return; } }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { UI.showToast('E-mail inválido.', 'warning'); return; }
  if (pass.length < 6) { UI.showToast('Senha mínima de 6 dígitos.', 'warning'); return; }
  if (pass !== pass2) { UI.showToast('Senhas não correspondem.', 'warning'); return; }

  var first_name = fullname, last_name = '';
  var sp = fullname.indexOf(' ');
  if (sp > 0) { first_name = fullname.slice(0, sp); last_name = fullname.slice(sp+1).trim(); }

  if (btnEl) { btnEl.disabled = true; btnEl.style.opacity = '0.6'; }
  var finalize = function(errMsg){
    if (btnEl) { btnEl.disabled = false; btnEl.style.opacity = '1'; }
    if (errMsg) UI.showToast(errMsg, 'error', 'fa-circle-xmark');
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
    Promise.resolve(AppState.sbSignUp(email, pass, meta)).then(function(ok){
      if (!ok) finalize('Não foi possível criar a conta. Tente novamente.');
    }).catch(function(err){ finalize((err && err.message) || 'Erro ao criar conta.'); });
    return;
  }
  /* Fallback offline demo */
  UI.showToast('Modo offline: Conta criada (demo). Redirecionando...', 'success');
  setTimeout(function(){ if (Router) Router.navigate('deposit'); }, 900);
  if (btnEl) btnEl.disabled = false;
}

window.onload = async function() {
  AppState.init();

  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.setAttribute('title', I18n.t('toggleTheme'));

  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  var sbDoneOk = false;
  try {
    if (window.SupabaseOK && typeof AppState.sbInit === 'function') {
      try {
        sbDoneOk = !!(await Promise.resolve(AppState.sbInit()));
      } catch (err) { /* fallback silencioso */ }
    }
  } catch (e) { /* fallback silencioso */ }

  try {
    if (typeof Router !== 'undefined' && Router.renderNav) {
      try { Router.renderNav(); } catch(e) {}
    }
    setTimeout(bindFormHandlers, 80);
  } catch(e) {}

  if (refCode) {
    try { Router.navigate('register', { ref: refCode }); } catch(e) {}
    try { UI.showToast(`Cadastro iniciado através do link de @${refCode}`, 'info'); } catch(e) {}
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
};

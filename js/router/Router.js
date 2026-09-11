/* ============================================================
   FOURHASH — Roteador SPA (Single Page Application)
   Depende de: AppState, I18n, Views, TreeEngine, Countdown, UI
   ============================================================ */

const Router = {
  currentRoute: 'landing',

  _privateRoutes: Object.freeze(['dashboard','position','wallet','deposit','referrals','profile','security','admin','notifications']),
  _guestOnlyRoutes: Object.freeze(['login','register']),

  isAuthenticated() {
    return !!(AppState.isAuthenticated || (AppState.sbAuth && AppState.sbAuth.id));
  },

  isAdmin() {
    if (!this.isAuthenticated()) return false;
    try {
      const u = AppState.currentUser || {};
      const uid = String(u.id || (AppState.sbAuth && AppState.sbAuth.id) || '').toLowerCase();
      const eml = String(u.email || (AppState.sbAuth && AppState.sbAuth.email) || '').toLowerCase();
      const MASTER_UUID = '7ce5a80a-abc8-4bc3-a17f-d7ed8670b15f'.toLowerCase();
      const MASTER_EMAIL = '4hashprotocol@gmail.com'.toLowerCase();
      if (uid === MASTER_UUID || eml === MASTER_EMAIL) return true;
    } catch(_) {}
    const localRole = AppState.userRole === 'admin';
    const directFlag = AppState.isAdmin === true;
    const bancoRole = AppState.sbProfile && (AppState.sbProfile.role === 'admin' || AppState.sbProfile.role === 'superadmin');
    const currentRole = AppState.currentUser && (AppState.currentUser.role === 'admin' || AppState.currentUser.role === 'superadmin');
    return localRole || directFlag || bancoRole || currentRole;
  },

  isActivated() {
    if (this.isAdmin()) return true;
    if (!this.isAuthenticated()) return false;
    const s = (AppState.currentUser && AppState.currentUser.status) ? String(AppState.currentUser.status).toUpperCase() : '';
    return s === 'ACTIVE' || s === 'TRUE';
  },

  navigate(route, params = {}) {
    if (this._guestOnlyRoutes.includes(route) && this.isAuthenticated()) {
      UI.showToast('Já se encontra com sessão iniciada.', 'info');
      this.navigate('dashboard');
      return;
    }
    if (this._privateRoutes.includes(route) && !this.isAuthenticated()) {
      UI.showToast('É necessário iniciar sessão para aceder a esta página.', 'warning', 'fa-triangle-exclamation');
      this.navigate('landing');
      return;
    }
    if (route === 'admin' && !this.isAdmin()) {
      UI.showToast('Acesso Negado. Apenas administradores.', 'error', 'fa-shield-halved');
      if (this.isAuthenticated()) { this.navigate('dashboard'); return; }
      this.navigate('landing');
      return;
    }

    const ONLY_PENDING_ALLOWED = ['deposit', 'profile', 'security', 'admin'];
    if (this.isAuthenticated() && !this.isAdmin() && !this.isActivated() && ONLY_PENDING_ALLOWED.indexOf(route) < 0) {
      UI.showToast('Ative sua conta com $10 USDT para desbloquear o acesso completo.', 'warning', 'fa-lock');
      this.navigate('deposit');
      return;
    }

    this.currentRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderNav();
    this.renderView(route, params);

    document.getElementById('mobile-menu').classList.add('hidden');
  },

  refreshCurrentView() {
    this.renderView(this.currentRoute);
  },

  renderNav() {
    const nav = document.getElementById('desktop-nav');
    const mobileNav = document.getElementById('mobile-menu');
    const authAction = document.getElementById('header-auth-action');
    const notifWrappers = document.querySelectorAll('.auth-only');

    if (this.isAuthenticated()) {
      notifWrappers.forEach(el => el.classList.remove('hidden'));

      const activated = this.isActivated();
      const lock = (activated ? '' : ' opacity-40 pointer-events-none grayscale cursor-not-allowed');
      const lockedMsg = (activated ? '' : ' onclick=\"event.stopPropagation(); event.preventDefault(); UI.showToast(\\\'Ative sua conta primeiro para desbloquear.\\\',\\\'warning\\\',\\\'fa-lock\\\'); return false;\"');
      const statusBadge = activated
        ? `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 border border-brand/40 text-brand text-[10px] font-black font-mono uppercase tracking-wider shadow-neon-sm"><span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>ATIVO</span>`
        : `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-black font-mono uppercase tracking-wider"><i class="fa-solid fa-clock text-[10px]"></i>AGUARDA ATIVAÇÃO</span>`;

      let links = `
        <button onclick="Router.navigate('dashboard')" class="hover:text-brand transition${lock}${this.currentRoute === 'dashboard' ? ' text-brand font-bold' : ''}">${I18n.t('navDashboard')}</button>
        <button onclick="Router.navigate('position')" class="hover:text-brand transition${lock}${this.currentRoute === 'position' ? ' text-brand font-bold' : ''}">${I18n.t('navPosition')}</button>
        <button onclick="Router.navigate('wallet')" class="hover:text-brand transition${lock}${this.currentRoute === 'wallet' ? ' text-brand font-bold' : ''}">${I18n.t('navWallet')}</button>
        <button onclick="Router.navigate('deposit')" class="hover:text-brand transition${activated ? '' : ' text-amber-400 font-extrabold animate-pulse'}${this.currentRoute === 'deposit' ? ' text-brand font-bold' : ''}">${I18n.t('navDeposit')}</button>
        <button onclick="Router.navigate('referrals')" class="hover:text-brand transition${lock}${this.currentRoute === 'referrals' ? ' text-brand font-bold' : ''}">${I18n.t('navReferrals')}</button>
      `;

      if (this.isAdmin()) {
        links += `<button onclick="Router.navigate('admin')" class="text-amber-400 hover:text-amber-300 transition font-bold ${this.currentRoute === 'admin' ? 'underline' : ''}"><i class="fa-solid fa-crown mr-1"></i>${I18n.t('navAdmin')}</button>`;
      }

      nav.innerHTML = links;

      const mLock = activated ? '' : ' opacity-40 grayscale cursor-not-allowed';
      const mDisabled = activated ? '' : ' onclick=\"event.preventDefault(); event.stopPropagation(); UI.showToast(\\\'Ative sua conta primeiro.\\\',\\\'warning\\\',\\\'fa-lock\\\'); return false;\"';

      mobileNav.innerHTML = `
        <div class="flex items-center gap-3 p-3 bg-brand-surface rounded-xl border border-white/10 mb-4">
          <div class="w-10 h-10 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center font-bold text-brand">
            @${(AppState.currentUser.username || 'U').substring(0, 2).toUpperCase()}
          </div>
          <div class="flex-1">
            <div class="font-bold text-sm text-white">@${AppState.currentUser.username}</div>
            <div class="text-[10px] text-brand font-mono">Nível ${AppState.currentUser.level} • ${AppState.currentUser.positionNumber}</div>
            <div class="mt-1.5">${statusBadge}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-3 pt-2 border-t border-white/5">
          <div class="col-span-2 text-[10px] font-mono text-gray-500 uppercase px-1">Preferências</div>
          <button onclick="Theme.toggle()" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5 flex items-center gap-2">
            <i class="fa-solid fa-moon text-brand"></i><span data-i18n="toggleTheme">Alternar Tema</span>
          </button>
          <button onclick="Router.navigate('profile')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5 flex items-center gap-2">
            <i class="fa-solid fa-user text-brand"></i><span data-i18n="userProfile">Meu Perfil</span>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="Router.navigate('dashboard')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5${mLock}"${mDisabled}><i class="fa-solid fa-chart-pie mr-2 text-brand"></i>${I18n.t('navDashboard')}</button>
          <button onclick="Router.navigate('position')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5${mLock}"${mDisabled}><i class="fa-solid fa-sitemap mr-2 text-brand"></i>${I18n.t('navPosition')}</button>
          <button onclick="Router.navigate('wallet')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5${mLock}"${mDisabled}><i class="fa-solid fa-wallet mr-2 text-brand"></i>${I18n.t('navWallet')}</button>
          <button onclick="Router.navigate('deposit')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-amber-500/30 bg-amber-500/5 text-amber-400 font-extrabold ${activated ? '' : 'animate-pulse'}"><i class="fa-solid fa-arrow-down-to-bracket mr-2 text-amber-400"></i>${I18n.t('navDeposit')}</button>
          <button onclick="Router.navigate('referrals')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5${mLock}"${mDisabled}><i class="fa-solid fa-users mr-2 text-brand"></i>${I18n.t('navReferrals')}</button>
          <button onclick="Router.navigate('security')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-shield-halved mr-2 text-brand"></i>${I18n.t('navSecurity')}</button>
        </div>
        ${this.isAdmin() ? `<button onclick="Router.navigate('admin')" class="w-full mt-2 py-2 text-center text-xs font-bold text-amber-400 border border-amber-500/30 rounded-lg bg-amber-500/5 hover:bg-amber-500/10"><i class="fa-solid fa-crown mr-1"></i>Painel Admin</button>` : ''}
        <button onclick="Router.logout()" class="w-full mt-2 py-2 text-center text-xs text-red-400 hover:text-red-300 font-medium border border-red-500/20 rounded-lg"><i class="fa-solid fa-right-from-bracket mr-1"></i>${I18n.t('logout')}</button>
      `;

      authAction.innerHTML = `
        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          ${statusBadge}
          <button onclick="Router.navigate('profile')" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card hover:border-brand/40 text-xs transition">
            <span class="w-2 h-2 rounded-full ${activated ? 'bg-brand animate-pulse' : 'bg-amber-400 animate-ping'}"></span>
            <span class="font-mono text-gray-200">@${AppState.currentUser.username}</span>
          </button>
          <button onclick="Router.logout()" title="${I18n.t('logout')}" class="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg border border-white/10 hover:border-red-500/40 bg-brand-card hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition flex-shrink-0">
            <i class="fa-solid fa-power-off text-xs"></i>
          </button>
        </div>
      `;
    } else {
      notifWrappers.forEach(el => el.classList.add('hidden'));
      nav.innerHTML = `
        <button onclick="Router.navigate('landing')" class="hover:text-brand transition ${this.currentRoute === 'landing' ? 'text-brand font-bold' : ''}">${I18n.t('navHome')}</button>
        <button onclick="Router.navigate('landing')" class="hover:text-brand transition">${I18n.t('linearPosTitle')}</button>
        <button onclick="Router.navigate('support')" class="hover:text-brand transition">${I18n.t('navSupport')}</button>
      `;
      mobileNav.innerHTML = `
        <div class="space-y-2">
          <button onclick="Router.navigate('landing')" class="w-full py-2.5 text-left text-sm text-gray-200 font-medium"><i class="fa-solid fa-house mr-2 text-brand"></i>${I18n.t('navHome')}</button>
          <button onclick="Router.navigate('login')" class="w-full py-2.5 text-left text-sm text-gray-200 font-medium"><i class="fa-solid fa-right-to-bracket mr-2 text-brand"></i>${I18n.t('login')}</button>
          <button onclick="Router.navigate('register')" class="w-full py-2.5 text-center text-sm font-bold bg-brand text-black rounded-lg"><i class="fa-solid fa-user-plus mr-2"></i>${I18n.t('createAccount')}</button>
        </div>
      `;
      authAction.innerHTML = `
        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button onclick="Router.navigate('login')" class="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand/40 bg-brand-card text-xs font-semibold text-gray-200 hover:text-white transition">
            ${I18n.t('login')}
          </button>
          <button onclick="Router.navigate('register')" class="px-2.5 sm:px-3.5 py-1.5 sm:py-1.5 rounded-lg bg-brand hover:bg-brand-glow text-black font-bold text-[11px] sm:text-xs shadow-neon transition transform hover:scale-[1.02] whitespace-nowrap">
            ${I18n.t('createAccount')}
          </button>
        </div>
      `;
    }

    const footerAdminLink = document.getElementById('footer-admin-link');
    if (footerAdminLink) {
      if (this.isAdmin()) {
        footerAdminLink.classList.remove('hidden');
      } else {
        footerAdminLink.classList.add('hidden');
      }
    }
  },

  logout() {
    const doFallback = () => {
      AppState.isAuthenticated = false;
      AppState.sbAuth = null;
      AppState.sbProfile = null;
      AppState.userRole = 'user';
      UI.showToast('Você desconectou da sua conta.', 'info');
      this.navigate('landing');
    };
    if (window.SupabaseOK && window.SupabaseOK() && AppState && typeof AppState.sbSignOut === 'function') {
      Promise.resolve(AppState.sbSignOut()).then(doFallback).catch(doFallback);
    } else {
      doFallback();
    }
  },

  loginMock() {
    AppState.isAuthenticated = true;
    UI.showToast('Login efetuado com sucesso!', 'success');
    this.navigate('dashboard');
  },

  renderView(route, params) {
    const app = document.getElementById('app-view');
    app.innerHTML = '';
    app.className = 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 cyber-grid view-transition';

    if (this._privateRoutes.includes(route) && !this.isAuthenticated()) {
      UI.showToast('É necessário iniciar sessão para aceder a esta página.', 'warning', 'fa-triangle-exclamation');
      this.navigate('landing');
      return;
    }
    if (this._guestOnlyRoutes.includes(route) && this.isAuthenticated()) {
      this.navigate('dashboard');
      return;
    }

    switch (route) {
      case 'landing':
        app.innerHTML = Views.Landing();
        Countdown.start('presale-timer-landing', AppState.projectSettings.presaleEndDate);
        break;
      case 'login':
        app.innerHTML = Views.Login();
        break;
      case 'register':
        app.innerHTML = Views.Register(params.ref || '4hashprotocol');
        break;
      case 'dashboard':
        app.innerHTML = Views.Dashboard();
        Countdown.start('presale-timer-dash', AppState.projectSettings.presaleEndDate);
        break;
      case 'position':
        app.innerHTML = Views.Position();
        try { TreeEngine.init(); } catch(_) {}
        (function(){
          var tries = 0;
          var maxTries = 15;
          var fn = function(){
            var hasData = false;
            try {
              if (window.AppState && window.AppState.treeLevels && Array.isArray(window.AppState.treeLevels)) {
                hasData = window.AppState.treeLevels.some(function(l){ return l && l.positions && l.positions.length > 0; });
              }
            } catch(_) { hasData = false; }
            try {
              if (window._treeReady || hasData) {
                var vp = document.getElementById('tree-viewport');
                if (vp) {
                  try { TreeEngine.render(); } catch(e) { try { console.log('[Router.position] TreeEngine.render erro:', e && e.message ? e.message : String(e)); } catch(_) {} }
                  try { console.log('[Router.position] Árvore renderizada | window._treeReady:', !!window._treeReady, '| hasPositions:', hasData, '| tentativa:', tries + 1); } catch(_) {}
                }
              }
            } catch(_) {}
            tries++;
            if (tries < maxTries) setTimeout(fn, (tries < 3) ? 600 : 1200);
          };
          setTimeout(fn, 300);
        })();
        break;
      case 'wallet':
        app.innerHTML = Views.Wallet();
        break;
      case 'deposit':
        app.innerHTML = Views.Deposit();
        break;
      case 'referrals':
        app.innerHTML = Views.Referrals();
        break;
      case 'profile':
        app.innerHTML = Views.Profile();
        break;
      case 'security':
        app.innerHTML = Views.Security();
        break;
      case 'support':
        app.innerHTML = Views.Support();
        break;
      case 'admin':
        if (!this.isAdmin()) {
          UI.showToast('Acesso Negado. Apenas administradores.', 'error', 'fa-shield-halved');
          if (this.isAuthenticated()) { this.navigate('dashboard'); return; }
          this.navigate('landing');
          return;
        }
        app.innerHTML = Views.Admin();
        try {
          if (AppState && typeof AppState.refreshAdminSummaries === 'function') {
            setTimeout(function(){
              console.log('[ROUTER/admin] disparando refreshFromSupabase (admin)...');
              if (typeof AppState.refreshFromSupabase === 'function') AppState.refreshFromSupabase();
              else {
                AppState.refreshAdminSummaries(); AppState.refreshAdminUsersList(); AppState.refreshFinanceProblems(); AppState.refreshSupportTickets();
              }
            }, 250);
            setTimeout(function(){
              AppState.refreshAdminSummaries(); AppState.refreshAdminUsersList();
              if (typeof Router !== 'undefined') Router.refreshCurrentView();
            }, 1600);
          }
        } catch(admErr) {}
        break;
      default:
        app.innerHTML = Views.Landing();
    }
    I18n.updatePageTranslations();
  }
};

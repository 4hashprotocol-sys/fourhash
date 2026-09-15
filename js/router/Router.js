/* ============================================================
   FOURHASH — Roteador SPA (Single Page Application)
   Depende de: AppState, I18n, Views, TreeEngine, Countdown, UI
   ============================================================ */

const Router = {
  currentRoute: 'landing',
  _privateRoutes: Object.freeze(['dashboard','position','wallet','deposit','referrals','profile','security','admin','notifications']),
  _guestOnlyRoutes: Object.freeze(['login','register']),
  _refreshDebounceTimer: null,
  _refreshBypass: false,
  _lastLoadedRoute: null,
  _lastLoadedAt: 0,
  _renderCount: 0,
  _routeDataLoaded: Object.create(null),
  _lastAdminTab: null,
  _lastAdminTabAt: 0,
  _switchAdminTabTimer: null,
  _lastRegisterRef: null,

  _resolveRegisterSponsor(params) {
    const DEFAULT_SPONSOR = '4hashprotocol';
    try {
      var urlRef = '';
      try {
        var usp = new URLSearchParams(window.location.search);
        urlRef = (usp.get('ref') || '').toString().trim();
      } catch(_q) { urlRef = ''; }
      if (urlRef) {
        try { if (window.localStorage) window.localStorage.setItem('fh_register_ref', urlRef); } catch(_ls1) {}
        this._lastRegisterRef = urlRef;
        return urlRef;
      }
    } catch(_eu) {}
    try {
      var pRef = (params && typeof params.ref !== undefined && params.ref !== null) ? String(params.ref).trim() : '';
      if (pRef) {
        try { if (window.localStorage) window.localStorage.setItem('fh_register_ref', pRef); } catch(_ls2) {}
        this._lastRegisterRef = pRef;
        return pRef;
      }
    } catch(_ep) {}
    try {
      var lsRef = '';
      try { if (window.localStorage) lsRef = (window.localStorage.getItem('fh_register_ref') || '').toString().trim(); } catch(_ls3) {}
      if (lsRef) {
        this._lastRegisterRef = lsRef;
        return lsRef;
      }
    } catch(_els) {}
    try {
      if (this._lastRegisterRef) return this._lastRegisterRef;
    } catch(_) {}
    return DEFAULT_SPONSOR;
  },

  _switchAdminTab(tab) {
    try {
      tab = String(tab || 'backoffice');
      var validTabs = ['backoffice','reports','finance','support'];
      if (validTabs.indexOf(tab) < 0) tab = 'backoffice';
      try { clearTimeout(this._switchAdminTabTimer); } catch(_) {}
      this._switchAdminTabTimer = null;
      var prevTab = (AppState && AppState.adminActiveTab) ? AppState.adminActiveTab : null;
      if (AppState) try { AppState.adminActiveTab = tab; } catch(_at1){}
      var tabChanged = prevTab !== tab;
      // #region debug-point H3:Router.switchAdminTab-start
      try { if (window.__dbg && typeof window.__dbg.store === 'function') window.__dbg.store('H3', 'Router.js:_switchAdminTab', 'switchAdminTab chamado', { tab: tab, prevTab: prevTab || null, tabChanged: tabChanged, count: (Router && Router._renderCount) || 0 }); } catch(_dH3a){}
      // #endregion
      try { console.log('[Router._switchAdminTab] ' + (tabChanged?'MUDOU':'IGUAL') + ' tab=' + tab + ' prev=' + prevTab); } catch(_lt){}
      try { this.refreshCurrentView(true); } catch(_rc1){}
      if (!tabChanged) return;
      this._lastAdminTab = tab;
      this._lastAdminTabAt = Date.now();
      var self = this;
      this._switchAdminTabTimer = setTimeout(function(){
        if (self.currentRoute !== 'admin') return;
        var currTab2 = (AppState && AppState.adminActiveTab) ? AppState.adminActiveTab : null;
        if (currTab2 !== tab) return;
        if (AppState && typeof AppState.loadAdminData === 'function') {
          // #region debug-point H3:Router.switchAdminTab-load
          try { if (window.__dbg && typeof window.__dbg.store === 'function') window.__dbg.store('H3', 'Router.js:_switchAdminTab loadAdminData', 'switchAdminTab disparando loadAdminData', { tab: tab, at: Date.now() - (self._lastAdminTabAt||0) }); } catch(_dH3b){}
          // #endregion
          Promise.resolve().then(function(){ return AppState.loadAdminData(tab, true); })
            .then(function(changed){
              try { console.log('[Router._switchAdminTab] loadAdminData done | changed=' + !!changed + ' tab=' + tab); } catch(_llt){}
              if (changed && self.currentRoute === 'admin') {
                var currTab3 = (AppState && AppState.adminActiveTab) ? AppState.adminActiveTab : null;
                if (currTab3 === tab) try { self.refreshCurrentView(true); } catch(_rc2){}
              }
            })
            .catch(function(_errLad){});
        } else {
          Promise.resolve().then(function(){ return AppState.refreshFromSupabase({scope:'admin',force:true}); })
            .then(function(){ if (self.currentRoute === 'admin') try { self.refreshCurrentView(true); } catch(_rc3){} })
            .catch(function(){});
        }
      }, 25);
    } catch(_sat){ try { console.log('[Router._switchAdminTab ERR]', String((_sat&&_sat.message)||_sat)); } catch(_les){} }
  },

  _scheduleRouteDataLoad(route) {
    try {
      if (!route) return;
      var cacheKey = String(route);
      var now = Date.now();
      var alreadyLoaded = !!this._routeDataLoaded[cacheKey];
      var sameRouteRecently = this._lastLoadedRoute === cacheKey && (now - this._lastLoadedAt) < 1500;
      if (alreadyLoaded && sameRouteRecently) return;
      this._lastLoadedRoute = cacheKey;
      this._lastLoadedAt = now;
      this._routeDataLoaded[cacheKey] = now;
      var self = this;
      setTimeout(function(){
        if (self.currentRoute !== route) return;
        var needWallet = ['dashboard','wallet','admin','profile','referrals','deposit','withdraw'].indexOf(route) >= 0;
        if (needWallet && AppState && typeof AppState.refreshMyWallet === 'function') {
          Promise.resolve().then(function(){
            return AppState.refreshMyWallet(route === 'wallet');
          }).then(function(changed){
            if (changed && self.currentRoute === route) {
              try { self.refreshCurrentView(true); } catch(_r1){}
            }
          }).catch(function(){});
        }
        if (route === 'admin' && AppState) {
          var tab = (AppState.adminActiveTab) || 'backoffice';
          var recentTabSwitch = self._lastAdminTab === tab && (now - (self._lastAdminTabAt||0)) < 3000;
          // #region debug-point H3:Router.scheduleRouteDataLoad-admin
          try { if (window.__dbg && typeof window.__dbg.store === 'function') window.__dbg.store('H3', 'Router.js:_scheduleRouteDataLoad admin', 'scheduleRouteDataLoad admin section', { route: route, tab: tab, lastAdminTab: self._lastAdminTab || null, msSinceTabSwitch: (self._lastAdminTabAt ? (now - self._lastAdminTabAt) : -1), recentTabSwitch: !!recentTabSwitch, force: false }); } catch(_dH3c){}
          // #endregion
          if (recentTabSwitch) {
            try { console.log('[Router._scheduleRouteDataLoad] admin recent switch tab=' + tab + ' → pulando (tab já está carregando via _switchAdminTab)'); } catch(_lgr){}
          } else if (typeof AppState.loadAdminData === 'function') {
            Promise.resolve().then(function(){ return AppState.loadAdminData(tab, false); })
              .then(function(changed){
                if (changed && self.currentRoute === 'admin') {
                  try { self.refreshCurrentView(true); } catch(_r2){}
                }
              }).catch(function(){});
          } else if (typeof AppState.refreshFromSupabase === 'function') {
            Promise.resolve().then(function(){ return AppState.refreshFromSupabase({scope:'admin',force:false}); })
              .then(function(){ if (self.currentRoute === 'admin') { try { self.refreshCurrentView(true); } catch(_r3){} } })
              .catch(function(){});
          }
        }
        if (route === 'referrals' && AppState && typeof AppState.refreshReferralsBonusReport === 'function') {
          Promise.resolve().then(function(){ return AppState.refreshReferralsBonusReport({force:false}); })
            .then(function(changed){
              if (changed && self.currentRoute === 'referrals') { try { self.refreshCurrentView(true); } catch(_r4){} }
            }).catch(function(){});
        }
        if (route === 'position' && AppState && typeof AppState.refreshTreeNetwork === 'function') {
          Promise.resolve()
            .then(function(){ return AppState.refreshTreeNetwork(); })
            .then(function(hadData){
              try { window._treeReady = !!hadData; } catch(_){}
              if (self.currentRoute === 'position') {
                try { TreeEngine.render(); } catch(_eTr){}
                try { self.refreshCurrentView(true); } catch(_rP){}
              }
            })
            .catch(function(){});
        }
      }, 0);
    } catch(_sdl){}
  },

  refreshCurrentView(bypassDebounce) {
    var self = this;
    if (bypassDebounce === true) {
      try { clearTimeout(self._refreshDebounceTimer); } catch(_){}
      self._refreshDebounceTimer = null;
      try {
        self._renderCount++;
        var route = self.currentRoute;
        var c = self._renderCount;
        // #region debug-point H1:Router.refresh-bypass
        try { if (window.__dbg && typeof window.__dbg.store === 'function') window.__dbg.store('H1', 'Router.js:refreshCurrentView(bypass)', 'Router.refresh bypass', { count: c, route: route, bypass: true, adminActiveTab: (window.AppState && AppState.adminActiveTab) || null }); } catch(_dH1){}
        // #endregion
        try { console.log('[Router.refresh] #' + c + ' route=' + route + ' t=' + Date.now()); } catch(_lg){}
        self.renderView(route);
      } catch(e) { try { console.log('[Router.refresh ERR]:', String((e&&e.message)||e)); } catch(_le){} }
      return;
    }
    try { clearTimeout(self._refreshDebounceTimer); } catch(_){}
    self._refreshDebounceTimer = setTimeout(function(){
      try {
        self._refreshDebounceTimer = null;
        self._renderCount++;
        var route2 = self.currentRoute;
        var c2 = self._renderCount;
        // #region debug-point H1:Router.refresh-debounced
        try { if (window.__dbg && typeof window.__dbg.store === 'function') window.__dbg.store('H1', 'Router.js:refreshCurrentView(debounced)', 'Router.refresh debounced', { count: c2, route: route2, bypass: false, adminActiveTab: (window.AppState && AppState.adminActiveTab) || null }); } catch(_dH1d){}
        // #endregion
        try { console.log('[Router.refresh] #' + c2 + ' route=' + route2 + ' t=' + Date.now()); } catch(_lg2){}
        self.renderView(route2);
      } catch(e2) { try { console.log('[Router.refresh ERR debounced]:', String((e2&&e2.message)||e2)); } catch(_le2){} }
    }, 180);
  },

  isAuthenticated() {
    try {
      if (AppState && AppState.isAuthenticated === true) return true;
      if (AppState && AppState.currentUser && AppState.currentUser.id) return true;
      if (AppState && AppState.sbAuth && AppState.sbAuth.id) return true;
    } catch(_) {}
    return false;
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
    const localRole = AppState && AppState.userRole === 'admin';
    const directFlag = AppState && AppState.isAdmin === true;
    const bancoRole = AppState && AppState.sbProfile && (AppState.sbProfile.role === 'admin' || AppState.sbProfile.role === 'superadmin');
    const currentRole = AppState && AppState.currentUser && (AppState.currentUser.role === 'admin' || AppState.currentUser.role === 'superadmin');
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
    try { this._routeDataLoaded = Object.create(null); } catch(_rl){}
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(_s1){}
    this.renderNav();
    this.renderView(route, params);

    try { document.getElementById('mobile-menu').classList.add('hidden'); } catch(_m1){}
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
        ? `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 border border-brand/40 text-brand text-[10px] font-black font-mono uppercase tracking-wider shadow-neon-sm"><span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>${I18n.t('statusBadgeActive')}</span>`
        : `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-black font-mono uppercase tracking-wider"><i class="fa-solid fa-clock text-[10px]"></i>${I18n.t('statusBadgePending')}</span>`;

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
    params = params || {};
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
        var regSponsor = this._resolveRegisterSponsor(params);
        app.innerHTML = Views.Register(regSponsor);
        break;
      case 'dashboard':
        app.innerHTML = Views.Dashboard();
        Countdown.start('presale-timer-dash', AppState.projectSettings.presaleEndDate);
        this._scheduleRouteDataLoad(route);
        break;
      case 'position':
        app.innerHTML = Views.Position();
        try { TreeEngine.init(); } catch(_) {}
        this._scheduleRouteDataLoad(route);
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
        this._scheduleRouteDataLoad(route);
        break;
      case 'deposit':
        app.innerHTML = Views.Deposit();
        this._scheduleRouteDataLoad(route);
        break;
      case 'referrals':
        app.innerHTML = Views.Referrals();
        this._scheduleRouteDataLoad(route);
        break;
      case 'profile':
        app.innerHTML = Views.Profile();
        this._scheduleRouteDataLoad(route);
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
        this._scheduleRouteDataLoad(route);
        break;
      default:
        app.innerHTML = Views.Landing();
    }
    I18n.updatePageTranslations();
  }
};

/* ============================================================
   FOURHASH — Roteador SPA (Single Page Application)
   Depende de: AppState, I18n, Views, TreeEngine, Countdown, UI
   ============================================================ */

const Router = {
  currentRoute: 'landing',

  navigate(route, params = {}) {
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

    if (AppState.isAuthenticated) {
      notifWrappers.forEach(el => el.classList.remove('hidden'));

      let links = `
        <button onclick="Router.navigate('dashboard')" class="hover:text-brand transition ${this.currentRoute === 'dashboard' ? 'text-brand font-bold' : ''}">${I18n.t('navDashboard')}</button>
        <button onclick="Router.navigate('position')" class="hover:text-brand transition ${this.currentRoute === 'position' ? 'text-brand font-bold' : ''}">${I18n.t('navPosition')}</button>
        <button onclick="Router.navigate('wallet')" class="hover:text-brand transition ${this.currentRoute === 'wallet' ? 'text-brand font-bold' : ''}">${I18n.t('navWallet')}</button>
        <button onclick="Router.navigate('deposit')" class="hover:text-brand transition ${this.currentRoute === 'deposit' ? 'text-brand font-bold' : ''}">${I18n.t('navDeposit')}</button>
        <button onclick="Router.navigate('referrals')" class="hover:text-brand transition ${this.currentRoute === 'referrals' ? 'text-brand font-bold' : ''}">${I18n.t('navReferrals')}</button>
      `;

      if (AppState.userRole === 'admin') {
        links += `<button onclick="Router.navigate('admin')" class="text-amber-400 hover:text-amber-300 transition font-bold ${this.currentRoute === 'admin' ? 'underline' : ''}"><i class="fa-solid fa-crown mr-1"></i>${I18n.t('navAdmin')}</button>`;
      }

      nav.innerHTML = links;

      mobileNav.innerHTML = `
        <div class="flex items-center gap-3 p-3 bg-brand-surface rounded-xl border border-white/10 mb-4">
          <div class="w-10 h-10 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center font-bold text-brand">
            @${AppState.currentUser.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="font-bold text-sm text-white">@${AppState.currentUser.username}</div>
            <div class="text-[10px] text-brand font-mono">Nível ${AppState.currentUser.level} • ${AppState.currentUser.positionNumber}</div>
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
          <button onclick="Router.navigate('dashboard')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-chart-pie mr-2 text-brand"></i>${I18n.t('navDashboard')}</button>
          <button onclick="Router.navigate('position')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-sitemap mr-2 text-brand"></i>${I18n.t('navPosition')}</button>
          <button onclick="Router.navigate('wallet')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-wallet mr-2 text-brand"></i>${I18n.t('navWallet')}</button>
          <button onclick="Router.navigate('deposit')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-arrow-down-to-bracket mr-2 text-brand"></i>${I18n.t('navDeposit')}</button>
          <button onclick="Router.navigate('referrals')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-users mr-2 text-brand"></i>${I18n.t('navReferrals')}</button>
          <button onclick="Router.navigate('security')" class="p-2.5 rounded-lg bg-brand-card text-left text-xs font-medium hover:text-brand border border-white/5"><i class="fa-solid fa-shield-halved mr-2 text-brand"></i>${I18n.t('navSecurity')}</button>
        </div>
        <button onclick="Router.logout()" class="w-full mt-2 py-2 text-center text-xs text-red-400 hover:text-red-300 font-medium border border-red-500/20 rounded-lg"><i class="fa-solid fa-right-from-bracket mr-1"></i>${I18n.t('logout')}</button>
      `;

      authAction.innerHTML = `
        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button onclick="Router.navigate('profile')" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card hover:border-brand/40 text-xs transition">
            <span class="w-2 h-2 rounded-full bg-brand animate-ping"></span>
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
  },

  logout() {
    AppState.isAuthenticated = false;
    UI.showToast('Você desconectou da sua conta.', 'info');
    this.navigate('landing');
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

    switch (route) {
      case 'landing':
        app.innerHTML = Views.Landing();
        Countdown.start('presale-timer-landing', AppState.projectSettings.presaleEndDate);
        break;
      case 'login':
        app.innerHTML = Views.Login();
        break;
      case 'register':
        app.innerHTML = Views.Register(params.ref || 'joao123');
        break;
      case 'dashboard':
        app.innerHTML = Views.Dashboard();
        Countdown.start('presale-timer-dash', AppState.projectSettings.presaleEndDate);
        break;
      case 'position':
        app.innerHTML = Views.Position();
        TreeEngine.init();
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
        if (AppState.userRole !== 'admin') {
          UI.showToast('Acesso restrito para administradores!', 'error');
          this.navigate('dashboard');
          return;
        }
        app.innerHTML = Views.Admin();
        break;
      default:
        app.innerHTML = Views.Landing();
    }
    I18n.updatePageTranslations();
  }
};

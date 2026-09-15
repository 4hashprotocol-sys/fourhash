/* ============================================================
   FOURHASH — Sistema de Temas Dark / Light
   Depende de: AppState, UI
   ============================================================ */

const Theme = {
  DEFAULT_THEME: 'dark',
  LS_KEY: 'fh_theme',

  init() {
    try {
      var stored = '';
      try { stored = (window.localStorage && localStorage.getItem(this.LS_KEY)) ? String(localStorage.getItem(this.LS_KEY)).trim() : ''; } catch(_ls){ stored = ''; }
      var want = (stored === 'light' || stored === 'dark') ? stored : this.DEFAULT_THEME;
      var html = document.documentElement;
      try { html.classList.remove('light'); } catch(_){}
      try { html.classList.remove('dark'); } catch(_){}
      try { html.classList.add(want); } catch(_){}
      try { if (window.AppState) AppState.currentTheme = want; } catch(_as){}
      this._updateIcon(want);
      this._applyBodyBg(want);
      return want;
    } catch(_initE) {
      try { document.documentElement.classList.add(this.DEFAULT_THEME); } catch(_){}
      return this.DEFAULT_THEME;
    }
  },

  _applyBodyBg(theme) {
    try {
      var body = document.body;
      if (!body) return;
      if (theme === 'light') {
        body.style.background = '#f7f8fb';
        body.style.color = '#0b1220';
      } else {
        body.style.background = '#000000';
        body.style.color = '#e5e7eb';
      }
    } catch(_){}
  },

  _updateIcon(theme) {
    try {
      var icon = document.getElementById('theme-icon');
      if (!icon) return;
      if (theme === 'light') {
        icon.className = 'fa-solid fa-sun text-xs text-amber-500';
      } else {
        icon.className = 'fa-solid fa-moon text-xs text-gray-300';
      }
    } catch(_u){}
  },

  current() {
    try {
      if (document.documentElement.classList.contains('light')) return 'light';
      return 'dark';
    } catch(_c){ return this.DEFAULT_THEME; }
  },

  toggle() {
    var isDark = true;
    try { isDark = document.documentElement.classList.contains('dark'); } catch(_t){ isDark = true; }
    var next = isDark ? 'light' : 'dark';
    try {
      var html = document.documentElement;
      try { html.classList.remove('dark'); } catch(_){}
      try { html.classList.remove('light'); } catch(_){}
      try { html.classList.add(next); } catch(_){}
    } catch(_cls){}
    try { if (window.AppState) AppState.currentTheme = next; } catch(_as){}
    try { if (window.localStorage) localStorage.setItem(this.LS_KEY, next); } catch(_ls){}
    this._updateIcon(next);
    this._applyBodyBg(next);
    try { if (window.I18n && typeof I18n.t === 'function') {
      var label = next === 'dark' ? (I18n.t('themeDarkLabel') || 'Tema Dark ativado') : (I18n.t('themeLightLabel') || 'Tema Light ativado');
      if (window.UI && typeof UI.showToast === 'function') UI.showToast(label, 'info');
    } } catch(_toast){}
    try { if (window.Router && typeof Router.refreshCurrentView === 'function') try { Router.refreshCurrentView(true); } catch(_rf){} } catch(_rr){}
  }
};

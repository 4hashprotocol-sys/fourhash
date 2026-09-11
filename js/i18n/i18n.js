/* ============================================================
   FOURHASH — Motor de Internacionalização (i18n)
   Depende de: translations, AppState
   ============================================================ */

const I18n = {
  t(key) {
    const lang = AppState.currentLang;
    return (translations[lang] && translations[lang][key]) || translations['pt'][key] || key;
  },

  setLanguage(langCode) {
    if (!translations[langCode]) return;
    AppState.currentLang = langCode;
    localStorage.setItem('fh_lang', langCode);

    const flags = { pt: '🇵🇹', en: '🇺🇸', es: '🇪🇸', zh: '🇨🇳', ja: '🇯🇵', th: '🇹🇭', fr: '🇫🇷', ru: '🇷🇺' };
    document.getElementById('current-lang-flag').innerText = flags[langCode] || '🌐';
    document.getElementById('current-lang-code').innerText = langCode.toUpperCase();

    document.getElementById('lang-dropdown').classList.add('hidden');
    this.updatePageTranslations();
    Router.renderNav();
    Router.refreshCurrentView();
    UI.showToast(`${I18n.t('languageChanged')}: ${langCode.toUpperCase()}`, 'success');

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) themeBtn.setAttribute('title', I18n.t('toggleTheme'));
  },

  updatePageTranslations(scope = document) {
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      if (el.children.length === 0) {
        el.textContent = this.t(key);
      } else {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        let firstTextNode = null;
        while (walker.nextNode()) {
          if (walker.currentNode.nodeValue.trim()) {
            firstTextNode = walker.currentNode;
            break;
          }
        }
        if (firstTextNode) firstTextNode.nodeValue = this.t(key);
      }
    });
  }
};

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

window.onload = function() {
  AppState.init();

  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.setAttribute('title', I18n.t('toggleTheme'));

  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  if (refCode) {
    Router.navigate('register', { ref: refCode });
    UI.showToast(`Cadastro iniciado através do link de @${refCode}`, 'info');
  } else {
    Router.navigate('landing');
  }
};

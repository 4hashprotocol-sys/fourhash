/* ============================================================
   FOURHASH — Sistema de Temas Dark / Light
   Depende de: AppState, UI
   ============================================================ */

const Theme = {
  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      AppState.currentTheme = 'light';
      document.getElementById('theme-icon').className = 'fa-solid fa-sun text-xs text-amber-500';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      AppState.currentTheme = 'dark';
      document.getElementById('theme-icon').className = 'fa-solid fa-moon text-xs text-gray-300';
    }
    localStorage.setItem('fh_theme', AppState.currentTheme);
    UI.showToast(`Tema ${AppState.currentTheme === 'dark' ? 'Dark' : 'Light'} ativado`, 'info');
  }
};

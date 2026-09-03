/* ============================================================
   FOURHASH — Contador Regressivo
   ============================================================ */

const Countdown = {
  intervalId: null,

  start(elementId, targetDateStr) {
    const target = new Date(targetDateStr).getTime();

    const update = () => {
      const el = document.getElementById(elementId);
      if (!el) return;

      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        el.innerHTML = `<div class="col-span-4 text-brand font-mono font-bold text-lg">PRÉ-CADASTRO ENCERRADO</div>`;
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      el.innerHTML = `
        <div class="rounded-xl bg-brand-surface border border-white/10 p-2 sm:p-3">
          <span class="text-xl sm:text-3xl font-black text-white font-mono">${String(d).padStart(2, '0')}</span>
          <div class="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">${I18n.t('days')}</div>
        </div>
        <div class="rounded-xl bg-brand-surface border border-white/10 p-2 sm:p-3">
          <span class="text-xl sm:text-3xl font-black text-white font-mono">${String(h).padStart(2, '0')}</span>
          <div class="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">${I18n.t('hours')}</div>
        </div>
        <div class="rounded-xl bg-brand-surface border border-white/10 p-2 sm:p-3">
          <span class="text-xl sm:text-3xl font-black text-white font-mono">${String(m).padStart(2, '0')}</span>
          <div class="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">${I18n.t('minutes')}</div>
        </div>
        <div class="rounded-xl bg-brand-surface border border-white/10 p-2 sm:p-3">
          <span class="text-xl sm:text-3xl font-black text-brand font-mono">${String(s).padStart(2, '0')}</span>
          <div class="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5">${I18n.t('seconds')}</div>
        </div>
      `;
    };

    update();
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(update, 1000);
  }
};

/* =============================================================================
   NowPayments — Frontend Wrapper (chama endpoints /api locais)
   - NÃO coloca a API Key aqui (fica só no server-side /api/* Vercel Functions)
   - Fluxo: createPayment → getStatus (polling) → IPN confirma e ativa conta
   ============================================================================= */
(function(global){
  'use strict';

  const NP = {
    _activePoll: null,

    _base() {
      const h = (global.location && global.location.origin) ? global.location.origin : '';
      return h + '/api';
    },

    async createPayment(opts) {
      opts = opts || {};
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      const s = AppState && AppState.projectSettings ? AppState.projectSettings : {};
      const body = {
        amount: Number(opts.amount || s.entryAmount || 10),
        currency: String(opts.currency || 'USD').toUpperCase(),
        pay_currency: String(opts.pay_currency || 'usdtbep20,usdttrc20,usdterc20,btc,eth,ltc,xrp').toLowerCase(),
        profile_id: opts.profile_id || u.id || '',
        username: opts.username || u.username || 'user',
        email: opts.email || u.email || '',
        order_description: opts.order_description || `Ativacao FourHash @${u.username || 'user'} - US$ ${Number(opts.amount || s.entryAmount || 10)}`,
        kind: opts.kind || 'activation'
      };
      try {
        const r = await fetch(`${this._base()}/np-create-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await r.json();
        if (!r.ok || !json.ok) {
          throw new Error((json && (json.error || json.message || json.detail)) || 'Falha ao criar pagamento.');
        }
        return json;
      } catch(err) {
        UI && UI.showToast && UI.showToast('Falha ao criar pagamento: ' + (err.message || err), 'error');
        throw err;
      }
    },

    async getStatus(paymentId) {
      if (!paymentId) throw new Error('payment_id required');
      const r = await fetch(`${this._base()}/np-status?id=${encodeURIComponent(paymentId)}`);
      return await r.json();
    },

    startPolling(paymentId, opts) {
      opts = opts || {};
      this.stopPolling();
      const interval = Number(opts.intervalMs || 5000);
      const onUpdate = opts.onUpdate || function(){};
      const onFinal = opts.onFinal || function(){};
      const timeoutAfter = Number(opts.timeoutMs || 1000 * 60 * 30);
      const started = Date.now();
      let fired = false;

      const tick = async () => {
        try {
          const st = await this.getStatus(paymentId);
          onUpdate(st);
          const status = String(st.payment_status || '').toLowerCase();
          if (['finished','confirmed','completed','success'].indexOf(status) >= 0) {
            this.stopPolling();
            if (!fired) { fired = true; onFinal(st, true); }
            return;
          }
          if (['failed','expired','refunded','rejected'].indexOf(status) >= 0) {
            this.stopPolling();
            if (!fired) { fired = true; onFinal(st, false); }
            return;
          }
          if (Date.now() - started > timeoutAfter) {
            this.stopPolling();
            if (!fired) { fired = true; onFinal(st || { payment_status: 'timeout' }, false); }
            return;
          }
        } catch(err) { /* swallow, keep polling */ }
      };
      this._activePoll = setInterval(tick.bind(this), interval);
      tick.call(this);
    },

    stopPolling() {
      if (this._activePoll) { clearInterval(this._activePoll); this._activePoll = null; }
    },

    qrUrl(text, size) {
      size = size || 220;
      const s = encodeURIComponent(String(text || ''));
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&data=${s}`;
    }
  };

  global.NowPayments = NP;
})(window || globalThis);

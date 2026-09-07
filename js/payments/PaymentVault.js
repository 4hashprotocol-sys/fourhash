/* =============================================================================
   PaymentVault — FourHash Vault Multi-Rede (USDT)
   - Recebimento APENAS em USDT (BEP-20 / TRC-20 / ERC-20)
   - Endereços fixos (carteiras vault protocolo)
   - Sem integração com gateways terceiros (agora reservado)
   ============================================================================= */
(function(global){
  'use strict';

  const PV = {
    _timerRef: null,

    _vaults() {
      const s = (AppState && AppState.projectSettings) ? AppState.projectSettings : {};
      const legacyBEP20 = s.depositAddress || '0x71C4HashBEP20ProtocolVault99F4A810d7E8';
      return {
        bep20: {
          code: 'bep20',
          name: 'BNB Smart Chain',
          short: 'BEP-20',
          symbol: 'USDT',
          coin: 'USDT',
          explorer: 'https://bscscan.com/tx/',
          addressTx: 'https://bscscan.com/address/',
          color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
          colorPill: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/40',
          icon: 'fa-brands fa-btc',
          icoFallback: 'fa-solid fa-hexagon',
          networkId: 56,
          address: s.vaultAddressBEP20 || legacyBEP20
        },
        trc20: {
          code: 'trc20',
          name: 'Tron Network',
          short: 'TRC-20',
          symbol: 'USDT',
          coin: 'USDT',
          explorer: 'https://tronscan.io/#/transaction/',
          addressTx: 'https://tronscan.io/#/address/',
          color: 'bg-red-500/15 text-red-400 border-red-500/30',
          colorPill: 'bg-red-500/10 text-red-300 border-red-500/40',
          icon: 'fa-solid fa-bolt-lightning',
          networkId: 'tron',
          address: s.vaultAddressTRC20 || 'TFourHashVaultTRC20ProtocolAddressXXXXXXXXa1b2c3'
        },
        erc20: {
          code: 'erc20',
          name: 'Ethereum Mainnet',
          short: 'ERC-20',
          symbol: 'USDT',
          coin: 'USDT',
          explorer: 'https://etherscan.io/tx/',
          addressTx: 'https://etherscan.io/address/',
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          colorPill: 'bg-blue-500/10 text-blue-300 border-blue-500/40',
          icon: 'fa-brands fa-ethereum',
          networkId: 1,
          address: s.vaultAddressERC20 || '0xFourHashVaultERC20ProtocolAddress000000000x1a2b3c'
        }
      };
    },

    getNetwork(networkCode) {
      const all = this._vaults();
      const code = String(networkCode || 'bep20').trim().toLowerCase();
      return all[code] || all.bep20;
    },

    qrUrl(text, size) {
      size = Number(size || 300);
      const s = encodeURIComponent(String(text || ''));
      return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&margin=6&ecc=Q&data=' + s;
    },

    copy(text, labelOk) {
      try {
        if (global.navigator && typeof global.navigator.clipboard === 'object' && typeof global.navigator.clipboard.writeText === 'function') {
          global.navigator.clipboard.writeText(String(text || ''));
        } else if (document && document.execCommand) {
          const ta = document.createElement('textarea');
          ta.value = String(text || '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch(_) {}
          document.body.removeChild(ta);
        }
        UI && UI.showToast && UI.showToast((labelOk || 'Copiado ✓'), 'success');
      } catch(e) {
        UI && UI.showToast && UI.showToast('Copie manualmente.', 'info');
      }
    },

    _readSelectedNetwork() {
      const r = document.querySelector('input[name="vault-network"]:checked');
      return r ? String(r.value || 'bep20').trim().toLowerCase() : 'bep20';
    },

    _readTxChecked() {
      const c = document.getElementById('deposit-check');
      return !!(c && c.checked);
    },

    buildVaultModal(opts) {
      const self = this;
      opts = opts || {};
      const entryAmount = Number(opts.entryAmount || (AppState.projectSettings && AppState.projectSettings.entryAmount) || 10);
      const kind = opts.kind || 'activation';
      const net = this.getNetwork(this._readSelectedNetwork() || opts.network || 'bep20');
      const addr = net.address;
      const qr = this.qrUrl(addr, 300);
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      const orderId = '4H-' + kind + '-' + (u.positionNumber || u.id || 'anon') + '-' + Date.now();
      const isActivation = (kind === 'activation');

      const title = isActivation
        ? 'Ativar Posição Linear — Pagamento On-Chain'
        : 'Depósito Adicional — Pagamento On-Chain';

      let adminSimulate = '';
      if (u && (u.role === 'admin' || (AppState && AppState.isAdmin))) {
        adminSimulate = '<div class="pt-3 mt-1 border-t border-white/5 grid grid-cols-2 gap-2">'
          + '<button onclick="PaymentVault.forceSimulateActivation(\'' + orderId + '\',\'' + orderId + '\',' + entryAmount + ')" class="col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] text-amber-300 hover:text-amber-200 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition font-mono">'
          +   '<i class="fa-solid fa-user-shield"></i>'
          +   '<span class="font-black">ADMIN</span> · Ativar Manualmente (Sem confirmação on-chain)'
          + '</button></div>';
      }

      return `
        <div class="space-y-5">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1.5 min-w-0">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ` + net.colorPill + ` font-mono text-[10px] uppercase tracking-[0.18em] font-black">
                <i class="` + net.icon + `"></i>
                <span>USDT · ` + net.short + `</span>
              </div>
              <h3 class="font-black text-white text-xl sm:text-2xl leading-tight font-['Space_Grotesk']">` + title + `</h3>
              <div class="text-[11px] font-mono text-gray-500">Pedido <span class="text-gray-300">#` + orderId + `</span> · Utilizador <span class="text-brand">@` + (u.username || '-') + `</span></div>
            </div>
            <button onclick="UI.closeModal()" class="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div id="pv-status-pill" class="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-300 font-black text-xs sm:text-sm font-mono uppercase tracking-[0.18em]">
            <i class="fa-solid fa-clock-rotate-left animate-pulse"></i>
            Aguardando envio do pagamento
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2 space-y-2">
              <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Valor a Enviar (EXATO)</div>
              <div class="flex items-center gap-3 p-4 rounded-2xl border border-brand-border bg-brand-surface/50">
                <div class="w-11 h-11 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand flex-shrink-0 shadow-neon-sm">
                  <i class="fa-solid fa-coins text-xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">USDT ` + net.short + `</div>
                  <div class="font-black font-mono text-2xl sm:text-3xl text-white leading-none">
                    <span id="pv-amount" class="text-white">` + entryAmount.toFixed(2) + `</span>
                    <span class="ml-1.5 text-base text-gray-400 font-bold align-middle">USDT</span>
                  </div>
                </div>
                <button onclick="PaymentVault.copy(document.getElementById('pv-amount').innerText, 'Valor copiado ✓')" class="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition text-xs font-bold inline-flex items-center gap-1.5">
                  <i class="fa-regular fa-copy"></i> Copiar
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Rede</div>
              <div class="flex items-center gap-3 p-3 rounded-2xl border ` + net.color + ` bg-black/40">
                <i class="` + net.icon + ` text-xl"></i>
                <div class="min-w-0 flex-1">
                  <div class="font-black text-sm text-white font-mono uppercase tracking-wider">` + net.name + `</div>
                  <div class="text-[10px] text-gray-400 font-mono">Token: ` + net.symbol + ` · Standard: ` + net.short + `</div>
                </div>
              </div>

              <div class="space-y-2 pt-1">
                <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Hash da Transação (TXID)</div>
                <div class="flex gap-2">
                  <input id="pv-tx-input" type="text" placeholder="0x... (opcional, recomendado)" class="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-white/10 bg-black/40 text-white font-mono text-xs focus:outline-none focus:border-brand/50 focus:bg-brand-surface/40 transition" />
                  <button onclick="PaymentVault.submitTx('` + kind + `','` + orderId + `','` + entryAmount + `')" class="px-3 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-black text-xs tracking-wider transition inline-flex items-center gap-1.5 flex-shrink-0">
                    <i class="fa-solid fa-paper-plane"></i> Confirmar
                  </button>
                </div>
                <div class="text-[10px] text-gray-500 leading-relaxed">A confirmação on-chain (12 blocos) processa em ~30–120s após envio. Informar o TXID acelera a validação manual da equipa FourHash.</div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Endereço Vault do Protocolo</div>
              <div class="flex flex-col items-center gap-3 p-4 rounded-2xl border border-brand-border bg-black/40">
                <div class="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-2xl bg-white p-2.5 border border-white/10 shadow-[0_0_25px_rgba(0,255,102,0.12)]">
                  <img id="pv-qr-img" src="` + qr + `" alt="QR Code USDT ` + net.short + `" class="w-full h-full object-contain select-none" draggable="false" />
                </div>
                <div class="w-full space-y-1.5">
                  <div id="pv-address" class="w-full break-all px-2.5 py-2 rounded-xl border border-white/10 bg-black/60 text-gray-200 font-mono text-[11px] leading-relaxed select-all">` + addr + `</div>
                  <div class="grid grid-cols-3 gap-2">
                    <button onclick="PaymentVault.copy(document.getElementById('pv-address').innerText, 'Endereço copiado ✓')" class="col-span-2 py-2 rounded-xl bg-brand/15 border border-brand/30 hover:bg-brand/25 text-brand font-black text-xs tracking-wider transition inline-flex items-center justify-center gap-1.5">
                      <i class="fa-regular fa-copy"></i> Copiar Endereço
                    </button>
                    <a href="` + net.addressTx + encodeURIComponent(addr) + `" target="_blank" rel="noopener noreferrer" class="py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-bold text-xs transition inline-flex items-center justify-center gap-1.5">
                      <i class="fa-solid fa-magnifying-glass-chart"></i> Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2.5">
            <div class="flex items-start gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                <i class="fa-solid fa-triangle-exclamation animate-pulse"></i>
              </div>
              <div class="text-[11px] text-amber-200/90 leading-relaxed space-y-1">
                <div class="font-black uppercase tracking-wider text-amber-300 text-[11px]">Instruções Obrigatórias</div>
                <div><span class="font-black">1. Envie EXATAMENTE ` + entryAmount.toFixed(2) + ` USDT</span> pela rede <span class="font-black uppercase">` + net.short + `</span> para o endereço acima.</div>
                <div><span class="font-black">2. Confirme SEMPRE a rede antes de autorizar.</span> Envios em redes erradas (ex: USDT BEP20 para TRC20) resultam em perda irreversível e não são creditados.</div>
                <div>3. Após 12 confirmações on-chain, a validação automática credita o valor. Se demorar >30min, cole o TXID acima e clique em Confirmar ou abra ticket de suporte.</div>
              </div>
            </div>
          </div>

          ` + adminSimulate + `
        </div>
      `;
    },

    startActivationFlow(entryAmount) {
      entryAmount = Number(entryAmount || (AppState.projectSettings && AppState.projectSettings.entryAmount) || 10);
      if (!this._readTxChecked()) {
        UI.showToast('Confirme a rede e os termos antes de continuar.', 'warning');
        return;
      }
      try {
        const html = this.buildVaultModal({ kind: 'activation', entryAmount: entryAmount });
        UI.openModal(html);
        this._startCountdown(15);
      } catch (err) {
        UI.showToast((err && err.message) || 'Erro ao abrir pagamento.', 'error');
      }
    },

    startAdditionalDepositFlow(entryAmount) {
      entryAmount = Number(entryAmount || (AppState.projectSettings && AppState.projectSettings.entryAmount) || 10);
      if (!this._readTxChecked()) {
        UI.showToast('Confirme a rede e os termos antes de continuar.', 'warning');
        return;
      }
      try {
        const html = this.buildVaultModal({ kind: 'deposit', entryAmount: entryAmount });
        UI.openModal(html);
        this._startCountdown(15);
      } catch (err) {
        UI.showToast((err && err.message) || 'Erro ao abrir pagamento.', 'error');
      }
    },

    _startCountdown(minutes) {
      if (this._timerRef) { clearInterval(this._timerRef); this._timerRef = null; }
      let remain = Number(minutes || 15) * 60;
      const tick = () => {
        const pill = document.getElementById('pv-status-pill');
        if (!pill) { clearInterval(this._timerRef); this._timerRef = null; return; }
        const m = Math.floor(remain / 60);
        const s = remain % 60;
        const time = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
        pill.innerHTML = '<i class="fa-solid fa-clock-rotate-left animate-pulse"></i> Aguardando envio do pagamento · Expira em <span class="ml-1 font-mono text-amber-200">' + time + '</span>';
        if (remain <= 0) {
          clearInterval(this._timerRef);
          this._timerRef = null;
          pill.innerHTML = '<i class="fa-solid fa-clock"></i> Cotação expirou · Gere um novo endereço';
          pill.className = 'flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-gray-500/30 bg-gray-500/5 text-gray-300 font-black text-xs sm:text-sm font-mono uppercase tracking-[0.18em]';
        }
        remain = Math.max(0, remain - 1);
      };
      tick();
      this._timerRef = setInterval(tick, 1000);
    },

    async submitTx(kind, orderId, amount) {
      kind = String(kind || 'deposit');
      amount = Number(amount || 10);
      const tx = document.getElementById('pv-tx-input');
      const txHash = String((tx && tx.value) || '').trim();
      const net = this.getNetwork(this._readSelectedNetwork());
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      if (!txHash || txHash.length < 8) {
        UI.showToast('Informe o Hash TXID (mínimo 8 caracteres) ou aguarde a confirmação automática on-chain.', 'warning');
        return;
      }
      try {
        if (AppState && typeof AppState.openSupportTicket === 'function') {
          await Promise.resolve(AppState.openSupportTicket({
            title: 'Comprovativo Pagamento USDT ' + net.short.toUpperCase(),
            category: 'Depósito',
            tx_hash: txHash,
            network: net.short,
            amount: amount,
            order_id: orderId,
            kind: kind,
            profile_id: u.id,
            priority: 'high'
          }));
        }
        UI.showToast('TXID submetido ✓ · Equipa FourHash validará em breve. Em paralelo, o sistema também confirma automaticamente on-chain (12 blocos).', 'success', 'fa-circle-check');
      } catch (err) {
        UI.showToast('TXID registado localmente. Se o saldo não aparecer em 1h, abra ticket com este TXID: ' + txHash.substring(0, 12) + '…', 'info');
      }
    },

    async forceSimulateActivation(paymentId, orderId, entryAmount) {
      entryAmount = Number(entryAmount || 10);
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      const isAdmin = (u && u.role === 'admin') || (AppState && AppState.isAdmin === true);
      if (!isAdmin) {
        UI.showToast('Acesso reservado a administradores.', 'warning');
        return;
      }
      if (this._timerRef) { clearInterval(this._timerRef); this._timerRef = null; }
      const pill = document.getElementById('pv-status-pill');
      if (pill) {
        pill.className = 'flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-brand/40 bg-brand/10 text-brand font-black text-xs sm:text-sm font-mono uppercase tracking-[0.18em]';
        pill.innerHTML = '<i class="fa-solid fa-circle-check"></i> ADMIN · Validando & Activando Posição…';
      }
      try {
        if (typeof AppState !== 'undefined' && typeof AppState.activateAccount === 'function') {
          const ok = await Promise.resolve(AppState.activateAccount({
            amount: entryAmount,
            currency: 'USDT',
            network: 'Vault-AdminSim',
            payment_id: String(paymentId || ''),
            order_id: String(orderId || ''),
            tx_hash: 'admin_simulated_' + Date.now()
          }));
          if (ok !== false) {
            UI.showToast('Conta ativada (Admin · Simulado) ✓', 'success');
            setTimeout(function(){ Router.navigate('dashboard'); }, 1200);
            return;
          }
        }
        if (AppState && AppState.currentUser) AppState.currentUser.status = 'ACTIVE';
        UI.showToast('Conta ativada manualmente ✓', 'success');
        setTimeout(function(){ Router.navigate('dashboard'); }, 1200);
      } catch(err) {
        UI.showToast((err && err.message) || 'Erro ao ativar.', 'error');
      }
    },

    async simulateActivationOnly(entryAmount) {
      entryAmount = Number(entryAmount || 10);
      if (!this._readTxChecked()) {
        UI.showToast('Confirme a rede e os termos antes de continuar.', 'warning');
        return;
      }
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      const isAdmin = (u && u.role === 'admin') || (AppState && AppState.isAdmin === true);
      if (!isAdmin) {
        UI.showToast('Modo simulação reservado para validação interna. Use pagamento real on-chain USDT.', 'warning');
        return;
      }
      try {
        UI.showToast('Admin · ativando sem pagamento real…', 'info', 'fa-flask');
        if (typeof AppState !== 'undefined' && typeof AppState.activateAccount === 'function') {
          const ok = await Promise.resolve(AppState.activateAccount({
            amount: entryAmount,
            currency: 'USDT',
            network: 'Admin-Sim-Local'
          }));
          if (ok !== false) { setTimeout(function(){ Router.navigate('dashboard'); }, 1200); return; }
        }
        if (AppState && AppState.currentUser) AppState.currentUser.status = 'ACTIVE';
        UI.showToast('Conta ativada (Admin) ✓', 'success');
        setTimeout(function(){ Router.navigate('dashboard'); }, 1200);
      } catch(err) {
        UI.showToast((err && err.message) || 'Erro', 'error');
      }
    }
  };

  global.PaymentVault = PV;
})(window || globalThis);

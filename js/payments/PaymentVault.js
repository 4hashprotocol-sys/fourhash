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

    networkToPayCode(uiCode) {
      const code = String(uiCode || 'erc20').trim().toLowerCase();
      const map = {
        bep20: 'usdtbsc',
        usdtbep20: 'usdtbsc',
        trc20: 'usdttrc20',
        usdttrc20: 'usdttrc20',
        erc20: 'usdterc20',
        usdterc20: 'usdterc20',
        usdt: 'usdterc20'
      };
      return map[code] || 'usdterc20';
    },

    minAmountForNetwork(uiCode) {
      const code = String(uiCode || 'erc20').trim().toLowerCase();
      if (code === 'trc20' || code === 'usdttrc20') return 15;
      if (code === 'erc20' || code === 'usdterc20') return 9.5;
      if (code === 'bep20' || code === 'usdtbsc') return 9;
      return 9.5;
    },

    _setButtonLoading(loading) {
      const btn = document.getElementById('deposit-activate-btn');
      if (!btn) return;
      if (loading) {
        btn.disabled = true;
        btn.dataset.originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> A criar pagamento…';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
      } else {
        btn.disabled = false;
        if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      }
    },

    async _createPayment(kind, entryAmount, netUiCode) {
      kind = String(kind || 'deposit');
      entryAmount = Number(entryAmount || 10);
      const payCurrency = this.networkToPayCode(netUiCode);
      const u = AppState && AppState.currentUser ? AppState.currentUser : {};
      const body = {
        amount: entryAmount,
        price_currency: 'usd',
        pay_currency: payCurrency,
        profile_id: String(u.id || ''),
        username: String(u.username || 'guest'),
        email: String(u.email || ''),
        kind: kind,
        order_description: 'FourHash ' + (kind === 'activation' ? 'Ativacao' : 'Deposito') + ' @' + String(u.username || 'guest') + ' US$ ' + entryAmount
      };
      let ctrl = null;
      let to = null;
      try {
        if (window && 'AbortController' in window) {
          ctrl = new AbortController();
          to = setTimeout(function(){ try { ctrl.abort(); } catch(_) {} }, 9000);
        }
        const fetchOpts = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body)
        };
        if (ctrl) fetchOpts.signal = ctrl.signal;
        const raw = await fetch('/api/np-create-payment', fetchOpts);
        const res = await raw.json().catch(function(){ return {}; });
        if (raw.ok && res && res.ok === true) {
          if (to) clearTimeout(to);
          return { ok: true, fallback: false, data: res };
        }
        return { ok: false, fallback: true, reason: (res && res.error) || 'gateway_error', detail: res || null };
      } catch(err) {
        const aborted = err && (err.name === 'AbortError' || /abort/i.test(err.message || ''));
        return { ok: false, fallback: true, reason: aborted ? 'timeout' : (err && err.message) || 'network', detail: null };
      } finally {
        if (to) clearTimeout(to);
      }
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

      const useNowPayments = !!(opts.nowPayments && opts.nowPayments.pay_address);
      const np = opts.nowPayments || {};

      const payAddress = useNowPayments ? String(np.pay_address || '') : net.address;
      const payAmountRaw = useNowPayments ? Number(np.pay_amount || entryAmount) : entryAmount;
      const payAmount = Number(Number(payAmountRaw).toFixed(Math.max(2, (np.pay_currency === 'btc' || np.pay_currency === 'eth' ? 8 : 6))));
      const paymentId = String(np.payment_id || '');
      const paymentUrl = String(np.payment_url || '');
      const netTag = useNowPayments ? (String(np.network || net.short || '').toUpperCase()) : net.short;
      const netLabel = useNowPayments ? netTag : net.name;
      const extraTag = useNowPayments
        ? ('<div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">Gateway ID <span class="text-brand">' + paymentId.slice(0,10) + '…</span></div>')
        : '';
      const netColor = useNowPayments
        ? ('border-brand/50 bg-brand/10 text-brand')
        : net.color;
      const netIcon = (useNowPayments && np.network && /eth/i.test(np.network))
        ? 'fa-brands fa-ethereum'
        : net.icon;

      const addr = payAddress;
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
                <i class="` + netIcon + `"></i>
                <span>USDT · ` + netTag + `</span>
              </div>
              <h3 class="font-black text-white text-xl sm:text-2xl leading-tight font-['Space_Grotesk']">` + title + `</h3>
              <div class="text-[11px] font-mono text-gray-500">Pedido <span class="text-gray-300">#` + orderId + `</span> · Utilizador <span class="text-brand">@` + (u.username || '-') + `</span>` + extraTag + `</div>
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
                  <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">USDT ` + netTag + `</div>
                  <div class="font-black font-mono text-2xl sm:text-3xl text-white leading-none">
                    <span id="pv-amount" class="text-white">` + String(payAmount) + `</span>
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
              <div class="flex items-center gap-3 p-3 rounded-2xl border ` + netColor + ` bg-black/40">
                <i class="` + netIcon + ` text-xl"></i>
                <div class="min-w-0 flex-1">
                  <div class="font-black text-sm text-white font-mono uppercase tracking-wider">` + netLabel + `</div>
                  <div class="text-[10px] text-gray-400 font-mono">Token: USDT · Standard: ` + netTag + `</div>
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
                  <img id="pv-qr-img" src="` + qr + `" alt="QR Code USDT ` + netTag + `" class="w-full h-full object-contain select-none" draggable="false" />
                </div>
                <div class="w-full space-y-1.5">
                  <div id="pv-address" class="w-full break-all px-2.5 py-2 rounded-xl border border-white/10 bg-black/60 text-gray-200 font-mono text-[11px] leading-relaxed select-all">` + addr + `</div>
                  <div class="grid grid-cols-3 gap-2">
                    <button onclick="PaymentVault.copy(document.getElementById('pv-address').innerText, 'Endereço copiado ✓')" class="col-span-2 py-2 rounded-xl bg-brand/15 border border-brand/30 hover:bg-brand/25 text-brand font-black text-xs tracking-wider transition inline-flex items-center justify-center gap-1.5">
                      <i class="fa-regular fa-copy"></i> Copiar Endereço
                    </button>
                    <a href="` + (useNowPayments && paymentUrl ? paymentUrl : (net.addressTx + encodeURIComponent(addr))) + `" target="_blank" rel="noopener noreferrer" class="py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-bold text-xs transition inline-flex items-center justify-center gap-1.5">
                      <i class="fa-solid ` + (useNowPayments && paymentUrl ? 'fa-up-right-from-square' : 'fa-magnifying-glass-chart') + `"></i> ` + (useNowPayments && paymentUrl ? 'Pagamento' : 'Explorer') + `
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
                <div><span class="font-black">1. Envie EXATAMENTE ` + String(payAmount) + ` USDT</span> pela rede <span class="font-black uppercase">` + netTag + `</span> para o endereço acima.</div>
                <div><span class="font-black">2. Confirme SEMPRE a rede antes de autorizar.</span> Envios em redes erradas (ex: USDT BEP20 para TRC20) resultam em perda irreversível e não são creditados.</div>
                <div>3. Após 12 confirmações on-chain, a validação automática credita o valor. Se demorar >30min, cole o TXID acima e clique em Confirmar ou abra ticket de suporte.</div>
              </div>
            </div>
          </div>

          ` + adminSimulate + `
        </div>
      `;
    },

    async startActivationFlow(entryAmount) {
      const self = this;
      entryAmount = Number(entryAmount || (AppState.projectSettings && AppState.projectSettings.entryAmount) || 10);
      if (!this._readTxChecked()) {
        UI.showToast('Confirme a rede e os termos antes de continuar.', 'warning');
        return;
      }
      const netCode = this._readSelectedNetwork() || 'bep20';
      try {
        this._setButtonLoading(true);
        const r = await this._createPayment('activation', entryAmount, netCode);
        if (r.ok && r.data && r.data.pay_address) {
          try { AppState.currentPayment = Object.assign({ status: 'waiting', kind: 'activation' }, r.data); } catch(_) {}
          const html = this.buildVaultModal({
            kind: 'activation', entryAmount: entryAmount,
            network: netCode,
            nowPayments: {
              pay_address: r.data.pay_address,
              pay_amount: r.data.pay_amount,
              pay_currency: r.data.pay_currency,
              payment_id: r.data.payment_id,
              payment_url: r.data.payment_url,
              network: r.data.network
            }
          });
          UI.openModal(html);
          this._startCountdown(15);
        } else {
          const reason = String(r.reason || 'gateway').toLowerCase();
          this._showGatewayUnavailableModal(reason, netCode, entryAmount, 'activation');
        }
      } catch (err) {
        this._showGatewayUnavailableModal('internal', netCode, entryAmount, 'activation');
      } finally {
        this._setButtonLoading(false);
      }
    },

    async startAdditionalDepositFlow(entryAmount) {
      const self = this;
      entryAmount = Number(entryAmount || (AppState.projectSettings && AppState.projectSettings.entryAmount) || 10);
      if (!this._readTxChecked()) {
        UI.showToast('Confirme a rede e os termos antes de continuar.', 'warning');
        return;
      }
      const netCode = this._readSelectedNetwork() || 'bep20';
      try {
        this._setButtonLoading(true);
        const r = await this._createPayment('deposit', entryAmount, netCode);
        if (r.ok && r.data && r.data.pay_address) {
          try { AppState.currentPayment = Object.assign({ status: 'waiting', kind: 'deposit' }, r.data); } catch(_) {}
          const html = this.buildVaultModal({
            kind: 'deposit', entryAmount: entryAmount,
            network: netCode,
            nowPayments: {
              pay_address: r.data.pay_address,
              pay_amount: r.data.pay_amount,
              pay_currency: r.data.pay_currency,
              payment_id: r.data.payment_id,
              payment_url: r.data.payment_url,
              network: r.data.network
            }
          });
          UI.openModal(html);
          this._startCountdown(15);
        } else {
          const reason = String(r.reason || 'gateway').toLowerCase();
          this._showGatewayUnavailableModal(reason, netCode, entryAmount, 'deposit');
        }
      } catch (err) {
        this._showGatewayUnavailableModal('internal', netCode, entryAmount, 'deposit');
      } finally {
        this._setButtonLoading(false);
      }
    },

    _showGatewayUnavailableModal(reason, netCode, entryAmount, kind) {
      const netLabel = ({ bep20: 'BNB Smart Chain (BEP-20)', trc20: 'Tron (TRC-20)', erc20: 'Ethereum (ERC-20)' })[netCode] || netCode;
      let title = 'Serviço de pagamento temporariamente indisponível';
      let desc = 'O nosso gateway de pagamento não conseguiu gerar um endereço de recebimento válido neste momento.';
      let hint = '';
      const reasonMap = {
        'timeout': { t: 'O gateway demorou demasiado tempo a responder', d: 'Isto é temporário e normalmente resolve-se em 30 segundos.', h: 'Tente novamente dentro de 1 minuto. Se persistir, experimente outra rede (ERC-20 é a mais estável).' },
        'code_not_allowed': { t: 'Rede ' + netLabel + ' indisponível neste momento', d: 'A moeda selecionada não está ativa no gateway de pagamento.', h: 'Selecione uma rede diferente no menu acima (recomendamos ERC-20 USDT ou TRC-20 USDT) e tente novamente.' },
        'currency_not_enabled': { t: 'Rede ' + netLabel + ' ainda não ativada', d: 'A variante de USDT para esta rede ainda está a ser processada no nosso operador.', h: 'Utilize ERC-20 ou TRC-20 por agora; as restantes redes serão ativadas em breve automaticamente.' },
        'rate_limited': { t: 'Muitas tentativas de uma só vez', d: 'O gateway impôs um limite temporário para esta sessão.', h: 'Aguarde 60 segundos e volte a tentar gerar um novo endereço.' },
        'network': { t: 'Sem ligação ao gateway', d: 'Não foi possível contactar o servidor de pagamento.', h: 'Verifique a sua ligação à internet e tente novamente.' },
        'gateway_error': { t: 'Erro interno do operador de pagamento', d: 'O nosso parceiro de pagamento retornou um erro desconhecido.', h: 'Experimente mudar de rede ou volte a tentar daqui a 2 minutos.' },
        'internal': { t: 'Erro ao gerar endereço de pagamento', d: 'Ocorreu um erro interno ao preparar o seu pedido de pagamento.', h: 'Recarregue a página (Ctrl+Shift+R) e tente novamente. Se persistir, contacte o suporte.' }
      };
      const info = reasonMap[reason] || reasonMap['gateway_error'];
      title = info.t; desc = info.d; hint = info.h;
      const netOther = netCode === 'erc20' ? 'TRC-20' : (netCode === 'trc20' ? 'BEP-20' : 'ERC-20');
      const safeNetOther = netOther.replace(/'/g, '');
      const html = `
        <div class="space-y-5">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1.5 min-w-0">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-[10px] uppercase tracking-[0.18em] font-black">
                <i class="fa-solid fa-triangle-exclamation animate-pulse"></i>
                <span>Gateway Indisponível</span>
              </div>
              <h3 class="font-black text-white text-xl sm:text-2xl leading-tight font-['Space_Grotesk']">${title}</h3>
              <div class="text-[11px] font-mono text-gray-500 mt-1">Montante pretendido · US$ ${Number(entryAmount || 0).toFixed(2)} · Rede ${netLabel}</div>
            </div>
            <button onclick="UI.closeModal()" class="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-brand-surface/60 to-rose-500/5 p-4 space-y-2.5">
            <div class="text-xs text-gray-200 leading-relaxed">${desc}</div>
            ${hint ? `<div class="pt-2 text-[11px] text-amber-200/90 leading-relaxed border-t border-amber-500/20">
              <span class="font-black text-amber-200">Sugestão: </span>${hint}
            </div>` : ''}
          </div>

          <div class="space-y-1.5 text-[11px] text-gray-400 leading-relaxed px-1">
            <div>• Apenas são aceites endereços gerados automaticamente pelo nosso gateway. <span class="font-bold text-white">NÃO envie para endereços manuais</span> ou wallets partilhadas — existe risco de não creditar.</div>
            <div>• O valor exato de envio e o endereço correto só são mostrados <span class="font-bold text-white">quando o gateway responde com sucesso</span>.</div>
            <div>• Rede recomendada por agora: <span class="font-bold text-brand">${safeNetOther} USDT</span> (maior estabilidade no operador).</div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <button onclick="UI.closeModal()" class="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white font-bold text-xs tracking-wider transition inline-flex items-center justify-center gap-2">
              <i class="fa-solid fa-arrow-left"></i>
              Tentar outra rede
            </button>
            <button onclick="UI.closeModal(); PaymentVault.${kind === 'deposit' ? 'startAdditionalDepositFlow' : 'startActivationFlow'}(${Number(entryAmount || 0).toFixed(2)})" class="py-3 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-xs tracking-wider shadow-[0_0_30px_rgba(0,255,102,0.35)] transition transform hover:scale-[1.01] active:scale-100 inline-flex items-center justify-center gap-2">
              <i class="fa-solid fa-rotate-right"></i>
              Tentar Novamente
            </button>
          </div>
        </div>
      `;
      try { UI.openModal(html); } catch(_) { UI.showToast(title, 'warning', 'fa-triangle-exclamation'); }
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

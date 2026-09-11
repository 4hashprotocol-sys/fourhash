/* ============================================================
   FOURHASH — Utilitários de Interface (UI)
   Toasts, Modais, Clipboard, Dropdowns, Controles de Formulário
   ============================================================ */

const UI = {
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const icons = {
      success: 'fa-check-circle text-brand',
      error: 'fa-circle-xmark text-red-400',
      info: 'fa-circle-info text-blue-400'
    };

    toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass-panel shadow-2xl border border-brand-border text-xs text-white transition-all transform translate-y-2 opacity-0';
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info} text-base"></i>
      <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  },

  copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    this.showToast('✓ ' + I18n.t('copied'), 'success');
  },

  toggleLanguageMenu() {
    document.getElementById('lang-dropdown').classList.toggle('hidden');
  },

  toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
    if (!dropdown.classList.contains('hidden')) {
      this.renderNotificationList();
    }
  },

  renderNotificationList() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (!AppState.notifications || AppState.notifications.length === 0) {
      list.innerHTML = `
        <div class="px-4 py-10 text-center space-y-2">
          <div class="text-3xl opacity-40">📭</div>
          <p class="text-[11px] text-gray-500 font-medium">${I18n.t('notifEmpty')}</p>
          <p class="text-[9px] text-gray-600">${I18n.t('notifEmptyHint')}</p>
        </div>
      `;
      return;
    }

    list.innerHTML = AppState.notifications.map(n => `
      <div class="px-4 py-3 hover:bg-white/[0.02] transition ${n.read ? 'opacity-60' : 'bg-brand/5'}">
        <div class="flex items-center justify-between font-bold text-white mb-0.5">
          <span>${n.title}</span>
          <span class="text-[9px] text-gray-500 font-mono">${n.time}</span>
        </div>
        <p class="text-gray-300 text-[11px]">${n.message}</p>
      </div>
    `).join('');
  },

  toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash text-xs text-brand';
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye text-xs text-gray-400';
    }
  },

  openModal(contentHtml) {
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const content = document.getElementById('modal-content');

    content.innerHTML = contentHtml;
    backdrop.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      panel.classList.remove('translate-y-full');
    }, 10);
  },

  closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    backdrop.classList.add('opacity-0');
    panel.classList.add('translate-y-full');
    setTimeout(() => backdrop.classList.add('hidden'), 200);
  },

  openWithdrawModal() {
    const u = AppState.currentUser;
    const s = AppState.projectSettings.withdraw;
    const _st = (v) => Number(v || 0);
    const uiAvailable   = _st(u.availableBalance);    // SÓ bônus líquido
    const uiBlocked     = _st(u.blockedActivationBalance);
    const uiTotalBonus  = _st(u.totalBonusTeam) + _st(u.totalBonusMatrix);
    const uiTotalWithdrawn = _st(u.totalWithdrawn);
    const hasBonus = uiAvailable > 0 && uiAvailable >= s.minAmount;
    const maxPossible = hasBonus ? Math.min(uiAvailable, s.maxAmountPerRequest) : 0;

    const contentHtml = `
      <div class="space-y-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <i class="fa-solid fa-money-bill-transfer"></i>
              </div>
              <h3 class="text-lg font-bold text-white font-['Space_Grotesk']">${I18n.t('withdrawTitle')}</h3>
            </div>
            <p class="text-xs text-gray-400 mt-1.5 ml-[44px]">
              ${I18n.t('withdrawSubtitlePre')} <span class="text-brand font-bold">USDT BEP20</span> ${I18n.t('withdrawSubtitlePost')}
            </p>
          </div>
          <button onclick="UI.closeModal()" class="w-8 h-8 rounded-lg bg-brand-surface hover:bg-white/10 text-gray-400 hover:text-white transition shrink-0">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-brand-surface border border-white/5 text-xs">
          <div class="sm:col-span-1">
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('withdrawAvailNow')}</div>
            <div class="font-mono font-black ${hasBonus ? 'text-emerald-400' : 'text-gray-500'}">$ ${uiAvailable.toFixed(2)}</div>
          </div>
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('withdrawMinLabel')}</div>
            <div class="font-mono font-bold text-amber-300">$ ${s.minAmount.toFixed(2)}</div>
          </div>
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('withdrawNetworkFeeTitle')}</div>
            <div class="font-mono font-bold text-amber-300">$ ${s.networkFeeFlat.toFixed(2)}</div>
          </div>
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('withdrawBlockedActLabel') || 'Ativação bloqueada'}</div>
            <div class="font-mono font-black text-red-400">$ ${uiBlocked.toFixed(2)}</div>
          </div>
        </div>

        ${!hasBonus ? `
          <div class="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
            <div class="w-8 h-8 shrink-0 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="space-y-1 text-xs">
              <div class="font-bold text-red-300 font-mono uppercase tracking-wider">${I18n.t('withdrawNoBonusTitle') || 'Sem ganhos de rede para sacar'}</div>
              <div class="text-gray-300 leading-relaxed">
                ${I18n.t('withdrawNoBonusHint') || 'No FourHash, o depósito de ativação (40% Fundo Projeto + 60% Bônus distribuído ao upline) nunca pode ser sacado diretamente. Você só recebe valores quando indicados ativam nas suas 5 linhas (N1 50% + N2..N5 2,5% cada).'}
              </div>
              <div class="text-xs text-gray-400 pt-1">
                ${I18n.t('withdrawBonusProgress') || 'Seu histórico'}:
                <span class="text-emerald-400 font-bold font-mono"> Bônus ganhos: $ ${uiTotalBonus.toFixed(2)}</span>
                <span class="text-gray-500"> · </span>
                <span class="text-amber-300 font-bold font-mono">Já sacados: $ ${uiTotalWithdrawn.toFixed(2)}</span>
              </div>
              <button type="button" onclick="Router.navigate('referrals'); UI.closeModal();" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/40 bg-brand/10 text-brand font-bold text-[11px] hover:bg-brand/20 transition">
                <i class="fa-solid fa-users"></i>${I18n.t('withdrawGoReferrals') || 'Ver minhas indicações e bônus'}
              </button>
            </div>
          </div>
        ` : ''}

        <form onsubmit="event.preventDefault(); UI.submitWithdraw(this);" class="space-y-4 ${!hasBonus ? 'opacity-50 pointer-events-none' : ''}">
          <div>
            <label class="block text-xs font-mono text-gray-300 mb-1.5">${I18n.t('withdrawWalletLabel')} <span class="text-red-400">*</span></label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-brand/60"><i class="fa-solid fa-wallet text-xs"></i></div>
              <input id="withdraw_wallet" oninput="UI._withdrawRefreshCalc()" ${!hasBonus ? 'disabled' : ''} required minlength="42" maxlength="42" pattern="^0x[a-fA-F0-9]{40}$" placeholder="${I18n.t('withdrawWalletPlaceholder')}" class="w-full pl-9 pr-3 py-3 rounded-xl bg-brand-surface border border-white/10 focus:border-brand focus:outline-none text-white text-xs font-mono transition disabled:opacity-40 disabled:cursor-not-allowed"/>
            </div>
            <div class="text-[10px] text-gray-500 mt-1 font-mono">${I18n.t('withdrawWalletWarning')}</div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-mono text-gray-300">${I18n.t('withdrawAmountLabel')} <span class="text-red-400">*</span></label>
              <button type="button" ${!hasBonus ? 'disabled' : ''} onclick="document.getElementById('withdraw_amount').value = '${maxPossible.toFixed(2)}'; UI._withdrawRefreshCalc();" class="text-[10px] font-mono text-brand hover:text-brand-glow font-bold px-2 py-0.5 rounded border border-brand/30 bg-brand/10 disabled:opacity-40 disabled:cursor-not-allowed">
                ${I18n.t('withdrawAll')}
              </button>
            </div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-white font-mono text-sm">$</div>
              <input id="withdraw_amount" oninput="UI._withdrawRefreshCalc()" ${!hasBonus ? 'disabled' : ''} required type="number" step="0.01" min="${s.minAmount}" max="${maxPossible}" placeholder="${hasBonus ? (s.minAmount.toFixed(2) + ' – ' + maxPossible.toFixed(2)) : ('0.00 — ' + I18n.t('withdrawNoBonusShort') || 'Sem ganhos')}" class="w-full pl-8 pr-3 py-3 rounded-xl bg-brand-surface border border-white/10 focus:border-brand focus:outline-none text-white text-sm font-bold font-mono transition disabled:opacity-40 disabled:cursor-not-allowed"/>
            </div>
          </div>

          <div class="rounded-xl border border-white/5 bg-black/30 p-4 space-y-2 text-xs font-mono">
            <div class="flex justify-between text-gray-400">
              <span>${I18n.t('withdrawGrossLabel')}</span>
              <span id="withdraw_gross" class="text-white font-bold">$ 0.00</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>${I18n.t('withdrawFeeLabel')}</span>
              <span id="withdraw_fee" class="text-amber-300 font-bold">− $ ${s.networkFeeFlat.toFixed(2)}</span>
            </div>
            <div class="border-t border-white/5 pt-2 flex justify-between items-center">
              <span class="text-amber-200 font-bold uppercase tracking-wider text-[11px]">${I18n.t('withdrawNetLabel')}</span>
              <span id="withdraw_net" class="text-amber-200 font-black text-base">$ 0.00</span>
            </div>
          </div>

          <div class="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-[11px]">
            <i class="fa-solid fa-shield-halved text-red-400 mt-0.5 shrink-0"></i>
            <div class="space-y-1 text-gray-300">
              <div><span class="text-red-300 font-bold">${I18n.t('withdrawVerifyTitle')}</span> ${I18n.t('withdrawVerifyP1')}</div>
              <div>${I18n.t('withdrawVerifyP2')} <span class="text-white font-bold">${s.processingHours} ${I18n.t('hoursLabel')}</span>.</div>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
            <button type="button" onclick="UI.closeModal()" class="flex-1 py-3 rounded-xl bg-brand-surface hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition">
              ${I18n.t('withdrawCancelBtn')}
            </button>
            <button id="withdraw_submit_btn" type="submit" disabled class="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-neon shadow-amber-500/30">
              <i class="fa-solid fa-paper-plane mr-1.5"></i>${I18n.t('withdrawConfirmBtn')}
            </button>
          </div>
        </form>
      </div>
    `;

    this.openModal(contentHtml);
    requestAnimationFrame(() => {
      UI._withdrawRefreshCalc();
    });
  },

  _withdrawRefreshCalc() {
    const s = AppState.projectSettings.withdraw;
    const u = AppState.currentUser;
    const _st = (v) => Number(v || 0);
    const uiAvailable = _st(u.availableBalance);
    const hasBonus = uiAvailable > 0 && uiAvailable >= s.minAmount;
    const amountInput = document.getElementById('withdraw_amount');
    const grossEl = document.getElementById('withdraw_gross');
    const feeEl = document.getElementById('withdraw_fee');
    const netEl = document.getElementById('withdraw_net');
    const submitBtn = document.getElementById('withdraw_submit_btn');
    if (!amountInput) return;

    const amount = parseFloat(amountInput.value) || 0;
    const maxPossible = hasBonus ? Math.min(uiAvailable, s.maxAmountPerRequest) : 0;
    const fee = s.networkFeeFlat;
    const net = Math.max(0, amount - fee);

    if (grossEl) grossEl.textContent = `$ ${amount.toFixed(2)}`;
    if (feeEl) feeEl.textContent = `− $ ${fee.toFixed(2)}`;
    if (netEl) netEl.textContent = `$ ${net.toFixed(2)}`;

    const walletInput = document.getElementById('withdraw_wallet');
    const walletOk = hasBonus && walletInput && /^0x[a-fA-F0-9]{40}$/.test(walletInput.value.trim());
    const amountOk = hasBonus && amount >= s.minAmount && amount <= maxPossible;

    if (submitBtn) submitBtn.disabled = !(walletOk && amountOk);
  },

  submitWithdraw(formEl) {
    const walletInput = document.getElementById('withdraw_wallet');
    const amountInput = document.getElementById('withdraw_amount');
    const amount = parseFloat(amountInput.value);
    const wallet = walletInput.value.trim();
    const s = AppState.projectSettings.withdraw;
    const u = AppState.currentUser;
    const maxPossible = Math.min(u.availableBalance, s.maxAmountPerRequest);

    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return alert(I18n.t('withdrawErrorInvalidWallet'));
    if (amount < s.minAmount) return alert(`${I18n.t('withdrawErrorMinAmount')}: US$ ${s.minAmount.toFixed(2)}`);
    if (amount > maxPossible) return alert(`${I18n.t('withdrawErrorMaxAmount')} (US$ ${maxPossible.toFixed(2)}).`);

    const fee = s.networkFeeFlat;
    const net = amount - fee;
    const walletShort = wallet.slice(0, 6) + '...' + wallet.slice(-8);
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const etaDate = new Date(now.getTime() + s.processingHours * 3600 * 1000);
    const etaStr = `${pad(etaDate.getDate())}/${pad(etaDate.getMonth() + 1)}/${etaDate.getFullYear()} ${pad(etaDate.getHours())}:${pad(etaDate.getMinutes())}`;
    const id = 'wd_' + Math.random().toString(36).slice(2, 9);

    AppState.withdrawals.unshift({
      id,
      amount,
      fee,
      netAmount: net,
      wallet: walletShort,
      network: s.network,
      status: 'Processando',
      hash: null,
      date: dateStr,
      eta: etaStr
    });

    u.availableBalance = parseFloat((u.availableBalance - amount).toFixed(2));

    UI.closeModal();
    UI._toast(`${I18n.t('withdrawSuccessToast')} • $${net.toFixed(2)} ${I18n.t('withdrawNetShort')} BEP20`, 'success', 'fa-money-bill-transfer');
    setTimeout(() => Router.navigate('wallet'), 250);
  },

  openAdminTicketReply(ticketId) {
    const tk = AppState.supportTickets.find(t => t.id === ticketId);
    if (!tk) return;
    const repliedStatusEn = tk.status === 'Open' || tk.status === 'Aberto' ? false : true;
    const repliesHtml = (tk.replies && tk.replies.length > 0) ? tk.replies.map(r => `
      <div class="rounded-xl border border-brand/20 bg-brand/5 p-3 space-y-1">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-brand font-bold"><i class="fa-solid fa-shield-halved mr-1"></i>ADMIN REPLY</span>
          <span class="text-gray-500">${r.date}</span>
        </div>
        <div class="text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap">${r.message}</div>
      </div>
    `).join('') : '';

    const contentHtml = `
      <div class="space-y-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <i class="fa-solid fa-headset"></i>
              </div>
              <h3 class="text-lg font-bold text-white font-['Space_Grotesk']">${I18n.t('adminSupportModalTitle')}</h3>
            </div>
            <p class="text-xs text-gray-400 mt-1.5 ml-[44px]">
              ${I18n.t('adminSupportTicketUser')} <span class="text-brand font-bold">@${tk.username}</span> — <span class="text-gray-500">${tk.email}</span>
            </p>
          </div>
          <button onclick="UI.closeModal()" class="w-8 h-8 rounded-lg bg-brand-surface hover:bg-white/10 text-gray-400 hover:text-white transition shrink-0">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-brand-surface border border-white/5 text-xs">
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('adminSupportModalDate')}</div>
            <div class="font-mono text-white font-bold">${tk.date}</div>
          </div>
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('adminSupportColPriority')}</div>
            <div class="font-mono font-bold ${tk.priority==='Alta'||tk.priority==='High'?'text-red-400':tk.priority==='Baixa'||tk.priority==='Low'?'text-sky-400':'text-amber-400'}">
              ${tk.priority==='Alta'||tk.priority==='High'?I18n.t('adminSupportPriorityHigh'):tk.priority==='Baixa'||tk.priority==='Low'?I18n.t('adminSupportPriorityLow'):I18n.t('adminSupportPriorityMed')}
            </div>
          </div>
          <div>
            <div class="text-gray-500 font-mono text-[10px]">${I18n.t('adminSupportColStatus')}</div>
            <div class="font-mono font-bold ${tk.status==='Aberto'||tk.status==='Open'?'text-red-400':tk.status==='Fechado'||tk.status==='Closed'?'text-gray-400':'text-amber-400'}">
              ${tk.status==='Aberto'||tk.status==='Open'?I18n.t('adminSupportStatusOpen'):tk.status==='Fechado'||tk.status==='Closed'?I18n.t('adminSupportStatusClosed'):I18n.t('adminSupportStatusReplied')}
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-1">
          <div class="text-[10px] font-mono text-blue-300 font-bold mb-1">
            ${I18n.t('adminSupportModalSubject')}: <span class="text-white text-xs">${tk.subject}</span>
          </div>
          <div class="text-[10px] text-gray-500 font-mono uppercase">${I18n.t('adminSupportModalOriginalMsg')}</div>
          <div class="text-[12px] text-gray-200 leading-relaxed whitespace-pre-wrap pt-1 border-t border-white/5 mt-2">${tk.message}</div>
        </div>

        ${repliesHtml ? `
          <div class="space-y-2">
            <div class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">${tk.replies.length} ${I18n.t('adminSupportStatusReplied').toLowerCase()}${tk.replies.length>1?'s':''}</div>
            ${repliesHtml}
          </div>
        ` : ''}

        <form onsubmit="event.preventDefault(); UI.submitAdminTicketReply(this, '${tk.id}');" class="space-y-3">
          <div>
            <label class="block text-xs font-mono text-gray-300 mb-1.5">${I18n.t('adminSupportModalReply')}</label>
            <textarea id="admin_reply_textarea" required rows="5" placeholder="${I18n.t('adminSupportModalReplyPlaceholder')}" class="w-full px-3 py-2.5 rounded-xl bg-brand-surface border border-white/10 focus:border-brand focus:outline-none text-gray-200 text-xs leading-relaxed transition resize-none"></textarea>
          </div>

          <div class="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
            <button type="button" onclick="UI.closeModal()" class="flex-1 py-2.5 rounded-xl bg-brand-surface hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition">
              ${I18n.t('adminSupportModalCancelBtn')}
            </button>
            <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand to-brand-glow text-black text-xs font-black transition shadow-neon-sm">
              <i class="fa-solid fa-paper-plane mr-1.5"></i>${I18n.t('adminSupportModalSubmitBtn')}
            </button>
          </div>
        </form>
      </div>
    `;

    UI.openModal(contentHtml);
  },

  submitAdminTicketReply(form, ticketId) {
    const textarea = document.getElementById('admin_reply_textarea');
    const msg = textarea ? textarea.value.trim() : '';
    if (!msg || msg.length < 5) {
      window.alert('Resposta muito curta.');
      return;
    }
    const closeChk = document.getElementById('admin_reply_close');
    const closeAfter = closeChk ? !!closeChk.checked : false;
    var btn = form && form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
    const finalize = function(){
      UI.closeModal();
      UI._toast(`${I18n.t('adminSupportReplySent')} — ${ticketId}${closeAfter ? ' + fechado' : ''}`, 'success', 'fa-reply');
      setTimeout(function(){ if (Router && Router.refresh) { Router.refresh(); } else if (Router && Router.navigate) { Router.navigate('admin'); } }, 220);
    };
    if (window.SupabaseOK && window.SupabaseOK() && AppState && typeof AppState.sbReplyTicket === 'function') {
      if (closeAfter) {
        Promise.resolve(AppState.sbCloseTicket(ticketId, msg)).then(finalize).catch(function(err){ UI._toast((err && err.message) || 'Erro', 'error', 'fa-triangle-exclamation'); if (btn) { btn.disabled=false; btn.style.opacity='1';} });
      } else {
        Promise.resolve(AppState.sbReplyTicket(ticketId, msg)).then(finalize).catch(function(err){ UI._toast((err && err.message) || 'Erro', 'error', 'fa-triangle-exclamation'); if (btn) { btn.disabled=false; btn.style.opacity='1';} });
      }
      return;
    }
    /* Fallback offline (modo antigo em memória) */
    const tk = AppState.supportTickets.find(t => t.id === ticketId);
    if (!tk) return;
    const replyObj = {
      from: 'admin',
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
      message: msg
    };
    if (!tk.replies) tk.replies = [];
    tk.replies.push(replyObj);
    if (tk.status === 'Aberto') tk.status = (closeAfter ? 'Fechado' : 'Respondido');
    if (tk.status === 'Open')   tk.status = (closeAfter ? 'Closed' : 'Replied');
    if (tk.status === 'Respondido' && closeAfter) tk.status = 'Fechado';
    if (tk.status === 'Replied' && closeAfter) tk.status = 'Closed';
    finalize();
  },

  closeAdminTicket(ticketId) {
    if (window.SupabaseOK && window.SupabaseOK() && AppState && typeof AppState.sbCloseTicket === 'function') {
      Promise.resolve(AppState.sbCloseTicket(ticketId, I18n.t('adminSupportClosedOk')))
        .then(function(){
          UI._toast(`${I18n.t('adminSupportClosedOk')} — ${ticketId}`, 'warning', 'fa-lock');
          setTimeout(function(){ if (Router && Router.refresh) Router.refresh(); else if (Router) Router.navigate('admin'); }, 200);
        })
        .catch(function(err){ UI._toast((err && err.message) || 'Erro ao fechar', 'error', 'fa-triangle-exclamation'); });
      return;
    }
    const tk = AppState.supportTickets.find(t => t.id === ticketId);
    if (!tk) return;
    if (tk.status === 'Respondido') tk.status = 'Fechado';
    if (tk.status === 'Replied') tk.status = 'Closed';
    UI._toast(`${I18n.t('adminSupportClosedOk')} (@${tk.username})`, 'warning', 'fa-lock');
    setTimeout(function(){ if (Router && Router.refresh) Router.refresh(); else if (Router) Router.navigate('admin'); }, 200);
  },

  viewFinanceHash(hash, network, currency) {
    if (!hash || hash.startsWith('Ajuste') || hash.startsWith('LOTE')) {
      UI._toast('Problema sem hash on-chain — ajuste manual ou lote interno.', 'warning', 'fa-triangle-exclamation');
      return;
    }
    const clean = hash.split('…')[0].split('_tx')[0].trim();
    let explorer = '';
    if (network.includes('BEP20') || network.includes('BNB') || currency==='BNB') explorer = `https://bscscan.com/tx/${clean}`;
    else if (network.includes('TRC20') || network.includes('Tron')) explorer = `https://tronscan.org/#/transaction/${clean}`;
    else if (network.includes('ERC20') || network.includes('ETH') || currency==='ETH') explorer = `https://etherscan.io/tx/${clean}`;
    else if (currency==='BTC' || network.includes('Bitcoin')) explorer = `https://mempool.space/tx/${clean}`;
    else explorer = `https://blockchair.com/search?q=${encodeURIComponent(clean)}`;
    window.open(explorer, '_blank', 'noopener,noreferrer');
  },

  openFinanceProblemModal(pId) {
    const p = AppState.financeProblems.find(f => f.id === pId);
    if (!p) return;
    const isResolved = p.status.includes('Resolvido') || p.status.includes('Fechado');
    const diff = (p.expected && p.expected > p.amount) ? (p.expected - p.amount) : 0;
    const notesHtml = (p.notes && p.notes.length>0) ? p.notes.map(n=>`
      <div class="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-1">
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-blue-300 font-black"><i class="fa-solid fa-shield-halved mr-1"></i>NOTA INTERNA ADMIN</span>
          <span class="text-gray-500">${n.date}</span>
        </div>
        <div class="text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap">${n.text}</div>
      </div>
    `).join('') : '';
    const staCol = p.status.includes('Pendente') ? 'text-red-400' : p.status.includes('Análise') ? 'text-amber-400' : p.status.includes('Parcial') ? 'text-orange-400' : 'text-green-400';
    const staIco = p.status.includes('Pendente') ? 'fa-circle-exclamation' : p.status.includes('Análise') ? 'fa-magnifying-glass' : p.status.includes('Parcial') ? 'fa-clock-rotate-left' : 'fa-circle-check';
    const contentHtml = `
      <div class="space-y-5 max-w-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <i class="fa-solid fa-sack-dollar"></i>
              </div>
              <div>
                <h3 class="text-lg font-black text-white font-['Space_Grotesk']">Resolução Financeira</h3>
                <p class="text-[11px] text-gray-400 mt-0.5 font-mono">Protocolo <span class="text-amber-300 font-black">${p.code}</span> · aberto em ${p.opened}</p>
              </div>
            </div>
          </div>
          <button onclick="UI.closeModal()" class="w-8 h-8 rounded-lg bg-brand-surface hover:bg-white/10 text-gray-400 hover:text-white transition shrink-0"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div class="rounded-xl border border-white/5 bg-brand-surface p-3">
            <div class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Utilizador</div>
            <div class="text-white font-black mt-1">@${p.username}</div>
            <div class="text-[11px] text-gray-400 font-mono mt-0.5">${p.email}</div>
          </div>
          <div class="rounded-xl border border-white/5 bg-brand-surface p-3">
            <div class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Status Actual</div>
            <div class="${staCol} font-black mt-1 font-mono text-sm flex items-center gap-1.5"><i class="fa-solid ${staIco}"></i>${p.status}</div>
            <div class="text-[11px] text-gray-400 font-mono mt-0.5">${p.type}</div>
          </div>
          <div class="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 col-span-2 sm:col-span-1">
            <div class="text-[10px] text-red-300/80 font-mono uppercase tracking-wider">Valor reportado</div>
            <div class="font-mono text-2xl font-black text-white mt-0.5">$ ${p.amount.toLocaleString('pt-PT',{minimumFractionDigits:2})} <span class="text-xs text-gray-500 font-bold">${p.currency}</span></div>
            ${diff>0 ? `<div class="text-[10px] text-red-300 mt-0.5 font-mono">Diferença de $${diff.toFixed(2)} vs esperado</div>`:''}
          </div>
          <div class="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-3 col-span-2 sm:col-span-1">
            <div class="text-[10px] text-blue-300/80 font-mono uppercase tracking-wider">Rede · Hash</div>
            <div class="font-mono text-sm font-black text-white mt-0.5">${p.network}</div>
            <div class="text-[10px] text-gray-400 font-mono mt-0.5 truncate">${p.txHash}</div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-500/20 bg-gray-500/[0.04] p-4 space-y-1.5">
          <div class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Relato do Utilizador · ${p.category}</div>
          <div class="text-[12px] text-gray-200 leading-relaxed whitespace-pre-wrap">${p.description}</div>
        </div>

        ${notesHtml ? `<div class="space-y-2"><div class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Histórico (${p.notes.length} nota${p.notes.length===1?'':'s'})</div>${notesHtml}</div>` : ''}

        ${isResolved ? `
          <div class="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-4 flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0"><i class="fa-solid fa-circle-check"></i></div>
            <div>
              <div class="text-green-300 font-black text-sm">Este problema já está ${p.status}.</div>
              <div class="text-[11px] text-gray-400 mt-0.5 font-mono">Poderá reabrir internamente caso seja necessário. Modificações manuais podem ser feitas.</div>
            </div>
          </div>
        ` : ''}

        <form onsubmit="event.preventDefault(); UI.submitFinanceResolution(this, '${p.id}');" class="space-y-3 pt-2 border-t border-white/5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[11px] font-mono text-gray-300 mb-1">Decisão Final *</label>
              <select id="fin_decisao" required class="w-full px-3 py-2.5 rounded-xl bg-brand-surface border border-white/10 focus:border-amber-500/60 focus:outline-none text-gray-200 text-xs font-mono transition">
                <option value="" disabled ${!isResolved?'selected':''}>— Seleccionar resolução —</option>
                <option value="aprovado_total">✅ Aprovado · Crédito TOTAL (${p.expected?p.expected.toFixed(2):p.amount.toFixed(2)} USDT)</option>
                <option value="aprovado_parcial">🟡 Aprovado Parcial · Valor Ajustado abaixo</option>
                <option value="rejeitado">❌ Rejeitado · Agir conforme política</option>
                <option value="credito_manual">⚙️ Crédito Manual · Forçar entrada agora</option>
                <option value="reembolso">💸 Reembolso ao Utilizador</option>
                <option value="aguardar">⏳ Aguardar confirmação · manter Em Análise</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-mono text-gray-300 mb-1">Valor Ajustado (USDT) · se parcial</label>
              <input id="fin_valor" type="number" step="0.01" min="0" placeholder="${diff>0?('Completar diferença $'+diff.toFixed(2)):'Ex: 9.50'}" value="${diff>0?diff.toFixed(2):p.amount.toFixed(2)}" class="w-full px-3 py-2.5 rounded-xl bg-brand-surface border border-white/10 focus:border-amber-500/60 focus:outline-none text-gray-200 text-xs font-mono transition">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="flex items-start gap-2 sm:col-span-2">
              <input id="fin_credito" type="checkbox" checked ${!isResolved?'':'disabled'} class="mt-1.5 accent-brand w-4 h-4">
              <label for="fin_credito" class="text-[11px] text-gray-300 leading-relaxed">
                <span class="text-brand font-black">Efectuar lançamento contabilístico</span> no saldo do utilizador @${p.username} ao submeter · (marque caso queira apenas registar nota, sem mexer em carteira)
              </label>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-mono text-gray-300 mb-1.5">Observação / Nota Interna * (ficará no histórico)</label>
            <textarea id="fin_obs" required rows="3" placeholder="Ex: Hash confirmada na BscScan block 38.820.455. Pagamento validado. Creditar a diferença de $0.50 e marcar activação." class="w-full px-3 py-2.5 rounded-xl bg-brand-surface border border-white/10 focus:border-brand focus:outline-none text-gray-200 text-xs leading-relaxed transition resize-none"></textarea>
          </div>

          <div class="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
            <button type="button" onclick="UI.closeModal()" class="flex-1 py-2.5 rounded-xl bg-brand-surface hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition">
              Cancelar
            </button>
            <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black text-xs font-black transition shadow-[0_0_22px_rgba(245,158,11,0.35)] hover:brightness-110">
              <i class="fa-solid fa-file-signature mr-1.5"></i>Assinar Resolução · ${p.code}
            </button>
          </div>
        </form>
      </div>
    `;
    UI.openModal(contentHtml);
  },

  submitFinanceResolution(form, pId) {
    const p = AppState.financeProblems.find(f => f.id === pId || f.fin_id === pId || f.code === pId);
    if (!p) { UI._toast('Problema não encontrado', 'error', 'fa-triangle-exclamation'); return; }
    const decEl = document.getElementById('fin_decisao');
    const valEl = document.getElementById('fin_valor');
    const credEl = document.getElementById('fin_credito');
    const obsEl = document.getElementById('fin_obs');
    const dec = decEl ? decEl.value : '';
    const obs = obsEl ? obsEl.value.trim() : '';
    const val = valEl ? parseFloat(valEl.value || '0') : 0;
    const cred = credEl ? !!credEl.checked : false;
    if (!dec) { alert('Seleccione uma decisão.'); return; }
    if (!obs || obs.length < 8) { alert('Descreva a nota interna (mínimo 8 caracteres).'); return; }
    let statusTo = p.status;
    if (dec === 'aprovado_total' || dec === 'credito_manual' || dec === 'reembolso' || dec === 'rejeitado') statusTo = 'Resolvido Total';
    else if (dec === 'aprovado_parcial') statusTo = 'Resolvido Parcial';
    else if (dec === 'aguardar') statusTo = 'Em Análise';
    const creditAmount = (cred && val && val > 0) ? val : 0;
    const btn = form && form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
    const launchMoney = creditAmount > 0;
    const finalize = function(){
      UI.closeModal();
      const toastIco = statusTo.includes('Fechado') || statusTo.includes('Total') ? 'fa-circle-check' : statusTo.includes('Parcial') ? 'fa-clock-rotate-left' : 'fa-magnifying-glass';
      const toastType = statusTo.includes('Análise') ? 'warning' : (statusTo.includes('Resolv') ? 'success' : 'info');
      UI._toast(`${p.code || pId} resolvido · ${statusTo}${launchMoney ? ' · +US$ ' + creditAmount.toFixed(2) : ''}`, toastType, toastIco);
      setTimeout(function(){ if (Router && Router.refresh) { Router.refresh(); } else if (Router) { Router.navigate('admin'); } }, 260);
    };
    if (window.SupabaseOK && window.SupabaseOK() && AppState && typeof AppState.sbResolveFinance === 'function') {
      Promise.resolve(AppState.sbResolveFinance(p.code || pId, obs, {
        credit: !!launchMoney, amount: creditAmount, statusTo: statusTo,
        finalObservation: obs, signature: 'Admin Master',
        message: `[${dec.replace(/_/g, ' ').toUpperCase()}] ${obs}${launchMoney ? ' · 💸 Crédito US$ ' + creditAmount.toFixed(2) : ''}`
      })).then(finalize).catch(function(err){
        UI._toast((err && err.message) || 'Erro ao resolver', 'error', 'fa-triangle-exclamation');
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
      });
      return;
    }
    /* Fallback offline */
    p.status = statusTo;
    const nowStr = new Date().toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
    if (!p.notes) p.notes = [];
    p.notes.push({
      from: 'admin',
      date: nowStr,
      text: `[${dec.replace(/_/g,' ').toUpperCase()}] ${obs}${launchMoney ? ' · 💸 Crédito em carteira aplicado US$ ' + creditAmount.toFixed(2) : ''}`
    });
    if (launchMoney) {
      const user = AppState.currentUser;
      if (user && user.username && user.username === p.username) {
        user.availableBalance = parseFloat(((user.availableBalance || 0) + creditAmount).toFixed(2));
      }
    }
    finalize();
  },

  _toast(message, type = 'info', icon = 'fa-circle-info') {
    const colors = {
      success: 'from-brand to-brand-glow text-black border-brand',
      error: 'from-red-500 to-red-400 text-white border-red-400',
      info: 'from-blue-500 to-blue-400 text-white border-blue-400',
      warning: 'from-amber-500 to-amber-400 text-black border-amber-400'
    };
    const el = document.createElement('div');
    el.className = `fixed top-24 right-4 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r ${colors[type] || colors.info} shadow-2xl text-xs font-bold border animate-[slideIn_0.3s_ease-out] max-w-xs`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .25s, transform .25s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }
};

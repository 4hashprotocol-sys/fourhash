/* ============================================================
   FOURHASH — Renderizadores de Telas (Views)
   Templates HTML para cada rota da SPA
   ============================================================ */

const Views = {

  Landing() {
    return `
      <div class="space-y-16 py-6">
        <div class="relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-b from-brand-card to-black p-8 sm:p-14 text-center">
          <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="mx-auto h-24 sm:h-28 mb-6 relative flex items-center justify-center animate-pulse">
            <img src="/assets/logo/Logo_4h_solo.png" alt="FourHash Logo 4#" class="h-24 sm:h-28 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,255,102,0.8)]">
          </div>

          <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-white font-['Space_Grotesk']">
            FOUR<span class="text-brand neon-text-glow">HASH</span>
          </h1>
          <p class="mt-2 text-lg sm:text-2xl font-light text-gray-300 max-w-2xl mx-auto" data-i18n="tagline">
            Your Position. Your Network. Your Future.
          </p>
          <p class="mt-4 text-sm text-gray-400 max-w-xl mx-auto" data-i18n="heroDesc">
            A primeira plataforma descentralizada de posicionamento linear premium de 12 níveis com distribuição direta 60/40 (60% equipe em 5 níveis) em USDT BEP20.
          </p>

          <div class="mt-10 max-w-xl mx-auto rounded-2xl border border-brand/30 bg-black/60 p-6 backdrop-blur-md shadow-neon-sm">
            <div class="text-[11px] font-mono tracking-widest text-brand uppercase mb-4" data-i18n="presaleEndsIn">
              PRÉ-CADASTRO TERMINA EM
            </div>
            <div id="presale-timer-landing" class="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            </div>
          </div>

          <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onclick="Router.navigate('register')" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-sm tracking-wider shadow-neon transition transform hover:scale-105" data-i18n="createAccount">
              CRIAR CONTA
            </button>
            <button onclick="Router.navigate('login')" class="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 hover:border-brand/60 bg-brand-card hover:bg-brand-surface text-white font-bold text-sm transition" data-i18n="login">
              ENTRAR
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div class="rounded-2xl border border-brand-border bg-brand-card p-6 hover:border-brand/40 transition">
            <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand text-xl mb-4">
              <i class="fa-solid fa-dollar-sign"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-1" data-i18n="entryVal">US$ 10 de Entrada</h3>
            <p class="text-xs text-gray-400" data-i18n="feat1Text">Acesso único e acessível em USDT pela BNB Smart Chain (BEP20) com processamento seguro e transparente.</p>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-6 hover:border-brand/40 transition">
            <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand text-xl mb-4">
              <i class="fa-solid fa-sitemap"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-1" data-i18n="levels12">12 Níveis Dinâmicos</h3>
            <p class="text-xs text-gray-400" data-i18n="feat2Text">Estrutura linear unificada gerada em tempo real com árvore visual 3D, expansão e navegação responsiva.</p>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-6 hover:border-brand/40 transition">
            <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand text-xl mb-4">
              <i class="fa-solid fa-handshake-angle"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-1" data-i18n="referralProg">60% Equipe em 5 Níveis</h3>
            <p class="text-xs text-gray-400" data-i18n="feat3Text">Distribuição inteligente fase de lançamento: 50% Nível 1 (indicado direto) + 2,5% N2 + 2,5% N3 + 2,5% N4 + 2,5% N5. 40% retido no fundo de liquidez sustentável.</p>
          </div>

        </div>
      </div>
    `;
  },

  Login() {
    return `
      <div class="max-w-md mx-auto py-10">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-8 shadow-2xl backdrop-blur-xl">
          <div class="text-center mb-8">
            <div class="w-12 h-12 mx-auto rounded-xl bg-brand/10 border border-brand/40 flex items-center justify-center mb-3 shadow-neon-sm overflow-hidden">
              <img src="/assets/logo/Logo_4h_solo.png" alt="4#" class="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]">
            </div>
            <h2 class="text-2xl font-bold text-white font-['Space_Grotesk']" data-i18n="login">Acessar FourHash</h2>
            <p class="text-xs text-gray-400 mt-1">Acesso exclusivo por e-mail cadastrado</p>
          </div>

          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">E-mail</label>
              <div class="relative">
                <i class="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-500 text-xs"></i>
                <input id="login-email" type="email" required value="" placeholder="seu@email.com" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-mono text-gray-300">Senha</label>
                <a href="#" onclick="AppState.requestPasswordReset(this); return false;" class="text-[11px] text-brand hover:underline">Esqueci minha senha</a>
              </div>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-500 text-xs"></i>
                <input id="login-pass" type="password" required value="" placeholder="••••••••" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
                <button type="button" onclick="UI.togglePasswordVisibility('login-pass', this)" class="absolute right-3.5 top-3.5 text-gray-400 hover:text-white">
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" class="w-full py-3 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-sm tracking-wider shadow-neon transition transform hover:scale-[1.01]" data-i18n="login">
              ENTRAR
            </button>
          </form>

          <div class="mt-6 text-center text-xs text-gray-400">
            Ainda não possui uma conta?
            <button onclick="Router.navigate('register')" class="text-brand font-bold hover:underline ml-1" data-i18n="createAccount">Criar Conta</button>
          </div>
        </div>
      </div>
    `;
  },

  Register(sponsorRef = '4hashprotocol') {
    return `
      <div class="max-w-xl mx-auto py-8">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div class="text-center mb-6">
            <span class="px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand text-[11px] font-mono uppercase tracking-wider">
              Pré-Cadastro Exclusivo
            </span>
            <h2 class="text-2xl font-bold text-white font-['Space_Grotesk'] mt-2" data-i18n="createAccount">Criar Conta FourHash</h2>
            <p class="text-xs text-gray-400 mt-1">Garanta sua posição na estrutura linear global</p>
          </div>

          <div class="mb-6 rounded-xl border border-brand/30 bg-brand-surface p-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand/20 border border-brand flex items-center justify-center text-brand font-bold text-sm">
                @
              </div>
              <div>
                <div class="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Patrocinador Indicador</div>
                <div class="text-sm font-bold text-white">@${sponsorRef}</div>
              </div>
            </div>
            <span class="text-[10px] text-brand bg-brand/10 px-2 py-1 rounded border border-brand/30">✓ Validado</span>
          </div>

          <div class="mb-6 rounded-xl border border-brand/40 bg-gradient-to-r from-brand-surface via-black to-brand-surface p-4 text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 px-3 py-0.5 bg-brand text-black font-extrabold text-[9px] rounded-bl-lg">✦ PREMIUM</div>
            <div class="text-xs font-mono text-brand mb-1">PLANO DE ENTRADA ÚNICO</div>
            <div class="text-2xl font-black text-white font-['Space_Grotesk']">US$ ${AppState.projectSettings.entryAmount} <span class="text-xs text-gray-400 font-mono">USDT BEP20</span></div>
            <div class="text-[11px] text-gray-400 mt-1">Posicionamento vitalício na estrutura linear de 12 níveis</div>
          </div>

          <form id="register-form" class="space-y-4" data-sponsor="${sponsorRef}">

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">Nome Completo</label>
              <input id="reg-fullname" type="text" required placeholder="Seu nome completo" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">Username (@)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-gray-400 text-sm font-mono">@</span>
                <input id="reg-username" type="text" required placeholder="seu_username" pattern="[a-zA-Z0-9_]+" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
              </div>
              <span class="text-[10px] text-gray-500 mt-1 block">Apenas letras, números e underline. Sem espaços. (3-32 chars)</span>
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">E-mail</label>
              <input id="reg-email" type="email" required placeholder="seu@email.com" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">País</label>
                <select id="reg-country" required class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
                  ${(typeof COUNTRIES !== 'undefined' ? COUNTRIES : window.COUNTRIES || []).map(function(c) {
                    const L = (typeof AppState !== 'undefined' ? AppState.currentLang : null) || (typeof I18n !== 'undefined' ? (I18n.lang || 'pt') : 'pt');
                    const i18n = (window.COUNTRY_I18N && window.COUNTRY_I18N[L]) ? window.COUNTRY_I18N[L][c.code] : null;
                    const pt_ = (window.COUNTRY_I18N && window.COUNTRY_I18N.pt) ? window.COUNTRY_I18N.pt[c.code] : null;
                    const nm = i18n || pt_ || c.name;
                    return '<option value="' + c.code + '"' + (c.code === 'BR' ? ' selected' : '') + '>' +
                      c.flag + ' ' + c.code + ' ' + nm + ' (' + c.dial + ')' +
                    '</option>';
                  }).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">Telefone / WhatsApp</label>
                <input id="reg-phone" type="tel" required placeholder="(11) 99999-9999" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">Senha</label>
                <div class="relative">
                  <input id="reg-pass" type="password" required minlength="6" placeholder="Mínimo 6 dígitos" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition pr-8">
                  <button type="button" onclick="UI.togglePasswordVisibility('reg-pass', this)" class="absolute right-2.5 top-3 text-gray-400">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">Confirmar Senha</label>
                <div class="relative">
                  <input id="reg-pass-confirm" type="password" required minlength="6" placeholder="Repita a senha" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition pr-8">
                  <button type="button" onclick="UI.togglePasswordVisibility('reg-pass-confirm', this)" class="absolute right-2.5 top-3 text-gray-400">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button id="register-submit" type="submit" class="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-sm tracking-wider shadow-neon transition transform hover:scale-[1.01]" data-i18n="createAccount">
                FINALIZAR CADASTRO
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  Dashboard() {
    const u = AppState.currentUser;
    const txTypeKey = (t) => t === 'DEPÓSITO' ? 'depositBonus' : t === 'POSICIONAMENTO' ? 'positioningBonus' : 'bonusDirect';
    const txStatusKey = (s) => s === 'Confirmado' ? 'statusConfirmed' : s === 'Processando' ? 'statusProcessing' : 'statusPending';
    return `
      <div class="space-y-6">

        <div class="rounded-2xl border border-brand/40 bg-gradient-to-r from-brand-card via-brand-surface to-brand-card p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-neon-sm">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-brand animate-ping"></span>
              <span class="text-xs font-mono text-brand font-bold uppercase tracking-wider" data-i18n="presaleEndsIn">Fase de Pré-Cadastro em Andamento</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mt-1" data-i18n="whyJoinText">Garanta as melhores posições no lançamento oficial</h3>
          </div>
          <div id="presale-timer-dash" class="flex items-center gap-2 text-center">
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div class="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5">
            <div class="text-xs text-gray-400 font-mono mb-1" data-i18n="myStatus">Meu Status</div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full ${u.status === 'ACTIVE' ? 'bg-brand shadow-neon-sm' : 'bg-amber-400'}"></span>
              <span class="text-base sm:text-lg font-extrabold text-white">${u.status === 'ACTIVE' ? I18n.t('active') : I18n.t('pending')}</span>
            </div>
            <div class="text-[10px] text-gray-500 mt-1">Desde ${u.entryDate}</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5">
            <div class="text-xs text-gray-400 font-mono mb-1" data-i18n="myUsername">Meu Username</div>
            <div class="text-base sm:text-lg font-extrabold text-white">@${u.username}</div>
            <div class="text-[10px] text-gray-400 mt-1">${I18n.t('mySponsor')}: <span class="text-brand font-bold">@${u.sponsor}</span></div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5">
            <div class="text-xs text-gray-400 font-mono mb-1" data-i18n="myPosition">Minha Posição</div>
            <div class="text-base sm:text-lg font-mono font-black text-brand">${u.positionNumber}</div>
            <div class="text-[10px] text-gray-400 mt-1">${I18n.t('currentLevel')}: <span class="text-white font-bold">Nível 0${u.level} / 12</span></div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5">
            <div class="text-xs text-gray-400 font-mono mb-1" data-i18n="availableBalance">Saldo Disponível</div>
            <div class="text-base sm:text-lg font-mono font-extrabold text-white">$ ${u.availableBalance.toFixed(2)}</div>
            <div class="text-[10px] text-brand mt-1 font-mono">USDT BEP20</div>
          </div>

        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="w-full md:w-auto">
            <div class="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider" data-i18n="referralsYourLinkLabel">Seu Link de Indicação Oficial</div>
            <div class="text-sm font-mono text-brand font-bold break-all">
              https://fourhash.app/register?ref=${u.username}
            </div>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button onclick="UI.copyToClipboard('https://fourhash.app/register?ref=${u.username}')" class="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs shadow-neon transition">
              <i class="fa-solid fa-copy mr-1.5"></i>${I18n.t('copyLink')}
            </button>
            <button onclick="Router.navigate('position')" class="px-5 py-2.5 rounded-xl border border-white/20 hover:border-brand bg-brand-surface text-white font-bold text-xs transition">
              <i class="fa-solid fa-sitemap mr-1.5 text-brand"></i>Ver Árvore 3D
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono" data-i18n="recordFullTx">Últimas Movimentações na Blockchain</h3>
            <button onclick="Router.navigate('wallet')" class="text-xs text-brand hover:underline font-medium">${I18n.t('viewBsc')} →</button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-2.5" data-i18n="txType">TIPO</th>
                  <th class="py-2.5" data-i18n="txAmount">VALOR</th>
                  <th class="py-2.5" data-i18n="txStatus">STATUS</th>
                  <th class="py-2.5" data-i18n="txDate">DATA</th>
                  <th class="py-2.5 text-right">TX HASH</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${AppState.transactions.map(tx => `
                  <tr>
                    <td class="py-3 font-medium text-white flex items-center gap-2">
                      <i class="fa-solid ${tx.type.includes('DEPÓSITO') ? 'fa-arrow-down text-blue-400' : 'fa-gift text-brand'} text-[10px]"></i>
                      ${I18n.t(txTypeKey(tx.type))}
                    </td>
                    <td class="py-3 font-mono font-bold ${tx.amount > 0 ? 'text-brand' : 'text-gray-300'}">+$${tx.amount.toFixed(2)} USDT</td>
                    <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">${I18n.t(txStatusKey(tx.status))}</span></td>
                    <td class="py-3 text-gray-400 font-mono">${tx.date}</td>
                    <td class="py-3 text-right">
                      <a href="https://bscscan.com/tx/${tx.hash}" target="_blank" class="font-mono text-gray-400 hover:text-brand transition">${tx.hash} <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-0.5"></i></a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  Position() {
    return `
      <div class="space-y-4">

        <div class="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <i class="fa-solid fa-sitemap text-brand"></i> ${I18n.t('navPosition')}
            </h2>
            <p class="text-xs text-gray-400" data-i18n="feat2Text">Organograma linear de 12 níveis com navegação fluida e inspeção de nós</p>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="relative flex-1 md:w-64">
              <input id="tree-search-input" type="text" placeholder="${I18n.t('searchUsernamePlaceholder')}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand transition">
            </div>
            <button onclick="TreeEngine.searchNode()" class="px-3.5 py-2 rounded-xl bg-brand text-black font-bold text-xs hover:bg-brand-glow shadow-neon-sm transition">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <button onclick="TreeEngine.zoomIn()" title="${I18n.t('expandAll')}" class="w-8 h-8 rounded-lg border border-white/10 bg-brand-card hover:border-brand text-gray-300 hover:text-brand flex items-center justify-center font-bold">+</button>
            <button onclick="TreeEngine.zoomOut()" title="${I18n.t('collapseAll')}" class="w-8 h-8 rounded-lg border border-white/10 bg-brand-card hover:border-brand text-gray-300 hover:text-brand flex items-center justify-center font-bold">-</button>
            <button onclick="TreeEngine.resetView()" class="px-3 py-1.5 rounded-lg border border-white/10 bg-brand-card hover:border-brand text-gray-300 hover:text-brand font-mono">${I18n.t('resetView')}</button>
            <button onclick="TreeEngine.centerSelf()" class="px-3 py-1.5 rounded-lg border border-brand/40 bg-brand/10 text-brand font-bold font-mono">${I18n.t('centerPosition')}</button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="TreeEngine.toggleAllLevels(true)" class="px-3 py-1.5 rounded-lg border border-white/10 bg-brand-card hover:text-brand text-gray-300 font-mono">${I18n.t('expandAll')}</button>
            <button onclick="TreeEngine.toggleAllLevels(false)" class="px-3 py-1.5 rounded-lg border border-white/10 bg-brand-card hover:text-brand text-gray-300 font-mono">${I18n.t('collapseAll')}</button>
          </div>
        </div>

        <div id="tree-viewport" class="relative w-full h-[620px] rounded-2xl border border-brand-border bg-gradient-to-b from-black via-brand-card to-black overflow-hidden cursor-grab active:cursor-grabbing select-none">

          <div id="tree-canvas" class="absolute inset-0 flex flex-col items-center p-12 transition-transform duration-100 ease-out origin-top">
          </div>

        </div>

        <div class="flex flex-wrap items-center justify-center gap-6 py-2 text-xs font-mono text-gray-400">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-brand shadow-neon-sm"></span>
            <span class="text-white">● ${I18n.t('active')}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>● ${I18n.t('pending')}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
            <span>● ${I18n.t('statusInactive')}</span>
          </div>
        </div>

      </div>
    `;
  },

  Deposit() {
    const s = AppState.projectSettings;
    const u = AppState.currentUser;
    const activated = (typeof Router !== 'undefined' && Router.isActivated) ? Router.isActivated() : (String(u.status || '').toUpperCase() === 'ACTIVE');
    const entryAmount = Number(s.entryAmount || 10);
    const addr = s.depositAddress || '0x71C4HashBEP20ProtocolVault99F4A810d7E8';

    if (!activated) {
      return `
      <div class="max-w-6xl mx-auto py-4 sm:py-6 space-y-6">

        <div class="relative rounded-3xl border border-amber-500/30 overflow-hidden shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)]">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-brand/10 pointer-events-none"></div>
          <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl animate-pulse pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand/10 blur-3xl animate-pulse pointer-events-none" style="animation-delay: 700ms"></div>

          <div class="relative p-5 sm:p-8 lg:p-10">
            <div class="flex items-center justify-between gap-3 flex-wrap mb-6">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] font-mono">
                <i class="fa-solid fa-triangle-exclamation animate-bounce"></i> Conta Pendente de Ativação
              </span>
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/40 text-brand text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] font-mono shadow-neon-sm">
                <i class="fa-solid fa-rocket"></i> Pré-Venda Lançamento
              </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

              <div class="lg:col-span-7 space-y-4 sm:space-y-5">
                <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[10px] text-gray-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  Utilizador: <span class="text-brand font-bold">@${u.username || ''}</span>
                  <span class="text-gray-500">•</span>
                  <span class="text-gray-400">Posição</span>
                  <span class="text-white font-bold">${u.positionNumber || '-'}</span>
                </div>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] leading-tight">
                  Ative a sua<br/>
                  <span class="bg-gradient-to-r from-brand via-emerald-300 to-brand bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,102,0.3)]">Posição Linear 12 Níveis</span>
                </h1>

                <p class="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
                  Para desbloquear o Dashboard, a sua Árvore, a Carteira, as Indicações e todos os bónus do protocolo,
                  confirme o depósito único de ativação. A sua posição na rede é vitalícia e garante o lugar para todos
                  os seus indicados nas próximas semanas.
                </p>

                <div class="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
                  <div class="rounded-xl border border-white/10 bg-black/30 backdrop-blur p-2.5 sm:p-3 text-center">
                    <div class="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Taxa Entrada</div>
                    <div class="text-lg sm:text-2xl font-black text-white font-mono">US$ ${entryAmount}</div>
                    <div class="text-[9px] font-mono text-gray-500">USDT BEP20</div>
                  </div>
                  <div class="rounded-xl border border-brand/30 bg-brand/10 backdrop-blur p-2.5 sm:p-3 text-center shadow-neon-sm">
                    <div class="text-[10px] font-mono text-brand uppercase tracking-wider mb-0.5">Bónus N1</div>
                    <div class="text-lg sm:text-2xl font-black text-brand font-mono">50%</div>
                    <div class="text-[9px] font-mono text-gray-500">Direto • Imediato</div>
                  </div>
                  <div class="rounded-xl border border-white/10 bg-black/30 backdrop-blur p-2.5 sm:p-3 text-center">
                    <div class="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Níveis</div>
                    <div class="text-lg sm:text-2xl font-black text-white font-mono">12</div>
                    <div class="text-[9px] font-mono text-gray-500">Lineares • 60% Equipa</div>
                  </div>
                </div>

                <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 sm:p-4 flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400 animate-pulse">
                    <i class="fa-solid fa-bolt"></i>
                  </div>
                  <div class="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    <strong class="font-black text-amber-300 uppercase tracking-wide text-[11px]">Apenas após a ativação</strong>
                    <div class="text-amber-200/70 mt-1 text-[11px] sm:text-xs">As suas indicações começam a gerar bónus, a sua posição linear fica gravada e o saldo da carteira fica disponível para saques em USDT BEP20.</div>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-5 lg:sticky lg:top-24">
                <div class="relative rounded-3xl border border-brand-border bg-brand-card/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl overflow-hidden">
                  <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand/20 blur-3xl pointer-events-none"></div>

                  <div class="relative space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Valor de Ativação</div>
                        <div class="text-3xl sm:text-4xl font-black font-mono text-brand neon-text-glow">US$ ${entryAmount}<span class="text-base text-gray-400 ml-1 font-bold">USD</span></div>
                      </div>
                      <div class="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/40 flex items-center justify-center shadow-neon-sm">
                        <i class="fa-solid fa-t-sign text-brand text-xl"></i>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-white/5 bg-gradient-to-br from-brand/[0.08] via-transparent to-brand/[0.04] p-4">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand shrink-0 shadow-neon-sm">
                          <i class="fa-solid fa-network-wired"></i>
                        </div>
                        <div class="space-y-1.5 min-w-0 flex-1">
                          <div class="text-[11px] font-black font-mono uppercase tracking-wider text-brand">Selecione a Rede do USDT</div>
                          <div class="text-[10px] text-gray-400 leading-relaxed">Recebimento reservado e processado apenas em USDT estável. <span class="text-brand font-bold">3 redes disponíveis neste lançamento</span>. O QR Code e o endereço do vault do protocolo são exibidos logo após clicar em "Ativar Conta". Confirme SEMPRE a rede antes de enviar. <span class="text-amber-300 font-bold">⚠ TRC-20 (Tron): valor mínimo operacional US$ 15.</span></div>
                        </div>
                      </div>

                      <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        ${[
                          {code:'bep20', name:'BNB Chain', short:'BEP-20', icon:'fa-brands fa-btc', desc:'Rápida · Taxa baixa', checked:false, disabled:false, tagColor:'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', border:'peer-checked:border-yellow-500/50 peer-checked:bg-yellow-500/10 peer-checked:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:border-yellow-500/30'},
                          {code:'trc20', name:'Tron Network', short:'TRC-20', icon:'fa-solid fa-bolt-lightning', desc:'Instantânea · Min. US$ 15', checked:false, disabled:false, tagColor:'bg-red-500/15 text-red-400 border-red-500/30', border:'peer-checked:border-red-500/50 peer-checked:bg-red-500/10 peer-checked:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:border-red-500/30'},
                          {code:'erc20', name:'Ethereum', short:'ERC-20', icon:'fa-brands fa-ethereum', desc:'Segura · Taxa média', checked:true, disabled:false, tagColor:'bg-blue-500/15 text-blue-400 border-blue-500/30', border:'peer-checked:border-blue-500/50 peer-checked:bg-blue-500/10 peer-checked:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-500/30'}
                        ].map(function(n){
                          return '<label class="group cursor-pointer relative">'+
                            '<input type="radio" name="vault-network" value="'+n.code+'" '+(n.checked?'checked':'')+' class="peer sr-only">'+
                            '<div class="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-3 transition '+n.border+'">'+
                              '<div class="flex items-center justify-between gap-2">'+
                                '<div class="flex items-center gap-2 min-w-0">'+
                                  '<div class="w-9 h-9 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center text-gray-300 '+(n.code==='bep20'?'peer-checked:text-yellow-400':(n.code==='trc20'?'peer-checked:text-red-400':'peer-checked:text-blue-400'))+' transition '+n.icon+'"></div>'+
                                  '<div class="min-w-0">'+
                                    '<div class="text-[11px] font-black font-mono uppercase tracking-wider text-white leading-tight">'+n.name+'</div>'+
                                    '<div class="text-[9px] text-gray-500 font-mono mt-0.5">'+n.desc+'</div>'+
                                  '</div>'+
                                '</div>'+
                                '<span class="px-1.5 py-0.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider shrink-0 '+n.tagColor+'">'+n.short+'</span>'+
                              '</div>'+
                            '</div>'+
                          '</label>';
                        }).join('')}
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5">
                      <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Token Fixo</div>
                        <div class="text-[12px] font-black font-mono text-white flex items-center gap-1.5">
                          <i class="fa-solid fa-t-sign text-brand"></i>
                          USDT (Tether)
                        </div>
                      </div>
                      <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Método Confirmação</div>
                        <div class="text-[12px] font-black font-mono text-white">12 blocos on-chain</div>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-brand/20 bg-brand/5 p-3 flex items-start gap-2.5">
                      <i class="fa-solid fa-network-wired text-brand mt-0.5 shrink-0 text-sm"></i>
                      <div class="text-[10px] text-brand-200/90 leading-relaxed">
                        <span class="font-black">3 Redes Operacionais:</span>
                        <span class="block mt-0.5">• <span class="font-black text-yellow-300">BEP-20 (BNB Chain)</span> · US$ 10 (minimo) · Taxa baixa</span>
                        <span class="block mt-0.5">• <span class="font-black text-red-300">TRC-20 (Tron)</span> · US$ 15 (mínimo operador, ajuste automático) · Taxa quase zero</span>
                        <span class="block mt-0.5">• <span class="font-black text-blue-300">ERC-20 (Ethereum)</span> · US$ 10 · Segura</span>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2.5 mt-3">
                      <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0 text-sm"></i>
                      <div class="text-[10px] text-amber-200/80 leading-relaxed">
                        Confirme sempre a <span class="font-black text-white">rede selecionada</span> antes de concluir. O QR e endereço gerados são exclusivos da rede que escolheste.
                        <span class="block mt-1"><span class="font-black text-red-300">⚠ Aviso Crítico:</span> enviar USDT por rede incorreta (ex: enviar BEP-20 para contrato ERC-20) resulta em <span class="font-black text-red-300">perda TOTAL e IRREVERSÍVEL dos fundos, sem possibilidade de recuperação.</span></span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2">
                      <input id="deposit-check" type="checkbox" class="mt-0.5 rounded border-white/20 bg-brand-surface text-brand focus:ring-brand">
                      <label for="deposit-check" class="text-xs text-gray-400 cursor-pointer select-none leading-relaxed">
                        Li e concordo com os <span class="text-brand font-bold hover:underline cursor-pointer" onclick="UI.showToast('Termos de Ativação FourHash: (1) depósito único vitalício de entrada, (2) sem reembolso após 12 confirmações on-chain irreversíveis, (3) valor de ativação permanece em cofre multi-sig do protocolo para garantia da estrutura linear e saques dos participantes, (4) confirmação on-chain é obrigatória para crédito automático.', 'info');">Termos de Ativação</span>
                        e confirmo que compreendo a obrigação de enviar EXATAMENTE o valor e pela rede selecionada.
                      </label>
                    </div>

                    <button id="deposit-activate-btn" onclick="PaymentVault.startActivationFlow(${entryAmount})" class="relative w-full overflow-hidden py-3.5 sm:py-4 rounded-2xl bg-brand hover:bg-brand-glow text-black font-black text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(0,255,102,0.35)] transition transform hover:scale-[1.01] active:scale-100 group">
                      <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full pointer-events-none"></span>
                      <span class="relative inline-flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-black/40 animate-ping group-hover:bg-black"></span>
                        <i class="fa-solid fa-qrcode"></i>
                        Ativar Conta · Gerar QR Code & Endereço
                      </span>
                    </button>

                    ${(u.role === 'admin' || AppState.isAdmin) ? `
                    <div class="pt-1 border-t border-white/5">
                      <button onclick="PaymentVault.simulateActivationOnly(${entryAmount})" class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-[11px] text-gray-500 hover:text-white border border-white/5 hover:border-white/20 bg-white/0 hover:bg-white/5 transition font-mono">
                        <i class="fa-solid fa-user-shield text-amber-400"></i>
                        <span class="text-amber-400 font-black">ADMIN</span> · Simular Ativação (Sem confirmação on-chain)
                      </button>
                    </div>
                    ` : ''}

                    <div class="flex items-center justify-center gap-2 pt-1">
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <span class="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <i class="fa-solid fa-vault text-gray-600"></i>
                        FourHash Vault Multi-Rede · Confirmação On-Chain · Sem Gateways Terceiros
                      </span>
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div class="relative rounded-2xl border border-white/10 bg-brand-card/60 backdrop-blur p-4 overflow-hidden group hover:border-brand/40 transition">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/20 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-wallet"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 01</div>
                  <div class="font-bold text-white text-sm mb-1">Deposite US$ ${entryAmount} USDT</div>
                  <div class="text-[11px] text-gray-400 leading-relaxed">Envie exatamente ${entryAmount}.00 USDT pela rede BEP20 para a carteira do protocolo acima.</div>
                </div>
              </div>
              <div class="relative rounded-2xl border border-white/10 bg-brand-card/60 backdrop-blur p-4 overflow-hidden group hover:border-brand/40 transition">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/20 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-link"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 02</div>
                  <div class="font-bold text-white text-sm mb-1">Confirme On-Chain</div>
                  <div class="text-[11px] text-gray-400 leading-relaxed">Após 12 confirmações na rede BNB Smart Chain, clique no botão de ativação.</div>
                </div>
              </div>
              <div class="relative rounded-2xl border border-brand/30 bg-brand/10 backdrop-blur p-4 overflow-hidden group shadow-neon-sm">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/20 blur-2xl group-hover:bg-brand/30 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand border border-white/20 flex items-center justify-center text-black mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-trophy"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 03</div>
                  <div class="font-bold text-white text-sm mb-1">Posição Liberada 🎉</div>
                  <div class="text-[11px] text-gray-300 leading-relaxed">Dashboard, Árvore, Carteira e Indicações ficam liberados. Bónus N1 = 50% para o seu patrocinador.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      `;
    }

    return `
      <div class="max-w-6xl mx-auto py-4 sm:py-6 space-y-6">

        <div class="relative rounded-3xl border border-brand/40 overflow-hidden shadow-[0_0_60px_-15px_rgba(0,255,102,0.25)]">
          <div class="absolute inset-0 bg-gradient-to-br from-brand/[0.06] via-transparent to-amber-500/[0.04] pointer-events-none"></div>
          <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl animate-pulse pointer-events-none"></div>

          <div class="relative p-5 sm:p-8 lg:p-10">
            <div class="flex items-center justify-between gap-3 flex-wrap mb-6">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/40 text-brand text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] font-mono shadow-neon-sm">
                <i class="fa-solid fa-wallet"></i> Conta Ativa · Depósito Adicional
              </span>
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] font-mono">
                <i class="fa-solid fa-arrow-trend-up"></i> Ampliar Posição Linear
              </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

              <div class="lg:col-span-5 space-y-4 sm:space-y-5">
                <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[10px] text-gray-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-brand animate-ping"></span>
                  Utilizador: <span class="text-brand font-bold">@${u.username || ''}</span>
                  <span class="text-gray-500">•</span>
                  <span class="text-gray-400">Posição</span>
                  <span class="text-white font-bold">${u.positionNumber || '-'}</span>
                </div>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] leading-tight">
                  Adicione Capital<br/>
                  <span class="bg-gradient-to-r from-brand via-emerald-300 to-brand bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,102,0.3)]">Amplie os seus Bónus</span>
                </h1>

                <p class="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
                  Conta ativada com sucesso. Realize depósitos adicionais para reforçar o seu posicionamento na estrutura linear,
                  aumentar bónus de indicação direta e acelerar a sua progressão pelos 12 níveis do protocolo.
                </p>

                <div class="grid grid-cols-2 gap-2 sm:gap-3 max-w-lg">
                  <div class="rounded-xl border border-white/10 bg-black/30 backdrop-blur p-2.5 sm:p-3 text-center">
                    <div class="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-0.5">Depósito Mínimo</div>
                    <div class="text-lg sm:text-2xl font-black text-white font-mono">US$ ${entryAmount}</div>
                    <div class="text-[9px] font-mono text-gray-500">Agora · Lançamento</div>
                  </div>
                  <div class="rounded-xl border border-brand/30 bg-brand/10 backdrop-blur p-2.5 sm:p-3 text-center shadow-neon-sm">
                    <div class="text-[10px] font-mono text-brand uppercase tracking-wider mb-0.5">Retorno N1</div>
                    <div class="text-lg sm:text-2xl font-black text-brand font-mono">50%</div>
                    <div class="text-[9px] font-mono text-gray-500">Direto · Imediato</div>
                  </div>
                </div>

                <div class="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-white/80">
                    <i class="fa-solid fa-vault"></i>
                  </div>
                  <div class="space-y-1.5">
                    <div class="font-black text-white text-sm uppercase tracking-wide">Endereço Manual BEP-20 (Alternativo)</div>
                    <div class="text-[11px] text-gray-400 leading-relaxed">Recomendamos usar o fluxo principal no painel direito (QR por rede). Se preferir transferência manual, envie EXATAMENTE ${entryAmount.toFixed(2)} USDT pela rede BEP-20 para o endereço abaixo e cole o TXID em ticket de suporte.</div>
                    <div class="flex items-center gap-2 mt-2">
                      <input type="text" readonly value="${addr}" class="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-gray-300 focus:outline-none truncate">
                      <button onclick="UI.copyToClipboard('${addr}')" class="px-2.5 py-1.5 rounded-lg bg-brand hover:bg-brand-glow text-black font-bold text-[11px] shrink-0">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-7 lg:sticky lg:top-24">
                <div class="relative rounded-3xl border border-brand-border bg-brand-card/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl overflow-hidden">
                  <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand/20 blur-3xl pointer-events-none"></div>

                  <div class="relative space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Valor do Depósito</div>
                        <div class="text-3xl sm:text-4xl font-black font-mono text-brand neon-text-glow">US$ ${entryAmount}<span class="text-base text-gray-400 ml-1 font-bold">USD</span></div>
                      </div>
                      <div class="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/40 flex items-center justify-center shadow-neon-sm">
                        <i class="fa-solid fa-t-sign text-brand text-xl"></i>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-white/5 bg-gradient-to-br from-brand/[0.08] via-transparent to-brand/[0.04] p-4">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand shrink-0 shadow-neon-sm">
                          <i class="fa-solid fa-network-wired"></i>
                        </div>
                        <div class="space-y-1.5 min-w-0 flex-1">
                          <div class="text-[11px] font-black font-mono uppercase tracking-wider text-brand">Selecione a Rede do USDT</div>
                          <div class="text-[10px] text-gray-400 leading-relaxed">Depósitos adicionais reservados e creditados apenas em USDT. <span class="text-brand font-bold">3 redes disponíveis</span>. Clique em "Depósito On-Chain" para abrir o QR Code do vault da rede selecionada. A confirmação on-chain (12 blocos) credita automaticamente. <span class="text-amber-300 font-bold">⚠ TRC-20: valor mínimo US$ 15.</span></div>
                        </div>
                      </div>

                      <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        ${[
                          {code:'bep20', name:'BNB Chain', short:'BEP-20', icon:'fa-brands fa-btc', desc:'Rápida · Taxa baixa', checked:false, disabled:false, tagColor:'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', border:'peer-checked:border-yellow-500/50 peer-checked:bg-yellow-500/10 peer-checked:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:border-yellow-500/30'},
                          {code:'trc20', name:'Tron Network', short:'TRC-20', icon:'fa-solid fa-bolt-lightning', desc:'Instantânea · Min. US$ 15', checked:false, disabled:false, tagColor:'bg-red-500/15 text-red-400 border-red-500/30', border:'peer-checked:border-red-500/50 peer-checked:bg-red-500/10 peer-checked:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:border-red-500/30'},
                          {code:'erc20', name:'Ethereum', short:'ERC-20', icon:'fa-brands fa-ethereum', desc:'Segura · Taxa média', checked:true, disabled:false, tagColor:'bg-blue-500/15 text-blue-400 border-blue-500/30', border:'peer-checked:border-blue-500/50 peer-checked:bg-blue-500/10 peer-checked:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-500/30'}
                        ].map(function(n){
                          return '<label class="group cursor-pointer relative">'+
                            '<input type="radio" name="vault-network" value="'+n.code+'" '+(n.checked?'checked':'')+' class="peer sr-only">'+
                            '<div class="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-3 transition '+n.border+'">'+
                              '<div class="flex items-center justify-between gap-2">'+
                                '<div class="flex items-center gap-2 min-w-0">'+
                                  '<div class="w-9 h-9 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center text-gray-300 '+(n.code==='bep20'?'peer-checked:text-yellow-400':(n.code==='trc20'?'peer-checked:text-red-400':'peer-checked:text-blue-400'))+' transition '+n.icon+'"></div>'+
                                  '<div class="min-w-0">'+
                                    '<div class="text-[11px] font-black font-mono uppercase tracking-wider text-white leading-tight">'+n.name+'</div>'+
                                    '<div class="text-[9px] text-gray-500 font-mono mt-0.5">'+n.desc+'</div>'+
                                  '</div>'+
                                '</div>'+
                                '<span class="px-1.5 py-0.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider shrink-0 '+n.tagColor+'">'+n.short+'</span>'+
                              '</div>'+
                            '</div>'+
                          '</label>';
                        }).join('')}
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5">
                      <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Token</div>
                        <div class="text-[12px] font-black font-mono text-white flex items-center gap-1.5">
                          <i class="fa-solid fa-t-sign text-brand"></i> USDT (Tether)
                        </div>
                      </div>
                      <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div class="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Método Confirmação</div>
                        <div class="text-[12px] font-bold text-white">12 blocos on-chain</div>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-brand/20 bg-brand/5 p-3 flex items-start gap-2.5 mt-3">
                      <i class="fa-solid fa-network-wired text-brand mt-0.5 shrink-0 text-sm"></i>
                      <div class="text-[10px] text-brand-200/90 leading-relaxed">
                        <span class="font-black">Mínimos por rede:</span>
                        <span class="block mt-0.5">• <span class="font-black text-yellow-300">BEP-20 (BNB)</span>: US$ 9</span>
                        <span class="block mt-0.5">• <span class="font-black text-red-300">TRC-20 (Tron)</span>: US$ 15 (operador)</span>
                        <span class="block mt-0.5">• <span class="font-black text-blue-300">ERC-20 (ETH)</span>: US$ 9.5</span>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-2.5 mt-3">
                      <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0 text-sm"></i>
                      <div class="text-[10px] text-amber-200/80 leading-relaxed">
                        Envie <span class="font-black text-white">o valor EXATO mostrado no modal</span> <span class="font-black text-white">pela rede que selecionaste</span>.
                        <span class="block mt-1">Se introduzires um valor abaixo do mínimo para TRC-20, o pedido é automaticamente ajustado para US$ 15. <span class="font-black text-red-300">Rede errada = perda PERMANENTE.</span></span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2">
                      <input id="deposit-check" type="checkbox" class="mt-0.5 rounded border-white/20 bg-brand-surface text-brand focus:ring-brand">
                      <label for="deposit-check" class="text-xs text-gray-400 cursor-pointer select-none leading-relaxed">Li e concordo que depósitos adicionais serão creditados como reforço de posição linear, e confirmo que <span class="text-white font-bold">transações on-chain são irreversíveis</span> após 12 confirmações de bloco.</label>
                    </div>

                    <button id="deposit-activate-btn" onclick="PaymentVault.startAdditionalDepositFlow(${entryAmount})" class="relative w-full overflow-hidden py-3.5 sm:py-4 rounded-2xl bg-brand hover:bg-brand-glow text-black font-black text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(0,255,102,0.35)] transition transform hover:scale-[1.01] active:scale-100 group">
                      <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full pointer-events-none"></span>
                      <span class="relative inline-flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-black/40 animate-ping group-hover:bg-black"></span>
                        <i class="fa-solid fa-qrcode"></i>
                        Depósito On-Chain · Gerar QR Code Vault
                      </span>
                    </button>

                    ${(u.role === 'admin' || AppState.isAdmin) ? `
                    <div class="pt-1 border-t border-white/5">
                      <button onclick="PaymentVault.simulateActivationOnly(${entryAmount})" class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-[11px] text-gray-500 hover:text-white border border-white/5 hover:border-white/20 bg-white/0 hover:bg-white/5 transition font-mono">
                        <i class="fa-solid fa-user-shield text-amber-400"></i>
                        <span class="text-amber-400 font-black">ADMIN</span> · Simular Crédito Manual
                      </button>
                    </div>
                    ` : ''}

                    <div class="flex items-center justify-center gap-2 pt-1">
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <span class="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <i class="fa-solid fa-vault text-gray-600"></i>
                        FourHash Vault Multi-Rede · Confirmação On-Chain · Sem Gateways Terceiros
                      </span>
                      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div class="relative rounded-2xl border border-white/10 bg-brand-card/60 backdrop-blur p-4 overflow-hidden group hover:border-brand/40 transition">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/20 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-network-wired"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 01</div>
                  <div class="font-bold text-white text-sm mb-1">Selecione Rede (USDT)</div>
                  <div class="text-[11px] text-gray-400 leading-relaxed">Escolha uma das 3 redes suportadas: BEP-20 (BNB), TRC-20 (Tron) ou ERC-20 (Ethereum). O valor de depósito é fixo em US$ ${entryAmount.toFixed(2)} em USDT.</div>
                </div>
              </div>
              <div class="relative rounded-2xl border border-white/10 bg-brand-card/60 backdrop-blur p-4 overflow-hidden group hover:border-brand/40 transition">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/10 blur-2xl group-hover:bg-brand/20 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-qrcode"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 02</div>
                  <div class="font-bold text-white text-sm mb-1">Pague via QR / Endereço</div>
                  <div class="text-[11px] text-gray-400 leading-relaxed">Abra o QR Code clicando no botão principal. Copie o endereço da rede selecionada e envie EXATAMENTE o valor indicado. Opcionalmente, informe o TXID para validação rápida.</div>
                </div>
              </div>
              <div class="relative rounded-2xl border border-brand/30 bg-brand/10 backdrop-blur p-4 overflow-hidden group shadow-neon-sm">
                <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-brand/20 blur-2xl group-hover:bg-brand/30 transition"></div>
                <div class="relative">
                  <div class="w-9 h-9 rounded-xl bg-brand border border-white/20 flex items-center justify-center text-black mb-3 shadow-neon-sm">
                    <i class="fa-solid fa-chart-line"></i>
                  </div>
                  <div class="text-[11px] font-mono text-brand uppercase tracking-wider font-black mb-1">Passo 03</div>
                  <div class="font-bold text-white text-sm mb-1">Crédito Automático ✓</div>
                  <div class="text-[11px] text-gray-300 leading-relaxed">Após 12 confirmações on-chain, o sistema FourHash valida e credita automaticamente o saldo na sua carteira. O bónus de reforço de posição entra em vigor imediatamente.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  Wallet() {
    const u = AppState.currentUser;
    const s = AppState.projectSettings.withdraw;
    const totalWithdrawn = AppState.withdrawals.reduce((sum, w) => sum + w.netAmount, 0);
    const txTypeKey = (t) => t === 'DEPÓSITO' ? 'depositBonus' : t === 'POSICIONAMENTO' ? 'positioningBonus' : 'bonusDirect';
    const txStatusKey = (st) => st === 'Confirmado' ? 'statusConfirmed' : st === 'Processando' ? 'statusProcessing' : 'statusPending';
    const wdStatusKey = (st) => st === 'Concluído' ? 'statusCompleted' : st === 'Processando' ? 'statusProcessing' : 'statusPending';
    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white font-['Space_Grotesk']" data-i18n="walletTitle">Minha Carteira</h2>
            <p class="text-xs text-gray-400" data-i18n="walletSubtitle">Controle financeiro transparente com rastreio na BSC e saques apenas em <span class="text-brand font-bold">USDT BEP20</span></p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button onclick="UI.openWithdrawModal()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs shadow-neon transition shadow-amber-500/20 border border-amber-400/40">
              <i class="fa-solid fa-money-bill-transfer mr-1.5"></i><span data-i18n="withdrawBtn">Sacar em USDT BEP20</span>
            </button>
            <button onclick="Router.navigate('deposit')" class="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs shadow-neon transition">
              <i class="fa-solid fa-plus mr-1.5"></i><span data-i18n="newDepositBtn">Novo Depósito</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="availableBalance">Saldo Disponível</div>
            <div class="text-2xl font-black text-white font-mono">$ ${u.availableBalance.toFixed(2)}</div>
            <div class="text-[10px] text-brand mt-1 font-mono" data-i18n="readyToUse">Pronto para saque / uso</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="pendingBalance">Saldo Pendente</div>
            <div class="text-2xl font-black text-amber-400 font-mono">$ ${u.pendingBalance.toFixed(2)}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="pendingBlockConf">Em confirmação de bloco</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="totalReceived">Total Recebido</div>
            <div class="text-2xl font-black text-brand font-mono">$ ${u.totalReceived.toFixed(2)}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="bonusesDirectPos">Bônus diretos + posicionamento</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="directReferrals">Indicados Ativos</div>
            <div class="text-2xl font-black text-white font-mono">${u.activeReferralsCount} / ${u.directReferralsCount}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono"><span data-i18n="convRateLabel">Taxa de conversão</span>: 78%</div>
          </div>

          <div class="rounded-2xl border border-amber-500/30 bg-brand-card p-5">
            <div class="text-xs font-mono text-amber-300 mb-1" data-i18n="withdrawCardTotalWithdrawn">Total Sacado</div>
            <div class="text-2xl font-black text-amber-200 font-mono">$ ${totalWithdrawn.toFixed(2)}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono">${AppState.withdrawals.length} <span data-i18n="withdrawalsCountLabel">saques • USDT BEP20</span></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono mb-4" data-i18n="withdrawFeesLimitsTitle">Taxas & Limites de Saque</h3>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="tokenAllowed">Token permitido</div>
                <div class="text-white font-bold mt-0.5 font-mono" data-i18n="usdtOnly">USDT (apenas)</div>
              </div>
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="usdtNetwork">Rede</div>
                <div class="text-white font-bold mt-0.5 font-mono" data-i18n="networkBep20Only">BEP20 • BNB Chain</div>
              </div>
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="minWithdrawLabel">Valor mínimo</div>
                <div class="text-white font-bold mt-0.5 font-mono">$ ${s.minAmount.toFixed(2)} ${I18n.t('usdtLabel')}</div>
              </div>
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="maxWithdrawPerReqLabel">Valor máximo / saque</div>
                <div class="text-white font-bold mt-0.5 font-mono">$ ${s.maxAmountPerRequest.toLocaleString()} ${I18n.t('usdtLabel')}</div>
              </div>
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="withdrawFeeFlatLabel">Taxa rede BEP20</div>
                <div class="text-amber-300 font-bold mt-0.5 font-mono">$ ${s.networkFeeFlat.toFixed(2)} <span data-i18n="fixedFeeLabel">fixa</span></div>
              </div>
              <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
                <div class="text-gray-400 font-mono" data-i18n="withdrawProcessingLabel">Processamento</div>
                <div class="text-white font-bold mt-0.5 font-mono">${I18n.t('walletProcessingPrefix')} ${s.processingHours}<span data-i18n="hoursLabel">h úteis</span></div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div class="space-y-1 text-xs">
                <h4 class="text-amber-200 font-bold font-mono uppercase tracking-wider" data-i18n="withdrawImportantWarning">Aviso Importante de Saque</h4>
                <p class="text-gray-300 leading-relaxed" data-i18n="withdrawImportantP1">Só enviamos para <span class="text-white font-bold">carteiras BEP20 (BNB Smart Chain)</span>. Verifique a rede antes de informar o endereço — envios incorretos não podem ser revertidos.</p>
                <p class="text-gray-300 leading-relaxed" data-i18n="withdrawImportantP2">Taxa de rede fixa é paga em USDT e descontada automaticamente do valor do saque. <span class="text-white font-mono">Líquido = valor - taxa.</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono" data-i18n="recordFullTx">Registro Completo de Transações</h3>
            <span class="text-[10px] font-mono text-gray-500" data-i18n="txSubtitleIn">Depósitos • Bônus • Posicionamentos</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-3" data-i18n="txDate">DATA</th>
                  <th class="py-3" data-i18n="txType">TIPO</th>
                  <th class="py-3" data-i18n="txAmount">VALOR</th>
                  <th class="py-3" data-i18n="txToken">TOKEN</th>
                  <th class="py-3" data-i18n="txStatus">STATUS</th>
                  <th class="py-3 text-right" data-i18n="txExplorer">EXPLORER</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${AppState.transactions.map(tx => `
                  <tr class="hover:bg-white/[0.02] transition">
                    <td class="py-3 font-mono text-gray-300">${tx.date}</td>
                    <td class="py-3 font-bold text-white">${I18n.t(txTypeKey(tx.type))}</td>
                    <td class="py-3 font-mono font-extrabold ${tx.amount > 0 ? 'text-brand' : 'text-gray-300'}">+$${tx.amount.toFixed(2)}</td>
                    <td class="py-3 font-mono text-gray-400">${I18n.t('usdtNetwork')}</td>
                    <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">${I18n.t(txStatusKey(tx.status))}</span></td>
                    <td class="py-3 text-right">
                      <button onclick="window.open('https://bscscan.com', '_blank')" class="px-2.5 py-1 rounded bg-brand-surface hover:bg-brand/10 border border-white/10 text-gray-300 hover:text-brand font-mono text-[11px] transition">
                        ${I18n.t('viewBsc')} <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[9px]"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono" data-i18n="recordWithdrawals">Histórico de Saques (USDT BEP20)</h3>
            <button onclick="UI.openWithdrawModal()" class="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-bold text-[11px] font-mono transition">
              <i class="fa-solid fa-plus mr-1 text-[9px]"></i><span data-i18n="wdNewBtn">Novo Saque</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-3" data-i18n="wdDate">DATA</th>
                  <th class="py-3" data-i18n="wdRequestedAmount">VALOR SOLICITADO</th>
                  <th class="py-3" data-i18n="wdNetworkFee">TAXA REDE</th>
                  <th class="py-3" data-i18n="wdNet">LÍQUIDO</th>
                  <th class="py-3" data-i18n="wdDestinationWallet">CARTEIRA DESTINO (BEP20)</th>
                  <th class="py-3" data-i18n="wdStatus">STATUS</th>
                  <th class="py-3" data-i18n="wdETA">PREVISÃO</th>
                  <th class="py-3 text-right" data-i18n="wdExplorer">EXPLORER</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${AppState.withdrawals.length === 0 ? `
                  <tr>
                    <td colspan="8" class="py-10 text-center text-gray-500 font-mono text-xs">
                      <i class="fa-regular fa-credit-card text-gray-600 mr-2"></i>
                      <span data-i18n="wdEmptyState">Nenhum saque realizado ainda. Clique em "Sacar em USDT BEP20" para começar.</span>
                    </td>
                  </tr>
                ` : AppState.withdrawals.map(w => `
                  <tr class="hover:bg-white/[0.02] transition">
                    <td class="py-3 font-mono text-gray-300">${w.date}</td>
                    <td class="py-3 font-mono font-bold text-white">$ ${w.amount.toFixed(2)}</td>
                    <td class="py-3 font-mono text-amber-300">−$ ${w.fee.toFixed(2)}</td>
                    <td class="py-3 font-mono font-extrabold text-amber-200">$ ${w.netAmount.toFixed(2)}</td>
                    <td class="py-3 font-mono text-gray-300"><span class="px-2 py-0.5 rounded bg-black/40 border border-white/5">${w.wallet}</span></td>
                    <td class="py-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${w.status === 'Concluído' ? 'bg-brand/10 text-brand' : w.status === 'Processando' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-white/5 text-gray-400'}">
                        ${I18n.t(wdStatusKey(w.status))}
                      </span>
                    </td>
                    <td class="py-3 font-mono text-gray-400 text-[11px]">${w.eta}</td>
                    <td class="py-3 text-right">
                      ${w.hash ? `
                        <button onclick="window.open('https://bscscan.com/tx/${w.hash}', '_blank')" class="px-2.5 py-1 rounded bg-brand-surface hover:bg-brand/10 border border-white/10 text-gray-300 hover:text-brand font-mono text-[11px] transition">
                          <span data-i18n="wdViewTx">Ver Tx</span> <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[9px]"></i>
                        </button>
                      ` : `<span class="text-[10px] font-mono text-gray-600" data-i18n="wdWaitingHash">Aguardando hash</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  Referrals() {
    const u = AppState.currentUser;
    const rStatus = (s) => s === 'ATIVO' ? I18n.t('active') : s === 'INATIVO' ? I18n.t('statusInactive') : I18n.t('pending');
    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-white font-['Space_Grotesk']" data-i18n="referralsTitle">Minhas Indicações</h2>
          <p class="text-xs text-gray-400" data-i18n="referralsSubtitle">Regra equipe 60/40: Ganhe US$ 5.00 por indicação direta (N1) + US$ 0.25 p/ ativação nos níveis 2→5</p>
        </div>

        <div class="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand-card via-black to-brand-card p-6">
          <div class="text-xs font-mono text-brand font-bold uppercase tracking-wider mb-2" data-i18n="regTeamTitle">Estrutura de Divisão — Fase 1 Lançamento</div>
          <div class="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center">
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5 md:col-span-1">
              <div class="text-[10px] text-gray-400 font-mono" data-i18n="regEntradaLabel">ENTRADA</div>
              <div class="text-2xl font-black text-white font-mono mt-1" data-i18n="regEntradaValue">US$ 10</div>
              <div class="text-[9px] text-gray-500">100% USDT BEP20</div>
            </div>

            <div class="text-brand font-black text-2xl hidden md:flex items-center justify-center">➜</div>

            <div class="md:col-span-5 grid grid-cols-5 gap-2">
              <div class="p-2.5 rounded-xl bg-brand/15 border border-brand/40">
                <div class="text-[9px] text-brand font-mono font-bold"><span data-i18n="regTeamN1Label">N1</span> 50%</div>
                <div class="text-sm font-black text-white font-mono mt-0.5" data-i18n="regTeamN1Val">$ 5,00</div>
                <div class="text-[8px] text-gray-400" data-i18n="regTeamN1Pct">Indic. Direto</div>
              </div>
              <div class="p-2.5 rounded-xl bg-brand/8 border border-brand/25">
                <div class="text-[9px] text-brand font-mono font-bold"><span data-i18n="regTeamN2Label">N2</span> 2,5%</div>
                <div class="text-sm font-black text-white font-mono mt-0.5" data-i18n="regTeamN2Val">$ 0,25</div>
                <div class="text-[8px] text-gray-400" data-i18n="regTeamN2Pct">Nível 2</div>
              </div>
              <div class="p-2.5 rounded-xl bg-brand/8 border border-brand/25">
                <div class="text-[9px] text-brand font-mono font-bold"><span data-i18n="regTeamN3Label">N3</span> 2,5%</div>
                <div class="text-sm font-black text-white font-mono mt-0.5" data-i18n="regTeamN3Val">$ 0,25</div>
                <div class="text-[8px] text-gray-400" data-i18n="regTeamN3Pct">Nível 3</div>
              </div>
              <div class="p-2.5 rounded-xl bg-brand/8 border border-brand/25">
                <div class="text-[9px] text-brand font-mono font-bold"><span data-i18n="regTeamN4Label">N4</span> 2,5%</div>
                <div class="text-sm font-black text-white font-mono mt-0.5" data-i18n="regTeamN4Val">$ 0,25</div>
                <div class="text-[8px] text-gray-400" data-i18n="regTeamN4Pct">Nível 4</div>
              </div>
              <div class="p-2.5 rounded-xl bg-brand/8 border border-brand/25">
                <div class="text-[9px] text-brand font-mono font-bold"><span data-i18n="regTeamN5Label">N5</span> 2,5%</div>
                <div class="text-sm font-black text-white font-mono mt-0.5" data-i18n="regTeamN5Val">$ 0,25</div>
                <div class="text-[8px] text-gray-400" data-i18n="regTeamN5Pct">Nível 5</div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 md:col-span-1 mt-2 md:mt-0">
              <div class="text-[9px] text-amber-300 font-mono font-bold" data-i18n="regFundLabel">FUNDO 40%</div>
              <div class="text-lg font-black text-amber-200 font-mono mt-0.5" data-i18n="regFundVal">$ 4,00</div>
              <div class="text-[8px] text-gray-400" data-i18n="regFundPct">Liquidez</div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
            <span class="text-gray-400"><span data-i18n="regFooterTeamTotal">Total distribuído equipe</span>: <span class="text-brand font-bold" data-i18n="regFooterTeamPctVal">60% = US$ 6,00</span></span>
            <span class="text-gray-400"><span data-i18n="regFooterFund">Fundo liquidez projeto</span>: <span class="text-amber-300 font-bold" data-i18n="regFooterFundVal">40% = US$ 4,00</span></span>
            <span class="text-gray-500" data-i18n="regFooterSum100">Soma: 100% = US$ 10,00 ✅</span>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="text-xs font-mono text-gray-400 mb-1 uppercase" data-i18n="referralsYourLinkLabel">Seu Link de Convite Pessoal</div>
            <div class="text-sm font-mono text-brand font-bold">https://fourhash.app/register?ref=${u.username}</div>
          </div>
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <button onclick="UI.copyToClipboard('https://fourhash.app/register?ref=${u.username}'); UI.showToast(I18n.t('referralsCopySuccess'), 'success');" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs shadow-neon transition">
              <i class="fa-solid fa-copy mr-1.5"></i><span data-i18n="referralsShareCopy">Copiar Link</span>
            </button>
            <button onclick="window.open('https://wa.me/?text=' + encodeURIComponent('${I18n.t('tagline')} https://fourhash.app/register?ref=${u.username}'), '_blank');" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:border-green-400 bg-brand-surface text-green-400 font-bold text-xs transition">
              <i class="fa-brands fa-whatsapp mr-1.5"></i><span data-i18n="referralsShareWhatsApp">WhatsApp</span>
            </button>
            <button onclick="window.open('https://t.me/share/url?url=' + encodeURIComponent('https://fourhash.app/register?ref=${u.username}') + '&text=' + encodeURIComponent('${I18n.t('tagline')}'), '_blank');" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:border-sky-400 bg-brand-surface text-sky-400 font-bold text-xs transition">
              <i class="fa-brands fa-telegram mr-1.5"></i><span data-i18n="referralsShareTelegram">Telegram</span>
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono mb-4" data-i18n="directReferrals">Membros Indicados Diretamente</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-3">${I18n.t('myUsername')}</th>
                  <th class="py-3" data-i18n="myStatus">STATUS</th>
                  <th class="py-3" data-i18n="myPosition">POSIÇÃO</th>
                  <th class="py-3" data-i18n="bonusDirect">BÔNUS GERADO</th>
                  <th class="py-3 text-right" data-i18n="txDate">DATA</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${(() => {
                  var rows = '';
                  try {
                    var list = (AppState.referrals && AppState.referrals.direct && AppState.referrals.direct.length) ? AppState.referrals.direct : [];
                    if (!list.length) return `<tr><td colspan="5" class="py-10 text-center text-gray-500 font-mono text-[11px]"><i class="fa-solid fa-user-plus mr-2 text-gray-600"></i>Sem indicações diretas ainda. Compartilhe seu link de convite!</td></tr>`;
                    list.forEach(function(ref){
                      var isActive = (ref.status === 'ACTIVE' || ref.status === 'active');
                      var statusClass = isActive ? 'bg-brand/10 text-brand' : 'bg-amber-400/10 text-amber-400';
                      var statusLabel = isActive ? I18n.t('active') : I18n.t('pending');
                      var bonusClass = isActive ? 'font-bold text-brand' : 'text-gray-500';
                      var bonusVal = isActive ? ('+US$ ' + (Number(ref.bonus || 5.00)).toFixed(2)) : 'US$ 0.00';
                      var dt = '';
                      try { if (ref.date) dt = ref.date; else if (ref.createdAt) dt = new Date(ref.createdAt).toLocaleDateString('pt-PT'); } catch(e){}
                      rows += `
                        <tr>
                          <td class="py-3 font-bold text-white">@${ref.username || 'user'}</td>
                          <td class="py-3"><span class="px-2 py-0.5 rounded ${statusClass} text-[10px] font-mono">● ${statusLabel}</span></td>
                          <td class="py-3 font-mono text-gray-300">${ref.positionNumber || '-'}</td>
                          <td class="py-3 font-mono ${bonusClass}">${bonusVal}</td>
                          <td class="py-3 text-right font-mono text-gray-400">${dt || '-'}</td>
                        </tr>`;
                    });
                  } catch(e) {}
                  return rows || `<tr><td colspan="5" class="py-10 text-center text-gray-500 font-mono text-[11px]"><i class="fa-solid fa-user-plus mr-2 text-gray-600"></i>Sem indicações diretas ainda. Compartilhe seu link de convite!</td></tr>`;
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  Profile() {
    const u = AppState.currentUser;
    const isMaster = ((AppState.currentUser.id || '').toString().toLowerCase() === '7ce5a80a-abc8-4bc3-a17f-d7ed8670b15f') || ((AppState.currentUser.email || '').toString().toLowerCase() === '4hashprotocol@gmail.com');
    const showAdminBtn = (typeof Router !== 'undefined' && typeof Router.isAdmin === 'function' && Router.isAdmin()) || isMaster;
    return `
      <div class="max-w-2xl mx-auto py-4 space-y-6">
        ${showAdminBtn ? `
        <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xl">
          <div>
            <div class="text-amber-400 font-black text-sm sm:text-base tracking-wide font-['Space_Grotesk']"><i class="fa-solid fa-crown mr-2"></i>ACESSO ADMINISTRADOR MASTER</div>
            <div class="text-[11px] text-gray-400 mt-1 font-mono">Acesso total ao backoffice, financeiro e suporte.</div>
          </div>
          <button onclick="Router.navigate('admin')" class="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm tracking-wider shadow-neon-sm transition whitespace-nowrap"><i class="fa-solid fa-gauge-high mr-2"></i>ABRIR PAINEL ADMIN</button>
        </div>
        ` : ''}
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 shadow-2xl">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div class="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/50 flex items-center justify-center font-black text-brand text-2xl shadow-neon-sm">
              @${(u.username || 'U').toString().substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 class="text-xl font-bold text-white font-['Space_Grotesk']">${u.fullName || u.username || 'Usuário'}</h2>
              <div class="text-xs font-mono text-brand">@${u.username || ''} • Pos: ${u.positionNumber || '-'}</div>
              <div class="text-[11px] text-gray-400 mt-0.5">${u.country || ''}</div>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); UI.showToast('Alterações salvas com sucesso!', 'success');" class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">Nome Completo</label>
              <input type="text" value="${u.fullName || ''}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-gray-400 mb-1">Username (Fixo)</label>
                <input type="text" readonly disabled value="@${u.username || ''}" class="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 font-mono cursor-not-allowed">
              </div>
              <div>
                <label class="block text-xs font-mono text-gray-400 mb-1">Patrocinador</label>
                <input type="text" readonly disabled value="@${u.sponsor || ''}" class="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-brand font-mono cursor-not-allowed">
              </div>
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">E-mail</label>
              <input type="email" value="${u.email || ''}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">Telefone</label>
              <input type="tel" value="${u.phone || ''}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div class="pt-4">
              <button type="submit" class="w-full py-3 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs tracking-wider shadow-neon transition">
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  Security() {
    return `
      <div class="max-w-2xl mx-auto py-4 space-y-6">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 shadow-2xl">
          <h2 class="text-xl font-bold text-white font-['Space_Grotesk'] mb-6" data-i18n="navSecurity">Segurança da Conta</h2>

          <form onsubmit="event.preventDefault(); UI.showToast('Senha alterada com sucesso!', 'success');" class="space-y-4 pb-6 border-b border-white/10">
            <h3 class="text-xs font-mono text-brand font-bold uppercase">Alterar Senha de Acesso</h3>
            <div>
              <label class="block text-xs text-gray-400 mb-1 font-mono">Senha Atual</label>
              <input type="password" required placeholder="••••••••" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-400 mb-1 font-mono">Nova Senha</label>
                <input type="password" required minlength="6" placeholder="Mínimo 6 caracteres" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand">
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1 font-mono">Confirmar Nova Senha</label>
                <input type="password" required minlength="6" placeholder="Repita a nova senha" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand">
              </div>
            </div>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-brand text-black font-bold text-xs hover:bg-brand-glow shadow-neon-sm transition">
              Atualizar Senha
            </button>
          </form>

          <div class="pt-6 space-y-4">
            <div class="flex items-center justify-between p-4 rounded-xl bg-brand-surface border border-white/5">
              <div>
                <div class="text-xs font-bold text-white">Autenticação de Dois Fatores (2FA)</div>
                <div class="text-[11px] text-gray-400">Proteja saques e acessos com Google Authenticator</div>
              </div>
              <button onclick="UI.showToast('2FA preparado para ativação na Fase 2 com Supabase Auth.', 'info')" class="px-3.5 py-1.5 rounded-lg border border-brand/40 bg-brand/10 text-brand font-bold text-xs">
                Configurar
              </button>
            </div>

            <div class="p-4 rounded-xl bg-brand-surface border border-white/5 text-xs font-mono space-y-1">
              <div class="text-gray-400 uppercase text-[10px]">Sessão Atual</div>
              <div class="text-white flex items-center justify-between">
                <span>IP: 187.54.210.12 (Maceió, Brasil)</span>
                <span class="text-brand">● Ativo agora</span>
              </div>
              <div class="text-gray-500 text-[11px]">Dispositivo: Chrome no Windows Desktop</div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  Support() {
    return `
      <div class="max-w-3xl mx-auto py-4 space-y-6">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8">
          <h2 class="text-2xl font-bold text-white font-['Space_Grotesk']" data-i18n="supportTitle">Suporte & FAQ</h2>
          <p class="text-xs text-gray-400 mt-1" data-i18n="supportSubtitle">Dúvidas frequentes sobre o protocolo FourHash e abertura de tickets</p>

          <h3 class="mt-6 text-xs font-mono text-brand font-bold uppercase mb-3" data-i18n="faqTitle">Perguntas Frequentes</h3>
          <div class="mt-2 space-y-3">
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5">
              <h4 class="text-xs font-bold text-white" data-i18n="faqQ1">Como funciona o valor de entrada de US$ 10?</h4>
              <p class="text-[11px] text-gray-400 mt-1" data-i18n="faqA1">Cada novo participante realiza o depósito de US$ 10 em USDT pela rede BEP20. Distribuição fase de lançamento: 50% (US$ 5) crédito ao patrocinador direto (Nível 1), + 2,5% (US$ 0,25) para cada upline N2, N3, N4 e N5 = 60% equipe. Os 40% restantes (US$ 4) são retidos no fundo de liquidez sustentável do projeto.</p>
            </div>
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5">
              <h4 class="text-xs font-bold text-white" data-i18n="faqQ2">O que são os 12 níveis de posicionamento linear?</h4>
              <p class="text-[11px] text-gray-400 mt-1" data-i18n="faqA2">É uma estrutura contínua e dinâmica na qual os participantes são alocados cronologicamente, garantindo expansão organizada de equipe e acompanhamento visual em tempo real.</p>
            </div>
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5">
              <h4 class="text-xs font-bold text-white" data-i18n="faqQ3">Como funciona o spillover na fila linear?</h4>
              <p class="text-[11px] text-gray-400 mt-1" data-i18n="faqA3">Quando o patrocinador enche sua fileira de indicados diretos, os novos entram automaticamente por spillover nas linhas dos uplines N2 a N5, promovendo ganhos passivos coletivos.</p>
            </div>
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5">
              <h4 class="text-xs font-bold text-white" data-i18n="faqQ4">Quando e como eu saco os ganhos?</h4>
              <p class="text-[11px] text-gray-400 mt-1" data-i18n="faqA4">Após cada confirmação on-chain em BSC, o bônus cai em Saldo Disponível. O saque é exclusivo em USDT BEP20, mínimo de US$ 10, taxa fixa de rede US$ 0,50 e processamento de até 24h úteis.</p>
            </div>
            <div class="p-4 rounded-xl bg-brand-surface border border-white/5">
              <h4 class="text-xs font-bold text-white" data-i18n="faqQ5">É seguro? Onde ficam meus fundos?</h4>
              <p class="text-[11px] text-gray-400 mt-1" data-i18n="faqA5">Tudo é transparente e auditável via BSCScan. O protocolo segue a regra 60/40 (equipe/fundo) para garantir liquidez perene; a Fase 1 de lançamento é 100% auditável por qualquer usuário ativo.</p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-white/10 space-y-4">
            <h3 class="text-xs font-mono text-brand font-bold uppercase mb-2" data-i18n="supportContactTitle">Abrir Novo Chamado</h3>
            <p class="text-[11px] text-gray-400 mb-2" data-i18n="supportContactText">Nossa equipe 24/7 está pronta para ajudar com ativações, dúvidas de posicionamento e confirmação de saques.</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button onclick="window.open('https://wa.me/5500000000000', '_blank')" class="px-4 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-xs transition flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp"></i><span data-i18n="supportWhatsAppBtn">WhatsApp Suporte</span>
              </button>
              <button onclick="window.open('https://t.me/fourhash', '_blank')" class="px-4 py-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold text-xs transition flex items-center justify-center gap-2">
                <i class="fa-brands fa-telegram"></i><span data-i18n="supportTelegramBtn">Telegram Oficial</span>
              </button>
              <button onclick="window.open('mailto:diretoria@fourhash.app', '_blank')" class="px-4 py-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/30 text-violet-400 font-bold text-xs transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-envelope"></i><span data-i18n="supportEmailBtn">E-mail Diretoria</span>
              </button>
            </div>

            <form onsubmit="event.preventDefault(); UI.showToast('Chamado #4812 criado com sucesso!', 'success');" class="space-y-3">
              <div>
                <input type="text" required placeholder="${I18n.t('supportSubjectPlaceholder')}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand transition">
              </div>
              <div>
                <textarea rows="3" required placeholder="${I18n.t('supportMsgPlaceholder')}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand transition"></textarea>
              </div>
              <button type="submit" class="px-5 py-2.5 rounded-xl bg-brand text-black font-bold text-xs hover:bg-brand-glow shadow-neon-sm transition">
                <span data-i18n="supportSubmitBtn">Enviar Chamado</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  Admin() {
    const s = AppState.projectSettings;
    const tab = AppState.adminActiveTab || 'backoffice';
    const fin = AppState.financeProblems || [];
    const tks = AppState.supportTickets || [];

    const finTotalHoje = fin.filter(f=>f.opened.includes('03/09')).reduce((s,f)=>s+(f.amount||0),0);
    const finPendentes = fin.filter(f=>['Pendente Revisão','Em Análise'].includes(f.status)).length;
    const finResolvidos = fin.filter(f=>f.status.includes('Resolvido')||f.status.includes('Fechado')).length;
    const finValorTotal = fin.reduce((s,f)=>s+(f.expected||f.amount||0),0);
    const finFilter = AppState.adminFinanceFilter || 'Todos';
    const finCats = ['Todos','Depósito Atrasado','Hash Não Confirmado','Valor Incorreto','Rede Errada','Saque BEP20','Bônus N3','Processamento Lote 24h','Reembolso'];
    const finFiltered = (finFilter==='Todos') ? fin : fin.filter(f=>f.category===finFilter || f.type===finFilter);

    const tkAbertos = tks.filter(t=>t.status==='Aberto'||t.status==='Open').length;
    const tkRespondidos = tks.filter(t=>t.status==='Respondido'||t.status==='Replied').length;
    const tkFechados = tks.filter(t=>t.status==='Fechado'||t.status==='Closed').length;
    const tkFilter = AppState.adminSupportFilter || 'Todos';
    const tkCats = ['Todos','Abertos','Respondidos','Fechados','Alta','Média','Baixa'];
    const tkFiltered = tks.filter(tk=>{
      if (tkFilter==='Todos') return true;
      if (tkFilter==='Abertos') return tk.status==='Aberto'||tk.status==='Open';
      if (tkFilter==='Respondidos') return tk.status==='Respondido'||tk.status==='Replied';
      if (tkFilter==='Fechados') return tk.status==='Fechado'||tk.status==='Closed';
      return tk.priority===tkFilter || tk.priority===(tkFilter==='Alta'?'High':tkFilter==='Média'?'Medium':'Low');
    });

    const _finStaCls = (st) => {
      if (st.includes('Pendente')) return 'bg-red-500/10 text-red-400 border-red-500/20';
      if (st.includes('Análise')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      if (st.includes('Parcial')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    };
    const _finTypeCls = (ty) => {
      if (ty.includes('Depósito')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      if (ty.includes('Saque') || ty.includes('Lote')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      if (ty.includes('Reembolso')) return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };
    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
              <i class="fa-solid fa-crown"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white font-['Space_Grotesk']" data-i18n="adminTitle">Painel Administrativo — Master Backoffice</h2>
              <p class="text-xs text-amber-200/80" data-i18n="adminSubtitle">Controle completo de usuários, rede linear, configurações de taxas e auditoria</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">Role: SuperAdmin</span>
        </div>

        <div class="flex flex-wrap items-stretch gap-2 p-1.5 rounded-2xl bg-brand-surface/80 border border-white/5">
          <button onclick="AppState.adminActiveTab='backoffice'; Router.navigate('admin');" class="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black font-mono transition ${tab==='backoffice'?'bg-gradient-to-r from-brand to-brand-glow text-black shadow-neon-sm':'text-gray-400 hover:text-white hover:bg-white/5'}">
            <i class="fa-solid fa-gauge-high"></i>BACKOFFICE
          </button>
          <button onclick="AppState.adminActiveTab='finance'; Router.navigate('admin');" class="flex-1 min-w-[240px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black font-mono transition ${tab==='finance'?'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_18px_rgba(245,158,11,0.35)]':'text-gray-400 hover:text-white hover:bg-white/5'}">
            <i class="fa-solid fa-sack-dollar"></i>FINANCEIRO · PAGAMENTOS
            <span class="ml-1 px-2 py-0.5 rounded-md ${tab==='finance'?'bg-black/20 text-black':'bg-red-500/15 text-red-300 border border-red-500/20'} text-[10px] font-bold border">${finPendentes>0?finPendentes+' PEND':'0'}</span>
          </button>
          <button onclick="AppState.adminActiveTab='support'; Router.navigate('admin');" class="flex-1 min-w-[240px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black font-mono transition ${tab==='support'?'bg-gradient-to-r from-sky-500 to-blue-500 text-black shadow-[0_0_18px_rgba(14,165,233,0.38)]':'text-gray-400 hover:text-white hover:bg-white/5'}">
            <i class="fa-solid fa-headset"></i>CENTRAL DE SUPORTE
            <span class="ml-1 px-2 py-0.5 rounded-md ${tab==='support'?'bg-black/20 text-black':'bg-green-500/15 text-green-300 border border-green-500/20'} text-[10px] font-bold border">${tkAbertos>0?tkAbertos+' ABERTO'+(tkAbertos>1?'S':''):'0'}</span>
          </button>
        </div>

        ${tab!=='backoffice' ? '' : `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          ${(() => {
            var u = (AppState.adminSummaries && AppState.adminSummaries.users) || {};
            var v = (AppState.adminSummaries && AppState.adminSummaries.volume) || {};
            var fmtInt = function(n){ try { return Number(n || 0).toLocaleString('pt-PT'); } catch(e){ return String(n || 0); } };
            var fmtUSD = function(n){ try { return '$ ' + Number(n || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch(e){ return '$ ' + Number(n||0).toFixed(2); } };
            var totalU = fmtInt(u.total || 0);
            var activeU = fmtInt(u.active || 0);
            var pctA = typeof u.pctAtivos === 'number' ? (u.pctAtivos.toFixed(1) + '%') : '0%';
            var vol = fmtUSD(v.volumeEntradas || 0);
            var fundo = fmtUSD(v.fundoLiquidez || 0);
            var bonus = fmtUSD(v.bonusEquipe || 0);
            return `
          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop1Label">Total de Cadastros</div>
            <div class="text-2xl font-black text-white font-mono">${totalU}</div>
            <div class="text-[10px] text-brand mt-1 font-mono">${activeU} Ativos (${pctA})</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop2Label">Total Depositado</div>
            <div class="text-2xl font-black text-white font-mono">${vol}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono">USDT BEP20</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop3Label">Fundo do Projeto (40%)</div>
            <div class="text-2xl font-black text-brand font-mono">${fundo}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="regFooterFund">Em caixa de reserva</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop4Label">Bônus Equipe (60%)</div>
            <div class="text-2xl font-black text-blue-400 font-mono">${bonus}</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="adminTop4Subtitle">5 níveis (N1→N5)</div>
          </div>
            `;
          })()}
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono mb-4" data-i18n="adminGlobalCfgTitle">Configurações Globais do Protocolo</h3>

          <form onsubmit="event.preventDefault(); (async function(){ var f=this.querySelectorAll('input'); var cfg={}; cfg.entryAmount=f[0]?Number(f[0].value||0):AppState.projectSettings.entryAmount; var n1=f[1]?Number(f[1].value||0):0; var n2=f[2]?Number(f[2].value||0):0; var n3=f[3]?Number(f[3].value||0):0; var n4=f[4]?Number(f[4].value||0):0; var n5=f[5]?Number(f[5].value||0):0; cfg.teamCommissionPercents=[n1,n2,n3,n4,n5]; cfg.depositAddress=f[8]?(f[8].value||''):AppState.projectSettings.depositAddress; try { await AppState.saveProjectSettings(cfg); await AppState.refreshAdminSummaries(); UI.showToast(I18n.t('adminCfgSavedOk'), 'success','fa-circle-check'); setTimeout(function(){ Router.refreshCurrentView(); },250); } catch(err){ UI.showToast((err&&err.message)?err.message:'Erro ao salvar','error'); } }).call(this);" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgEntryLabel">Valor Entrada (USDT)</label>
              <input type="number" value="${s.entryAmount}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgN1Label">% N1 Indic. Direto</label>
              <input type="number" step="0.1" value="${s.teamCommissionPercents[0]}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgN2Label">% N2 Upline</label>
              <input type="number" step="0.1" value="${s.teamCommissionPercents[1]}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgN3Label">% N3 Upline</label>
              <input type="number" step="0.1" value="${s.teamCommissionPercents[2]}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgN4Label">% N4 Upline</label>
              <input type="number" step="0.1" value="${s.teamCommissionPercents[3]}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgN5Label">% N5 Upline</label>
              <input type="number" step="0.1" value="${s.teamCommissionPercents[4]}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono">
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgTeamTotalLabel">% Total Equipe</label>
              <input type="number" value="${s.totalDistributedPercentage}" class="w-full bg-brand/10 border border-brand/20 rounded-xl px-3 py-2 text-brand font-mono" readonly disabled>
            </div>

            <div>
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgFundLabel">% Fundo Liquidez</label>
              <input type="number" value="${s.projectFundPercentage}" class="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-300 font-mono" readonly disabled>
            </div>

            <div class="sm:col-span-2 lg:col-span-2">
              <label class="block font-mono text-gray-400 mb-1" data-i18n="adminCfgVaultLabel">Endereço Vault USDT BEP20</label>
              <input type="text" placeholder="${I18n.t('adminCfgVaultPlaceholder')}" value="${s.depositAddress}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs">
            </div>

            <div class="sm:col-span-2 lg:col-span-5 space-y-2">
              <p class="text-[11px] text-gray-500 font-mono" data-i18n="adminCfgTeamReadonlyNote">Só porcentagens N1..N5 são editáveis. Total Equipe + Fundo são recalculados automaticamente (soma 100%).</p>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-brand text-black font-bold font-mono hover:bg-brand-glow shadow-neon-sm transition">
                <i class="fa-solid fa-floppy-disk mr-2"></i><span data-i18n="adminCfgSaveBtn">Salvar Alterações Globais</span>
              </button>
            </div>
          </form>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono" data-i18n="totalReferrals">Gerenciamento de Usuários</h3>
            <span class="text-xs text-gray-400 font-mono">Total: ${(AppState.adminUsersList || []).length} cadastro${(AppState.adminUsersList || []).length === 1 ? '' : 's'}</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-2.5">${I18n.t('myUsername')}</th>
                  <th class="py-2.5" data-i18n="myPosition">POSIÇÃO</th>
                  <th class="py-2.5" data-i18n="currentLevel">NÍVEL</th>
                  <th class="py-2.5" data-i18n="mySponsor">PATROCINADOR</th>
                  <th class="py-2.5" data-i18n="myStatus">STATUS</th>
                  <th class="py-2.5 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${(() => {
                  var rows = '';
                  try {
                    var list = AppState.adminUsersList || [];
                    if (!list.length) return `<tr><td colspan="6" class="py-12 text-center text-gray-500 font-mono text-[11px]"><i class="fa-solid fa-database mr-2 text-gray-600"></i>Nenhum usuário cadastrado ainda. Aguarde os primeiros registros.</td></tr>`;
                    list.forEach(function(u){
                      var isPending = (u.status === 'pending' || u.status === 'PENDING');
                      var isActive = (u.status === 'active' || u.status === 'ACTIVE');
                      var statusClass = isActive ? 'bg-brand/10 text-brand' : (isPending ? 'bg-amber-400/10 text-amber-400' : 'bg-gray-500/10 text-gray-400');
                      var statusLabel = isActive ? I18n.t('active') : (isPending ? I18n.t('pending') : (u.status || '-'));
                      var posClass = isActive ? 'text-brand' : (isPending ? 'text-amber-400' : 'text-gray-400');
                      var safeUser = (u.username || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                      var actionBtn = '';
                      if (isPending) {
                        actionBtn = `<button onclick="UI.showToast('Usuário @${safeUser} ativado manualmente pelo admin.', 'success')" class="text-amber-400 hover:underline mr-2">Ativar</button>`;
                      }
                      actionBtn += `<button onclick="UI.showToast('Perfil de @${safeUser} aberto para auditoria.', 'info')" class="text-brand hover:underline">Editar</button>`;
                      rows += `
                        <tr>
                          <td class="py-3 font-bold text-white">@${u.username || 'user'}</td>
                          <td class="py-3 font-mono ${posClass}">${u.positionNumber || '-'}</td>
                          <td class="py-3 font-mono">${u.levelLabel || 'Level 00'}</td>
                          <td class="py-3 font-mono text-gray-300">@${u.sponsor || '-'}</td>
                          <td class="py-3"><span class="px-2 py-0.5 rounded ${statusClass} text-[10px] font-mono">${statusLabel}</span></td>
                          <td class="py-3 text-right">
                            ${actionBtn}
                          </td>
                        </tr>`;
                    });
                  } catch(e) {}
                  return rows || `<tr><td colspan="6" class="py-12 text-center text-gray-500 font-mono text-[11px]"><i class="fa-solid fa-database mr-2 text-gray-600"></i>Nenhum usuário cadastrado ainda.</td></tr>`;
                })()}
              </tbody>
            </table>
          </div>
        `}

        ${tab!=='finance' ? '' : `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-red-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-red-300/80 mb-1"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>Problemas Pendentes</div>
            <div class="text-3xl font-black text-white font-mono">${finPendentes}<span class="text-sm text-gray-500 font-bold ml-1">/ ${fin.length}</span></div>
            <div class="text-[10px] text-red-300 mt-1 font-mono">Revisar hoje · prioridade alta</div>
          </div>
          <div class="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-amber-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-amber-300/80 mb-1"><i class="fa-solid fa-calendar-day mr-1.5"></i>Movimentado HOJE</div>
            <div class="text-3xl font-black text-white font-mono">$ ${finTotalHoje.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            <div class="text-[10px] text-amber-300 mt-1 font-mono">${fin.filter(f=>f.opened.includes('03/09')).length} ticket${fin.filter(f=>f.opened.includes('03/09')).length===1?'':'s'} · 03/09/2026</div>
          </div>
          <div class="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-green-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-green-300/80 mb-1"><i class="fa-solid fa-circle-check mr-1.5"></i>Já Resolvidos</div>
            <div class="text-3xl font-black text-white font-mono">${finResolvidos}<span class="text-sm text-gray-500 font-bold ml-1">fechado${finResolvidos===1?'':'s'}</span></div>
            <div class="text-[10px] text-green-300 mt-1 font-mono">${Math.round((finResolvidos/Math.max(1,fin.length))*100)}% da fila · SLA OK</div>
          </div>
          <div class="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-purple-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-purple-300/80 mb-1"><i class="fa-solid fa-scale-balanced mr-1.5"></i>Valor Fila Total</div>
            <div class="text-3xl font-black text-white font-mono">$ ${finValorTotal.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            <div class="text-[10px] text-purple-300 mt-1 font-mono">USDT / BTC / ETH em análise</div>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="text-sm font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400"><i class="fa-solid fa-file-invoice-dollar"></i></span>
                FILA DE RESOLUÇÕES FINANCEIRAS
                <span class="ml-2 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold font-mono">Integração Automática</span>
              </h3>
              <p class="text-[11px] text-gray-400 mt-1 font-mono">Trate depósitos atrasados, saques não recebidos, valores incorretos, rede errada e ajustes manuais. Tudo fica registrado em histórico interno.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              ${finCats.map(c=>`
                <button onclick="AppState.adminFinanceFilter='${c}'; Router.navigate('admin');" class="px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono transition ${finFilter===c?'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-transparent shadow-[0_0_12px_rgba(245,158,11,0.3)]':'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}">
                  ${c}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3.5 flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5"><i class="fa-solid fa-circle-info"></i></div>
            <div class="space-y-0.5 text-[11px]">
              <div class="text-amber-200/90 font-bold font-mono">Antes de qualquer ajuste — confirme 3 pontos:</div>
              <div class="text-gray-400 font-mono leading-relaxed">① Provedor confirma a hash · ② Carteira BEP20/TRC20 destino corresponde ao usuário · ③ Valor enviado >= entrada mínima e rede correta (exceto ajuste manual aprovado).</div>
            </div>
          </div>

          <div class="overflow-x-auto -mx-6 px-6">
            <table class="w-full text-left text-[11px] min-w-[1100px]">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono uppercase tracking-wider text-[10px]">
                  <th class="py-3 font-bold">CÓDIGO</th>
                  <th class="py-3 font-bold">ABERTURA</th>
                  <th class="py-3 font-bold">USUÁRIO</th>
                  <th class="py-3 font-bold">TIPO / CATEGORIA</th>
                  <th class="py-3 font-bold">VALOR / MOEDA / REDE</th>
                  <th class="py-3 font-bold">STATUS</th>
                  <th class="py-3 text-right font-bold">ACÇÕES</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.04]">
                ${finFiltered.length===0 ? `
                  <tr>
                    <td colspan="7" class="py-14 text-center text-xs text-gray-500 font-mono">
                      <i class="fa-solid fa-magnifying-glass-dollar mr-2 text-gray-600"></i>
                      Nenhum problema financeiro com filtro <span class="text-white font-bold">「${finFilter}」</span>. Altere a categoria no filtro acima.
                    </td>
                  </tr>
                ` : finFiltered.map(p => `
                  <tr class="hover:bg-white/[0.025] transition">
                    <td class="py-3 align-top">
                      <div class="font-mono font-black text-brand text-[11px]">${p.code}</div>
                      <div class="text-[10px] text-gray-500 mt-0.5 max-w-[28ch] truncate">${p.txHash}</div>
                    </td>
                    <td class="py-3 align-top font-mono text-gray-400">${p.opened}</td>
                    <td class="py-3 align-top">
                      <div class="font-bold text-white text-[12px]">@${p.username}</div>
                      <div class="text-[10px] text-gray-500 font-mono mt-0.5">${p.email}</div>
                      ${p.notes && p.notes.length>0 ? `<div class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] font-bold font-mono"><i class="fa-solid fa-note-sticky"></i> ${p.notes.length} nota${p.notes.length===1?'':'s'}</div>`:''}
                    </td>
                    <td class="py-3 align-top space-y-1">
                      <span class="inline-block px-2.5 py-0.5 rounded-lg border ${_finTypeCls(p.type)} text-[10px] font-black font-mono">${p.type}</span>
                      <div class="text-[10px] text-gray-400 font-mono">
                        <i class="fa-solid fa-tag mr-1 text-gray-600"></i>${p.category}
                      </div>
                    </td>
                    <td class="py-3 align-top">
                      <div class="flex items-baseline gap-1.5">
                        <span class="font-mono font-black text-white text-[13px]">$ ${p.amount.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                        ${p.expected && p.expected!==p.amount ? `<span class="text-[10px] text-red-400 font-mono">/ espera $${p.expected.toFixed(2)}</span>`:''}
                      </div>
                      <div class="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-mono">
                        <span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-bold">${p.currency}</span>
                        <i class="fa-solid fa-network-wired text-gray-600"></i>
                        <span class="truncate max-w-[18ch]">${p.network}</span>
                      </div>
                    </td>
                    <td class="py-3 align-top">
                      <span class="inline-block px-2.5 py-1 rounded-lg border ${_finStaCls(p.status)} text-[10px] font-black font-mono tracking-wide">
                        ${p.status.includes('Pendente') && '<i class="fa-solid fa-circle-exclamation mr-1"></i>'}
                        ${p.status.includes('Análise') && '<i class="fa-solid fa-magnifying-glass mr-1"></i>'}
                        ${p.status.includes('Parcial') && '<i class="fa-solid fa-clock-rotate-left mr-1"></i>'}
                        ${(p.status.includes('Resolvido')||p.status.includes('Fechado')) && '<i class="fa-solid fa-circle-check mr-1"></i>'}
                        ${p.status}
                      </span>
                    </td>
                    <td class="py-3 align-top text-right whitespace-nowrap">
                      ${(p.status.includes('Resolvido')||p.status.includes('Fechado')) ? `
                        <button onclick="UI.openFinanceProblemModal('${p.id}')" class="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-black font-mono transition inline-flex items-center gap-1.5">
                          <i class="fa-solid fa-eye"></i>VER DETALHES
                        </button>
                      ` : `
                        <button onclick="UI.openFinanceProblemModal('${p.id}')" class="px-3 py-1.5 rounded-xl border border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black font-mono transition shadow-[0_0_14px_rgba(245,158,11,0.3)] inline-flex items-center gap-1.5 hover:brightness-110">
                          <i class="fa-solid fa-wand-magic-sparkles"></i>RESOLVER
                        </button>
                      `}
                      <button onclick="UI.viewFinanceHash('${p.txHash.replace(/['\"]/g,'\\\'')}','${p.network}','${p.currency}')" class="ml-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-brand/15 hover:border-brand/30 text-gray-300 hover:text-brand text-[10px] font-black font-mono transition" title="Abrir hash no block explorer">
                        <i class="fa-solid fa-link"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div class="text-[10px] text-gray-500 font-mono">
              Mostrando <span class="text-white font-bold">${finFiltered.length}</span> de <span class="text-white font-bold">${fin.length}</span> problemas. Filtro actual: 「<span class="text-amber-300 font-bold">${finFilter}</span>」
            </div>
            <button onclick="AppState.adminFinanceFilter='Todos'; AppState.adminActiveTab='finance'; Router.navigate('admin'); UI._toast('Fila de Pagamentos — pronto para resolver depósitos e saques.','info','fa-circle-check');" class="self-start sm:self-end inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand/30 bg-brand/10 hover:bg-brand/20 text-brand text-[11px] font-black font-mono transition">
              <i class="fa-solid fa-bell-concierge"></i>+ Abrir Resolução Manual
            </button>
          </div>
        </div>
        `}

        ${tab!=='support' ? '' : `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-sky-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-sky-300/80 mb-1"><i class="fa-solid fa-headset mr-1.5"></i>Total de Chamados</div>
            <div class="text-2xl font-black text-white font-mono">${tks.length}</div>
            <div class="text-[10px] text-sky-300/70 mt-1 font-mono">Chamados abertos no histórico</div>
          </div>
          <div class="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-red-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-red-300/80 mb-1"><i class="fa-solid fa-circle-exclamation mr-1.5"></i>Abertos</div>
            <div class="text-2xl font-black text-white font-mono">${tkAbertos}</div>
            <div class="text-[10px] text-red-300/70 mt-1 font-mono flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>Requerem resposta</div>
          </div>
          <div class="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-amber-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-amber-300/80 mb-1"><i class="fa-solid fa-reply mr-1.5"></i>Respondidos</div>
            <div class="text-2xl font-black text-white font-mono">${tkRespondidos}</div>
            <div class="text-[10px] text-amber-300/70 mt-1 font-mono">Aguardam ação do utilizador</div>
          </div>
          <div class="rounded-2xl border border-gray-500/20 bg-gray-500/[0.04] p-5 relative overflow-hidden">
            <div class="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gray-500/10 blur-2xl"></div>
            <div class="text-xs font-mono text-gray-300/80 mb-1"><i class="fa-solid fa-lock mr-1.5"></i>Fechados</div>
            <div class="text-2xl font-black text-white font-mono">${tkFechados}</div>
            <div class="text-[10px] text-gray-300/70 mt-1 font-mono">Caso resolvido e arquivado</div>
          </div>
        </div>

        <div class="rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono">
                <i class="fa-solid fa-headset text-brand mr-2"></i>CENTRAL DE SUPORTE — CHAMADOS DOS UTILIZADORES
              </h3>
              <p class="text-xs text-gray-400 mt-1 font-mono">Responda dúvidas, valide ativações e acompanhe histórico de atendimentos</p>
            </div>
            <div class="flex items-center gap-3 text-xs font-mono">
              <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <div class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                <span class="text-red-300 font-bold">${tkAbertos} Aberto${tkAbertos===1?'':'s'}</span>
              </div>
              <span class="text-xs text-gray-400 font-mono">Mostrando <span class="text-white font-bold">${tkFiltered.length}</span> de <span class="text-white font-bold">${tks.length}</span> chamados</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-5">
            ${tkCats.map(c=>`
              <button onclick="AppState.adminSupportFilter='${c}'; Router.navigate('admin');" class="px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono transition ${tkFilter===c?'bg-gradient-to-r from-sky-500 to-blue-500 text-black border-transparent shadow-[0_0_12px_rgba(14,165,233,0.3)]':'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'}">
                <i class="fa-solid fa-${c==='Todos'?'layer-group':c==='Abertos'?'circle-exclamation':c==='Respondidos'?'reply':c==='Fechados'?'lock':c==='Alta'?'arrow-up':c==='Média'?'equals':'arrow-down'} mr-1"></i>${c}
              </button>
            `).join('')}
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-white/10 text-gray-400 font-mono">
                  <th class="py-2.5">DATA ABERTURA</th>
                  <th class="py-2.5">UTILIZADOR</th>
                  <th class="py-2.5">ASSUNTO</th>
                  <th class="py-2.5">PRIORIDADE</th>
                  <th class="py-2.5">STATUS</th>
                  <th class="py-2.5 text-right">AÇÃO</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${tkFiltered.map(tk => {
                  const prioRaw = (tk.priority==='High')?'Alta':(tk.priority==='Medium')?'Média':(tk.priority==='Low')?'Baixa':tk.priority;
                  const prioMap = {
                    Alta: ['bg-red-500/10 text-red-400 border-red-500/20', 'Alta'],
                    Média: ['bg-amber-500/10 text-amber-400 border-amber-500/20', 'Média'],
                    Baixa: ['bg-sky-500/10 text-sky-400 border-sky-500/20', 'Baixa']
                  };
                  const staRaw = (tk.status==='Open')?'Aberto':(tk.status==='Replied')?'Respondido':(tk.status==='Closed')?'Fechado':tk.status;
                  const staMap = {
                    Aberto: ['bg-red-500/10 text-red-400 border-red-500/20', 'Aberto'],
                    Respondido: ['bg-amber-500/10 text-amber-400 border-amber-500/20', 'Respondido'],
                    Fechado: ['bg-gray-500/10 text-gray-400 border-gray-500/20', 'Fechado']
                  };
                  const prioClass = (prioMap[prioRaw] || prioMap['Média'])[0];
                  const prioLabel = (prioMap[prioRaw] || prioMap['Média'])[1];
                  const staClass = (staMap[staRaw] || staMap['Aberto'])[0];
                  const staLabel = (staMap[staRaw] || staMap['Aberto'])[1];
                  const btnClass = staRaw === 'Aberto'
                    ? 'bg-brand hover:bg-brand-glow text-black border-brand/30 shadow-neon-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10';
                  const btnLabel = staRaw === 'Aberto' ? 'Responder' : 'Ver Detalhes';
                  return `
                    <tr class="hover:bg-white/[0.02] transition">
                      <td class="py-3 font-mono text-gray-400 whitespace-nowrap">${tk.date}</td>
                      <td class="py-3">
                        <div class="flex flex-col">
                          <span class="font-bold text-white">@${tk.username}</span>
                          <span class="text-[10px] text-gray-500 font-mono">${tk.email}</span>
                        </div>
                      </td>
                      <td class="py-3 max-w-sm">
                        <div class="font-bold text-white truncate">${tk.subject}</div>
                        <div class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">${(tk.message||'').slice(0, 95)}${(tk.message||'').length>95?'…':''}</div>
                        ${tk.replies && tk.replies.length>0 ? `<div class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] font-bold font-mono"><i class="fa-solid fa-comments"></i> ${tk.replies.length} resposta${tk.replies.length===1?'':'s'}</div>`:''}
                      </td>
                      <td class="py-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${prioClass}">${prioLabel}</span>
                      </td>
                      <td class="py-3">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${staClass}">
                          ${staRaw==='Aberto' && '<i class="fa-solid fa-circle-exclamation"></i>'}
                          ${staRaw==='Respondido' && '<i class="fa-solid fa-reply"></i>'}
                          ${staRaw==='Fechado' && '<i class="fa-solid fa-lock"></i>'}
                          ${staLabel}
                        </span>
                      </td>
                      <td class="py-3 text-right whitespace-nowrap">
                        <button onclick="UI.openAdminTicketReply('${tk.id}')" class="px-3 py-1.5 rounded-lg border text-[11px] font-bold font-mono transition inline-flex items-center gap-1.5 ${btnClass}">
                          <i class="fa-solid fa-${staRaw==='Aberto'?'reply':'eye'}"></i>${btnLabel}
                        </button>
                        ${staRaw==='Respondido'?`<button onclick="UI.closeAdminTicket('${tk.id}')" class="ml-1.5 px-3 py-1.5 rounded-lg border border-gray-500/20 bg-gray-500/5 text-gray-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 text-[11px] font-bold font-mono transition" title="Fechar chamado"><i class="fa-solid fa-lock"></i></button>`:''}
                      </td>
                    </tr>
                  `;
                }).join('')}
                ${tkFiltered.length===0 ? `
                  <tr>
                    <td colspan="6" class="py-10 text-center">
                      <div class="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.02]">
                        <i class="fa-solid fa-inbox text-gray-500 text-xl"></i>
                        <div class="text-left">
                          <div class="text-sm font-bold text-gray-300">Nenhum chamado encontrado</div>
                          <div class="text-[10px] text-gray-500 font-mono">Tente outro filtro ou volte para Todos.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
        `}

      </div>
    `;
  }
};

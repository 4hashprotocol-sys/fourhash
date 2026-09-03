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
            <p class="text-xs text-gray-400 mt-1">Insira suas credenciais para visualizar sua rede</p>
          </div>

          <form onsubmit="event.preventDefault(); Router.loginMock();" class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">E-mail ou Username</label>
              <div class="relative">
                <i class="fa-solid fa-user absolute left-3.5 top-3.5 text-gray-500 text-xs"></i>
                <input type="text" required value="alexandre" placeholder="seu@email.com ou @username" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-mono text-gray-300">Senha</label>
                <a href="#" onclick="UI.showToast('Link de recuperação enviado para seu e-mail.', 'info')" class="text-[11px] text-brand hover:underline">Esqueci minha senha</a>
              </div>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-500 text-xs"></i>
                <input id="login-pass" type="password" required value="password123" placeholder="••••••••" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
                <button type="button" onclick="UI.togglePasswordVisibility('login-pass', this)" class="absolute right-3.5 top-3.5 text-gray-400 hover:text-white">
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-sm tracking-wider shadow-neon transition transform hover:scale-[1.01]" data-i18n="login">
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

  Register(sponsorRef = 'joao123') {
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

          <form onsubmit="event.preventDefault(); UI.showToast('Conta criada com sucesso! Redirecionando...', 'success'); setTimeout(() => Router.navigate('deposit'), 1000);" class="space-y-4">

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">Nome Completo</label>
              <input type="text" required placeholder="Seu nome completo" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">Username (@)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-gray-400 text-sm font-mono">@</span>
                <input type="text" required placeholder="seu_username" pattern="[a-zA-Z0-9_]+" class="w-full bg-brand-surface border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
              </div>
              <span class="text-[10px] text-gray-500 mt-1 block">Apenas letras, números e underline. Sem espaços.</span>
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-300 mb-1">E-mail</label>
              <input type="email" required placeholder="seu@email.com" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">País</label>
                <select class="w-full bg-brand-surface border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
                  <option value="BR">🇧🇷 Brasil (+55)</option>
                  <option value="PT">🇵🇹 Portugal (+351)</option>
                  <option value="US">🇺🇸 Estados Unidos (+1)</option>
                  <option value="ES">🇪🇸 Espanha (+34)</option>
                  <option value="FR">🇫🇷 França (+33)</option>
                  <option value="CN">🇨🇳 China (+86)</option>
                  <option value="JP">🇯🇵 Japão (+81)</option>
                  <option value="RU">🇷🇺 Rússia (+7)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-mono text-gray-300 mb-1">Telefone / WhatsApp</label>
                <input type="tel" required placeholder="(11) 99999-9999" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
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
              <button type="submit" class="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-sm tracking-wider shadow-neon transition transform hover:scale-[1.01]" data-i18n="createAccount">
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
              https://fourhash.com/register?ref=${u.username}
            </div>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button onclick="UI.copyToClipboard('https://fourhash.com/register?ref=${u.username}')" class="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs shadow-neon transition">
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
    return `
      <div class="max-w-2xl mx-auto py-4 space-y-6">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div class="text-center mb-6">
            <div class="w-12 h-12 mx-auto rounded-xl bg-brand/10 border border-brand/40 flex items-center justify-center mb-2 shadow-neon-sm overflow-hidden">
              <img src="/assets/logo/Logo_4h_solo.png" alt="4#" class="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]">
            </div>
            <h2 class="text-2xl font-bold text-white font-['Space_Grotesk']" data-i18n="depositTitle">Depositar USDT</h2>
            <p class="text-xs text-gray-400 mt-1" data-i18n="depositSubtitle">Realize a ativação da sua posição de US$ 10 na rede BEP20</p>
          </div>

          <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center gap-3 text-amber-300 text-xs">
            <i class="fa-solid fa-triangle-exclamation text-base"></i>
            <div>
              <strong class="font-bold" data-i18n="sendUsdtOnly">ENVIE SOMENTE USDT PELA REDE BEP20</strong>
              <div class="text-[11px] text-amber-200/80" data-i18n="withdrawImportantP1">Transferências por outras redes (TRC20, ERC20) ou outras moedas resultarão em perda irreversível.</div>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-brand-surface border border-white/5">

            <div class="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white"/>
                <rect x="10" y="10" width="25" height="25" fill="black"/>
                <rect x="15" y="15" width="15" height="15" fill="white"/>
                <rect x="18" y="18" width="9" height="9" fill="black"/>
                <rect x="65" y="10" width="25" height="25" fill="black"/>
                <rect x="70" y="15" width="15" height="15" fill="white"/>
                <rect x="73" y="18" width="9" height="9" fill="black"/>
                <rect x="10" y="65" width="25" height="25" fill="black"/>
                <rect x="15" y="70" width="15" height="15" fill="white"/>
                <rect x="18" y="73" width="9" height="9" fill="black"/>
                <rect x="42" y="12" width="6" height="6" fill="#000"/>
                <rect x="50" y="20" width="6" height="6" fill="#000"/>
                <rect x="42" y="32" width="6" height="6" fill="#000"/>
                <rect x="52" y="42" width="8" height="8" fill="#00B849"/>
                <rect x="40" y="65" width="8" height="8" fill="#000"/>
                <rect x="68" y="55" width="6" height="6" fill="#000"/>
                <rect x="75" y="75" width="10" height="10" fill="#000"/>
              </svg>
            </div>

            <div class="flex-1 w-full space-y-3">
              <div>
                <label class="text-[11px] font-mono text-gray-400">${I18n.t('depositAddressLabel')}:</label>
                <div class="text-xl font-mono font-bold text-brand">US$ ${s.entryAmount}.00 <span class="text-xs text-gray-300">${I18n.t('usdtLabel')}</span></div>
              </div>
              <div>
                <label class="text-[11px] font-mono text-gray-400">${I18n.t('usdtNetwork')}:</label>
                <div class="text-xs font-mono text-white">${I18n.t('networkBep20Only')}</div>
              </div>
              <div>
                <label class="text-[11px] font-mono text-gray-400" data-i18n="depositAddressLabel">Endereço de Destino (Vault):</label>
                <div class="flex items-center gap-2 mt-0.5">
                  <input type="text" readonly value="${s.depositAddress}" class="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-300 focus:outline-none">
                  <button onclick="UI.copyToClipboard('${s.depositAddress}')" class="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-glow text-black font-bold text-xs">
                    <i class="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div class="mt-4 flex items-start gap-2.5">
            <input id="deposit-check" type="checkbox" class="mt-0.5 rounded border-white/20 bg-brand-surface text-brand focus:ring-brand">
            <label for="deposit-check" class="text-xs text-gray-400 cursor-pointer" data-i18n="confirmDepositWarning">
              Confirmo que estou enviando USDT através da rede BNB Smart Chain (BEP20).
            </label>
          </div>

          <div class="mt-6 pt-6 border-t border-white/10 text-center">
            <button onclick="AppState.currentUser.status = 'ACTIVE'; UI.showToast('Pagamento confirmado ✓ Sua conta foi ativada na posição ' + AppState.currentUser.positionNumber, 'success'); setTimeout(() => Router.navigate('dashboard'), 1500);" class="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-sm tracking-wider shadow-neon transition" data-i18n="simulatePayment">
              Simular Confirmação On-Chain (Fase 1)
            </button>
            <span class="text-[10px] text-gray-500 mt-2 block font-mono" data-i18n="adminCfgTeamReadonlyNote">Na Fase 2, esta verificação será efetuada automaticamente via Supabase Edge Function e Gateway Web3.</span>
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
            <div class="text-sm font-mono text-brand font-bold">https://fourhash.com/register?ref=${u.username}</div>
          </div>
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <button onclick="UI.copyToClipboard('https://fourhash.com/register?ref=${u.username}'); UI.showToast(I18n.t('referralsCopySuccess'), 'success');" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-glow text-black font-bold text-xs shadow-neon transition">
              <i class="fa-solid fa-copy mr-1.5"></i><span data-i18n="referralsShareCopy">Copiar Link</span>
            </button>
            <button onclick="window.open('https://wa.me/?text=' + encodeURIComponent('${I18n.t('tagline')} https://fourhash.com/register?ref=${u.username}'), '_blank');" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:border-green-400 bg-brand-surface text-green-400 font-bold text-xs transition">
              <i class="fa-brands fa-whatsapp mr-1.5"></i><span data-i18n="referralsShareWhatsApp">WhatsApp</span>
            </button>
            <button onclick="window.open('https://t.me/share/url?url=' + encodeURIComponent('https://fourhash.com/register?ref=${u.username}') + '&text=' + encodeURIComponent('${I18n.t('tagline')}'), '_blank');" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 hover:border-sky-400 bg-brand-surface text-sky-400 font-bold text-xs transition">
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
                <tr>
                  <td class="py-3 font-bold text-white">@crypto_king</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">● ${I18n.t('active')}</span></td>
                  <td class="py-3 font-mono text-gray-300">#001250</td>
                  <td class="py-3 font-mono font-bold text-brand">+US$ 5.00</td>
                  <td class="py-3 text-right font-mono text-gray-400">29/08/2026</td>
                </tr>
                <tr>
                  <td class="py-3 font-bold text-white">@luna_eth</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">● ${I18n.t('active')}</span></td>
                  <td class="py-3 font-mono text-gray-300">#001254</td>
                  <td class="py-3 font-mono font-bold text-brand">+US$ 5.00</td>
                  <td class="py-3 text-right font-mono text-gray-400">28/08/2026</td>
                </tr>
                <tr>
                  <td class="py-3 font-bold text-white">@victor_web3</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-mono">● ${I18n.t('pending')}</span></td>
                  <td class="py-3 font-mono text-gray-300">#001262</td>
                  <td class="py-3 font-mono text-gray-500">US$ 0.00</td>
                  <td class="py-3 text-right font-mono text-gray-400">28/08/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  Profile() {
    const u = AppState.currentUser;
    return `
      <div class="max-w-2xl mx-auto py-4 space-y-6">
        <div class="rounded-2xl border border-brand-border bg-brand-card p-6 sm:p-8 shadow-2xl">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div class="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/50 flex items-center justify-center font-black text-brand text-2xl shadow-neon-sm">
              @${u.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 class="text-xl font-bold text-white font-['Space_Grotesk']">${u.fullName}</h2>
              <div class="text-xs font-mono text-brand">@${u.username} • Pos: ${u.positionNumber}</div>
              <div class="text-[11px] text-gray-400 mt-0.5">${u.country}</div>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); UI.showToast('Alterações salvas com sucesso!', 'success');" class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">Nome Completo</label>
              <input type="text" value="${u.fullName}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-gray-400 mb-1">Username (Fixo)</label>
                <input type="text" readonly disabled value="@${u.username}" class="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 font-mono cursor-not-allowed">
              </div>
              <div>
                <label class="block text-xs font-mono text-gray-400 mb-1">Patrocinador</label>
                <input type="text" readonly disabled value="@${u.sponsor}" class="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-brand font-mono cursor-not-allowed">
              </div>
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">E-mail</label>
              <input type="email" value="${u.email}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
            </div>

            <div>
              <label class="block text-xs font-mono text-gray-400 mb-1">Telefone</label>
              <input type="tel" value="${u.phone}" class="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition">
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
              <button onclick="window.open('mailto:diretoria@fourhash.com', '_blank')" class="px-4 py-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/30 text-violet-400 font-bold text-xs transition flex items-center justify-center gap-2">
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
    const finCats = ['Todos','Depósito Atrasado','Hash Não Confirmado','Valor Incorreto','Rede Errada','Saque BEP20','Bônus N3','Processamento Lote 24h','Reembolso NowPayments'];
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
            <i class="fa-solid fa-sack-dollar"></i>FINANCEIRO · NowPayments
            <span class="ml-1 px-2 py-0.5 rounded-md ${tab==='finance'?'bg-black/20 text-black':'bg-red-500/15 text-red-300 border border-red-500/20'} text-[10px] font-bold border">${finPendentes>0?finPendentes+' PEND':'0'}</span>
          </button>
          <button onclick="AppState.adminActiveTab='support'; Router.navigate('admin');" class="flex-1 min-w-[240px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black font-mono transition ${tab==='support'?'bg-gradient-to-r from-sky-500 to-blue-500 text-black shadow-[0_0_18px_rgba(14,165,233,0.38)]':'text-gray-400 hover:text-white hover:bg-white/5'}">
            <i class="fa-solid fa-headset"></i>CENTRAL DE SUPORTE
            <span class="ml-1 px-2 py-0.5 rounded-md ${tab==='support'?'bg-black/20 text-black':'bg-green-500/15 text-green-300 border border-green-500/20'} text-[10px] font-bold border">${tkAbertos>0?tkAbertos+' ABERTO'+(tkAbertos>1?'S':''):'0'}</span>
          </button>
        </div>

        ${tab!=='backoffice' ? '' : `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop1Label">Total de Cadastros</div>
            <div class="text-2xl font-black text-white font-mono">1,248</div>
            <div class="text-[10px] text-brand mt-1 font-mono">1,102 Ativos (88.3%)</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop2Label">Total Depositado</div>
            <div class="text-2xl font-black text-white font-mono">$ 11,020.00</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono">USDT BEP20</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop3Label">Fundo do Projeto (40%)</div>
            <div class="text-2xl font-black text-brand font-mono">$ 4,408.00</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="regFooterFund">Em caixa de reserva</div>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-card p-5">
            <div class="text-xs font-mono text-gray-400 mb-1" data-i18n="adminTop4Label">Bônus Equipe (60%)</div>
            <div class="text-2xl font-black text-blue-400 font-mono">$ 6,612.00</div>
            <div class="text-[10px] text-gray-400 mt-1 font-mono" data-i18n="adminTop4Subtitle">5 níveis (N1→N5)</div>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-border bg-brand-card p-6">
          <h3 class="text-sm font-bold uppercase tracking-wider text-white font-mono mb-4" data-i18n="adminGlobalCfgTitle">Configurações Globais do Protocolo</h3>

          <form onsubmit="event.preventDefault(); UI.showToast(I18n.t('adminCfgSavedOk'), 'success');" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
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
            <span class="text-xs text-gray-400 font-mono">Mostrando 5 de 1,248</span>
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
                <tr>
                  <td class="py-3 font-bold text-white">@alexandre</td>
                  <td class="py-3 font-mono text-brand">#001248</td>
                  <td class="py-3 font-mono">Level 04</td>
                  <td class="py-3 font-mono text-gray-300">@joao123</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">${I18n.t('active')}</span></td>
                  <td class="py-3 text-right">
                    <button onclick="UI.showToast('Perfil de @alexandre aberto para auditoria.', 'info')" class="text-brand hover:underline mr-2">Editar</button>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 font-bold text-white">@crypto_king</td>
                  <td class="py-3 font-mono text-brand">#001250</td>
                  <td class="py-3 font-mono">Level 05</td>
                  <td class="py-3 font-mono text-gray-300">@alexandre</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-mono">${I18n.t('active')}</span></td>
                  <td class="py-3 text-right">
                    <button onclick="UI.showToast('Auditoria aberta.', 'info')" class="text-brand hover:underline mr-2">Editar</button>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 font-bold text-white">@victor_web3</td>
                  <td class="py-3 font-mono text-amber-400">#001262</td>
                  <td class="py-3 font-mono">Level 05</td>
                  <td class="py-3 font-mono text-gray-300">@alexandre</td>
                  <td class="py-3"><span class="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-mono">${I18n.t('pending')}</span></td>
                  <td class="py-3 text-right">
                    <button onclick="UI.showToast('Usuário @victor_web3 ativado manualmente pelo admin.', 'success')" class="text-amber-400 hover:underline mr-2">Ativar</button>
                  </td>
                </tr>
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
                <span class="ml-2 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold font-mono">Integração NowPayments</span>
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
              <div class="text-gray-400 font-mono leading-relaxed">① Provedor NowPayments confirma a hash · ② Carteira BEP20/TRC20 destino corresponde ao usuário · ③ Valor enviado >= entrada mínima e rede correta (exceto ajuste manual aprovado).</div>
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
            <button onclick="AppState.adminFinanceFilter='Todos'; AppState.adminActiveTab='finance'; Router.navigate('admin'); UI._toast('Fila NowPayments — pronto para resolver depósitos e saques.','info','fa-circle-check');" class="self-start sm:self-end inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand/30 bg-brand/10 hover:bg-brand/20 text-brand text-[11px] font-black font-mono transition">
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

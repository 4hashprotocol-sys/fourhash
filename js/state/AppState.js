/* ============================================================
   FOURHASH — Estado Global da Aplicação (Fase 1)
   Simulação em memória com persistência de preferências locais
   ============================================================ */

const AppState = {
  currentLang: 'pt',
  currentTheme: 'dark',
  isAuthenticated: true,
  userRole: 'user',
  adminActiveTab: 'backoffice',
  adminFinanceFilter: 'Todos',
  adminSupportFilter: 'Todos',

  projectSettings: {
    entryAmount: 10,
    currency: 'USDT',
    network: 'BEP20',
    sponsorPercentage: 50,
    projectFundPercentage: 40,
    totalDistributedPercentage: 60,
    teamCommissionPercents: [50, 2.5, 2.5, 2.5, 2.5],
    depositAddress: '0x71C4HashBEP20ProtocolVault99F4A810d7E8',
    presaleEndDate: new Date(Date.now() + 9 * 86400000 + 23 * 3600000 + 59 * 60000 + 59 * 1000).toISOString(),
    withdraw: {
      minAmount: 10,
      maxAmountPerRequest: 10000,
      networkFeeFlat: 0.5,
      token: 'USDT',
      network: 'BEP20 (BNB Smart Chain)',
      processingHours: 24
    }
  },

  currentUser: {
    id: 'usr_001248',
    fullName: 'Alexandre FourHash',
    username: 'alexandre',
    email: 'alexandre@fourhash.io',
    country: '🇧🇷 Brasil',
    phone: '+55 11 98765-4321',
    sponsor: 'joao123',
    positionNumber: '#001248',
    level: 4,
    status: 'ACTIVE',
    entryDate: '28/08/2026',
    availableBalance: 245.00,
    pendingBalance: 15.00,
    totalReceived: 560.00,
    directReferralsCount: 14,
    activeReferralsCount: 11,
    inactiveReferralsCount: 3
  },

  transactions: [
    { id: 'tx_1', type: 'BÔNUS DE INDICAÇÃO', amount: 5.00, status: 'Confirmed', date: '29/08/2026 13:40', hash: '0x3f9a72b...e4a1' },
    { id: 'tx_2', type: 'BÔNUS DE INDICAÇÃO', amount: 5.00, status: 'Confirmed', date: '29/08/2026 10:15', hash: '0x88c21e0...99b2' },
    { id: 'tx_3', type: 'POSICIONAMENTO', amount: 15.00, status: 'Confirmed', date: '28/08/2026 19:22', hash: '0x44a19dc...77d3' },
    { id: 'tx_4', type: 'DEPÓSITO', amount: 10.00, status: 'Confirmed', date: '28/08/2026 08:00', hash: '0x11b988f...12c4' }
  ],

  notifications: [
    { id: 'n1', title: 'Pagamento Confirmado', message: 'Sua ativação de US$ 10 USDT BEP20 foi validada na rede.', read: false, time: 'Há 10 min' },
    { id: 'n2', title: 'Novo Bônus Direto!', message: '@crypto_king acabou de se posicionar através do seu link (+US$ 5.00).', read: false, time: 'Há 2 horas' },
    { id: 'n3', title: 'Bônus de Equipe N2', message: 'Recebeu US$ 0.25 do nível 2 pela ativação do @zen_trader.', read: true, time: 'Ontem' }
  ],

  treeLevels: [],

  withdrawals: [
    { id: 'wd_001', amount: 40.00, fee: 0.50, netAmount: 39.50, wallet: '0x7Ab8...9fC2dE11', network: 'BEP20 (BNB Chain)', status: 'Processando', hash: null, date: '03/09/2026 11:02', eta: '04/09/2026 11:02' },
    { id: 'wd_002', amount: 15.00, fee: 0.50, netAmount: 14.50, wallet: '0x4cF2...83b7Aa90', network: 'BEP20 (BNB Chain)', status: 'Concluído', hash: '0x8f11bc42...', date: '29/08/2026 16:40', eta: '-' }
  ],

  supportTickets: [
    {
      id: 'tk_001',
      username: 'crypto_king',
      email: 'crypto.king@protonmail.com',
      subject: 'Dúvida Saque BEP20 — taxa de rede',
      message: 'Bom dia! Realizei meu primeiro saque de $40,00 em BEP20 hoje (03/09) e queria entender a cobrança da taxa fixa de $0,50. A taxa é sempre a mesma independente do valor sacado? E qual o prazo exato para receber — 24h úteis ou dias corridos? Obrigado!',
      date: '03/09/2026 09:42',
      status: 'Aberto',
      replies: [],
      priority: 'Média'
    },
    {
      id: 'tk_002',
      username: 'victor_web3',
      email: 'victor.web3@mail.com',
      subject: 'Minha ativação está pendente há 2 dias',
      message: 'Hi team! I paid my $10 entry on 01/09 via Binance Pay transaction hash 0xc8f2...77aa11 but my profile still shows AGUARDANDO ATIVAÇÃO. Can you verify and activate? My referrer is @alexandre, position #001262. Thanks a lot, waiting to start building my team.',
      date: '02/09/2026 22:15',
      status: 'Aberto',
      replies: [],
      priority: 'Alta'
    },
    {
      id: 'tk_003',
      username: 'elena_chain',
      email: 'elena.chain@yandex.ru',
      subject: 'Link de indicação — caractere especial no username',
      message: 'Olá FourHash! Meu username tem _ (underline): @elena_chain. Quando eu compartilho o link fourhash.com/register?ref=elena_chain alguns navegadores quebram. Isso é normal? Poderia gerar um link alternativo? Muito obrigada, adoro o projeto!',
      date: '02/09/2026 14:08',
      status: 'Respondido',
      replies: [
        { from: 'admin', date: '02/09/2026 16:30', message: 'Olá @elena_chain! O underline é totalmente compatível, alguns apps de mensagem apenas cortam a URL automaticamente. Use encurtador oficial (breve liberamos) ou envie direto por Telegram. Qualquer coisa estamos aqui! Atenciosamente, Equipe FourHash.' }
      ],
      priority: 'Baixa'
    },
    {
      id: 'tk_004',
      username: 'zen_trader',
      email: 'zen.trader.eth@gmail.com',
      subject: 'Bônus Nível 3 NÃO creditado — @quantum_vault upline',
      message: 'Boa tarde. O usuário @quantum_vault entrou dia 30/08 pelo link do @elena_chain (que é minha indicada N2). Pela regra de distribuição 60/40 eu deveria receber N3 = $0,25. Apareceu na carteira? No meu histórico só consigo ver 2 bônus até hoje. Grato pela verificação!',
      date: '01/09/2026 11:50',
      status: 'Respondido',
      replies: [
        { from: 'admin', date: '01/09/2026 14:22', message: 'Olá @zen_trader! Verificamos sua upline — o bônus N3 foi creditado corretamente dia 30/08 às 18:04, o refresh da tela Wallet pode ter atrasado. Recarregue com Ctrl+Shift+R e aparecerá no histórico. Qualquer coisa nos chame!' }
      ],
      priority: 'Alta'
    },
    {
      id: 'tk_005',
      username: 'marcos_defi',
      email: 'marcos.defi@outlook.com',
      subject: 'Sugestão: tema Light Mode na cor branca',
      message: 'Líderes! FANTASTICO projeto. Sugestão pequena: o botão Alternar Tema está funcionando, mas eu adoraria um fundo branco puro (255,255,255) para usar no sol ao ar livre, em vez do cinza claro atual. Vi que vocês fazem ajustes rápido, fica a sugestão. Parabéns pelo lançamento!',
      date: '31/08/2026 20:03',
      status: 'Fechado',
      replies: [
        { from: 'admin', date: '01/09/2026 09:20', message: 'E aí @marcos_defi! Obrigado pelo carinho e sugestão. Já levantamos a flag para a próxima atualização de tema White Mode (puro). Equipe de UI já está trabalhando nisso. Abraço!' }
      ],
      priority: 'Baixa'
    }
  ],

  financeProblems: [
    {
      id: 'fin_001',
      code: 'FIN-2026-0903-001',
      username: 'crypto_king',
      email: 'crypto.king@protonmail.com',
      type: 'Depósito NowPayments',
      category: 'Valor Incorreto',
      currency: 'BTC',
      amount: 9.5,
      expected: 10.00,
      network: 'Bitcoin',
      txHash: '3FZc9LmQkx8WnR72pT4aH6eD1bU5sN9vY2jK8qR3tV7wX',
      opened: '03/09/2026 11:12',
      status: 'Pendente Revisão',
      description: 'Enviei 0.000089 BTC via NowPayments (taxa incluída), mas apareceu apenas $9.50 de entrada, o protocolo pede $10.00. Quero completar o restante ou receber crédito manual.',
      notes: []
    },
    {
      id: 'fin_002',
      code: 'FIN-2026-0902-014',
      username: 'victor_web3',
      email: 'victor.web3@mail.com',
      type: 'Depósito Atrasado',
      category: 'Hash Não Confirmado',
      currency: 'USDT',
      amount: 10.00,
      expected: 10.00,
      network: 'TRC20',
      txHash: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE_tx_0x88a1c7e2f4…',
      opened: '02/09/2026 08:44',
      status: 'Em Análise',
      description: 'NowPayments confirmou o pagamento há 26h mas minha carteira ainda não recebeu crédito. Hash TRC20 já tem 180 confirmações na TronScan. Preciso da ativação hoje.',
      notes: [
        { from: 'admin', date: '02/09/2026 10:05', text: 'Equipe verificou o hash na TronScan. Aguarde confirmação do provedor NowPayments.' }
      ]
    },
    {
      id: 'fin_003',
      code: 'FIN-2026-0901-007',
      username: 'zen_trader',
      email: 'zen.trader.eth@gmail.com',
      type: 'Saque Não Recebido',
      category: 'Saque BEP20',
      currency: 'USDT',
      amount: 49.50,
      expected: 49.50,
      network: 'BEP20',
      txHash: '0x7e2c91f6a44bd8130c66e07d6b25c941f0a3e78d…',
      opened: '01/09/2026 14:33',
      status: 'Resolvido Parcial',
      description: 'Solicitei saque de US$ 50.00 (líquido $49.50) dia 30/08 há 4 dias úteis. Carteira MetaMask 0xB1… ainda não recebeu. Já confirmei endereço 2 vezes.',
      notes: [
        { from: 'admin', date: '01/09/2026 19:11', text: 'Bloqueio encontrado: endereço foi marcado como contrato pela Binance. Reforçado manualmente agora. TxID na 0x7e2c….' }
      ]
    },
    {
      id: 'fin_004',
      code: 'FIN-2026-0831-022',
      username: 'elena_chain',
      email: 'elena.chain@yandex.ru',
      type: 'Reembolso NowPayments',
      category: 'Rede Errada',
      currency: 'ETH',
      amount: 10.00,
      expected: 10.00,
      network: 'ERC20 (enviada)',
      txHash: '0x24db7F91B8ce4C2f0A55Db4fDd1c29F4c5d4400F_txNP',
      opened: '31/08/2026 22:05',
      status: 'Pendente Revisão',
      description: 'Olá! Enviei USDT via ERC20 ETH sem ler o aviso e o protocolo pede BEP20. Agora quero reembolso do valor (minha carteira ETH: 0x24dB7F…). Já vi que a documentação diz que erros de rede são irreversíveis mas vi atendimentos no Telegram que foram.',
      notes: []
    },
    {
      id: 'fin_005',
      code: 'FIN-2026-0830-003',
      username: 'marcos_defi',
      email: 'marcos.defi@outlook.com',
      type: 'Bônus Não Creditado (Upline)',
      category: 'Bônus N3',
      currency: 'USDT',
      amount: 2.50,
      expected: 2.50,
      network: 'BEP20',
      txHash: 'Ajuste manual — upline quantum_vault (referência)',
      opened: '30/08/2026 10:15',
      status: 'Fechado Resolvido',
      description: 'Indicado @quantum_vault entrou via link @elena_chain e eu sou N3 na árvore. Já passou de 72h e não apareceu bônus US$ 2.50.',
      notes: [
        { from: 'admin', date: '30/08/2026 15:40', text: 'Creditado US$ 2.50 em carteira manualmente para @marcos_defi. Valor líquido recebido.' }
      ]
    },
    {
      id: 'fin_006',
      code: 'FIN-2026-0903-002',
      username: 'joao123',
      email: 'joao.matos@proton.me',
      type: 'Saques em Massa (Lote)',
      category: 'Processamento Lote 24h',
      currency: 'USDT',
      amount: 2150.75,
      expected: 2150.75,
      network: 'BEP20',
      txHash: 'LOTE-2026-09-03_7-users_batch_verify',
      opened: '03/09/2026 07:02',
      status: 'Em Análise',
      description: 'Suporte! Ontem dia 02/09 solicitei um saque em lote (usuários patrocinados: 7 contas) totalizando US$ 2.150,75. O aviso fala 24h úteis. Qual status?',
      notes: []
    }
  ],

  init() {
    this.generateTreeData();
    this.loadLocalPreferences();
  },

  loadLocalPreferences() {
    const savedLang = localStorage.getItem('fh_lang') || 'pt';
    const savedTheme = localStorage.getItem('fh_theme') || 'dark';
    this.currentLang = savedLang;
    this.currentTheme = savedTheme;
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.className = 'fa-solid fa-sun text-xs text-amber-500';
    } else {
      const icon = document.getElementById('theme-icon');
      if (icon) icon.className = 'fa-solid fa-moon text-xs text-gray-300';
    }
  },

  generateTreeData() {
    const mockNames = [
      'satoshi_dev', 'luna_eth', 'crypto_king', 'victor_web3', 'elena_chain',
      'marcos_defi', 'sarah_node', 'gabriel_btc', 'token_master', 'binance_pro',
      'lucas_linear', 'beatriz_hash', 'zen_trader', 'quantum_vault', 'nexus_ai'
    ];

    this.treeLevels = [];
    for (let lvl = 1; lvl <= 12; lvl++) {
      const countInLevel = Math.max(1, Math.min(6, Math.floor(Math.random() * 4) + 1));
      const positions = [];
      for (let i = 0; i < countInLevel; i++) {
        const randomName = mockNames[(lvl + i) % mockNames.length] + (lvl > 5 ? `_${lvl}` : '');
        const isUser = (lvl === 4 && i === 0);
        positions.push({
          id: `pos_lvl${lvl}_${i}`,
          username: isUser ? this.currentUser.username : randomName,
          isSelf: isUser,
          level: lvl,
          positionNumber: `#00${1200 + (lvl * 10) + i}`,
          status: lvl > 8 ? (Math.random() > 0.5 ? 'PENDING' : 'INACTIVE') : 'ACTIVE',
          entryDate: `${20 - lvl}/08/2026`,
          directReferrals: Math.floor(Math.random() * 8)
        });
      }
      this.treeLevels.push({
        level: lvl,
        name: `LEVEL ${String(lvl).padStart(2, '0')}`,
        expanded: lvl <= 5,
        positions: positions
      });
    }
  },

  toggleAdminDemo() {
    this.userRole = (this.userRole === 'user') ? 'admin' : 'user';
    const label = document.getElementById('admin-toggle-label');
    if (label) {
      label.innerText = I18n.t(this.userRole === 'admin' ? 'adminMode' : 'userMode');
    }
    UI.showToast(`${I18n.t(this.userRole === 'admin' ? 'adminMode' : 'userMode')}`, 'info');
    Router.renderNav();
    if (Router.currentRoute === 'admin' && this.userRole !== 'admin') {
      Router.navigate('dashboard');
    } else if (this.userRole === 'admin') {
      Router.navigate('admin');
    }
  },

  clearNotifications() {
    this.notifications.forEach(n => n.read = true);
    const badge = document.getElementById('notif-badge');
    if (badge) badge.classList.add('hidden');
    UI.renderNotificationList();
    UI.showToast('Todas as notificações foram marcadas como lidas.', 'success');
  }
};

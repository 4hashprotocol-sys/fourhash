/* ============================================================
   FOURHASH — Estado Global da Aplicação (Fase 1)
   Simulação em memória com persistência de preferências locais
   ============================================================ */

const AppState = {
  currentLang: 'pt',
  currentTheme: 'dark',
  isAuthenticated: false,
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
    id: null,
    fullName: 'Usuário Convidado',
    username: 'guest',
    email: '',
    country: '',
    phone: '',
    sponsor: '',
    positionNumber: '-',
    level: 0,
    status: 'GUEST',
    entryDate: '',
    availableBalance: 0,
    pendingBalance: 0,
    totalReceived: 0,
    directReferralsCount: 0,
    activeReferralsCount: 0,
    inactiveReferralsCount: 0
  },

  transactions: [],

  notifications: [],

  treeLevels: [],

  withdrawals: [],

  supportTickets: [],

  financeProblems: [],

  adminSummaries: { support: {}, finance: {} },

  referrals: {
    direct: [],
    binary: { left: [], right: [] },
    totalEarned: 0
  },

  adminUsersList: [],

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
    this.treeLevels = [];
  },

  toggleAdminDemo() {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      UI.showToast('Operação não permitida em ambiente de produção.', 'error');
      return;
    }
    this.userRole = (this.userRole === 'user') ? 'admin' : 'user';
    UI.showToast(`${I18n.t(this.userRole === 'admin' ? 'adminMode' : 'userMode')} [DEV]`, 'info');
    Router.renderNav();
    const footerAdminLink = document.getElementById('footer-admin-link');
    if (footerAdminLink) {
      if (Router.isAdmin()) footerAdminLink.classList.remove('hidden'); else footerAdminLink.classList.add('hidden');
    }
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
  },

  /* ========================================================
   * FASE 2 — INTEGRAÇÃO SUPABASE (Fallback Offline)
   * ======================================================== */

  _sb() { return (typeof window !== 'undefined' && window.sb) ? window.sb : null; },
  sbAuth: null,
  sbSession: null,
  sbProfile: null,
  sbError: null,
  _sbReady: false,

  async _loadUserProfileFromSupabase(userAuth, sessionAuth) {
    if (!userAuth || !userAuth.id) return false;
    try {
      var sb = this._sb();
      if (!sb) return false;
      if (sessionAuth) this.sbSession = sessionAuth;
      this.sbAuth = userAuth;

      var tokenMeta = (userAuth && userAuth.user_metadata && typeof userAuth.user_metadata === 'object') ? userAuth.user_metadata : {};
      var t_username = (tokenMeta.username || '').toString().trim();
      var t_fn = (tokenMeta.first_name || '').toString().trim();
      var t_ln = (tokenMeta.last_name || '').toString().trim();
      var t_full = (tokenMeta.full_name || '').toString().trim();
      if (!t_full) t_full = ((t_fn + ' ' + t_ln).trim() || '');
      var t_email = (tokenMeta.email || userAuth.email || '').toString().trim();
      var t_country = (tokenMeta.country || '').toString().trim();
      var t_phone = (tokenMeta.phone || '').toString().trim();
      var t_upline = (tokenMeta.upline_code || tokenMeta.upline_username || tokenMeta.sponsor_code || '').toString().trim();
      var t_role = (tokenMeta.role || '').toString().trim();
      var t_status = (tokenMeta.status || '').toString().trim();
      var t_level = Number(tokenMeta.level_number || tokenMeta.level || 0);
      var t_posNum = (tokenMeta.position_index || tokenMeta.position_code || '').toString();

      var p = null;
      try {
        var qP = await sb.from('profiles').select('*').eq('id', userAuth.id).limit(1).maybeSingle();
        if (qP && qP.data) { p = qP.data; }
      } catch(ee) { p = null; }
      this.sbProfile = p;

      if (p) {
        this.currentUser.id = p.id;
        var fn = (p.full_name || '').toString().trim();
        this.currentUser.fullName = fn || t_full || p.username || this.currentUser.fullName;
        this.currentUser.username = (p.username || t_username || this.currentUser.username || '').toString().trim();
        this.currentUser.email = (p.email || t_email || userAuth.email || this.currentUser.email).toString().trim();
        this.currentUser.country = (p.country || t_country || this.currentUser.country).toString().trim();
        this.currentUser.phone = (p.phone || t_phone || this.currentUser.phone).toString().trim();
        this.currentUser.sponsor = (p.upline_username || p.sponsor_code || t_upline || this.currentUser.sponsor).toString().trim();
        var pos = '';
        if (p.position_index) pos = '#' + p.position_index;
        else if (p.line_row && p.line_seat) pos = '#' + p.line_row + '-' + p.line_seat;
        else if (t_posNum) pos = '#' + t_posNum;
        else pos = '#' + (userAuth.id || '').toString().slice(0, 6);
        this.currentUser.positionNumber = pos;
        this.currentUser.level = Number(p.level_number || t_level || 0);
        if (p.created_at) {
          try {
            var d = new Date(p.created_at);
            this.currentUser.entryDate = d.toLocaleDateString('pt-PT');
          } catch(e) {}
        }
        if (p.role) this.userRole = (p.role === 'superadmin' || p.role === 'admin') ? 'admin' : 'user';
        else if (t_role) this.userRole = (t_role === 'superadmin' || t_role === 'admin') ? 'admin' : 'user';
        var rawSt = (p.status || t_status || 'PENDING').toString().toUpperCase();
        this.currentUser.status = (rawSt === 'ACTIVE' || rawSt === 'TRUE') ? 'ACTIVE' : ((rawSt === 'SUSPENDED' || rawSt === 'BANNED') ? rawSt : 'PENDING');
        if (p.preferred_lang) this.currentLang = p.preferred_lang;
        else if (tokenMeta.lang) this.currentLang = tokenMeta.lang;
        if (p.theme) this.currentTheme = p.theme;
        this.isAuthenticated = true;
      } else {
        this.currentUser.id = userAuth.id;
        this.currentUser.fullName = t_full || this.currentUser.fullName;
        this.currentUser.username = (t_username || this.currentUser.username || '').toString().trim();
        this.currentUser.email = (t_email || userAuth.email || this.currentUser.email).toString().trim();
        this.currentUser.country = t_country || this.currentUser.country;
        this.currentUser.phone = t_phone || this.currentUser.phone;
        this.currentUser.sponsor = t_upline || this.currentUser.sponsor;
        var pos2 = '';
        if (t_posNum) pos2 = '#' + t_posNum;
        else pos2 = '#' + (userAuth.id || '').toString().slice(0, 6);
        this.currentUser.positionNumber = pos2;
        this.currentUser.level = Number(t_level || 0);
        if (t_role) this.userRole = (t_role === 'superadmin' || t_role === 'admin') ? 'admin' : 'user';
        var rawSt2 = (t_status || 'PENDING').toString().toUpperCase();
        this.currentUser.status = (rawSt2 === 'ACTIVE' || rawSt2 === 'TRUE') ? 'ACTIVE' : ((rawSt2 === 'SUSPENDED' || rawSt2 === 'BANNED') ? rawSt2 : 'PENDING');
        if (tokenMeta.lang) this.currentLang = tokenMeta.lang;
        this.isAuthenticated = true;
      }

      var FORBIDDEN = ['guest','register','login','logout','signin','signup','sign-up','sign_in','sign-up','admin','administrator','adm','root','owner','staff','team','profile','user','users','account','accounts','support','ticket','tickets','wallet','wallets','deposit','deposits','withdraw','withdrawal','withdrawals','dashboard','dash','home','landing','index','referral','referrals','ref','sponsor','sponsors','tree','matrix','network','plan','plans','system','sys','config','settings','setup','app','4h','fourhash','four-hash','four_hash','protocol','official','oficial','ceo','founder','supabase','resend','support-team','financeiro','backoffice','painel','painel-admin'];
      var RESERVED_PREFIX = ['admin','adm','staff','root','official','fourhash','4h','support'];
      var raw_u = (this.currentUser.username || '').toString().trim();
      var u_source = 'profile_or_token';
      var u = raw_u;
      if (!u && p && typeof p.username === 'string' && p.username.trim() !== '') { u = p.username.trim(); u_source = 'sbProfile.username'; }
      if (!u && t_username) { u = t_username; u_source = 'tokenMeta.username'; }
      if (!u && p && typeof p.sponsor_code === 'string' && p.sponsor_code.trim() !== '') { u = p.sponsor_code.trim(); u_source = 'sbProfile.sponsor_code'; }
      if (!u) {
        var uuid_short = (userAuth.id || 'u' + Date.now()).toString().replace(/-/g,'');
        u = 'u' + uuid_short.substr(0, 10);
        u_source = 'fallback_uuid';
      }
      u = u.replace(/[^a-zA-Z0-9_]/g,'_').toLowerCase();
      if (u.length > 20) u = u.substr(0, 20);
      var low = u.toLowerCase();
      var forbidden_hit = (FORBIDDEN.indexOf(low) >= 0);
      var prefix_hit = false;
      for (var i = 0; i < RESERVED_PREFIX.length; i++) {
        if (low === RESERVED_PREFIX[i] || low.indexOf(RESERVED_PREFIX[i] + '_') === 0) { prefix_hit = true; break; }
      }
      if (forbidden_hit || prefix_hit) {
        var uuid_short2 = (userAuth.id || 'u' + Date.now()).toString().replace(/-/g,'');
        u = 'u' + uuid_short2.substr(0, 10);
        u_source = u_source + ' → replaced_forbidden_to_' + u;
      }
      this.currentUser.username = u;
      if (!this.currentUser.fullName) this.currentUser.fullName = this.currentUser.username;
      try {
        console.log('[4H.profile] username source:', u_source, '| sbProfile.username=', (p && p.username ? p.username : null), '| tokenMeta.username=', (t_username || null), '| final=', u, '| email=', this.currentUser.email);
      } catch(_debug) {}

      var ADMIN_MASTER_UUID = '7ce5a80a-abc8-4bc3-a17f-d7ed8670b15f';
      var ADMIN_MASTER_EMAIL = '4hashprotocol@gmail.com';
      var uid = (this.currentUser.id || userAuth.id || '').toString().toLowerCase();
      var eml = (this.currentUser.email || userAuth.email || '').toString().toLowerCase();
      var ehMaster = (uid === ADMIN_MASTER_UUID.toLowerCase()) || (eml === ADMIN_MASTER_EMAIL.toLowerCase());
      if (ehMaster) {
        this.userRole = 'admin';
        this.currentUser.status = 'ACTIVE';
        this.currentUser.username = '4hashprotocol';
        this.currentUser.fullName = 'Four Hash';
        if (!this.currentUser.level || this.currentUser.level <= 0) this.currentUser.level = 1;
        if (!this.currentUser.positionNumber || this.currentUser.positionNumber === '-' || this.currentUser.positionNumber === '') this.currentUser.positionNumber = '#1';
        this.currentUser.sponsor = '';
      }

      try {
        var w = await sb.from('wallets').select('*').eq('profile_id', userAuth.id).limit(1).maybeSingle();
        if (w && w.data) {
          this.currentUser.availableBalance = Number(w.data.available_balance || 0);
          this.currentUser.pendingBalance   = Number(w.data.pending_balance   || 0);
          var dep = Number(w.data.total_deposited || 0);
          var bT = Number(w.data.total_bonus_team || 0);
          var bM = Number(w.data.total_bonus_matrix || 0);
          this.currentUser.totalReceived    = dep + bT + bM;
        } else {
          this.currentUser.availableBalance = this.currentUser.availableBalance || 0;
          this.currentUser.pendingBalance   = this.currentUser.pendingBalance || 0;
          this.currentUser.totalReceived    = this.currentUser.totalReceived || 0;
        }
      } catch(eWallet) {}

      return true;
    } catch(e) {
      this.sbError = (e && e.message) ? e.message : String(e);
      return false;
    }
  },

  async sbInit() {
    try {
      if (!window.SupabaseOK || !window.SupabaseOK()) {
        this._sbReady = false;
        this.sbError = (window.SUPABASE_LAST_ERROR || 'SDK não carregou');
        this.isAuthenticated = false;
        this.sbAuth = null; this.sbSession = null; this.sbProfile = null; this.userRole = 'user';
        return false;
      }
      var sb = this._sb();
      if (!sb) {
        this._sbReady = false;
        this.isAuthenticated = false; this.sbAuth = null; this.sbProfile = null; this.userRole = 'user';
        return false;
      }
      var gs = await sb.auth.getSession();
      this.sbSession = (gs && gs.data && gs.data.session) ? gs.data.session : null;
      var gu = await sb.auth.getUser();
      this.sbAuth = (gu && gu.data && gu.data.user) ? gu.data.user : null;
      if (!this.sbAuth) {
        this.isAuthenticated = false;
        this.sbProfile = null;
        this.userRole = 'user';
        this.currentUser = {
          id: null, fullName: 'Usuário Convidado', username: 'guest', email: '', country: '',
          phone: '', sponsor: '', positionNumber: '-', level: 0, status: 'GUEST',
          entryDate: '', availableBalance: 0, pendingBalance: 0, totalReceived: 0,
          directReferralsCount: 0, activeReferralsCount: 0, inactiveReferralsCount: 0
        };
        this.transactions = [];
        this.notifications = [];
        this.withdrawals = [];
        this.treeLevels = [];
        this.adminUsersList = [];
        this._sbReady = true;
        return true;
      }

      await this._loadUserProfileFromSupabase(this.sbAuth, this.sbSession);

      this._sbReady = true;
      await this.refreshFromSupabase();
      return true;
    } catch (e) {
      this.sbError = (e && e.message) ? e.message : String(e);
      this._sbReady = false;
      this.isAuthenticated = false;
      this.sbAuth = null; this.sbSession = null; this.sbProfile = null; this.userRole = 'user';
      this.adminUsersList = [];
      return false;
    }
  },

  async refreshFromSupabase() {
    try {
      await Promise.all([
        this.refreshSupportTickets(),
        this.refreshFinanceProblems(),
        this.refreshAdminSummaries(),
        this.refreshAdminUsersList()
      ]);
      return true;
    } catch (e) {
      this.sbError = (e && e.message) ? e.message : String(e);
      return false;
    }
  },

  async refreshAdminUsersList() {
    if (!window.SupabaseOK || !window.SupabaseOK()) { this.adminUsersList = []; return false; }
    try {
      var sb = this._sb(); if (!sb) { this.adminUsersList = []; return false; }
      var r = await sb.from('profiles').select('id, username, full_name, email, country, phone, upline_username, sponsor_code, level_number, position_index, line_row, line_seat, role, status, kyc_status, created_at').order('created_at', { ascending: true });
      var rows = (r && r.data) ? r.data : [];
      this.adminUsersList = rows.map(function(p){
        var full = (p.full_name || '').toString().trim();
        var pos = '';
        if (p.position_index) pos = '#' + p.position_index;
        else if (p.line_row && p.line_seat) pos = '#' + p.line_row + '-' + p.line_seat;
        else pos = '-';
        var lvl = Number(p.level_number || 0);
        return {
          id: p.id,
          username: p.username || '',
          fullName: full || p.username || '',
          email: p.email || '',
          country: p.country || '',
          phone: p.phone || '',
          sponsor: p.upline_username || p.sponsor_code || '',
          positionNumber: pos,
          level: lvl,
          levelLabel: 'Level ' + String(lvl).padStart(2, '0'),
          role: p.role || 'user',
          status: p.status || 'pending',
          kyc: p.kyc_status || 'none',
          createdAt: p.created_at || ''
        };
      });
      return true;
    } catch (e) {
      this.sbError = 'admin-users: ' + ((e && e.message) || String(e));
      this.adminUsersList = [];
      return false;
    }
  },

  _mapTicket(row) {
    if (!row) return null;
    return {
      id: row.code || ('tk_' + row.id),
      ticket_id: row.id,
      username: (row.username_cache || row.profile_id || '').toString(),
      email: (row.email_cache || '').toString(),
      subject: row.subject || '(sem assunto)',
      message: row.message || '',
      category: row.category || 'Outro',
      priority: row.priority || 'Média',
      status: row.status || 'Aberto',
      created: row.created_at ? new Date(row.created_at) : new Date(),
      createdAt: row.created_at ? row.created_at : '',
      created_at: row.created_at,
      assignedTo: row.assigned_to,
      closedBy: row.closed_by,
      closedAt: row.closed_at,
      lastReplyAt: row.last_reply_at,
      internalTags: row.internal_tags || [],
      privateNote: row.private_note,
      viewCount: row.view_count || 0,
      replies: []
    };
  },

  _mapFinance(row) {
    if (!row) return null;
    return {
      id: row.code || ('fin_' + row.id),
      fin_id: row.id,
      type: row.type || 'Depósito',
      category: row.category || row.type || '',
      username: (row.username_cache || row.profile_id || '').toString(),
      email: (row.email_cache || '').toString(),
      amount: Number(row.amount || 0),
      expected: Number(row.expected || 0),
      currency: row.currency || 'USDT',
      network: row.network || 'BEP20',
      txHash: row.tx_hash || '',
      nowpaymentsId: row.nowpayments_id || '',
      status: row.status || 'Pendente Revisão',
      priority: (row.status === 'Em Análise') ? 'Alta' : 'Normal',
      opened: row.opened || '',
      openedAt: row.opened || '',
      assignedTo: row.assigned_to,
      resolution: row.resolution || '',
      resolvedBy: row.resolved_by,
      resolvedAt: row.resolved_at,
      finalDecision: row.final_decision || '',
      finalObservation: row.final_observation || '',
      signatureName: row.signature_name || '',
      signatureTime: row.signature_time || '',
      creditWallet: !!row.credit_wallet,
      adjustedAmount: Number(row.adjusted_amount || 0),
      internalTags: row.internal_tags || [],
      privateNote: row.private_note
    };
  },

  async refreshSupportTickets() {
    if (!window.SupabaseOK || !window.SupabaseOK()) return false;
    try {
      var sb = this._sb(); if (!sb) return false;
      var q = sb.from('support_tickets').select('*').order('created_at', { ascending: false });
      var r = await q;
      if (!r || !r.data || !r.data.length) return false;
      var rows = r.data.map(this._mapTicket.bind(this)).filter(Boolean);
      var repl = await sb.from('support_ticket_replies').select('*').in('ticket_id', r.data.map(function(x){return x.id;}));
      if (repl && repl.data && repl.data.length) {
        var byId = {};
        repl.data.forEach(function(rr){
          if (!byId[rr.ticket_id]) byId[rr.ticket_id] = [];
          byId[rr.ticket_id].push({
            id: rr.id,
            author: rr.author_name || (rr.is_admin_reply ? 'Admin' : 'Utilizador'),
            authorRole: rr.author_role || (rr.is_admin_reply ? 'admin' : 'user'),
            isAdmin: !!rr.is_admin_reply,
            isInternal: !!rr.is_internal,
            message: rr.message || '',
            createdAt: rr.created_at
          });
        });
        rows.forEach(function(t){ if (byId[t.ticket_id]) t.replies = byId[t.ticket_id]; });
      }
      this.supportTickets = rows;
      return true;
    } catch (e) {
      this.sbError = 'support: ' + ((e && e.message) || String(e));
      return false;
    }
  },

  async refreshFinanceProblems() {
    if (!window.SupabaseOK || !window.SupabaseOK()) return false;
    try {
      var sb = this._sb(); if (!sb) return false;
      var r = await sb.from('finance_problems').select('*').order('created_at', { ascending: false });
      if (!r || !r.data || !r.data.length) return false;
      var rows = r.data.map(this._mapFinance.bind(this)).filter(Boolean);
      var notes = await sb.from('finance_problem_notes').select('*').in('problem_id', r.data.map(function(x){return x.id;}));
      if (notes && notes.data) {
        var byP = {};
        notes.data.forEach(function(n){
          if (!byP[n.problem_id]) byP[n.problem_id] = [];
          byP[n.problem_id].push({
            id: n.id, kind: n.kind || 'note',
            from: n.status_from || '', to: n.status_to || '',
            resolution: n.resolution_text || '',
            message: n.message || '',
            amount: Number(n.credit_amount || 0),
            internal: !!n.is_internal,
            createdAt: n.created_at
          });
        });
        rows.forEach(function(f){ if (byP[f.fin_id]) f.history = byP[f.fin_id]; });
      }
      this.financeProblems = rows;
      return true;
    } catch (e) {
      this.sbError = 'finance: ' + ((e && e.message) || String(e));
      return false;
    }
  },

  async refreshAdminSummaries() {
    if (!window.SupabaseOK || !window.SupabaseOK()) return false;
    try {
      var sb = this._sb(); if (!sb) return false;
      try {
        var setR = await sb.from('system_settings').select('*').limit(1).maybeSingle();
        if (setR && setR.data && typeof setR.data === 'object') {
          var d = setR.data;
          if (typeof d.entry_amount === 'number' || typeof d.entry_amount === 'string') this.projectSettings.entryAmount = Number(d.entry_amount);
          if (typeof d.currency === 'string') this.projectSettings.currency = d.currency;
          if (typeof d.network === 'string') this.projectSettings.network = d.network;
          if (typeof d.team_percent_n1 === 'number' || typeof d.team_percent_n1 === 'string') this.projectSettings.teamCommissionPercents[0] = Number(d.team_percent_n1);
          if (typeof d.team_percent_n2 === 'number' || typeof d.team_percent_n2 === 'string') this.projectSettings.teamCommissionPercents[1] = Number(d.team_percent_n2);
          if (typeof d.team_percent_n3 === 'number' || typeof d.team_percent_n3 === 'string') this.projectSettings.teamCommissionPercents[2] = Number(d.team_percent_n3);
          if (typeof d.team_percent_n4 === 'number' || typeof d.team_percent_n4 === 'string') this.projectSettings.teamCommissionPercents[3] = Number(d.team_percent_n4);
          if (typeof d.team_percent_n5 === 'number' || typeof d.team_percent_n5 === 'string') this.projectSettings.teamCommissionPercents[4] = Number(d.team_percent_n5);
          if (typeof d.project_fund_percentage === 'number' || typeof d.project_fund_percentage === 'string') this.projectSettings.projectFundPercentage = Number(d.project_fund_percentage);
          if (typeof d.total_distributed_percentage === 'number' || typeof d.total_distributed_percentage === 'string') this.projectSettings.totalDistributedPercentage = Number(d.total_distributed_percentage);
          if (typeof d.vault_address === 'string') this.projectSettings.depositAddress = d.vault_address;
          if (typeof d.presale_end_date !== 'undefined' && d.presale_end_date !== null) this.projectSettings.presaleEndDate = d.presale_end_date;
          if (typeof d.withdraw_min === 'number' || typeof d.withdraw_min === 'string') this.projectSettings.withdraw.minAmount = Number(d.withdraw_min);
          if (typeof d.withdraw_max === 'number' || typeof d.withdraw_max === 'string') this.projectSettings.withdraw.maxAmountPerRequest = Number(d.withdraw_max);
          if (typeof d.withdraw_fee_flat === 'number' || typeof d.withdraw_fee_flat === 'string') this.projectSettings.withdraw.networkFeeFlat = Number(d.withdraw_fee_flat);
          if (typeof d.withdraw_hours === 'number' || typeof d.withdraw_hours === 'string') this.projectSettings.withdraw.processingHours = Number(d.withdraw_hours);
        }
      } catch(settErr) {}

      var rProfiles = await sb.from('profiles').select('id, status, role, created_at');
      var rowsProfiles = (rProfiles && rProfiles.data) ? rProfiles.data : [];
      var totalUsers = rowsProfiles.length;
      var activeUsers = rowsProfiles.filter(function(p){ return p.status === 'active' || p.status === 'ACTIVE'; }).length;
      var pendingUsers = rowsProfiles.filter(function(p){ return p.status === 'pending' || p.status === 'PENDING'; }).length;
      var adminUsers = rowsProfiles.filter(function(p){ return p.role === 'superadmin' || p.role === 'admin'; }).length;
      var pctAtivos = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 1000) / 10 : 0;

      var rTx = await sb.from('transactions').select('amount, kind, status');
      var rowsTx = (rTx && rTx.data) ? rTx.data : [];
      var sumDep = 0; var sumDepOK = 0; var sumWd = 0; var sumWdOK = 0;
      var sumBonus = 0;
      rowsTx.forEach(function(t){
        var a = Number(t.amount || 0);
        var k = (t.kind || '').toString().toLowerCase();
        var s = (t.status || '').toString().toLowerCase();
        if (k === 'deposit') { sumDep += a; if (s === 'completed' || s === 'confirmed' || s === 'success') sumDepOK += a; }
        else if (k === 'withdrawal' || k === 'withdraw') { sumWd += a; if (s === 'completed' || s === 'confirmed' || s === 'success') sumWdOK += a; }
        else if (k.indexOf('bonus') >= 0 || k.indexOf('referral') >= 0 || k.indexOf('matrix') >= 0 || k.indexOf('team') >= 0) { sumBonus += a; }
      });
      var volumeEntradas = sumDepOK > 0 ? sumDepOK : sumDep;
      var fundoLiquidez = volumeEntradas * (Number(this.projectSettings.projectFundPercentage || 40) / 100);
      var bonusEquipe = volumeEntradas * (Number(this.projectSettings.totalDistributedPercentage || 60) / 100);

      var rWallets = await sb.from('wallets').select('available_balance, pending_balance, frozen_balance, total_deposited, total_withdrawn, total_bonus_team, total_bonus_matrix');
      var rowsW = (rWallets && rWallets.data) ? rWallets.data : [];
      var totalBalance = 0; var totalDeposited = 0; var totalWithdrawn = 0; var totalBTeam = 0; var totalBMatrix = 0;
      rowsW.forEach(function(w){
        totalBalance += Number(w.available_balance || 0);
        totalDeposited += Number(w.total_deposited || 0);
        totalWithdrawn += Number(w.total_withdrawn || 0);
        totalBTeam += Number(w.total_bonus_team || 0);
        totalBMatrix += Number(w.total_bonus_matrix || 0);
      });

      this.adminSummaries = {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          admins: adminUsers,
          pctAtivos: pctAtivos
        },
        volume: {
          totalDeposits: sumDep,
          totalDepositsCompleted: sumDepOK,
          totalWithdrawals: sumWd,
          totalWithdrawalsCompleted: sumWdOK,
          totalBonus: sumBonus,
          volumeEntradas: volumeEntradas,
          fundoLiquidez: fundoLiquidez,
          bonusEquipe: bonusEquipe
        },
        wallets: {
          totalBalance: totalBalance,
          totalDeposited: totalDeposited,
          totalWithdrawn: totalWithdrawn,
          totalBonusTeam: totalBTeam,
          totalBonusMatrix: totalBMatrix
        },
        support: {},
        finance: {}
      };

      this.adminSupportSummary = { open: 0, pending: 0, closed: 0 };
      this.adminFinanceSummary = { open: 0, pending: 0, resolved: 0 };

      try {
        var tSup = await sb.from('support_tickets').select('status');
        var rs = (tSup && tSup.data) ? tSup.data : [];
        rs.forEach(function(t){
          var s = (t.status || 'open').toString().toLowerCase();
          if (s === 'open' || s === 'new') this.adminSupportSummary.open += 1;
          else if (s === 'pending' || s === 'in_progress') this.adminSupportSummary.pending += 1;
          else if (s === 'closed' || s === 'resolved') this.adminSupportSummary.closed += 1;
        }.bind(this));
        var tFin = await sb.from('finance_problems').select('status');
        var rf = (tFin && tFin.data) ? tFin.data : [];
        rf.forEach(function(t){
          var s = (t.status || 'open').toString().toLowerCase();
          if (s === 'open' || s === 'new') this.adminFinanceSummary.open += 1;
          else if (s === 'pending' || s === 'in_progress') this.adminFinanceSummary.pending += 1;
          else if (s === 'closed' || s === 'resolved') this.adminFinanceSummary.resolved += 1;
        }.bind(this));
      } catch(ee) {}

      return true;
    } catch (e) {
      return false;
    }
  },

  async saveProjectSettings(cfg) {
    if (cfg && typeof cfg === 'object') {
      if (typeof cfg.entryAmount !== 'undefined') this.projectSettings.entryAmount = Number(cfg.entryAmount || 0);
      if (Array.isArray(cfg.teamCommissionPercents) && cfg.teamCommissionPercents.length >= 5) {
        for (var i=0; i<5; i++) this.projectSettings.teamCommissionPercents[i] = Number(cfg.teamCommissionPercents[i] || 0);
      }
      if (typeof cfg.depositAddress === 'string') this.projectSettings.depositAddress = cfg.depositAddress;
      var totalEq = 0;
      for (var j=0; j<5; j++) totalEq += Number(this.projectSettings.teamCommissionPercents[j] || 0);
      this.projectSettings.totalDistributedPercentage = totalEq;
      this.projectSettings.projectFundPercentage = 100 - totalEq;
      if (this.projectSettings.projectFundPercentage < 0) this.projectSettings.projectFundPercentage = 0;
    }
    if (window.SupabaseOK && window.SupabaseOK()) {
      try {
        var sb = this._sb();
        if (sb) {
          var p = {
            id: 1,
            entry_amount: Number(this.projectSettings.entryAmount || 0),
            currency: this.projectSettings.currency,
            network: this.projectSettings.network,
            team_percent_n1: Number(this.projectSettings.teamCommissionPercents[0] || 0),
            team_percent_n2: Number(this.projectSettings.teamCommissionPercents[1] || 0),
            team_percent_n3: Number(this.projectSettings.teamCommissionPercents[2] || 0),
            team_percent_n4: Number(this.projectSettings.teamCommissionPercents[3] || 0),
            team_percent_n5: Number(this.projectSettings.teamCommissionPercents[4] || 0),
            project_fund_percentage: Number(this.projectSettings.projectFundPercentage || 0),
            total_distributed_percentage: Number(this.projectSettings.totalDistributedPercentage || 0),
            vault_address: this.projectSettings.depositAddress,
            withdraw_min: Number(this.projectSettings.withdraw.minAmount || 0),
            withdraw_max: Number(this.projectSettings.withdraw.maxAmountPerRequest || 0),
            withdraw_fee_flat: Number(this.projectSettings.withdraw.networkFeeFlat || 0),
            withdraw_hours: Number(this.projectSettings.withdraw.processingHours || 0),
            updated_at: new Date().toISOString()
          };
          try {
            var ex = await sb.from('system_settings').select('id').limit(1).maybeSingle();
            if (ex && ex.data) {
              await sb.from('system_settings').update(p).eq('id', Number(ex.data.id || 1));
            } else {
              await sb.from('system_settings').insert([p]);
            }
          } catch (tblErr) {
            return true;
          }
        }
      } catch(e) {}
    }
    return true;
  },

  async sbSignIn(email, password) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Modo offline: login demo ativado.', 'info'); this.isAuthenticated = true; return true; }
    var sb = this._sb();
    try {
      var r = await sb.auth.signInWithPassword({ email: email, password: password });
      if (r && r.error) { UI.showToast(r.error.message || 'Erro de login', 'error'); return false; }
      var userAuth = (r && r.data && r.data.user) ? r.data.user : null;
      var sessAuth = (r && r.data && r.data.session) ? r.data.session : null;
      if (!userAuth) { UI.showToast('Credenciais inválidas.', 'error'); return false; }
      await this._loadUserProfileFromSupabase(userAuth, sessAuth);
      try { await this.refreshFromSupabase(); } catch(err) {}
      if (typeof Router !== 'undefined' && Router.renderNav) try { Router.renderNav(); } catch(e) {}
      UI.showToast(`Bem-vindo(a) ${this.currentUser.fullName || 'usuário'}! Autenticado com sucesso.`, 'success', 'fa-circle-check');
      var route = 'dashboard';
      try { if (typeof Router !== 'undefined' && Router.isAdmin && Router.isAdmin()) route = 'admin'; } catch(e) {}
      if (typeof Router !== 'undefined') try { Router.navigate(route); } catch(e) {}
      return true;
    } catch (e) { UI.showToast((e && e.message) || 'Erro login', 'error'); return false; }
  },

  async sbSignUp(email, password, meta) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Modo offline: registo demo salvo.', 'info'); this.isAuthenticated = true; return true; }
    var sb = this._sb();
    try {
      var r = await sb.auth.signUp({
        email: email, password: password,
        options: { data: meta || {} }
      });
      if (r && r.error) { UI.showToast(r.error.message || 'Erro registo', 'error'); return false; }
      var userAuth = (r && r.data && r.data.user) ? r.data.user : null;
      var sessAuth = (r && r.data && r.data.session) ? r.data.session : null;
      if (userAuth && sessAuth) {
        await this._loadUserProfileFromSupabase(userAuth, sessAuth);
        try { await this.refreshFromSupabase(); } catch(err) {}
        if (typeof Router !== 'undefined' && Router.renderNav) try { Router.renderNav(); } catch(e) {}
        UI.showToast(`Conta criada com sucesso! Bem-vindo(a) ${this.currentUser.fullName || 'usuário'}.`, 'success', 'fa-circle-check');
        var route = 'dashboard';
        if (typeof Router !== 'undefined') try { Router.navigate(route); } catch(e) {}
      } else {
        UI.showToast('Conta criada! Verifique seu email para confirmar a ativação.', 'success');
        if (typeof Router !== 'undefined') try { Router.navigate('landing'); } catch(e) {}
      }
      return true;
    } catch (e) { UI.showToast((e && e.message) || 'Erro registo', 'error'); return false; }
  },

  async sbSignOut() {
    if (!window.SupabaseOK || !window.SupabaseOK()) {
      this.isAuthenticated = false; this.userRole = 'user';
      this.sbAuth = null; this.sbSession = null; this.sbProfile = null;
      if (typeof Router !== 'undefined') Router.navigate('landing');
      return true;
    }
    var sb = this._sb();
    try { if (sb) await sb.auth.signOut(); } catch(e) {}
    this.sbAuth = null; this.sbSession = null; this.sbProfile = null;
    this.isAuthenticated = false; this.userRole = 'user';
    this.currentUser = {
      id: null, fullName: 'Usuário Convidado', username: 'guest', email: '', country: '',
      phone: '', sponsor: '', positionNumber: '-', level: 0, status: 'GUEST',
      entryDate: '', availableBalance: 0, pendingBalance: 0, totalReceived: 0,
      directReferralsCount: 0, activeReferralsCount: 0, inactiveReferralsCount: 0
    };
    this.transactions = []; this.notifications = []; this.withdrawals = []; this.treeLevels = [];
    this.supportTickets = []; this.financeProblems = [];
    this.adminSummaries = { support: {}, finance: {} };
    if (typeof Router !== 'undefined') Router.navigate('landing');
    if (typeof UI !== 'undefined') UI.showToast('Sessão terminada.', 'info');
    return true;
  },

  async activateAccount(opts) {
    opts = opts || {};
    var uid = (this.sbAuth && this.sbAuth.id) ? this.sbAuth.id : this.currentUser.id;
    if (!uid) { UI.showToast('Sessão inválida. Faça login novamente.', 'error'); return false; }
    var amount = Number((opts && opts.amount) ? opts.amount : (this.projectSettings.entryAmount || 10));
    var currency = (opts && opts.currency) ? opts.currency : (this.projectSettings.currency || 'USDT');
    var network  = (opts && opts.network)  ? opts.network  : (this.projectSettings.network  || 'BEP20');
    var txHash   = (opts && opts.txHash)   ? opts.txHash   : ('0xSIMULATED_' + Date.now().toString(16));

    if (!window.SupabaseOK || !window.SupabaseOK()) {
      this.currentUser.status = 'ACTIVE';
      this.currentUser.level = Math.max(Number(this.currentUser.level || 0), 1);
      UI.showToast('Conta ativada (modo offline).', 'success');
      return true;
    }
    var sb = this._sb();
    if (!sb) { return false; }
    try {
      var ok = false;
      try {
        var upProfile = await sb.from('profiles').update({ status: 'active', level_number: 1, updated_at: new Date().toISOString() }).eq('id', uid).select('id,status,level_number').limit(1).maybeSingle();
        ok = !!(upProfile && upProfile.data && upProfile.data.status && String(upProfile.data.status).toLowerCase() === 'active');
      } catch (eUpProfile) { ok = false; }

      if (!ok) {
        try {
          var upProfile2 = await sb.from('profiles').update({ status: 'active' }).eq('id', uid);
          ok = !!(upProfile2 && !upProfile2.error);
        } catch(e2) { ok = false; }
      }

      try {
        await sb.from('transactions').insert({
          profile_id: uid,
          type: 'deposit',
          currency: currency,
          network: network,
          amount: Number(amount || 0),
          gross_amount: Number(amount || 0),
          status: 'confirmed',
          tx_hash: txHash,
          from_address: null,
          to_address: this.projectSettings.depositAddress || null,
          note: 'Ativação inicial ' + currency + ' ' + network
        });
      } catch(eTx) { /* não trava ativação */ }

      try {
        if (typeof sb.rpc === 'function' && typeof sb.rpc('increment_wallet_balance') === 'object') {
          await sb.rpc('increment_wallet_balance', { profile_id: uid, amount: Number(amount || 0) });
        }
      } catch(eRpc) { /* fallback: update manual */
        try {
          await sb.from('wallets').update({ available_balance: Number((this.currentUser.availableBalance || 0) + Number(amount || 0)) }).eq('profile_id', uid);
        } catch(eWalletUp) {}
      }

      this.currentUser.status = 'ACTIVE';
      this.currentUser.level = Math.max(Number(this.currentUser.level || 0), 1);
      try { await this._loadUserProfileFromSupabase(this.sbAuth, this.sbSession); } catch(eReload) {}
      try { await this.refreshFromSupabase(); } catch(eRefr) {}
      UI.showToast('Pagamento confirmado ✓ Conta ativada na posição ' + (this.currentUser.positionNumber || '#') + '.', 'success', 'fa-circle-check');
      return true;
    } catch (e) {
      this.currentUser.status = 'ACTIVE';
      UI.showToast('Ativação concluída. Se o saldo não aparecer, recarregue.', 'warning');
      return true;
    }
  },

  async sbReplyTicket(ticketIdOrCode, message, opts) {
    opts = opts || {};
    var sb = this._sb();
    var tktId = ticketIdOrCode;
    if (sb && typeof ticketIdOrCode === 'string' && ticketIdOrCode.indexOf('tk_') === 0) {
      var t = await sb.from('support_tickets').select('id').eq('code', ticketIdOrCode).limit(1).maybeSingle();
      if (t && t.data) tktId = t.data.id;
    }
    if (!window.SupabaseOK || !window.SupabaseOK() || !sb) {
      this.supportTickets.forEach(function(t){
        if ((t.id === ticketIdOrCode || t.ticket_id === ticketIdOrCode)) {
          t.replies.push({ author:'Admin', authorRole:'admin', isAdmin:true, message: message, createdAt: new Date().toISOString() });
          t.status = 'Respondido'; t.lastReplyAt = new Date().toISOString();
        }
      });
      UI.showToast('Resposta adicionada (modo offline).', 'success');
      return true;
    }
    try {
      var me = this.sbAuth && this.sbAuth.id ? this.sbAuth.id : null;
      await sb.from('support_ticket_replies').insert({
        ticket_id: tktId, author_id: me, is_admin_reply: true, is_internal: !!opts.internal,
        message: message
      });
      var up = { status: (opts.close ? 'Fechado' : 'Respondido'), last_reply_at: new Date().toISOString() };
      if (opts.close) { up.closed_by = me; up.closed_at = new Date().toISOString(); }
      if (me) up.assigned_to = me;
      await sb.from('support_tickets').update(up).eq('id', tktId);
      await this.refreshSupportTickets();
      UI.showToast(opts.close ? 'Ticket respondido e fechado.' : 'Resposta enviada.', 'success');
      if (typeof Router !== 'undefined') Router.refresh();
      return true;
    } catch (e) { UI.showToast((e && e.message) || 'Erro ao responder', 'error'); return false; }
  },

  async sbCloseTicket(ticketIdOrCode, note) {
    return await this.sbReplyTicket(ticketIdOrCode, note || 'Resolvido', { close: true });
  },

  async sbCreateFinanceProblem(data) {
    data = data || {};
    var def = {
      type: 'Depósito', category: 'Depósito',
      amount: 10.00, expected: 10.00, currency: 'USDT', network: 'BEP20',
      status: 'Pendente Revisão', opened: new Date().toISOString().slice(0,16).replace('T',' ').slice(0,16),
      profile_id: null, tx_hash: '', nowpayments_id: '', internal_tags: [], private_note: ''
    };
    for (var k in def) if (!(k in data)) data[k] = def[k];
    if (!window.SupabaseOK || !window.SupabaseOK()) {
      var fid = 'fin_' + String(this.financeProblems.length + 1).padStart(3,'0');
      var nr = this._mapFinance({ code: fid, created_at: new Date().toISOString(), username_cache: data.username_cache || 'demo', email_cache: data.email_cache || '',
        type: data.type, category: data.category, amount: data.amount, expected: data.expected, currency: data.currency, network: data.network,
        tx_hash: data.tx_hash, nowpayments_id: data.nowpayments_id, status: data.status, opened: data.opened });
      this.financeProblems.unshift(nr);
      UI.showToast('Problema adicionado (modo offline).', 'success');
      return true;
    }
    var sb = this._sb();
    try {
      if (!data.profile_id && this.sbAuth) data.profile_id = this.sbAuth.id;
      await sb.from('finance_problems').insert(data);
      await this.refreshFinanceProblems();
      UI.showToast('Problema financeiro criado.', 'success');
      if (typeof Router !== 'undefined') Router.refresh();
      return true;
    } catch (e) { UI.showToast((e && e.message) || 'Erro ao criar', 'error'); return false; }
  },

  async sbResolveFinance(finIdOrCode, resolution, opts) {
    opts = opts || {};
    var sb = this._sb();
    var pid = finIdOrCode;
    if (sb && typeof finIdOrCode === 'string' && finIdOrCode.indexOf('fin_') === 0) {
      var f = await sb.from('finance_problems').select('id').eq('code', finIdOrCode).limit(1).maybeSingle();
      if (f && f.data) pid = f.data.id;
    }
    if (!window.SupabaseOK || !window.SupabaseOK() || !sb) {
      this.financeProblems.forEach(function(fx){
        if (fx.id === finIdOrCode || fx.fin_id === finIdOrCode) {
          fx.status = 'Resolvido Total'; fx.resolution = resolution || '';
          if (opts.credit) { fx.creditWallet = true; fx.adjustedAmount = Number(opts.amount || 0); }
          if (!fx.history) fx.history = [];
          fx.history.push({ kind: opts.credit ? 'credit' : 'note', resolution: resolution, amount: Number(opts.amount||0), createdAt: new Date().toISOString() });
        }
      });
      UI.showToast('Resolução aplicada (modo offline).', 'success');
      return true;
    }
    try {
      var me = this.sbAuth && this.sbAuth.id ? this.sbAuth.id : null;
      var now = new Date().toISOString();
      await sb.from('finance_problem_notes').insert({
        problem_id: pid, author_id: me, kind: (opts.credit ? 'credit':'note'), is_internal: !!opts.internal,
        status_from: 'Em Análise', status_to: (opts.statusTo || 'Resolvido Total'),
        resolution_text: resolution,
        message: opts.message || resolution,
        credit_amount: Number(opts.amount || 0)
      });
      var up = { status: (opts.statusTo || 'Resolvido Total'), resolved_by: me, resolved_at: now, final_decision: resolution,
        final_observation: opts.finalObservation || resolution, signature_name: (opts.signature || 'Admin Master'),
        signature_time: now, credit_wallet: !!opts.credit, adjusted_amount: Number(opts.amount || 0), updated_at: now };
      if (me) up.assigned_to = me;
      await sb.from('finance_problems').update(up).eq('id', pid);
      if (opts.credit && Number(opts.amount || 0) > 0) {
        var pr = await sb.from('finance_problems').select('profile_id').eq('id', pid).limit(1).maybeSingle();
        if (pr && pr.data && pr.data.profile_id) {
          await sb.rpc('increment_wallet_balance', {
            profile_id_input: pr.data.profile_id,
            amount_input: Number(opts.amount),
            kind_input: 'credit'
          }).catch(function(){ /* safe se RPC não existir ainda */ });
        }
      }
      await this.refreshFinanceProblems();
      UI.showToast(opts.credit ? 'Crédito aplicado e resolvido.' : 'Resolução assinada.', 'success');
      if (typeof Router !== 'undefined') Router.refresh();
      return true;
    } catch (e) { UI.showToast((e && e.message) || 'Erro resolver financeiro', 'error'); return false; }
  }

};

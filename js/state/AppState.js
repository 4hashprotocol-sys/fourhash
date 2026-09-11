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
  adminUserSearch: '',
  adminUserStatusFilter: 'Todos',
  currentPayment: null,
  _paymentPollTimer: null,

  PAYMENT_LIFETIME_MS: 15 * 60 * 1000,

  _paymentStorageKey() {
    const uid = (this.currentUser && this.currentUser.id) ? this.currentUser.id : 'guest';
    return 'fh_pay_' + String(uid).replace(/[^a-zA-Z0-9]/g, '_');
  },

  _persistCurrentPayment() {
    try {
      const key = this._paymentStorageKey();
      if (!this.currentPayment || !this.currentPayment.payment_id) {
        try { localStorage.removeItem(key); } catch(_) {}
        return;
      }
      const toSave = Object.assign({}, this.currentPayment, {
        _persistedAt: Date.now(),
        _paymentStartedAtSaved: this._paymentStartedAt || null
      });
      localStorage.setItem(key, JSON.stringify(toSave));
    } catch(e) {}
  },

  _restoreCurrentPayment() {
    try {
      if (this.currentPayment && this.currentPayment.payment_id) return true;
      const key = this._paymentStorageKey();
      const raw = localStorage.getItem(key);
      if (!raw || raw.length < 10) return false;
      const obj = JSON.parse(raw);
      if (!obj || !obj.payment_id) return false;
      this.currentPayment = obj;
      if (obj._paymentStartedAtSaved) this._paymentStartedAt = obj._paymentStartedAtSaved;
      return true;
    } catch(e) { return false; }
  },

  hasOpenPayment() {
    if (!this.currentPayment || !this.currentPayment.payment_id) {
      try { this._restoreCurrentPayment(); } catch(_) {}
    }
    var p = this.currentPayment;
    if (!p || !p.payment_id) return false;
    var st = String(p.status || 'waiting').toLowerCase();
    if (st === 'finished' || st === 'confirmed' || st === 'success' || st === 'paid' || st === 'done' || st === 'closed' || st === 'cancelled' || st === 'canceled' || st === 'refunded') return false;
    var createdAt = p.created_at || p.createdAt || p.created || null;
    if (!createdAt) {
      if (this._paymentStartedAt) createdAt = this._paymentStartedAt;
    }
    if (!createdAt) return true;
    var ms = (typeof createdAt === 'string') ? (new Date(createdAt)).getTime() : (createdAt instanceof Date ? createdAt.getTime() : Number(createdAt));
    if (!ms || isNaN(ms)) return true;
    var age = Date.now() - ms;
    return age < this.PAYMENT_LIFETIME_MS;
  },

  getOpenPaymentRemainingMs() {
    if (!this.currentPayment || !this.currentPayment.payment_id) {
      try { this._restoreCurrentPayment(); } catch(_) {}
    }
    var p = this.currentPayment; if (!p) return 0;
    var createdAt = p.created_at || p.createdAt || p.created || this._paymentStartedAt || null;
    if (!createdAt) return this.PAYMENT_LIFETIME_MS;
    var ms = (typeof createdAt === 'string') ? (new Date(createdAt)).getTime() : (createdAt instanceof Date ? createdAt.getTime() : Number(createdAt));
    if (!ms || isNaN(ms)) return this.PAYMENT_LIFETIME_MS;
    var remain = this.PAYMENT_LIFETIME_MS - (Date.now() - ms);
    return Math.max(0, remain);
  },

  setCurrentPayment(payData, kind) {
    if (!payData) {
      this.currentPayment = null;
      this._paymentStartedAt = null;
      this.stopPaymentPolling();
      try { this._persistCurrentPayment(); } catch(_) {}
      return;
    }
    if (!this._paymentStartedAt || !payData._reused) this._paymentStartedAt = Date.now();
    payData.status = String(payData.status || 'waiting').toLowerCase();
    if (kind) payData.kind = kind;
    this.currentPayment = payData;
    try { this._persistCurrentPayment(); } catch(_) {}
  },

  stopPaymentPolling() {
    if (this._paymentPollTimer) { try { clearInterval(this._paymentPollTimer); } catch(_) {} this._paymentPollTimer = null; }
  },

  startPaymentPolling(onChangeCb) {
    var self = this;
    this.stopPaymentPolling();
    this._paymentPollTimer = setInterval(async function(){
      if (!self.hasOpenPayment()) { self.stopPaymentPolling(); return; }
      try {
        var pay = self.currentPayment; if (!pay || !pay.payment_id) return;
        var raw = await fetch('/api/np-payment-status/' + encodeURIComponent(String(pay.payment_id)), { method: 'GET', headers: { 'Accept': 'application/json' } });
        var j = await raw.json().catch(function(){ return {}; });
        if (j && (j.ok === true || j.data)) {
          var d = j.data || j;
          var newSt = String(d.status || pay.status || 'waiting').toLowerCase();
          var changed = (newSt !== pay.status) || (d.pay_amount && Number(d.pay_amount) !== Number(pay.pay_amount)) || (d.pay_address && String(d.pay_address) !== String(pay.pay_address));
          if (newSt === 'finished' || newSt === 'confirmed' || newSt === 'paid' || newSt === 'success') {
            self.stopPaymentPolling();
            try { self.setCurrentPayment(null); } catch(_) {}
            try { if (typeof onChangeCb === 'function') onChangeCb('finished', d, pay); } catch(_) {}
            return;
          }
          if (newSt === 'expired' || newSt === 'cancelled' || newSt === 'canceled' || newSt === 'refunded' || newSt === 'closed') {
            pay.status = newSt;
            self.currentPayment = pay;
            try { self._persistCurrentPayment(); } catch(_) {}
            self.stopPaymentPolling();
            try { if (typeof onChangeCb === 'function') onChangeCb(newSt, d, pay); } catch(_) {}
            if (typeof Router !== 'undefined') Router.refreshCurrentView();
            return;
          }
          if (changed) {
            Object.assign(pay, d);
            pay.status = newSt;
            self.currentPayment = pay;
            try { self._persistCurrentPayment(); } catch(_) {}
            try { if (typeof onChangeCb === 'function') onChangeCb('updated', d, pay); } catch(_) {}
            if (typeof Router !== 'undefined') Router.refreshCurrentView();
          }
        }
      } catch(_pollErr) {}
    }, 5000);
  },

  isValidEvmAddress(addr) {
    try {
      if (!addr || typeof addr !== 'string') return false;
      const s = addr.trim();
      if (!/^0x[a-fA-F0-9]{40}$/.test(s)) return false;
      return true;
    } catch (e) { return false; }
  },

  isValidTronAddress(addr) {
    try {
      if (!addr || typeof addr !== 'string') return false;
      const s = addr.trim();
      return /^T[a-zA-Z0-9]{33}$/.test(s);
    } catch (e) { return false; }
  },

  projectSettings: {
    entryAmount: 10,
    currency: 'USDT',
    network: 'BEP20',
    sponsorPercentage: 50,
    projectFundPercentage: 40,
    totalDistributedPercentage: 60,
    teamCommissionPercents: [50, 2.5, 2.5, 2.5, 2.5],
    depositAddress: '',
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
    try {
      if (!this.treeLevels || !this.treeLevels.length) {
        try { this.refreshTreeNetwork(); } catch(_) {}
      }
    } catch(e) {
      this.treeLevels = [];
    }
  },

  async refreshTreeNetwork() {
    try {
      if (!this.isAuthenticated || !this.currentUser || !this.currentUser.id) {
        this.treeLevels = [];
        this.treeNodes = [];
        return false;
      }
      var me = String(this.currentUser.id || '').toLowerCase();
      var sb = this._sb();
      if (!sb) { this.treeLevels = []; return false; }

      var levels = [];
      for (var ln = 1; ln <= 12; ln++) {
        levels.push({
          level: ln,
          name: 'Nível ' + (ln < 10 ? '0' + ln : String(ln)),
          expanded: (ln <= 4),
          positions: []
        });
      }

      function pushNode(profile, relLevel) {
        if (relLevel < 1 || relLevel > 12) return;
        var lvl = levels[relLevel - 1];
        if (!lvl) return;
        var posNum = '-';
        try {
          if (profile.position_index) posNum = '#' + profile.position_index;
          else if (profile.position_code) posNum = String(profile.position_code);
          else if (profile.line_row && profile.line_seat) posNum = '#' + profile.line_row + '-' + profile.line_seat;
        } catch(_) {}
        var dt = '';
        try {
          if (profile.created_at) dt = new Date(profile.created_at).toLocaleDateString('pt-PT');
        } catch(_) {}
        var st = String(profile.status || 'PENDING').toUpperCase();
        if (st === 'ACTIVE' || st === 'PENDING' || st === 'BANNED' || st === 'SUSPENDED') {} else st = 'PENDING';
        lvl.positions.push({
          username: profile.username || 'user',
          status: st,
          level: relLevel,
          positionNumber: posNum,
          entryDate: dt || '-',
          isSelf: false
        });
      }

      var allRows = [];
      var byParent = {};
      var usedFallback = 'fb1_direct_profiles';

      try {
        var rAll = await sb.from('profiles')
          .select('id, username, full_name, status, level_number, created_at, position_index, line_row, line_seat, upline_id')
          .not('upline_id', 'is', null)
          .order('created_at', { ascending: true });
        if (rAll && Array.isArray(rAll.data)) allRows = rAll.data;
        try { console.log('[refreshTreeNetwork][fb1_direct_profiles] rows carregadas:', allRows.length); } catch(_) {}
      } catch(_eTr) {
        allRows = [];
        try { console.log('[refreshTreeNetwork][fb1_direct_profiles] FALHOU (RLS provavelmente):', _eTr && _eTr.message ? _eTr.message : String(_eTr)); } catch(_) {}
      }

      if (allRows.length > 0) {
        for (var i = 0; i < allRows.length; i++) {
          var r = allRows[i];
          var pid = String(r.upline_id || '').toLowerCase();
          if (!pid) continue;
          if (!byParent[pid]) byParent[pid] = [];
          byParent[pid].push(r);
        }
        var fb1TotalChildren = (byParent[me] || []).length;
        try { console.log('[refreshTreeNetwork][fb1_direct_profiles] filhos diretos de @me:', fb1TotalChildren); } catch(_) {}
      }

      var directReferralsCount = 0;
      try {
        if (this.referrals && this.referrals.direct && Array.isArray(this.referrals.direct)) {
          directReferralsCount = this.referrals.direct.length;
        }
      } catch(_) {}

      if (allRows.length === 0 || (directReferralsCount > 0 && (byParent[me] || []).length < directReferralsCount)) {
        usedFallback = 'fb2_rpc_bfs_get_my_direct_referrals';
        try { console.log('[refreshTreeNetwork][fb2_rpc_bfs] INICIANDO BFS via RPC get_my_direct_referrals (SECURITY DEFINER bypass RLS)'); } catch(_) {}
        allRows = [];
        byParent = {};
        var visitedIds = new Set([me]);
        var currentLevelIds = [me];
        for (var bfsDepth = 1; bfsDepth <= 12; bfsDepth++) {
          var nextLevelIds = [];
          for (var bfsJ = 0; bfsJ < currentLevelIds.length; bfsJ++) {
            var cid = currentLevelIds[bfsJ];
            var nodeChildren = [];
            try {
              var rpcRes = await sb.rpc('get_my_direct_referrals', { me: cid });
              if (rpcRes && Array.isArray(rpcRes.data)) {
                nodeChildren = rpcRes.data;
              } else if (Array.isArray(rpcRes)) {
                nodeChildren = rpcRes;
              }
            } catch(_rpcErr) {
              nodeChildren = [];
              try { console.log('[refreshTreeNetwork][fb2_rpc_bfs] ERRO RPC nó', cid, ':', _rpcErr && _rpcErr.message ? _rpcErr.message : String(_rpcErr)); } catch(_) {}
            }
            try { console.log('[refreshTreeNetwork][fb2_rpc_bfs] nível', bfsDepth, 'nó', cid, '→ filhos:', nodeChildren.length); } catch(_) {}
            if (!byParent[cid]) byParent[cid] = [];
            for (var bfsK = 0; bfsK < nodeChildren.length; bfsK++) {
              var ch = nodeChildren[bfsK];
              var chid = String(ch.id || '').toLowerCase();
              if (!chid || visitedIds.has(chid)) continue;
              visitedIds.add(chid);
              ch.upline_id = cid;
              byParent[cid].push(ch);
              allRows.push(ch);
              nextLevelIds.push(chid);
            }
          }
          currentLevelIds = nextLevelIds;
          if (!currentLevelIds.length) break;
        }
      }

      var totalFilhos = (byParent[me] || []).length;
      if (totalFilhos === 0 && directReferralsCount > 0) {
        usedFallback = 'fb3_referrals_direct_fallback';
        try { console.log('[refreshTreeNetwork][fb3_referrals_direct] USANDO AppState.referrals.direct (já carregado:', directReferralsCount, ')'); } catch(_) {}
        try {
          if (this.referrals && this.referrals.direct && Array.isArray(this.referrals.direct)) {
            byParent[me] = [];
            for (var f3 = 0; f3 < this.referrals.direct.length; f3++) {
              var ref = this.referrals.direct[f3];
              var rid = String(ref.id || '').toLowerCase();
              if (!rid || rid === me) continue;
              ref.upline_id = me;
              byParent[me].push(ref);
              allRows.push(ref);
            }
          }
        } catch(_e3) {}
      }

      var currentIds = [me];
      for (var depth = 1; depth <= 12; depth++) {
        var relLevel = depth;
        var nextIds = [];
        for (var j = 0; j < currentIds.length; j++) {
          var cid2 = currentIds[j];
          var children = byParent[cid2] || [];
          for (var k = 0; k < children.length; k++) {
            var ch2 = children[k];
            var chid2 = String(ch2.id || '').toLowerCase();
            if (chid2 === me) continue;
            pushNode(ch2, relLevel);
            nextIds.push(chid2);
          }
        }
        currentIds = nextIds;
        if (!currentIds.length) break;
      }

      var totalPositions = 0;
      for (var lc = 0; lc < levels.length; lc++) totalPositions += levels[lc].positions.length;

      this.treeLevels = levels;
      this.treeNodes = allRows;

      try { console.log('[refreshTreeNetwork] FINALIZADO | fallback usado:', usedFallback, '| total nós carregados:', allRows.length, '| total posições na árvore:', totalPositions); } catch(_) {}
      try {
        if (typeof window !== 'undefined') {
          window._treeReady = true;
          window._treeLoadedAt = Date.now();
          if (window.TreeEngine && typeof window.TreeEngine.render === 'function') {
            var viewport = document.getElementById('tree-viewport');
            if (viewport) {
              try { window.TreeEngine.render(); } catch(_eRd) {}
            }
          }
        }
      } catch(_eEvt) {}
      return true;
    } catch(e) {
      try { console.log('[refreshTreeNetwork] ERRO FATAL:', e && e.message ? e.message : String(e)); } catch(_) {}
      this.treeLevels = [];
      this.treeNodes = [];
      return false;
    }
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

  _notifStorageKey() {
    const uid = (this.currentUser && this.currentUser.id) ? this.currentUser.id : 'guest';
    return 'fh_notifs_' + String(uid).replace(/[^a-zA-Z0-9]/g, '_');
  },

  _refreshNotifBadge() {
    try {
      const badge = document.getElementById('notif-badge');
      if (!badge) return;
      const unread = this.notifications.filter(n => !n.read).length;
      if (unread <= 0) {
        badge.textContent = '0';
        badge.classList.add('hidden');
      } else {
        badge.textContent = String(unread > 99 ? '99+' : unread);
        badge.classList.remove('hidden');
      }
    } catch(e) {}
  },

  _persistNotifications() {
    try {
      const key = this._notifStorageKey();
      localStorage.setItem(key, JSON.stringify(this.notifications || []));
    } catch(e) {}
  },

  _loadNotificationsFromStorage() {
    try {
      const key = this._notifStorageKey();
      const raw = localStorage.getItem(key);
      if (raw && raw.length > 2) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) this.notifications = arr;
      }
    } catch(e) { this.notifications = this.notifications || []; }
    this._refreshNotifBadge();
  },

  pushNotification(title, message, opts) {
    opts = opts || {};
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const notif = {
      id: opts.id || ('n_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*1e6).toString(36)),
      title: String(title || 'Notificação').toString(),
      message: String(message || '').toString(),
      icon: opts.icon || '',
      type: opts.type || 'info',
      time: (opts.time && opts.time.length) ? opts.time : (hh + ':' + mm),
      read: false,
      createdAt: opts.createdAt || now.toISOString()
    };
    this.notifications = this.notifications || [];
    this.notifications.unshift(notif);
    if (this.notifications.length > 200) this.notifications.length = 200;
    this._persistNotifications();
    this._refreshNotifBadge();
    try { if (UI && typeof UI.renderNotificationList === 'function') UI.renderNotificationList(); } catch(e) {}
    return notif;
  },

  clearNotifications() {
    this.notifications.forEach(n => n.read = true);
    this._persistNotifications();
    this._refreshNotifBadge();
    try { UI.renderNotificationList(); } catch(e) {}
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
      this.currentUser.id = this.currentUser.id || userAuth.id;
      var oldStatus = String(this.currentUser.status || 'GUEST').toUpperCase();
      this._loadNotificationsFromStorage();

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
        this.isAdmin = true;
        this.userRole = 'admin';
        this.currentUser.role = 'superadmin';
        this.currentUser.status = 'ACTIVE';
        this.currentUser.username = '4hashprotocol';
        this.currentUser.fullName = 'Four Hash';
        if (!this.currentUser.level || this.currentUser.level <= 0) this.currentUser.level = 1;
        if (!this.currentUser.positionNumber || this.currentUser.positionNumber === '-' || this.currentUser.positionNumber === '') this.currentUser.positionNumber = '#1';
        this.currentUser.sponsor = '';
        try {
          if (!this.sbProfile || typeof this.sbProfile !== 'object') this.sbProfile = {};
          this.sbProfile.role = 'superadmin';
          this.sbProfile.status = 'ACTIVE';
          this.sbProfile.kyc_status = 'verified';
        } catch(_sb) {}
      }

      try {
        var w = await sb.from('wallets').select('*').eq('profile_id', userAuth.id).limit(1).maybeSingle();
        if (w && w.data) {
          var rawAvailable = Number(w.data.available_balance || 0);
          var rawPending   = Number(w.data.pending_balance   || 0);
          var dep = Number(w.data.total_deposited || 0);
          var bT = Number(w.data.total_bonus_team || 0);
          var bM = Number(w.data.total_bonus_matrix || 0);
          var wT = Number(w.data.total_withdrawn  || 0);

          var totalBonusEarned = bT + bM;
          var bonusWithdrawn   = Math.min(wT, totalBonusEarned);
          var bonusNetAvail    = Math.max(0, totalBonusEarned - bonusWithdrawn);

          this.currentUser.blockedActivationBalance = dep;
          this.currentUser.availableBalance = bonusNetAvail;
          this.currentUser.pendingBonusBalance = rawPending;
          this.currentUser.pendingBalance = rawPending;
          this.currentUser.totalDeposited    = dep;
          this.currentUser.totalBonusTeam    = bT;
          this.currentUser.totalBonusMatrix  = bM;
          this.currentUser.totalBonusReceived = totalBonusEarned;
          this.currentUser.totalBonusNet = bonusNetAvail;
          this.currentUser.totalReceived    = dep + totalBonusEarned;
          this.currentUser.totalWithdrawn   = wT;
        } else {
          this.currentUser.blockedActivationBalance = this.currentUser.blockedActivationBalance || 0;
          this.currentUser.availableBalance = this.currentUser.availableBalance || 0;
          this.currentUser.pendingBonusBalance = this.currentUser.pendingBonusBalance || 0;
          this.currentUser.pendingBalance   = this.currentUser.pendingBalance || 0;
          this.currentUser.totalDeposited   = this.currentUser.totalDeposited   || 0;
          this.currentUser.totalBonusTeam   = this.currentUser.totalBonusTeam   || 0;
          this.currentUser.totalBonusMatrix = this.currentUser.totalBonusMatrix || 0;
          this.currentUser.totalBonusReceived = this.currentUser.totalBonusReceived || 0;
          this.currentUser.totalBonusNet = this.currentUser.totalBonusNet || 0;
          this.currentUser.totalReceived    = this.currentUser.totalReceived    || 0;
          this.currentUser.totalWithdrawn   = this.currentUser.totalWithdrawn   || 0;
        }
      } catch(eWallet) {}

      try {
        var newStatus = String(this.currentUser.status || 'PENDING').toUpperCase();
        if ((oldStatus !== 'ACTIVE') && (newStatus === 'ACTIVE')) {
          var pos = this.currentUser.positionNumber || '#';
          var bal = Number(this.currentUser.availableBalance || 0).toFixed(2);
          try {
            this.pushNotification(
              '🎉 Conta ativada!',
              'A sua posição Linear ' + pos + ' foi garantida. Dashboard, Carteira e Árvore desbloqueados.',
              { type: 'success', icon: 'fa-circle-check' }
            );
          } catch(_e1) {}
          if (bal && Number(bal) > 0) {
            try {
              this.pushNotification(
                '💸 Depósito confirmado!',
                'USD ' + bal + ' foram creditados no seu saldo disponível.',
                { type: 'success', icon: 'fa-wallet' }
              );
            } catch(_e2) {}
          }
        }
      } catch(_eTrans) {}

      try { await this.refreshReferrals(); } catch(_eRef) {}

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
          entryDate: '', blockedActivationBalance: 0, availableBalance: 0, pendingBonusBalance: 0, pendingBalance: 0,
          totalDeposited: 0, totalBonusTeam: 0, totalBonusMatrix: 0, totalBonusReceived: 0, totalBonusNet: 0,
          totalReceived: 0, totalWithdrawn: 0,
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
        this.refreshAdminUsersList(),
        this.refreshReferrals(),
        this.refreshTreeNetwork(),
        this.refreshBonusNotifications(),
        this.npReconcilePendingPayments({ force: false })
      ]);
      return true;
    } catch (e) {
      this.sbError = (e && e.message) ? e.message : String(e);
      return false;
    }
  },

  async refreshBonusNotifications() {
    try {
      if (!this.isAuthenticated || !this.currentUser || !this.currentUser.id) return false;
      if (!window.SupabaseOK || !window.SupabaseOK()) return false;
      var sb = this._sb(); if (!sb) return false;
      var me = this.currentUser.id;

      var bonusRows = [];
      try {
        var r = await sb.from('transactions')
          .select('id, kind, amount, status, level_reference, created_at, note, related_profile_id, related:related_profile_id(username,full_name)')
          .eq('profile_id', me)
          .in('kind', ['bonus_sponsor','bonus_level2','bonus_level3','bonus_level4','bonus_level5','bonus_matrix','bonus_team'])
          .eq('status', 'confirmed')
          .order('created_at', { ascending: false })
          .limit(100);
        if (r && Array.isArray(r.data)) bonusRows = r.data;
      } catch(_bt) {
        try {
          var r2 = await sb.from('transactions')
            .select('id, kind, amount, status, level_reference, created_at, note, related_profile_id')
            .eq('profile_id', me)
            .in('kind', ['bonus_sponsor','bonus_level2','bonus_level3','bonus_level4','bonus_level5','bonus_matrix','bonus_team'])
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(100);
          if (r2 && Array.isArray(r2.data)) bonusRows = r2.data;
        } catch(_bt2) { bonusRows = []; }
      }

      if (!bonusRows || bonusRows.length === 0) return true;

      var self = this;
      var titlesUsados = {};
      (this.notifications || []).forEach(function(n){
        if (n && n.title) titlesUsados[String(n.title)] = true;
      });

      bonusRows.forEach(function(tx){
        try {
          var amt  = Number(tx.amount || 0).toFixed(2);
          if (!(amt && Number(amt) > 0)) return;
          var nivel = tx.level_reference || 0;
          var labelNivel = '';
          var k = String(tx.kind || '').toLowerCase();
          if (k === 'bonus_sponsor' || nivel === 1) { labelNivel = 'Nível 1'; nivel = 1; }
          else if (k === 'bonus_level2' || nivel === 2) labelNivel = 'Nível 2';
          else if (k === 'bonus_level3' || nivel === 3) labelNivel = 'Nível 3';
          else if (k === 'bonus_level4' || nivel === 4) labelNivel = 'Nível 4';
          else if (k === 'bonus_level5' || nivel === 5) labelNivel = 'Nível 5';
          else if (k === 'bonus_matrix') labelNivel = 'Matrix';
          else labelNivel = 'Rede';

          var ativadorNome = '';
          if (tx && tx.related && typeof tx.related === 'object' && (tx.related.username || tx.related.full_name)) {
            ativadorNome = tx.related.username || tx.related.full_name || '';
          } else if (tx && tx._raw && tx._raw.related_username) {
            ativadorNome = tx._raw.related_username;
          }
          if (!ativadorNome && tx.note) {
            try {
              var m = (tx.note || '').match(/@([a-zA-Z0-9_\-]+)/);
              if (m && m[1]) ativadorNome = m[1];
            } catch(_mm) {}
          }
          if (ativadorNome) ativadorNome = String(ativadorNome).replace(/^@+/, '');

          var title = '💰 Bônus ' + labelNivel + ' recebido · $' + amt;
          if (titlesUsados[String(title)]) return;

          var msg = 'Ganhou $' + amt + ' USD de bônus ' + labelNivel + ' pela ativação';
          if (ativadorNome) msg += ' de @' + ativadorNome;
          msg += '.';
          if (tx.note) msg = tx.note;

          var icon = 'fa-gem';
          if (nivel === 1) icon = 'fa-user-check';
          else if (k === 'bonus_matrix') icon = 'fa-sitemap';

          var opts = {
            type: 'success',
            icon: icon,
            createdAt: tx.created_at || null,
            tx_id: tx.id || null
          };
          self.pushNotification(title, msg, opts);
          titlesUsados[String(title)] = true;
        } catch(_itx) {}
      });

      try {
        var rNotif = await sb.from('notifications')
          .select('id, title, message, type, icon, read, created_at, tx_id, related_profile_id')
          .eq('profile_id', me)
          .order('created_at', { ascending: false })
          .limit(100);
        if (rNotif && Array.isArray(rNotif.data)) {
          rNotif.data.forEach(function(n){
            try {
              if (!n || !n.title) return;
              var key = 'SB#' + String(n.id || n.title);
              if (titlesUsados[key]) return;
              var msg2 = n.message || '';
              if (titlesUsados[String(n.title)] && !msg2) return;
              var opts2 = {
                type: n.type || 'info',
                icon: n.icon || 'fa-bell',
                createdAt: n.created_at || null,
                tx_id: n.tx_id || null,
                sb_notification_id: n.id || null
              };
              self.pushNotification(n.title, msg2, opts2);
              titlesUsados[key] = true;
            } catch(_in2) {}
          });
        }
      } catch(_nr) {}

      return true;
    } catch(e) {
      try { console.log('[bonus-notif] erro:', (e && e.message) ? e.message : String(e)); } catch(_) {}
      return false;
    }
  },

  async refreshAdminUsersList() {
    if (!window.SupabaseOK || !window.SupabaseOK()) { this.adminUsersList = []; return false; }
    try {
      var sb = this._sb(); if (!sb) { this.adminUsersList = []; return false; }
      var rows = [];
      var walletByPid = {};
      try {
        var rRpc = await sb.rpc('admin_get_all_profiles');
        if (rRpc && Array.isArray(rRpc.data) && rRpc.data.length > 1) {
          rows = rRpc.data;
          try {
            var rWRpc = await sb.rpc('admin_get_all_wallets');
            if (rWRpc && Array.isArray(rWRpc.data) && rWRpc.data.length) {
              rWRpc.data.forEach(function(w){ walletByPid[w.profile_id] = w; });
            }
          } catch(_wrpcErr){}
        }
      } catch(_rpcErr){
        console.log('[ADMIN-RPC] admin_get_all_profiles falhou (ainda não aplicou migration 013?): fallback direct select. ' + ((_rpcErr && (_rpcErr.message || _rpcErr.code)) || String(_rpcErr)));
      }
      if (!rows || rows.length <= 1) {
        var r = await sb.from('profiles').select('id, username, full_name, email, country, phone, upline_username, sponsor_code, level_number, position_index, line_row, line_seat, role, status, kyc_status, created_at').order('created_at', { ascending: false });
        rows = (r && r.data) ? r.data : [];
        var pids = rows.map(function(p){ return p.id; }).filter(Boolean);
        if (pids.length > 0 && Object.keys(walletByPid).length === 0) {
          try {
            var rW = await sb.from('wallets').select('profile_id, available_balance, pending_balance, frozen_balance, total_deposited, total_withdrawn, total_bonus_team').in('profile_id', pids);
            if (rW && rW.data && rW.data.length) {
              rW.data.forEach(function(w){ walletByPid[w.profile_id] = w; });
            }
          } catch(_wErr){}
        }
      }
      this.adminUsersList = rows.map(function(p){
        var full = (p.full_name || '').toString().trim();
        var pos = '';
        if (p.position_index) pos = '#' + p.position_index;
        else if (p.line_row && p.line_seat) pos = '#' + p.line_row + '-' + p.line_seat;
        else pos = '-';
        var lvl = Number(p.level_number || 0);
        var w = walletByPid[p.id] || {};
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
          createdAt: p.created_at || '',
          wallet: {
            available_balance: Number(w.available_balance || 0),
            pending_balance: Number(w.pending_balance || 0),
            frozen_balance: Number(w.frozen_balance || 0),
            total_deposited: Number(w.total_deposited || 0),
            total_withdrawn: Number(w.total_withdrawn || 0),
            total_bonus_team: Number(w.total_bonus_team || 0)
          }
        };
      });
      return true;
    } catch (e) {
      this.sbError = 'admin-users: ' + ((e && e.message) || String(e));
      this.adminUsersList = [];
      return false;
    }
  },

  async adminActivateUser(profileIdOrUsername) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Conecte-se primeiro.', 'warning'); return false; }
    try {
      var sb = this._sb(); if (!sb) return false;
      var where = (typeof profileIdOrUsername === 'string' && profileIdOrUsername.indexOf('-') < 0 && profileIdOrUsername.indexOf('@') < 0) ? { id: profileIdOrUsername } : null;
      if (!where) {
        var q = sb.from('profiles').select('id').or('id.eq.' + profileIdOrUsername + ',username.ilike.%25' + String(profileIdOrUsername).replace(/^@/,'') + '%25').limit(1).maybeSingle();
        var r = await q;
        if (!r || !r.data) { UI.showToast('Usuário não encontrado.', 'warning'); return false; }
        where = { id: r.data.id };
      }
      await sb.from('profiles').update({ status: 'ACTIVE', updated_at: new Date().toISOString() }).eq('id', where.id);
      try {
        var updLevel = await sb.from('profiles').select('level_number').eq('id', where.id).limit(1).maybeSingle();
        if (updLevel && updLevel.data && (!updLevel.data.level_number || Number(updLevel.data.level_number) < 1)) {
          await sb.from('profiles').update({ level_number: 1 }).eq('id', where.id);
        }
      } catch(_lErr){}
      UI.showToast('Usuário ativado com sucesso.', 'success');
      await this.refreshAdminUsersList();
      await this.refreshAdminSummaries();
      if (typeof Router !== 'undefined') Router.refresh();
      return true;
    } catch (e) {
      UI.showToast((e && e.message) || 'Erro ativar usuário', 'error');
      return false;
    }
  },

  async adminDeactivateUser(profileIdOrUsername) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Conecte-se primeiro.', 'warning'); return false; }
    try {
      var sb = this._sb(); if (!sb) return false;
      var r = await sb.from('profiles').select('id').or('id.eq.' + profileIdOrUsername + ',username.ilike.%25' + String(profileIdOrUsername).replace(/^@/,'') + '%25').limit(1).maybeSingle();
      if (!r || !r.data) { UI.showToast('Usuário não encontrado.', 'warning'); return false; }
      await sb.from('profiles').update({ status: 'INACTIVE', updated_at: new Date().toISOString() }).eq('id', r.data.id);
      UI.showToast('Usuário marcado inativo.', 'success');
      await this.refreshAdminUsersList();
      await this.refreshAdminSummaries();
      if (typeof Router !== 'undefined') Router.refresh();
      return true;
    } catch (e) {
      UI.showToast((e && e.message) || 'Erro desativar usuário', 'error');
      return false;
    }
  },

  _formatDDMM(dateOrStr) {
    try {
      var d = (dateOrStr instanceof Date) ? dateOrStr : new Date(dateOrStr);
      if (!d || isNaN(d.getTime())) return String(dateOrStr || '');
      var dd = String(d.getDate()).padStart(2, '0');
      var mm = String(d.getMonth() + 1).padStart(2, '0');
      return dd + '/' + mm;
    } catch(e) { return String(dateOrStr || ''); }
  },

  _mapTicket(row) {
    if (!row) return null;
    return {
      id: ('TK-' + String(row.id).padStart(5, '0')),
      ticket_id: row.id,
      username: (row.username || row.profile_id || '').toString(),
      email: (row.email || '').toString(),
      subject: row.title || row.subject || '(sem assunto)',
      message: row.message || (Array.isArray(row.messages) && row.messages.length ? row.messages[0].text : ''),
      category: row.category || 'Outro',
      priority: row.priority || 'Média',
      status: row.status || 'Aberto',
      date: this._formatDDMM(row.created_at || row.createdAt || new Date()),
      dateFull: (row.created_at || row.createdAt || ''),
      created: row.created_at ? new Date(row.created_at) : new Date(),
      createdAt: row.created_at ? row.created_at : '',
      created_at: row.created_at,
      assignedTo: row.assigned_to,
      closedBy: row.closed_at ? 'Admin' : '',
      closedAt: row.closed_at,
      lastReplyAt: row.last_reply_at,
      internalTags: [],
      privateNote: '',
      viewCount: 0,
      replies: Array.isArray(row.messages) ? row.messages.map(function(m){ return { id: m.id||Date.now(), author: m.author_name || (m.is_admin ? 'Admin' : 'Utilizador'), authorRole: m.author_role || (m.is_admin ? 'admin' : 'user'), isAdmin: !!m.is_admin, isInternal: !!m.is_internal, message: m.text || m.message || '', createdAt: m.created_at }; }) : []
    };
  },

  _mapFinance(row) {
    if (!row) return null;
    var openedDDMM = this._formatDDMM(row.opened_at || row.created_at);
    return {
      id: ('FP-' + String(row.id).padStart(5, '0')),
      code: ('FP-' + String(row.id).padStart(5, '0')),
      fin_id: row.id,
      type: row.type || 'Depósito',
      category: row.category || row.type || '',
      username: (row.username || row.profile_id || '').toString(),
      email: (row.email || '').toString(),
      amount: Number(row.amount || 0),
      expected: Number(row.expected || 0),
      currency: row.currency || 'USDT',
      network: row.network || 'BEP20',
      txHash: row.tx_hash || '',
      nowpaymentsId: row.nowpayments_id || '',
      status: row.status || 'Pendente Revisão',
      priority: (row.status && row.status.indexOf('Análise') >= 0) ? 'Alta' : 'Normal',
      opened: openedDDMM,
      openedAt: row.opened_at || row.created_at || '',
      assignedTo: row.resolved_by,
      resolution: (Array.isArray(row.notes) && row.notes.length ? row.notes[row.notes.length - 1].text : '') || row.private_note || '',
      resolvedBy: row.resolved_by,
      resolvedAt: row.resolved_at,
      finalDecision: '',
      finalObservation: row.private_note || '',
      signatureName: '',
      signatureTime: '',
      creditWallet: false,
      adjustedAmount: 0,
      internalTags: [],
      privateNote: row.private_note || '',
      notes: Array.isArray(row.notes) ? row.notes : []
    };
  },

  async refreshSupportTickets() {
    if (!window.SupabaseOK || !window.SupabaseOK()) return false;
    try {
      var sb = this._sb(); if (!sb) return false;
      var rowsRaw = null;

      try {
        var rRpc = await sb.rpc('admin_get_all_support_tickets');
        if (rRpc && Array.isArray(rRpc.data) && rRpc.data.length) {
          rowsRaw = rRpc.data.slice().sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); });
        }
      } catch (eRpc) { /* fallback direto abaixo */ }

      if (!rowsRaw) {
        var q = sb.from('support_tickets').select('*').order('created_at', { ascending: false });
        var r = await q;
        if (r && r.data && r.data.length) rowsRaw = r.data;
      }

      if (!rowsRaw || !rowsRaw.length) { this.supportTickets = []; return false; }
      var rows = rowsRaw.map(this._mapTicket.bind(this)).filter(Boolean);
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
      var rowsRaw = null;

      try {
        var rRpc = await sb.rpc('admin_get_all_finance_problems');
        if (rRpc && Array.isArray(rRpc.data) && rRpc.data.length) {
          rowsRaw = rRpc.data.slice().sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); });
        }
      } catch (eRpc) { /* fallback direto abaixo */ }

      if (!rowsRaw) {
        var r = await sb.from('finance_problems').select('*').order('created_at', { ascending: false });
        if (r && r.data && r.data.length) rowsRaw = r.data;
      }

      if (!rowsRaw || !rowsRaw.length) { this.financeProblems = []; return false; }
      var rows = rowsRaw.map(this._mapFinance.bind(this)).filter(Boolean);
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
      var projectSettingsRows = null;
      var legacyRows = null;
      try {
        var rPs = await sb.from('project_settings').select('*').limit(1).maybeSingle();
        if (rPs && rPs.data) projectSettingsRows = rPs.data;
      } catch(_psErr) {}
      try {
        var rSs = await sb.from('system_settings').select('*').limit(1).maybeSingle();
        if (rSs && rSs.data) legacyRows = rSs.data;
      } catch(_ssErr) {}
      var d = Object.assign({}, (legacyRows||{}), (projectSettingsRows||{}));
      if (Object.keys(d).length > 0) {
        if (typeof d.entry_amount === 'number' || typeof d.entry_amount === 'string') this.projectSettings.entryAmount = Number(d.entry_amount);
        if (typeof d.currency === 'string') this.projectSettings.currency = d.currency;
        if (typeof d.network === 'string') this.projectSettings.network = d.network;
        var n1 = d.sponsor_percentage; if (typeof n1 !== 'number' && typeof n1 !== 'string') n1 = d.team_percent_n1;
        var n2 = d.level2_percentage;  if (typeof n2 !== 'number' && typeof n2 !== 'string') n2 = d.team_percent_n2;
        var n3 = d.level3_percentage;  if (typeof n3 !== 'number' && typeof n3 !== 'string') n3 = d.team_percent_n3;
        var n4 = d.level4_percentage;  if (typeof n4 !== 'number' && typeof n4 !== 'string') n4 = d.team_percent_n4;
        var n5 = d.level5_percentage;  if (typeof n5 !== 'number' && typeof n5 !== 'string') n5 = d.team_percent_n5;
        var fp = d.fund_percentage; if (typeof fp !== 'number' && typeof fp !== 'string') fp = d.project_fund_percentage;
        var tp = d.team_total_percentage; if (typeof tp !== 'number' && typeof tp !== 'string') tp = d.total_distributed_percentage;
        var va = d.treasury_wallet; if (typeof va !== 'string') va = d.vault_address;
        if (typeof n1 === 'number' || typeof n1 === 'string') this.projectSettings.teamCommissionPercents[0] = Number(n1);
        if (typeof n2 === 'number' || typeof n2 === 'string') this.projectSettings.teamCommissionPercents[1] = Number(n2);
        if (typeof n3 === 'number' || typeof n3 === 'string') this.projectSettings.teamCommissionPercents[2] = Number(n3);
        if (typeof n4 === 'number' || typeof n4 === 'string') this.projectSettings.teamCommissionPercents[3] = Number(n4);
        if (typeof n5 === 'number' || typeof n5 === 'string') this.projectSettings.teamCommissionPercents[4] = Number(n5);
        if (typeof fp === 'number' || typeof fp === 'string') this.projectSettings.projectFundPercentage = Number(fp);
        if (typeof tp === 'number' || typeof tp === 'string') this.projectSettings.totalDistributedPercentage = Number(tp);
        if (typeof va === 'string') this.projectSettings.depositAddress = va;
        if (typeof d.presale_end_date !== 'undefined' && d.presale_end_date !== null) this.projectSettings.presaleEndDate = d.presale_end_date;
        var wm = d.min_withdrawal_usdt; if (typeof wm !== 'number' && typeof wm !== 'string') wm = d.withdraw_min;
        var wf = d.withdrawal_fee_bp; if (typeof wf !== 'number' && typeof wf !== 'string') wf = d.withdraw_fee_flat;
        if (typeof wm === 'number' || typeof wm === 'string') this.projectSettings.withdraw.minAmount = Number(wm);
        if (typeof d.withdraw_max === 'number' || typeof d.withdraw_max === 'string') this.projectSettings.withdraw.maxAmountPerRequest = Number(d.withdraw_max);
        if (typeof wf === 'number' || typeof wf === 'string') this.projectSettings.withdraw.networkFeeFlat = (Number(wf) / 100);
        if (typeof d.withdraw_hours === 'number' || typeof d.withdraw_hours === 'string') this.projectSettings.withdraw.processingHours = Number(d.withdraw_hours);
      }

      var rpcProfiles = null;
      var rpcWallets = null;
      var rpcStats = null;
      try {
        try { var _rp = await sb.rpc('admin_get_all_profiles'); if (_rp && Array.isArray(_rp.data) && _rp.data.length > 1) rpcProfiles = _rp.data; } catch(_e1){ console.log('[ADMIN-RPC] profiles (013) fallback: ' + ((_e1&&(_e1.message||_e1.code))||String(_e1))); }
        try { var _rw = await sb.rpc('admin_get_all_wallets'); if (_rw && Array.isArray(_rw.data) && _rw.data.length) rpcWallets = _rw.data; } catch(_e2){}
        try { var _rs = await sb.rpc('admin_get_tx_stats'); if (_rs && _rs.data && typeof _rs.data === 'object') rpcStats = _rs.data; } catch(_e3){ console.log('[ADMIN-RPC] tx_stats (013) fallback: ' + ((_e3&&(_e3.message||_e3.code))||String(_e3))); }
      } catch(_rpcBulk) {}

      var totalUsers = 0; var activeUsers = 0; var pendingUsers = 0; var adminUsers = 0; var pctAtivos = 0;
      if (rpcProfiles && rpcProfiles.length) {
        totalUsers = rpcProfiles.length;
        activeUsers = rpcProfiles.filter(function(p){ var s=(p.status||'').toString().toUpperCase(); return s==='ACTIVE' || s==='ATIVO'; }).length;
        pendingUsers = rpcProfiles.filter(function(p){ var s=(p.status||'').toString().toUpperCase(); return s==='PENDING' || s==='PENDENTE'; }).length;
        adminUsers = rpcProfiles.filter(function(p){ return (p.role||'') === 'superadmin' || (p.role||'') === 'admin'; }).length;
        pctAtivos = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 1000) / 10 : 0;
        console.log('[ADMIN-RPC] profiles via 013: total=' + totalUsers + ' active=' + activeUsers + ' pending=' + pendingUsers);
      } else {
        var rProfiles = await sb.from('profiles').select('id, status, role, created_at');
        var rowsProfiles = (rProfiles && rProfiles.data) ? rProfiles.data : [];
        totalUsers = rowsProfiles.length;
        activeUsers = rowsProfiles.filter(function(p){ var s=(p.status||'').toString().toUpperCase(); return s==='ACTIVE' || s==='ATIVO'; }).length;
        pendingUsers = rowsProfiles.filter(function(p){ var s=(p.status||'').toString().toUpperCase(); return s==='PENDING' || s==='PENDENTE'; }).length;
        adminUsers = rowsProfiles.filter(function(p){ return (p.role||'') === 'superadmin' || (p.role||'') === 'admin'; }).length;
        pctAtivos = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 1000) / 10 : 0;
        console.log('[ADMIN-SB] profiles direct fallback: total=' + totalUsers + ' active=' + activeUsers + ' pending=' + pendingUsers);
      }

      var _todayStart = new Date(); _todayStart.setHours(0,0,0,0); var _todayMs = _todayStart.getTime();
      var sumDep = 0; var sumDepOK = 0; var sumWd = 0; var sumWdOK = 0; var sumBonus = 0;
      var todayVolume = 0; var todayCount = 0; var todayDepCount = 0; var todayBonusCount = 0;
      if (rpcStats && typeof rpcStats === 'object') {
        sumDepOK = Number(rpcStats.total_deposited || 0);
        sumBonus = Number(rpcStats.total_bonus_team || 0) + Number(rpcStats.total_bonus_matrix || 0);
        sumDep = sumDepOK;
        sumWdOK = Number(rpcStats.total_withdrawn || 0);
        sumWd = sumWdOK;
        todayVolume = Number(rpcStats.today_volume || 0);
        todayCount = Number(rpcStats.today_tx_count || 0);
        todayDepCount = Number(rpcStats.today_deposit_count || 0);
        todayBonusCount = Number(rpcStats.today_bonus_count || 0);
        console.log('[ADMIN-RPC] tx via 013: depOK=' + sumDepOK + ' bonus=' + sumBonus + ' todayVol=' + todayVolume + ' todayCnt=' + todayCount);
      } else {
        var rTx = null; var rowsTx = [];
        try { rTx = await sb.from('transactions').select('amount, kind, status, created_at, network, currency'); rowsTx = (rTx && rTx.data) ? rTx.data : []; } catch(_txErr) { console.warn('[ADMIN-SB] transactions RLS blocked: ' + ((_txErr && _txErr.message)||String(_txErr))); }
        rowsTx.forEach(function(t){
          var a = Number(t.amount || 0);
          var k = (t.kind || '').toString().toLowerCase();
          var s = (t.status || '').toString().toUpperCase();
          var confirmedTx = (s === 'COMPLETED' || s === 'CONFIRMED' || s === 'SUCCESS' || s === 'FINISHED' || s === 'PAID');
          var isToday = false;
          try {
            var dt = t.created_at;
            if (dt) {
              var tms = (typeof dt === 'string') ? (new Date(dt)).getTime() : ((dt instanceof Date) ? dt.getTime() : Number(dt));
              if (!isNaN(tms) && tms >= _todayMs) isToday = true;
            }
          } catch(_dt) {}
          if (k === 'deposit') { sumDep += a; if (confirmedTx) sumDepOK += a; if (isToday) todayDepCount += 1; }
          else if (k === 'withdrawal' || k === 'withdraw') { sumWd += a; if (confirmedTx) sumWdOK += a; }
          else if (k.indexOf('bonus') >= 0 || k.indexOf('referral') >= 0 || k.indexOf('matrix') >= 0 || k.indexOf('team') >= 0 || k.indexOf('sponsor') >= 0 || k.indexOf('level') >= 0) { sumBonus += a; if (isToday) todayBonusCount += 1; }
          if (confirmedTx) {
            todayCount += 1;
            todayVolume += a;
          }
        });
        console.log('[ADMIN-SB] transactions fallback: dep=' + sumDep + ' depOK=' + sumDepOK + ' bonus=' + sumBonus + ' todayVolume=' + todayVolume + ' todayCount=' + todayCount);
      }

      var totalBalance = 0; var totalDeposited = 0; var totalWithdrawn = 0; var totalBTeam = 0; var totalBMatrix = 0;
      if (rpcWallets && rpcWallets.length) {
        rpcWallets.forEach(function(w){
          totalBalance += Number(w.available_balance || 0);
          totalDeposited += Number(w.total_deposited || 0);
          totalWithdrawn += Number(w.total_withdrawn || 0);
          totalBTeam += Number(w.total_bonus_team || 0);
          totalBMatrix += Number(w.total_bonus_matrix || 0);
        });
        if (rpcStats && typeof rpcStats === 'object') {
          totalDeposited = Math.max(totalDeposited, Number(rpcStats.total_deposited || 0));
          totalWithdrawn = Math.max(totalWithdrawn, Number(rpcStats.total_withdrawn || 0));
          totalBTeam = Math.max(totalBTeam, Number(rpcStats.total_bonus_team || 0));
          totalBMatrix = Math.max(totalBMatrix, Number(rpcStats.total_bonus_matrix || 0));
        }
        console.log('[ADMIN-RPC] wallets via 013: totalDeposited=' + totalDeposited + ' totalBonusTeam=' + totalBTeam + ' balance=' + totalBalance);
      } else {
        var rWallets = null; var rowsW = [];
        try { rWallets = await sb.from('wallets').select('available_balance, pending_balance, frozen_balance, total_deposited, total_withdrawn, total_bonus_team, total_bonus_matrix'); rowsW = (rWallets && rWallets.data) ? rWallets.data : []; } catch(_wErr) { console.warn('[ADMIN-SB] wallets RLS blocked: ' + ((_wErr && _wErr.message)||String(_wErr))); }
        rowsW.forEach(function(w){
          totalBalance += Number(w.available_balance || 0);
          totalDeposited += Number(w.total_deposited || 0);
          totalWithdrawn += Number(w.total_withdrawn || 0);
          totalBTeam += Number(w.total_bonus_team || 0);
          totalBMatrix += Number(w.total_bonus_matrix || 0);
        });
        console.log('[ADMIN-SB] wallets fallback: totalDeposited=' + totalDeposited + ' totalBonusTeam=' + totalBTeam + ' balance=' + totalBalance);
      }

      // FONTE DUPLO: volume = max(transactions confirmed, wallets total_deposited) — wallets tem PRIORIDADE (é SSOT reconciliado V22)
      var volumeEntradas = 0;
      if (totalDeposited > 0) volumeEntradas = totalDeposited;
      else if (sumDepOK > 0) volumeEntradas = sumDepOK;
      else volumeEntradas = sumDep;
      var fundoLiquidez = volumeEntradas * (Number(this.projectSettings.projectFundPercentage || 40) / 100);
      var bonusEquipe = 0;
      if (totalBTeam > 0) bonusEquipe = totalBTeam;
      else if (sumBonus > 0) bonusEquipe = sumBonus;
      else bonusEquipe = volumeEntradas * (Number(this.projectSettings.totalDistributedPercentage || 60) / 100);

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
          bonusEquipe: bonusEquipe,
          todayVolume: todayVolume,
          todayCount: todayCount,
          todayDeposits: todayDepCount,
          todayBonuses: todayBonusCount,
          todayDate: new Date().toLocaleDateString('pt-PT')
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

      this.adminSupportSummary = { open: 0, pending: 0, closed: 0, total: 0 };
      this.adminFinanceSummary = { open: 0, pending: 0, resolved: 0, total: 0, valueOpen: 0, valueResolved: 0, valueToday: 0 };

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
          var pLegacy = {
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
          var pSSOT = {
            id: 1,
            entry_amount: Number(this.projectSettings.entryAmount || 0),
            currency: this.projectSettings.currency,
            network: this.projectSettings.network,
            sponsor_percentage: Number(this.projectSettings.teamCommissionPercents[0] || 0),
            level2_percentage: Number(this.projectSettings.teamCommissionPercents[1] || 0),
            level3_percentage: Number(this.projectSettings.teamCommissionPercents[2] || 0),
            level4_percentage: Number(this.projectSettings.teamCommissionPercents[3] || 0),
            level5_percentage: Number(this.projectSettings.teamCommissionPercents[4] || 0),
            team_total_percentage: Number(this.projectSettings.totalDistributedPercentage || 0),
            fund_percentage: Number(this.projectSettings.projectFundPercentage || 0),
            treasury_wallet: this.projectSettings.depositAddress,
            min_withdrawal_usdt: Number(this.projectSettings.withdraw.minAmount || 0),
            withdrawal_fee_bp: Math.round(Number(this.projectSettings.withdraw.networkFeeFlat || 0) * 100),
            updated_at: new Date().toISOString()
          };
          try {
            var exPs = await sb.from('project_settings').select('id').limit(1).maybeSingle();
            if (exPs && exPs.data) {
              await sb.from('project_settings').update(pSSOT).eq('id', 1);
            } else {
              await sb.from('project_settings').insert([pSSOT]);
            }
          } catch (_psErr) {}
          try {
            var exSs = await sb.from('system_settings').select('id').limit(1).maybeSingle();
            if (exSs && exSs.data) {
              await sb.from('system_settings').update(pLegacy).eq('id', Number(exSs.data.id || 1));
            } else {
              await sb.from('system_settings').insert([pLegacy]);
            }
          } catch (_ssErr) {}
        }
      } catch(e) {}
    }
    return true;
  },

  showEmailPendingModal(email) {
    email = String(email || '').trim() || 'o seu e-mail cadastrado';
    const safeEmail = email.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const html = `
      <div class="space-y-5">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1.5 min-w-0">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase tracking-[0.18em] font-black">
              <i class="fa-solid fa-envelope-circle-check animate-pulse"></i>
              <span>Confirmação de E-mail Pendente</span>
            </div>
            <h3 class="font-black text-white text-xl sm:text-2xl leading-tight font-['Space_Grotesk']">Valide a sua caixa de entrada</h3>
            <div class="text-[11px] font-mono text-gray-500 mt-1">A conta FourHash exige verificação antes do primeiro acesso</div>
          </div>
          <button onclick="UI.closeModal()" class="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div class="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-brand-surface/60 to-amber-500/5 p-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 flex-shrink-0 shadow-neon-sm">
              <i class="fa-solid fa-inbox text-xl"></i>
            </div>
            <div class="space-y-1 min-w-0">
              <div class="text-[11px] font-mono text-gray-500 uppercase tracking-widest">E-mail cadastrado</div>
              <div class="font-black text-white font-mono text-sm break-all">${safeEmail}</div>
              <div class="text-[11px] text-amber-200/90 leading-relaxed pt-1">
                Enviamos um link de confirmação para este endereço. Abra a mensagem e clique em <span class="font-black text-white">CONFIRMAR E-MAIL</span> para ativar o acesso.
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1.5 text-[11px] text-gray-400 leading-relaxed px-1">
          <div>• <span class="font-bold text-gray-300">Não recebeu?</span> Verifique a pasta <span class="font-mono text-white">Promoções</span>, <span class="font-mono text-white">Spam</span> ou <span class="font-mono text-white">Lixo Eletrónico</span>.</div>
          <div>• O link de confirmação expira em 24 horas. Clique em "Reenviar E-mail" abaixo se necessário.</div>
          <div>• Usou um e-mail errado no cadastro? <button onclick="UI.closeModal(); Router.navigate('register');" class="text-brand font-bold hover:underline">Clique aqui para se recadastrar</button>.</div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button onclick="UI.closeModal()" class="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white font-bold text-xs tracking-wider transition inline-flex items-center justify-center gap-2">
            <i class="fa-solid fa-arrow-left"></i>
            Voltar ao Login
          </button>
          <button onclick="AppState.resendConfirmationEmail('${safeEmail}', this)" class="py-3 rounded-xl bg-brand hover:bg-brand-glow text-black font-extrabold text-xs tracking-wider shadow-[0_0_30px_rgba(0,255,102,0.35)] transition transform hover:scale-[1.01] active:scale-100 inline-flex items-center justify-center gap-2">
            <i class="fa-solid fa-paper-plane"></i>
            Reenviar E-mail
          </button>
        </div>
      </div>
    `;
    try { UI.openModal(html); } catch(e) { UI.showToast('Verifique seu e-mail para confirmar o cadastro antes de acessar.', 'warning', 'fa-envelope'); }
  },

  async requestPasswordReset(linkEl) {
    var emailEl = document.getElementById('login-email');
    var email = emailEl ? String(emailEl.value || '').trim() : '';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      UI.showToast('Informe primeiro o seu e-mail no campo acima.', 'warning', 'fa-envelope');
      return;
    }
    if (linkEl) { try { linkEl.style.opacity = '0.6'; linkEl.style.pointerEvents = 'none'; } catch(_) {} }
    try {
      if (!window.SupabaseOK || !window.SupabaseOK()) {
        UI.showToast('Modo offline: Link de recuperação simulado (e-mail real enviado apenas em produção).', 'info');
        return;
      }
      var sb = this._sb();
      var r = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: (globalThis.location && globalThis.location.origin ? globalThis.location.origin : 'https://fourhash.app') + '/#/security?reset=1'
      });
      if (r && r.error) {
        UI.showToast(r.error.message || 'Erro ao enviar link de recuperação.', 'error');
        return;
      }
      UI.showToast('Link de recuperação enviado! Verifique sua caixa de entrada (' + email + ').', 'success', 'fa-circle-check');
    } catch (e) {
      UI.showToast((e && e.message) || 'Erro ao enviar recuperação.', 'error');
    } finally {
      if (linkEl) { try { linkEl.style.opacity = ''; linkEl.style.pointerEvents = ''; } catch(_) {} }
    }
  },

  async resendConfirmationEmail(email, btnEl) {
    email = String(email || '').trim();
    if (btnEl) { try { btnEl.disabled = true; btnEl.style.opacity = '0.6'; var orig = btnEl.innerHTML; btnEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> A reenviar…'; } catch(_) {} }
    try {
      if (!window.SupabaseOK || !window.SupabaseOK()) {
        UI.showToast('Modo offline: confirmação simulada.', 'info');
        return;
      }
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        UI.showToast('E-mail inválido para reenvio.', 'warning'); return;
      }
      var sb = this._sb();
      var r = await sb.auth.resend({ type: 'signup', email: email });
      if (r && r.error) {
        if (/already|confirmed|verified/i.test(String(r.error.message || ''))) {
          UI.showToast('Este e-mail já está confirmado. Pode fazer login normalmente.', 'success', 'fa-circle-check');
          try { UI.closeModal(); } catch(_) {}
        } else {
          UI.showToast(r.error.message || 'Erro ao reenviar e-mail.', 'error');
        }
        return;
      }
      UI.showToast('E-mail de confirmação reenviado para ' + email + '.', 'success', 'fa-envelope');
    } catch (e) {
      UI.showToast((e && e.message) || 'Erro ao reenviar.', 'error');
    } finally {
      if (btnEl) { try { btnEl.disabled = false; btnEl.style.opacity = ''; if (typeof orig !== 'undefined') btnEl.innerHTML = orig; } catch(_) {} }
    }
  },

  async sbSignIn(email, password) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Modo offline: login demo ativado.', 'info'); this.isAuthenticated = true; return true; }
    var sb = this._sb();
    try {
      email = String(email || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        UI.showToast('Informe um e-mail válido para acessar.', 'warning', 'fa-envelope'); return false;
      }
      var r = await sb.auth.signInWithPassword({ email: email, password: password });
      if (r && r.error) {
        var msg = String((r.error.message || '') + '').toLowerCase();
        if (/email.*not.*confirmed|email_not_confirm|verify.*email|signup.*incomplete|user.*pending/i.test(msg) || /otp|email.*confirm/i.test(String(r.error.code || ''))) {
          this.showEmailPendingModal(email);
          try { await sb.auth.signOut(); } catch(_) {}
          return false;
        }
        if (/invalid.*credentials|invalid.*password|wrong.*password|invalid.*login|user.*not.*found/i.test(msg)) {
          UI.showToast('Credenciais inválidas. Verifique o e-mail e a senha.', 'error'); return false;
        }
        UI.showToast(r.error.message || 'Erro de login', 'error'); return false;
      }
      var userAuth = (r && r.data && r.data.user) ? r.data.user : null;
      var sessAuth = (r && r.data && r.data.session) ? r.data.session : null;
      if (!userAuth) { UI.showToast('Credenciais inválidas.', 'error'); return false; }
      var confirmedAt = userAuth.email_confirmed_at || userAuth.confirmed_at || null;
      if (!confirmedAt) {
        this.showEmailPendingModal(userAuth.email || email);
        try { await sb.auth.signOut(); } catch(_) {}
        return false;
      }
      await this._loadUserProfileFromSupabase(userAuth, sessAuth);
      try { await this.refreshFromSupabase(); } catch(err) {}
      if (typeof Router !== 'undefined' && Router.renderNav) try { Router.renderNav(); } catch(e) {}
      UI.showToast(`Bem-vindo(a) ${this.currentUser.fullName || 'usuário'}! Autenticado com sucesso.`, 'success', 'fa-circle-check');
      try {
        var stLogin = String(this.currentUser.status || '').toUpperCase();
        if (stLogin === 'ACTIVE') {
          var notifExistsWelcome = this.notifications.some(function(n){ return n.title && n.title.indexOf('Bem-vindo') >= 0; });
          if (!notifExistsWelcome) {
            this.pushNotification(
              '👋 Bem-vindo(a) ao FourHash!',
              'Autenticação efetuada com sucesso. A sua posição é ' + (this.currentUser.positionNumber || '#') + '.',
              { type: 'success', icon: 'fa-circle-check' }
            );
          }
        } else if (stLogin === 'PENDING') {
          var notifExistsPending = this.notifications.some(function(n){ return n.title && n.title.indexOf('ativação') >= 0 || n.title.indexOf('pendente') >= 0; });
          if (!notifExistsPending) {
            this.pushNotification(
              '⏳ Conta pendente de ativação',
              'Efetue um depósito de USD 10.00 em USDT para ativar a sua posição e desbloquear o dashboard.',
              { type: 'warning', icon: 'fa-clock' }
            );
          }
        }
      } catch(_eWelcome) {}
      var route = 'dashboard';
      try { if (typeof Router !== 'undefined' && Router.isAdmin && Router.isAdmin()) route = 'admin'; } catch(e) {}
      if (typeof Router !== 'undefined') try { Router.navigate(route); } catch(e) {}
      try { this.npStartReconcileWatchdog(); } catch(_rd1) {}
      try { this.npReconcilePendingPayments({ force: true }); } catch(_rd2) {}
      return true;
    } catch (e) {
      var errStr = String((e && e.message) || 'Erro login' + '').toLowerCase();
      if (/email.*not.*confirm|email_not_confirm|verify|signup.*incomplete/i.test(errStr)) {
        var le = document.getElementById('login-email');
        this.showEmailPendingModal(le ? String(le.value || '').trim() : '');
        try { var sb2 = this._sb(); if (sb2) await sb2.auth.signOut(); } catch(_) {}
        return false;
      }
      UI.showToast((e && e.message) || 'Erro login', 'error'); return false;
    }
  },

  async sbSignUp(email, password, meta) {
    if (!window.SupabaseOK || !window.SupabaseOK()) { UI.showToast('Modo offline: registo demo salvo.', 'info'); this.isAuthenticated = true; return true; }
    var sb = this._sb();
    try {
      var r = await sb.auth.signUp({
        email: email, password: password,
        options: {
          data: meta || {},
          emailRedirectTo: (globalThis.location && globalThis.location.origin ? globalThis.location.origin : 'https://fourhash.app') + '/#/login?confirmed=1'
        }
      });
      if (r && r.error) { UI.showToast(r.error.message || 'Erro registo', 'error'); return false; }
      var userAuth = (r && r.data && r.data.user) ? r.data.user : null;
      var sessAuth = (r && r.data && r.data.session) ? r.data.session : null;
      var identLen = (r && r.data && Array.isArray(r.data.user && r.data.user.identities)) ? r.data.user.identities.length : 0;
      var weakConf = userAuth && userAuth.email_confirmed_at;
      if (weakConf || (sessAuth && identLen > 0)) {
        try { await sb.auth.signOut(); } catch(_) {}
        this.showEmailPendingModal(userAuth.email || email);
        return true;
      }
      try { await sb.auth.signOut(); } catch(_) {}
      this.showEmailPendingModal(userAuth.email || email);
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
      try {
        var amtActiv = Number(amount || this.projectSettings.entryAmount || 10).toFixed(2);
        var posActiv = this.currentUser.positionNumber || '#';
        var notifActiv = this.notifications.some(function(n){ return n.title && (n.title.indexOf('ativada') >= 0 || n.title.indexOf('ativado') >= 0); });
        if (!notifActiv) {
          this.pushNotification(
            '🎉 Conta ativada!',
            'A sua posição Linear ' + posActiv + ' foi garantida. Dashboard, Carteira e Árvore desbloqueados.',
            { type: 'success', icon: 'fa-circle-check' }
          );
        }
        var notifDep = this.notifications.some(function(n){ return n.title && n.title.indexOf('Depósito confirmado') >= 0 && n.message.indexOf(amtActiv) >= 0; });
        if (!notifDep) {
          this.pushNotification(
            '💸 Depósito confirmado!',
            'USD ' + amtActiv + ' foram creditados no seu saldo disponível (' + network + ' · pagamento #' + String(txHash || '').slice(-10) + ').',
            { type: 'success', icon: 'fa-wallet' }
          );
        }
      } catch(_eActNotif) {}
      return true;
    } catch (e) {
      this.currentUser.status = 'ACTIVE';
      UI.showToast('Ativação concluída. Se o saldo não aparecer, recarregue.', 'warning');
      return true;
    }
  },

  async sbReplyTicket(ticketIdOrCode, message, opts) {
    opts = opts || {};
    if (!message || !String(message).trim()) { UI.showToast('Mensagem vazia.', 'warning'); return false; }
    var sb = this._sb();
    var tktId = ticketIdOrCode;
    if (sb) {
      var tRaw = await sb.from('support_tickets').select('id, messages').or('id.eq.' + ticketIdOrCode + ',id.eq.' + (String(ticketIdOrCode).replace(/[^0-9]/g, '') || 0)).limit(1).maybeSingle();
      if (tRaw && tRaw.data) tktId = tRaw.data.id;
    }
    if (!window.SupabaseOK || !window.SupabaseOK() || !sb) {
      this.supportTickets.forEach(function(t){
        if ((t.id === ticketIdOrCode || t.ticket_id === ticketIdOrCode || t.code === ticketIdOrCode)) {
          if (!Array.isArray(t.replies)) t.replies = [];
          t.replies.push({ id: 'r_' + Date.now(), author: (opts.internal ? 'Equipe Interna' : 'Admin'), authorRole: 'admin', isAdmin: true, isInternal: !!opts.internal, message: message, createdAt: new Date().toISOString() });
          t.status = opts.close ? 'Fechado' : 'Respondido';
          t.lastReplyAt = new Date().toISOString();
        }
      });
      UI.showToast('Resposta adicionada (modo offline).', 'success');
      return true;
    }
    try {
      var me = this.sbAuth && this.sbAuth.id ? this.sbAuth.id : null;
      var now = new Date().toISOString();
      var cur = await sb.from('support_tickets').select('messages').eq('id', tktId).limit(1).maybeSingle();
      var curMsgs = (cur && cur.data && Array.isArray(cur.data.messages)) ? JSON.parse(JSON.stringify(cur.data.messages)) : [];
      curMsgs.push({ id: 'r_' + Date.now(), author_name: (opts.internal ? 'Equipe Interna' : 'Admin'), author_role: 'admin', is_admin: true, is_internal: !!opts.internal, text: message, created_at: now });
      var up = { status: (opts.close ? 'Fechado' : 'Respondido'), last_reply_at: now, messages: curMsgs };
      if (opts.close) { up.closed_at = now; }
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

  async openSupportTicket(opts) {
    opts = opts || {};
    var me = this.sbAuth ? this.sbAuth.id : null;
    var uName = (this.currentUser && this.currentUser.username) ? this.currentUser.username : (this.sbAuth && this.sbAuth.email ? this.sbAuth.email : '');
    var uEmail = (this.sbAuth && this.sbAuth.email) ? this.sbAuth.email : '';
    var initialMsg = String(opts.message || opts.description || '').trim();
    if (!opts.title && !initialMsg) { UI.showToast('Informe o assunto.', 'warning'); return false; }
    var messagesJson = [];
    if (initialMsg) messagesJson.push({ id: 'm_' + Date.now(), author_name: uName || 'Utilizador', author_role: 'user', is_admin: false, text: initialMsg, created_at: new Date().toISOString() });
    var row = {
      profile_id: me,
      username: opts.username || uName,
      email: opts.email || uEmail,
      title: opts.title || (opts.category || 'Suporte'),
      category: opts.category || 'Outro',
      priority: opts.priority || 'Média',
      status: 'Aberto',
      messages: messagesJson,
      metadata: { kind: opts.kind || '', tx_hash: opts.tx_hash || '', amount: opts.amount || 0, network: opts.network || '', order_id: opts.order_id || '', profile_id_ref: opts.profile_id || null }
    };
    if (!window.SupabaseOK || !window.SupabaseOK()) {
      var tkt = this._mapTicket({
        id: (this.supportTickets ? this.supportTickets.length + 1 : 1), created_at: new Date().toISOString(),
        username: row.username, email: row.email, title: row.title,
        category: row.category, priority: row.priority, status: row.status, messages: messagesJson
      });
      if (!this.supportTickets) this.supportTickets = [];
      this.supportTickets.unshift(tkt);
      return true;
    }
    var sb = this._sb();
    try {
      await sb.from('support_tickets').insert(row);
      await this.refreshSupportTickets();
      return true;
    } catch (e) { return false; }
  },

  async sbCreateFinanceProblem(data) {
    data = data || {};
    var me = this.sbAuth ? this.sbAuth.id : null;
    var meUsername = (this.currentUser && this.currentUser.username) ? this.currentUser.username : (this.sbAuth && this.sbAuth.email ? this.sbAuth.email : '');
    var meEmail = (this.sbAuth && this.sbAuth.email) ? this.sbAuth.email : '';
    var def = {
      profile_id: me, username: meUsername, email: meEmail,
      type: 'Depósito', category: 'Depósito',
      amount: 10.00, expected: 10.00, currency: 'USDT', network: 'BEP20',
      status: 'Pendente · Revisar', priority: 'Alta',
      tx_hash: '', vault_to_address: '', private_note: '', metadata: {}
    };
    for (var k in def) if (!(k in data)) data[k] = def[k];
    if (!data.profile_id && this.sbAuth) data.profile_id = this.sbAuth.id;
    if (!window.SupabaseOK || !window.SupabaseOK()) {
      var nr = this._mapFinance({ id: (this.financeProblems ? this.financeProblems.length + 1 : 1), created_at: new Date().toISOString(), opened_at: new Date().toISOString(),
        username: data.username || 'demo', email: data.email || '',
        type: data.type, category: data.category, amount: data.amount, expected: data.expected, currency: data.currency, network: data.network,
        tx_hash: data.tx_hash, status: data.status });
      if (!this.financeProblems) this.financeProblems = [];
      this.financeProblems.unshift(nr);
      UI.showToast('Problema adicionado (modo offline).', 'success');
      return true;
    }
    var sb = this._sb();
    try {
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
    if (sb) {
      var idStr = String(finIdOrCode).replace(/[^0-9]/g, '');
      var fRaw = await sb.from('finance_problems').select('id, notes').or('id.eq.' + finIdOrCode + (idStr ? (',id.eq.' + idStr) : '')).limit(1).maybeSingle();
      if (fRaw && fRaw.data) pid = fRaw.data.id;
    }
    if (!window.SupabaseOK || !window.SupabaseOK() || !sb) {
      this.financeProblems.forEach(function(fx){
        if (fx.id === finIdOrCode || fx.fin_id === finIdOrCode || fx.code === finIdOrCode) {
          fx.status = 'Resolvido · Fechado'; fx.resolution = resolution || '';
          if (opts.credit) { fx.creditWallet = true; fx.adjustedAmount = Number(opts.amount || 0); }
          if (!Array.isArray(fx.notes)) fx.notes = [];
          fx.notes.push({ id: 'n_' + Date.now(), kind: opts.credit ? 'credit' : 'note', resolution: resolution, amount: Number(opts.amount||0), text: opts.message || resolution, created_at: new Date().toISOString() });
        }
      });
      UI.showToast('Resolução aplicada (modo offline).', 'success');
      return true;
    }
    try {
      var me = this.sbAuth && this.sbAuth.id ? this.sbAuth.id : null;
      var now = new Date().toISOString();
      var cur = await sb.from('finance_problems').select('notes').eq('id', pid).limit(1).maybeSingle();
      var curNotes = (cur && cur.data && Array.isArray(cur.data.notes)) ? JSON.parse(JSON.stringify(cur.data.notes)) : [];
      curNotes.push({ id: 'n_' + Date.now(), author_id: me, kind: (opts.credit ? 'credit':'note'), is_internal: !!opts.internal, status_from: 'Em Análise', status_to: (opts.statusTo || 'Resolvido · Fechado'), resolution_text: resolution, text: opts.message || resolution, credit_amount: Number(opts.amount || 0), created_at: now });
      var up = { status: (opts.statusTo || 'Resolvido · Fechado'), resolved_by: me, resolved_at: now, private_note: resolution, notes: curNotes, updated_at: now };
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
  },

  _reconcileTimer: null,
  _reconcileLastRunAt: 0,

  async npReconcilePendingPayments(opts) {
    opts = opts || {};
    if (!this.isAuthenticated || !this.currentUser || !this.currentUser.id) return { ok: false, skipped: 'no_auth' };
    try {
      if (!opts.force) {
        const diff = Date.now() - Number(this._reconcileLastRunAt || 0);
        if (diff < (1000 * 30)) return { ok: true, skipped: 'rate_limited', wait_ms: ((1000 * 30) - diff) };
      }
      this._reconcileLastRunAt = Date.now();
      const endpoint = '/api/np-reconcile';
      try { console.log('[reconcile] ▶️  INÍCIO busca pagamentos pendentes NowPayments... (force=' + (!!opts.force) + ')'); } catch(_) {}
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!r || !r.ok) { try { console.log('[reconcile] ❌ HTTP ' + (r ? r.status : 'null')); } catch(_) {} return { ok: false, error: 'http_' + (r ? r.status : 'network') }; }
      const data = await r.json().catch(function(){ return {}; });
      try { console.log('[reconcile] ✅ RESPOSTA np-reconcile:', JSON.stringify({
        total_scanned: Number(data.total_scanned || 0),
        checked: Number(data.checked || 0),
        activated: Number(data.activated || 0),
        failed_or_expired: Number(data.failed_or_expired || 0),
        still_pending: Number(data.still_pending || 0)
      })); } catch(_) {}
      if (data && (Number(data.activated) > 0 || Number(data.already_confirmed) > 0)) {
        try { await this._loadUserProfileFromSupabase(this.sbAuth, this.sbSession); } catch(_) {}
        try { await this.refreshFromSupabase(); } catch(_) {}
        try { if (typeof Router !== 'undefined' && Router.refresh) Router.refresh(); } catch(_) {}
        try {
          if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
            UI.showToast('Sistema verificou pagamentos pendentes · ' + Number(data.activated || 0) + ' ativação(ões) aplicadas.', 'success', 'fa-circle-check', 4500);
          }
        } catch(_) {}
      }
      return data || { ok: true };
    } catch (e) {
      try { console.log('[reconcile] ❌ ERRO:', e && e.message ? e.message : String(e)); } catch(_) {}
      return { ok: false, error: (e && e.message) ? e.message : String(e) };
    }
  },

  npStartReconcileWatchdog() {
    try {
      if (this._reconcileTimer) { try { clearInterval(this._reconcileTimer); } catch(_) {} this._reconcileTimer = null; }
      var self = this;
      var fn = function(){ try { if (self.isAuthenticated) self.npReconcilePendingPayments({ force: false }); } catch(_x) {} };
      setTimeout(fn, 4000);
      this._reconcileTimer = setInterval(fn, 1000 * 12);
      try { console.log('[reconcile] Watchdog iniciado (12/12 segundos). Rápido ativado.'); } catch(_) {}
      return true;
    } catch(e) { return false; }
  },

  async refreshReferrals() {
    try {
      if (!this.isAuthenticated || !this.currentUser || !this.currentUser.id) {
        if (this.referrals) { this.referrals.direct = []; this.referrals.indirect = []; }
        if (this.currentUser) {
          this.currentUser.directReferralsCount = 0;
          this.currentUser.activeReferralsCount = 0;
          this.currentUser.inactiveReferralsCount = 0;
        }
        return false;
      }
      var me = this.currentUser.id;
      var sb = this._sb();
      if (!sb) return false;

      var list = [];
      try {
        var rRpc = await sb.rpc('get_my_direct_referrals', { me: me });
        if (rRpc && Array.isArray(rRpc.data)) {
          list = rRpc.data;
        } else {
          var rFb = await sb.from('profiles')
            .select('id, username, full_name, status, level_number, created_at, position_index, line_row, line_seat')
            .eq('upline_id', me)
            .order('created_at', { ascending: true });
          if (rFb && Array.isArray(rFb.data)) {
            list = rFb.data.map(function (p) {
              var pos = '-';
              if (p.position_index) pos = '#' + p.position_index;
              else if (p.line_row && p.line_seat) pos = '#' + p.line_row + '-' + p.line_seat;
              return {
                id: p.id,
                username: p.username || '',
                full_name: p.full_name || '',
                status: p.status || 'pending',
                level_number: Number(p.level_number || 0),
                created_at: p.created_at,
                bonus_earned: 0,
                position_code: pos
              };
            });
          }
        }
      } catch (_eRef) {
        try {
          var rFb2 = await sb.from('profiles')
            .select('id, username, full_name, status, level_number, created_at, position_index, line_row, line_seat')
            .eq('upline_id', me)
            .order('created_at', { ascending: true });
          if (rFb2 && Array.isArray(rFb2.data)) {
            list = rFb2.data.map(function (p) {
              var pos = '-';
              if (p.position_index) pos = '#' + p.position_index;
              else if (p.line_row && p.line_seat) pos = '#' + p.line_row + '-' + p.line_seat;
              return {
                id: p.id,
                username: p.username || '',
                full_name: p.full_name || '',
                status: p.status || 'pending',
                level_number: Number(p.level_number || 0),
                created_at: p.created_at,
                bonus_earned: 0,
                position_code: pos
              };
            });
          }
        } catch (_eFb) {}
      }

      var _meStr = String(me || '').toLowerCase();
      list = (list || []).filter(function(x){ return x && String(x.id || '').toLowerCase() !== _meStr; });

      var normalized = [];
      for (var _nr = 0; _nr < list.length; _nr++) {
        var _p = list[_nr];
        if (!_p) continue;
        var _bonusRaw = Number(_p.bonus_earned != null ? _p.bonus_earned : (_p.bonus != null ? _p.bonus : 0));
        var _posRaw = _p.positionNumber || _p.position_code;
        if (!_posRaw) {
          if (_p.position_index) _posRaw = '#' + _p.position_index;
          else if (_p.line_row && _p.line_seat) _posRaw = '#' + _p.line_row + '-' + _p.line_seat;
          else _posRaw = '-';
        }
        var _statusRaw = String(_p.status || 'PENDING').toUpperCase();
        if (_statusRaw !== 'ACTIVE' && _statusRaw !== 'PENDING' && _statusRaw !== 'BANNED' && _statusRaw !== 'SUSPENDED') _statusRaw = 'PENDING';
        var _dt = '';
        try {
          if (_p.date) _dt = _p.date;
          else if (_p.created_at) _dt = new Date(_p.created_at).toLocaleDateString('pt-PT');
          else if (_p.createdAt) _dt = new Date(_p.createdAt).toLocaleDateString('pt-PT');
        } catch(_eDt){}
        normalized.push({
          id: _p.id,
          username: _p.username || 'user',
          status: _statusRaw,
          level_number: Number(_p.level_number || 0),
          positionNumber: _posRaw,
          bonus: Number(_bonusRaw),
          bonus_earned: Number(_bonusRaw),
          date: _dt,
          createdAt: _p.created_at || _p.createdAt || null,
          full_name: _p.full_name || ''
        });
      }
      list = normalized;

      if (!this.referrals) this.referrals = { direct: [], indirect: [] };
      this.referrals.direct = list || [];
      this.referrals.indirect = [];
      var total = (this.referrals.direct && this.referrals.direct.length) ? this.referrals.direct.length : 0;
      var activeCount = 0;
      for (var i = 0; i < total; i++) {
        var ref = this.referrals.direct[i];
        if (ref && String(ref.status || '').toUpperCase() === 'ACTIVE') activeCount++;
      }
      this.currentUser.directReferralsCount = total;
      this.currentUser.activeReferralsCount = activeCount;
      this.currentUser.inactiveReferralsCount = Math.max(0, total - activeCount);
      return true;
    } catch (e) {
      try { console.log('[referrals] erro:', e && e.message ? e.message : String(e)); } catch(_) {}
      return false;
    }
  }
};

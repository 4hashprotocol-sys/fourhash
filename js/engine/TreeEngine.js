/* ============================================================
   FOURHASH — Motor do Organograma Linear 3D / 12 Níveis
   Depende de: AppState, UI
   ============================================================ */

const TreeEngine = {
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,

  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('tree-canvas');
    if (!container) {
      try { console.log('[TreeEngine.render] CANCELADO: #tree-canvas não existe no DOM'); } catch(_) {}
      return;
    }
    var totalLvl = 0;
    var totalPos = 0;
    try {
      if (AppState && AppState.treeLevels && Array.isArray(AppState.treeLevels)) {
        totalLvl = AppState.treeLevels.length;
        for (var tl = 0; tl < AppState.treeLevels.length; tl++) {
          if (AppState.treeLevels[tl] && AppState.treeLevels[tl].positions && Array.isArray(AppState.treeLevels[tl].positions)) {
            totalPos += AppState.treeLevels[tl].positions.length;
          }
        }
      }
    } catch(_) {}
    try { console.log('[TreeEngine.render] INICIADO | níveis:', totalLvl, '| total posições filhas:', totalPos, '| currentUser:', (AppState && AppState.currentUser && AppState.currentUser.username) ? '@' + AppState.currentUser.username : 'n/d'); } catch(_) {}

    let html = '';

    const self = AppState.currentUser;
    html += `
      <div id="node-self" class="flex flex-col items-center z-20 mb-8">
        <div onclick="TreeEngine.showNodeDetails('${self.username}', '${self.status}', '0', '${self.positionNumber}', '${self.entryDate}')" class="relative group cursor-pointer p-3 rounded-2xl bg-brand-surface border-2 border-brand shadow-neon hover:scale-105 transition transform flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-brand text-black font-black flex items-center justify-center text-sm">
            4#
          </div>
          <div class="text-left pr-2">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-brand shadow-neon-sm"></span>
              <span class="text-xs font-bold text-white">@${self.username}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand text-black font-bold">${I18n.t('treeBadgeYou')}</span>
            </div>
            <div class="text-[10px] font-mono text-gray-400">${self.positionNumber} • ${I18n.t('treeTrunk')}</div>
          </div>
        </div>
      </div>
    `;

    AppState.treeLevels.forEach((lvl) => {
      html += `
        <div class="w-full flex flex-col items-center my-4 relative level-block" data-level="${lvl.level}">

          <div class="flex items-center gap-3 mb-4 z-10">
            <button onclick="TreeEngine.toggleLevel(${lvl.level})" class="px-4 py-1 rounded-full border border-brand/30 bg-black/80 hover:border-brand text-brand font-mono text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-neon-sm transition">
              <span>${lvl.name}</span>
              <span class="text-[10px] text-gray-400 font-normal">(${lvl.positions.length} ${I18n.t('treeLevelPositionsCount')})</span>
              <i class="fa-solid ${lvl.expanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]"></i>
            </button>
          </div>

          <div class="w-0.5 h-6 bg-brand/40 mb-2 shadow-neon-sm"></div>

          <div class="${lvl.expanded ? 'flex' : 'hidden'} flex-wrap items-center justify-center gap-4 sm:gap-6 z-10 transition-all duration-200">
            ${lvl.positions.map(p => `
              <div id="node-${p.username.replace(/[^a-zA-Z0-9]/g, '')}" onclick="TreeEngine.showNodeDetails('${p.username}', '${p.status}', '${p.level}', '${p.positionNumber}', '${p.entryDate}')" class="relative group cursor-pointer p-2.5 rounded-xl border ${p.isSelf ? 'border-brand bg-brand/10 shadow-neon' : 'border-white/10 bg-brand-surface hover:border-brand/50'} hover:scale-105 transition transform flex items-center gap-2.5">

                <div class="w-8 h-8 rounded-full ${p.status === 'ACTIVE' ? 'bg-brand/20 text-brand border border-brand/40' : p.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-gray-700/30 text-gray-400 border border-gray-600'} flex items-center justify-center text-xs font-bold">
                  <i class="fa-solid fa-user text-[11px]"></i>
                </div>

                <div class="text-left pr-1">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full ${p.status === 'ACTIVE' ? 'bg-brand shadow-neon-sm' : p.status === 'PENDING' ? 'bg-amber-400' : 'bg-gray-500'}"></span>
                    <span class="text-xs font-bold text-white">@${p.username}</span>
                  </div>
                  <div class="text-[9px] font-mono text-gray-400">${p.positionNumber}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.updateTransform();
    try { console.log('[TreeEngine.render] FINALIZADO com sucesso | HTML escrito no #tree-canvas'); } catch(_) {}
  },

  bindEvents() {
    const viewport = document.getElementById('tree-viewport');
    if (!viewport) return;

    viewport.onmousedown = (e) => {
      this.isDragging = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
    };

    window.onmousemove = (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
      this.updateTransform();
    };

    window.onmouseup = () => {
      this.isDragging = false;
    };

    viewport.onwheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      this.zoom = Math.max(0.4, Math.min(1.8, this.zoom + delta));
      this.updateTransform();
    };

    viewport.ontouchstart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.panX;
        this.startY = e.touches[0].clientY - this.panY;
      }
    };

    viewport.ontouchmove = (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.panX = e.touches[0].clientX - this.startX;
        this.panY = e.touches[0].clientY - this.startY;
        this.updateTransform();
      }
    };

    viewport.ontouchend = () => {
      this.isDragging = false;
    };
  },

  updateTransform() {
    const canvas = document.getElementById('tree-canvas');
    if (canvas) {
      canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
  },

  zoomIn() {
    this.zoom = Math.min(1.8, this.zoom + 0.15);
    this.updateTransform();
  },

  zoomOut() {
    this.zoom = Math.max(0.4, this.zoom - 0.15);
    this.updateTransform();
  },

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  },

  centerSelf() {
    this.resetView();
    const selfNode = document.getElementById('node-self');
    if (selfNode) {
      selfNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  toggleLevel(levelNumber) {
    const lvl = AppState.treeLevels.find(l => l.level === levelNumber);
    if (lvl) {
      lvl.expanded = !lvl.expanded;
      this.render();
    }
  },

  toggleAllLevels(expand) {
    AppState.treeLevels.forEach(l => l.expanded = expand);
    this.render();
  },

  searchNode() {
    const input = document.getElementById('tree-search-input');
    if (!input) return;
    const query = input.value.trim().toLowerCase().replace('@', '');
    if (!query) {
      UI.showToast('Digite um @username para buscar na rede.', 'info');
      return;
    }

    let found = false;
    AppState.treeLevels.forEach(lvl => {
      lvl.positions.forEach(p => {
        if (p.username.toLowerCase().includes(query)) {
          found = true;
          lvl.expanded = true;
        }
      });
    });

    if (found) {
      this.render();
      setTimeout(() => {
        const target = document.getElementById(`node-${query}`);
        if (target) {
          target.classList.add('ring-4', 'ring-brand', 'animate-bounce');
          setTimeout(() => target.classList.remove('ring-4', 'ring-brand', 'animate-bounce'), 3000);
        }
      }, 100);
      UI.showToast(I18n.t('treeToastUserFound').replace('{u}', query), 'success');
    } else {
      UI.showToast(I18n.t('treeToastUserNotFound').replace('{u}', query), 'error');
    }
  },

  showNodeDetails(username, status, level, position, date) {
    var lv = String(level || '0').trim();
    var isSelf = (lv === '0' || lv === '00');
    var levelLabel = isSelf
      ? I18n.t('treeLevelSelfLabel')
      : I18n.t('treeLevelFormat').replace('{n}', (lv.length === 1 ? '0' + lv : lv));
    const content = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-brand/20 border border-brand flex items-center justify-center font-bold text-brand">
              @
            </div>
            <div>
              <h3 class="text-base font-bold text-white">@${username}</h3>
              <div class="text-xs font-mono text-gray-400">${I18n.t('treeDetailsPosition')} ${position}</div>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full ${status === 'ACTIVE' ? 'bg-brand/20 text-brand border border-brand/40' : 'bg-amber-400/20 text-amber-300'} text-xs font-mono font-bold">
            ● ${status}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs font-mono">
          <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
            <div class="text-gray-400 text-[10px]">${I18n.t('treeDetailsLevel')}</div>
            <div class="text-white font-bold text-sm mt-0.5">${levelLabel}</div>
          </div>
          <div class="p-3 rounded-xl bg-brand-surface border border-white/5">
            <div class="text-gray-400 text-[10px]">${I18n.t('treeDetailsEntry')}</div>
            <div class="text-white font-bold text-sm mt-0.5">${date}</div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button onclick="UI.closeModal()" class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
            ${I18n.t('treeDetailsClose')}
          </button>
        </div>
      </div>
    `;

    UI.openModal(content);
  }
};

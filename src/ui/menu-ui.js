/* ==========================================================================
   NIGHT FALL LAND - Main Menu UI Controller
   ========================================================================== */

class MenuUI {
  constructor() {}

  init() {
    this.bindEvents();
    this.updateProfileDisplay();
    this.renderLevels();
  }

  bindEvents() {
    // Menu Action Buttons
    const btnPlay = document.getElementById('btn-menu-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playClick();
        this.startGame(1);
      });
    }

    const btnLevels = document.getElementById('btn-menu-levels');
    if (btnLevels) {
      btnLevels.addEventListener('click', () => {
        this.renderLevels();
        window.screenManager.openModal('modal-levels');
      });
    }

    const btnSettings = document.getElementById('btn-menu-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        window.screenManager.openModal('modal-settings');
      });
    }

    const btnLore = document.getElementById('btn-menu-lore');
    if (btnLore) {
      btnLore.addEventListener('click', () => {
        window.screenManager.openModal('modal-lore');
      });
    }

    // Top Bar Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playClick();
        window.storageManager.logout();
        window.screenManager.showToast('Departed from the realm.', 'info');
        window.screenManager.showScreen('screen-auth');
      });
    }

    // Quick Audio Toggle Pill
    const audioPill = document.getElementById('menu-audio-toggle');
    if (audioPill) {
      audioPill.addEventListener('click', () => {
        if (window.audioManager) {
          const isMuted = window.audioManager.toggleMute();
          audioPill.innerHTML = isMuted ? '🔇 Audio Muted' : '🔊 Sound Waves';
        }
      });
    }

    // Hover sounds
    document.querySelectorAll('.btn, .btn-menu-action, .level-card').forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        if (window.audioManager) window.audioManager.playHover();
      });
    });
  }

  updateProfileDisplay() {
    const user = window.storageManager.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById('profile-player-name');
    const roleEl = document.getElementById('profile-player-role');
    const essenceEl = document.getElementById('profile-player-essence');
    const avatarEl = document.getElementById('profile-player-avatar');

    if (nameEl) nameEl.textContent = user.username;
    if (roleEl) roleEl.textContent = 'Darkwood Explorer';
    if (essenceEl) essenceEl.textContent = user.essence || 0;
    if (avatarEl) avatarEl.textContent = user.avatar || '🌙';
  }

  renderLevels() {
    const container = document.getElementById('level-grid-container');
    if (!container) return;

    const user = window.storageManager.getCurrentUser() || { unlockedLevels: [1] };
    const levels = window.GAME_CONFIG.levels;

    container.innerHTML = levels.map(lvl => {
      const isUnlocked = user.unlockedLevels ? user.unlockedLevels.includes(lvl.id) : lvl.id === 1;
      return `
        <div class="level-card ${isUnlocked ? 'active' : 'locked'}" data-level-id="${lvl.id}">
          <div class="level-badge-row">
            <span class="level-number">${lvl.act}</span>
            <span class="badge ${isUnlocked ? 'badge-cyan' : 'badge-gold'}">${lvl.difficulty}</span>
          </div>
          <h4 class="level-title">${lvl.title}</h4>
          <p class="level-desc">${lvl.desc}</p>
          <div class="level-meta">
            <span>🌙 Target: ${lvl.targetShards} Shards</span>
            <span>${isUnlocked ? '✦ Ready to Explore' : '🔒 Sealed by Darkness'}</span>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.level-card.active').forEach(card => {
      card.addEventListener('click', () => {
        const lvlId = parseInt(card.dataset.levelId);
        window.screenManager.closeAllModals();
        this.startGame(lvlId);
      });
    });
  }

  startGame(levelId = 1) {
    if (window.gameEngine) {
      window.screenManager.showScreen('screen-game');
      window.gameEngine.loadLevel(levelId);
    }
  }
}

window.menuUI = new MenuUI();

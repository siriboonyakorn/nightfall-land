/* ==========================================================================
   NIGHT FALL LAND - Core Game Engine & Master Loop
   Top-down puzzle adventure runner with dialogue & reset mechanics
   ========================================================================== */

class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.ambientCanvas = null;
    this.ambientCtx = null;

    this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'DIALOGUE', 'VICTORY'
    this.lastTime = performance.now();
    this.elapsedTime = 0;
    this.currentLevelId = 1;

    // Subsystems
    this.input = null;
    this.world = null;
    this.player = null;
    this.hud = null;

    // Ambient Menu Particles
    this.menuParticles = [];
  }

  init() {
    this.canvas = document.getElementById('game-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.ambientCanvas = document.getElementById('ambient-canvas');
    if (this.ambientCanvas) {
      this.ambientCtx = this.ambientCanvas.getContext('2d');
    }

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.initMenuParticles();

    this.input = new window.InputHandler();
    this.hud = new window.GameHUD();

    this.bindOverlayEvents();

    requestAnimationFrame((t) => this.loop(t));
  }

  handleResize() {
    if (this.canvas) {
      this.canvas.width = 1280;
      this.canvas.height = 720;
    }
    if (this.ambientCanvas) {
      this.ambientCanvas.width = window.innerWidth;
      this.ambientCanvas.height = window.innerHeight;
    }
  }

  initMenuParticles() {
    this.menuParticles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.menuParticles.push({
        x: Math.random() * (this.ambientCanvas ? this.ambientCanvas.width : window.innerWidth),
        y: Math.random() * (this.ambientCanvas ? this.ambientCanvas.height : window.innerHeight),
        radius: 1.2 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 10,
        vy: -12 - Math.random() * 20,
        alpha: 0.15 + Math.random() * 0.6,
        color: Math.random() < 0.6 ? '#00f0ff' : '#c084fc'
      });
    }
  }

  bindOverlayEvents() {
    // In-game pause button
    const btnPause = document.getElementById('btn-hud-pause');
    if (btnPause) {
      btnPause.addEventListener('click', () => this.togglePause());
    }

    // Resume
    const btnResume = document.getElementById('btn-pause-resume');
    if (btnResume) {
      btnResume.addEventListener('click', () => this.togglePause());
    }

    // Restart
    const btnRestart = document.getElementById('btn-pause-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.loadLevel(this.currentLevelId));
    }

    // Return to Menu
    const btnMenu = document.getElementById('btn-pause-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => this.returnToMenu());
    }

    // Victory Next Level / Menu
    const btnVictoryNext = document.getElementById('btn-victory-next');
    if (btnVictoryNext) {
      btnVictoryNext.addEventListener('click', () => {
        const nextId = this.currentLevelId + 1;
        if (nextId <= 5) {
          const user = window.storageManager ? window.storageManager.getCurrentUser() : null;
          const unlocked = user && user.unlockedLevels ? user.unlockedLevels : [1];
          if (unlocked.includes(nextId)) {
            window.screenManager.hideAllOverlays();
            this.loadLevel(nextId);
          } else {
            this.returnToMenu();
            window.screenManager.showToast('Complete the current level to unlock the next region!', 'info');
          }
        } else {
          this.returnToMenu();
          window.screenManager.showToast('You have conquered Night Fall Land! 🌟', 'success');
        }
      });
    }

    const btnVictoryMenu = document.getElementById('btn-victory-menu');
    if (btnVictoryMenu) {
      btnVictoryMenu.addEventListener('click', () => this.returnToMenu());
    }

    // Dialogue Close Button
    const btnCloseDialogue = document.getElementById('btn-close-dialogue');
    if (btnCloseDialogue) {
      btnCloseDialogue.addEventListener('click', () => this.closeDialogue());
    }
  }

  loadLevel(levelId = 1) {
    this.currentLevelId = levelId;
    this.elapsedTime = 0;
    this.state = 'PLAYING';

    window.screenManager.hideAllOverlays();
    this.closeDialogue();

    // Create World (pass levelId so the right map is built)
    this.world = new window.World(levelId);
    this.player = new window.Player(140, 320);

    if (window.audioManager) {
      window.audioManager.unlockAudio();
    }
  }

  restartLevel() {
    if (window.audioManager) window.audioManager.playHover();
    if (window.screenManager) window.screenManager.showToast('Puzzle reset to initial state.', 'info');
    this.loadLevel(this.currentLevelId);
  }

  showDialogue(title, message) {
    this.state = 'DIALOGUE';
    const modal = document.getElementById('modal-dialogue');
    const titleEl = document.getElementById('dialogue-title');
    const bodyEl = document.getElementById('dialogue-body');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = message;
    if (modal) modal.classList.add('active');
  }

  closeDialogue() {
    const modal = document.getElementById('modal-dialogue');
    if (modal) modal.classList.remove('active');
    if (this.state === 'DIALOGUE') {
      this.state = 'PLAYING';
    }
  }

  returnToMenu() {
    // Close dialogue first (before changing state so it doesn't reset to PLAYING)
    const modal = document.getElementById('modal-dialogue');
    if (modal) modal.classList.remove('active');
    // Now set state to MENU
    this.state = 'MENU';
    window.screenManager.hideAllOverlays();
    window.screenManager.showScreen('screen-menu');
    if (window.menuUI) {
      window.menuUI.updateProfileDisplay();
      window.menuUI.renderLevels();
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.hud.showPauseOverlay();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      window.screenManager.hideOverlay('overlay-pause');
    }
  }

  triggerVictory() {
    if (this.state !== 'PLAYING') return;
    this.state = 'VICTORY';
    if (window.audioManager) window.audioManager.playVictory();

    // Save progress (fire-and-forget async — don't await in game loop)
    const totalShards = this.world ? (this.world.totalShards || 1) : 1;
    if (window.storageManager) {
      window.storageManager.updateUserProgress(
        this.player.shards * 50,
        500,
        this.currentLevelId
      );
    }

    this.hud.showVictoryOverlay({
      shards: this.player.shards,
      totalShards: totalShards,
      time: this.elapsedTime,
      levelId: this.currentLevelId
    });
  }

  // Master RAF Loop
  loop(currentTime) {
    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const dt = Math.min(0.05, rawDt);

    this.renderAmbientCanvas(dt);

    if (window.screenManager && window.screenManager.currentScreen === 'screen-game') {
      // Check pause
      if (this.input.wasPressed('pause')) {
        this.togglePause();
      }

      // Check restart (R key)
      if (this.input.wasPressed('restart') && (this.state === 'PLAYING' || this.state === 'PAUSED')) {
        this.restartLevel();
      }

      // If in dialogue, pressing interact or space closes dialogue
      if (this.state === 'DIALOGUE' && this.input.wasPressed('interact')) {
        this.closeDialogue();
      }

      if (this.state === 'PLAYING') {
        this.elapsedTime += dt;
        this.updateGame(dt);
      }

      this.renderGame();
      this.input.flushFrame();
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  updateGame(dt) {
    if (!this.player || !this.world) return;
    // Only update when truly playing (not VICTORY/PAUSED/DIALOGUE)
    if (this.state !== 'PLAYING') return;

    this.player.update(dt, this.input, this.world, window.audioManager);
    this.world.update(dt, this.player, window.audioManager);
    this.hud.update(this.player, this, this.world);
  }

  renderGame() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw World Tiles & Puzzle Objects
    this.world.draw(this.ctx);

    // 2. Draw Player Entity
    this.player.draw(this.ctx);
  }

  renderAmbientCanvas(dt) {
    if (!this.ambientCtx || !this.ambientCanvas) return;

    const w = this.ambientCanvas.width;
    const h = this.ambientCanvas.height;
    this.ambientCtx.clearRect(0, 0, w, h);

    for (const p of this.menuParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      this.ambientCtx.save();
      this.ambientCtx.fillStyle = p.color;
      this.ambientCtx.globalAlpha = p.alpha;
      this.ambientCtx.shadowColor = p.color;
      this.ambientCtx.shadowBlur = 8;
      this.ambientCtx.beginPath();
      this.ambientCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ambientCtx.fill();
      this.ambientCtx.restore();
    }
  }
}

window.gameEngine = new GameEngine();

/* ==========================================================================
   NIGHT FALL LAND - Input Controller
   W, A, S, D / Arrow keys, [E] Interact, [R] Restart, [ESC] Pause
   ========================================================================== */

class InputHandler {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    this.actionMap = {
      up: ['KeyW', 'ArrowUp'],
      down: ['KeyS', 'ArrowDown'],
      left: ['KeyA', 'ArrowLeft'],
      right: ['KeyD', 'ArrowRight'],
      interact: ['KeyE', 'Space'],
      restart: ['KeyR'],
      pause: ['Escape', 'KeyP']
    };

    this.virtualKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false
    };

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;

      // Prevent scrolling when playing
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (window.screenManager && window.screenManager.currentScreen === 'screen-game') {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.justPressed[e.code] = false;
    });

    this.setupTouchControls();
  }

  setupTouchControls() {
    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.virtualKeys[action] = true;
        this.justPressed[action] = true;
      });
      el.addEventListener('pointerup', (e) => {
        e.preventDefault();
        this.virtualKeys[action] = false;
      });
      el.addEventListener('pointercancel', () => {
        this.virtualKeys[action] = false;
      });
    };

    bindTouch('touch-up', 'up');
    bindTouch('touch-down', 'down');
    bindTouch('touch-left', 'left');
    bindTouch('touch-right', 'right');
    bindTouch('touch-interact', 'interact');
  }

  isDown(action) {
    if (this.virtualKeys[action]) return true;
    const codes = this.actionMap[action];
    if (!codes) return false;
    return codes.some(code => this.keys[code]);
  }

  wasPressed(action) {
    if (this.justPressed[action]) return true;
    const codes = this.actionMap[action];
    if (!codes) return false;
    return codes.some(code => this.justPressed[code]);
  }

  flushFrame() {
    this.justPressed = {};
  }
}

window.InputHandler = InputHandler;

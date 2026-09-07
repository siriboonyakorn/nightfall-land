/* ==========================================================================
   NIGHTFALL LAND - Screen & UI View Router
   ========================================================================== */

class ScreenManager {
  constructor() {
    this.currentScreen = null;
    this.activeModal = null;
  }

  init() {
    // Modal backdrop click-to-close listeners
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Close buttons inside modals
    document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playModalClose();
        this.closeAllModals();
      });
    });
  }

  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      if (screen.id === screenId) {
        screen.classList.add('active');
        screen.classList.remove('hidden');
      } else {
        screen.classList.remove('active');
      }
    });

    this.currentScreen = screenId;

    // Trigger ambient canvas behavior or specific screen resets
    if (screenId === 'screen-menu') {
      if (window.menuUI) window.menuUI.updateProfileDisplay();
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (window.audioManager) window.audioManager.playModalOpen();

    modal.classList.add('active');
    this.activeModal = modalId;
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    if (this.activeModal === modalId) {
      this.activeModal = null;
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    this.activeModal = null;
  }

  showOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  hideOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  hideAllOverlays() {
    document.querySelectorAll('.game-overlay').forEach(ov => {
      ov.classList.remove('active');
    });
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    const iconEl = document.createElement('span');
    iconEl.textContent = icon;
    const messageEl = document.createElement('span');
    messageEl.textContent = String(message);
    toast.append(iconEl, messageEl);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global Singleton
window.screenManager = new ScreenManager();

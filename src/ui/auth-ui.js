/* ==========================================================================
   NIGHT FALL LAND - Authentication UI Controller
   Username & Password login & register with Supabase integration
   ========================================================================== */

class AuthUI {
  constructor() {
    this.mode = 'login'; // 'login' or 'register'
  }

  init() {
    const form = document.getElementById('form-simple-auth');
    const inputName = document.getElementById('auth-traveler-name');
    const inputPass = document.getElementById('auth-traveler-password');
    const btnSubmit = document.getElementById('btn-submit-enter');
    const btnGuest = document.getElementById('btn-guest-quick');
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    const btnCloudSetup = document.getElementById('btn-cloud-setup');

    // Tab Toggle
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playHover();
        this.mode = 'login';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        if (btnSubmit) btnSubmit.querySelector('span').textContent = 'Enter the Night (Login)';
      });

      tabRegister.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playHover();
        this.mode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        if (btnSubmit) btnSubmit.querySelector('span').textContent = 'Awaken Traveler (Register)';
      });
    }

    // Form Submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = inputName ? inputName.value.trim() : '';
        const password = inputPass ? inputPass.value : '';

        if (!username || !password) {
          window.screenManager.showToast('Please enter both username and password.', 'error');
          return;
        }

        const originalText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>Connecting...</span>';

        let res;
        if (this.mode === 'register') {
          res = await window.storageManager.register(username, password);
        } else {
          res = await window.storageManager.login(username, password);
        }

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;

        if (res.success) {
          if (window.audioManager) window.audioManager.playModalOpen();
          const cloudMsg = res.user.isCloud ? ' (Cloud Save Active ☁️)' : '';
          window.screenManager.showToast(`Welcome, ${res.user.username}!${cloudMsg}`, 'success');
          window.screenManager.showScreen('screen-menu');
        } else {
          window.screenManager.showToast(res.message || 'Authentication failed.', 'error');
        }
      });
    }

    // Guest Mode
    if (btnGuest) {
      btnGuest.addEventListener('click', () => {
        if (window.audioManager) window.audioManager.playClick();
        const guest = window.storageManager.loginAsGuest();
        window.screenManager.showToast(`Entering as ${guest.username}...`, 'info');
        window.screenManager.showScreen('screen-menu');
      });
    }

    // Cloud Setup Modal
    if (btnCloudSetup) {
      btnCloudSetup.addEventListener('click', () => {
        window.screenManager.openModal('modal-supabase');
      });
    }

    this.initSupabaseModal();
  }

  initSupabaseModal() {
    const btnSaveCloud = document.getElementById('btn-save-supabase');
    const inputUrl = document.getElementById('supabase-url-input');
    const inputKey = document.getElementById('supabase-key-input');

    if (inputUrl && inputKey) {
      inputUrl.value = '';
      inputKey.value = '';
    }

    if (btnSaveCloud) {
      btnSaveCloud.addEventListener('click', () => {
        const url = inputUrl ? inputUrl.value.trim() : '';
        const key = inputKey ? inputKey.value.trim() : '';

        if (!url || !key) {
          window.screenManager.showToast('Please provide both Supabase URL and Anon Key.', 'error');
          return;
        }

        const success = window.supabaseService.saveCredentials(url, key);
        if (success) {
          window.screenManager.showToast('Supabase connected successfully! ☁️', 'success');
          window.screenManager.closeModal('modal-supabase');
        } else {
          window.screenManager.showToast('Connected! (Refresh if needed)', 'info');
          window.screenManager.closeModal('modal-supabase');
        }
      });
    }
  }
}

window.authUI = new AuthUI();

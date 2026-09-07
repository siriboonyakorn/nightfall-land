/* ==========================================================================
   NIGHTFALL LAND - Settings UI Controller
   ========================================================================== */

class SettingsUI {
  constructor() {}

  init() {
    const settings = window.storageManager.getSettings();

    // Volume Sliders
    const masterSlider = document.getElementById('setting-master-vol');
    const sfxSlider = document.getElementById('setting-sfx-vol');
    const bgmSlider = document.getElementById('setting-bgm-vol');

    const masterVal = document.getElementById('val-master-vol');
    const sfxVal = document.getElementById('val-sfx-vol');
    const bgmVal = document.getElementById('val-bgm-vol');

    if (masterSlider) {
      masterSlider.value = Math.round((settings.masterVolume || 0.8) * 100);
      if (masterVal) masterVal.textContent = `${masterSlider.value}%`;
      masterSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        if (masterVal) masterVal.textContent = `${e.target.value}%`;
        window.audioManager.setMasterVolume(val);
        settings.masterVolume = val;
        window.storageManager.saveSettings(settings);
      });
    }

    if (sfxSlider) {
      sfxSlider.value = Math.round((settings.sfxVolume || 0.75) * 100);
      if (sfxVal) sfxVal.textContent = `${sfxSlider.value}%`;
      sfxSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        if (sfxVal) sfxVal.textContent = `${e.target.value}%`;
        window.audioManager.setSfxVolume(val);
        settings.sfxVolume = val;
        window.storageManager.saveSettings(settings);
      });
      sfxSlider.addEventListener('change', () => {
        window.audioManager.playHover();
      });
    }

    if (bgmSlider) {
      bgmSlider.value = Math.round((settings.bgmVolume || 0.5) * 100);
      if (bgmVal) bgmVal.textContent = `${bgmSlider.value}%`;
      bgmSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        if (bgmVal) bgmVal.textContent = `${e.target.value}%`;
        window.audioManager.setBgmVolume(val);
        settings.bgmVolume = val;
        window.storageManager.saveSettings(settings);
      });
    }

    // Particle buttons
    const particleBtns = document.querySelectorAll('[data-particle-preset]');
    particleBtns.forEach(btn => {
      if (btn.dataset.particlePreset === (settings.particles || 'high')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.addEventListener('click', () => {
        particleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.particles = btn.dataset.particlePreset;
        window.storageManager.saveSettings(settings);
        if (window.audioManager) window.audioManager.playClick();
        window.screenManager.showToast(`Particle density set to ${settings.particles.toUpperCase()}`, 'info');
      });
    });
  }
}

// Global Singleton
window.settingsUI = new SettingsUI();

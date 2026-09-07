/* ==========================================================================
   NIGHT FALL LAND - Supabase Configuration & Client Provider
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: '',
  anonKey: ''
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.sessionUrl = null;
    this.sessionKey = null;
    this.ready = this.init();
  }

  async init() {
    if (!this.sessionUrl && !SUPABASE_CONFIG.url) {
      try {
        const response = await fetch('/api/public-config');
        if (response.ok) {
          const config = await response.json();
          SUPABASE_CONFIG.url = config.url || '';
          SUPABASE_CONFIG.anonKey = config.anonKey || '';
        }
      } catch (e) {
        // Cloud saves remain available through the manual setup modal.
      }
    }

    const url = this.sessionUrl || SUPABASE_CONFIG.url;
    const key = this.sessionKey || SUPABASE_CONFIG.anonKey;

    if (this.isAllowedUrl(url) && key && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isConfigured = true;
        return true;
      } catch (e) {
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
    return false;
  }

  saveCredentials(url, key) {
    const trimmedUrl = (url || '').trim();
    const trimmedKey = (key || '').trim();
    if (!this.isAllowedUrl(trimmedUrl) || !trimmedKey) return false;
    this.sessionUrl = trimmedUrl;
    this.sessionKey = trimmedKey;
    try {
      this.client = window.supabase.createClient(trimmedUrl, trimmedKey);
      this.isConfigured = true;
      this.ready = Promise.resolve(true);
      return true;
    } catch (e) {
      this.isConfigured = false;
      this.ready = Promise.resolve(false);
      return false;
    }
  }

  isAllowedUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co');
    } catch (e) {
      return false;
    }
  }

  // Generate synthetic email from username for seamless Supabase Auth
  usernameToEmail(username) {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `${clean}@nightfall.local`;
  }
}

window.supabaseService = new SupabaseService();

/* ==========================================================================
   NIGHT FALL LAND - Supabase Configuration & Client Provider
   ========================================================================== */

const SUPABASE_CONFIG = {
  // You can set your Project URL & Anon Key here, or configure via the in-game setup modal.
  url: window.__SUPABASE_URL__ || 'https://jfqlgszjlmesupggpgcc.supabase.co',
  anonKey: window.__SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcWxnc3pqbG1lc3VwZ2dwZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODI3OTIsImV4cCI6MjEwNDM1ODc5Mn0.o13XstbPjDqnTeNdyk836oHpRfRdr9_JY5PFMjO_80k'
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    // Check localStorage for saved credentials (allows connecting without editing code)
    const savedUrl = localStorage.getItem('nightfall_supabase_url');
    const savedKey = localStorage.getItem('nightfall_supabase_key');

    const url = savedUrl || SUPABASE_CONFIG.url;
    const key = savedKey || SUPABASE_CONFIG.anonKey;

    if (url && key && !url.includes('YOUR_SUPABASE_PROJECT_ID') && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isConfigured = true;
        console.log('[Supabase] Initialized successfully with project:', url);
      } catch (e) {
        console.warn('[Supabase] Init error:', e);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
  }

  saveCredentials(url, key) {
    if (!url || !key) return false;
    localStorage.setItem('nightfall_supabase_url', url.trim());
    localStorage.setItem('nightfall_supabase_key', key.trim());
    this.init();
    return this.isConfigured;
  }

  // Generate synthetic email from username for seamless Supabase Auth
  usernameToEmail(username) {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    return `${clean}@nightfall.local`;
  }
}

window.supabaseService = new SupabaseService();

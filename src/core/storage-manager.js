/* ==========================================================================
   NIGHT FALL LAND - Cloud (Supabase) & Local Storage Manager
   Handles Username & Password Auth + Progression Persistence
   ========================================================================== */

const STORAGE_KEYS = {
  USERS: 'nightfall_land_users',
  CURRENT_USER: 'nightfall_land_current_session',
  SETTINGS: 'nightfall_land_settings',
  LEADERBOARD: 'nightfall_land_leaderboard'
};

class StorageManager {
  constructor() {
    this.defaultSettings = {
      masterVolume: 0.8,
      sfxVolume: 0.75,
      bgmVolume: 0.5,
      particles: 'high'
    };
  }

  // Get current active session
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Error setting current user:', e);
    }
  }

  // 1. SUPABASE & LOCAL REGISTRATION (Username & Password)
  async register(username, password) {
    const trimmed = (username || '').trim();
    if (!trimmed || trimmed.length < 3) {
      return { success: false, message: 'Traveler name must be at least 3 characters.' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Secret key / password must be at least 4 characters.' };
    }

    // A. If Supabase is connected
    if (window.supabaseService && window.supabaseService.isConfigured) {
      try {
        const client = window.supabaseService.client;
        const email = window.supabaseService.usernameToEmail(trimmed);

        const { data: authData, error: authError } = await client.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { username: trimmed }
          }
        });

        if (authError) {
          return { success: false, message: authError.message };
        }

        const userObj = {
          id: authData.user.id,
          username: trimmed,
          avatar: '🌙',
          currentRegion: 'Darkwood',
          currentLevel: 1,
          unlockedLevels: [1],
          moonShards: 0,
          score: 0,
          isCloud: true
        };

        // Insert initial player profile row
        await client.from('player_profiles').upsert({
          id: authData.user.id,
          username: trimmed,
          avatar: '🌙',
          current_region: 'Darkwood',
          current_level: 1,
          unlocked_levels: [1],
          moon_shards: 0,
          score: 0
        });

        this.setCurrentUser(userObj);
        return { success: true, user: userObj };
      } catch (err) {
        console.error('Supabase register error:', err);
        return { success: false, message: err.message || 'Error connecting to Supabase.' };
      }
    }

    // B. Local Fallback (if Supabase not yet configured)
    const users = this.getUsers();
    if (users[trimmed.toLowerCase()]) {
      return { success: false, message: 'A traveler with this name already exists locally.' };
    }

    const localUser = {
      username: trimmed,
      password: password,
      avatar: '🌙',
      currentRegion: 'Darkwood',
      currentLevel: 1,
      unlockedLevels: [1],
      moonShards: 0,
      score: 0,
      isCloud: false
    };

    users[trimmed.toLowerCase()] = localUser;
    this.saveUsers(users);
    this.setCurrentUser(localUser);

    return { success: true, user: localUser };
  }

  // 2. SUPABASE & LOCAL LOGIN (Username & Password)
  async login(username, password) {
    const trimmed = (username || '').trim();
    if (!trimmed || !password) {
      return { success: false, message: 'Please enter both traveler name and password.' };
    }

    // A. If Supabase is connected
    if (window.supabaseService && window.supabaseService.isConfigured) {
      try {
        const client = window.supabaseService.client;
        const email = window.supabaseService.usernameToEmail(trimmed);

        const { data: authData, error: authError } = await client.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (authError) {
          return { success: false, message: authError.message };
        }

        // Fetch cloud profile
        const { data: profile } = await client
          .from('player_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const userObj = {
          id: authData.user.id,
          username: profile ? profile.username : trimmed,
          avatar: profile ? profile.avatar : '🌙',
          currentRegion: profile ? profile.current_region : 'Darkwood',
          currentLevel: profile ? profile.current_level : 1,
          unlockedLevels: profile && profile.unlocked_levels ? profile.unlocked_levels : [1],
          moonShards: profile ? profile.moon_shards : 0,
          score: profile ? profile.score : 0,
          isCloud: true
        };

        this.setCurrentUser(userObj);
        return { success: true, user: userObj };
      } catch (err) {
        console.error('Supabase login error:', err);
        return { success: false, message: err.message || 'Authentication error.' };
      }
    }

    // B. Local Fallback
    const users = this.getUsers();
    const user = users[trimmed.toLowerCase()];
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid name or secret key.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  // 3. Quick Guest Mode
  loginAsGuest() {
    const guestUser = {
      username: 'Traveler_' + Math.floor(1000 + Math.random() * 9000),
      avatar: '🌙',
      currentRegion: 'Darkwood',
      currentLevel: 1,
      unlockedLevels: [1],
      moonShards: 0,
      score: 0,
      isGuest: true,
      isCloud: false
    };
    this.setCurrentUser(guestUser);
    return guestUser;
  }

  // 4. Logout
  async logout() {
    if (window.supabaseService && window.supabaseService.isConfigured) {
      try {
        await window.supabaseService.client.auth.signOut();
      } catch (e) {}
    }
    this.setCurrentUser(null);
  }

  // 5. UPDATE & SYNC PROGRESSION TO SUPABASE
  async updateUserProgress(shardsDelta = 0, scoreDelta = 0, levelCleared = null) {
    const current = this.getCurrentUser();
    if (!current) return;

    current.moonShards = Math.max(0, (current.moonShards || 0) + shardsDelta);
    current.score = Math.max(0, (current.score || 0) + scoreDelta);

    if (levelCleared) {
      if (!current.unlockedLevels) current.unlockedLevels = [1];
      if (!current.unlockedLevels.includes(levelCleared + 1) && levelCleared < 5) {
        current.unlockedLevels.push(levelCleared + 1);
      }
      if (!current.completedLevels) current.completedLevels = [];
      if (!current.completedLevels.includes(levelCleared)) {
        current.completedLevels.push(levelCleared);
      }
    }

    this.setCurrentUser(current);

    // Sync to Supabase if logged in with cloud account
    if (current.isCloud && window.supabaseService && window.supabaseService.isConfigured && current.id) {
      try {
        await window.supabaseService.client.from('player_profiles').update({
          moon_shards: current.moonShards,
          score: current.score,
          unlocked_levels: current.unlockedLevels,
          current_level: levelCleared ? levelCleared + 1 : current.currentLevel
        }).eq('id', current.id);
        console.log('[Supabase] Progression synced to cloud!');
      } catch (e) {
        console.warn('[Supabase] Sync failed, saved locally:', e);
      }
    } else if (!current.isGuest) {
      // Save locally
      const users = this.getUsers();
      if (users[current.username.toLowerCase()]) {
        users[current.username.toLowerCase()] = current;
        this.saveUsers(users);
      }
    }

    return current;
  }

  // Local helper methods
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {}
  }

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...this.defaultSettings, ...JSON.parse(data) } : { ...this.defaultSettings };
    } catch (e) {
      return { ...this.defaultSettings };
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }
}

window.storageManager = new StorageManager();

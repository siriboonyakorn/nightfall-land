/* ==========================================================================
   NIGHT FALL LAND - Game Configuration & Constants (v2.0 – 8 Regions)
   ========================================================================== */

const GAME_CONFIG = {
  version: '2.0.0',
  title: 'Night Fall Land',
  subtitle: 'A pixel-art puzzle adventure where knowledge is your greatest ability',

  // 8 Regions spanning the full journey
  levels: [
    {
      id: 1,
      act: 'Region I',
      title: 'Darkwood: The Awakening',
      subtitle: 'Chamber 1 — Tutorial Glade',
      desc: 'Learn the fundamentals: movement, reading ancient stone tablets, pushing blocks onto pressure plates, and discovering Moon Shards.',
      targetShards: 1,
      difficulty: 'Tutorial',
      icon: '🌲',
      unlocked: true,
      completed: false
    },
    {
      id: 2,
      act: 'Region II',
      title: 'Moon Village',
      subtitle: 'Echoes of the Forgotten',
      desc: 'An abandoned settlement where symbols, notes, and combination locks hide deeper truths behind the eternal darkness.',
      targetShards: 3,
      difficulty: 'Novice',
      icon: '🌙',
      unlocked: false,
      completed: false
    },
    {
      id: 3,
      act: 'Region III',
      title: 'Old Factory',
      subtitle: 'Conveyors and Currents',
      desc: 'Reactivate forgotten generators, redirect light beams through mirrors, and operate heavy machinery to unlock sealed chambers.',
      targetShards: 4,
      difficulty: 'Intermediate',
      icon: '⚙️',
      unlocked: false,
      completed: false
    },
    {
      id: 4,
      act: 'Region IV',
      title: 'Frozen Peak',
      subtitle: 'Thermal Equilibrium',
      desc: 'Manipulate fire and ice — light braziers to melt barriers, slide across frozen tiles, and find warmth in the coldest dark.',
      targetShards: 5,
      difficulty: 'Advanced',
      icon: '❄️',
      unlocked: false,
      completed: false
    },
    {
      id: 5,
      act: 'Region V',
      title: 'The Deadlands',
      subtitle: 'Where Silence Burns',
      desc: 'A scorched wasteland riddled with teleporters and timed mechanisms. Step on the wrong plate and the sands swallow you.',
      targetShards: 5,
      difficulty: 'Advanced',
      icon: '🏜️',
      unlocked: false,
      completed: false
    },
    {
      id: 6,
      act: 'Region VI',
      title: 'The Lost City',
      subtitle: 'Ruined Luminance',
      desc: 'A subterranean city of ancient mirrors and light puzzles. Redirect beams of crystal light through maze-like corridors.',
      targetShards: 6,
      difficulty: 'Expert',
      icon: '🏛️',
      unlocked: false,
      completed: false
    },
    {
      id: 7,
      act: 'Region VII',
      title: 'Deep Night',
      subtitle: 'The Living Darkness',
      desc: 'Where Watcher Entities roam — shadow beings that dissolve on approach. NPCs whisper forbidden knowledge only discoverable by listening.',
      targetShards: 6,
      difficulty: 'Expert',
      icon: '👁️',
      unlocked: false,
      completed: false
    },
    {
      id: 8,
      act: 'Region VIII',
      title: 'The Void',
      subtitle: 'Convergence',
      desc: 'The ultimate trial. Every law of logic you have learned must be applied in perfect sequence. Only the worthy may see the dawn.',
      targetShards: 6,
      difficulty: 'Master',
      icon: '🌟',
      unlocked: false,
      completed: false
    }
  ],

  // Controls Reference
  keybindings: [
    { action: 'Move 4-Directions',      key: 'W, A, S, D / Arrows' },
    { action: 'Interact / Examine',     key: 'E / Space' },
    { action: 'Push Stone Block',       key: 'Walk into block' },
    { action: 'Restart Level',          key: 'R' },
    { action: 'Pause / Moon Sanctuary', key: 'ESC / P' }
  ],

  // Cosmetic Skins
  skins: [
    { id: 'default',    label: 'Wanderer',        color: '#00f0ff', req: null },
    { id: 'ember',      label: 'Ember Walker',    color: '#fb923c', req: 'secret_factory_hidden' },
    { id: 'frost',      label: 'Frost Pilgrim',   color: '#93c5fd', req: 'secret_peak_glacier' },
    { id: 'void',       label: 'Void Touched',    color: '#a78bfa', req: 'secret_void_eye' }
  ],

  // Cosmetic Trails
  trails: [
    { id: 'none',      label: 'None',             req: null },
    { id: 'moonDust',  label: 'Moon Dust',        req: 'complete_2' },
    { id: 'embers',    label: 'Ember Sparks',     req: 'complete_3' },
    { id: 'starfall',  label: 'Starfall',         req: 'complete_6' }
  ]
};

window.GAME_CONFIG = GAME_CONFIG;

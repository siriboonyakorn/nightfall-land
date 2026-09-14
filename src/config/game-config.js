/* ==========================================================================
   NIGHT FALL LAND - Game Configuration & Constants
   ========================================================================== */

const GAME_CONFIG = {
  version: '1.0.0',
  title: 'Night Fall Land',
  subtitle: 'A pixel-art puzzle adventure where knowledge is your greatest ability',

  // Levels & Regions
  levels: [
    {
      id: 1,
      act: 'Region I',
      title: 'Darkwood: The Awakening',
      subtitle: 'Chamber 1 — The Trial of Light',
      desc: 'Learn the fundamentals: 4-directional movement, recording clues in your Journal [J], weighting pressure plates, and reflecting celestial starlight beams with rotatable quartz mirrors.',
      targetShards: 1,
      difficulty: 'Tutorial',
      unlocked: true,
      completed: false
    },
    {
      id: 2,
      act: 'Region II',
      title: 'Moon Village',
      subtitle: 'The Astral Cipher',
      desc: 'An abandoned settlement where poetic verses reveal the sacred combination of 3 Astral Dial Pedestals, combined with courtyard laser deflection to open the Sunken Vault.',
      targetShards: 3,
      difficulty: 'Novice',
      unlocked: false,
      completed: false
    },
    {
      id: 3,
      act: 'Region III',
      title: 'Old Factory',
      subtitle: 'The Prism Circuit',
      desc: 'Reactivate forgotten steam turbines, route starlight beams around blast walls using dual quartz mirrors, and synchronize generator weight plates.',
      targetShards: 4,
      difficulty: 'Intermediate',
      unlocked: false,
      completed: false
    },
    {
      id: 4,
      act: 'Region IV',
      title: 'Frozen Peak',
      subtitle: 'The Thermal Riddle',
      desc: 'Balance thermal starlight beams, rotate cryo-mirrors across canyon chasms, and decipher ancient summit stelae to break the ice seals.',
      targetShards: 5,
      difficulty: 'Advanced',
      unlocked: false,
      completed: false
    },
    {
      id: 5,
      act: 'Region V',
      title: 'The Void',
      subtitle: 'The Grand Alignment',
      desc: 'The master trial combining 4-pillar Astral Ciphers, a 3-stage quartz mirror laser labyrinth, and cryptic constellation lore.',
      targetShards: 6,
      difficulty: 'Master',
      unlocked: false,
      completed: false
    }
  ],

  // Controls Reference
  keybindings: [
    { action: 'Move Up / Down / Left / Right', key: 'W, A, S, D / Arrows' },
    { action: 'Interact / Rotate Mirror / Turn Dial', key: 'E / Space' },
    { action: 'Push Stone Block / Quartz Mirror', key: 'Walk into block' },
    { action: 'Open Clue Journal & Codex', key: 'J' },
    { action: 'Restart Level Room', key: 'R' },
    { action: 'Pause Sanctuary', key: 'ESC / P' }
  ]
};

window.GAME_CONFIG = GAME_CONFIG;

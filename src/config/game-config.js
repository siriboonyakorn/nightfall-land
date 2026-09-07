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
      subtitle: 'Chamber 1 — Tutorial Glade',
      desc: 'Learn the fundamentals: 4-directional movement, reading ancient stone tablets, pushing heavy blocks onto pressure plates, and discovering Moon Shards.',
      targetShards: 1,
      difficulty: 'Tutorial',
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
      unlocked: false,
      completed: false
    },
    {
      id: 3,
      act: 'Region III',
      title: 'Old Factory',
      subtitle: 'Conveyors and Currents',
      desc: 'Reactivate forgotten generators, redirect electrical currents through conductive rails, and operate heavy machinery.',
      targetShards: 4,
      difficulty: 'Intermediate',
      unlocked: false,
      completed: false
    },
    {
      id: 4,
      act: 'Region IV',
      title: 'Frozen Peak',
      subtitle: 'Thermal Equilibrium',
      desc: 'Manipulate fire, ice, and melting water to flow through channels and activate weighted floating platforms.',
      targetShards: 5,
      difficulty: 'Advanced',
      unlocked: false,
      completed: false
    },
    {
      id: 5,
      act: 'Region V',
      title: 'The Void',
      subtitle: 'Beyond the Shadow',
      desc: 'The ultimate trial combining every law of logic and observation learned throughout your journey.',
      targetShards: 6,
      difficulty: 'Master',
      unlocked: false,
      completed: false
    }
  ],

  // Controls Reference
  keybindings: [
    { action: 'Move Up / Down / Left / Right', key: 'W, A, S, D / Arrows' },
    { action: 'Interact / Examine / Pull', key: 'E / Space' },
    { action: 'Push Stone Block', key: 'Walk into block' },
    { action: 'Restart Level', key: 'R' },
    { action: 'Pause Sanctuary', key: 'ESC / P' }
  ]
};

window.GAME_CONFIG = GAME_CONFIG;

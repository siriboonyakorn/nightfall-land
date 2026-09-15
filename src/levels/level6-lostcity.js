/* ==========================================================================
   NIGHT FALL LAND - Level 6: The Lost City (Ruined Luminance)
   Expert (~15-18 min):
   - Subterranean city of mirrors and light receptors
   - Redirect crystal beams through rotatable mirrors to energize receptors
   - Receptor-gated doors require all beams to align simultaneously
   - 6 Moon Shards, OwlNPC with cryptic beam hints, 2 secret walls
   ========================================================================== */

window.LEVEL_6_DATA = {
  id: 6,
  title: 'The Lost City: Ruined Luminance',
  act: 'Region VI',
  totalShards: 6,
  playerStart: { x: 100, y: 340 },

  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },
    { x: 40,   y: 652, width: 1200, height: 28 },
    { x: 40,   y: 40,  width: 28,   height: 640 },
    { x: 1212, y: 40,  width: 28,   height: 640 },

    // Maze corridors
    { x: 200, y: 68,  width: 24,  height: 260 },
    { x: 200, y: 440, width: 24,  height: 240 },
    { x: 440, y: 68,  width: 24,  height: 200 },
    { x: 440, y: 380, width: 24,  height: 300 },
    { x: 680, y: 68,  width: 24,  height: 160 },
    { x: 680, y: 320, width: 24,  height: 360 },
    { x: 920, y: 68,  width: 24,  height: 260 },
    { x: 920, y: 430, width: 24,  height: 240 },
    { x: 1160,y: 68,  width: 24,  height: 400 },

    // Horizontal dividers
    { x: 68,  y: 200, width: 200, height: 24 },
    { x: 200, y: 440, width: 240, height: 24 },
    { x: 440, y: 320, width: 240, height: 24 },
    { x: 680, y: 560, width: 240, height: 24 },
    { x: 920, y: 200, width: 240, height: 24 },
    { x: 920, y: 430, width: 240, height: 24 },

    // Pillar columns (ruins)
    { x: 140, y: 550, width: 36, height: 36 },
    { x: 340, y: 130, width: 36, height: 36 },
    { x: 560, y: 490, width: 36, height: 36 },
    { x: 800, y: 130, width: 36, height: 36 },
    { x: 800, y: 590, width: 36, height: 36 },
    { x: 1040,y: 540, width: 36, height: 36 },
  ],

  // Two emitters projecting beams
  emitters: [
    { x: 100, y: 150, direction: 'right', color: '#a78bfa' },
    { x: 500, y: 600, direction: 'up',    color: '#38bdf8' },
  ],

  // Mirrors (rotatable angles: 45° or 135° = \ or /)
  mirrors: [
    { x: 260, y: 144, angle: 45  },   // redirects right→down
    { x: 260, y: 380, angle: 135 },   // redirects down→right
    { x: 760, y: 596, angle: 45  },   // redirects up→right
    { x: 1060,y: 596, angle: 135 },   // redirects right→up
  ],

  // Receptors that must be energized to open doors
  receptors: [
    { x: 1100, y: 150, linkedId: 'recept_upper' },
    { x: 500,  y: 110, linkedId: 'recept_mid'   },
  ],

  // Compound rules: both receptors must be lit
  compoundRules: [
    {
      doorId: 'door_beam_gate_1',
      receptorIds: ['recept_upper']
    },
    {
      doorId: 'door_final_gate',
      receptorIds: ['recept_upper', 'recept_mid']
    }
  ],

  // Doors gated by receptors
  doors: [
    { x: 440, y: 230, width: 24, height: 90, linkedId: 'door_beam_gate_1', isCompound: true },
    { x: 920, y: 320, width: 24, height: 110, linkedId: 'door_final_gate', isCompound: true },
  ],

  // Pressure plates for the middle section
  plates: [
    { x: 600, y: 400, id: 'plate_mid', size: 48 },
  ],
  blocks: [
    { x: 590, y: 370 },
  ],
  levers: [
    { x: 1100, y: 380, id: 'lev_east_seal' },
  ],

  // Secret walls (concealed behind crumbled pillars)
  secretWalls: [
    { x: 352, y: 122, width: 48, height: 48, secretId: 'city_library_vault', title: 'Library Vault' },
    { x: 1032,y: 532, width: 48, height: 48, secretId: 'city_mirror_lab',   title: 'Mirror Laboratory' },
  ],

  // Tablets
  tablets: [
    { x: 140, y: 340, title: '📜 City Chronicle I', message: 'This city once harnessed starlight through crystal arrays. Each emitter projects a single beam. The mirrors bend it. A receptor only opens what it governs — and only when the light touches it.' },
    { x: 1060,y: 460, title: '📜 City Chronicle II', message: 'The ancient architects sealed the final chamber with a dual-beam lock. Both beams must arrive simultaneously. Adjust every mirror — order is everything.' },
  ],

  owls: [
    { x: 340, y: 435, hint: '"Hoo... The purple beam bends 90 degrees at every mirror... Hoo. Follow its path with your eyes before moving your feet."' },
  ],

  exit: { x: 1140, y: 350, width: 64, height: 80 },

  shards: [
    { x: 140,  y: 120 },
    { x: 380,  y: 600 },
    { x: 640,  y: 160 },
    { x: 860,  y: 550 },
    { x: 1060, y: 120 },
    { x: 500,  y: 380 },
  ],

  keys: [],
};

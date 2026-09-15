/* ==========================================================================
   NIGHT FALL LAND - Level 5: The Deadlands (Where Silence Burns)
   Advanced (~12-15 min):
   - Scorched wasteland with teleporter network puzzles
   - Timed pressure buttons that reset after 3 seconds
   - Secret walls hidden in charred ruins
   - 5 Moon Shards, dead-end passages, 2 NPCs with fragmented lore
   ========================================================================== */

window.LEVEL_5_DATA = {
  id: 5,
  title: 'The Deadlands: Where Silence Burns',
  act: 'Region V',
  totalShards: 5,
  playerStart: { x: 100, y: 350 },

  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },
    { x: 40,   y: 652, width: 1200, height: 28 },
    { x: 40,   y: 40,  width: 28,   height: 640 },
    { x: 1212, y: 40,  width: 28,   height: 640 },

    // Entrance corridor (west)
    { x: 68,  y: 280, width: 24,  height: 180 },
    { x: 68,  y: 460, width: 320, height: 24  },
    { x: 68,  y: 280, width: 180, height: 24  },

    // Central dividing wall
    { x: 480, y: 68,  width: 24,  height: 290 },
    { x: 480, y: 440, width: 24,  height: 240 },

    // East upper chamber
    { x: 760, y: 68,  width: 24,  height: 200 },
    { x: 760, y: 360, width: 24,  height: 120 },
    { x: 760, y: 68,  width: 480, height: 24  },
    { x: 1140,y: 68,  width: 24,  height: 350 },
    { x: 760, y: 480, width: 380, height: 24  },

    // Ruin columns
    { x: 200, y: 180, width: 40, height: 40 },
    { x: 340, y: 180, width: 40, height: 40 },
    { x: 200, y: 540, width: 40, height: 40 },
    { x: 600, y: 140, width: 40, height: 40 },
    { x: 600, y: 540, width: 40, height: 40 },
    { x: 900, y: 180, width: 40, height: 40 },
    { x: 1040,y: 180, width: 40, height: 40 },
    { x: 900, y: 580, width: 40, height: 40 },
    { x: 1040,y: 580, width: 40, height: 40 },

    // West-south passage wall
    { x: 380, y: 550, width: 120, height: 24 },
    { x: 380, y: 460, width: 24,  height: 90 },
  ],

  // Pushable blocks needed to weight timed buttons
  blocks: [
    { x: 270, y: 350 },
    { x: 870, y: 280 },
  ],

  // Pressure plates
  plates: [
    { x: 360, y: 356, id: 'plate_west', size: 48 },
  ],

  // Timed puzzle buttons
  buttons: [
    { x: 860, y: 300, linkedId: 'door_east_passage', duration: 4000, label: 'H' },
    { x: 960, y: 390, linkedId: 'door_east_gate',    duration: 3500, label: 'T' },
  ],

  // Doors
  doors: [
    { x: 248, y: 276, width: 24, height: 28, linkedId: 'plate_west' },
    { x: 480, y: 358, width: 24, height: 82, linkedId: 'door_east_passage', isCompound: false },
    { x: 760, y: 268, width: 24, height: 92, linkedId: 'door_east_gate', isCompound: false },
  ],

  // Levers
  levers: [
    { x: 860, y: 430, id: 'lev_west_seal' },
  ],

  compoundRules: [
    {
      doorId: 'door_final',
      plateIds: ['plate_west'],
      leverIds: ['lev_west_seal']
    }
  ],

  // Teleporter pairs (same id ↔ targetId links them)
  teleporters: [
    { x: 720, y: 590, id: 'tp_a', targetId: 'tp_b', color: '#fb923c' },
    { x: 1060,y: 540, id: 'tp_b', targetId: 'tp_a', color: '#fb923c' },
    { x: 560, y: 340, id: 'tp_c', targetId: 'tp_d', color: '#fbbf24' },
    { x: 680, y: 160, id: 'tp_d', targetId: 'tp_c', color: '#fbbf24' },
  ],

  // Secret walls hidden in ruined walls
  secretWalls: [
    { x: 380, y: 340, width: 48, height: 48, secretId: 'dead_ruin_cache', title: 'Ashen Cache' },
  ],

  // Lore Tablets
  tablets: [
    { x: 140, y: 340, title: '📜 Scorched Parchment', message: 'These ruins were alive once. The standing stones marked safe paths. The orange circles — they are gates carved by the last artificers. Step in, emerge elsewhere. The Deadlands are not as dead as they seem.' },
    { x: 1080,y: 430, title: '📜 Artificer's Codex I', message: 'We built the buttons as traps for the unwary. Only a weighted stone activates them long enough. A man cannot stand there forever — but a block can. Learn from the stone.' },
  ],

  // NPC: Wandering survivor
  wanderers: [
    { x: 540, y: 490, dialogue: [
      '"I mapped the orange circles," he says, hollow-eyed.',
      '"Step in one — you emerge from its twin. I survived three weeks that way.',
      '"The yellow ones? I never trusted yellow."'
    ]},
  ],

  // Exit
  exit: { x: 1130, y: 610, width: 64, height: 68 },

  // Shards
  shards: [
    { x: 160, y: 160 },
    { x: 580, y: 580 },
    { x: 880, y: 140 },
    { x: 1090,y: 300 },
    { x: 460, y: 230 },
  ],

  // Moon Key for the final sealed door
  keys: [
    { x: 740, y: 415 },
  ],
};

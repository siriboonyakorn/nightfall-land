/* ==========================================================================
   NIGHT FALL LAND - Level 7: Deep Night (The Living Darkness)
   Expert (~15-18 min):
   - Total atmospheric darkness with player-radius lighting
   - WatcherEntities patrol corridors; they dissolve when approached
   - OwlNPCs give fragmented hints about lever sequences
   - Fire braziers illuminate safe zones; some needed to solve ice paths
   - 6 Moon Shards hidden in the darkness, 3 secret walls
   ========================================================================== */

window.LEVEL_7_DATA = {
  id: 7,
  title: 'Deep Night: The Living Darkness',
  act: 'Region VII',
  totalShards: 6,
  playerStart: { x: 100, y: 340 },

  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },
    { x: 40,   y: 652, width: 1200, height: 28 },
    { x: 40,   y: 40,  width: 28,   height: 640 },
    { x: 1212, y: 40,  width: 28,   height: 640 },

    // Inner labyrinth — dark corridors
    { x: 200, y: 68,  width: 24,  height: 220 },
    { x: 200, y: 380, width: 24,  height: 300 },
    { x: 400, y: 180, width: 24,  height: 500 },
    { x: 620, y: 68,  width: 24,  height: 340 },
    { x: 620, y: 500, width: 24,  height: 180 },
    { x: 840, y: 200, width: 24,  height: 480 },
    { x: 1060,y: 68,  width: 24,  height: 260 },
    { x: 1060,y: 420, width: 24,  height: 260 },

    // Horizontal dividers
    { x: 68,  y: 450, width: 200, height: 24 },
    { x: 200, y: 250, width: 200, height: 24 },
    { x: 400, y: 450, width: 220, height: 24 },
    { x: 620, y: 250, width: 220, height: 24 },
    { x: 840, y: 580, width: 220, height: 24 },
    { x: 840, y: 150, width: 220, height: 24 },
    { x: 1060,y: 340, width: 180, height: 24 },

    // Alcoves and dead-ends
    { x: 110, y: 200, width: 90,  height: 24 },
    { x: 500, y: 550, width: 24,  height: 80  },
    { x: 960, y: 240, width: 100, height: 24  },
  ],

  // Fire braziers — provide light AND keep certain paths navigable
  braziers: [
    { x: 150, y: 350, isLit: false },
    { x: 310, y: 340, isLit: false },
    { x: 500, y: 400, isLit: true  },  // starts lit — safe zone marker
    { x: 730, y: 580, isLit: false },
    { x: 930, y: 400, isLit: false },
    { x: 1120,y: 580, isLit: false },
  ],

  // Watchers — shadow entities that dissolve when approached
  watchers: [
    { x: 310, y: 170 },
    { x: 510, y: 380 },
    { x: 730, y: 260 },
    { x: 950, y: 500 },
  ],

  // Levers — must be pulled in correct order to open the final door
  levers: [
    { x: 170,  y: 130, id: 'lev_I'   },
    { x: 480,  y: 510, id: 'lev_II'  },
    { x: 710,  y: 580, id: 'lev_III' },
    { x: 1110, y: 200, id: 'lev_IV'  },
  ],
  leverOrder: ['lev_II', 'lev_IV', 'lev_I', 'lev_III'],

  // Door opened by lever sequence
  doors: [
    { x: 840, y: 680, width: 24, height: 28, linkedId: 'lever_seq', isSequence: true },
    { x: 620, y: 408, width: 24, height: 92, linkedId: 'lev_I'  },
    { x: 200, y: 288, width: 24, height: 92, linkedId: 'lev_II' },
  ],

  blocks: [],
  plates: [],
  compoundRules: [],

  // Secret walls hidden in pitch-black alcoves
  secretWalls: [
    { x: 112, y: 192, width: 88,  height: 24, secretId: 'night_owl_nest',     title: "The Owl's Nest" },
    { x: 962, y: 232, width: 96,  height: 24, secretId: 'night_watcher_core', title: "Watcher's Core" },
    { x: 500, y: 542, width: 24,  height: 76, secretId: 'night_silent_door',  title: "Silent Passage" },
  ],

  tablets: [
    { x: 100, y: 560, title: '📜 Fragment of Dread', message: 'The Watchers do not attack. They observe. Something ancient commands them to stand. Approach and they crumble — but do not rush. Listen first. The sequence is written in the shadows.' },
    { x: 1080,y: 540, title: '📜 Last Chronicler', message: 'I pulled them in the wrong order seven times. They reset every time. Then I noticed: the number on each lever-stone corresponds to its pull-order only when read backwards from the final door.' },
  ],

  owls: [
    { x: 940, y: 350, hint: '"Hoo... Pull the second, then the fourth, then the first, then the third... Hoo. This is what remains in my memory."' },
  ],

  wanderers: [
    { x: 730, y: 415, dialogue: [
      '"Light the braziers first," she says, barely a whisper.',
      '"Without them you will lose your way.",
      '"The Watchers fear firelight. And so does the darkness."'
    ]},
  ],

  exit: { x: 1130, y: 600, width: 64, height: 80 },

  shards: [
    { x: 145, y: 300 },
    { x: 490, y: 140 },
    { x: 740, y: 130 },
    { x: 730, y: 490 },
    { x: 1110,y: 420 },
    { x: 930, y: 560 },
  ],

  keys: [
    { x: 1100, y: 570 },
  ],
};

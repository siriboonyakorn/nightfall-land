/* ==========================================================================
   NIGHT FALL LAND - Level 2: Moon Village (The Twin Guardians)
   Novice Level (8–12 min):
   - Dual-Block routing into North & South sections with corner deadlock risk
   - Compound gate requiring both plate_north AND plate_south simultaneously
   - 3-Lever lunar sequence (Crescent -> Half -> Full) with cryptic tablet lore
   - Key collection, 3 hidden Moon Shards (including 1 red-herring detour), exit
   ========================================================================== */

window.LEVEL_2_DATA = {
  id: 2,
  title: 'Moon Village: The Twin Guardians',
  act: 'Region II',
  totalShards: 3,
  playerStart: { x: 110, y: 340 },

  // Walls & Chamber Architecture
  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },   // top
    { x: 40,   y: 652, width: 1200, height: 28 },   // bottom
    { x: 40,   y: 40,  width: 28,   height: 640 },  // left
    { x: 1212, y: 40,  width: 28,   height: 640 },  // right

    // Divider 1: Room 1 -> Room 2
    // Top segment (y 40 to 200)
    { x: 260, y: 40,  width: 24, height: 160 },
    // Middle barrier separating upper & lower entrances (y 280 to 380)
    { x: 260, y: 280, width: 24, height: 100 },
    // Bottom segment (y 470 to 680)
    { x: 260, y: 470, width: 24, height: 210 },
    // Gaps: upper at y 200-280, lower at y 380-470

    // Room 2 Internal Horizontal Divider (Splits North and South Sections)
    // Leaves a 90px vertical gap at x 470-560 connecting north and south
    { x: 284, y: 330, width: 200, height: 24 },

    // Divider 2: Room 2 -> Room 3 (Dual Guardian Compound Gate)
    { x: 560, y: 40,  width: 24, height: 250 },
    { x: 560, y: 410, width: 24, height: 270 },
    // Door 'gate_twins' occupies y 290-410 (gap 120px)

    // Room 3 & 4 Internal Separators
    { x: 740, y: 40,  width: 24, height: 220 },
    { x: 740, y: 380, width: 24, height: 180 },
    // Dead-end alcove wall creating red herring shard passage at bottom
    { x: 584, y: 560, width: 180, height: 24 },

    // Divider 3: Room 4 -> Room 5 (Lever Sequence Gate)
    { x: 1000, y: 40,  width: 24, height: 250 },
    { x: 1000, y: 410, width: 24, height: 270 },
    // Door 'lever_seq' occupies y 290-410 (gap 120px)

    // Room 5 Final Golden Gate Enclosure
    { x: 1110, y: 40,  width: 24, height: 250 },
    { x: 1110, y: 410, width: 24, height: 270 },
  ],

  // Pushable Stone Blocks (Annotated with puzzle roles)
  blocks: [
    // Block_Gold: Upper corridor entry, destined for plate_north
    { x: 140, y: 220, size: 44 },
    // Block_Silver: Lower corridor entry, destined for plate_south
    { x: 140, y: 400, size: 44 }
  ],

  // Pressure Plates
  plates: [
    // Plate_North in Northern half of Room 2
    { x: 420, y: 150, id: 'plate_north', size: 48 },
    // Plate_South in Southern half of Room 2
    { x: 420, y: 500, id: 'plate_south', size: 48 }
  ],

  // Doors / Barriers
  doors: [
    // Dual-Plate Compound Gate to Room 3: requires plate_north AND plate_south simultaneously
    { x: 560, y: 290, width: 24, height: 120, linkedId: 'gate_twins', requiresKey: false },

    // 3-Lever Sequence Gate to Sanctuary: opened when levers pulled in sequence A -> B -> C
    { x: 1000, y: 290, width: 24, height: 120, linkedId: 'lever_seq', requiresKey: false },

    // Key-locked Golden Gate to Exit Portal
    { x: 1110, y: 290, width: 24, height: 120, linkedId: 'village_exit_gate', requiresKey: true }
  ],

  // Levers (Moon Phases: Crescent A, Half B, Full C)
  levers: [
    { x: 650, y: 120, id: 'lever_crescent' },  // Phase 1 (A)
    { x: 880, y: 480, id: 'lever_half' },      // Phase 2 (B)
    { x: 880, y: 140, id: 'lever_full' }       // Phase 3 (C)
  ],

  // Correct Lever Sequence Order: Crescent -> Half -> Full
  leverOrder: ['lever_crescent', 'lever_half', 'lever_full'],

  // Ancient Lore & Clue Tablets
  tablets: [
    {
      x: 100, y: 120,
      title: 'Tablet of the Twin Sentinels',
      message: 'Ancient Village Inscription:\n\n"The gold sentinel watches the north star.\nThe silver one, the southern sea."\n\nPush each stone block to its dedicated sector. Pushing a block into the wrong zone will jam the mechanism forever [Press R to Reset].'
    },
    {
      x: 620, y: 260,
      title: 'Lunar Codex: Fragment I',
      message: 'Codex of the Night:\n\n"When all light fades, the Crescent Moon (W) must ignite first before the night matures..."'
    },
    {
      x: 820, y: 380,
      title: 'Lunar Codex: Fragment II',
      message: 'Codex of the Night:\n\n"...Then the Half Moon (S) shines across the central expanse..."'
    },
    {
      x: 920, y: 260,
      title: 'Lunar Codex: Fragment III',
      message: 'Codex of the Night:\n\n"...And finally the Full Moon (N) commands the celestial gate to open. Any deviation shatters the resonance."'
    }
  ],

  // Pickups
  keys: [
    // Moon Key located inside Room 4 / Sanctuary antechamber
    { x: 1050, y: 160 }
  ],
  shards: [
    // Shard 1: Hidden in south dead-end red-herring passage
    { x: 620, y: 600 },
    // Shard 2: Hidden in Room 4 north alcove
    { x: 940, y: 80 },
    // Shard 3: Inside Sanctuary behind the sequence gate
    { x: 1060, y: 520 }
  ],

  // Exit Portal
  exit: { x: 1145, y: 310, width: 50, height: 80 },

  // Compound Gate Rules
  compoundRules: [
    // Gate to Room 3 opens ONLY when BOTH northern and southern plates are pressed
    { doorId: 'gate_twins', type: 'and', plateIds: ['plate_north', 'plate_south'] }
  ]
};

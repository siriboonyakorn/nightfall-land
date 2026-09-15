/* ==========================================================================
   NIGHT FALL LAND - Level 3: Old Factory (Generator Array)
   Intermediate Level (10–14 min):
   - 4 generator plates must ALL be active simultaneously
   - Only 3 blocks available at start; Block D locked in maintenance bay
   - Maintenance lever locked behind sub-gate requiring Gen 1 + Gen 2 active
   - Gen 4 approach routing: narrow dead-end alcove accessible only from SOUTH
   - Master gate requires all 4 generators active AND Master Switch pulled
   - 4 Moon Shards hidden in maintenance alcoves, Moon Key, and Exit
   ========================================================================== */

window.LEVEL_3_DATA = {
  id: 3,
  title: 'Old Factory: Generator Array',
  act: 'Region III',
  totalShards: 4,
  playerStart: { x: 110, y: 340 },

  // Walls & Factory Geometry
  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },   // top
    { x: 40,   y: 652, width: 1200, height: 28 },   // bottom
    { x: 40,   y: 40,  width: 28,   height: 640 },  // left
    { x: 1212, y: 40,  width: 28,   height: 640 },  // right

    // Divider 1: Bay 1 -> Maintenance & Storage (x = 300)
    { x: 300, y: 40,  width: 24, height: 180 },   // top
    { x: 300, y: 320, width: 24, height: 180 },   // middle
    { x: 300, y: 570, width: 24, height: 110 },   // bottom
    // Gaps: y 220-320 (Sub-gate gate_sub), y 500-570 (lower walkthrough)

    // Maintenance Lever Room Horizontal Wall (separating lever room from Block D bay)
    { x: 324, y: 300, width: 196, height: 24 },

    // Divider 2: Maintenance Bay -> Factory Floor (x = 520)
    { x: 520, y: 40,  width: 24, height: 284 },   // seals maintenance lever room east
    { x: 520, y: 324, width: 24, height: 150 },   // upper segment of Block D bay
    { x: 520, y: 560, width: 24, height: 120 },   // lower segment of Block D bay
    // Door 'lever_maint' at y 474-560 (gap 86px)

    // Machinery Partitions in Middle Factory Floor (x: 544 to 840)
    { x: 700, y: 100, width: 24, height: 240 },
    { x: 544, y: 360, width: 180, height: 24 },

    // Gen 4 Alcove Enclosure (South-only entry!)
    // North wall blocking entry from top
    { x: 860, y: 360, width: 160, height: 24 },
    // West wall of alcove
    { x: 860, y: 360, width: 24,  height: 160 },
    // East wall of alcove
    { x: 996, y: 360, width: 24,  height: 160 },
    // Opening at y 520-652 on the south side

    // Divider 3: Factory Floor -> Main Vault (x = 1040)
    { x: 1040, y: 40,  width: 24, height: 240 },
    { x: 1040, y: 400, width: 24, height: 280 },
    // Door 'master_gate' at y 280-400 (gap 120px)

    // Vault Final Golden Gate Enclosure
    { x: 1130, y: 40,  width: 24, height: 250 },
    { x: 1130, y: 410, width: 24, height: 270 }
  ],

  // Pushable Stone Blocks (size = 44)
  blocks: [
    // Block A: Bay 1, for Gen 1 plate
    { x: 120, y: 200, size: 44 },
    // Block B: Bay 1, for Gen 2 plate
    { x: 120, y: 440, size: 44 },
    // Block C: Middle floor, for Gen 3 plate
    { x: 600, y: 480, size: 44 },
    // Block D: Locked in Maintenance Bay, for Gen 4 plate
    { x: 380, y: 480, size: 44 }
  ],

  // Generator Pressure Plates
  plates: [
    { x: 210, y: 160, id: 'gen_1', size: 48 },  // Generator 1
    { x: 210, y: 480, id: 'gen_2', size: 48 },  // Generator 2
    { x: 620, y: 180, id: 'gen_3', size: 48 },  // Generator 3
    { x: 920, y: 440, id: 'gen_4', size: 48 }   // Generator 4 (South entry only)
  ],

  // Doors / Barriers
  doors: [
    // Sub-gate to Maintenance Lever Room: opens when Gen 1 AND Gen 2 are both active
    { x: 300, y: 220, width: 24, height: 100, linkedId: 'gate_sub', requiresKey: false },

    // Maintenance Bay Door: unlocks when lever_maint is pulled
    { x: 520, y: 474, width: 24, height: 86, linkedId: 'lever_maint', requiresKey: false },

    // Master Power Gate: opens when all 4 generators active AND master switch pulled
    { x: 1040, y: 280, width: 24, height: 120, linkedId: 'master_gate', requiresKey: false },

    // Golden Gate to Exit Portal
    { x: 1130, y: 290, width: 24, height: 120, linkedId: 'factory_exit_gate', requiresKey: true }
  ],

  // Levers
  levers: [
    // Maintenance lever inside sub-gate room
    { x: 420, y: 120, id: 'lever_maint' },
    // Master power switch in upper machinery floor
    { x: 920, y: 140, id: 'lever_master' }
  ],

  // Ancient Lore & Operation Manuals
  tablets: [
    {
      x: 100, y: 100,
      title: 'Workshop Manual: Coupling I',
      message: 'Factory Instruction Manual:\n\n"Generators 1 and 2 couple to the maintenance sub-gate. Weight both plates simultaneously to unlock the auxiliary breaker chamber."'
    },
    {
      x: 360, y: 100,
      title: 'Breaker Console Notice',
      message: 'Maintenance Notice:\n\n"Pulling Breaker #1 releases Block D from quarantine bay. Backtrack south to guide the fourth block into the array."'
    },
    {
      x: 580, y: 100,
      title: 'Engineering Directive: Gen 4',
      message: 'Safety Bulletin:\n\n"The fourth generator accepts load only from the southern corridor intake. Approaching from north will jam the chassis against the bulkhead."'
    },
    {
      x: 880, y: 80,
      title: 'Master Array Overview',
      message: 'Master Circuit Spec:\n\n"When all four generators hum with power, engage the Master Switch to breach the high-voltage vault."'
    }
  ],

  // Pickups
  keys: [
    // Moon Key inside Main Vault
    { x: 1080, y: 180 }
  ],
  shards: [
    // Shard 1: In Maintenance Lever Room
    { x: 480, y: 220 },
    // Shard 2: In Block D Storage Bay
    { x: 460, y: 600 },
    // Shard 3: In Middle Machinery Alcove
    { x: 640, y: 80 },
    // Shard 4: In Main Vault
    { x: 1080, y: 560 }
  ],

  // Exit Portal
  exit: { x: 1155, y: 310, width: 50, height: 80 },

  // Compound Gate Rules
  compoundRules: [
    // Sub-gate requires Gen 1 AND Gen 2 pressed
    { doorId: 'gate_sub', type: 'and', plateIds: ['gen_1', 'gen_2'] },
    // Master gate requires Gen 1, Gen 2, Gen 3, Gen 4 AND lever_master pulled
    { doorId: 'master_gate', type: 'and', plateIds: ['gen_1', 'gen_2', 'gen_3', 'gen_4'], leverIds: ['lever_master'] }
  ]
};

/* ==========================================================================
   NIGHT FALL LAND - Level 4: Frozen Peak (The Summit Gate)
   Advanced Level (12–15 min):
   - Non-linear 6-chamber hub architecture around central glacial hub
   - Multi-chamber stone block transport problem across icy bottlenecks
   - One-way crystal switch: opens shortcut to Room 5 but permanently closes
     western access route (premature activation locks required block!)
   - Summit Gate compound rule: requires summit_c AND summit_d pressed
     simultaneously PLUS summit_lever pulled
   - Key collection, 5 hidden Moon Shards, golden gate, and exit portal
   ========================================================================== */

window.LEVEL_4_DATA = {
  id: 4,
  title: 'Frozen Peak: The Summit Gate',
  act: 'Region IV',
  totalShards: 5,
  playerStart: { x: 110, y: 500 },

  // Walls & Glacial Cavern Architecture
  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },   // top
    { x: 40,   y: 652, width: 1200, height: 28 },   // bottom
    { x: 40,   y: 40,  width: 28,   height: 640 },  // left
    { x: 1212, y: 40,  width: 28,   height: 640 },  // right

    // West Chamber Split (Room 1 Base Camp vs Room 2 NW Shrine)
    { x: 40,   y: 350, width: 380, height: 24 },   // horizontal divider between R1 and R2
    // Vertical wall between West chambers (R1/R2) and Central Hub (x = 420)
    { x: 420,  y: 40,  width: 24,  height: 180 },  // top NW shrine wall
    { x: 420,  y: 280, width: 24,  height: 160 },  // mid hub wall
    { x: 420,  y: 500, width: 24,  height: 180 },  // bottom SW base camp wall
    // Door 'door_cryo' at y 220-280 (gap 60px)

    // North Cavern (Room 3) boundaries (x: 420 to 760, y: 40 to 240)
    { x: 420,  y: 220, width: 340, height: 24 },   // horizontal barrier separating R3 from Hub
    // East wall of North Cavern (x = 760)
    { x: 760,  y: 40,  width: 24,  height: 80 },
    { x: 760,  y: 180, width: 24,  height: 180 },
    // Door 'door_shortcut' at y 120-180 (gap 60px)

    // Central Hub to East Chambers (x = 760)
    { x: 760,  y: 360, width: 24,  height: 120 },
    { x: 760,  y: 560, width: 24,  height: 120 },
    // Door 'door_west_access' at y 480-560 (gap 80px)

    // Horizontal divider between NE Sanctuary (R4) and East Plateau (R5)
    { x: 760,  y: 350, width: 260, height: 24 },

    // Divider to Final Summit Gate Chamber (x = 1020)
    { x: 1020, y: 40,  width: 24,  height: 250 },
    { x: 1020, y: 410, width: 24,  height: 270 },
    // Door 'summit_gate' at y 290-410 (gap 120px)

    // Final Golden Gate Partition inside Summit Chamber
    { x: 1120, y: 40,  width: 24,  height: 260 },
    { x: 1120, y: 410, width: 24,  height: 270 }
  ],

  // Pushable Stone Blocks (5 blocks total)
  blocks: [
    // Block A: In SW Base Camp (Room 1)
    { x: 200, y: 460, size: 44 },
    // Block B: In NW Shrine (Room 2)
    { x: 260, y: 240, size: 44 },
    // Block C: In North Cavern (Room 3)
    { x: 500, y: 150, size: 44 },
    // Block D: In NE Glacial Sanctuary (Room 4)
    { x: 880, y: 220, size: 44 },
    // Block E: On East Plateau (Room 5) - Key block that must cross Hub
    { x: 860, y: 460, size: 44 }
  ],

  // Pressure Plates
  plates: [
    // Cryo Plate in NW Shrine: opens door to Central Hub
    { x: 180, y: 160, id: 'cryo_a', size: 48 },
    // Secondary Cryo Plate in NW Shrine
    { x: 320, y: 160, id: 'cryo_b', size: 48 },
    // Summit Plate C: in final approach
    { x: 1060, y: 180, id: 'summit_c', size: 48 },
    // Summit Plate D: in final approach
    { x: 1060, y: 480, id: 'summit_d', size: 48 }
  ],

  // Doors / Barriers
  doors: [
    // Cryo Gate: opens when cryo_a plate is weighted
    { x: 420, y: 220, width: 24, height: 60, linkedId: 'cryo_a', requiresKey: false },

    // Shortcut Gate between Room 3 and Room 4: opens when crystal switch is pulled
    { x: 760, y: 120, width: 24, height: 60, linkedId: 'door_shortcut', requiresKey: false },

    // Western Access Gate: normally OPEN, permanently CLOSES if crystal switch is pulled
    { x: 760, y: 480, width: 24, height: 80, linkedId: 'door_west_access', requiresKey: false },

    // Summit Master Gate: requires summit_c AND summit_d simultaneously PLUS summit_lever
    { x: 1020, y: 290, width: 24, height: 120, linkedId: 'summit_gate', requiresKey: false },

    // Golden Gate to Summit Exit Portal
    { x: 1120, y: 290, width: 24, height: 120, linkedId: 'summit_key_gate', requiresKey: true }
  ],

  // Levers
  levers: [
    // Crystal switch in Room 3 (One-Way Lever)
    { x: 620, y: 90,  id: 'lever_shortcut' },
    // Master Summit Lever in Summit Chamber
    { x: 1070, y: 90, id: 'summit_lever' }
  ],

  // Ancient Tablets & Lore Signposts
  tablets: [
    {
      x: 100, y: 420,
      title: 'Base Camp Journal',
      message: 'Expedition Journal:\n\n"The glacial passages of Frozen Peak form an interconnected loop. Pushing a boulder into a corner slot traps it against ice forever [Press R to Reset]."'
    },
    {
      x: 100, y: 100,
      title: 'Shrine of Thermal Balance',
      message: 'Shrine Inscription:\n\n"Weight on the western cryo-plate releases the seal into the Central Hub. Guard your stones carefully."'
    },
    {
      x: 480, y: 90,
      title: 'Warning: Crystal Mechanism',
      message: 'Summit Guide Caution:\n\n"The Crystal Switch in this cavern opens the high eastern shortcut, but triggers an avalanche that PERMANENTLY SEALS the lower western archway. Transport the eastern boulder through first!"'
    },
    {
      x: 820, y: 90,
      title: 'Sanctuary Relic Cache',
      message: 'Relic Inscription:\n\n"Here lies the Moon Key of the Peak. It alone unseals the portal to the stars once the summit gate yields."'
    },
    {
      x: 820, y: 420,
      title: 'Plateau Quarry Note',
      message: 'Miner\'s Log:\n\n"This southern boulder must travel west through the lower archway into the hub, then eastward to the Summit Gate."'
    }
  ],

  // Pickups
  keys: [
    // Moon Key in NE Sanctuary (Room 4)
    { x: 880, y: 140 }
  ],
  shards: [
    // Shard 1: In SW Base Camp
    { x: 110, y: 600 },
    // Shard 2: In NW Shrine
    { x: 340, y: 90 },
    // Shard 3: In North Cavern
    { x: 700, y: 90 },
    // Shard 4: In East Plateau
    { x: 960, y: 580 },
    // Shard 5: In Summit Chamber
    { x: 1070, y: 580 }
  ],

  // Exit Portal
  exit: { x: 1155, y: 310, width: 50, height: 80 },

  // Compound Gate Rules
  compoundRules: [
    // Shortcut opens when crystal switch is active
    { doorId: 'door_shortcut', type: 'and', leverIds: ['lever_shortcut'] },
    // Western access closes when crystal switch is active (not_lever rule)
    { doorId: 'door_west_access', type: 'not_lever', leverId: 'lever_shortcut' },
    // Summit Gate requires summit_c AND summit_d AND summit_lever
    { doorId: 'summit_gate', type: 'and', plateIds: ['summit_c', 'summit_d'], leverIds: ['summit_lever'] }
  ]
};

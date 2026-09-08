/* ==========================================================================
   NIGHT FALL LAND - Level 5: The Void (Convergence)
   Master Level (15–20 min):
   - 3-Chamber hub structure requiring mastery of all core puzzle laws
   - Chamber 1: Multi-block pressure coordination unlocking Moon Key A
   - Chamber 2: Block staging alignment puzzle across narrow void corridors
   - Chamber 3: 4-Lever Sequence (I -> III -> II -> IV) with lore split
     across 6 cryptic tablets; wrong order resets all levers
   - Central Nexus: Dual sequential key-locked gates (Key A then Key B)
   - 6 hidden Moon Shards, red-herring dead-ends, and the ultimate Exit Portal
   ========================================================================== */

window.LEVEL_5_DATA = {
  id: 5,
  title: 'The Void: Convergence',
  act: 'Region V',
  totalShards: 6,
  playerStart: { x: 100, y: 340 },

  // Walls & Void Labyrinth Architecture
  walls: [
    // Outer perimeter
    { x: 40,   y: 40,  width: 1200, height: 28 },   // top
    { x: 40,   y: 652, width: 1200, height: 28 },   // bottom
    { x: 40,   y: 40,  width: 28,   height: 640 },  // left
    { x: 1212, y: 40,  width: 28,   height: 640 },  // right

    // Chamber 1 (SW) Enclosure (x: 40 to 440, y: 400 to 652)
    { x: 40,   y: 400, width: 380, height: 24 },
    { x: 420,  y: 400, width: 24,  height: 140 },
    { x: 420,  y: 600, width: 24,  height: 80 },
    // Door 'door_key_a' at y 540-600 (gap 60px)

    // Chamber 2 (NW) Enclosure (x: 40 to 440, y: 40 to 280)
    { x: 40,   y: 280, width: 320, height: 24 },
    { x: 420,  y: 40,  width: 24,  height: 264 },

    // Central Nexus Corridor Barriers (x: 440 to 760)
    { x: 560,  y: 180, width: 24,  height: 240 },
    { x: 560,  y: 480, width: 24,  height: 180 },
    // Red-herring dead end barrier in central nexus
    { x: 640,  y: 280, width: 120, height: 24 },

    // Chamber 3 (East) Enclosure (x: 760 to 980)
    { x: 760,  y: 40,  width: 24,  height: 220 },
    { x: 760,  y: 360, width: 24,  height: 140 },
    { x: 760,  y: 560, width: 24,  height: 120 },
    // Door 'void_lever_seq' at x 880, y 470-550
    { x: 880,  y: 400, width: 24,  height: 70 },
    { x: 880,  y: 550, width: 24,  height: 130 },

    // Final Void Gate Antechamber (x = 1000)
    { x: 1000, y: 40,  width: 24,  height: 240 },
    { x: 1000, y: 380, width: 24,  height: 300 },
    // Door 'void_gate_1' at y 280-380 (gap 100px)

    // Second Golden Gate Barrier (x = 1080)
    { x: 1080, y: 40,  width: 24,  height: 240 },
    { x: 1080, y: 380, width: 24,  height: 300 }
    // Door 'void_gate_2' at y 280-380 (gap 100px)
  ],

  // Pushable Stone Blocks (5 blocks across chambers)
  blocks: [
    // Chamber 1 blocks for plates void_plate_a1 & void_plate_a2
    { x: 160, y: 460, size: 44 },
    { x: 280, y: 460, size: 44 },

    // Chamber 2 blocks for void alignment
    { x: 140, y: 200, size: 44 },
    { x: 260, y: 200, size: 44 },

    // Central Nexus wandering block
    { x: 480, y: 330, size: 44 }
  ],

  // Pressure Plates
  plates: [
    // Chamber 1 Plates: both required to open door_key_a
    { x: 160, y: 570, id: 'void_plate_a1', size: 48 },
    { x: 340, y: 570, id: 'void_plate_a2', size: 48 },

    // Chamber 2 Alignment Plates
    { x: 180, y: 120, id: 'void_p_b1', size: 48 },
    { x: 320, y: 120, id: 'void_p_b2', size: 48 }
  ],

  // Doors / Barriers
  doors: [
    // Chamber 1 Key A Vault Gate: requires void_plate_a1 AND void_plate_a2
    { x: 420, y: 540, width: 24, height: 60, linkedId: 'door_key_a', requiresKey: false },

    // Chamber 3 Key B Sequence Gate: opens when levers pulled in sequence (I -> III -> II -> IV)
    { x: 880, y: 470, width: 24, height: 80, linkedId: 'void_lever_seq', requiresKey: false },

    // Void Gate 1: First sequential key gate (requires Moon Key A)
    { x: 1000, y: 280, width: 24, height: 100, linkedId: 'void_gate_1', requiresKey: true },

    // Void Gate 2: Second sequential key gate (requires Moon Key B)
    { x: 1080, y: 280, width: 24, height: 100, linkedId: 'void_gate_2', requiresKey: true }
  ],

  // 4 Levers (Chamber 3)
  levers: [
    { x: 640, y: 120, id: 'lever_void_1' },  // Lever I
    { x: 820, y: 120, id: 'lever_void_2' },  // Lever II
    { x: 640, y: 520, id: 'lever_void_3' },  // Lever III
    { x: 820, y: 340, id: 'lever_void_4' }   // Lever IV
  ],

  // Master Lever Sequence: I -> III -> II -> IV
  leverOrder: ['lever_void_1', 'lever_void_3', 'lever_void_2', 'lever_void_4'],

  // Ancient Tablets (Cryptic Lore Fragments)
  tablets: [
    {
      x: 100, y: 430,
      title: 'Voice of the Void I',
      message: 'Cryptic Inscription:\n\n"After the silence comes the First Voice [I]. It speaks before any other."'
    },
    {
      x: 100, y: 120,
      title: 'Voice of the Void II',
      message: 'Cryptic Inscription:\n\n"The Third Echo [III] answers the first directly, skipping the second in the cosmic weave."'
    },
    {
      x: 620, y: 220,
      title: 'Voice of the Void III',
      message: 'Cryptic Inscription:\n\n"Only when the third has echoed does the Second Whisper [II] dare respond."'
    },
    {
      x: 820, y: 220,
      title: 'Voice of the Void IV',
      message: 'Cryptic Inscription:\n\n"And the Fourth Sign [IV] seals the boundary and unlocks the reliquary of Key B."'
    },
    {
      x: 480, y: 240,
      title: 'Nexus Tablet: The Two Keys',
      message: 'Astral Decree:\n\n"The Void Portal is shielded behind Dual Astral Seals. Key A lies in the south; Key B within the lever sanctuary. Both are required."'
    },
    {
      x: 940, y: 200,
      title: 'Final Inscription of Light',
      message: 'Ancient Farewell:\n\n"You who stand before the final gate have proven that knowledge alone pierces eternal night. Step forth and reclaim the dawn."'
    }
  ],

  // 2 Moon Keys (Key A in Chamber 1, Key B in Chamber 3)
  keys: [
    { x: 260, y: 580 },  // Key A
    { x: 930, y: 500 }   // Key B
  ],

  // 6 Moon Shards
  shards: [
    // Shard 1: In Chamber 1
    { x: 90,  y: 580 },
    // Shard 2: In Chamber 2
    { x: 90,  y: 100 },
    // Shard 3: In northern fissure dead-end
    { x: 450, y: 80 },
    // Shard 4: In Chamber 3 reliquary
    { x: 930, y: 600 },
    // Shard 5: In Central Nexus fissure
    { x: 620, y: 350 },
    // Shard 6: In Final Sanctuary alcove
    { x: 1150, y: 140 }
  ],

  // Exit Portal
  exit: { x: 1145, y: 290, width: 50, height: 80 },

  // Compound Gate Rules
  compoundRules: [
    // Chamber 1 Key A Vault requires both plates pressed
    { doorId: 'door_key_a', type: 'and', plateIds: ['void_plate_a1', 'void_plate_a2'] }
  ]
};

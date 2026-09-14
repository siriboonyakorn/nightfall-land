/* ==========================================================================
   NIGHT FALL LAND - High-Fidelity World & Multi-Tier Puzzle Chambers
   Procedural stone flagstone floors, 3D masonry walls, torch sconces,
   celestial laser optics, astral cipher pedestals, and cryptic clue lore.
   ========================================================================== */

class World {
  constructor(levelId = 1) {
    this.width = 1280;
    this.height = 720;
    this.levelId = levelId;

    this.walls = [];
    this.blocks = [];
    this.plates = [];
    this.doors = [];
    this.levers = [];
    this.tablets = [];
    this.keys = [];
    this.shards = [];
    this.exit = null;

    // Advanced Mechanics
    this.torches = [];
    this.lightEmitters = [];
    this.quartzMirrors = [];
    this.lightReceptors = [];
    this.astralDials = [];
    this.cipherLocks = [];
    this.optics = new window.OpticsEngine();

    this.totalShards = 1;
    this.animTime = 0;

    switch (levelId) {
      case 2:  this.buildMoonVillage();  break;
      case 3:  this.buildOldFactory();   break;
      case 4:  this.buildFrozenPeak();   break;
      case 5:  this.buildTheVoid();      break;
      default: this.buildDarkwoodTutorial(); break;
    }
  }

  /* =========================================================
     LEVEL 1 — Darkwood: The Awakening
     Teaches: Movement, Clue Journal [J], Block Pushing,
              and the FIRST Celestial Light Beam & Mirror Reflection!
     ========================================================= */
  buildDarkwoodTutorial() {
    this.totalShards = 1;

    // ── Outer Boundary ──────────────────────────────────────
    this.walls = [
      { x: 40,   y: 60,  width: 1200, height: 28  },
      { x: 40,   y: 632, width: 1200, height: 28  },
      { x: 40,   y: 60,  width: 28,   height: 600 },
      { x: 1212, y: 60,  width: 28,   height: 600 },

      // Divider 1: Room 1 -> Room 2
      { x: 290, y: 60,  width: 24, height: 200 },
      { x: 290, y: 380, width: 24, height: 280 },

      // Divider 2: Room 2 -> Room 3 (Optics Chamber)
      { x: 600, y: 60,  width: 24, height: 220 },
      { x: 600, y: 400, width: 24, height: 260 },

      // Divider 3: Room 3 -> Alcove
      { x: 910, y: 60,  width: 24, height: 210 },
      { x: 910, y: 410, width: 24, height: 250 },

      // Alcove inner wall
      { x: 740, y: 380, width: 170, height: 24 },

      // Divider 4: Alcove -> Final Exit Room
      { x: 1040, y: 60,  width: 24, height: 200 },
      { x: 1040, y: 460, width: 24, height: 200 },
    ];

    // ── Wall Torch Sconces (Amber Ambient Lights) ─────────────
    this.torches = [
      { x: 160, y: 88, radius: 120 },
      { x: 450, y: 88, radius: 120 },
      { x: 760, y: 88, radius: 130 },
      { x: 1120, y: 88, radius: 130 },
      { x: 160, y: 610, radius: 110 },
      { x: 450, y: 610, radius: 110 },
      { x: 820, y: 610, radius: 120 },
      { x: 1120, y: 610, radius: 120 },
    ];

    // ── Tablets with Clues & Lore ─────────────────────────────
    this.tablets = [
      new window.AncientTablet(
        160, 150,
        'Welcome, Wanderer.\n\nYou wake in the endless twilight of Night Fall Land.\nWalk using [W, A, S, D]. Press [E] to examine tablets and ancient relics.\n\nAll discovered writings are recorded in your Clue Journal. Press [J] at any time to open your Journal.',
        'Tablet I: The Law of the Codex'
      ),
      new window.AncientTablet(
        420, 140,
        'Principles of Weight:\n\nWalk directly into stone blocks to push them.\nSlide the heavy block onto the purple pressure plate to lower the energy barrier.',
        'Tablet II: Pressure & Mechanisms'
      ),
      new window.AncientTablet(
        710, 140,
        'The First Law of Optics:\n\n"Starlight travels in straight paths until it strikes polished Quartz.\nRotate the mirror crystal [E] to deflect the celestial beam into the crystal receptor.\nOnly light can unseal the Golden Vault."',
        'Tablet III: Starlight Refraction'
      ),
      new window.AncientTablet(
        970, 160,
        'The Moon Archway:\n\nUse your collected Golden Moon Key on the locked golden gate [E].\nStep onto the celestial exit stargate to advance to the Moon Village.',
        'Tablet IV: The Gateway'
      ),
    ];

    // ── Room 2: Pushable Block & Pressure Plate ───────────────
    this.blocks = [
      new window.PushBlock(380, 310, 44)
    ];
    this.plates = [
      new window.PressurePlate(480, 220, 'plate_gate_1', 48)
    ];

    // ── Room 3: CELESTIAL OPTICS PUZZLE! ─────────────────────
    // Light Emitter firing DOWN at centerline X=680
    this.lightEmitters = [
      new window.LightEmitter(680, 80, 'DOWN', '#00f0ff')
    ];

    // Quartz Mirror: Center placed exactly at X=680, Y=320 (top-left x=658, y=298)
    // Starts at 'NW' (deflects to left / absorbed),
    // Rotate to 'NE' [E] to deflect starlight DOWN ➔ RIGHT into the receptor!
    this.quartzMirrors = [
      new window.QuartzMirror(658, 298, 'NW', 44)
    ];

    // Light Receptor placed directly on horizontal centerline Y=320 at X=900
    this.lightReceptors = [
      new window.LightReceptor(900, 320, 'laser_vault_gate')
    ];

    // Lever in Room 3 for secondary chamber
    this.levers = [
      new window.Lever(780, 200, 'lever_gate_1')
    ];

    // ── Doors & Barriers ─────────────────────────────────────
    this.doors = [
      new window.Door(600, 280, 24, 120, 'plate_gate_1', false),       // plate door
      new window.Door(910, 270, 24, 140, 'laser_vault_gate', false),   // OPTICS UNLOCKED GATE!
      new window.Door(1040, 260, 24, 120, 'locked_exit_gate', true)     // Key-locked gate
    ];

    // ── Pickups ──────────────────────────────────────────────
    this.keys   = [ new window.MoonKey(790, 480) ];
    this.shards = [ new window.MoonShard(840, 480) ];

    // ── Exit Stargate ────────────────────────────────────────
    this.exit = new window.LevelExit(1110, 290, 64, 80);
  }

  /* =========================================================
     LEVEL 2 — Moon Village: The Astral Cipher
     Features: 3 Astral Dial Pedestals + 3 Cryptic Riddle Poems
               + Courtyard Laser Deflection to reach the Inner Sanctum
     ========================================================= */
  buildMoonVillage() {
    this.totalShards = 3;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 28 },
      { x: 40,   y: 652, width: 1200, height: 28 },
      { x: 40,   y: 40,  width: 28,   height: 640 },
      { x: 1212, y: 40,  width: 28,   height: 640 },

      // West Ruin Divider
      { x: 280, y: 40,  width: 24, height: 180 },
      { x: 280, y: 320, width: 24, height: 350 },

      // Central Plaza Split
      { x: 580, y: 40,  width: 24, height: 220 },
      { x: 580, y: 400, width: 24, height: 270 },

      // East Vault Divider
      { x: 880, y: 40,  width: 24, height: 260 },
      { x: 880, y: 450, width: 24, height: 220 },

      // Inner Temple Room
      { x: 1060, y: 40,  width: 24, height: 280 },
      { x: 1060, y: 480, width: 24, height: 192 },

      // Horizontal dividers
      { x: 280, y: 220, width: 300, height: 24 },
      { x: 880, y: 340, width: 180, height: 24 },
    ];

    this.torches = [
      { x: 150, y: 68, radius: 120 },
      { x: 430, y: 68, radius: 120 },
      { x: 730, y: 68, radius: 130 },
      { x: 980, y: 68, radius: 130 },
      { x: 150, y: 630, radius: 110 },
      { x: 430, y: 630, radius: 110 },
      { x: 730, y: 630, radius: 120 },
      { x: 1130, y: 630, radius: 130 },
    ];

    // ── Cryptic Riddle Inscriptions (Recorded in Clue Journal [J]) ──
    this.tablets = [
      new window.AncientTablet(
        140, 110,
        'Moon Village Verse I:\n\n"When the darkness swallowed the sky forty-seven years ago, the first phenomenon observed was the VOID ECLIPSE.\nSet the Western Pillar to the symbol of the shadowed orb."',
        'Poem: The First Omen'
      ),
      new window.AncientTablet(
        420, 100,
        'Moon Village Verse II:\n\n"In the pitch black between dusk and midnight, no torch could illuminate the path.\nOnly the solitary STAR pierced the eternal gloom.\nSet the Central Pillar to the Starlight Astra."',
        'Poem: The Lonely Beacon'
      ),
      new window.AncientTablet(
        720, 100,
        'Moon Village Verse III:\n\n"When the ancient ancestors prayed for light, the sky offered only a razor sliver: the MOON CRESCENT.\nSet the Eastern Pillar to the Crescent of Dawn."',
        'Poem: The Sliver of Hope'
      ),
      new window.AncientTablet(
        950, 80,
        'Sanctum Note:\n\n"The Inner Sanctum gate requires dual alignment:\n1. The 3 Astral Dials must resonate: [ECLIPSE, STAR, CRESCENT].\n2. The celestial beam must be deflected through the quartz prism into the Sun Eye."',
        'Temple Master Inscription'
      ),
    ];

    // ── 3 Astral Dial Pedestals ──────────────────────────────
    // Dial 1: West (id: 'dial_w'), Target: 'ECLIPSE'
    // Dial 2: Center (id: 'dial_c'), Target: 'STAR'
    // Dial 3: East (id: 'dial_e'), Target: 'CRESCENT'
    this.astralDials = [
      new window.AstralDial(210, 380, 'dial_w', ['SUN', 'HALF_MOON', 'ECLIPSE', 'STAR', 'CRESCENT'], 0),
      new window.AstralDial(440, 480, 'dial_c', ['SUN', 'HALF_MOON', 'ECLIPSE', 'STAR', 'CRESCENT'], 1),
      new window.AstralDial(730, 480, 'dial_e', ['SUN', 'HALF_MOON', 'ECLIPSE', 'STAR', 'CRESCENT'], 0),
    ];

    this.cipherLocks = [
      new window.CipherLock(
        'cipher_temple_gate',
        ['dial_w', 'dial_c', 'dial_e'],
        ['ECLIPSE', 'STAR', 'CRESCENT']
      )
    ];

    // ── Pushable Blocks & Plates ─────────────────────────────
    this.blocks = [
      new window.PushBlock(180, 480, 44),
      new window.PushBlock(420, 360, 44),
    ];
    this.plates = [
      new window.PressurePlate(180, 560, 'plate_ruins_1', 48),
    ];

    // ── Optics Beam & Quartz Mirror in Central Courtyard ─────
    this.lightEmitters = [
      new window.LightEmitter(660, 80, 'DOWN', '#00f0ff')
    ];
    this.quartzMirrors = [
      new window.QuartzMirror(638, 288, 'NW', 44),
      new window.QuartzMirror(758, 288, 'SE', 44),
    ];
    this.lightReceptors = [
      new window.LightReceptor(860, 310, 'optics_sanctum_door')
    ];

    // ── Doors ────────────────────────────────────────────────
    this.doors = [
      new window.Door(280, 240, 24, 100, 'plate_ruins_1', false),
      new window.Door(580, 240, 24, 160, 'cipher_temple_gate', false),   // Unlocked by 3 Astral Dials!
      new window.Door(880, 270, 24, 180, 'optics_sanctum_door', false),  // Unlocked by Light Beam reflection!
      new window.Door(1060, 300, 24, 180, 'locked_village_exit', true)   // Key-locked
    ];

    // ── Pickups ──────────────────────────────────────────────
    this.keys   = [ new window.MoonKey(950, 480) ];
    this.shards = [
      new window.MoonShard(220, 560),
      new window.MoonShard(780, 560),
      new window.MoonShard(1120, 160),
    ];

    this.exit = new window.LevelExit(1120, 360, 64, 80);
  }

  /* =========================================================
     LEVEL 3 — Old Factory: The Prism Circuit
     Features: 4 Multi-Plate Generators + Complex Optical Routing
     ========================================================= */
  buildOldFactory() {
    this.totalShards = 4;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Factory grid columns
      { x: 260, y: 40,  width: 24, height: 180 },
      { x: 260, y: 340, width: 24, height: 340 },

      { x: 520, y: 40,  width: 24, height: 260 },
      { x: 520, y: 440, width: 24, height: 240 },

      { x: 780, y: 40,  width: 24, height: 280 },
      { x: 780, y: 500, width: 24, height: 180 },

      { x: 1020, y: 40,  width: 24, height: 220 },
      { x: 1020, y: 480, width: 24, height: 200 },

      // Horizontal dividers
      { x: 260, y: 160, width: 260, height: 24 },
      { x: 520, y: 400, width: 260, height: 24 },
      { x: 780, y: 240, width: 240, height: 24 },
    ];

    this.torches = [
      { x: 140, y: 68, radius: 110 },
      { x: 400, y: 68, radius: 120 },
      { x: 660, y: 68, radius: 120 },
      { x: 920, y: 68, radius: 120 },
      { x: 140, y: 630, radius: 110 },
      { x: 400, y: 630, radius: 120 },
      { x: 660, y: 630, radius: 120 },
      { x: 1120, y: 630, radius: 130 },
    ];

    this.tablets = [
      new window.AncientTablet(
        130, 110,
        'Factory Power Schematic:\n\n"The master steam turbine requires dual power feeds:\n1. All generator plates must bear stone weight.\n2. The optical conduit must be redirected around the blast barrier into Receptor Gamma."',
        'Schematic: Primary Turbine'
      ),
      new window.AncientTablet(
        360, 80,
        'Shift Supervisor Log:\n\n"Warning: Quartz mirrors can be slid along the concrete floor and rotated 90 degrees [E]. Do not allow the laser beam to strike the fuel tanks!"',
        'Shift Log'
      ),
      new window.AncientTablet(
        660, 80,
        'Electrical Diagram:\n\n"Master Power door opens only when the master switch is energized AND Receptor Gamma receives continuous starlight."',
        'Electrical Blueprints'
      ),
      new window.AncientTablet(
        880, 80,
        'Foreman\'s Clue:\n\n"Look for the alignment arrows on the floor. Two quartz mirrors are required to deflect the beam in a zigzag around the middle partition."',
        'Foreman\'s Scratchpad'
      ),
    ];

    this.blocks = [
      new window.PushBlock(120, 280, 44),
      new window.PushBlock(120, 360, 44),
      new window.PushBlock(380, 300, 44),
      new window.PushBlock(600, 500, 44),
    ];

    this.plates = [
      new window.PressurePlate(170, 460, 'gen_1', 44),
      new window.PressurePlate(370, 500, 'gen_2', 44),
      new window.PressurePlate(640, 320, 'gen_3', 44),
      new window.PressurePlate(870, 480, 'gen_4', 44),
    ];

    // Optical Beam Routing with 2 Quartz Mirrors
    this.lightEmitters = [
      new window.LightEmitter(320, 80, 'DOWN', '#00f0ff')
    ];
    this.quartzMirrors = [
      new window.QuartzMirror(298, 218, 'NE', 44),
      new window.QuartzMirror(438, 218, 'SE', 44),
    ];
    this.lightReceptors = [
      new window.LightReceptor(760, 240, 'factory_optical_gate')
    ];

    this.levers = [
      new window.Lever(840, 120, 'master_switch'),
    ];

    this.doors = [
      new window.Door(520, 260, 24, 140, 'gen_1', false),
      new window.Door(780, 280, 24, 220, 'factory_optical_gate', false),
      new window.Door(1020, 220, 24, 260, 'master_power', false),
    ];

    this.keys   = [ new window.MoonKey(1060, 380) ];
    this.shards = [
      new window.MoonShard(290, 540),
      new window.MoonShard(550, 540),
      new window.MoonShard(820, 550),
      new window.MoonShard(1080, 560),
    ];

    this.exit = new window.LevelExit(1110, 300, 64, 80);
  }

  /* =========================================================
     LEVEL 4 — Frozen Peak: The Thermal Riddle
     Features: Thermal Laser Melting, Cryo-Mirrors, Astral Dials
     ========================================================= */
  buildFrozenPeak() {
    this.totalShards = 5;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Glacier canyon walls
      { x: 220,  y: 40,  width: 24, height: 560 },
      { x: 420,  y: 120, width: 24, height: 220 },
      { x: 420,  y: 460, width: 24, height: 220 },
      { x: 620,  y: 40,  width: 24, height: 280 },
      { x: 620,  y: 440, width: 24, height: 240 },
      { x: 820,  y: 40,  width: 24, height: 320 },
      { x: 820,  y: 520, width: 24, height: 160 },
      { x: 1020, y: 40,  width: 24, height: 260 },
      { x: 1020, y: 500, width: 24, height: 180 },

      // Ice platforms
      { x: 220, y: 340, width: 200, height: 24 },
      { x: 620, y: 420, width: 200, height: 24 },
      { x: 820, y: 320, width: 200, height: 24 },
    ];

    this.torches = [
      { x: 130, y: 68, radius: 110 },
      { x: 330, y: 68, radius: 120 },
      { x: 530, y: 68, radius: 120 },
      { x: 730, y: 68, radius: 120 },
      { x: 930, y: 68, radius: 120 },
      { x: 130, y: 630, radius: 110 },
      { x: 530, y: 630, radius: 120 },
      { x: 1120, y: 630, radius: 130 },
    ];

    this.tablets = [
      new window.AncientTablet(
        100, 110,
        'Frozen Peak Codex:\n\n"The mountain spirit locked the summit behind the Twin Runes of Heaven.\nSet the Peak Dial to the SUN of Eternal Fire, and the Valley Dial to the HALF MOON of Equilibrium."',
        'Archive: The Twin Runes'
      ),
      new window.AncientTablet(
        280, 80,
        'Cryo-Optics Note:\n\n"The thermal starlight beam can melt ice-sealed gates when routed across the canyon chasms.\nAlign the quartz mirror to redirect the beam eastward."',
        'Glacier Observation'
      ),
      new window.AncientTablet(
        660, 80,
        'Summit Inscription:\n\n"Both summit pressure plates must be weighted simultaneously with stone blocks to disengage the final cryo-gate."',
        'Summit Gates'
      ),
    ];

    this.astralDials = [
      new window.AstralDial(130, 480, 'dial_peak_1', ['CRESCENT', 'STAR', 'SUN', 'ECLIPSE'], 0),
      new window.AstralDial(340, 480, 'dial_peak_2', ['ECLIPSE', 'HALF_MOON', 'STAR', 'SUN'], 0),
    ];

    this.cipherLocks = [
      new window.CipherLock('cipher_glacier_gate', ['dial_peak_1', 'dial_peak_2'], ['SUN', 'HALF_MOON'])
    ];

    this.blocks = [
      new window.PushBlock(120, 260, 44),
      new window.PushBlock(120, 340, 44),
      new window.PushBlock(320, 200, 44),
      new window.PushBlock(500, 200, 44),
    ];

    this.plates = [
      new window.PressurePlate(870, 400, 'summit_a', 48),
      new window.PressurePlate(870, 480, 'summit_b', 48),
    ];

    this.lightEmitters = [
      new window.LightEmitter(480, 80, 'DOWN', '#00f0ff')
    ];
    this.quartzMirrors = [
      new window.QuartzMirror(458, 258, 'NW', 44),
    ];
    this.lightReceptors = [
      new window.LightReceptor(600, 280, 'cryo_thermal_door')
    ];

    this.doors = [
      new window.Door(220, 240, 24, 100, 'cipher_glacier_gate', false),
      new window.Door(420, 340, 24, 120, 'cryo_thermal_door', false),
      new window.Door(620, 280, 24, 160, 'plate_ruins', false),
      new window.Door(1020, 260, 24, 240, 'summit_both', false),
    ];

    this.keys   = [ new window.MoonKey(1050, 400) ];
    this.shards = [
      new window.MoonShard(160, 520),
      new window.MoonShard(480, 530),
      new window.MoonShard(700, 530),
      new window.MoonShard(880, 560),
      new window.MoonShard(1060, 560),
    ];

    this.exit = new window.LevelExit(1100, 310, 64, 80);
  }

  /* =========================================================
     LEVEL 5 — The Void: The Grand Alignment (Master)
     Features: All Mechanics Combined: Multi-Mirror Optics,
               4 Astral Dials, Chained Plates, Cryptic Cosmological Riddle
     ========================================================= */
  buildTheVoid() {
    this.totalShards = 6;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Void labyrinth partitions
      { x: 180,  y: 40,  width: 24, height: 200 },
      { x: 180,  y: 380, width: 24, height: 300 },
      { x: 360,  y: 160, width: 24, height: 160 },
      { x: 360,  y: 460, width: 24, height: 220 },
      { x: 540,  y: 40,  width: 24, height: 260 },
      { x: 540,  y: 400, width: 24, height: 280 },
      { x: 720,  y: 120, width: 24, height: 200 },
      { x: 720,  y: 440, width: 24, height: 240 },
      { x: 900,  y: 40,  width: 24, height: 300 },
      { x: 900,  y: 500, width: 24, height: 180 },
      { x: 1080, y: 140, width: 24, height: 220 },
      { x: 1080, y: 480, width: 24, height: 200 },

      // Horizontal void bars
      { x: 180, y: 200, width: 180, height: 24 },
      { x: 540, y: 280, width: 180, height: 24 },
      { x: 720, y: 520, width: 180, height: 24 },
    ];

    this.torches = [
      { x: 110, y: 68, radius: 120 },
      { x: 300, y: 68, radius: 120 },
      { x: 630, y: 68, radius: 120 },
      { x: 810, y: 68, radius: 120 },
      { x: 1000, y: 68, radius: 120 },
      { x: 110, y: 630, radius: 110 },
      { x: 450, y: 630, radius: 120 },
      { x: 810, y: 630, radius: 120 },
      { x: 1140, y: 630, radius: 130 },
    ];

    this.tablets = [
      new window.AncientTablet(
        90, 100,
        'Voice of the Void:\n\n"To unlock the celestial gates, you must align the 4 Pillars of Eternity:\nI. The Star that witnessed the fall [STAR]\nII. The Sun that was banished [SUN]\nIII. The Crescent that survived [CRESCENT]\nIV. The Void that consumed all [ECLIPSE]"',
        'Codex of Eternity'
      ),
      new window.AncientTablet(
        420, 80,
        'Void Optics Inscription:\n\n"The Master Crystal Eye in the Sanctum must be illuminated by a continuous laser beam reflected through 3 quartz mirrors around the labyrinth."',
        'Optics Codex'
      ),
      new window.AncientTablet(
        780, 80,
        'Final Revelation:\n\n"Observation and knowledge conquer all darkness. Turn the pillars, route the light, weight the plates, and take back the sun."',
        'The Final Message'
      ),
    ];

    // 4 Astral Dials
    this.astralDials = [
      new window.AstralDial(100, 360, 'void_d1', ['ECLIPSE', 'STAR', 'CRESCENT', 'SUN'], 0),
      new window.AstralDial(100, 440, 'void_d2', ['ECLIPSE', 'STAR', 'CRESCENT', 'SUN'], 1),
      new window.AstralDial(280, 360, 'void_d3', ['ECLIPSE', 'STAR', 'CRESCENT', 'SUN'], 0),
      new window.AstralDial(280, 440, 'void_d4', ['ECLIPSE', 'STAR', 'CRESCENT', 'SUN'], 2),
    ];

    this.cipherLocks = [
      new window.CipherLock(
        'void_cipher_door',
        ['void_d1', 'void_d2', 'void_d3', 'void_d4'],
        ['STAR', 'SUN', 'CRESCENT', 'ECLIPSE']
      )
    ];

    // Blocks & Plates
    this.blocks = [
      new window.PushBlock(420, 200, 44),
      new window.PushBlock(420, 500, 44),
      new window.PushBlock(600, 350, 44),
    ];
    this.plates = [
      new window.PressurePlate(450, 340, 'void_p1', 44),
      new window.PressurePlate(800, 360, 'void_p2', 44),
    ];

    // Laser Optics with 3 Quartz Mirrors
    this.lightEmitters = [
      new window.LightEmitter(630, 80, 'DOWN', '#00f0ff')
    ];
    this.quartzMirrors = [
      new window.QuartzMirror(608, 198, 'NW', 44),
      new window.QuartzMirror(788, 198, 'SE', 44),
      new window.QuartzMirror(788, 438, 'NE', 44),
    ];
    this.lightReceptors = [
      new window.LightReceptor(1050, 460, 'void_laser_gate')
    ];

    this.doors = [
      new window.Door(180, 240, 24, 140, 'void_cipher_door', false),
      new window.Door(540, 300, 24, 100, 'void_p1', false),
      new window.Door(720, 320, 24, 120, 'void_laser_gate', false),
      new window.Door(900, 380, 24, 120, 'void_p2', false),
      new window.Door(1080, 280, 24, 200, 'void_final_key', true),
    ];

    this.keys   = [ new window.MoonKey(960, 440) ];
    this.shards = [
      new window.MoonShard(240, 580),
      new window.MoonShard(440, 580),
      new window.MoonShard(640, 320),
      new window.MoonShard(820, 580),
      new window.MoonShard(980, 200),
      new window.MoonShard(1140, 400),
    ];

    this.exit = new window.LevelExit(1140, 320, 64, 80);
  }

  /* =========================================================
     UPDATE
     ========================================================= */
  update(dt, player, audio) {
    this.animTime += dt;

    // 1. Update Blocks
    for (const b of this.blocks) b.update(dt, this);

    // 2. Update Quartz Mirrors
    for (const m of this.quartzMirrors) m.update(dt, this);

    // 3. Update Astral Dials
    for (const d of this.astralDials) d.update(dt);

    // 4. Update Pressure Plates
    for (const p of this.plates) p.update(player, this.blocks, audio);

    // 5. Update Light Emitters
    for (const e of this.lightEmitters) e.update(dt);

    // 6. Update Optics Engine (Traces laser reflections & powers receptors)
    this.optics.update(this, dt, audio);

    // 7. Update Cipher Locks
    for (const lock of this.cipherLocks) lock.update(this.astralDials, this.doors, audio);

    // 8. Update Doors
    for (const d of this.doors) d.update(this.plates, this.levers, player);

    // 9. Special compound doors
    this._updateCompoundDoors();

    // 10. Update Pickups & Exit
    for (const k of this.keys)   k.update(dt);
    for (const s of this.shards) s.update(dt);

    if (this.exit) {
      this.exit.update(dt);
      if (this.checkOverlap(player, this.exit)) {
        if (window.gameEngine && window.gameEngine.state === 'PLAYING') {
          window.gameEngine.triggerVictory();
        }
      }
    }
  }

  _updateCompoundDoors() {
    // Level 3: "master_power" door — needs all 4 generators + master switch
    if (this.levelId === 3) {
      const g1 = this.plates.find(p => p.id === 'gen_1');
      const g2 = this.plates.find(p => p.id === 'gen_2');
      const g3 = this.plates.find(p => p.id === 'gen_3');
      const g4 = this.plates.find(p => p.id === 'gen_4');
      const sw = this.levers.find(l => l.id === 'master_switch');
      const allGen = g1?.isPressed && g2?.isPressed && g3?.isPressed && g4?.isPressed;
      for (const d of this.doors) {
        if (d.linkedId === 'master_power') {
          d.isOpen = !!(allGen && sw?.isOn);
        }
      }
    }

    // Level 4: "summit_both" door — needs summit_a AND summit_b
    if (this.levelId === 4) {
      const sa = this.plates.find(p => p.id === 'summit_a');
      const sb = this.plates.find(p => p.id === 'summit_b');
      for (const d of this.doors) {
        if (d.linkedId === 'summit_both') {
          d.isOpen = !!(sa?.isPressed && sb?.isPressed);
        }
      }
    }
  }

  /* =========================================================
     COLLISION HELPERS
     ========================================================= */
  checkWallCollision(box) {
    for (const w of this.walls) {
      if (this.checkOverlap(box, w)) return true;
    }
    return false;
  }

  checkOverlap(r1, r2) {
    return (
      r1.x < r2.x + r2.width  &&
      r1.x + r1.width  > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  /* =========================================================
     DRAW (High-Detail Procedural Flagstones, 3D Walls, Torches)
     ========================================================= */
  draw(ctx) {
    ctx.save();

    // 1. Procedural Stone Flagstone Dungeon Floor
    this.drawProceduralFloor(ctx);

    // 2. Wall Drop Shadows (Ambient Occlusion onto floor)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    for (const w of this.walls) {
      ctx.fillRect(w.x + 4, w.y + 4, w.width, w.height);
    }

    // 3. Pressure Plates & Floor Mechanisms
    for (const p of this.plates) p.draw(ctx);

    // 4. Optical Receptors & Emitters
    for (const rec of this.lightReceptors) rec.draw(ctx);
    for (const em of this.lightEmitters)   em.draw(ctx);

    // 5. Laser Beam Graphics
    this.optics.draw(ctx);

    // 6. Astral Dial Pedestals
    for (const dial of this.astralDials) dial.draw(ctx);

    // 7. Levers & Tablets
    for (const l of this.levers)  l.draw(ctx);
    for (const t of this.tablets) t.draw(ctx);

    // 8. Doors
    for (const d of this.doors) d.draw(ctx);

    // 9. 3D Layered Masonry Walls with Coping Caps
    this.draw3DWalls(ctx);

    // 10. Wall Sconces (Torches)
    this.drawTorches(ctx);

    // 11. Pushable Blocks & Quartz Mirrors
    for (const b of this.blocks) b.draw(ctx);
    for (const m of this.quartzMirrors) m.draw(ctx);

    // 12. Pickups & Stargate Exit
    for (const k of this.keys)   k.draw(ctx);
    for (const s of this.shards) s.draw(ctx);
    if (this.exit) this.exit.draw(ctx);

    ctx.restore();
  }

  drawProceduralFloor(ctx) {
    const floorColors = [
      { bg: '#080c1a', tile: '#0c1228', bevel: '#152044', mortar: '#04060d' }, // Darkwood
      { bg: '#090e1f', tile: '#0e1630', bevel: '#18244f', mortar: '#050812' }, // Moon Village
      { bg: '#0e0c16', tile: '#161324', bevel: '#221f38', mortar: '#08060d' }, // Factory
      { bg: '#08121f', tile: '#0b1a2e', bevel: '#132c4d', mortar: '#040911' }, // Frozen Peak
      { bg: '#060512', tile: '#0a091d', bevel: '#141235', mortar: '#030209' }, // The Void
    ];
    const theme = floorColors[this.levelId - 1] || floorColors[0];

    // Base background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, this.width, this.height);

    // Procedural stone flagstones
    const tileSize = 48;
    for (let y = 50; y < this.height - 40; y += tileSize) {
      for (let x = 50; x < this.width - 40; x += tileSize) {
        // Deterministic pseudo-random variation per tile
        const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);

        // Tile body
        ctx.fillStyle = theme.tile;
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Subtle bevel highlight
        ctx.strokeStyle = theme.bevel;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Occasional ancient cracked stone or moss detail
        if (rand > 0.8) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
          ctx.beginPath();
          ctx.moveTo(x + 8, y + 8);
          ctx.lineTo(x + tileSize - 12, y + tileSize - 12);
          ctx.stroke();
        }
      }
    }
  }

  draw3DWalls(ctx) {
    const wallStyles = [
      { fill: '#131c31', top: '#1e2d4d', stroke: '#2e4372', rune: 'rgba(56, 189, 248, 0.5)' },
      { fill: '#141b33', top: '#1f294d', stroke: '#314175', rune: 'rgba(168, 85, 247, 0.5)' },
      { fill: '#1c161f', top: '#2b2130', stroke: '#42334a', rune: 'rgba(251, 146, 60, 0.5)' },
      { fill: '#0f1c2e', top: '#182d4a', stroke: '#274673', rune: 'rgba(96, 210, 255, 0.5)' },
      { fill: '#100b21', top: '#1a1336', stroke: '#2e215e', rune: 'rgba(139, 92, 246, 0.5)' },
    ];
    const style = wallStyles[this.levelId - 1] || wallStyles[0];

    for (const w of this.walls) {
      // 1. Wall Masonry Front Face
      ctx.fillStyle = style.fill;
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = 2;
      ctx.fillRect(w.x, w.y, w.width, w.height);
      ctx.strokeRect(w.x, w.y, w.width, w.height);

      // 2. Top Coping Cap Trim (3D Depth)
      const capH = Math.min(8, w.height / 2);
      ctx.fillStyle = style.top;
      ctx.fillRect(w.x, w.y, w.width, capH);

      // 3. Glowing Starlight Inscribed Rim
      ctx.fillStyle = style.rune;
      ctx.fillRect(w.x + 2, w.y, w.width - 4, 2);

      // 4. Subtle brick segment lines if wide
      if (w.width > 50) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        for (let bx = w.x + 36; bx < w.x + w.width - 20; bx += 40) {
          ctx.beginPath();
          ctx.moveTo(bx, w.y + capH);
          ctx.lineTo(bx, w.y + w.height);
          ctx.stroke();
        }
      }
    }
  }

  drawTorches(ctx) {
    for (const torch of this.torches) {
      const flicker = Math.sin(this.animTime * 12 + torch.x) * 2;

      // Brass Sconce Bracket
      ctx.fillStyle = '#78350f';
      ctx.fillRect(torch.x - 3, torch.y - 2, 6, 8);

      // Flickering Flame Core
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(torch.x + flicker * 0.5, torch.y - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // White Hot Flame Center
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(torch.x + flicker * 0.5, torch.y - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

window.World = World;

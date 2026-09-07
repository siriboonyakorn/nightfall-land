/* ==========================================================================
   NIGHT FALL LAND - World / Level Manager
   Supports Levels 1–5, each with unique puzzle rooms
   ========================================================================== */

class World {
  constructor(levelId = 1) {
    this.width  = 1280;
    this.height = 720;
    this.levelId = levelId;

    this.walls   = [];
    this.blocks  = [];
    this.plates  = [];
    this.doors   = [];
    this.levers  = [];
    this.tablets = [];
    this.keys    = [];
    this.shards  = [];
    this.exit    = null;

    // Total shards in level (for HUD display)
    this.totalShards = 1;

    // Build appropriate level
    switch (levelId) {
      case 2:  this.buildMoonVillage();  break;
      case 3:  this.buildOldFactory();   break;
      case 4:  this.buildFrozenPeak();   break;
      case 5:  this.buildTheVoid();      break;
      default: this.buildDarkwoodTutorial(); break;
    }
  }

  /* =========================================================
     LEVEL 1 — Darkwood: The Awakening  (Tutorial)
     Teaches: Movement, Tablets, Block-Push, Lever, Key, Exit
     ========================================================= */
  buildDarkwoodTutorial() {
    this.totalShards = 1;

    // ── Outer Boundary ──────────────────────────────────────
    this.walls = [
      { x: 40,   y: 60,  width: 1200, height: 28  },  // top
      { x: 40,   y: 632, width: 1200, height: 28  },  // bottom
      { x: 40,   y: 60,  width: 28,   height: 600 },  // left
      { x: 1212, y: 60,  width: 28,   height: 600 },  // right

      // ── Divider 1: Room 1 → Room 2 (gap at y 240–380 for door) ──
      { x: 300, y: 60,  width: 24, height: 180 },
      { x: 300, y: 380, width: 24, height: 280 },

      // ── Divider 2: Room 2 → Room 3 (gap at y 290–390 for plate door) ──
      { x: 580, y: 60,  width: 24, height: 230 },
      { x: 580, y: 390, width: 24, height: 270 },

      // ── Divider 3: Room 3 → Alcove (gap at y 270–410 for lever door) ──
      { x: 860, y: 60,  width: 24, height: 210 },
      { x: 860, y: 410, width: 24, height: 250 },

      // ── Alcove inner wall (closes the south side of the alcove) ──
      { x: 680, y: 380, width: 180, height: 24 },

      // ── Divider 4: Alcove → Final Room
      //    BUG FIX: enclose final golden gate with solid walls
      //    so player CANNOT walk around the door from top or bottom
      { x: 1010, y: 60,  width: 24, height: 200 },   // top segment
      { x: 1010, y: 460, width: 24, height: 200 },   // bottom segment
      //    The door occupies y:260–380, so gap is exactly 200px tall
      //    Door: Door(1010, 260, 24, 120) → fills y 260–380, perfect fit
    ];

    // ── Tablets ─────────────────────────────────────────────
    this.tablets = [
      new window.AncientTablet(
        180, 160,
        'Welcome, Wanderer.\n\nYou wake in the eternal darkness of Night Fall Land.\nWalk freely using [W, A, S, D] or Arrow keys.\nWhen near a tablet or object, press [E] to examine it.',
        'Tablet I: The First Steps'
      ),
      new window.AncientTablet(
        420, 140,
        'Principles of Weight:\n\nWalk directly into stone blocks to push them.\nSlide the glowing block onto the purple pressure plate to lower the energy barrier.',
        'Tablet II: Pressure & Mechanisms'
      ),
      new window.AncientTablet(
        700, 140,
        'The Ancient Switch:\n\nPress [E] near a lever to pull it.\nThis will deactivate the laser barrier guarding the Golden Moon Key and hidden Moon Shard.',
        'Tablet III: Levers & Secrets'
      ),
      new window.AncientTablet(
        920, 160,
        'The Moon Archway:\n\nUse your collected Moon Key on the locked golden gate by pressing [E] near it.\nStep onto the glowing exit portal to complete the Darkwood Awakening.',
        'Tablet IV: The Trial Complete'
      ),
    ];

    // ── Pushable Block & Pressure Plate (Room 2) ────────────
    this.blocks = [
      new window.PushBlock(380, 310, 44)
    ];
    this.plates = [
      new window.PressurePlate(470, 210, 'plate_gate_1', 48)
    ];

    // ── Doors / Barriers ────────────────────────────────────
    this.doors = [
      new window.Door(580, 290, 24, 100, 'plate_gate_1', false),   // [0] plate door
      new window.Door(860, 270, 24, 140, 'lever_gate_1', false),   // [1] lever door
      new window.Door(1010, 260, 24, 120, 'locked_exit_gate', true) // [2] key-locked golden gate
    ];

    // ── Lever (Room 3) ───────────────────────────────────────
    this.levers = [
      new window.Lever(680, 210, 'lever_gate_1')
    ];

    // ── Pickups ──────────────────────────────────────────────
    this.keys   = [ new window.MoonKey(760, 470)   ];
    this.shards = [ new window.MoonShard(800, 470)  ];

    // ── Exit Portal (Room 4) ─────────────────────────────────
    this.exit = new window.LevelExit(1090, 290, 64, 80);
  }

  /* =========================================================
     LEVEL 2 — Moon Village: Echoes of the Forgotten
     Teaches: Multi-block pushing, combination/order puzzles,
              reading clue tablets to unlock a 3-switch combo
     ========================================================= */
  buildMoonVillage() {
    this.totalShards = 3;

    // ── Outer Boundary ──────────────────────────────────────
    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 28 },
      { x: 40,   y: 652, width: 1200, height: 28 },
      { x: 40,   y: 40,  width: 28,   height: 640 },
      { x: 1212, y: 40,  width: 28,   height: 640 },

      // ── Central Courtyard dividers ──
      // Top corridor wall
      { x: 280, y: 40,  width: 24, height: 160 },
      { x: 280, y: 300, width: 24, height: 370 },

      // Mid section split
      { x: 560, y: 40,  width: 24, height: 200 },
      { x: 560, y: 360, width: 24, height: 170 },
      { x: 560, y: 560, width: 24, height: 110 },

      // Right corridor
      { x: 840, y: 40,  width: 24, height: 250 },
      { x: 840, y: 450, width: 24, height: 220 },

      // Treasure alcove
      { x: 1050, y: 40,  width: 24, height: 280 },
      { x: 1050, y: 480, width: 24, height: 192 },

      // Horizontal separators
      { x: 280,  y: 200, width: 280, height: 24 },
      { x: 840,  y: 320, width: 210, height: 24 },
    ];

    // ── Tablets (clue: levers must be pulled in order: A, C, B) ──
    this.tablets = [
      new window.AncientTablet(
        150, 120,
        'Moon Village Codex:\n\nThree ancient switches seal the village gate.\nThe elders wrote: "Pull the Western torch first, then the Eastern fire, and last the Central flame."\nPull them in the correct order.',
        'Codex: The Three Flames'
      ),
      new window.AncientTablet(
        400, 100,
        'A crumbled note reads:\n\n"First: West. Then: East. Finally: Center. The gate will accept only the sacred order."\n\nHint: look for markings W / E / C on the lever pedestals.',
        'Faded Note'
      ),
      new window.AncientTablet(
        700, 100,
        'A stone etching:\n\nThe pressure plates in this chamber can be activated by stone blocks OR by standing on them yourself.',
        'Etching: Weight & Balance'
      ),
      new window.AncientTablet(
        920, 80,
        'Moon Shard Cache:\n\nThree shards were hidden by the last village elder:\n• One near the well (south)\n• One behind the sealed gate\n• One in the treasure alcove',
        'Cache Map'
      ),
    ];

    // ── Blocks & Plates ──────────────────────────────────────
    this.blocks = [
      new window.PushBlock(160,  380, 44),   // block A – near south plate
      new window.PushBlock(420,  400, 44),   // block B – mid area
      new window.PushBlock(650,  300, 44),   // block C – right section
    ];
    this.plates = [
      new window.PressurePlate(160, 500, 'plate_south', 48),
      new window.PressurePlate(440, 550, 'plate_mid',   48),
    ];

    // ── Ordered Levers: must activate West→East→Center ────────
    // Managed via the OrderedLeverGroup helper (stored in levers array)
    this.levers = [
      new window.Lever(310, 120, 'lever_west'),    // lever W
      new window.Lever(870, 120, 'lever_east'),    // lever E
      new window.Lever(600, 130, 'lever_center'),  // lever C
    ];

    // Attach ordered logic: west → east → center → gate opens
    this._leverOrder  = ['lever_west', 'lever_east', 'lever_center'];
    this._leverProgress = 0; // how many in sequence have been correctly pulled

    // ── Doors ──────────────────────────────────────────────
    this.doors = [
      new window.Door(560, 200, 24, 160, 'plate_south',  false),  // plate opens mid door
      new window.Door(840, 250, 24, 200, 'lever_seq',    false),  // lever-sequence gate
      new window.Door(1050, 280, 24, 200, 'plate_mid',   false),  // treasure alcove door
    ];

    // ── Pickups ──────────────────────────────────────────────
    this.keys   = [ new window.MoonKey(620, 560)  ];
    this.shards = [
      new window.MoonShard(200,  540),   // south shard
      new window.MoonShard(920,  380),   // behind gate shard
      new window.MoonShard(1100, 150),   // alcove shard
    ];

    // ── Exit ─────────────────────────────────────────────────
    this.exit = new window.LevelExit(1100, 340, 64, 80);
  }

  /* =========================================================
     LEVEL 3 — Old Factory: Conveyors and Currents
     Teaches: Multi-step sequences, conveyor rails concept
              (here simulated by "chained" pressure plates that
               must ALL be activated simultaneously)
     ========================================================= */
  buildOldFactory() {
    this.totalShards = 4;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Factory floor grid walls
      { x: 260, y: 40,  width: 24, height: 180 },
      { x: 260, y: 340, width: 24, height: 340 },

      { x: 520, y: 40,  width: 24, height: 280 },
      { x: 520, y: 440, width: 24, height: 240 },

      { x: 780, y: 40,  width: 24, height: 300 },
      { x: 780, y: 500, width: 24, height: 180 },

      { x: 1020, y: 40,  width: 24, height: 200 },
      { x: 1020, y: 480, width: 24, height: 200 },

      // Horizontal corridors
      { x: 260,  y: 160, width: 260, height: 24 },
      { x: 520,  y: 420, width: 260, height: 24 },
      { x: 780,  y: 240, width: 240, height: 24 },
    ];

    this.tablets = [
      new window.AncientTablet(
        130, 120,
        'Factory Control Manual:\n\nThis machine requires ALL FOUR generator plates to be weighted simultaneously before the master switch will engage.\n\nPush a stone block onto each glowing plate.',
        'Manual: Generator Array'
      ),
      new window.AncientTablet(
        350, 80,
        'Warning:\n\nBlocks that fall into the pit shafts are LOST permanently.\nIf you run out of blocks, press [R] to reset the room.',
        'Safety Notice'
      ),
      new window.AncientTablet(
        680, 80,
        'Electrical Diagram:\n\nOnce all four generator plates are active, the power coupling door will open and the exit will energise.\n\nShards are hidden in maintenance alcoves.',
        'Wiring Diagram'
      ),
      new window.AncientTablet(
        880, 80,
        'Chief Engineer\'s Note:\n\n"The fourth generator is tricky — push the block from the SOUTH side only or it will miss the plate."',
        'Engineer\'s Note'
      ),
    ];

    // Four blocks, four plates — all must be pressed simultaneously
    this.blocks = [
      new window.PushBlock(130,  300, 44),
      new window.PushBlock(130,  380, 44),
      new window.PushBlock(390,  300, 44),
      new window.PushBlock(600,  500, 44),
    ];
    this.plates = [
      new window.PressurePlate(180, 460, 'gen_1', 44),
      new window.PressurePlate(370, 500, 'gen_2', 44),
      new window.PressurePlate(640, 300, 'gen_3', 44),
      new window.PressurePlate(860, 480, 'gen_4', 44),
    ];

    this.levers = [
      new window.Lever(840, 120, 'master_switch'),
    ];

    // Master gate opens only when all generators + switch active
    this.doors = [
      new window.Door(780, 300, 24, 200, 'gen_1_2', false),   // half-power door
      new window.Door(1020, 200, 24, 280, 'master_power', false), // master door
    ];

    this.keys   = [ new window.MoonKey(1060, 380)   ];
    this.shards = [
      new window.MoonShard(300,  540),
      new window.MoonShard(550,  540),
      new window.MoonShard(820,  550),
      new window.MoonShard(1080, 560),
    ];

    this.exit = new window.LevelExit(1100, 300, 64, 80);
  }

  /* =========================================================
     LEVEL 4 — Frozen Peak: Thermal Equilibrium
     Teaches: Multi-block coordination, thinking several moves
              ahead, using blocks as bridges over "ice gaps"
     ========================================================= */
  buildFrozenPeak() {
    this.totalShards = 5;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Frozen canyon walls
      { x: 200,  y: 40,  width: 24, height: 560 },
      { x: 400,  y: 120, width: 24, height: 220 },
      { x: 400,  y: 460, width: 24, height: 220 },
      { x: 600,  y: 40,  width: 24, height: 280 },
      { x: 600,  y: 440, width: 24, height: 240 },
      { x: 800,  y: 40,  width: 24, height: 320 },
      { x: 800,  y: 520, width: 24, height: 160 },
      { x: 1000, y: 40,  width: 24, height: 260 },
      { x: 1000, y: 500, width: 24, height: 180 },

      // Ice shelf platforms (horizontal)
      { x: 200, y: 340, width: 200, height: 24 },
      { x: 600, y: 420, width: 200, height: 24 },
      { x: 800, y: 320, width: 200, height: 24 },

      // Ice gap indicators (thin walls creating gaps)
      { x: 400, y: 340, width: 200, height: 24 },
    ];

    this.tablets = [
      new window.AncientTablet(100, 120,
        'Frozen Peak Archive:\n\nThe ice bridges here are unstable. Move stone blocks into the "gap slots" (marked with blue arrows) to create safe paths across.\n\nNote: blocks slide slightly on ice — plan ahead!',
        'Archive: Ice Bridges'),
      new window.AncientTablet(280, 80,
        'Bridge Tip:\n\nA block pushed into a gap will STOP at the far edge if a wall is there. Use this to place blocks precisely in narrow slots.',
        'Bridge Mechanics'),
      new window.AncientTablet(660, 80,
        'Thermal Control:\n\nFire (red) plates generate heat — they melt ice barriers when pressure is applied. Ice (blue) plates must remain UNWEIGHTED to keep cryo-gates sealed.',
        'Thermal Systems'),
      new window.AncientTablet(880, 80,
        'Peak Summit Note:\n\n"Five shards were frozen into the glacier by the mountain spirit. Each one glows where the ice is thinnest."',
        'Summit Note'),
      new window.AncientTablet(1060, 120,
        'Final Gate:\n\nThe summit gate opens only when BOTH pressure plates glow simultaneously. Coordinate your blocks carefully.',
        'Gate Mechanism'),
    ];

    this.blocks = [
      new window.PushBlock(100,  300, 44),
      new window.PushBlock(100,  380, 44),
      new window.PushBlock(260,  200, 44),
      new window.PushBlock(260,  280, 44),
      new window.PushBlock(450,  200, 44),
    ];
    this.plates = [
      new window.PressurePlate(450, 480, 'cryo_a', 48),
      new window.PressurePlate(650, 480, 'cryo_b', 48),
      new window.PressurePlate(870, 400, 'summit_a', 48),
      new window.PressurePlate(870, 480, 'summit_b', 48),
    ];

    this.levers = [
      new window.Lever(670, 120, 'thermal_switch'),
    ];

    this.doors = [
      new window.Door(400, 340, 24, 120, 'cryo_a', false),
      new window.Door(600, 280, 24, 160, 'cryo_b', false),
      new window.Door(800, 320, 24, 200, 'thermal_switch', false),
      new window.Door(1000, 260, 24, 240, 'summit_both', false),
    ];

    this.keys   = [ new window.MoonKey(1050, 400)  ];
    this.shards = [
      new window.MoonShard(160,  500),
      new window.MoonShard(480,  530),
      new window.MoonShard(700,  530),
      new window.MoonShard(880,  560),
      new window.MoonShard(1060, 560),
    ];

    this.exit = new window.LevelExit(1090, 310, 64, 80);
  }

  /* =========================================================
     LEVEL 5 — The Void: Beyond the Shadow (Master)
     Teaches: Combines ALL mechanics; requires logical mastery
     ========================================================= */
  buildTheVoid() {
    this.totalShards = 6;

    this.walls = [
      { x: 40,   y: 40,  width: 1200, height: 24 },
      { x: 40,   y: 656, width: 1200, height: 24 },
      { x: 40,   y: 40,  width: 24,   height: 640 },
      { x: 1216, y: 40,  width: 24,   height: 640 },

      // Void labyrinth walls
      { x: 160,  y: 40,  width: 24, height: 200 },
      { x: 160,  y: 380, width: 24, height: 300 },
      { x: 320,  y: 160, width: 24, height: 160 },
      { x: 320,  y: 460, width: 24, height: 220 },
      { x: 480,  y: 40,  width: 24, height: 260 },
      { x: 480,  y: 400, width: 24, height: 280 },
      { x: 640,  y: 120, width: 24, height: 200 },
      { x: 640,  y: 440, width: 24, height: 240 },
      { x: 800,  y: 40,  width: 24, height: 300 },
      { x: 800,  y: 500, width: 24, height: 180 },
      { x: 960,  y: 140, width: 24, height: 220 },
      { x: 960,  y: 480, width: 24, height: 200 },
      { x: 1100, y: 40,  width: 24, height: 260 },
      { x: 1100, y: 500, width: 24, height: 180 },

      // Horizontal void barriers
      { x: 160, y: 200,  width: 160, height: 24 },
      { x: 160, y: 540,  width: 160, height: 24 },
      { x: 480, y: 280,  width: 160, height: 24 },
      { x: 640, y: 540,  width: 160, height: 24 },
      { x: 800, y: 380,  width: 160, height: 24 },
      { x: 960, y: 260,  width: 140, height: 24 },
    ];

    this.tablets = [
      new window.AncientTablet(90, 100,
        'The Void speaks:\n\n"Forget everything — and remember everything.\nEvery law you learned in the dark will serve you here.\nBlocks, plates, levers, keys, order — all at once."\n\nThis is the final trial.',
        'Voice of the Void'),
      new window.AncientTablet(260, 80,
        'Void Codex I:\n\nThree levers must be pulled in reverse order: C → B → A.\nOnly then will the first void seal break.',
        'Codex I'),
      new window.AncientTablet(540, 80,
        'Void Codex II:\n\nTwo blocks must rest on their plates simultaneously to open the central gate. Placing one will shift the other — think ahead.',
        'Codex II'),
      new window.AncientTablet(700, 80,
        'Void Codex III:\n\nThe key to the final gate is behind the second void seal. The second seal opens only when ALL plates are active.',
        'Codex III'),
      new window.AncientTablet(860, 80,
        'Void Codex IV:\n\nSix shards float in the void. Collect them all before reaching the exit — they cannot be retrieved once the portal activates.',
        'Codex IV'),
      new window.AncientTablet(1060, 100,
        'Last Message:\n\n"You who reach this point have proven that knowledge truly is the greatest ability.\nStep through — and bring the light back to Night Fall Land."',
        'The Final Message'),
    ];

    this.blocks = [
      new window.PushBlock(90,  350, 44),
      new window.PushBlock(90,  430, 44),
      new window.PushBlock(350, 200, 44),
      new window.PushBlock(350, 500, 44),
      new window.PushBlock(550, 350, 44),
    ];
    this.plates = [
      new window.PressurePlate(200, 300, 'void_p1', 44),
      new window.PressurePlate(200, 460, 'void_p2', 44),
      new window.PressurePlate(430, 320, 'void_p3', 44),
      new window.PressurePlate(700, 340, 'void_p4', 44),
      new window.PressurePlate(880, 560, 'void_p5', 44),
    ];

    this.levers = [
      new window.Lever(360,  90, 'void_lever_a'),
      new window.Lever(660, 400, 'void_lever_b'),
      new window.Lever(500, 490, 'void_lever_c'),
    ];

    // Lever sequence: C → B → A (tracked via _leverOrder)
    this._leverOrder    = ['void_lever_c', 'void_lever_b', 'void_lever_a'];
    this._leverProgress = 0;

    this.doors = [
      new window.Door(160, 200, 24, 180, 'void_lever_seq', false),   // first seal
      new window.Door(480, 300, 24, 100, 'void_p1',        false),
      new window.Door(640, 320, 24, 120, 'void_p3',        false),
      new window.Door(800, 380, 24, 120, 'void_all_plates', false),   // central gate
      new window.Door(960, 380, 24, 100, 'void_p4',        false),
      new window.Door(1100, 260, 24, 240, 'void_final', true),        // key-locked final gate
    ];

    this.keys   = [ new window.MoonKey(840, 420)   ];
    this.shards = [
      new window.MoonShard(200,  580),
      new window.MoonShard(400,  540),
      new window.MoonShard(560,  300),
      new window.MoonShard(720,  560),
      new window.MoonShard(900,  200),
      new window.MoonShard(1130, 400),
    ];

    this.exit = new window.LevelExit(1130, 320, 64, 80);
  }

  /* =========================================================
     UPDATE
     ========================================================= */
  update(dt, player, audio) {
    // Update blocks
    for (const b of this.blocks) {
      b.update(dt, this);
    }

    // Update pressure plates
    for (const p of this.plates) {
      p.update(player, this.blocks, audio);
    }

    // Handle ordered lever sequences (Levels 2 & 5)
    if (this._leverOrder) {
      this._updateLeverSequence(audio);
    }

    // Update doors
    for (const d of this.doors) {
      d.update(this.plates, this.levers, player);
    }

    // Special multi-plate checks for compound doors
    this._updateCompoundDoors();

    // Pickup updates
    for (const k of this.keys)   k.update(dt);
    for (const s of this.shards) s.update(dt);

    // Exit portal
    if (this.exit) {
      this.exit.update(dt);
      if (this.checkOverlap(player, this.exit)) {
        if (window.gameEngine && window.gameEngine.state === 'PLAYING') {
          window.gameEngine.triggerVictory();
        }
      }
    }
  }

  /** Lever-sequence logic: track order of lever activations */
  _updateLeverSequence(audio) {
    for (let i = 0; i < this.levers.length; i++) {
      const lev = this.levers[i];
      if (!lev._prevIsOn && lev.isOn) {
        // Just flipped ON — check if it's the next in sequence
        const expectedId = this._leverOrder[this._leverProgress];
        if (lev.id === expectedId) {
          this._leverProgress++;
          if (window.screenManager) {
            window.screenManager.showToast(
              `Mechanism ${this._leverProgress}/${this._leverOrder.length} engaged...`,
              'info'
            );
          }
        } else {
          // Wrong order — reset all levers
          this._leverProgress = 0;
          for (const l of this.levers) l.isOn = false;
          if (window.screenManager) {
            window.screenManager.showToast('The mechanisms reset — try the correct order!', 'error');
          }
        }
      }
      if (lev._prevIsOn && !lev.isOn) {
        // Turned OFF — reset sequence
        this._leverProgress = 0;
      }
      lev._prevIsOn = lev.isOn;
    }

    // Mark the sequence door as open when progress is complete
    const seqDone = this._leverProgress >= this._leverOrder.length;
    for (const d of this.doors) {
      if (d.linkedId === 'lever_seq' || d.linkedId === 'void_lever_seq') {
        d.isOpen = seqDone;
      }
    }
  }

  /** Compound doors that need ALL plates pressed or custom combos */
  _updateCompoundDoors() {
    // Level 3: "gen_1_2" door — needs gen_1 AND gen_2 pressed
    const gen1 = this.plates.find(p => p.id === 'gen_1');
    const gen2 = this.plates.find(p => p.id === 'gen_2');
    const masterLever = this.levers.find(l => l.id === 'master_switch');
    const gen3 = this.plates.find(p => p.id === 'gen_3');
    const gen4 = this.plates.find(p => p.id === 'gen_4');

    for (const d of this.doors) {
      if (d.linkedId === 'gen_1_2') {
        d.isOpen = !!(gen1?.isPressed && gen2?.isPressed);
      }
      if (d.linkedId === 'master_power') {
        const allGen = gen1?.isPressed && gen2?.isPressed && gen3?.isPressed && gen4?.isPressed;
        d.isOpen = !!(allGen && masterLever?.isOn);
      }
    }

    // Level 4: "summit_both" door — needs summit_a AND summit_b
    const sa = this.plates.find(p => p.id === 'summit_a');
    const sb = this.plates.find(p => p.id === 'summit_b');
    for (const d of this.doors) {
      if (d.linkedId === 'summit_both') {
        d.isOpen = !!(sa?.isPressed && sb?.isPressed);
      }
    }

    // Level 5: "void_all_plates" — needs ALL plates pressed
    if (this.levelId === 5) {
      const allPressed = this.plates.every(p => p.isPressed);
      for (const d of this.doors) {
        if (d.linkedId === 'void_all_plates') {
          d.isOpen = allPressed;
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
     DRAW
     ========================================================= */
  draw(ctx) {
    const floorColor  = ['#070a18', '#081020', '#0a0c18', '#070d14', '#04080f'][this.levelId - 1] || '#070a18';
    const wallColor   = ['#11162b', '#0d1a2e', '#1a1010', '#0a1422', '#08060f'][this.levelId - 1] || '#11162b';
    const wallStroke  = ['#1e293b', '#1a3040', '#2a1818', '#152033', '#14102a'][this.levelId - 1] || '#1e293b';
    const rimColor    = [
      'rgba(0,240,255,0.2)',
      'rgba(192,132,252,0.25)',
      'rgba(251,146,60,0.25)',
      'rgba(96,210,255,0.25)',
      'rgba(139,92,246,0.3)',
    ][this.levelId - 1] || 'rgba(0,240,255,0.2)';

    ctx.save();

    // Floor
    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Tile grid
    ctx.strokeStyle = 'rgba(255,255,255,0.028)';
    ctx.lineWidth = 1;
    for (let x = 64; x < this.width - 40; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 64); ctx.lineTo(x, this.height - 40); ctx.stroke();
    }
    for (let y = 64; y < this.height - 40; y += 48) {
      ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(this.width - 40, y); ctx.stroke();
    }

    // Draw order: plates → levers → tablets → doors → walls → blocks → pickups → exit
    for (const p of this.plates)  p.draw(ctx);
    for (const l of this.levers)  l.draw(ctx);
    for (const t of this.tablets) t.draw(ctx);
    for (const d of this.doors)   d.draw(ctx);

    // Walls
    for (const w of this.walls) {
      ctx.fillStyle   = wallColor;
      ctx.strokeStyle = wallStroke;
      ctx.lineWidth   = 2;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur  = 0;
      ctx.fillRect(w.x, w.y, w.width, w.height);
      ctx.strokeRect(w.x, w.y, w.width, w.height);
      // Glowing rim
      ctx.fillStyle = rimColor;
      ctx.fillRect(w.x, w.y, w.width, 3);
    }

    for (const b of this.blocks) b.draw(ctx);
    for (const k of this.keys)   k.draw(ctx);
    for (const s of this.shards) s.draw(ctx);
    if (this.exit) this.exit.draw(ctx);

    ctx.restore();
  }
}

window.World = World;

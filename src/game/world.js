/* ==========================================================================
   NIGHT FALL LAND - Darkwood Chamber 1 (Tutorial Level)
   Step-by-step interactive puzzle environment teaching:
   1. Movement & Observation
   2. Interaction ([E] Tablets & Levers)
   3. Pushable Blocks & Pressure Plates
   4. Keys, Hidden Moon Shards & Level Exit
   ========================================================================== */

class World {
  constructor() {
    this.width = 1280;
    this.height = 720;

    this.walls = [];
    this.blocks = [];
    this.plates = [];
    this.doors = [];
    this.levers = [];
    this.tablets = [];
    this.keys = [];
    this.shards = [];
    this.exit = null;

    this.buildDarkwoodTutorial();
  }

  buildDarkwoodTutorial() {
    // 1. Room Boundaries & Walls (Top-Down Chamber)
    this.walls = [
      // Outer Top & Bottom Boundaries
      { x: 40, y: 60, width: 1180, height: 28 },
      { x: 40, y: 560, width: 1180, height: 28 },

      // Outer Left & Right Boundaries
      { x: 40, y: 60, width: 28, height: 528 },
      { x: 1192, y: 60, width: 28, height: 528 },

      // Room Divider 1 (Separating Room 1 and Room 2)
      { x: 300, y: 60, width: 24, height: 180 },
      { x: 300, y: 380, width: 24, height: 200 },

      // Room Divider 2 (Separating Room 2 and Room 3)
      { x: 580, y: 60, width: 24, height: 230 },
      { x: 580, y: 390, width: 24, height: 190 },

      // Room Divider 3 (Alcove for Key & Shard)
      { x: 860, y: 60, width: 24, height: 210 },
      { x: 860, y: 410, width: 24, height: 170 },

      // Side Alcove Divider
      { x: 680, y: 380, width: 180, height: 24 },

      // Room Divider 4 (Wall enclosing the Final Locked Golden Gate)
      { x: 1010, y: 60, width: 24, height: 200 },
      { x: 1010, y: 380, width: 24, height: 180 }
    ];

    // 2. Interactive Tablets (Tutorial Messages)
    this.tablets = [
      new window.AncientTablet(
        180, 160,
        'Welcome, Wanderer.\n\nYou wake in the eternal darkness of Night Fall Land.\nWalk freely using [W, A, S, D] or Arrow keys.\nWhen near an ancient tablet or relic, press [E] to examine.',
        'Tablet I: The First Steps'
      ),
      new window.AncientTablet(
        420, 140,
        'Principles of Weight:\n\nWalk directly into stone blocks to push them.\nSlide the stone block onto the purple pressure plate to retract the energy barrier.',
        'Tablet II: Pressure & Mechanisms'
      ),
      new window.AncientTablet(
        700, 140,
        'The Ancient Switch:\n\nPress [E] to pull the lever and deactivate the laser barrier guarding the Golden Moon Key and hidden Moon Shard.',
        'Tablet III: Levers & Secrets'
      ),
      new window.AncientTablet(
        920, 160,
        'The Moon Archway:\n\nUse your collected Moon Key to unlock the ancient gate. Step onto the exit vortex to complete the Darkwood Awakening.',
        'Tablet IV: The Trial Complete'
      )
    ];

    // 3. Pushable Block & Pressure Plate (Room 2)
    this.blocks = [
      new window.PushBlock(380, 310, 44)
    ];

    this.plates = [
      new window.PressurePlate(470, 210, 'plate_gate_1', 48)
    ];

    // 4. Doors & Barriers
    this.doors = [
      // Door opened by pressure plate in Room 2
      new window.Door(580, 290, 24, 100, 'plate_gate_1', false),
      
      // Barrier opened by lever in Room 3
      new window.Door(860, 270, 24, 140, 'lever_gate_1', false),

      // Final Exit Door (Requires Moon Key)
      new window.Door(1010, 260, 24, 120, 'locked_exit_gate', true)
    ];

    // 5. Lever (Room 3)
    this.levers = [
      new window.Lever(680, 210, 'lever_gate_1')
    ];

    // 6. Moon Key & Moon Shard
    this.keys = [
      new window.MoonKey(760, 470)
    ];

    this.shards = [
      new window.MoonShard(800, 470)
    ];

    // 7. Level Exit (Room 4)
    this.exit = new window.LevelExit(1090, 290, 64, 64);
  }

  update(dt, player, audio) {
    // Update blocks
    for (const b of this.blocks) {
      b.update(dt, this);
    }

    // Update plates
    for (const p of this.plates) {
      p.update(player, this.blocks, audio);
    }

    // Update doors
    for (const d of this.doors) {
      d.update(this.plates, this.levers, player);
    }

    // Update pickups
    for (const k of this.keys) {
      k.update(dt);
    }
    for (const s of this.shards) {
      s.update(dt);
    }

    // Update Exit Portal
    if (this.exit) {
      this.exit.update(dt);
      // Check if player reaches exit
      if (this.checkOverlap(player, this.exit)) {
        if (window.gameEngine) {
          window.gameEngine.triggerVictory();
        }
      }
    }
  }

  checkWallCollision(box) {
    for (const w of this.walls) {
      if (this.checkOverlap(box, w)) return true;
    }
    return false;
  }

  checkOverlap(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  draw(ctx) {
    // 1. Chamber Floor Grid
    ctx.save();
    ctx.fillStyle = '#070a18';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle stone tile pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 60; x < this.width - 60; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 80);
      ctx.lineTo(x, 560);
      ctx.stroke();
    }
    for (let y = 80; y < 560; y += 48) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(this.width - 60, y);
      ctx.stroke();
    }

    // 2. Draw Pressure Plates
    for (const p of this.plates) {
      p.draw(ctx);
    }

    // 3. Draw Levers
    for (const l of this.levers) {
      l.draw(ctx);
    }

    // 4. Draw Tablets
    for (const t of this.tablets) {
      t.draw(ctx);
    }

    // 5. Draw Doors / Barriers
    for (const d of this.doors) {
      d.draw(ctx);
    }

    // 6. Draw Walls (Darkwood Ancient Stone)
    for (const w of this.walls) {
      ctx.fillStyle = '#11162b';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.fillRect(w.x, w.y, w.width, w.height);
      ctx.strokeRect(w.x, w.y, w.width, w.height);

      // Top glowing rim
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.fillRect(w.x, w.y, w.width, 3);
    }

    // 7. Draw Pushable Blocks
    for (const b of this.blocks) {
      b.draw(ctx);
    }

    // 8. Draw Pickups (Keys & Shards)
    for (const k of this.keys) {
      k.draw(ctx);
    }
    for (const s of this.shards) {
      s.draw(ctx);
    }

    // 9. Draw Exit Portal
    if (this.exit) {
      this.exit.draw(ctx);
    }

    ctx.restore();
  }
}

window.World = World;

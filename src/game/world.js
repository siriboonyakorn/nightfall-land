/* ==========================================================================
   NIGHT FALL LAND - World / Level Loader & Renderer
   Thin data loader that instantiates and ticks levels from src/levels/
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

    this.compoundRules = [];
    this._leverOrder    = null;
    this._leverProgress = 0;
    this.totalShards    = 1;
    this.playerStart    = { x: 140, y: 320 };

    this.loadLevelData(levelId);
  }

  loadLevelData(levelId) {
    // Resolve level data object from window
    const dataKey = `LEVEL_${levelId}_DATA`;
    const data = window[dataKey] || window.LEVEL_1_DATA;

    if (!data) {
      console.warn(`[World] Level data ${dataKey} not found! Falling back to empty world.`);
      return;
    }

    this.totalShards = data.totalShards || 1;
    if (data.playerStart) {
      this.playerStart = { ...data.playerStart };
    }

    // Walls
    this.walls = (data.walls || []).map(w => ({ ...w }));

    // Pushable Blocks
    this.blocks = (data.blocks || []).map(b => new window.PushBlock(b.x, b.y, b.size || 44));

    // Pressure Plates
    this.plates = (data.plates || []).map(p => new window.PressurePlate(p.x, p.y, p.id, p.size || 48));

    // Levers
    this.levers = (data.levers || []).map(l => new window.Lever(l.x, l.y, l.id));

    // Lever sequence order (if defined)
    this._leverOrder = data.leverOrder ? [...data.leverOrder] : null;
    this._leverProgress = 0;

    // Compound Rules
    this.compoundRules = data.compoundRules ? [...data.compoundRules] : [];

    // Doors
    this.doors = (data.doors || []).map(d => {
      const door = new window.Door(d.x, d.y, d.w || d.width, d.h || d.height, d.linkedId, !!d.requiresKey);
      // Mark if door is controlled by compound rules
      if (d.isCompound || this.compoundRules.some(r => r.doorId === d.linkedId)) {
        door.isCompound = true;
      }
      // Mark if door is controlled by lever sequence
      if (d.isSequence || d.linkedId === 'lever_seq' || d.linkedId === 'void_lever_seq') {
        door.isSequence = true;
      }
      return door;
    });

    // Tablets
    this.tablets = (data.tablets || []).map(t => new window.AncientTablet(t.x, t.y, t.message, t.title));

    // Pickups
    this.keys   = (data.keys || []).map(k => new window.MoonKey(k.x, k.y));
    this.shards = (data.shards || []).map(s => new window.MoonShard(s.x, s.y));

    // Exit
    if (data.exit) {
      this.exit = new window.LevelExit(
        data.exit.x,
        data.exit.y,
        data.exit.w || data.exit.width || 64,
        data.exit.h || data.exit.height || 80
      );
    }
  }

  update(dt, player, audio) {
    // 1. Update Pushable Blocks
    for (const b of this.blocks) {
      b.update(dt, this);
    }

    // 2. Update Pressure Plates
    for (const p of this.plates) {
      p.update(player, this.blocks, audio);
    }

    // 3. Handle Ordered Lever Sequences
    if (this._leverOrder && this._leverOrder.length > 0) {
      this._updateLeverSequence(audio);
    }

    // 4. Update Standard Doors
    for (const d of this.doors) {
      d.update(this.plates, this.levers, player);
    }

    // 5. Evaluate Dynamic Compound Rules
    this._updateCompoundDoors();

    // 6. Update Pickups
    for (const k of this.keys)   k.update(dt);
    for (const s of this.shards) s.update(dt);

    // 7. Exit Portal Collision
    if (this.exit) {
      this.exit.update(dt);
      if (this.checkOverlap(player, this.exit)) {
        if (window.gameEngine && window.gameEngine.state === 'PLAYING') {
          window.gameEngine.triggerVictory();
        }
      }
    }
  }

  _updateLeverSequence(audio) {
    for (let i = 0; i < this.levers.length; i++) {
      const lev = this.levers[i];
      if (!lev._prevIsOn && lev.isOn) {
        // Lever just flipped ON
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
          // Wrong order: reset progress and flip all levers OFF
          this._leverProgress = 0;
          for (const l of this.levers) l.isOn = false;
          if (window.screenManager) {
            window.screenManager.showToast('The mechanisms reset — try the correct order!', 'error');
          }
        }
      }
      if (lev._prevIsOn && !lev.isOn) {
        // Turned OFF manually
        this._leverProgress = 0;
      }
      lev._prevIsOn = lev.isOn;
    }

    // Sequence is satisfied when all levers pulled in order
    const seqDone = this._leverProgress >= this._leverOrder.length;
    for (const d of this.doors) {
      if (d.linkedId === 'lever_seq' || d.linkedId === 'void_lever_seq') {
        d.isOpen = seqDone;
      }
    }
  }

  _updateCompoundDoors() {
    for (const rule of this.compoundRules) {
      const door = this.doors.find(d => d.linkedId === rule.doorId);
      if (!door) continue;

      let satisfied = true;

      // Check all plates in level
      if (rule.allPlates) {
        satisfied = this.plates.length > 0 && this.plates.every(p => p.isPressed);
      }

      // Check specific plate IDs
      if (rule.plateIds && rule.plateIds.length > 0) {
        const platesOk = rule.plateIds.every(pid => {
          const p = this.plates.find(pl => pl.id === pid);
          return p && p.isPressed;
        });
        if (!platesOk) satisfied = false;
      }

      // Check specific lever IDs
      if (rule.leverIds && rule.leverIds.length > 0) {
        const leversOk = rule.leverIds.every(lid => {
          const l = this.levers.find(lev => lev.id === lid);
          return l && l.isOn;
        });
        if (!leversOk) satisfied = false;
      }

      // Check inverted lever (e.g. door is open until lever is pulled)
      if (rule.type === 'not_lever' || rule.invertLever) {
        const targetLeverId = rule.leverId || rule.invertLever;
        const l = this.levers.find(lev => lev.id === targetLeverId);
        if (l && l.isOn) {
          satisfied = false;
        }
      }

      door.isOpen = satisfied;
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
      r1.x < r2.x + r2.width  &&
      r1.x + r1.width  > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  draw(ctx) {
    const floorColor = ['#070a18', '#081020', '#0a0c18', '#070d14', '#04080f'][this.levelId - 1] || '#070a18';
    const wallColor  = ['#11162b', '#0d1a2e', '#1a1010', '#0a1422', '#08060f'][this.levelId - 1] || '#11162b';
    const wallStroke = ['#1e293b', '#1a3040', '#2a1818', '#152033', '#14102a'][this.levelId - 1] || '#1e293b';
    const rimColor   = [
      'rgba(0,240,255,0.2)',
      'rgba(192,132,252,0.25)',
      'rgba(251,146,60,0.25)',
      'rgba(96,210,255,0.25)',
      'rgba(139,92,246,0.3)',
    ][this.levelId - 1] || 'rgba(0,240,255,0.2)';

    ctx.save();

    // 1. Floor
    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Tile Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.028)';
    ctx.lineWidth = 1;
    for (let x = 64; x < this.width - 40; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 64); ctx.lineTo(x, this.height - 40); ctx.stroke();
    }
    for (let y = 64; y < this.height - 40; y += 48) {
      ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(this.width - 40, y); ctx.stroke();
    }

    // 3. Puzzle Objects (Back to Front: plates -> levers -> tablets -> doors -> walls -> blocks -> pickups -> exit)
    for (const p of this.plates)  p.draw(ctx);
    for (const l of this.levers)  l.draw(ctx);
    for (const t of this.tablets) t.draw(ctx);
    for (const d of this.doors)   d.draw(ctx);

    // 4. Walls
    for (const w of this.walls) {
      ctx.fillStyle   = wallColor;
      ctx.strokeStyle = wallStroke;
      ctx.lineWidth   = 2;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur  = 0;
      ctx.fillRect(w.x, w.y, w.width, w.height);
      ctx.strokeRect(w.x, w.y, w.width, w.height);
      // Glowing ambient rim
      ctx.fillStyle = rimColor;
      ctx.fillRect(w.x, w.y, w.width, 3);
    }

    // 5. Dynamic Entities & Pickups
    for (const b of this.blocks) b.draw(ctx);
    for (const k of this.keys)   k.draw(ctx);
    for (const s of this.shards) s.draw(ctx);
    if (this.exit) this.exit.draw(ctx);

    ctx.restore();
  }
}

window.World = World;

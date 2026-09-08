/* ==========================================================================
   NIGHT FALL LAND - World / Level Loader & Renderer
   Thin data loader that instantiates and ticks all puzzle objects,
   NPCs, lighting system, and secret tracking.
   ========================================================================== */

class World {
  constructor(levelId = 1) {
    this.width  = 1280;
    this.height = 720;
    this.levelId = levelId;

    // Core puzzle objects
    this.walls      = [];
    this.blocks     = [];
    this.plates     = [];
    this.doors      = [];
    this.levers     = [];
    this.tablets    = [];
    this.keys       = [];
    this.shards     = [];
    this.exit       = null;

    // New environmental mechanics
    this.teleporters  = [];
    this.buttons      = [];
    this.braziers     = [];
    this.barriers     = [];   // IceBarrier instances
    this.iceTiles     = [];   // IceTile instances (slippery floor)
    this.emitters     = [];   // LightEmitter instances
    this.mirrors      = [];   // Mirror instances
    this.receptors    = [];   // LightReceptor instances
    this.secretWalls  = [];   // SecretWall instances

    // Characters
    this.npcs         = [];   // WandererNPC, OwlNPC
    this.watchers     = [];   // WatcherEntity (passive observers)

    // Puzzle state
    this.compoundRules  = [];
    this._leverOrder    = null;
    this._leverProgress = 0;
    this.totalShards    = 1;
    this.playerStart    = { x: 140, y: 320 };

    // Secret / discovery tracking
    this.secretsFound   = 0;
    this.totalSecrets   = 0;

    // Lighting system
    this.lighting = (window.LightingSystem) ? new window.LightingSystem() : null;

    this.loadLevelData(levelId);

    // Count secrets after load
    this.totalSecrets = this.secretWalls.length;
  }

  loadLevelData(levelId) {
    const dataKey = `LEVEL_${levelId}_DATA`;
    const data = window[dataKey];

    if (!data) {
      console.warn(`[World] Level data ${dataKey} not found! Using empty world.`);
      return;
    }

    this.totalShards = data.totalShards || 1;
    if (data.playerStart) {
      this.playerStart = { ...data.playerStart };
    }

    // --- Core Objects ---
    this.walls  = (data.walls  || []).map(w => ({ ...w }));
    this.blocks = (data.blocks || []).map(b => new window.PushBlock(b.x, b.y, b.size || 44));
    this.plates = (data.plates || []).map(p => new window.PressurePlate(p.x, p.y, p.id, p.size || 48));
    this.levers = (data.levers || []).map(l => new window.Lever(l.x, l.y, l.id));

    this._leverOrder    = data.leverOrder ? [...data.leverOrder] : null;
    this._leverProgress = 0;
    this.compoundRules  = data.compoundRules ? [...data.compoundRules] : [];

    this.doors = (data.doors || []).map(d => {
      const door = new window.Door(d.x, d.y, d.w || d.width, d.h || d.height, d.linkedId, !!d.requiresKey);
      if (d.isCompound || this.compoundRules.some(r => r.doorId === d.linkedId)) {
        door.isCompound = true;
      }
      if (d.isSequence || d.linkedId === 'lever_seq' || d.linkedId === 'void_lever_seq') {
        door.isSequence = true;
      }
      return door;
    });

    this.tablets = (data.tablets || []).map(t => new window.AncientTablet(t.x, t.y, t.message, t.title));
    this.keys    = (data.keys   || []).map(k => new window.MoonKey(k.x, k.y));
    this.shards  = (data.shards || []).map(s => new window.MoonShard(s.x, s.y));

    if (data.exit) {
      this.exit = new window.LevelExit(
        data.exit.x, data.exit.y,
        data.exit.w || data.exit.width  || 64,
        data.exit.h || data.exit.height || 80
      );
    }

    // --- New Environmental Mechanics (with safe guards) ---
    if (window.Teleporter) {
      this.teleporters = (data.teleporters || []).map(
        t => new window.Teleporter(t.x, t.y, t.id, t.targetId, t.color)
      );
    }

    if (window.PuzzleButton) {
      this.buttons = (data.buttons || []).map(
        b => new window.PuzzleButton(b.x, b.y, b.linkedId, b.duration, b.label)
      );
    }

    if (window.FireBrazier) {
      this.braziers = (data.braziers || []).map(
        b => new window.FireBrazier(b.x, b.y, !!b.isLit)
      );
    }

    if (window.IceBarrier) {
      this.barriers = (data.barriers || []).map(
        b => new window.IceBarrier(b.x, b.y, b.width || 48, b.height || 48)
      );
    }

    if (window.IceTile) {
      this.iceTiles = (data.iceTiles || []).map(
        t => new window.IceTile(t.x, t.y, t.width || 48, t.height || 48)
      );
    }

    if (window.LightEmitter) {
      this.emitters = (data.emitters || []).map(
        e => new window.LightEmitter(e.x, e.y, e.direction || 'right', e.color)
      );
    }

    if (window.Mirror) {
      this.mirrors = (data.mirrors || []).map(
        m => new window.Mirror(m.x, m.y, m.angle || 45)
      );
    }

    if (window.LightReceptor) {
      this.receptors = (data.receptors || []).map(
        r => new window.LightReceptor(r.x, r.y, r.linkedId)
      );
    }

    if (window.SecretWall) {
      this.secretWalls = (data.secretWalls || []).map(
        s => new window.SecretWall(s.x, s.y, s.width || 48, s.height || 48, s.secretId, s.title)
      );
    }

    // --- Characters ---
    if (window.WandererNPC) {
      this.npcs = [
        ...(data.wanderers || []).map(n => new window.WandererNPC(n.x, n.y, n.dialogue)),
        ...(data.owls      || []).map(n => new window.OwlNPC(n.x, n.y, n.hint))
      ];
    }

    if (window.WatcherEntity) {
      this.watchers = (data.watchers || []).map(
        w => new window.WatcherEntity(w.x, w.y)
      );
    }
  }

  // Called by SecretWall when discovered
  onSecretFound(secretId, title) {
    this.secretsFound++;
    if (window.storageManager) {
      window.storageManager.discoverSecret(this.levelId, secretId);
    }
    if (window.screenManager) {
      window.screenManager.showToast(`✦ Secret Discovered: "${title}"`, 'success');
    }
  }

  update(dt, player, audio) {
    // 1. Pushable Blocks
    for (const b of this.blocks) b.update(dt, this);

    // 2. Pressure Plates
    for (const p of this.plates) p.update(player, this.blocks, audio);

    // 3. Puzzle Buttons
    for (const btn of this.buttons) btn.update(dt, player, this.blocks, audio);

    // 4. Fire Braziers → melt adjacent ice barriers
    for (const f of this.braziers) f.update(dt, this.barriers, audio);

    // 5. Ice Barriers (melt animation)
    for (const bar of this.barriers) bar.update(dt);

    // 6. Lever Sequences
    if (this._leverOrder && this._leverOrder.length > 0) {
      this._updateLeverSequence(audio);
    }

    // 7. Reset receptor states every tick (recomputed by beam casts)
    for (const r of this.receptors) r.isEnergized = false;

    // 8. Cast Light Beams (emitters trace through mirrors → receptors)
    for (const em of this.emitters) em.castBeam(this);

    // 9. Update Receptors (play sound on activation)
    for (const r of this.receptors) r.update(audio);

    // 10. Update Standard Doors (now passes buttons & receptors)
    for (const d of this.doors) {
      d.update(this.plates, this.levers, player, this.buttons, this.receptors);
    }

    // 11. Compound Doors
    this._updateCompoundDoors();

    // 12. Teleporters
    for (const tp of this.teleporters) {
      tp.update(dt, player, this.blocks, this.teleporters, audio);
    }

    // 13. NPCs animation
    for (const npc of this.npcs) npc.update(dt);

    // 14. Watchers (dissolve when approached)
    for (const w of this.watchers) w.update(dt, player, audio, this);

    // 15. Secret Walls (auto-reveal on proximity)
    for (const sw of this.secretWalls) sw.update(dt, player, audio, this);

    // 16. Pickups animation
    for (const k of this.keys)   k.update(dt);
    for (const s of this.shards) s.update(dt);

    // 17. Exit portal collision
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
          this._leverProgress = 0;
          for (const l of this.levers) l.isOn = false;
          if (window.screenManager) {
            window.screenManager.showToast('The mechanisms reset — try the correct order!', 'error');
          }
        }
      }
      if (lev._prevIsOn && !lev.isOn) {
        this._leverProgress = 0;
      }
      lev._prevIsOn = lev.isOn;
    }

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

      if (rule.allPlates) {
        satisfied = this.plates.length > 0 && this.plates.every(p => p.isPressed);
      }
      if (rule.plateIds && rule.plateIds.length > 0) {
        const ok = rule.plateIds.every(pid => {
          const p = this.plates.find(pl => pl.id === pid);
          return p && p.isPressed;
        });
        if (!ok) satisfied = false;
      }
      if (rule.leverIds && rule.leverIds.length > 0) {
        const ok = rule.leverIds.every(lid => {
          const l = this.levers.find(lev => lev.id === lid);
          return l && l.isOn;
        });
        if (!ok) satisfied = false;
      }
      if (rule.type === 'not_lever' || rule.invertLever) {
        const targetId = rule.leverId || rule.invertLever;
        const l = this.levers.find(lev => lev.id === targetId);
        if (l && l.isOn) satisfied = false;
      }
      // Check receptor IDs
      if (rule.receptorIds && rule.receptorIds.length > 0) {
        const ok = rule.receptorIds.every(rid => {
          const r = this.receptors.find(rec => rec.linkedId === rid);
          return r && r.isEnergized;
        });
        if (!ok) satisfied = false;
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
    // Per-region visual palette (8 regions)
    const floorColors = [
      '#070a18',  // 1 Darkwood     – dark forest green/blue
      '#060f1c',  // 2 Moon Village – blue-gray
      '#0e0808',  // 3 Old Factory  – dark industrial
      '#060c14',  // 4 Frozen Peak  – ice blue
      '#130a03',  // 5 Deadlands    – dark orange/sand
      '#0a0614',  // 6 Lost City    – purple
      '#0c0306',  // 7 Deep Night   – deep crimson
      '#030303',  // 8 The Void     – pure black
    ];
    const wallColors = [
      '#11162b', '#0d1a2e', '#1a1010', '#0a1422',
      '#1a0e06', '#130820', '#180306', '#0a0a0a',
    ];
    const wallStrokes = [
      '#1e293b', '#1a3040', '#2a1818', '#152033',
      '#2c1a08', '#201040', '#280610', '#181818',
    ];
    const rimColors = [
      'rgba(0,240,255,0.2)',
      'rgba(192,132,252,0.25)',
      'rgba(251,146,60,0.25)',
      'rgba(96,210,255,0.25)',
      'rgba(251,146,60,0.18)',
      'rgba(192,132,252,0.3)',
      'rgba(239,68,68,0.25)',
      'rgba(255,255,255,0.12)',
    ];

    const idx        = Math.min(this.levelId - 1, 7);
    const floorColor = floorColors[idx];
    const wallColor  = wallColors[idx];
    const wallStroke = wallStrokes[idx];
    const rimColor   = rimColors[idx];

    ctx.save();

    // 1. Floor
    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Ice Tiles (slippery floor surfaces — drawn below objects)
    for (const ice of this.iceTiles) ice.draw(ctx);

    // 3. Tile Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 64; x < this.width - 40; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 64); ctx.lineTo(x, this.height - 40); ctx.stroke();
    }
    for (let y = 64; y < this.height - 40; y += 48) {
      ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(this.width - 40, y); ctx.stroke();
    }

    // 4. Back-layer puzzle objects
    for (const p of this.plates)  p.draw(ctx);
    for (const l of this.levers)  l.draw(ctx);
    for (const t of this.tablets) t.draw(ctx);
    for (const tp of this.teleporters) tp.draw(ctx);
    for (const btn of this.buttons)    btn.draw(ctx);
    for (const r of this.receptors)   r.draw(ctx);
    for (const em of this.emitters)   em.draw(ctx);  // also draws beams
    for (const m of this.mirrors)     m.draw(ctx);
    for (const f of this.braziers)    f.draw(ctx);
    for (const bar of this.barriers)  bar.draw(ctx);
    for (const d of this.doors)       d.draw(ctx);
    for (const sw of this.secretWalls) sw.draw(ctx);

    // 5. Walls
    for (const w of this.walls) {
      ctx.fillStyle   = wallColor;
      ctx.strokeStyle = wallStroke;
      ctx.lineWidth   = 2;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur  = 0;
      ctx.fillRect(w.x, w.y, w.width, w.height);
      ctx.strokeRect(w.x, w.y, w.width, w.height);
      ctx.fillStyle = rimColor;
      ctx.fillRect(w.x, w.y, w.width, 3);
    }

    // 6. Dynamic entities, NPCs & pickups
    for (const b of this.blocks)  b.draw(ctx);
    for (const npc of this.npcs)  npc.draw(ctx);
    for (const w of this.watchers) w.draw(ctx);
    for (const k of this.keys)    k.draw(ctx);
    for (const s of this.shards)  s.draw(ctx);
    if (this.exit) this.exit.draw(ctx);

    ctx.restore();

    // 7. Atmospheric Darkness & Lighting Overlay (rendered last)
    // NOTE: player is drawn by engine AFTER world.draw(); lighting will be
    // applied via engine.renderGame() after player draw.
  }

  drawLighting(ctx, player) {
    if (this.lighting && this.lighting.enabled) {
      this.lighting.render(ctx, this, player);
    }
  }
}

window.World = World;

/* ==========================================================================
   NIGHT FALL LAND - 2D Dynamic Lighting & Atmospheric Engine
   Casts dynamic lantern light, wall torch illumination, optical beam glow,
   and creates a deep atmospheric twilight darkness shroud with floating dust.
   ========================================================================== */

class LightingEngine {
  constructor(width = 1280, height = 720) {
    this.width = width;
    this.height = height;

    // Offscreen canvas for lighting mask
    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas.width = width;
    this.lightCanvas.height = height;
    this.lightCtx = this.lightCanvas.getContext('2d');

    // Floating atmospheric dust motes
    this.motes = [];
    this.initMotes(35);

    this.animTime = 0;
  }

  initMotes(count) {
    this.motes = [];
    for (let i = 0; i < count; i++) {
      this.motes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 14,
        vy: -8 - Math.random() * 16,
        alpha: 0.2 + Math.random() * 0.5,
        twinkleSpeed: 1 + Math.random() * 3,
        color: Math.random() < 0.6 ? '#00f0ff' : '#f59e0b'
      });
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.lightCanvas.width = width;
    this.lightCanvas.height = height;
  }

  update(dt) {
    this.animTime += dt;

    // Update floating dust motes
    for (const m of this.motes) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.y < 30) {
        m.y = this.height - 40;
        m.x = Math.random() * this.width;
      }
      if (m.x < 40) m.x = this.width - 50;
      if (m.x > this.width - 40) m.x = 50;
    }
  }

  /**
   * Render the atmospheric lighting pass over the main canvas.
   * @param {CanvasRenderingContext2D} ctx - Main game canvas context
   * @param {Player} player - Player entity
   * @param {World} world - Current game world
   */
  render(ctx, player, world) {
    const lCtx = this.lightCtx;
    const w = this.width;
    const h = this.height;

    // 1. Fill lighting mask with darkness shroud (ambient twilight)
    // In Night Fall Land, the world has no sun; ambient is deep dark slate/indigo
    lCtx.clearRect(0, 0, w, h);
    lCtx.fillStyle = 'rgba(4, 7, 18, 0.91)';
    lCtx.fillRect(0, 0, w, h);

    // 2. Punch out light holes using 'destination-out' and additive glow blending
    lCtx.save();
    lCtx.globalCompositeOperation = 'destination-out';

    // A. Player's Celestial Lantern (Primary Light)
    if (player) {
      const px = player.x + player.width / 2;
      const py = player.y + player.height / 2;
      // Gentle natural breathing flicker
      const flicker = Math.sin(this.animTime * 4.5) * 4 + Math.cos(this.animTime * 7.1) * 2;
      const radius = 175 + flicker;

      const grad = lCtx.createRadialGradient(px, py, 20, px, py, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.88)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.45)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      lCtx.fillStyle = grad;
      lCtx.beginPath();
      lCtx.arc(px, py, radius, 0, Math.PI * 2);
      lCtx.fill();
    }

    // B. Wall Sconces / Torches in World
    if (world && world.torches) {
      for (const torch of world.torches) {
        const tflicker = Math.sin(this.animTime * 8 + torch.x) * 5 + Math.cos(this.animTime * 12 + torch.y) * 3;
        const tradius = (torch.radius || 110) + tflicker;

        const tgrad = lCtx.createRadialGradient(torch.x, torch.y, 8, torch.x, torch.y, tradius);
        tgrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        tgrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.65)');
        tgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        lCtx.fillStyle = tgrad;
        lCtx.beginPath();
        lCtx.arc(torch.x, torch.y, tradius, 0, Math.PI * 2);
        lCtx.fill();
      }
    }

    // C. Optical Light Emitters & Receptors
    if (world && world.lightEmitters) {
      for (const emitter of world.lightEmitters) {
        const eg = lCtx.createRadialGradient(emitter.x, emitter.y, 6, emitter.x, emitter.y, 75);
        eg.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        eg.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = eg;
        lCtx.beginPath();
        lCtx.arc(emitter.x, emitter.y, 75, 0, Math.PI * 2);
        lCtx.fill();
      }
    }

    if (world && world.lightReceptors) {
      for (const rec of world.lightReceptors) {
        const rad = rec.isPowered ? 95 : 55;
        const rg = lCtx.createRadialGradient(rec.x, rec.y, 6, rec.x, rec.y, rad);
        rg.addColorStop(0, rec.isPowered ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.6)');
        rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = rg;
        lCtx.beginPath();
        lCtx.arc(rec.x, rec.y, rad, 0, Math.PI * 2);
        lCtx.fill();
      }
    }

    // D. Astral Dial Pedestals
    if (world && world.astralDials) {
      for (const dial of world.astralDials) {
        const dg = lCtx.createRadialGradient(dial.x + dial.width / 2, dial.y + dial.height / 2, 8, dial.x + dial.width / 2, dial.y + dial.height / 2, 70);
        dg.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
        dg.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = dg;
        lCtx.beginPath();
        lCtx.arc(dial.x + dial.width / 2, dial.y + dial.height / 2, 70, 0, Math.PI * 2);
        lCtx.fill();
      }
    }

    // E. Exit Portal
    if (world && world.exit) {
      const ex = world.exit.x + world.exit.width / 2;
      const ey = world.exit.y + world.exit.height / 2;
      const pulse = Math.sin(this.animTime * 3) * 12;
      const eg = lCtx.createRadialGradient(ex, ey, 14, ex, ey, 130 + pulse);
      eg.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      eg.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
      eg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = eg;
      lCtx.beginPath();
      lCtx.arc(ex, ey, 130 + pulse, 0, Math.PI * 2);
      lCtx.fill();
    }

    // F. Pressure Plates & Shards
    if (world && world.shards) {
      for (const s of world.shards) {
        if (!s.collected) {
          const sg = lCtx.createRadialGradient(s.x + 14, s.y + 14, 4, s.x + 14, s.y + 14, 60);
          sg.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
          sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = sg;
          lCtx.beginPath();
          lCtx.arc(s.x + 14, s.y + 14, 60, 0, Math.PI * 2);
          lCtx.fill();
        }
      }
    }

    lCtx.restore();

    // 3. Draw the darkness mask onto the main game canvas
    ctx.save();
    ctx.drawImage(this.lightCanvas, 0, 0);

    // 4. Add warm atmospheric color tint & bloom over the illuminated spots
    ctx.globalCompositeOperation = 'lighter';

    // A. Player Lantern warm amber/cyan glow
    if (player) {
      const px = player.x + player.width / 2;
      const py = player.y + player.height / 2;
      const warmGrad = ctx.createRadialGradient(px, py, 4, px, py, 130);
      warmGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      warmGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.08)');
      warmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = warmGrad;
      ctx.beginPath();
      ctx.arc(px, py, 130, 0, Math.PI * 2);
      ctx.fill();
    }

    // B. Wall Torches amber warmth
    if (world && world.torches) {
      for (const torch of world.torches) {
        const tg = ctx.createRadialGradient(torch.x, torch.y, 4, torch.x, torch.y, 90);
        tg.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
        tg.addColorStop(0.6, 'rgba(239, 68, 68, 0.08)');
        tg.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = tg;
        ctx.beginPath();
        ctx.arc(torch.x, torch.y, 90, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // C. Exit Portal starlight bloom
    if (world && world.exit) {
      const ex = world.exit.x + world.exit.width / 2;
      const ey = world.exit.y + world.exit.height / 2;
      const exitBloom = ctx.createRadialGradient(ex, ey, 10, ex, ey, 120);
      exitBloom.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      exitBloom.addColorStop(0.6, 'rgba(168, 85, 247, 0.15)');
      exitBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = exitBloom;
      ctx.beginPath();
      ctx.arc(ex, ey, 120, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // 5. Draw floating ambient dust motes inside illuminated regions
    ctx.save();
    for (const m of this.motes) {
      const twinkle = Math.sin(this.animTime * m.twinkleSpeed) * 0.2;
      const alpha = Math.max(0.05, Math.min(0.85, m.alpha + twinkle));
      ctx.fillStyle = m.color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

window.LightingEngine = LightingEngine;

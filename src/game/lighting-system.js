/* ==========================================================================
   NIGHT FALL LAND - Atmospheric Darkness & Dynamic Lighting System
   Renders atmospheric darkness with radial illumination around light sources
   ========================================================================== */

class LightingSystem {
  constructor() {
    this.enabled = true;
    this.lightCanvas = document.createElement('canvas');
    this.lightCanvas.width = 1280;
    this.lightCanvas.height = 720;
    this.lightCtx = this.lightCanvas.getContext('2d');
  }

  render(ctx, world, player) {
    if (!this.enabled || !ctx) return;

    const w = this.lightCanvas.width;
    const h = this.lightCanvas.height;
    const lCtx = this.lightCtx;

    // 1. Fill with ambient dark night overlay
    lCtx.globalCompositeOperation = 'source-over';
    lCtx.fillStyle = 'rgba(4, 6, 16, 0.86)';
    lCtx.fillRect(0, 0, w, h);

    // 2. Cut out light sources using destination-out
    lCtx.globalCompositeOperation = 'destination-out';

    // A. Player Lantern Light
    if (player) {
      const px = player.x + player.width / 2;
      const py = player.y + player.height / 2;
      const rad = 145;
      const grad = lCtx.createRadialGradient(px, py, 15, px, py, rad);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      lCtx.fillStyle = grad;
      lCtx.beginPath();
      lCtx.arc(px, py, rad, 0, Math.PI * 2);
      lCtx.fill();
    }

    if (world) {
      // B. Fire Braziers (Lit fires give bright warm illumination)
      for (const f of (world.braziers || [])) {
        if (f.isLit) {
          const bx = f.x + f.width / 2;
          const by = f.y + f.height / 2;
          const bRad = 135;
          const bGrad = lCtx.createRadialGradient(bx, by, 10, bx, by, bRad);
          bGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
          bGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
          bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = bGrad;
          lCtx.beginPath();
          lCtx.arc(bx, by, bRad, 0, Math.PI * 2);
          lCtx.fill();
        }
      }

      // C. Exit Portal
      if (world.exit) {
        const ex = world.exit.x + world.exit.width / 2;
        const ey = world.exit.y + world.exit.height / 2;
        const eGrad = lCtx.createRadialGradient(ex, ey, 10, ex, ey, 120);
        eGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        eGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = eGrad;
        lCtx.beginPath();
        lCtx.arc(ex, ey, 120, 0, Math.PI * 2);
        lCtx.fill();
      }

      // D. Teleporters
      for (const t of (world.teleporters || [])) {
        const tx = t.x + t.width / 2;
        const ty = t.y + t.height / 2;
        const tGrad = lCtx.createRadialGradient(tx, ty, 5, tx, ty, 85);
        tGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        tGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        lCtx.fillStyle = tGrad;
        lCtx.beginPath();
        lCtx.arc(tx, ty, 85, 0, Math.PI * 2);
        lCtx.fill();
      }

      // E. Moon Shards & Moon Keys
      for (const s of (world.shards || [])) {
        if (!s.collected) {
          const sx = s.x + s.width / 2;
          const sy = s.y + s.height / 2;
          const sGrad = lCtx.createRadialGradient(sx, sy, 4, sx, sy, 70);
          sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
          sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = sGrad;
          lCtx.beginPath();
          lCtx.arc(sx, sy, 70, 0, Math.PI * 2);
          lCtx.fill();
        }
      }

      // F. Light Beams
      for (const em of (world.emitters || [])) {
        for (const seg of (em.beamSegments || [])) {
          lCtx.lineWidth = 26;
          lCtx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
          lCtx.beginPath();
          lCtx.moveTo(seg.x1, seg.y1);
          lCtx.lineTo(seg.x2, seg.y2);
          lCtx.stroke();
        }
      }

      // G. The Wanderer NPC's lantern
      for (const n of (world.npcs || [])) {
        if (n instanceof window.WandererNPC) {
          const nx = n.x + n.width / 2;
          const ny = n.y + n.height / 2;
          const nGrad = lCtx.createRadialGradient(nx, ny, 10, nx, ny, 110);
          nGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
          nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          lCtx.fillStyle = nGrad;
          lCtx.beginPath();
          lCtx.arc(nx, ny, 110, 0, Math.PI * 2);
          lCtx.fill();
        }
      }
    }

    // 3. Composite darkness overlay onto main game canvas
    ctx.drawImage(this.lightCanvas, 0, 0);
  }
}

window.LightingSystem = LightingSystem;

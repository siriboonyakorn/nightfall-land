/* ==========================================================================
   NIGHTFALL LAND - Particle FX & Floating Combat Text Engine
   ========================================================================== */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.ghostTrails = [];
    this.textParticles = [];
  }

  reset() {
    this.particles = [];
    this.ghostTrails = [];
    this.textParticles = [];
  }

  // Add general particle
  emit(x, y, count = 5, options = {}) {
    for (let i = 0; i < count; i++) {
      const angle = options.angle !== undefined ? options.angle + (Math.random() - 0.5) * (options.spread || 1) : Math.random() * Math.PI * 2;
      const speed = (options.minSpeed || 40) + Math.random() * ((options.maxSpeed || 140) - (options.minSpeed || 40));
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (options.size || 3) * (0.6 + Math.random() * 0.8),
        color: options.color || '#00f0ff',
        alpha: options.alpha || 1,
        life: 0,
        maxLife: options.life || 0.4 + Math.random() * 0.3,
        gravity: options.gravity || 0,
        glow: options.glow || true
      });
    }
  }

  // Jump Dust
  emitJumpDust(x, y) {
    this.emit(x, y + 10, 8, {
      angle: -Math.PI / 2,
      spread: Math.PI * 0.8,
      minSpeed: 30,
      maxSpeed: 90,
      color: '#a855f7',
      life: 0.35,
      size: 4
    });
  }

  // Dash Ghost Trail
  addGhostTrail(x, y, width, height, facing, color) {
    this.ghostTrails.push({
      x,
      y,
      width,
      height,
      facing,
      color,
      alpha: 0.55,
      life: 0,
      maxLife: 0.25
    });
  }

  // Slash Arc Visual
  emitSlash(x, y, facing, radius = 55, color = '#00f0ff') {
    for (let i = 0; i < 14; i++) {
      const angle = (facing === 1 ? -0.8 : Math.PI - 0.8) + (i / 14) * 1.6;
      this.particles.push({
        x: x + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4),
        y: y + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4),
        vx: Math.cos(angle) * 120 * facing,
        vy: Math.sin(angle) * 60,
        size: 3 + Math.random() * 3,
        color: i % 2 === 0 ? color : '#a855f7',
        alpha: 1,
        life: 0,
        maxLife: 0.22,
        gravity: 0,
        glow: true
      });
    }
  }

  // Impact Sparks on hit
  emitImpact(x, y, color = '#00f0ff') {
    this.emit(x, y, 16, {
      minSpeed: 80,
      maxSpeed: 240,
      color: color,
      life: 0.3,
      size: 3,
      gravity: 300
    });
  }

  // Enemy Defeat Burst
  emitDeath(x, y) {
    this.emit(x, y, 25, {
      minSpeed: 60,
      maxSpeed: 220,
      color: '#a855f7',
      life: 0.6,
      size: 5,
      gravity: 120
    });
    this.emit(x, y, 15, {
      minSpeed: 40,
      maxSpeed: 180,
      color: '#00f0ff',
      life: 0.4,
      size: 4
    });
  }

  // Floating Combat Text (+45, CRIT!, +1 Soul)
  addText(x, y, text, color = '#fff', fontSize = 16, isCrit = false) {
    this.textParticles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - 10,
      text,
      color,
      fontSize: isCrit ? fontSize * 1.3 : fontSize,
      isCrit,
      vy: isCrit ? -110 : -75,
      alpha: 1,
      life: 0,
      maxLife: 0.8
    });
  }

  update(dt) {
    // Update simple particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = 1 - (p.life / p.maxLife);
    }

    // Update ghost trails
    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      const g = this.ghostTrails[i];
      g.life += dt;
      if (g.life >= g.maxLife) {
        this.ghostTrails.splice(i, 1);
        continue;
      }
      g.alpha = 0.55 * (1 - g.life / g.maxLife);
    }

    // Update text particles
    for (let i = this.textParticles.length - 1; i >= 0; i--) {
      const t = this.textParticles[i];
      t.life += dt;
      if (t.life >= t.maxLife) {
        this.textParticles.splice(i, 1);
        continue;
      }
      t.y += t.vy * dt;
      t.vy += 60 * dt; // slight deceleration
      t.alpha = 1 - Math.pow(t.life / t.maxLife, 2);
    }
  }

  draw(ctx) {
    // Draw Ghost Trails
    for (let g of this.ghostTrails) {
      ctx.save();
      ctx.globalAlpha = g.alpha;
      ctx.fillStyle = g.color;
      ctx.shadowColor = g.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(g.x, g.y, g.width, g.height, 6);
      ctx.fill();
      ctx.restore();
    }

    // Draw Particles
    for (let p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      if (p.glow) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * (1 - p.life / p.maxLife)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Floating Combat Text
    for (let t of this.textParticles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = t.isCrit ? 14 : 6;
      ctx.font = `${t.isCrit ? 'bold' : '600'} ${t.fontSize}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }
}

window.ParticleSystem = ParticleSystem;

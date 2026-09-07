/* ==========================================================================
   NIGHTFALL LAND - Enemy Entities & AI (Shadow Wisps & Void Lurkers)
   ========================================================================== */

class Enemy {
  constructor(x, y, type = 'wisp') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isDead = false;
    this.facing = -1;
    this.animTime = Math.random() * 10;
    this.hurtTimer = 0;

    if (type === 'wisp') {
      this.width = 32;
      this.height = 32;
      this.hp = 60;
      this.maxHp = 60;
      this.speed = 100;
      this.damage = 15;
      this.color = '#a855f7';
      this.secondaryColor = '#00f0ff';
      this.scoreValue = 150;
      this.patrolRange = 160;
      this.startX = x;
      this.startY = y;
    } else {
      // Void Lurker (Ground crawler)
      this.width = 44;
      this.height = 36;
      this.hp = 95;
      this.maxHp = 95;
      this.speed = 120;
      this.damage = 22;
      this.color = '#f43f5e';
      this.secondaryColor = '#9f1239';
      this.scoreValue = 250;
      this.patrolRange = 220;
      this.startX = x;
      this.startY = y;
    }
  }

  update(dt, player, world, particles, audio) {
    if (this.isDead) return;
    this.animTime += dt;
    if (this.hurtTimer > 0) this.hurtTimer -= dt;

    const distToPlayer = Math.hypot((player.x + player.width / 2) - (this.x + this.width / 2), (player.y + player.height / 2) - (this.y + this.height / 2));

    if (this.type === 'wisp') {
      // Floating Sine Wave & Agro AI
      if (distToPlayer < 240) {
        // Agro on player
        const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
        const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
        this.facing = dx > 0 ? 1 : -1;
        this.x += Math.sign(dx) * this.speed * 1.25 * dt;
        this.y += Math.sign(dy) * this.speed * 0.9 * dt;
      } else {
        // Passive Patrol
        this.x += this.facing * this.speed * dt;
        this.y = this.startY + Math.sin(this.animTime * 3) * 18;
        if (Math.abs(this.x - this.startX) > this.patrolRange) {
          this.facing *= -1;
        }
      }
    } else {
      // Ground Lurker Patrol & Agro
      let currentSpeed = this.speed;
      if (distToPlayer < 220 && Math.abs(player.y - this.y) < 60) {
        this.facing = (player.x > this.x) ? 1 : -1;
        currentSpeed *= 1.6; // Lunge speed!
      } else {
        if (Math.abs(this.x - this.startX) > this.patrolRange) {
          this.facing *= -1;
        }
      }

      this.x += this.facing * currentSpeed * dt;
    }

    // Check collision with player to deal damage
    if (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    ) {
      player.takeDamage(this.damage, this.x + this.width / 2, particles, audio);
    }
  }

  takeDamage(amount, knockDir, particles, audio, isCrit = false) {
    if (this.isDead) return;

    this.hp -= amount;
    this.hurtTimer = 0.2;
    this.x += knockDir * 24;

    if (particles) {
      particles.emitImpact(this.x + this.width / 2, this.y + this.height / 2, isCrit ? '#fbbf24' : this.color);
      particles.addText(
        this.x + this.width / 2,
        this.y - 10,
        isCrit ? `CRIT! -${amount}` : `-${amount}`,
        isCrit ? '#fbbf24' : '#ffffff',
        isCrit ? 20 : 16,
        isCrit
      );
    }

    if (this.hp <= 0) {
      this.die(particles, audio);
    }
  }

  die(particles, audio) {
    this.isDead = true;
    if (particles) {
      particles.emitDeath(this.x + this.width / 2, this.y + this.height / 2);
      particles.addText(this.x + this.width / 2, this.y - 25, `+${this.scoreValue} PTS`, '#00f0ff', 16, true);
    }
    if (window.gameEngine) {
      window.gameEngine.addScore(this.scoreValue);
      // Spawn essence drop
      window.gameEngine.spawnEssence(this.x + this.width / 2, this.y + this.height / 2);
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2));
    if (this.facing === -1) ctx.scale(-1, 1);

    if (this.hurtTimer > 0) {
      ctx.filter = 'brightness(2) contrast(1.5)';
    }

    if (this.type === 'wisp') {
      // Floating Void Wisp with pulsing core & aura
      const pulse = Math.sin(this.animTime * 6) * 3;

      // Outer Aura
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Core Orb
      ctx.fillStyle = '#1e1035';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glowing Cyan Eye
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(4, -1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Ground Void Lurker Beast
      const legOffset = Math.sin(this.animTime * 16) * 4;

      // Shell / Carapace
      ctx.fillStyle = '#140c1f';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spikes on back
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-8, -10);
      ctx.lineTo(-4, -18);
      ctx.lineTo(0, -10);
      ctx.lineTo(6, -16);
      ctx.lineTo(10, -10);
      ctx.fill();

      // Crimson Glowing Eyes
      ctx.fillStyle = '#ff1144';
      ctx.shadowColor = '#ff1144';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(10, -2, 3, 0, Math.PI * 2);
      ctx.arc(6, -5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Claws / Legs
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-14, 16 + legOffset);
      ctx.moveTo(10, 8);
      ctx.lineTo(14, 16 - legOffset);
      ctx.stroke();
    }

    // Health Bar overhead if damaged
    if (this.hp < this.maxHp) {
      const barW = 32;
      const barH = 4;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-barW / 2, -26, barW, barH);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-barW / 2, -26, (this.hp / this.maxHp) * barW, barH);
    }

    ctx.restore();
  }
}

window.Enemy = Enemy;

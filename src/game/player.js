/* ==========================================================================
   NIGHT FALL LAND - High-Detail Wanderer Player Entity
   Responsive movement, block & mirror pushing, cipher/optics interaction,
   and fluid top-down cloaked adventurer canvas rendering with lantern sway.
   ========================================================================== */

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 195;
    this.vx = 0;
    this.vy = 0;
    this.facing = 'down'; // 'up', 'down', 'left', 'right'
    this.animTime = 0;

    // Inventory
    this.keys = 0;
    this.shards = 0;

    // Block Push Cooldown
    this.pushCooldown = 0;

    // Nearest interactive object for HUD prompt
    this.nearbyInteractable = null;
  }

  update(dt, input, world, audio) {
    this.animTime += dt;
    if (this.pushCooldown > 0) this.pushCooldown -= dt;

    // 1. Directional Movement Input
    let moveX = 0;
    let moveY = 0;

    if (input.isDown('left')) moveX -= 1;
    if (input.isDown('right')) moveX += 1;
    if (input.isDown('up')) moveY -= 1;
    if (input.isDown('down')) moveY += 1;

    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    if (moveX !== 0 || moveY !== 0) {
      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.facing = moveX > 0 ? 'right' : 'left';
      } else {
        this.facing = moveY > 0 ? 'down' : 'up';
      }
    }

    this.vx = moveX * this.speed;
    this.vy = moveY * this.speed;

    // 2. Horizontal Movement & Wall/Obstacle Collision
    const nextX = this.x + this.vx * dt;
    const testBoxX = { x: nextX, y: this.y, width: this.width, height: this.height };

    let collideX = world.checkWallCollision(testBoxX);
    if (!collideX) {
      for (const door of world.doors) {
        if (!door.isOpen && world.checkOverlap(testBoxX, door)) {
          collideX = true;
          break;
        }
      }
    }

    // Check Pushable Blocks Collision
    for (const block of world.blocks) {
      const bBox = { x: block.x, y: block.y, width: block.width, height: block.height };
      const tBox = { x: block.targetX, y: block.targetY, width: block.width, height: block.height };
      if (world.checkOverlap(testBoxX, bBox) || world.checkOverlap(testBoxX, tBox)) {
        collideX = true;
        if (this.pushCooldown <= 0 && moveX !== 0 && !block.isSliding) {
          const pushed = block.tryPush(Math.sign(moveX), 0, world, audio);
          if (pushed) this.pushCooldown = 0.26;
        }
        break;
      }
    }

    // Check Quartz Mirrors Collision & Push
    if (world.quartzMirrors) {
      for (const mirror of world.quartzMirrors) {
        const mBox = { x: mirror.x, y: mirror.y, width: mirror.width, height: mirror.height };
        const tBox = { x: mirror.targetX, y: mirror.targetY, width: mirror.width, height: mirror.height };
        if (world.checkOverlap(testBoxX, mBox) || world.checkOverlap(testBoxX, tBox)) {
          collideX = true;
          if (this.pushCooldown <= 0 && moveX !== 0 && !mirror.isSliding) {
            const pushed = mirror.tryPush(Math.sign(moveX), 0, world, audio);
            if (pushed) this.pushCooldown = 0.26;
          }
          break;
        }
      }
    }

    // Check Astral Dials Collision (Dials are solid pedestals)
    if (world.astralDials) {
      for (const dial of world.astralDials) {
        if (world.checkOverlap(testBoxX, dial)) {
          collideX = true;
          break;
        }
      }
    }

    if (!collideX) {
      this.x = nextX;
    }

    // 3. Vertical Movement & Wall/Obstacle Collision
    const nextY = this.y + this.vy * dt;
    const testBoxY = { x: this.x, y: nextY, width: this.width, height: this.height };

    let collideY = world.checkWallCollision(testBoxY);
    if (!collideY) {
      for (const door of world.doors) {
        if (!door.isOpen && world.checkOverlap(testBoxY, door)) {
          collideY = true;
          break;
        }
      }
    }

    for (const block of world.blocks) {
      const bBox = { x: block.x, y: block.y, width: block.width, height: block.height };
      const tBox = { x: block.targetX, y: block.targetY, width: block.width, height: block.height };
      if (world.checkOverlap(testBoxY, bBox) || world.checkOverlap(testBoxY, tBox)) {
        collideY = true;
        if (this.pushCooldown <= 0 && moveY !== 0 && !block.isSliding) {
          const pushed = block.tryPush(0, Math.sign(moveY), world, audio);
          if (pushed) this.pushCooldown = 0.26;
        }
        break;
      }
    }

    if (world.quartzMirrors) {
      for (const mirror of world.quartzMirrors) {
        const mBox = { x: mirror.x, y: mirror.y, width: mirror.width, height: mirror.height };
        const tBox = { x: mirror.targetX, y: mirror.targetY, width: mirror.width, height: mirror.height };
        if (world.checkOverlap(testBoxY, mBox) || world.checkOverlap(testBoxY, tBox)) {
          collideY = true;
          if (this.pushCooldown <= 0 && moveY !== 0 && !mirror.isSliding) {
            const pushed = mirror.tryPush(0, Math.sign(moveY), world, audio);
            if (pushed) this.pushCooldown = 0.26;
          }
          break;
        }
      }
    }

    if (world.astralDials) {
      for (const dial of world.astralDials) {
        if (world.checkOverlap(testBoxY, dial)) {
          collideY = true;
          break;
        }
      }
    }

    if (!collideY) {
      this.y = nextY;
    }

    // 4. Check Nearby Interactables
    this.checkInteractables(world);

    // 5. Interact Action ([E] or Space)
    if (input.wasPressed('interact')) {
      this.performInteraction(world, audio);
    }

    // 6. Collect Keys & Moon Shards
    this.checkPickups(world, audio);
  }

  checkInteractables(world) {
    this.nearbyInteractable = null;
    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };

    // 1. Quartz Mirrors (Rotate)
    if (world.quartzMirrors) {
      for (const mirror of world.quartzMirrors) {
        const dist = Math.hypot(center.x - (mirror.x + mirror.width / 2), center.y - (mirror.y + mirror.height / 2));
        if (dist < 54) {
          const desc = mirror.getDescription ? mirror.getDescription() : mirror.orientation;
          this.nearbyInteractable = {
            type: 'mirror',
            target: mirror,
            prompt: `[E] Rotate Quartz Mirror • ${desc}`
          };
          return;
        }
      }
    }

    // 2. Astral Dials (Turn Cipher)
    if (world.astralDials) {
      for (const dial of world.astralDials) {
        const dist = Math.hypot(center.x - (dial.x + dial.width / 2), center.y - (dial.y + dial.height / 2));
        if (dist < 52) {
          this.nearbyInteractable = {
            type: 'dial',
            target: dial,
            prompt: `[E] Turn Astral Dial [${dial.getCurrentSymbol()}]`
          };
          return;
        }
      }
    }

    // 3. Tablets
    for (const tab of world.tablets) {
      const dist = Math.hypot(center.x - (tab.x + tab.width / 2), center.y - (tab.y + tab.height / 2));
      if (dist < 52) {
        this.nearbyInteractable = { type: 'tablet', target: tab, prompt: '[E] Read Tablet' };
        return;
      }
    }

    // 4. Levers
    for (const lev of world.levers) {
      const dist = Math.hypot(center.x - (lev.x + lev.width / 2), center.y - (lev.y + lev.height / 2));
      if (dist < 48) {
        this.nearbyInteractable = { type: 'lever', target: lev, prompt: '[E] Pull Lever' };
        return;
      }
    }

    // 5. Locked Doors
    for (const door of world.doors) {
      if (door.requiresKey && !door.isOpen) {
        const dist = Math.hypot(center.x - (door.x + door.width / 2), center.y - (door.y + door.height / 2));
        if (dist < 56) {
          this.nearbyInteractable = {
            type: 'door',
            target: door,
            prompt: this.keys > 0 ? '[E] Unlock Gate with Moon Key' : '🔒 Locked (Golden Key Required)'
          };
          return;
        }
      }
    }
  }

  performInteraction(world, audio) {
    if (!this.nearbyInteractable) return;

    const { type, target } = this.nearbyInteractable;

    if (type === 'mirror') {
      target.rotate(audio);
      if (this.nearbyInteractable) {
        const desc = target.getDescription ? target.getDescription() : target.orientation;
        this.nearbyInteractable.prompt = `[E] Rotate Quartz Mirror • ${desc}`;
      }
    } else if (type === 'dial') {
      target.rotate(audio);
      if (this.nearbyInteractable) {
        this.nearbyInteractable.prompt = `[E] Turn Astral Dial [${target.getCurrentSymbol()}]`;
      }
    } else if (type === 'tablet') {
      if (audio) audio.playHover();
      if (window.gameEngine) {
        window.gameEngine.showDialogue(target.title, target.message);
      }
      // Log to Clue Journal
      if (window.clueJournal) {
        window.clueJournal.addEntry({
          id: target.title,
          title: target.title,
          text: target.message,
          category: 'Ancient Tablet'
        });
      }
    } else if (type === 'lever') {
      target.toggle(audio);
      if (window.screenManager) {
        window.screenManager.showToast('You hear mechanisms shifting in the dark...', 'info');
      }
    } else if (type === 'door') {
      if (target.requiresKey && this.keys > 0) {
        this.keys--;
        target.isOpen = true;
        if (audio) audio.playVictory();
        if (window.screenManager) {
          window.screenManager.showToast('Ancient Celestial Gate Unlocked!', 'success');
        }
      } else {
        if (audio) audio.playHover();
        if (window.screenManager) {
          window.screenManager.showToast('The gate is sealed by an ancient keyhole.', 'error');
        }
      }
    }
  }

  checkPickups(world, audio) {
    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };

    // Moon Keys
    for (const key of world.keys) {
      if (!key.collected) {
        const dist = Math.hypot(center.x - (key.x + key.width / 2), center.y - (key.y + key.height / 2));
        if (dist < 28) {
          key.collected = true;
          this.keys++;
          if (audio) audio.playKeyPickup();
          if (window.screenManager) {
            window.screenManager.showToast('Acquired a Golden Moon Key! 🗝️', 'success');
          }
        }
      }
    }

    // Moon Shards
    for (const shard of world.shards) {
      if (!shard.collected) {
        const dist = Math.hypot(center.x - (shard.x + shard.width / 2), center.y - (shard.y + shard.height / 2));
        if (dist < 28) {
          shard.collected = true;
          this.shards++;
          if (audio) audio.playCollectEssence();
          if (window.screenManager) {
            window.screenManager.showToast('Discovered a Moon Shard! 🌙 (Secret)', 'info');
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    const isMoving = Math.abs(this.vx) > 5 || Math.abs(this.vy) > 5;
    const walkBounce = isMoving ? Math.sin(this.animTime * 14) * 2.5 : 0;
    const sway = isMoving ? Math.sin(this.animTime * 14) * 1.5 : 0;

    // 1. Soft Dynamic Contact Foot Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Flowing Traveler's Cloak / Cape
    const cloakGrad = ctx.createLinearGradient(0, -12, 0, 12);
    cloakGrad.addColorStop(0, '#1e293b');
    cloakGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = cloakGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    // Tapered Adventurer Cloak
    ctx.moveTo(-10, -10 + walkBounce);
    ctx.lineTo(10, -10 + walkBounce);
    ctx.lineTo(13 + sway, 13 + walkBounce);
    ctx.quadraticCurveTo(0, 15 + walkBounce, -13 + sway, 13 + walkBounce);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Traveler's Hood
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -7 + walkBounce, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Glowing Cyan Eyes / Visor depending on facing direction
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;

    if (this.facing === 'down') {
      ctx.fillRect(-4, -7 + walkBounce, 2.5, 2.5);
      ctx.fillRect(2, -7 + walkBounce, 2.5, 2.5);
    } else if (this.facing === 'up') {
      // Back of hood seam
      ctx.fillStyle = '#334155';
      ctx.fillRect(-1.5, -9 + walkBounce, 3, 4);
    } else if (this.facing === 'left') {
      ctx.fillRect(-6.5, -7 + walkBounce, 3, 2.5);
    } else if (this.facing === 'right') {
      ctx.fillRect(3.5, -7 + walkBounce, 3, 2.5);
    }

    // 5. Brass Hip-Mounted Lantern
    const lanternX = this.facing === 'left' ? 9 : -9;
    const lanternY = 2 + walkBounce;
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.rect(lanternX - 3, lanternY - 3, 6, 8);
    ctx.fill();
    ctx.stroke();

    // Glowing Lantern Glass Core
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(lanternX, lanternY + 1, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.Player = Player;

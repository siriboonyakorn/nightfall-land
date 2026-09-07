/* ==========================================================================
   NIGHT FALL LAND - Top-Down Puzzle Adventure Player Entity
   Responsive 4-directional movement, object interaction, and block pushing
   ========================================================================== */

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 190;
    this.vx = 0;
    this.vy = 0;
    this.facing = 'down'; // 'up', 'down', 'left', 'right'
    this.animTime = 0;

    // Inventory
    this.keys = 0;
    this.shards = 0;

    // Block Push Cooldown (prevents rapid double-push)
    this.pushCooldown = 0;

    // Nearest interactive object for HUD prompt
    this.nearbyInteractable = null;
  }

  update(dt, input, world, audio) {
    this.animTime += dt;
    if (this.pushCooldown > 0) this.pushCooldown -= dt;

    // 1. Directional Movement Input (W, A, S, D / Arrows)
    let moveX = 0;
    let moveY = 0;

    if (input.isDown('left')) moveX -= 1;
    if (input.isDown('right')) moveX += 1;
    if (input.isDown('up')) moveY -= 1;
    if (input.isDown('down')) moveY += 1;

    // Normalize diagonal velocity
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

    // 2. Horizontal Movement & Wall/Block Collision
    const nextX = this.x + this.vx * dt;
    const testBoxX = { x: nextX, y: this.y, width: this.width, height: this.height };

    let collideX = world.checkWallCollision(testBoxX);
    if (!collideX) {
      // Check closed doors
      for (const door of world.doors) {
        if (!door.isOpen && world.checkOverlap(testBoxX, door)) {
          collideX = true;
          break;
        }
      }
    }

    // Check Pushable Blocks Collision
    for (const block of world.blocks) {
      if (world.checkOverlap(testBoxX, block)) {
        collideX = true;
        if (this.pushCooldown <= 0 && moveX !== 0) {
          const pushed = block.tryPush(Math.sign(moveX), 0, world, audio);
          if (pushed) this.pushCooldown = 0.22;
        }
        break;
      }
    }

    if (!collideX) {
      this.x = nextX;
    }

    // 3. Vertical Movement & Wall/Block Collision
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
      if (world.checkOverlap(testBoxY, block)) {
        collideY = true;
        if (this.pushCooldown <= 0 && moveY !== 0) {
          const pushed = block.tryPush(0, Math.sign(moveY), world, audio);
          if (pushed) this.pushCooldown = 0.22;
        }
        break;
      }
    }

    if (!collideY) {
      this.y = nextY;
    }

    // 4. Check Nearby Interactables (Tablets, Levers, Doors)
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

    // Tablets
    for (const tab of world.tablets) {
      const dist = Math.hypot(center.x - (tab.x + tab.width / 2), center.y - (tab.y + tab.height / 2));
      if (dist < 52) {
        this.nearbyInteractable = { type: 'tablet', target: tab, prompt: '[E] Read Tablet' };
        return;
      }
    }

    // Levers
    for (const lev of world.levers) {
      const dist = Math.hypot(center.x - (lev.x + lev.width / 2), center.y - (lev.y + lev.height / 2));
      if (dist < 48) {
        this.nearbyInteractable = { type: 'lever', target: lev, prompt: '[E] Pull Lever' };
        return;
      }
    }

    // Locked Doors
    for (const door of world.doors) {
      if (door.requiresKey && !door.isOpen) {
        const dist = Math.hypot(center.x - (door.x + door.width / 2), center.y - (door.y + door.height / 2));
        if (dist < 56) {
          this.nearbyInteractable = {
            type: 'door',
            target: door,
            prompt: this.keys > 0 ? '[E] Unlock Gate with Moon Key' : '🔒 Gate is locked (Requires Key)'
          };
          return;
        }
      }
    }
  }

  performInteraction(world, audio) {
    if (!this.nearbyInteractable) return;

    if (this.nearbyInteractable.type === 'tablet') {
      const tab = this.nearbyInteractable.target;
      if (audio) audio.playHover();
      if (window.gameEngine) {
        window.gameEngine.showDialogue(tab.title, tab.message);
      }
    } else if (this.nearbyInteractable.type === 'lever') {
      const lev = this.nearbyInteractable.target;
      lev.toggle(audio);
      if (window.screenManager) {
        window.screenManager.showToast('You hear mechanisms shifting in the dark...', 'info');
      }
    } else if (this.nearbyInteractable.type === 'door') {
      const door = this.nearbyInteractable.target;
      if (door.requiresKey && this.keys > 0) {
        this.keys--;
        door.isOpen = true;
        if (audio) audio.playVictory();
        if (window.screenManager) {
          window.screenManager.showToast('Ancient Darkwood Gate Unlocked!', 'success');
        }
      } else {
        if (audio) audio.playHover();
        if (window.screenManager) {
          window.screenManager.showToast('The gate is locked by an ancient keyhole.', 'error');
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
            window.screenManager.showToast('Found a Golden Moon Key! 🗝️', 'success');
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
            window.screenManager.showToast('Discovered a Moon Shard! 🌙 (Secret 1/1)', 'info');
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const isMoving = Math.abs(this.vx) > 5 || Math.abs(this.vy) > 5;
    const walkBounce = isMoving ? Math.sin(this.animTime * 14) * 2 : 0;

    // Ambient Starlight Lantern Aura
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wanderer Cloak / Body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.roundRect(-12, -14 + walkBounce, 24, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Hood / Head
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -6 + walkBounce, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes based on direction
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    if (this.facing === 'down') {
      ctx.fillRect(-4, -6 + walkBounce, 2.5, 2.5);
      ctx.fillRect(2, -6 + walkBounce, 2.5, 2.5);
    } else if (this.facing === 'up') {
      // Back of hood
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2, -8 + walkBounce, 4, 3);
    } else if (this.facing === 'left') {
      ctx.fillRect(-6, -6 + walkBounce, 2.5, 2.5);
    } else if (this.facing === 'right') {
      ctx.fillRect(4, -6 + walkBounce, 2.5, 2.5);
    }

    ctx.restore();
  }
}

window.Player = Player;

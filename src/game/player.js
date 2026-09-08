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

    // Cosmetics & Trails
    const user = window.storageManager ? window.storageManager.getCurrentUser() : null;
    this.skin = (user && user.equippedSkin) || 'default';
    this.trail = (user && user.equippedTrail) || 'none';
    this.trailParticles = [];
  }

  update(dt, input, world, audio) {
    this.animTime += dt;
    if (this.pushCooldown > 0) this.pushCooldown -= dt;

    // Update cosmetic trail particles
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const p = this.trailParticles[i];
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) this.trailParticles.splice(i, 1);
    }

    // Check if standing on slippery ice tile
    let onIce = false;
    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    for (const ice of (world.iceTiles || [])) {
      if (
        center.x >= ice.x &&
        center.x <= ice.x + ice.width &&
        center.y >= ice.y &&
        center.y <= ice.y + ice.height
      ) {
        onIce = true;
        break;
      }
    }

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

    if (onIce && (moveX === 0 && moveY === 0)) {
      // Ice sliding friction decay
      this.vx *= 0.95;
      this.vy *= 0.95;
    } else {
      this.vx = moveX * this.speed;
      this.vy = moveY * this.speed;
    }

    // Spawn cosmetic trail particles when moving
    if (this.trail !== 'none' && (Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10)) {
      if (Math.random() < 0.35) {
        const color = this.trail === 'stardust' ? '#fde047' : (this.trail === 'cyan' ? '#00f0ff' : '#c084fc');
        this.trailParticles.push({
          x: this.x + this.width / 2 + (Math.random() - 0.5) * 12,
          y: this.y + this.height / 2 + (Math.random() - 0.5) * 12,
          color: color,
          life: 0.45,
          maxLife: 0.45,
          alpha: 0.8
        });
      }
    }

    // 2. Horizontal Movement & Wall/Block/Ice Barrier Collision
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

    if (!collideX) {
      // Check solid ice barriers
      for (const barrier of (world.barriers || [])) {
        if (!barrier.isMelted && world.checkOverlap(testBoxX, barrier)) {
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

    // 3. Vertical Movement & Wall/Block/Ice Barrier Collision
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

    if (!collideY) {
      for (const barrier of (world.barriers || [])) {
        if (!barrier.isMelted && world.checkOverlap(testBoxY, barrier)) {
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

    // 4. Check Nearby Interactables (Tablets, Levers, Doors, Braziers, Mirrors, NPCs)
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

    // NPCs (Wanderer, Owl)
    for (const npc of (world.npcs || [])) {
      const dist = Math.hypot(center.x - (npc.x + npc.width / 2), center.y - (npc.y + npc.height / 2));
      if (dist < 52) {
        this.nearbyInteractable = { type: 'npc', target: npc, prompt: `[E] Speak with ${npc.name}` };
        return;
      }
    }

    // Braziers
    for (const brz of (world.braziers || [])) {
      const dist = Math.hypot(center.x - (brz.x + brz.width / 2), center.y - (brz.y + brz.height / 2));
      if (dist < 50) {
        this.nearbyInteractable = {
          type: 'brazier',
          target: brz,
          prompt: brz.isLit ? '[E] Extinguish Brazier' : '[E] Ignite Brazier 🔥'
        };
        return;
      }
    }

    // Mirrors
    for (const mir of (world.mirrors || [])) {
      const dist = Math.hypot(center.x - (mir.x + mir.width / 2), center.y - (mir.y + mir.height / 2));
      if (dist < 50) {
        this.nearbyInteractable = { type: 'mirror', target: mir, prompt: `[E] Rotate Mirror (${mir.angle}°)` };
        return;
      }
    }

    // Buttons
    for (const btn of (world.buttons || [])) {
      const dist = Math.hypot(center.x - (btn.x + btn.width / 2), center.y - (btn.y + btn.height / 2));
      if (dist < 46) {
        this.nearbyInteractable = { type: 'button', target: btn, prompt: '[E] Press Switch 🔘' };
        return;
      }
    }

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

    // Secret Walls
    for (const sw of (world.secretWalls || [])) {
      if (!sw.isRevealed) {
        const dist = Math.hypot(center.x - (sw.x + sw.width / 2), center.y - (sw.y + sw.height / 2));
        if (dist < 50) {
          this.nearbyInteractable = { type: 'secret', target: sw, prompt: '[E] Examine Hidden Runes 🔍' };
          return;
        }
      }
    }
  }

  performInteraction(world, audio) {
    if (!this.nearbyInteractable) return;

    const { type, target } = this.nearbyInteractable;

    if (type === 'npc') {
      target.interact(window.gameEngine, audio);
    } else if (type === 'brazier') {
      target.toggle(audio);
    } else if (type === 'mirror') {
      target.rotate(audio);
    } else if (type === 'button') {
      target.press(audio);
    } else if (type === 'secret') {
      target.reveal(world, audio);
    } else if (type === 'tablet') {
      if (audio) audio.playHover();
      if (window.gameEngine) {
        window.gameEngine.showDialogue(target.title, target.message);
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
          window.screenManager.showToast('Ancient Gate Unlocked!', 'success');
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
          if (audio) audio.playSecretDiscover();
          if (window.screenManager) {
            window.screenManager.showToast('Discovered a Moon Shard! 🌙', 'info');
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw trail particles
    for (const p of this.trailParticles) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const isMoving = Math.abs(this.vx) > 5 || Math.abs(this.vy) > 5;
    const walkBounce = isMoving ? Math.sin(this.animTime * 14) * 2 : 0;

    // Skin Color Palette
    let bodyColor = '#0f172a';
    let strokeColor = '#00f0ff';
    let auraColor = 'rgba(0, 240, 255, 0.08)';
    let eyeColor = '#ffffff';

    if (this.skin === 'starlight') {
      bodyColor = '#fef08a';
      strokeColor = '#eab308';
      auraColor = 'rgba(234, 179, 8, 0.15)';
      eyeColor = '#ca8a04';
    } else if (this.skin === 'shadow') {
      bodyColor = '#2e1065';
      strokeColor = '#a855f7';
      auraColor = 'rgba(168, 85, 247, 0.18)';
      eyeColor = '#c084fc';
    } else if (this.skin === 'void') {
      bodyColor = '#030712';
      strokeColor = '#38bdf8';
      auraColor = 'rgba(56, 189, 248, 0.2)';
      eyeColor = '#38bdf8';
    }

    // Ambient Starlight Lantern Aura
    ctx.fillStyle = auraColor;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wanderer Cloak / Body
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.roundRect(-12, -14 + walkBounce, 24, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Hood / Head
    ctx.fillStyle = this.skin === 'starlight' ? '#fde047' : '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -6 + walkBounce, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes based on direction
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 10;

    if (this.facing === 'down') {
      ctx.fillRect(-4, -6 + walkBounce, 2.5, 2.5);
      ctx.fillRect(2, -6 + walkBounce, 2.5, 2.5);
    } else if (this.facing === 'up') {
      // Back of hood
      ctx.fillStyle = bodyColor;
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

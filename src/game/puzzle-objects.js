/* ==========================================================================
   NIGHT FALL LAND - Modular Puzzle Components
   Adheres to the core design: Teach -> Test -> Combine -> Surprise
   ========================================================================== */

// 1. Pushable Stone Block
class PushBlock {
  constructor(x, y, size = 44) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.vx = 0;
    this.vy = 0;
    this.isPushing = false;
  }

  update(dt, world) {
    // Check if on pressure plate or moving
    if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vx *= 0.8;
      this.vy *= 0.8;
    } else {
      this.vx = 0;
      this.vy = 0;
    }
  }

  tryPush(dx, dy, world, audio) {
    const targetX = this.x + dx * 46;
    const targetY = this.y + dy * 46;

    // Check collision with walls or barriers
    const testBox = { x: targetX, y: targetY, width: this.width, height: this.height };
    if (world.checkWallCollision(testBox)) return false;

    // Check collision with closed doors
    for (const door of world.doors) {
      if (!door.isOpen && world.checkOverlap(testBox, door)) {
        return false;
      }
    }

    // Check collision with other blocks
    for (const other of world.blocks) {
      if (other !== this && world.checkOverlap(testBox, other)) {
        return false;
      }
    }

    this.x = targetX;
    this.y = targetY;
    if (audio) audio.playBlockSlide();
    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 8;

    // Stone block body
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 6);
    ctx.fill();
    ctx.stroke();

    // Runic carvings in center
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
    
    // Glowing central core
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 2. Pressure Plate
class PressurePlate {
  constructor(x, y, id, size = 44) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.width = size;
    this.height = size;
    this.isPressed = false;
    this.wasPressed = false;
  }

  update(player, blocks, audio) {
    this.wasPressed = this.isPressed;
    let pressed = false;

    // Check Player
    const playerBounds = { x: player.x + 8, y: player.y + 12, width: player.width - 16, height: player.height - 16 };
    if (this.checkOverlap(playerBounds, this)) {
      pressed = true;
    }

    // Check Blocks
    for (const b of blocks) {
      if (this.checkOverlap({ x: b.x + 4, y: b.y + 4, width: b.width - 8, height: b.height - 8 }, this)) {
        pressed = true;
        break;
      }
    }

    this.isPressed = pressed;

    if (!this.wasPressed && this.isPressed) {
      if (audio) audio.playPlateClick(true);
    } else if (this.wasPressed && !this.isPressed) {
      if (audio) audio.playPlateClick(false);
    }
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
    ctx.save();
    const color = this.isPressed ? '#10b981' : '#a855f7';

    // Outer Plate Rim
    ctx.fillStyle = this.isPressed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(20, 16, 40, 0.8)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = this.isPressed ? 14 : 6;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

    // Depressed Center Pad
    ctx.fillStyle = this.isPressed ? '#10b981' : 'rgba(168, 85, 247, 0.4)';
    const padInset = this.isPressed ? 8 : 6;
    ctx.beginPath();
    ctx.roundRect(this.x + padInset, this.y + padInset, this.width - padInset * 2, this.height - padInset * 2, 4);
    ctx.fill();

    ctx.restore();
  }
}

// 3. Ancient Barrier / Door
class Door {
  constructor(x, y, width, height, linkedId, requiresKey = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.linkedId = linkedId;
    this.requiresKey = requiresKey;
    this.isOpen = false;
    this.openProgress = 0; // 0 to 1
  }

  update(plates, levers, player, buttons = [], receptors = []) {
    if (this.requiresKey) {
      // Unlocked when player interacts with key
      this.openProgress += ((this.isOpen ? 1 : 0) - this.openProgress) * 0.15;
      return;
    }

    if (this.isCompound || this.isSequence) {
      // State managed externally by world compound rules or sequence manager
      this.openProgress += ((this.isOpen ? 1 : 0) - this.openProgress) * 0.15;
      return;
    }

    // Check linked pressure plate or lever or button or light receptor
    let shouldOpen = false;
    for (const p of plates) {
      if (p.id === this.linkedId && p.isPressed) {
        shouldOpen = true;
        break;
      }
    }
    if (!shouldOpen) {
      for (const l of levers) {
        if (l.id === this.linkedId && l.isOn) {
          shouldOpen = true;
          break;
        }
      }
    }
    if (!shouldOpen && buttons) {
      for (const b of buttons) {
        if (b.linkedId === this.linkedId && b.isPressed) {
          shouldOpen = true;
          break;
        }
      }
    }
    if (!shouldOpen && receptors) {
      for (const r of receptors) {
        if (r.linkedId === this.linkedId && r.isEnergized) {
          shouldOpen = true;
          break;
        }
      }
    }

    this.isOpen = shouldOpen;
    this.openProgress += ((this.isOpen ? 1 : 0) - this.openProgress) * 0.15;
  }

  draw(ctx) {
    ctx.save();
    if (this.isOpen) {
      // Retracted gate posts
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(this.x, this.y, this.width, 6);
      ctx.strokeRect(this.x, this.y + this.height - 6, this.width, 6);
    } else {
      // Solid energy barrier with glowing bars
      ctx.fillStyle = '#0b0f24';
      ctx.strokeStyle = this.requiresKey ? '#fbbf24' : '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = this.requiresKey ? '#fbbf24' : '#00f0ff';
      ctx.shadowBlur = 10;

      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // Energy Bar Grid
      ctx.beginPath();
      const step = Math.min(this.width, this.height) > 30 ? 12 : 8;
      if (this.width > this.height) {
        for (let ix = this.x + 8; ix < this.x + this.width; ix += step) {
          ctx.moveTo(ix, this.y);
          ctx.lineTo(ix, this.y + this.height);
        }
      } else {
        for (let iy = this.y + 8; iy < this.y + this.height; iy += step) {
          ctx.moveTo(this.x, iy);
          ctx.lineTo(this.x + this.width, iy);
        }
      }
      ctx.stroke();

      if (this.requiresKey) {
        // Keyhole Icon
        ctx.fillStyle = '#fbbf24';
        ctx.font = '14px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', this.x + this.width / 2, this.y + this.height / 2 + 5);
      }
    }
    ctx.restore();
  }
}

// 4. Interactive Lever
class Lever {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 36;
    this.id = id;
    this.isOn = false;
  }

  toggle(audio) {
    this.isOn = !this.isOn;
    if (audio) audio.playPlateClick(this.isOn);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Pedestal
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 8, 12, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Handle
    ctx.strokeStyle = this.isOn ? '#10b981' : '#f43f5e';
    ctx.shadowColor = this.isOn ? '#10b981' : '#f43f5e';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 3.5;

    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(this.isOn ? 12 : -12, -10);
    ctx.stroke();

    // Knob
    ctx.fillStyle = this.isOn ? '#10b981' : '#f43f5e';
    ctx.beginPath();
    ctx.arc(this.isOn ? 12 : -12, -10, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 5. Ancient Tablet / Lore Signpost
class AncientTablet {
  constructor(x, y, message, title = 'Ancient Stone Tablet') {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 40;
    this.title = title;
    this.message = message;
  }

  draw(ctx) {
    ctx.save();
    // Tablet body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 4);
    ctx.fill();
    ctx.stroke();

    // Rune lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x + 6, this.y + 12);
    ctx.lineTo(this.x + this.width - 6, this.y + 12);
    ctx.moveTo(this.x + 6, this.y + 20);
    ctx.lineTo(this.x + this.width - 10, this.y + 20);
    ctx.moveTo(this.x + 6, this.y + 28);
    ctx.lineTo(this.x + this.width - 6, this.y + 28);
    ctx.stroke();

    ctx.restore();
  }
}

// 6. Moon Key Item
class MoonKey {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.collected = false;
    this.animTime = Math.random() * 5;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    const bob = Math.sin(this.animTime * 4) * 4;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + bob);

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.fillText('🗝️', 0, 0);

    ctx.restore();
  }
}

// 7. Moon Shard (Collectible Secret)
class MoonShard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.collected = false;
    this.animTime = Math.random() * 5;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    const bob = Math.sin(this.animTime * 3) * 5;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + bob);

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.fillText('🌙', 0, 0);

    ctx.restore();
  }
}

// 8. Ancient Darkwood Exit Portal
class LevelExit {
  constructor(x, y, width = 60, height = 60) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Rotating celestial vortex
    for (let r = 26; r > 8; r -= 6) {
      ctx.fillStyle = r % 12 === 0 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(168, 85, 247, 0.4)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, r + Math.sin(this.animTime * 4 + r) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = '16px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.fillText('EXIT', 0, 5);

    ctx.restore();
  }
}

// 9. Teleporter Portal
class Teleporter {
  constructor(x, y, id, targetId, color = '#00f0ff') {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.id = id;
    this.targetId = targetId;
    this.color = color;
    this.cooldown = 0;
    this.animTime = Math.random() * 5;
  }

  update(dt, player, blocks, teleporters, audio) {
    this.animTime += dt;
    if (this.cooldown > 0) this.cooldown -= dt;

    if (this.cooldown <= 0) {
      const padCenter = { x: this.x + this.width / 2, y: this.y + this.height / 2 };

      // Check player
      const pCenter = { x: player.x + player.width / 2, y: player.y + player.height / 2 };
      if (Math.hypot(padCenter.x - pCenter.x, padCenter.y - pCenter.y) < 28) {
        const dest = teleporters.find(t => t.id === this.targetId);
        if (dest) {
          player.x = dest.x + (dest.width - player.width) / 2;
          player.y = dest.y + (dest.height - player.height) / 2;
          this.cooldown = 1.0;
          dest.cooldown = 1.0;
          if (audio) audio.playTeleport();
        }
      }

      // Check push blocks
      for (const b of blocks) {
        const bCenter = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        if (Math.hypot(padCenter.x - bCenter.x, padCenter.y - bCenter.y) < 28) {
          const dest = teleporters.find(t => t.id === this.targetId);
          if (dest) {
            b.x = dest.x + (dest.width - b.width) / 2;
            b.y = dest.y + (dest.height - b.height) / 2;
            this.cooldown = 1.0;
            dest.cooldown = 1.0;
            if (audio) audio.playTeleport();
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Outer vortex ring
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating inner celestial runes
    const rSpin = this.animTime * 2.5;
    for (let i = 0; i < 4; i++) {
      const angle = rSpin + (i * Math.PI) / 2;
      const rx = Math.cos(angle) * 12;
      const ry = Math.sin(angle) * 12;
      ctx.fillStyle = i % 2 === 0 ? '#fff' : this.color;
      ctx.beginPath();
      ctx.arc(rx, ry, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Portal label
    ctx.font = '9px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 6;
    ctx.fillText('WARP', 0, 0);

    ctx.restore();
  }
}

// 10. Timed / Pulse Puzzle Button
class PuzzleButton {
  constructor(x, y, linkedId, duration = 6, label = 'BUTTON') {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.linkedId = linkedId;
    this.duration = duration;
    this.label = label;
    this.timer = 0;
    this.isPressed = false;
    this.lastTickSec = 0;
  }

  press(audio) {
    this.timer = this.duration;
    this.isPressed = true;
    if (audio) audio.playPlateClick(true);
  }

  update(dt, player, blocks, audio) {
    // Step-on activation
    const bounds = { x: this.x + 4, y: this.y + 4, width: this.width - 8, height: this.height - 8 };
    const pBounds = { x: player.x + 6, y: player.y + 6, width: player.width - 12, height: player.height - 12 };
    const onButton = (
      pBounds.x < bounds.x + bounds.width &&
      pBounds.x + pBounds.width > bounds.x &&
      pBounds.y < bounds.y + bounds.height &&
      pBounds.y + pBounds.height > bounds.y
    );

    if (onButton && this.timer <= 0) {
      this.press(audio);
    }

    if (this.timer > 0) {
      this.timer -= dt;
      const currentSec = Math.ceil(this.timer);
      if (currentSec !== this.lastTickSec && currentSec <= 4 && currentSec > 0) {
        this.lastTickSec = currentSec;
        if (audio) audio.playButtonTick();
      }
      if (this.timer <= 0) {
        this.timer = 0;
        this.isPressed = false;
        if (audio) audio.playPlateClick(false);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    const color = this.isPressed ? '#f59e0b' : '#3b82f6';
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Bezel
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = this.isPressed ? 14 : 6;

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Dome
    ctx.fillStyle = this.isPressed ? '#fbbf24' : '#1d4ed8';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();

    // Timer ring if active
    if (this.timer > 0) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const pct = this.timer / this.duration;
      ctx.arc(0, 0, 15, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
      ctx.stroke();

      ctx.font = '10px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(`${Math.ceil(this.timer)}s`, 0, 0);
    }

    ctx.restore();
  }
}

// 11. Fire Brazier
class FireBrazier {
  constructor(x, y, isLit = false) {
    this.x = x;
    this.y = y;
    this.width = 42;
    this.height = 42;
    this.isLit = isLit;
    this.animTime = Math.random() * 5;
  }

  toggle(audio) {
    this.isLit = !this.isLit;
    if (audio) {
      if (this.isLit) audio.playFireIgnite();
      else audio.playPlateClick(false);
    }
  }

  update(dt, barriers, audio) {
    this.animTime += dt;
    if (this.isLit) {
      const bCenter = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
      for (const bar of barriers) {
        if (!bar.isMelted) {
          const barCenter = { x: bar.x + bar.width / 2, y: bar.y + bar.height / 2 };
          if (Math.hypot(bCenter.x - barCenter.x, bCenter.y - barCenter.y) < 78) {
            bar.melt(audio);
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Stone Urn
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = this.isLit ? '#f97316' : '#64748b';
    ctx.lineWidth = 2;
    ctx.shadowColor = this.isLit ? '#ea580c' : 'transparent';
    ctx.shadowBlur = this.isLit ? 16 : 0;

    ctx.beginPath();
    ctx.roundRect(-16, -10, 32, 24, 4);
    ctx.fill();
    ctx.stroke();

    if (this.isLit) {
      // Dynamic Dancing Flame
      const flicker = Math.sin(this.animTime * 8) * 3;
      const flicker2 = Math.cos(this.animTime * 12) * 2;

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.quadraticCurveTo(0, -28 + flicker, 10, -10);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.quadraticCurveTo(flicker2, -22 + flicker, 6, -10);
      ctx.fill();
    } else {
      // Cold coals
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, -8, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// 12. Ice Barrier (Meltable obstacle)
class IceBarrier {
  constructor(x, y, width = 48, height = 48) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isMelted = false;
    this.meltProgress = 0;
  }

  melt(audio) {
    if (this.isMelted) return;
    this.isMelted = true;
    if (audio) audio.playIceMelt();
  }

  update(dt) {
    if (this.isMelted && this.meltProgress < 1) {
      this.meltProgress = Math.min(1, this.meltProgress + dt * 3);
    }
  }

  draw(ctx) {
    ctx.save();
    if (this.isMelted) {
      // Water puddle
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width * 0.45,
        this.height * 0.35,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    } else {
      // Solid Ice Block
      ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 10;

      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // Crystalline facets
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x + 8, this.y + 8);
      ctx.lineTo(this.x + this.width - 12, this.y + this.height - 8);
      ctx.moveTo(this.x + this.width - 8, this.y + 12);
      ctx.lineTo(this.x + 12, this.y + this.height - 12);
      ctx.stroke();

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧊', this.x + this.width / 2, this.y + this.height / 2 + 5);
    }
    ctx.restore();
  }
}

// 13. Ice Tile (Slippery surface)
class IceTile {
  constructor(x, y, width = 48, height = 48) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.1)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Frost sparkle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(this.x + 12, this.y + 12, 2, 2);
    ctx.fillRect(this.x + this.width - 14, this.y + this.height - 14, 2, 2);
    ctx.restore();
  }
}

// 14. Light Emitter
class LightEmitter {
  constructor(x, y, direction = 'right', color = '#00f0ff') {
    this.x = x;
    this.y = y;
    this.width = 38;
    this.height = 38;
    this.direction = direction; // 'up', 'down', 'left', 'right'
    this.color = color;
    this.beamSegments = [];
  }

  castBeam(world) {
    this.beamSegments = [];
    let curX = this.x + this.width / 2;
    let curY = this.y + this.height / 2;
    let dir = this.direction;

    const dirVectors = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    };

    let maxBounces = 6;
    while (maxBounces-- > 0) {
      const v = dirVectors[dir];
      if (!v) break;

      let hit = false;
      let stepDist = 0;
      let segStartX = curX;
      let segStartY = curY;

      while (stepDist < 1200) {
        stepDist += 8;
        const testX = segStartX + v.dx * stepDist;
        const testY = segStartY + v.dy * stepDist;

        // Wall collision
        if (world.checkWallCollision({ x: testX - 4, y: testY - 4, width: 8, height: 8 })) {
          this.beamSegments.push({ x1: segStartX, y1: segStartY, x2: testX, y2: testY });
          hit = true;
          break;
        }

        // Closed door collision
        let doorHit = false;
        for (const d of world.doors) {
          if (!d.isOpen && world.checkOverlap({ x: testX - 4, y: testY - 4, width: 8, height: 8 }, d)) {
            this.beamSegments.push({ x1: segStartX, y1: segStartY, x2: testX, y2: testY });
            doorHit = true;
            break;
          }
        }
        if (doorHit) { hit = true; break; }

        // Mirror collision
        let mirrorHit = null;
        for (const m of (world.mirrors || [])) {
          if (world.checkOverlap({ x: testX - 4, y: testY - 4, width: 8, height: 8 }, m)) {
            mirrorHit = m;
            break;
          }
        }
        if (mirrorHit) {
          this.beamSegments.push({ x1: segStartX, y1: segStartY, x2: testX, y2: testY });
          curX = testX;
          curY = testY;
          // Reflect according to mirror angle
          dir = mirrorHit.reflect(dir);
          hit = true;
          break;
        }

        // Light Receptor collision
        let receptorHit = null;
        for (const r of (world.receptors || [])) {
          if (world.checkOverlap({ x: testX - 4, y: testY - 4, width: 8, height: 8 }, r)) {
            receptorHit = r;
            break;
          }
        }
        if (receptorHit) {
          receptorHit.isEnergized = true;
          this.beamSegments.push({ x1: segStartX, y1: segStartY, x2: testX, y2: testY });
          hit = true;
          break;
        }
      }

      if (!hit || !dir) break;
    }
  }

  draw(ctx) {
    ctx.save();
    // Base emitter block
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 6);
    ctx.fill();
    ctx.stroke();

    // Crystal lens
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 7, 0, Math.PI * 2);
    ctx.fill();

    // Beams
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.shadowBlur = 12;
    for (const seg of this.beamSegments) {
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// 15. Mirror
class Mirror {
  constructor(x, y, angle = 45) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.angle = angle; // 45, 135, 225, 315
  }

  rotate(audio) {
    this.angle = (this.angle + 90) % 360;
    if (audio) audio.playBlockSlide();
  }

  reflect(inDir) {
    // 45 degrees: /
    if (this.angle === 45 || this.angle === 225) {
      if (inDir === 'right') return 'up';
      if (inDir === 'down') return 'left';
      if (inDir === 'left') return 'down';
      if (inDir === 'up') return 'right';
    }
    // 135 degrees: \
    if (this.angle === 135 || this.angle === 315) {
      if (inDir === 'right') return 'down';
      if (inDir === 'up') return 'left';
      if (inDir === 'left') return 'up';
      if (inDir === 'down') return 'right';
    }
    return null;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Pedestal
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mirror diagonal glass line
    const rad = (this.angle * Math.PI) / 180;
    ctx.rotate(rad);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 14);
    ctx.stroke();

    ctx.restore();
  }
}

// 16. Light Receptor
class LightReceptor {
  constructor(x, y, linkedId) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.linkedId = linkedId;
    this.isEnergized = false;
    this.wasEnergized = false;
  }

  update(audio) {
    if (!this.wasEnergized && this.isEnergized) {
      if (audio) audio.playBeamHum();
    }
    this.wasEnergized = this.isEnergized;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const color = this.isEnergized ? '#00f0ff' : '#64748b';
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = this.isEnergized ? 16 : 4;

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Core crystal
    ctx.fillStyle = this.isEnergized ? '#38bdf8' : '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 17. Secret Wall (Illusory / Breakable Wall)
class SecretWall {
  constructor(x, y, width = 48, height = 48, secretId = 'secret_1', title = 'Hidden Sanctuary') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.secretId = secretId;
    this.title = title;
    this.isRevealed = false;
    this.alpha = 1;
  }

  reveal(world, audio) {
    if (this.isRevealed) return;
    this.isRevealed = true;
    if (world && world.onSecretFound) {
      world.onSecretFound(this.secretId, this.title);
    }
    if (audio) audio.playSecretDiscover();
  }

  update(dt, player, audio, world) {
    if (!this.isRevealed) {
      const pCenter = { x: player.x + player.width / 2, y: player.y + player.height / 2 };
      const sCenter = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
      if (Math.hypot(pCenter.x - sCenter.x, pCenter.y - sCenter.y) < 48) {
        this.reveal(world, audio);
      }
    } else if (this.alpha > 0) {
      this.alpha = Math.max(0, this.alpha - dt * 2.5);
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // Faint illusory cracked wall texture
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Subtle secret glyph as per README example: ████████░█████
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + 6, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width - 6, this.y + this.height / 2);
    ctx.stroke();

    ctx.restore();
  }
}

// Export to window
window.PushBlock = PushBlock;
window.PressurePlate = PressurePlate;
window.Door = Door;
window.Lever = Lever;
window.AncientTablet = AncientTablet;
window.MoonKey = MoonKey;
window.MoonShard = MoonShard;
window.LevelExit = LevelExit;
window.Teleporter = Teleporter;
window.PuzzleButton = PuzzleButton;
window.FireBrazier = FireBrazier;
window.IceBarrier = IceBarrier;
window.IceTile = IceTile;
window.LightEmitter = LightEmitter;
window.Mirror = Mirror;
window.LightReceptor = LightReceptor;
window.SecretWall = SecretWall;


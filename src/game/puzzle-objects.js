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

  update(plates, levers, player) {
    if (this.requiresKey) {
      // Unlocked when player interacts with key
      return;
    }

    // Check linked pressure plate or lever
    let shouldOpen = false;
    for (const p of plates) {
      if (p.id === this.linkedId && p.isPressed) {
        shouldOpen = true;
        break;
      }
    }
    for (const l of levers) {
      if (l.id === this.linkedId && l.isOn) {
        shouldOpen = true;
        break;
      }
    }

    this.isOpen = shouldOpen;
    this.openProgress += (this.isOpen ? 1 : 0 - this.openProgress) * 0.15;
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

// Export to window
window.PushBlock = PushBlock;
window.PressurePlate = PressurePlate;
window.Door = Door;
window.Lever = Lever;
window.AncientTablet = AncientTablet;
window.MoonKey = MoonKey;
window.MoonShard = MoonShard;
window.LevelExit = LevelExit;

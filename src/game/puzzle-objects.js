/* ==========================================================================
   NIGHT FALL LAND - High-Fidelity Handcrafted Puzzle Components
   Bespoke procedural canvas artwork: Runic Monoliths, Brass Mechanisms,
   Intricate Golden Keys, Refractive Moon Shards, and Celestial Portals.
   ========================================================================== */

// 1. Heavy Runic Push Block
class PushBlock {
  constructor(x, y, size = 44) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.width = size;
    this.height = size;
    this.isSliding = false;
    this.animTime = Math.random() * 5;
  }

  update(dt, world) {
    this.animTime += dt;
    if (this.isSliding) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);
      const slideSpeed = 190;
      const step = slideSpeed * dt;

      if (dist <= step) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isSliding = false;
      } else {
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
      }
    }
  }

  tryPush(dx, dy, world, audio) {
    if (this.isSliding) return false;

    const targetX = this.x + dx * 48;
    const targetY = this.y + dy * 48;
    const testBox = { x: targetX, y: targetY, width: this.width, height: this.height };

    if (world.checkWallCollision(testBox)) return false;

    for (const door of world.doors) {
      if (!door.isOpen && world.checkOverlap(testBox, door)) return false;
    }

    for (const other of world.blocks) {
      if (other !== this) {
        const oBox = {
          x: other.isSliding ? other.targetX : other.x,
          y: other.isSliding ? other.targetY : other.y,
          width: other.width,
          height: other.height
        };
        if (world.checkOverlap(testBox, oBox)) return false;
      }
    }

    if (world.quartzMirrors) {
      for (const m of world.quartzMirrors) {
        const mBox = {
          x: m.isSliding ? m.targetX : m.x,
          y: m.isSliding ? m.targetY : m.y,
          width: m.width,
          height: m.height
        };
        if (world.checkOverlap(testBox, mBox)) return false;
      }
    }

    if (world.astralDials) {
      for (const d of world.astralDials) {
        if (world.checkOverlap(testBox, d)) return false;
      }
    }

    this.targetX = targetX;
    this.targetY = targetY;
    this.isSliding = true;
    if (audio && audio.playBlockSlide) audio.playBlockSlide();
    return true;
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x;
    const cy = this.y;
    const w = this.width;
    const h = this.height;

    // 1. Soft Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(cx + 2, cy + 4, w, h, 6);
    ctx.fill();

    // 2. Heavy Slate Body
    const grad = ctx.createLinearGradient(cx, cy, cx + w, cy + h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.roundRect(cx, cy, w, h, 5);
    ctx.fill();
    ctx.stroke();

    // 3. 3D Bevel Top & Left Edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy + h - 3);
    ctx.lineTo(cx + 2, cy + 2);
    ctx.lineTo(cx + w - 3, cy + 2);
    ctx.stroke();

    // 4. Metallic Bronze Corner Braces
    ctx.fillStyle = '#b45309';
    const cSize = 6;
    // Top-left
    ctx.fillRect(cx, cy, cSize, 2); ctx.fillRect(cx, cy, 2, cSize);
    // Top-right
    ctx.fillRect(cx + w - cSize, cy, cSize, 2); ctx.fillRect(cx + w - 2, cy, 2, cSize);
    // Bottom-left
    ctx.fillRect(cx, cy + h - 2, cSize, 2); ctx.fillRect(cx, cy + h - cSize, 2, cSize);
    // Bottom-right
    ctx.fillRect(cx + w - cSize, cy + h - 2, cSize, 2); ctx.fillRect(cx + w - 2, cy + h - cSize, 2, cSize);

    // 5. Glowing Runic Inlay
    const pulse = Math.sin(this.animTime * 3) * 0.2 + 0.8;
    ctx.strokeStyle = `rgba(0, 240, 255, ${0.5 * pulse})`;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;

    // Diamond Rune
    ctx.beginPath();
    ctx.moveTo(cx + w / 2, cy + 8);
    ctx.lineTo(cx + w - 8, cy + h / 2);
    ctx.lineTo(cx + w / 2, cy + h - 8);
    ctx.lineTo(cx + 8, cy + h / 2);
    ctx.closePath();
    ctx.stroke();

    // Glowing Central Conduit Core
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx + w / 2, cy + h / 2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 2. Brass-Rimmed Mechanical Pressure Plate
class PressurePlate {
  constructor(x, y, id, size = 46) {
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

    // Check Quartz Mirrors
    if (window.gameEngine && window.gameEngine.world && window.gameEngine.world.quartzMirrors) {
      for (const m of window.gameEngine.world.quartzMirrors) {
        if (this.checkOverlap({ x: m.x + 4, y: m.y + 4, width: m.width - 8, height: m.height - 8 }, this)) {
          pressed = true;
          break;
        }
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
    const cx = this.x;
    const cy = this.y;
    const w = this.width;
    const h = this.height;

    const mainColor = this.isPressed ? '#10b981' : '#a855f7';
    const glowColor = this.isPressed ? 'rgba(16, 185, 129, 0.45)' : 'rgba(168, 85, 247, 0.25)';

    // 1. Recessed Floor Well
    ctx.fillStyle = '#050711';
    ctx.beginPath();
    ctx.roundRect(cx, cy, w, h, 8);
    ctx.fill();

    // 2. Heavy Brass Rim
    ctx.strokeStyle = this.isPressed ? '#10b981' : '#6b21a8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = this.isPressed ? 12 : 4;
    ctx.stroke();

    // 3. Depressed Center Mechanism Pad
    const padInset = this.isPressed ? 8 : 6;
    const padW = w - padInset * 2;
    const padH = h - padInset * 2;

    ctx.fillStyle = this.isPressed ? '#064e3b' : '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(cx + padInset, cy + padInset, padW, padH, 5);
    ctx.fill();

    // 4. Runic Circuit Inlay
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Cross Circuit
    ctx.moveTo(cx + w / 2, cy + padInset + 3);
    ctx.lineTo(cx + w / 2, cy + h - padInset - 3);
    ctx.moveTo(cx + padInset + 3, cy + h / 2);
    ctx.lineTo(cx + w - padInset - 3, cy + h / 2);
    ctx.stroke();

    // Center Node
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(cx + w / 2, cy + h / 2, this.isPressed ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 3. Ancient Stone Portcullis & Runic Energy Barrier
class Door {
  constructor(x, y, width, height, linkedId, requiresKey = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.linkedId = linkedId;
    this.requiresKey = requiresKey;
    this.isOpen = false;
    this.openProgress = 0;
    this.animTime = Math.random() * 5;
  }

<<<<<<< HEAD
  update(plates, levers, player) {
    this.animTime += 0.016;

    if (this.requiresKey) return;

=======
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
>>>>>>> 2402ccdf238502764c5d7544a02b471dc69bfdf7
    let shouldOpen = false;

    // Check pressure plates
    for (const p of plates) {
      if (p.id === this.linkedId && p.isPressed) {
        shouldOpen = true;
        break;
      }
    }
<<<<<<< HEAD

    // Check levers
    for (const l of levers) {
      if (l.id === this.linkedId && l.isOn) {
        shouldOpen = true;
        break;
=======
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
>>>>>>> 2402ccdf238502764c5d7544a02b471dc69bfdf7
      }
    }

    // Check optical receptors in world
    if (window.gameEngine && window.gameEngine.world && window.gameEngine.world.lightReceptors) {
      for (const rec of window.gameEngine.world.lightReceptors) {
        if (rec.linkedId === this.linkedId && rec.isPowered) {
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
    const cx = this.x;
    const cy = this.y;
    const w = this.width;
    const h = this.height;

    if (this.isOpen) {
      // Unsealed doorway: Retracted stone base & faint green resonance embers
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.fillRect(cx, cy, w, h);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, w, 5);
      ctx.strokeRect(cx, cy + h - 5, w, 5);
    } else {
      // Solid Stone Frame with Runic Energy Bars
      const themeColor = this.requiresKey ? '#fbbf24' : '#00f0ff';

      // Dark Void Background
      ctx.fillStyle = '#060814';
      ctx.fillRect(cx, cy, w, h);

      // Stone Pillars on sides
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      if (w > h) {
        // Horizontal Door Frame
        ctx.fillRect(cx, cy, 6, h); ctx.strokeRect(cx, cy, 6, h);
        ctx.fillRect(cx + w - 6, cy, 6, h); ctx.strokeRect(cx + w - 6, cy, 6, h);
      } else {
        // Vertical Door Frame
        ctx.fillRect(cx, cy, w, 6); ctx.strokeRect(cx, cy, w, 6);
        ctx.fillRect(cx, cy + h - 6, w, 6); ctx.strokeRect(cx, cy + h - 6, w, 6);
      }

      // Energy Bar Grid with animated pulse
      const pulse = Math.sin(this.animTime * 4) * 0.2 + 0.8;
      ctx.strokeStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10 * pulse;
      ctx.lineWidth = 2;

      ctx.beginPath();
      const step = Math.min(w, h) > 30 ? 12 : 8;
      if (w > h) {
        for (let ix = cx + 10; ix < cx + w - 6; ix += step) {
          ctx.moveTo(ix, cy + 2);
          ctx.lineTo(ix, cy + h - 2);
        }
      } else {
        for (let iy = cy + 10; iy < cy + h - 6; iy += step) {
          ctx.moveTo(cx + 2, iy);
          ctx.lineTo(cx + w - 2, iy);
        }
      }
      ctx.stroke();

      // Lock Emblem in center
      if (this.requiresKey) {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx + w / 2, cy + h / 2 - 2, 7, Math.PI, 0); // Shackle
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillRect(cx + w / 2 - 6, cy + h / 2 - 2, 12, 10); // Body
        ctx.fillStyle = '#060814';
        ctx.beginPath();
        ctx.arc(cx + w / 2, cy + h / 2 + 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Runic Seal diamond
        ctx.fillStyle = themeColor;
        ctx.beginPath();
        const rSize = 5;
        ctx.moveTo(cx + w / 2, cy + h / 2 - rSize);
        ctx.lineTo(cx + w / 2 + rSize, cy + h / 2);
        ctx.lineTo(cx + w / 2, cy + h / 2 + rSize);
        ctx.lineTo(cx + w / 2 - rSize, cy + h / 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

// 4. Clockwork Mechanical Lever
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
    if (audio && audio.playPlateClick) audio.playPlateClick(this.isOn);
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    // 1. Heavy Cog Base
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 6, 13, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // 2. Brass Pivot Bolt
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Mechanical Arm
    const targetX = this.isOn ? 13 : -13;
    const targetY = -12;
    const armColor = this.isOn ? '#10b981' : '#f43f5e';

    ctx.strokeStyle = armColor;
    ctx.shadowColor = armColor;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    // 4. Polished Handle Sphere
    ctx.fillStyle = armColor;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Status Indicator LED
    ctx.fillStyle = this.isOn ? '#10b981' : '#64748b';
    ctx.shadowBlur = this.isOn ? 6 : 0;
    ctx.beginPath();
    ctx.arc(0, 10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 5. Engraved Standing Ancient Stone Tablet
class AncientTablet {
  constructor(x, y, message, title = 'Ancient Stone Tablet') {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 42;
    this.title = title;
    this.message = message;
    this.animTime = Math.random() * 5;
  }

  draw(ctx) {
    ctx.save();
    this.animTime += 0.016;
    const cx = this.x;
    const cy = this.y;
    const w = this.width;
    const h = this.height;

    // 1. Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx + w / 2, cy + h + 2, w / 2 + 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Stele Body with Arch
    const grad = ctx.createLinearGradient(cx, cy, cx + w, cy + h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(cx, cy + h);
    ctx.lineTo(cx, cy + 12);
    ctx.quadraticCurveTo(cx + w / 2, cy - 2, cx + w, cy + 12);
    ctx.lineTo(cx + w, cy + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Carved Starlight Inscription Lines
    const glow = Math.sin(this.animTime * 3) * 0.25 + 0.75;
    ctx.strokeStyle = `rgba(0, 240, 255, ${0.7 * glow})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;

    // Crest Arch Rune
    ctx.beginPath();
    ctx.arc(cx + w / 2, cy + 12, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Text Rune Lines
    ctx.beginPath();
    ctx.moveTo(cx + 7, cy + 22); ctx.lineTo(cx + w - 7, cy + 22);
    ctx.moveTo(cx + 7, cy + 28); ctx.lineTo(cx + w - 10, cy + 28);
    ctx.moveTo(cx + 7, cy + 34); ctx.lineTo(cx + w - 7, cy + 34);
    ctx.stroke();

    ctx.restore();
  }
}

// 6. Intricate Golden Moon Key (Handcrafted Canvas Art, No Emoji)
class MoonKey {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.collected = false;
    this.animTime = Math.random() * 5;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    const bob = Math.sin(this.animTime * 3.5) * 4;
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2 + bob;
    ctx.translate(cx, cy);

    // Radiant Golden Halo
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 22);
    halo.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    halo.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Draw Golden Celestial Key
    ctx.rotate(Math.PI * 0.25);
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;

    // Bow (Crescent Moon Loop)
    ctx.beginPath();
    ctx.arc(0, -9, 6.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#060814';
    ctx.beginPath();
    ctx.arc(0, -9, 4, 0, Math.PI * 2);
    ctx.fill();

    // Key Stem
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 11);
    ctx.stroke();

    // Key Teeth
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 7); ctx.lineTo(4.5, 7);
    ctx.moveTo(0, 10); ctx.lineTo(6, 10);
    ctx.stroke();

    ctx.restore();
  }
}

// 7. Refractive Crystalline Moon Shard (Handcrafted Canvas Art, No Emoji)
class MoonShard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
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
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2 + bob;
    ctx.translate(cx, cy);

    // Celestial Starlight Aura
    const pulse = Math.sin(this.animTime * 5) * 3;
    const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 20 + pulse);
    aura.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    aura.addColorStop(0.6, 'rgba(168, 85, 247, 0.2)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 20 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting Stardust Ring
    ctx.save();
    ctx.rotate(this.animTime * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Orbiting particle
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(15, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Faceted Crescent Crystal Shard
    ctx.fillStyle = '#00f0ff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.arc(0, 0, 10, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.arc(4, 0, 8, Math.PI * 0.45, -Math.PI * 0.45, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Shimmer Facet Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-1, -7);
    ctx.lineTo(2, 0);
    ctx.lineTo(-1, 7);
    ctx.stroke();

    ctx.restore();
  }
}

// 8. Celestial Dimensional Stargate (Level Exit)
class LevelExit {
  constructor(x, y, width = 64, height = 80) {
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
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    // 1. Carved Stone Arch Base
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;

    // 2. Multi-Ring Swirling Dimensional Vortex
    for (let i = 0; i < 3; i++) {
      const rot = this.animTime * (i % 2 === 0 ? 1.5 : -1.8) + i * 1.2;
      ctx.save();
      ctx.rotate(rot);

      const r = 26 - i * 6;
      ctx.strokeStyle = i === 0 ? 'rgba(0, 240, 255, 0.7)' : (i === 1 ? 'rgba(168, 85, 247, 0.7)' : '#ffffff');
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.65, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Shimmering Core Flare
    const corePulse = Math.sin(this.animTime * 6) * 3;
    const core = ctx.createRadialGradient(0, 0, 2, 0, 0, 14 + corePulse);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.5, '#00f0ff');
    core.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + corePulse, 0, Math.PI * 2);
    ctx.fill();

    // 4. Stargate Text
    ctx.font = '11px "Cinzel", "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillText('PORTAL', 0, this.height / 2 - 4);

    ctx.restore();
  }
}

<<<<<<< HEAD
=======
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
>>>>>>> 2402ccdf238502764c5d7544a02b471dc69bfdf7
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


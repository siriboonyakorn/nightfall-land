/* ==========================================================================
   NIGHT FALL LAND - Astral Cipher Pedestals & Symbol Logic Engine
   Rotatable ancient rune pillars matching cryptic poetic and astronomical deductions.
   ========================================================================== */

const GLYPH_TYPES = {
  ECLIPSE:   { name: 'Void Eclipse',   icon: '🌑', color: '#c084fc' },
  STAR:      { name: 'Starlight Astra', icon: '⭐', color: '#38bdf8' },
  CRESCENT:  { name: 'Moon Crescent',  icon: '🌙', color: '#00f0ff' },
  SUN:       { name: 'Ancient Sol',    icon: '☀️', color: '#fbbf24' },
  HALF_MOON: { name: 'Twin Phase',     icon: '🌓', color: '#a78bfa' }
};

const DEFAULT_SYMBOLS = ['ECLIPSE', 'STAR', 'CRESCENT', 'SUN', 'HALF_MOON'];

class AstralDial {
  constructor(x, y, id, symbols = DEFAULT_SYMBOLS, initialIdx = 0) {
    this.x = x;
    this.y = y;
    this.width = 42;
    this.height = 46;
    this.id = id;
    this.symbols = symbols;
    this.currentIndex = initialIdx % symbols.length;
    this.animAngle = 0;
    this.targetAngle = 0;
    this.animTime = Math.random() * 5;
  }

  getCurrentSymbol() {
    return this.symbols[this.currentIndex];
  }

  rotate(audio) {
    this.currentIndex = (this.currentIndex + 1) % this.symbols.length;
    this.targetAngle += Math.PI * 0.4;

    if (audio && audio.playDialTurn) {
      audio.playDialTurn();
    } else if (audio && audio.playPlateClick) {
      audio.playPlateClick(true);
    }
  }

  update(dt) {
    this.animTime += dt;
    if (Math.abs(this.targetAngle - this.animAngle) > 0.01) {
      this.animAngle += (this.targetAngle - this.animAngle) * 14 * dt;
    } else {
      this.animAngle = this.targetAngle;
    }
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    const currentSymKey = this.getCurrentSymbol();
    const glyphInfo = GLYPH_TYPES[currentSymKey] || { name: 'Rune', color: '#38bdf8' };

    // 1. Pedestal Base
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2 + 4, this.width, this.height - 4, 6);
    ctx.fill();
    ctx.stroke();

    // 2. Ornate Rune Dial Outer Ring
    ctx.strokeStyle = glyphInfo.color;
    ctx.shadowColor = glyphInfo.color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -2, 16, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Inner Rotating Disc
    ctx.save();
    ctx.rotate(this.animAngle);
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Render Carved Emblem on the Disc
    this.drawGlyphEmblem(ctx, currentSymKey, glyphInfo.color);

    // 5. Inscription Label under the dial
    ctx.font = '9px "Cinzel", "Orbitron", serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(currentSymKey.slice(0, 5), 0, this.height / 2 - 2);

    ctx.restore();
  }

  drawGlyphEmblem(ctx, symKey, color) {
    ctx.save();
    ctx.translate(0, -2);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    switch (symKey) {
      case 'ECLIPSE':
        // Dark circle with glowing corona
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#090514';
        ctx.fill();
        break;

      case 'STAR':
        // 4-point celestial diamond star
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.quadraticCurveTo(0, 0, 9, 0);
        ctx.quadraticCurveTo(0, 0, 0, 9);
        ctx.quadraticCurveTo(0, 0, -9, 0);
        ctx.quadraticCurveTo(0, 0, 0, -9);
        ctx.fill();
        break;

      case 'CRESCENT':
        // Curving Moon Crescent
        ctx.beginPath();
        ctx.arc(0, 0, 8, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.arc(3, 0, 6.5, Math.PI * 0.45, -Math.PI * 0.45, true);
        ctx.closePath();
        ctx.fill();
        break;

      case 'SUN':
        // Solar Core with 8 Rays
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6);
          ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        break;

      case 'HALF_MOON':
        // Half Moon Disc
        ctx.beginPath();
        ctx.arc(0, 0, 7.5, -Math.PI / 2, Math.PI / 2);
        ctx.closePath();
        ctx.fill();
        break;

      default:
        ctx.fillRect(-4, -4, 8, 8);
        break;
    }
    ctx.restore();
  }
}

class CipherLock {
  constructor(linkedDoorId, dialIds = [], targetCombination = []) {
    this.linkedDoorId = linkedDoorId;
    this.dialIds = dialIds;
    this.targetCombination = targetCombination;
    this.isSolved = false;
    this.wasSolved = false;
  }

  update(dials, doors, audio) {
    if (this.isSolved) return;

    let match = true;
    for (let i = 0; i < this.dialIds.length; i++) {
      const dial = dials.find(d => d.id === this.dialIds[i]);
      if (!dial || dial.getCurrentSymbol() !== this.targetCombination[i]) {
        match = false;
        break;
      }
    }

    this.isSolved = match;

    if (this.isSolved && !this.wasSolved) {
      if (audio && audio.playCollectEssence) audio.playCollectEssence();
      if (window.screenManager) {
        window.screenManager.showToast('Astral Cipher Resonance Unlocked! ✦', 'success');
      }
      for (const d of doors) {
        if (d.linkedId === this.linkedDoorId) {
          d.isOpen = true;
        }
      }
    }
    this.wasSolved = this.isSolved;
  }
}

window.GLYPH_TYPES = GLYPH_TYPES;
window.AstralDial = AstralDial;
window.CipherLock = CipherLock;

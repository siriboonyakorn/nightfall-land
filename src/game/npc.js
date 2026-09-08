/* ==========================================================================
   NIGHT FALL LAND - NPC & Character System
   Includes The Wanderer, The Owl, and The Watcher as described in README
   ========================================================================== */

class NPC {
  constructor(x, y, name = 'NPC', title = 'Traveler') {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 38;
    this.name = name;
    this.title = title;
    this.dialogue = ['...'];
    this.dialogueIndex = 0;
    this.animTime = Math.random() * 5;
  }

  update(dt) {
    this.animTime += dt;
  }

  interact(engine, audio) {
    if (audio) audio.playNpcVoice();
    const text = this.dialogue[this.dialogueIndex % this.dialogue.length] || this.dialogue[0];
    this.dialogueIndex++;
    if (engine && engine.showDialogue) {
      engine.showDialogue(`${this.name} — ${this.title}`, text);
    }
  }

  draw(ctx) {
    // Base draw override in subclasses
  }
}

// 1. The Wanderer (Mysterious philosopher traveler)
class WandererNPC extends NPC {
  constructor(x, y, dialogue = null) {
    super(x, y, 'The Wanderer', 'Cloaked Mystic');
    this.dialogue = dialogue || [
      'The path you seek was already walked.\n\nThe stars didn\'t fall; our eyes forgot the heavens. Look not for a weapon, Traveler—knowledge alone survives the eternal night.',
      'Forty-seven years in shadow... Do you truly know what covered the sun, or did you only trust what you were told?\n\nQuestion every stone. Question every shadow.',
      'Remember: Every rule you discover in this sanctuary can be combined, inverted, and bent.'
    ];
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const bob = Math.sin(this.animTime * 2.5) * 2;

    // Cloak
    ctx.fillStyle = '#1e1b4b'; // Deep midnight indigo
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(0, -14 + bob);
    ctx.lineTo(12, 14 + bob);
    ctx.lineTo(-12, 14 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hood & Face
    ctx.fillStyle = '#09071a';
    ctx.beginPath();
    ctx.arc(0, -8 + bob, 7, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Cyan Eyes
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.fillRect(-3, -8 + bob, 2, 2);
    ctx.fillRect(1, -8 + bob, 2, 2);

    // Celestial Lantern on staff
    const lanternX = 14;
    const lanternY = 0 + bob;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 14 + bob);
    ctx.lineTo(lanternX, -10 + bob);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 2. The Owl (Subtle puzzle guide)
class OwlNPC extends NPC {
  constructor(x, y, hint = 'The stone remembers where it belongs.') {
    super(x, y, 'The Owl', 'Watcher of Truths');
    this.dialogue = [
      `${hint}\n\n"The laws of Night Fall Land do not bend to force, only to stillness and understanding."`,
      `"Observe the connections between cause and effect. What moves when you press the rune?"`
    ];
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Stone Pillar Perch
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-8, 4, 16, 14);
    ctx.strokeRect(-8, 4, 16, 14);

    // Feathers & Body
    const breathe = Math.sin(this.animTime * 3) * 1.5;
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.ellipse(0, -2 + breathe, 9, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Owl Head & Tufted Ears
    ctx.beginPath();
    ctx.moveTo(-7, -15 + breathe);
    ctx.lineTo(-4, -9 + breathe);
    ctx.lineTo(4, -9 + breathe);
    ctx.lineTo(7, -15 + breathe);
    ctx.lineTo(0, -8 + breathe);
    ctx.closePath();
    ctx.fillStyle = '#475569';
    ctx.fill();
    ctx.stroke();

    // Large Glowing Amber Eyes
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-3.5, -4 + breathe, 2.5, 0, Math.PI * 2);
    ctx.arc(3.5, -4 + breathe, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 0;
    ctx.fillRect(-4, -4.5 + breathe, 1, 1.5);
    ctx.fillRect(3, -4.5 + breathe, 1, 1.5);

    ctx.restore();
  }
}

// 3. The Watcher (Eerie silhouette lurking in periphery)
class WatcherEntity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 40;
    this.animTime = Math.random() * 5;
    this.vanished = false;
    this.alpha = 0.85;
  }

  update(dt, player, audio, world) {
    this.animTime += dt;
    if (this.vanished) {
      if (this.alpha > 0) {
        this.alpha = Math.max(0, this.alpha - dt * 2);
      }
      return;
    }

    // When player approaches within 130px, the Watcher dissolves into mist!
    const pCenter = { x: player.x + player.width / 2, y: player.y + player.height / 2 };
    const wCenter = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    const dist = Math.hypot(pCenter.x - wCenter.x, pCenter.y - wCenter.y);

    if (dist < 130) {
      this.vanished = true;
      if (audio) audio.playBeamHum();
      if (window.screenManager) {
        window.screenManager.showToast('You felt a cold gaze dissolve into the shadows...', 'info');
      }
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Ethereal shadow silhouette
    ctx.fillStyle = '#030712';
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#6d28d9';
    ctx.shadowBlur = 12;

    const sway = Math.sin(this.animTime * 1.8) * 2;

    // Silhouette torso
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.quadraticCurveTo(10 + sway, 0, 8, 16);
    ctx.lineTo(-8, 16);
    ctx.quadraticCurveTo(-10 - sway, 0, 0, -18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Piercing Twin Violet Eyes
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(-3, -10, 1.8, 0, Math.PI * 2);
    ctx.arc(3, -10, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Export to window
window.WandererNPC = WandererNPC;
window.OwlNPC = OwlNPC;
window.WatcherEntity = WatcherEntity;

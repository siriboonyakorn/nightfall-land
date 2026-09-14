/* ==========================================================================
   NIGHT FALL LAND - Optics Puzzle Engine
   Celestial Light Emitters, Rotatable Quartz Mirrors, and Optical Receptors.
   Traces continuous real-time laser reflection physics across the puzzle rooms.
   ========================================================================== */

const DIR_VECTORS = {
  UP:    { dx: 0,  dy: -1 },
  DOWN:  { dx: 0,  dy: 1  },
  LEFT:  { dx: -1, dy: 0  },
  RIGHT: { dx: 1,  dy: 0  }
};

const ORIENTATIONS = ['NW', 'NE', 'SE', 'SW'];

// 1. Celestial Light Emitter (Beacon)
class LightEmitter {
  constructor(x, y, dir = 'RIGHT', color = '#00f0ff') {
    this.x = x;
    this.y = y;
    this.dir = dir.toUpperCase();
    this.color = color;
    this.width = 36;
    this.height = 36;
    this.isActive = true;
    this.animTime = Math.random() * 5;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Stone Beacon Pedestal
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Concentric Lens
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Core Crystal
    const pulse = Math.sin(this.animTime * 6) * 2;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, 6 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Nozzle Pointer in direction of beam
    const vec = DIR_VECTORS[this.dir] || DIR_VECTORS.RIGHT;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(vec.dx * 8, vec.dy * 8);
    ctx.lineTo(vec.dx * 18, vec.dy * 18);
    ctx.stroke();

    ctx.restore();
  }
}

// 2. Pushable & Rotatable Quartz Mirror Block
class QuartzMirror {
  constructor(x, y, orientation = 'NE', size = 44) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.width = size;
    this.height = size;
    this.orientation = orientation; // 'NE', 'SE', 'SW', 'NW'
    this.isSliding = false;
    this.animAngle = 0;
    this.targetAngle = 0;
    this.animTime = 0;

    this.syncAngle();
  }

  syncAngle() {
    switch (this.orientation) {
      case 'NE': this.targetAngle = 0; break;
      case 'SE': this.targetAngle = Math.PI * 0.5; break;
      case 'SW': this.targetAngle = Math.PI; break;
      case 'NW': this.targetAngle = Math.PI * 1.5; break;
    }
    this.animAngle = this.targetAngle;
  }

  getDescription() {
    switch (this.orientation) {
      case 'NE': return 'Deflects (DOWN ➔ RIGHT / LEFT ➔ UP)';
      case 'SE': return 'Deflects (UP ➔ RIGHT / LEFT ➔ DOWN)';
      case 'SW': return 'Deflects (UP ➔ LEFT / RIGHT ➔ DOWN)';
      case 'NW': return 'Deflects (DOWN ➔ LEFT / RIGHT ➔ UP)';
    }
    return '';
  }

  rotate(audio) {
    const order = ['NE', 'SE', 'SW', 'NW'];
    const idx = order.indexOf(this.orientation);
    this.orientation = order[(idx + 1) % order.length];
    this.targetAngle += Math.PI * 0.5;

    if (audio && audio.playMirrorRotate) {
      audio.playMirrorRotate();
    } else if (audio && audio.playPlateClick) {
      audio.playPlateClick(true);
    }
  }

  update(dt, world) {
    this.animTime += dt;

    // Smooth rotation interpolation
    if (Math.abs(this.targetAngle - this.animAngle) > 0.01) {
      this.animAngle += (this.targetAngle - this.animAngle) * 16 * dt;
    } else {
      this.animAngle = this.targetAngle;
    }

    // Smooth physical slide interpolation (no teleport!)
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
      const oBox = {
        x: other.isSliding ? other.targetX : other.x,
        y: other.isSliding ? other.targetY : other.y,
        width: other.width,
        height: other.height
      };
      if (world.checkOverlap(testBox, oBox)) return false;
    }

    if (world.quartzMirrors) {
      for (const m of world.quartzMirrors) {
        if (m !== this) {
          const mBox = {
            x: m.isSliding ? m.targetX : m.x,
            y: m.isSliding ? m.targetY : m.y,
            width: m.width,
            height: m.height
          };
          if (world.checkOverlap(testBox, mBox)) return false;
        }
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

  /**
   * Calculate reflection for an incoming ray direction.
   */
  reflect(rayDir) {
    switch (this.orientation) {
      case 'NE': // ◥ Slanted \ with reflective side facing North-East
        if (rayDir === 'DOWN') return 'RIGHT';
        if (rayDir === 'LEFT') return 'UP';
        return null;

      case 'SE': // ◢ Slanted / with reflective side facing South-East
        if (rayDir === 'UP') return 'RIGHT';
        if (rayDir === 'LEFT') return 'DOWN';
        return null;

      case 'SW': // ◣ Slanted \ with reflective side facing South-West
        if (rayDir === 'UP') return 'LEFT';
        if (rayDir === 'RIGHT') return 'DOWN';
        return null;

      case 'NW': // ◤ Slanted / with reflective side facing North-West
        if (rayDir === 'DOWN') return 'LEFT';
        if (rayDir === 'RIGHT') return 'UP';
        return null;
    }
    return null;
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    ctx.translate(cx, cy);

    // 1. Heavy Stone Base
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 6);
    ctx.fill();
    ctx.stroke();

    // 2. Brass Mounting Ring
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Rotating Crystal Quartz Prism Platform
    ctx.rotate(this.animAngle);

    const half = this.width / 2 - 6;

    // Prismatic Base Triangle (South-West side)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-half, -half);
    ctx.lineTo(half, half);
    ctx.lineTo(-half, half);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Silver Mirrored Hypotenuse Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(-half, -half);
    ctx.lineTo(half, half);
    ctx.stroke();

    // Reflection Indicator Flare
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(half * 0.35, -half * 0.35, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 3. Optical Light Receptor (Sun/Moon Eye)
class LightReceptor {
  constructor(x, y, linkedId, facing = 'ANY') {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.linkedId = linkedId;
    this.facing = facing; // 'UP', 'DOWN', 'LEFT', 'RIGHT', 'ANY'
    this.isPowered = false;
    this.wasPowered = false;
    this.animTime = 0;
  }

  update(dt, audio) {
    this.animTime += dt;
    if (this.isPowered && !this.wasPowered) {
      if (audio && audio.playBeamActivate) {
        audio.playBeamActivate();
      } else if (audio && audio.playCollectEssence) {
        audio.playCollectEssence();
      }
      if (window.screenManager) {
        window.screenManager.showToast('Optical Circuit Energized! ✦', 'success');
      }
    }
    this.wasPowered = this.isPowered;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const glowColor = this.isPowered ? '#00f0ff' : '#64748b';

    // Pedestal Plate
    ctx.fillStyle = '#090d1a';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = this.isPowered ? 14 : 4;

    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

    // Circular Receptor Lens
    ctx.fillStyle = this.isPowered ? 'rgba(0, 240, 255, 0.25)' : 'rgba(30, 41, 59, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Central Celestial Core
    const pulse = this.isPowered ? Math.sin(this.animTime * 8) * 3 : 0;
    ctx.fillStyle = this.isPowered ? '#00f0ff' : '#475569';
    ctx.shadowBlur = this.isPowered ? 18 : 0;
    ctx.beginPath();
    ctx.arc(0, 0, 6 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Lens Crosshairs
    ctx.strokeStyle = this.isPowered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.moveTo(0, -10); ctx.lineTo(0, 10);
    ctx.stroke();

    ctx.restore();
  }
}

// 4. Master Optics Engine
class OpticsEngine {
  constructor() {
    this.beamSegments = [];
    this.impactParticles = [];
  }

  update(world, dt, audio) {
    this.beamSegments = [];

    // Reset receptor powered state
    if (world.lightReceptors) {
      for (const rec of world.lightReceptors) {
        rec.isPowered = false;
      }
    }

    if (!world.lightEmitters) return;

    for (const emitter of world.lightEmitters) {
      if (!emitter.isActive) continue;
      this.traceRay(emitter.x, emitter.y, emitter.dir, world);
    }

    // Update receptors
    if (world.lightReceptors) {
      for (const rec of world.lightReceptors) {
        rec.update(dt, audio);
      }
    }
  }

  traceRay(startX, startY, dir, world) {
    let currentX = startX;
    let currentY = startY;
    let currentDir = dir;
    let reflections = 0;
    const maxReflections = 14;
    let lastHitMirror = null;

    while (reflections < maxReflections) {
      const vec = DIR_VECTORS[currentDir];
      if (!vec) break;

      let closestHit = null;
      let hitDistance = 2000;
      let hitType = null;
      let hitTarget = null;

      // 1. Raycast against Walls
      for (const w of world.walls) {
        const hit = this.rayAABB(currentX, currentY, vec, w);
        if (hit && hit.dist > 0.1 && hit.dist < hitDistance) {
          hitDistance = hit.dist;
          closestHit = hit;
          hitType = 'wall';
          hitTarget = w;
        }
      }

      // 2. Raycast against Closed Doors
      for (const d of world.doors) {
        if (!d.isOpen) {
          const hit = this.rayAABB(currentX, currentY, vec, d);
          if (hit && hit.dist > 0.1 && hit.dist < hitDistance) {
            hitDistance = hit.dist;
            closestHit = hit;
            hitType = 'door';
            hitTarget = d;
          }
        }
      }

      // 3. Raycast against Push Blocks
      for (const b of world.blocks) {
        const bBox = { x: b.x, y: b.y, width: b.width, height: b.height };
        const hit = this.rayAABB(currentX, currentY, vec, bBox);
        if (hit && hit.dist > 0.1 && hit.dist < hitDistance) {
          hitDistance = hit.dist;
          closestHit = hit;
          hitType = 'block';
          hitTarget = b;
        }
      }

      // 4. Raycast against Quartz Mirrors
      if (world.quartzMirrors) {
        for (const m of world.quartzMirrors) {
          if (m === lastHitMirror) continue;
          const mBox = { x: m.x, y: m.y, width: m.width, height: m.height };
          const hit = this.rayAABB(currentX, currentY, vec, mBox);
          if (hit && hit.dist > 0.1 && hit.dist < hitDistance) {
            hitDistance = hit.dist;
            closestHit = hit;
            hitType = 'mirror';
            hitTarget = m;
          }
        }
      }

      // 5. Raycast against Light Receptors
      if (world.lightReceptors) {
        for (const rec of world.lightReceptors) {
          const rBox = { x: rec.x - rec.width / 2, y: rec.y - rec.height / 2, width: rec.width, height: rec.height };
          const hit = this.rayAABB(currentX, currentY, vec, rBox);
          if (hit && hit.dist > 0.1 && hit.dist < hitDistance) {
            hitDistance = hit.dist;
            closestHit = hit;
            hitType = 'receptor';
            hitTarget = rec;
          }
        }
      }

      if (!closestHit) {
        // Beam shoots to boundary
        const endX = currentX + vec.dx * 1280;
        const endY = currentY + vec.dy * 720;
        this.beamSegments.push({ x1: currentX, y1: currentY, x2: endX, y2: endY });
        break;
      }

      if (hitType === 'mirror') {
        const mirrorCenterX = hitTarget.x + hitTarget.width / 2;
        const mirrorCenterY = hitTarget.y + hitTarget.height / 2;
        this.beamSegments.push({ x1: currentX, y1: currentY, x2: mirrorCenterX, y2: mirrorCenterY });

        const nextDir = hitTarget.reflect(currentDir);
        if (nextDir) {
          currentX = mirrorCenterX;
          currentY = mirrorCenterY;
          currentDir = nextDir;
          lastHitMirror = hitTarget;
          reflections++;
        } else {
          // Mirror back absorbed
          break;
        }
      } else if (hitType === 'receptor') {
        this.beamSegments.push({ x1: currentX, y1: currentY, x2: hitTarget.x, y2: hitTarget.y });
        hitTarget.isPowered = true;
        break;
      } else {
        const nextX = closestHit.x;
        const nextY = closestHit.y;
        this.beamSegments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });
        break;
      }
    }
  }

  rayAABB(rx, ry, vec, box) {
    const xMin = box.x;
    const xMax = box.x + box.width;
    const yMin = box.y;
    const yMax = box.y + box.height;

    let tNear = -Infinity;
    let tFar = Infinity;

    if (vec.dx !== 0) {
      const t1 = (xMin - rx) / vec.dx;
      const t2 = (xMax - rx) / vec.dx;
      tNear = Math.max(tNear, Math.min(t1, t2));
      tFar = Math.min(tFar, Math.max(t1, t2));
    } else {
      if (rx < xMin || rx > xMax) return null;
    }

    if (vec.dy !== 0) {
      const t1 = (yMin - ry) / vec.dy;
      const t2 = (yMax - ry) / vec.dy;
      tNear = Math.max(tNear, Math.min(t1, t2));
      tFar = Math.min(tFar, Math.max(t1, t2));
    } else {
      if (ry < yMin || ry > yMax) return null;
    }

    if (tNear > tFar || tFar < 0) return null;
    if (tNear < 0) return null;

    return {
      dist: tNear,
      x: rx + vec.dx * tNear,
      y: ry + vec.dy * tNear
    };
  }

  draw(ctx) {
    if (this.beamSegments.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';

    // 1. Outer Radiant Bloom Beam
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    for (const seg of this.beamSegments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();

    // 2. Saturated Cyan Core Beam
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (const seg of this.beamSegments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();

    // 3. Pure White High-Energy Core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (const seg of this.beamSegments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();

    // 4. Impact Flares at line ends
    for (const seg of this.beamSegments) {
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(seg.x2, seg.y2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

window.LightEmitter = LightEmitter;
window.QuartzMirror = QuartzMirror;
window.LightReceptor = LightReceptor;
window.OpticsEngine = OpticsEngine;

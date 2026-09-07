/* ==========================================================================
   NIGHTFALL LAND - Smooth Tracking Camera with Screen Shake
   ========================================================================== */

class Camera {
  constructor(viewWidth, viewHeight) {
    this.x = 0;
    this.y = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.target = null;
    this.smoothSpeed = 0.08;
    this.shakeTrauma = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.worldBounds = { minX: 0, maxX: 3500, minY: -500, maxY: 900 };
  }

  follow(targetEntity) {
    this.target = targetEntity;
  }

  addTrauma(amount) {
    this.shakeTrauma = Math.min(1.0, this.shakeTrauma + amount);
  }

  update(dt) {
    if (this.target) {
      // Look ahead based on player facing direction
      const lookAhead = (this.target.facing || 1) * 60;
      const targetX = this.target.x + lookAhead - this.viewWidth / 2;
      const targetY = this.target.y - this.viewHeight / 2 - 40;

      this.x += (targetX - this.x) * this.smoothSpeed;
      this.y += (targetY - this.y) * this.smoothSpeed;
    }

    // Clamp camera within world bounds
    this.x = Math.max(this.worldBounds.minX, Math.min(this.worldBounds.maxX - this.viewWidth, this.x));
    this.y = Math.max(this.worldBounds.minY, Math.min(this.worldBounds.maxY - this.viewHeight, this.y));

    // Calculate Trauma / Shake
    if (this.shakeTrauma > 0) {
      const shakeMagnitude = Math.pow(this.shakeTrauma, 2) * 16;
      this.shakeOffsetX = (Math.random() * 2 - 1) * shakeMagnitude;
      this.shakeOffsetY = (Math.random() * 2 - 1) * shakeMagnitude;
      this.shakeTrauma = Math.max(0, this.shakeTrauma - dt * 2.2);
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  applyTransform(ctx) {
    ctx.save();
    ctx.translate(
      Math.floor(-this.x + this.shakeOffsetX),
      Math.floor(-this.y + this.shakeOffsetY)
    );
  }

  restoreTransform(ctx) {
    ctx.restore();
  }
}

window.Camera = Camera;

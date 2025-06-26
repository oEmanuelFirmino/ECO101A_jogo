import { Character } from "./character.entity.js";

export class Item extends Character {
  constructor(x, y, width, height, sprite, effect) { super(x, y, width, height, 0, sprite); this.effect = effect; }
}

export class Portal extends Character {
  constructor(x, y, radius, sprite) {
    super(x, y, radius * 2, radius * 2, 0, sprite);
    this.radius = radius; this.angle = 0;
  }

  update() {
    this.angle += 0.02;
  }

  draw(ctx) {
    ctx.save();
    tx.translate(this.x + this.radius, this.y + this.radius);
    ctx.rotate(this.angle);

    const gradient = ctx.createRadialGradient(0, 0, this.radius / 3, 0, 0, this.radius);

    gradient.addColorStop(0, "rgba(142, 68, 173, 0.2)");
    gradient.addColorStop(0.5, "rgba(155, 89, 182, 0.8)");
    gradient.addColorStop(1, "rgba(142, 68, 173, 0.2)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class LavaPool extends Character {
  constructor(x, y, radius) {
    super(x - radius, y - radius, radius * 2, radius * 2, 0, null);
    this.radius = radius;
    this.damage = 10;
    this.animationTimer = Math.random() * 2000;
    this.bubbles = [];
  }


  update() {
    this.animationTimer += 16;


    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      this.bubbles[i].lifetime--;
      if (this.bubbles[i].lifetime <= 0) {
        this.bubbles.splice(i, 1);
      }
    }

    if (Math.random() < 0.1) {
      const size = Math.random() * 5 + 2;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (this.radius * 0.6);

      this.bubbles.push({
        x: (this.x + this.radius) + Math.cos(angle) * dist,
        y: (this.y + this.radius) + Math.sin(angle) * dist,
        size: size,
        lifetime: Math.random() * 60 + 30,
        maxLifetime: 60,
      });
    }
  }

  draw(ctx) {

    const pulseOuter = Math.sin(this.animationTimer / 400) * 0.1 + 0.9;
    const pulseInner = Math.sin(this.animationTimer / 250) * 0.15 + 0.85;

    ctx.fillStyle = "rgba(200, 50, 0, 0.4)";
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius * pulseOuter, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 100, 0, 0.6)";
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius * 0.7 * pulseOuter, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 200, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius * 0.4 * pulseInner, 0, Math.PI * 2);
    ctx.fill();

    this.bubbles.forEach(bubble => {
      const lifePercent = bubble.lifetime / bubble.maxLifetime;
      ctx.fillStyle = `rgba(255, 220, 100, ${lifePercent * 0.9})`;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size * lifePercent, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
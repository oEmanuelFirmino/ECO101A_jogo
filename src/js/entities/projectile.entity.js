import { Character } from "./character.entity.js";

export class Projectile extends Character {
  constructor(x, y, hitboxWidth, hitboxHeight, visualWidth, visualHeight, sprite, vx, vy, direction) {

    super(x, y, hitboxWidth, hitboxHeight, 0, sprite);

    this.visualWidth = visualWidth;
    this.visualHeight = visualHeight;
    this.vx = vx;
    this.vy = vy;
    this.direction = direction;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    if (!this.sprite || !this.sprite.complete || this.sprite.naturalWidth === 0) return;

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    let angle = 0;
    switch (this.direction) {
      case 'up': angle = -Math.PI / 2; break;
      case 'down': angle = Math.PI / 2; break;
      case 'left': angle = Math.PI; break;
    }
    ctx.rotate(angle);

    ctx.drawImage(this.sprite, -this.visualWidth / 2, -this.visualHeight / 2, this.visualWidth, this.visualHeight);

    ctx.restore();
  }
}

export class EnemyProjectile extends Projectile {
  constructor(x, y, width, height, sprite, vx, vy, damage) {
    super(x, y, width, height, width, height, sprite, vx, vy, null);
    this.damage = damage;
  }
}
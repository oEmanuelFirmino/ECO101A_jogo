import { Character } from "./character.entity.js";
import { Enemy } from "./enemy.entity.js";

export class DynamicEnemy extends Enemy {
  constructor(x, y, width, height, speed, sprites, health, damage) {
    super(x, y, width, height, speed, sprites.down, health, damage);
    this.sprites = sprites;
    this.direction = 'down';
  }

  update(player) {
    if (!player) return;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dy) > Math.abs(dx)) {
      this.direction = dy > 0 ? 'down' : 'up';
    }
    else {
      this.direction = dx > 0 ? 'right' : 'left';
    }

    if (distance > 1) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw(ctx) {
    let currentSprite;

    switch (this.direction) {
      case 'up': currentSprite = this.sprites.up;
        break;
      case 'down': currentSprite = this.sprites.down;
        break;
      case 'left': currentSprite = this.sprites.left;
        break;
      case 'right': currentSprite = this.sprites.right;
        break;
      default: currentSprite = this.sprites.down;
    }

    const tempSprite = new Character(this.x, this.y, this.width, this.height, 0, currentSprite);

    tempSprite.draw(ctx);
  }
}
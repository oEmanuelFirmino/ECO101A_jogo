import { Character } from './character.entity.js';

export class Enemy extends Character {
  constructor(x, y, width, height, speed, sprite, health, damage) {
    super(x, y, width, height, speed, sprite);
    this.health = health;
    this.damage = damage;
  }

  update(player) {
    if (!player) return;
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed;
    }
  }

  takeDamage(amount) {
    this.health -= amount;

    return this.health <= 0;
  }
}
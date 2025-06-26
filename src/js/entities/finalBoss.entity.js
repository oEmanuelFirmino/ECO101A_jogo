import { gameState } from '../gameState/gameState.js';
import { images } from '../config.js';
import { Character } from "./character.entity.js";
import { Enemy } from "./enemy.entity.js";

export class FinalBoss extends Enemy {
  constructor(x, y, width, height, speed, sprites, health, damage) {
    super(x, y, width, height, speed, sprites.down, health, damage);
    this.maxHealth = health;
    this.state = 'idle';
    this.stateTimer = 0;
    this.lastAttackTime = Date.now();
    this.sprites = sprites;
    this.direction = 'down';
  }

  update(player) {
    this.stateTimer -= 1000 / 60;

    if (player) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      if (Math.abs(dy) > Math.abs(dx)) {
        this.direction = dy > 0 ? 'down' : 'up';
      } else {
        this.direction = dx > 0 ? 'right' : 'left';
      }
    }

    if (this.stateTimer <= 0) {
      this.chooseNextState(player);
    }

    if (this.state === 'charging' && player) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1) {
        this.x += (dx / distance) * (this.speed * 2.5);
        this.y += (dy / distance) * (this.speed * 2.5);
      }
    }
  }

  chooseNextState(player) {
    if (!player) {
      this.state = 'idle';
      return;
    }

    const now = Date.now();

    if (now - this.lastAttackTime < 2000) {
      this.state = 'idle';
      return;
    }

    const healthPercent = this.health / this.maxHealth;
    const availableStates = ['charging', 'shooting'];

    if (healthPercent <= 0.5) {
      availableStates.push('summoning');
    }

    const nextState = availableStates[Math.floor(Math.random() * availableStates.length)];

    this.state = nextState;
    this.lastAttackTime = now;

    switch (nextState) {
      case 'charging':
        this.stateTimer = 1500;
        break;
      case 'shooting':
        this.shootAtPlayer(player);
        this.stateTimer = 1000;
        break;
      case 'summoning':
        this.summonMinions();
        this.stateTimer = 2000;
        break;
      default:
        this.stateTimer = 500;
        break;
    }
  }

  shootAtPlayer(player) {
    if (!player) return;

    const shotSound = document.getElementById("boss-shot-sfx");

    if (shotSound) {
      shotSound.currentTime = 0;
      shotSound.play();
    }

    const projSpeed = 5;
    const numProjectiles = 5;
    const angleStep = Math.PI / 16;
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const centralAngle = Math.atan2(dy, dx);

    for (let i = 0; i < numProjectiles; i++) {
      const angle = centralAngle - (angleStep * (numProjectiles - 1) / 2) + (i * angleStep);
      const vx = Math.cos(angle) * projSpeed;
      const vy = Math.sin(angle) * projSpeed;
      gameState.enemyProjectiles.push(new EnemyProjectile(this.x + this.width / 2, this.y + this.height / 2, 15, 15, images.enemyProjectile, vx, vy, 20));
    }
  }

  summonMinions() {
    for (let i = 0; i < 2; i++) {
      const spawnX = this.x + (Math.random() - 0.5) * 200;
      const spawnY = this.y + (Math.random() - 0.5) * 200;

      gameState.enemies.push(new Enemy(spawnX, spawnY, 35, 35, 2.5, images.fastEnemy, 20, 50));
    }
  }
  draw(ctx) {
    let currentSprite;

    switch (this.direction) {
      case 'up': currentSprite = this.sprites.up; break;
      case 'down': currentSprite = this.sprites.down; break;
      case 'left': currentSprite = this.sprites.left; break;
      case 'right': currentSprite = this.sprites.right; break;
      default: currentSprite = this.sprites.down;
    }

    const tempSprite = new Character(this.x, this.y, this.width, this.height, 0, currentSprite);
    tempSprite.draw(ctx);
  }
}
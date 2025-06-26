import { gameState } from '../gameState/gameState.js';
import { images, MAP_WIDTH, PLAYABLE_AREA_BORDER, MAP_HEIGHT } from '../config.js';
import { Character } from "./character.entity.js";
import { Projectile } from './projectile.entity.js';

export class Player extends Character {
  constructor(x, y, width, height, speed, sprite) {
    super(x, y, width, height, speed, sprite);
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.isShielded = false;
    this.shieldTimer = 0;
    this.direction = "down";
  }

  update() {
    if (gameState.keysPressed["w"]) { this.y -= this.speed; this.direction = 'up'; }
    if (gameState.keysPressed["s"]) { this.y += this.speed; this.direction = 'down'; }
    if (gameState.keysPressed["a"]) { this.x -= this.speed; this.direction = 'left'; }
    if (gameState.keysPressed["d"]) { this.x += this.speed; this.direction = 'right'; }

    const minX = PLAYABLE_AREA_BORDER;
    const minY = PLAYABLE_AREA_BORDER;
    const maxX = MAP_WIDTH - PLAYABLE_AREA_BORDER - this.width;
    const maxY = MAP_HEIGHT - PLAYABLE_AREA_BORDER - this.height;

    this.x = Math.max(minX, Math.min(maxX, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));

    if (gameState.canShoot) {
      if (gameState.keysPressed["i"]) this.shoot("up");
      else if (gameState.keysPressed["k"]) this.shoot("down");
      else if (gameState.keysPressed["j"]) this.shoot("left");
      else if (gameState.keysPressed["l"]) this.shoot("right");
    }
    if (this.isShielded) {
      this.shieldTimer -= 1000 / 60;
      if (this.shieldTimer <= 0) this.isShielded = false;
    }
  }

  shoot(direction) {
    this.direction = direction;
    let projX, projY, vx = 0, vy = 0;
    const projSpeed = 8;

    const visualWidth = 45;
    const visualHeight = 41;


    const hitboxWidth = 20;
    const hitboxHeight = 8;

    switch (direction) {
      case "up":
        projX = this.x + this.width / 2 - hitboxWidth / 2;
        projY = this.y - hitboxHeight;
        vy = -projSpeed;
        break;
      case "down":
        projX = this.x + this.width / 2 - hitboxWidth / 2;
        projY = this.y + this.height;
        vy = projSpeed;
        break;
      case "left":
        projX = this.x - hitboxWidth;
        projY = this.y + this.height / 2 - hitboxHeight / 2;
        vx = -projSpeed;
        break;
      case "right":
        projX = this.x + this.width;
        projY = this.y + this.height / 2 - hitboxHeight / 2;
        vx = projSpeed;
        break;
    }

    if (vx !== 0 || vy !== 0) {
      const shotSound = document.getElementById("player-shot-sfx");

      if (shotSound) {
        shotSound.currentTime = 0;
        shotSound.play();
      }

      gameState.projectiles.push(
        new Projectile(projX, projY, hitboxWidth, hitboxHeight, visualWidth, visualHeight, images.projectile, vx, vy, direction)
      );
      gameState.canShoot = false;

      setTimeout(() => { gameState.canShoot = true; }, gameState.shootCooldown);
    }
  }

  takeDamage(amount) {
    if (!this.isShielded) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        gameState.isGameOver = true;
      }
    }
  }

  applyEffect(effect) {
    if (effect === "heal") {
      this.health = Math.min(this.maxHealth, this.health + 50);
    }
    else if (effect === "speed") {
      this.speed *= 1.5; setTimeout(() => {
        this.speed /= 1.5;
      }, 5000);
    }
    else if (effect === "shield") {
      this.isShielded = true; this.shieldTimer = 5000;
    }
    else if (effect === "firerate") {
      if (gameState.isFireRateActive) return;

      gameState.isFireRateActive = true;

      const originalCooldown = gameState.shootCooldown;

      gameState.shootCooldown /= 2;

      setTimeout(() => {
        gameState.shootCooldown = originalCooldown;
        gameState.isFireRateActive = false;
      }, 7000);
    }
  }

  draw(ctx) {
    if (gameState.isPlayerInvincible) {
      if (Math.floor(Date.now() / 100) % 2 === 0) { return; }
    }

    let playerSprite;
    switch (this.direction) {
      case 'up': playerSprite = images.player_costas; break;
      case 'down': playerSprite = images.player_frente; break;
      case 'left': playerSprite = images.player_esquerda; break;
      case 'right': playerSprite = images.player_direita; break;
      default: playerSprite = images.player_frente;
    }

    const body = new Character(this.x, this.y, this.width, this.height, 0, playerSprite);
    body.draw(ctx);

    this.drawWeapon(ctx);

    if (this.isShielded) {
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) / 2 + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(52, 152, 219, 0.8)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  drawWeapon(ctx) {
    if (gameState.isFireRateActive) {
      return;
    }
    const pivotX = this.x + this.width / 2;
    const pivotY = this.y + this.height / 2;

    ctx.save();
    ctx.translate(pivotX, pivotY);

    let rotation = 0;

    switch (this.direction) {
      case 'up': rotation = -Math.PI / 2; break;
      case 'down': rotation = Math.PI / 2; break;
      case 'left': ctx.scale(-1, 1); break;
      case 'right': break;
    }

    ctx.rotate(rotation);
    const weaponImage = images.pistol;

    if (weaponImage && weaponImage.complete && weaponImage.naturalWidth !== 0) {
      const weaponWidth = 35;
      const weaponHeight = 35;
      ctx.drawImage(weaponImage, 10, -weaponHeight / 2, weaponWidth, weaponHeight);
    }
    ctx.restore();
  }
}
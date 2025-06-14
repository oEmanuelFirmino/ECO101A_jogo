// src/js/entities.js

import { gameState } from './gameState.js';
import { images, MAP_WIDTH, PLAYABLE_AREA_BORDER } from './config.js';

class Character {
  constructor(x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.sprite = sprite;
  }
  draw(ctx) {
    // Adicionamos uma verificação para garantir que o sprite e o ctx existam antes de desenhar
    if (ctx && this.sprite && this.sprite.complete) {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
  }
}

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
    const maxY = MAP_WIDTH - PLAYABLE_AREA_BORDER - this.height;
    this.x = Math.max(minX, Math.min(maxX, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));

    if (gameState.canShoot) {
      if (gameState.keysPressed["arrowup"]) this.shoot("up");
      else if (gameState.keysPressed["arrowdown"]) this.shoot("down");
      else if (gameState.keysPressed["arrowleft"]) this.shoot("left");
      else if (gameState.keysPressed["arrowright"]) this.shoot("right");
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
    const projSize = 10;
    switch (direction) {
      case "up": projX = this.x + this.width / 2 - projSize / 2; projY = this.y - projSize; vy = -projSpeed; break;
      case "down": projX = this.x + this.width / 2 - projSize / 2; projY = this.y + this.height; vy = projSpeed; break;
      case "left": projX = this.x - projSize; projY = this.y + this.height / 2 - projSize / 2; vx = -projSpeed; break;
      case "right": projX = this.x + this.width; projY = this.y + this.height / 2 - projSize / 2; vx = projSpeed; break;
    }
    if (vx !== 0 || vy !== 0) {
      gameState.projectiles.push(new Projectile(projX, projY, projSize, projSize, images.projectile, vx, vy));
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
      this.health = Math.min(this.maxHealth, this.health + 25);
    } else if (effect === "speed") {
      this.speed *= 1.5;
      setTimeout(() => { this.speed /= 1.5; }, 5000);
    } else if (effect === "shield") {
      this.isShielded = true;
      this.shieldTimer = 5000;
    } else if (effect === "firerate") {
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
    let currentSprite;
    switch (this.direction) {
      case 'up': currentSprite = images.player_costas; break;
      case 'down': currentSprite = images.player_frente; break;
      case 'left': currentSprite = images.player_esquerda; break;
      case 'right': currentSprite = images.player_direita; break;
      default: currentSprite = images.player_frente;
    }
    
    if (currentSprite && currentSprite.complete) {
        ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);
    }
    
    this.drawWeapon(ctx); // Passa o 'ctx' para a função de desenhar a arma

    if (this.isShielded) {
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) / 2 + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(52, 152, 219, 0.8)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  drawWeapon(ctx) {
    const pivotX = this.x + this.width / 2;
    const pivotY = this.y + this.height / 2;
    let rotation = 0;

    switch (this.direction) {
      case 'up': rotation = -Math.PI / 2; break;
      case 'down': rotation = Math.PI / 2; break;
      case 'left': rotation = Math.PI; break;
      case 'right': rotation = 0; break;
    }

    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(rotation);

    if (gameState.isFireRateActive) {
      const weaponWidth = 30;
      const weaponHeight = 12;
      ctx.fillStyle = '#99ff99';
      ctx.fillRect(5, -weaponHeight / 2, weaponWidth, weaponHeight);
    } else {
      const weaponWidth = 20;
      const weaponHeight = 8;
      ctx.fillStyle = '#666';
      ctx.fillRect(5, -weaponHeight / 2, weaponWidth, weaponHeight);
    }
    ctx.restore();
  }
}

export class Enemy extends Character {
    constructor(x, y, width, height, speed, sprite, health) { super(x, y, width, height, speed, sprite); this.health = health; }
    update(player) { const dx = player.x - this.x; const dy = player.y - this.y; const distance = Math.sqrt(dx * dx + dy * dy); if (distance > 1) { this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed; } }
    takeDamage(amount) { this.health -= amount; return this.health <= 0; }
}

export class Boss extends Enemy {
    constructor(x, y, width, height, speed, sprite, health) { super(x, y, width, height, speed, sprite); this.maxHealth = health; this.direction = 1; }
    update(player) { this.x += this.speed * this.direction; if (this.x <= 0 || this.x >= MAP_WIDTH - this.width) { this.direction *= -1; } }
}

export class DynamicEnemy extends Enemy {
    constructor(x, y, width, height, speed, sprites, health) { super(x, y, width, height, speed, sprites.down, health); this.sprites = sprites; this.direction = 'down'; }
    update(player) { const dx = player.x - this.x; const dy = player.y - this.y; const distance = Math.sqrt(dx * dx + dy * dy); if (Math.abs(dy) > Math.abs(dx)) { this.direction = dy > 0 ? 'down' : 'up'; } else { this.direction = dx > 0 ? 'right' : 'left'; } if (distance > 1) { this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed; } }
    draw(ctx) { let currentSprite; switch (this.direction) { case 'up': currentSprite = this.sprites.up; break; case 'down': currentSprite = this.sprites.down; break; case 'left': currentSprite = this.sprites.left; break; case 'right': currentSprite = this.sprites.right; break; default: currentSprite = this.sprites.down; } if(ctx && currentSprite && currentSprite.complete) {ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);} }
}

export class Projectile extends Character {
    constructor(x, y, width, height, sprite, vx, vy) { super(x, y, width, height, 0, sprite); this.vx = vx; this.vy = vy; }
    update() { this.x += this.vx; this.y += this.vy; }
}

export class Item extends Character {
    constructor(x, y, width, height, sprite, effect) { super(x, y, width, height, 0, sprite); this.effect = effect; }
}

export class Portal extends Character {
    constructor(x, y, radius, sprite) { super(x, y, radius * 2, radius * 2, 0, sprite); this.radius = radius; this.angle = 0; }
    update() { this.angle += 0.02; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x + this.radius, this.y + this.radius); ctx.rotate(this.angle);
        const gradient = ctx.createRadialGradient(0, 0, this.radius / 3, 0, 0, this.radius);
        gradient.addColorStop(0, "rgba(142, 68, 173, 0.2)"); gradient.addColorStop(0.5, "rgba(155, 89, 182, 0.8)"); gradient.addColorStop(1, "rgba(142, 68, 173, 0.2)");
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}
import { gameState } from './gameState.js';
import { images, MAP_WIDTH, PLAYABLE_AREA_BORDER, MAP_HEIGHT } from './config.js';

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
    if (ctx && this.sprite && this.sprite.complete && this.sprite.naturalWidth !== 0 && !isNaN(this.x) && !isNaN(this.y)) {
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
    const maxY = MAP_HEIGHT - PLAYABLE_AREA_BORDER - this.height;
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
    if (effect === "heal") { this.health = Math.min(this.maxHealth, this.health + 50); }
    else if (effect === "speed") { this.speed *= 1.5; setTimeout(() => { this.speed /= 1.5; }, 5000); }
    else if (effect === "shield") { this.isShielded = true; this.shieldTimer = 5000; }
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
    const weaponImage = gameState.isFireRateActive ? images.powerupWeapon : images.pistol;
    if (weaponImage && weaponImage.complete && weaponImage.naturalWidth !== 0) {
      const weaponWidth = 35;
      const weaponHeight = 35;
      ctx.drawImage(weaponImage, 10, -weaponHeight / 2, weaponWidth, weaponHeight);
    }
    ctx.restore();
  }
}

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
    if (distance > 1) { this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed; }
  }
  takeDamage(amount) { this.health -= amount; return this.health <= 0; }
}

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
    if (Math.abs(dy) > Math.abs(dx)) { this.direction = dy > 0 ? 'down' : 'up'; }
    else { this.direction = dx > 0 ? 'right' : 'left'; }
    if (distance > 1) { this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed; }
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

export class FinalBoss extends Enemy {
  constructor(x, y, width, height, speed, sprite, health, damage) {
    super(x, y, width, height, speed, sprite, health, damage);
    this.maxHealth = health;
    this.state = 'idle';
    this.stateTimer = 0;
    this.lastAttackTime = Date.now();
  }

  update(player) {
    this.stateTimer -= 1000 / 60;

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
}

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
    super(x, y, width, height, sprite, vx, vy);
    this.damage = damage;
  }
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
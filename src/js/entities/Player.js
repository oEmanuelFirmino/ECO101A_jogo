import { images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER } from '../config/index.js';
import { Character } from './Character.js';
import { gameState } from '../utils/index.js';
import { Projectile } from './Projectile.js';

/**
 * Desenha o personagem na tela.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
export class Player extends Character {
  /**
 * @param {number} x - Posição X inicial do jogador.
 * @param {number} y - Posição Y inicial do jogador.
 * @param {number} width - Largura do jogador.
 * @param {number} height - Altura do jogador.
 * @param {number} speed - Velocidade de movimento.
 * @param {HTMLImageElement} sprite - Sprite inicial do jogador.
 */
  constructor(x, y, width, height, speed, sprite) {
    super(x, y, width, height, speed, sprite);
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.isShielded = false;
    this.shieldTimer = 0;
    this.direction = "down";
  }

  /**
 * Atualiza a posição, estado e ataques do jogador.
 * Considera teclas pressionadas via gameState.
 */
  update() {
    if (gameState.keysPressed["w"]) {
      this.y -= this.speed;
      this.direction = 'up';

    }
    if (gameState.keysPressed["s"]) {
      this.y += this.speed;
      this.direction = 'down';

    }
    if (gameState.keysPressed["a"]) {
      this.x -= this.speed;
      this.direction = 'left';

    }
    if (gameState.keysPressed["d"]) {
      this.x += this.speed;
      this.direction = 'right';

    }

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

  /**
 * Atira um projétil na direção especificada.
 * @param {"up"|"down"|"left"|"right"} direction - Direção do disparo.
 */
  shoot(direction) {
    this.direction = direction;

    let projX, projY, vx = 0, vy = 0;

    const projSpeed = 8;
    const projSize = 10;

    switch (direction) {
      case "up": projX = this.x + this.width / 2 - projSize / 2;
        projY = this.y - projSize;
        vy = -projSpeed;
        break;
      case "down": projX = this.x + this.width / 2 - projSize / 2;
        projY = this.y + this.height;
        vy = projSpeed;
        break;
      case "left": projX = this.x - projSize;
        projY = this.y + this.height / 2 - projSize / 2;
        vx = -projSpeed;
        break;
      case "right": projX = this.x + this.width;
        projY = this.y + this.height / 2 - projSize / 2;
        vx = projSpeed;
        break;
    }
    if (vx !== 0 || vy !== 0) {
      gameState.projectiles.push(new Projectile(projX, projY, projSize, projSize, images.projectile, vx, vy));
      gameState.canShoot = false;

      setTimeout(() => {
        gameState.canShoot = true;
      }, gameState.shootCooldown);
    }
  }

  /**
 * Aplica dano ao jogador.
 * @param {number} amount - Quantidade de dano a ser aplicado.
 */
  takeDamage(amount) {
    if (!this.isShielded) {
      this.health -= amount;
      if (this.health <= 0) {
        this.health = 0;
        gameState.isGameOver = true;
      }
    }
  }

  /**
 * Aplica um efeito temporário ao jogador.
 * @param {"heal"|"speed"|"shield"} effect - Tipo de efeito aplicado.
 */
  applyEffect(effect) {
    if (effect === "heal") this.health = Math.min(this.maxHealth, this.health + 25);
    else if (effect === "speed") {
      this.speed *= 1.5;

      setTimeout(() => {
        this.speed /= 1.5;
      }, 5000);
    }
    else if (effect === "shield") {
      this.isShielded = true;
      this.shieldTimer = 5000;

    }
  }

  /**
 * Desenha o jogador e elementos adicionais como escudo e arma.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
  draw(ctx) {
    let currentSprite;
    switch (this.direction) {
      case 'up': currentSprite = images.player_costas;
        break;
      case 'down': currentSprite = images.player_frente;
        break;
      case 'left': currentSprite = images.player_esquerda;
        break;
      case 'right': currentSprite = images.player_direita;
        break;
      default: currentSprite = images.player_frente;
    }
    ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);
    this.drawWeapon(ctx);
    if (this.isShielded) {
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.max(this.width, this.height) / 2 + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(52, 152, 219, 0.8)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  /**
 * Desenha a arma do jogador rotacionada de acordo com a direção.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
  drawWeapon(ctx) {
    const weaponWidth = 20;
    const weaponHeight = 8;
    const pivotX = this.x + this.width / 2;
    const pivotY = this.y + this.height / 2;
    let rotation = 0;
    switch (this.direction) {
      case 'up': rotation = -Math.PI / 2;
        break;
      case 'down': rotation = Math.PI / 2;
        break;
      case 'left': rotation = Math.PI;
        break;
      case 'right': rotation = 0;
        break;
    }
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(rotation);
    ctx.fillStyle = '#666';
    ctx.fillRect(5, -weaponHeight / 2, weaponWidth, weaponHeight);
    ctx.restore();
  }
}
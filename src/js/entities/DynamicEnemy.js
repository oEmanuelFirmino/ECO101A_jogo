import { Enemy } from './Enemy.js';
import { Player } from './Player.js';

/**
 * Inimigo com sprite dinâmico baseado na direção do movimento.
 * @extends Enemy
 */
export class DynamicEnemy extends Enemy {
  /**
 * @param {number} x - Posição X inicial.
 * @param {number} y - Posição Y inicial.
 * @param {number} width - Largura.
 * @param {number} height - Altura.
 * @param {number} speed - Velocidade.
 * @param {{up: HTMLImageElement, down: HTMLImageElement, left: HTMLImageElement, right: HTMLImageElement}} sprites - Sprites por direção.
 * @param {number} health - Vida inicial.
 */
  constructor(x, y, width, height, speed, sprites, health) {
    super(x, y, width, height, speed, sprites.down, health);
    this.sprites = sprites;
    this.direction = 'down';
  }

  /**
   * Move em direção ao jogador e atualiza o sprite baseado na direção.
   * @param {Player} player - Referência ao jogador.
   */
  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dy) > Math.abs(dx)) {
      this.direction = dy > 0 ? 'down' : 'up';
    } else {
      this.direction = dx > 0 ? 'right' : 'left';
    }

    if (distance > 1) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  /**
 * Desenha o inimigo com o sprite correspondente à direção.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
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
    ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);
  }
}
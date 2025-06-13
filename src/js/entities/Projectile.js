import { Character } from './Character.js';

/**
 * Representa um projétil disparado por jogador ou inimigos.
 * @extends Character
 */
export class Projectile extends Character {
  /**
 * @param {number} x - Posição X inicial.
 * @param {number} y - Posição Y inicial.
 * @param {number} width - Largura.
 * @param {number} height - Altura.
 * @param {HTMLImageElement} sprite - Sprite do projétil.
 * @param {number} vx - Velocidade no eixo X.
 * @param {number} vy - Velocidade no eixo Y.
 */
  constructor(x, y, width, height, sprite, vx, vy) {
    super(x, y, width, height, 0, sprite);
    this.vx = vx;
    this.vy = vy;
  }

  /**
 * Atualiza a posição do projétil com base em sua velocidade.
 */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

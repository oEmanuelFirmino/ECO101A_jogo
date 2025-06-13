import { Character } from './Character.js';
import { Player } from './Player.js';

/**
 * Representa um inimigo básico que persegue o jogador.
 * @extends Character
 */
export class Enemy extends Character {
  /**
 * @param {number} x - Posição X inicial.
 * @param {number} y - Posição Y inicial.
 * @param {number} width - Largura do inimigo.
 * @param {number} height - Altura do inimigo.
 * @param {number} speed - Velocidade de movimento.
 * @param {HTMLImageElement} sprite - Sprite do inimigo.
 * @param {number} health - Vida inicial.
 */
  constructor(x, y, width, height, speed, sprite, health) {
    super(x, y, width, height, speed, sprite);
    this.health = health;
  }

  /**
   * Atualiza a posição do inimigo em direção ao jogador.
   * @param {Player} player - Referência ao jogador.
   */
  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      this.x += (dx / distance) * this.speed; this.y += (dy / distance) * this.speed;
    }
  }

  /**
 * Aplica dano ao inimigo.
 * @param {number} amount - Quantidade de dano.
 * @returns {boolean} - Retorna `true` se o inimigo morrer.
 */
  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }
}
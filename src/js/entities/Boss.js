import { MAP_WIDTH } from '../config/index.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';

/**
 * Inimigo do tipo chefe com comportamento de patrulha horizontal.
 * @extends Enemy
 */
export class Boss extends Enemy {
  /**
 * @param {number} x - Posição X inicial.
 * @param {number} y - Posição Y inicial.
 * @param {number} width - Largura.
 * @param {number} height - Altura.
 * @param {number} speed - Velocidade.
 * @param {HTMLImageElement} sprite - Sprite.
 * @param {number} health - Vida máxima.
 */
  constructor(x, y, width, height, speed, sprite, health) {
    super(x, y, width, height, speed, sprite, health);
    this.maxHealth = health;
    this.direction = 1;
  }

  /**
 * Move horizontalmente dentro dos limites do mapa.
 * @param {Player} player - Não utilizado, mas mantido por polimorfismo.
 */
  update(_player) {
    this.x += this.speed * this.direction;
    if (this.x <= 0 || this.x >= MAP_WIDTH - this.width) {
      this.direction *= -1;
    }
  }
}

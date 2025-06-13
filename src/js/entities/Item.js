import { Character } from './Character.js';

/**
 * Representa um item coletável com efeito ao jogador.
 * @extends Character
 */
export class Item extends Character {
  /**
 * @param {number} x - Posição X.
 * @param {number} y - Posição Y.
 * @param {number} width - Largura.
 * @param {number} height - Altura.
 * @param {HTMLImageElement} sprite - Imagem do item.
 * @param {"heal"|"speed"|"shield"} effect - Efeito aplicado ao coletar.
 */
  constructor(x, y, width, height, sprite, effect) {
    super(x, y, width, height, 0, sprite);
    this.effect = effect;
  }
}
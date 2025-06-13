export class Character {
  /**
 * @param {number} x - Posição horizontal do personagem.
 * @param {number} y - Posição vertical do personagem.
 * @param {number} width - Largura do personagem.
 * @param {number} height - Altura do personagem.
 * @param {number} speed - Velocidade de movimento.
 * @param {HTMLImageElement} sprite - Sprite do personagem.
 */
  constructor(x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.sprite = sprite;
  }

  /**
 * Desenha o personagem na tela.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
  draw(ctx) { ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height); }
}
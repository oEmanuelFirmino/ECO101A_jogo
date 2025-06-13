import { Character } from "./Character.js";

/**
 * Portal de transição entre áreas do mapa, com rotação animada.
 * @extends Character
 */
export class Portal extends Character {
  /**
 * @param {number} x - Posição X.
 * @param {number} y - Posição Y.
 * @param {number} radius - Raio do portal.
 * @param {HTMLImageElement} sprite - Sprite do portal.
 */
  constructor(x, y, radius, sprite) {
    super(x, y, radius * 2, radius * 2, 0, sprite);
    this.radius = radius;
    this.angle = 0;
  }

  /**
 * Atualiza o ângulo de rotação do portal.
 */
  update() {
    this.angle += 0.02;
  }

  /**
 * Desenha o portal com efeito de rotação e gradiente.
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
 */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.radius, this.y + this.radius);
    ctx.rotate(this.angle);

    const gradient = ctx.createRadialGradient(0, 0, this.radius / 3, 0, 0, this.radius);

    gradient.addColorStop(0, "rgba(142, 68, 173, 0.2)");
    gradient.addColorStop(0.5, "rgba(155, 89, 182, 0.8)");
    gradient.addColorStop(1, "rgba(142, 68, 173, 0.2)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
/**
 * Verifica se dois retângulos estão colidindo no espaço 2D.
 *
 * @param {{x: number, y: number, width: number, height: number}} rect1 - Primeiro retângulo.
 * @param {{x: number, y: number, width: number, height: number}} rect2 - Segundo retângulo.
 * @returns {boolean} `true` se houver colisão, senão `false`.
 */
export function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
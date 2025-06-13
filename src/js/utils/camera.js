import { gameState } from './gameState.js';
import { MAP_WIDTH, MAP_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config/index.js';

/**
 * Atualiza a posição da câmera para manter o jogador centralizado no viewport.
 * A câmera é limitada pelas bordas do mapa.
 */
export function updateCamera() {
  const cam = gameState.camera;
  const player = gameState.player;

  cam.x = player.x - VIEWPORT_WIDTH / 2;
  cam.y = player.y - VIEWPORT_HEIGHT / 2;

  cam.x = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, cam.x));
  cam.y = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, cam.y));
}

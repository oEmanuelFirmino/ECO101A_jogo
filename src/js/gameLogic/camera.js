import { gameState } from '../gameState/gameState.js';
import { MAP_WIDTH, MAP_HEIGHT, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../config.js';



export function updateCamera() {
  if (!gameState || !gameState.player) return;

  const cam = gameState.camera;
  const player = gameState.player;

  cam.x = player.x - VIEWPORT_WIDTH / 2;
  cam.y = player.y - VIEWPORT_HEIGHT / 2;
  cam.x = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, cam.x));
  cam.y = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, cam.y));

  if (isNaN(cam.x)) cam.x = 0;
  if (isNaN(cam.y)) cam.y = 0;
}
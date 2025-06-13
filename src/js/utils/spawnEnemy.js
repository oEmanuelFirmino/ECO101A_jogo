import { gameState } from "./gameState.js";
import { Enemy, Boss, DynamicEnemy } from "../entities/index.js";
import { images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, phaseConfigs } from "../config/index.js";

/**
 * Gera um inimigo de acordo com a fase atual e adiciona ao `gameState`.
 * A posição é aleatória fora da tela para efeito de spawn dinâmico.
 */
export function spawnEnemy() {
  const config = phaseConfigs[gameState.phase];
  const enemyTypeKey = config.enemyTypes[Math.floor(Math.random() * config.enemyTypes.length)];
  let x, y;
  const side = Math.floor(Math.random() * 4);
  if (side === 0) { x = Math.random() * MAP_WIDTH; y = -50; }
  else if (side === 1) { x = MAP_WIDTH; y = Math.random() * MAP_HEIGHT; }
  else if (side === 2) { x = Math.random() * MAP_WIDTH; y = MAP_HEIGHT; }
  else { x = -50; y = Math.random() * MAP_HEIGHT; }

  switch (enemyTypeKey) {
    case "fast":
      gameState.enemies.push(new Enemy(x, y, 35, 35, 2.5, images.fastEnemy, 20));
      break;
    case "tank":
      gameState.enemies.push(new DynamicEnemy(
        x, y, 50, 50, 1,
        {
          up: images.golem_costas,
          down: images.golem_frente,
          left: images.golem_esquerda,
          right: images.golem_direita
        },
        80
      ));
      break;
    case "boss":
      gameState.enemies.push(new Boss(
        MAP_WIDTH / 2 - 50,
        PLAYABLE_AREA_BORDER + 50,
        100, 100, 2,
        images.bossEnemy,
        1000
      ));
      break;
    default:
      gameState.enemies.push(new Enemy(x, y, 40, 40, 1.5, images.enemy, 40));
      break;
  }
}

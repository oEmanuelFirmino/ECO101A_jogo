import { gameState } from '../gameState/gameState.js';
import { phaseConfigs, images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER } from '../config.js';
import { Item } from '../entities/phaseAddons.entity.js';
import { Enemy } from '../entities/enemy.entity.js';
import { DynamicEnemy } from "../entities/dynamicEnemy.entity.js";
import { FinalBoss } from "../entities/finalBoss.entity.js"


export function spawnEnemy(type = null) {
  const config = phaseConfigs[gameState.phase];
  if (!config || !config.enemyTypes) return;

  const enemyTypeKey = type || config.enemyTypes[Math.floor(Math.random() * config.enemyTypes.length)];

  let x, y;
  const side = Math.floor(Math.random() * 4);

  if (side === 0) {
    x = Math.random() * MAP_WIDTH; y = -50;
  } else if (side === 1) {
    x = MAP_WIDTH; y = Math.random() * MAP_HEIGHT;
  } else if (side === 2) {
    x = Math.random() * MAP_WIDTH; y = MAP_HEIGHT;
  } else {
    x = -50; y = Math.random() * MAP_HEIGHT;
  }

  switch (enemyTypeKey) {
    case "fast":
      gameState.enemies.push(
        new Enemy(x, y, 50, 50, 2.5, images.fastEnemy, 20, 50)
      );
      break;
    case "golem":
      gameState.enemies.push(
        new DynamicEnemy(x, y, 75, 75, 1.5, {
          up: images.golem_costas,
          down: images.golem_frente,
          left: images.golem_esquerda,
          right: images.golem_direita
        }, 80, 75)
      );
      break;
    case "tank":
      gameState.enemies.push(
        new DynamicEnemy(x, y, 100, 100, 0.75, {
          up: images.tank_costas,
          down: images.tank_frente,
          left: images.tank_esquerda,
          right: images.tank_direita
        }, 110, 15)
      );
      break;
    case "vulcon":
      gameState.enemies.push(
        new DynamicEnemy(x, y, 100, 100, 0.75,
          {
            up: images.vulcon_costas,
            down: images.vulcon_frente,
            left: images.vulcon_esquerda,
            right: images.vulcon_direita
          }, 110, 15)
      );
      break;
    case "larva":
      gameState.enemies.push(
        new DynamicEnemy(x, y, 65, 65, 1.5, {
          up: images.larva_costas,
          down: images.larva_frente,
          left: images.larva_esquerda,
          right: images.larva_direita
        }, 40, 25)
      );
      break;
    case "final_boss":
      const bossX = MAP_WIDTH / 2 - 60;
      const bossY = PLAYABLE_AREA_BORDER + 100;
      const bossSprites = {
        up: images.boss_costas,
        down: images.finalBoss,
        left: images.boss_esquerda,
        right: images.boss_direita,
      };
      gameState.enemies.push(
        new FinalBoss(bossX, bossY, 180, 180, 1, bossSprites, 2500, 100)
      );
      break;
    default:
      gameState.enemies.push(
        new DynamicEnemy(x, y, 55, 55, 1.5, {
          up: images.normal_costas,
          down: images.normal_frente,
          left: images.normal_esquerda,
          right: images.normal_direita
        }, 40, 25)
      );
      break;
  }
}

export function spawnItem() {
  const x = Math.random() * (MAP_WIDTH - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
  const y = Math.random() * (MAP_HEIGHT - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
  const types = [
    { sprite: images.itemHealth, effect: "heal" },
    { sprite: images.itemSpeed, effect: "speed" },
    { sprite: images.itemShield, effect: "shield" },
    { sprite: images.itemFireRate, effect: "firerate" }
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  if (type && type.sprite) {
    gameState.items.push(new Item(x, y, 30, 30, type.sprite, type.effect));
  }
}
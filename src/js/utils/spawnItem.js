import { gameState } from "./gameState.js";
import { Item } from "../entities/index.js";
import { images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER } from "../config/index.js";

/**
 * Gera um item aleatório com efeito (cura, velocidade ou escudo) e o adiciona ao `gameState`.
 */
export function spawnItem() {
  const x = Math.random() * (MAP_WIDTH - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
  const y = Math.random() * (MAP_HEIGHT - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;

  const types = [
    { sprite: images.itemHealth, effect: "heal" },
    { sprite: images.itemSpeed, effect: "speed" },
    { sprite: images.itemShield, effect: "shield" },
  ];

  const { sprite, effect } = types[Math.floor(Math.random() * types.length)];
  gameState.items.push(new Item(x, y, 30, 30, sprite, effect));
}
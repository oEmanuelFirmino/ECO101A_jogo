

export const canvas = document.getElementById("gameCanvas");


export const VIEWPORT_WIDTH = 600;
export const VIEWPORT_HEIGHT = 570;


canvas.width = VIEWPORT_WIDTH;
canvas.height = VIEWPORT_HEIGHT;

export const ctx = canvas.getContext("2d");

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 1000;
export const PLAYABLE_AREA_BORDER = 100;

export const assetSources = {
  projectile: "./images/bullet.png",
  enemyProjectile: "./images/enemy_projectile.png",
  enemy: "./images/normal_enemy.png",
  fastEnemy: "./images/bat1.png",
  tank_frente: "./images/tank_frente.png",
  tank_costas: "./images/tank_costas.png",
  tank_esquerda: "./images/tank_esquerda.png",
  tank_direita: "./images/tank_direita.png",
  vulcon_frente: "./images/vulcon_frente.png",
  vulcon_costas: "./images/vulcon_costas.png",
  vulcon_direita: "./images/vulcon_direita.png",
  vulcon_esquerda: "./images/vulcon_esquerda.png",
  larva_frente: "./images/larva_frente.png",
  larva_costas: "./images/larva_costas.png",
  larva_direita: "./images/larva_direita.png",
  larva_esquerda: "./images/larva_esquerda.png",
  normal_frente: "./images/normal_frente.png",
  normal_costas: "./images/normal_costas.png",
  normal_esquerda: "./images/normal_esquerda.png",
  normal_direita: "./images/normal_direita.png",
  finalBoss: "./images/boss_frente.png",
  boss_costas: "./images/boss_tras.png",
  boss_esquerda: "./images/boss_esquerda.png",
  boss_direita: "./images/boss_direita.png",
  itemHealth: "./images/saude.png",
  itemSpeed: "./images/speed.png",
  itemShield: "./images/shield.png",
  itemFireRate: "./images/gun.png",
  powerupWeapon: "./images/gun.png",
  background1: "./images/forest.png",
  background2: "./images/desert.png",
  background3: "./images/cave.png",
  background4: "./images/vulcan.png",
  background5: "./images/temple.png",
  golem_frente: "./images/golem_frente.png",
  golem_costas: "./images/golem_costas.png",
  golem_direita: "./images/golem_direita.png",
  golem_esquerda: "./images/golem_esquerda.png",
  player_frente: "./images/player_frente.png",
  player_costas: "./images/player_costas.png",
  player_direita: "./images/player_direita.png",
  player_esquerda: "./images/player_esquerda.png",
};

export const images = {};

export const phaseConfigs = [
  {
    objectiveType: "survive",
    duration: 40,
    objectiveText: "Sobreviva por 40 segundos!",
    maxEnemies: 5,
    spawnInterval: 3000,
    enemyTypes: ["normal", "fast"],
  },
  {
    objectiveType: "defeat",
    killTarget: 15,
    objectiveText: "Derrote 15 inimigos!",
    maxEnemies: 7,
    spawnInterval: 2500,
    enemyTypes: ["normal", "fast"],
  },
  {
    objectiveType: "survive",
    duration: 30,
    objectiveText: "Sobreviva na caverna escura!",
    maxEnemies: 10,
    spawnInterval: 2500,
    enemyTypes: ["fast", "normal", "tank", "golem"],
    hasFog: true,
  },
  {
    objectiveType: "survive",
    duration: 35,
    objectiveText: "Sobreviva ao calor infernal!",
    maxEnemies: 15,
    spawnInterval: 2000,
    enemyTypes: ["fast", "normal", "vulcon", "larva"],
  },
  {
    objectiveType: "defeat_boss",
    objectiveText: "Derrote o Guardião Ancestral!",
    enemyTypes: ["final_boss"],
  },
];
export function linkPhaseBackgrounds() {
  if (images.background1) phaseConfigs[0].bg = images.background1;
  if (images.background2) phaseConfigs[1].bg = images.background2;
  if (images.background3) phaseConfigs[2].bg = images.background3;
  if (images.background4) phaseConfigs[3].bg = images.background4;
  if (images.background5) phaseConfigs[4].bg = images.background5;
}
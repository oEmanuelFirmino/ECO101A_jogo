

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
  pistol: './images/pistol.png',
  gun: "./images/gun.png",
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
  player_frente: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='12' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='22' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3C/svg%3E",
  player_costas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='12' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='22' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='10' y='10' width='20' height='15' fill='%233498db'/%3E%3C/svg%3E",
  player_direita: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='13' y='50' width='14' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='25' y='25' width='10' height='6' fill='%232980b9'/%3E%3C/svg%3E",
  player_esquerda: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='13' y='50' width='14' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='5' y='25' width='10' height='6' fill='%232980b9'/%3E%3C/svg%3E",
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
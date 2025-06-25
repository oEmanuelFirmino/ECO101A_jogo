

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
  enemyProjectile: "https://placehold.co/15x15/ff4136/FFFFFF?text=",
  enemy: "https://placehold.co/40x40/e74c3c/FFFFFF?text=E",
  fastEnemy: "./images/bat1.png",
  tankEnemy: "https://placehold.co/50x50/7f8c8d/FFFFFF?text=T",
  finalBoss: "https://placehold.co/120x120/4B0082/FFFFFF?text=GUARDIAN",
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
  golem_frente: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M8 15 L42 15 L45 25 L45 45 L5 45 L5 25 Z' fill='%236c757d'/%3E%3Cpath d='M10 17 L40 17 L42 25 L42 43 L8 43 L8 25 Z' fill='%23adb5bd'/%3E%3Crect x='18' y='12' width='14' height='8' fill='%23495057'/%3E%3Crect x='21' y='14' width='3' height='3' fill='%23ffc107'/%3E%3Crect x='26' y='14' width='3' height='3' fill='%23ffc107'/%3E%3Cpath d='M-5 20 L8 20 L8 35 L-5 35 Q-8 27 -5 20 Z' fill='%236c757d'/%3E%3Cpath d='M55 20 L42 20 L42 35 L55 35 Q58 27 55 20 Z' fill='%236c757d'/%3E%3C/svg%3E",
  golem_costas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M8 15 L42 15 L45 25 L45 45 L5 45 L5 25 Z' fill='%236c757d'/%3E%3Cpath d='M10 17 L40 17 L42 25 L42 43 L8 43 L8 25 Z' fill='%23adb5bd'/%3E%3Cpath d='M-5 20 L8 20 L8 35 L-5 35 Q-8 27 -5 20 Z' fill='%236c757d'/%3E%3Cpath d='M55 20 L42 20 L42 35 L55 35 Q58 27 55 20 Z' fill='%236c757d'/%3E%3Cpath d='M15 17 L22 10 L28 10 L35 17 Z' fill='%235a6168'/%3E%3C/svg%3E",
  golem_direita: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M5 15 L40 15 L40 45 L5 45 Z' fill='%236c757d'/%3E%3Cpath d='M7 17 L38 17 L38 43 L7 43 Z' fill='%23adb5bd'/%3E%3Cpath d='M35 20 L50 20 Q55 30 50 40 L35 40 Z' fill='%236c757d'/%3E%3Cpath d='M37 22 L48 22 Q52 30 48 38 L37 38 Z' fill='%235a6168'/%3E%3Crect x='30' y='12' width='8' height='8' fill='%23495057'/%3E%3C/svg%3E",
  golem_esquerda: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M10 15 L45 15 L45 45 L10 45 Z' fill='%236c757d'/%3E%3Cpath d='M12 17 L43 17 L43 43 L12 43 Z' fill='%23adb5bd'/%3E%3Cpath d='M15 20 L0 20 Q-5 30 0 40 L15 40 Z' fill='%236c757d'/%3E%3Cpath d='M13 22 L2 22 Q-2 30 2 38 L13 38 Z' fill='%235a6168'/%3E%3Crect x='12' y='12' width='8' height='8' fill='%23495057'/%3E%3C/svg%3E",
  player_frente: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='12' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='22' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3C/svg%3E",
  player_costas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='12' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='22' y='50' width='6' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='10' y='10' width='20' height='15' fill='%233498db'/%3E%3C/svg%3E",
  player_direita: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='13' y='50' width='14' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='25' y='25' width='10' height='6' fill='%232980b9'/%3E%3C/svg%3E",
  player_esquerda: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 60'%3E%3Crect x='10' y='20' width='20' height='30' fill='%233498db'/%3E%3Crect x='13' y='50' width='14' height='10' fill='%232c3e50'/%3E%3Crect x='15' y='10' width='10' height='10' fill='%23f1c40f'/%3E%3Crect x='5' y='25' width='10' height='6' fill='%232980b9'/%3E%3C/svg%3E",
};

export const images = {};

export const phaseConfigs = [
  { objectiveType: "survive", duration: 40, objectiveText: "Sobreviva por 40 segundos!", maxEnemies: 5, spawnInterval: 3000, enemyTypes: ["normal", "fast"], },
  { objectiveType: "defeat", killTarget: 15, objectiveText: "Derrote 15 inimigos!", maxEnemies: 7, spawnInterval: 2500, enemyTypes: ["normal", "fast"], },
  {
    objectiveType: "survive",
    duration: 30,
    objectiveText: "Sobreviva na caverna escura!",
    maxEnemies: 10,
    spawnInterval: 2500,
    enemyTypes: ["fast", "tank"],
    hasFog: true,
  },
  {
    objectiveType: "survive",
    duration: 35,
    objectiveText: "Sobreviva ao calor infernal!",
    maxEnemies: 15,
    spawnInterval: 2000,
    enemyTypes: ["fast", "tank"],
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
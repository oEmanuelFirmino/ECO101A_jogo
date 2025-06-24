// src/js/gameState.js

let gameState = {
  player: null,
  enemies: [],
  projectiles: [],
  enemyProjectiles: [],
  items: [],
  portal: null,
  camera: { x: 0, y: 0 },
  keysPressed: {},
  phase: 0,
  score: 0,
  isGameOver: false,
  isPaused: false,
  canShoot: true,
  shootCooldown: 500,
  itemSpawnInterval: 10000,
  phaseStartTime: 0,
  lastEnemySpawnTime: 0,
  lastItemSpawnTime: 0,
  isFireRateActive: false,
  isPlayerInvincible: false,
  lavaPools: [],
};

export { gameState };

export function resetGameState() {
  Object.assign(gameState, {
    player: null,
    enemies: [],
    projectiles: [],
    enemyProjectiles: [],
    items: [],
    portal: null,
    camera: { x: 0, y: 0 },
    keysPressed: {},
    phase: 0,
    score: 0,
    isGameOver: false,
    isPaused: false,
    canShoot: true,
    isFireRateActive: false,
    isPlayerInvincible: false,
    lavaPools: [],
  });
}
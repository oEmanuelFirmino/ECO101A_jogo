// src/js/gameState.js

// Estado inicial do jogo
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
  canShoot: true,
  shootCooldown: 500,
  itemSpawnInterval: 10000,
  phaseStartTime: 0,
  lastEnemySpawnTime: 0,
  lastItemSpawnTime: 0,
  isFireRateActive: false,
  isPlayerInvincible: false,
};

// Exporta o estado para que possa ser modificado por outros módulos
export { gameState };

// Função para resetar o estado para um novo jogo
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
    canShoot: true,
    isFireRateActive: false,
    isPlayerInvincible: false,
  });
}

// NOVO: Linha para permitir a inspeção do gameState no console durante a depuração
window.gameState = gameState;
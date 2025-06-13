export let gameState;

export function resetGameState() {
  gameState = {
    player: null,
    enemies: [],
    items: [],
    projectiles: [],
    keysPressed: {},
    phase: 0,
    score: 0,
    isGameOver: false,
    phaseStartTime: 0,
    portal: null,
    lastEnemySpawnTime: 0,
    lastItemSpawnTime: 0,
    itemSpawnInterval: 10000,
    canShoot: true,
    shootCooldown: 300,
    camera: { x: 0, y: 0 },
  };
}
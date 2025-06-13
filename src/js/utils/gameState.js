/**
 * Estado global do jogo. Inicializado por `resetGameState`.
 * 
 * @typedef {Object} GameState
 * @property {Object|null} player - Instância do jogador (objeto da classe Player).
 * @property {Object[]} enemies - Lista de inimigos ativos na fase.
 * @property {Object[]} items - Itens disponíveis no cenário.
 * @property {Object[]} projectiles - Projéteis ativos disparados pelo jogador.
 * @property {Object} keysPressed - Mapa de teclas pressionadas no momento.
 * @property {number} phase - Índice da fase atual.
 * @property {number} score - Pontuação atual do jogador.
 * @property {boolean} isGameOver - Indica se o jogo terminou.
 * @property {number} phaseStartTime - Timestamp de início da fase.
 * @property {Object|null} portal - Instância do portal da fase, se houver.
 * @property {number} lastEnemySpawnTime - Timestamp do último spawn de inimigo.
 * @property {number} lastItemSpawnTime - Timestamp do último spawn de item.
 * @property {number} itemSpawnInterval - Intervalo entre spawns de itens (em ms).
 * @property {boolean} canShoot - Define se o jogador pode atirar no momento.
 * @property {number} shootCooldown - Intervalo entre tiros (em ms).
 * @property {{x: number, y: number}} camera - Posição da câmera virtual no cenário.
 */

/**
 * Estado global do jogo, exportado e inicializado por `resetGameState()`.
 * @type {GameState}
 */
export let gameState;

/**
 * Reinicializa o estado global do jogo para os valores padrão.
 * 
 * Esta função deve ser chamada no início de cada nova partida ou fase,
 * garantindo que o `gameState` comece limpo e consistente.
 */
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

/**
 * Referência ao elemento canvas HTML usado para renderização do jogo.
 * @type {HTMLCanvasElement}
 */
export const canvas = document.getElementById("gameCanvas");

/**
 * Contexto 2D do canvas, usado para todas as operações gráficas.
 * @type {CanvasRenderingContext2D}
 */
export const ctx = canvas.getContext("2d");

/**
 * Largura visível da viewport do jogo, em pixels.
 * @type {number}
 */
export const VIEWPORT_WIDTH = canvas.width;

/**
 * Altura visível da viewport do jogo, em pixels.
 * @type {number}
 */
export const VIEWPORT_HEIGHT = canvas.height;

/**
 * Largura total do mapa do jogo (área jogável), em pixels.
 * @type {number}
 */
export const MAP_WIDTH = 1000;

/**
 * Altura total do mapa do jogo (área jogável), em pixels.
 * @type {number}
 */
export const MAP_HEIGHT = 1000;

/**
 * Borda de segurança entre o jogador e o fim da área jogável.
 * @type {number}
 */
export const PLAYABLE_AREA_BORDER = 100;

/**
 * Fontes dos ativos visuais do jogo, organizadas por entidade e orientação.
 * Pode incluir imagens inline SVG, URLs externas ou caminhos locais.
 * @type {Object.<string, string>}
 */
export const assetSources = {
  golem_frente: "data:image/svg+xml,...",
  golem_costas: "data:image/svg+xml,...",
  golem_direita: "data:image/svg+xml,...",
  golem_esquerda: "data:image/svg+xml,...",
  player_frente: "data:image/svg+xml,...",
  player_costas: "data:image/svg+xml,...",
  player_direita: "data:image/svg+xml,...",
  player_esquerda: "data:image/svg+xml,...",
  projectile: "https://placehold.co/10x10/f1c40f/FFFFFF?text=",
  enemy: "https://placehold.co/40x40/e74c3c/FFFFFF?text=E",
  fastEnemy: "../../images/bat1.png",
  tankEnemy: "https://placehold.co/50x50/7f8c8d/FFFFFF?text=T",
  bossEnemy: "https://placehold.co/100x100/8e44ad/FFFFFF?text=BOSS",
  itemHealth: "../../images/saude.png",
  itemSpeed: "../../images/speed.png",
  itemShield: "../../images/shield.png",
  background1: "../../images/forest.png",
  background2: "../../images/desert.png",
  background3: "https://placehold.co/800x600/4E4E4E/FFFFFF?text=Caverna",
  background4: "https://placehold.co/800x600/A52A2A/FFFFFF?text=Vulcao",
  background5: "https://placehold.co/800x600/4B0082/FFFFFF?text=Castelo",
};

/**
 * Armazena objetos `Image` carregados a partir das `assetSources`.
 * Usado para pré-carregamento e renderização eficiente.
 * @type {Object.<string, HTMLImageElement>}
 */
export const images = {};

/**
 * Configurações das fases do jogo, definindo objetivos, duração, fundo e inimigos.
 * Cada fase pode ter diferentes tipos de objetivos como sobrevivência, derrota ou alcance de portal.
 * @type {Array<{
 *   objectiveType: string,
 *   objectiveText: string,
 *   duration?: number,
 *   killTarget?: number,
 *   bg: HTMLImageElement,
 *   maxEnemies: number,
 *   spawnInterval: number,
 *   enemyTypes: string[]
 * }>}
 */
export const phaseConfigs = [
  {
    objectiveType: "survive",
    duration: 40,
    objectiveText: "Sobreviva por 40 segundos!",
    bg: images.background1,
    maxEnemies: 5,
    spawnInterval: 3000,
    enemyTypes: ["normal"],
  },
  {
    objectiveType: "defeat",
    killTarget: 15,
    objectiveText: "Derrote 15 inimigos!",
    bg: images.background2,
    maxEnemies: 7,
    spawnInterval: 2500,
    enemyTypes: ["normal", "fast"],
  },
  {
    objectiveType: "reach_portal",
    objectiveText: "Alcance o portal!",
    bg: images.background3,
    maxEnemies: 8,
    spawnInterval: 2800,
    enemyTypes: ["normal", "tank"],
  },
  {
    objectiveType: "survive",
    duration: 60,
    objectiveText: "Sobreviva por 60 segundos!",
    bg: images.background4,
    maxEnemies: 12,
    spawnInterval: 1500,
    enemyTypes: ["fast", "tank"],
  },
  {
    objectiveType: "defeat_boss",
    objectiveText: "Derrote o Chefe Final!",
    bg: images.background5,
    maxEnemies: 1,
    spawnInterval: 99999,
    enemyTypes: ["boss"],
  },
];

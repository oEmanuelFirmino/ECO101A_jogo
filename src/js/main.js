import {
  ctx,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYABLE_AREA_BORDER,
  assetSources,
  images,
  phaseConfigs
} from './config/index.js';
import { Player } from './entities/index.js';
import {
  drawHUD,
  showEndScreen,
  isColliding,
  spawnEnemy,
  spawnItem,
  setupPhase,
  checkPhaseCompletion,
  updateCamera,
  gameState,
  resetGameState
} from './utils/index.js';

/**
 * Atualiza o estado do jogo para o frame atual:
 * - Movimento e ações do jogador
 * - Inimigos, itens e projéteis
 * - Checagem de colisões e conclusão de fase
 */
function update() {
  if (gameState.isGameOver) return;

  const now = Date.now();
  gameState.player.update();
  updateCamera();

  const config = phaseConfigs[gameState.phase];

  // Spawn de inimigos
  if (now - gameState.lastEnemySpawnTime > config.spawnInterval &&
    gameState.enemies.length < config.maxEnemies) {
    spawnEnemy();
    gameState.lastEnemySpawnTime = now;
  }

  // Spawn de itens
  if (now - gameState.lastItemSpawnTime > gameState.itemSpawnInterval &&
    gameState.items.length < 3) {
    spawnItem();
    gameState.lastItemSpawnTime = now;
  }

  // Atualiza projéteis e remove os que saíram da tela
  gameState.projectiles.forEach((p, i) => {
    p.update();
    if (p.y + p.height < 0 || p.y > MAP_HEIGHT || p.x + p.width < 0 || p.x > MAP_WIDTH) {
      gameState.projectiles.splice(i, 1);
    }
  });

  // Atualiza inimigos, checa colisões com projéteis e jogador
  gameState.enemies.forEach((enemy, eIndex) => {
    enemy.update(gameState.player);

    if (isColliding(gameState.player, enemy)) {
      gameState.player.takeDamage(20);
    }

    gameState.projectiles.forEach((proj, pIndex) => {
      if (isColliding(proj, enemy)) {
        gameState.projectiles.splice(pIndex, 1);
        if (enemy.takeDamage(20)) {
          gameState.enemies.splice(eIndex, 1);
          if (config.objectiveType === "defeat") {
            gameState.score++;
          }
        }
      }
    });
  });

  // Atualiza coleta de itens
  gameState.items.forEach((item, i) => {
    if (isColliding(gameState.player, item)) {
      gameState.player.applyEffect(item.effect);
      gameState.items.splice(i, 1);
    }
  });

  // Atualiza portal (caso presente)
  if (gameState.portal) gameState.portal.update();

  checkPhaseCompletion();
}

/**
 * Renderiza a cena do jogo: fundo, jogador, inimigos, itens e projéteis.
 */
function draw() {
  const config = phaseConfigs[gameState.phase];

  ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  if (config.bg?.src) {
    ctx.drawImage(config.bg, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  }

  if (gameState.portal) gameState.portal.draw(ctx);
  gameState.player.draw(ctx);
  gameState.items.forEach((item) => item.draw(ctx));
  gameState.enemies.forEach((enemy) => enemy.draw(ctx));
  gameState.projectiles.forEach((p) => p.draw(ctx));

  ctx.restore();
}

/**
 * Loop principal do jogo. Chama `update()` e `draw()` em cada frame.
 * Usa `requestAnimationFrame` para otimização do navegador.
 */
function gameLoop() {
  if (gameState.isGameOver) {
    if (document.getElementById("message-screen").classList.contains("hidden")) {
      showEndScreen(false);
    }
    return;
  }

  update();
  draw();
  drawHUD();
  requestAnimationFrame(gameLoop);
}

/**
 * Inicializa o jogo:
 * - Reseta o estado
 * - Esconde tela de fim
 * - Cria jogador
 * - Inicia primeira fase
 * - Inicia loop principal
 */
function init() {
  resetGameState();
  document.getElementById("message-screen").classList.add("hidden");

  gameState.player = new Player(
    MAP_WIDTH / 2 - 20,
    MAP_HEIGHT - PLAYABLE_AREA_BORDER - 80,
    40, 60,
    4,
    images.player_frente
  );

  setupPhase(0);
  gameLoop();
}

/**
 * Carrega todos os assets de imagem antes de iniciar o jogo.
 * Atualiza imagens de fundo da fase conforme são carregadas.
 */
function loadAssets() {
  let loaded = 0;
  const total = Object.keys(assetSources).length;

  for (let key in assetSources) {
    images[key] = new Image();
    images[key].src = assetSources[key];

    images[key].onload = () => {
      loaded++;

      if (key.startsWith("background")) {
        const phaseIndex = parseInt(key.replace("background", ""), 10) - 1;
        if (phaseConfigs[phaseIndex]) {
          phaseConfigs[phaseIndex].bg = images[key];
        }
      }

      if (loaded === total) {
        init();
      }
    };
  }
}

window.addEventListener("keydown", (e) => {
  if (gameState) gameState.keysPressed[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  if (gameState) gameState.keysPressed[e.key.toLowerCase()] = false;
});

document.getElementById("restart-button").addEventListener("click", init);

loadAssets();

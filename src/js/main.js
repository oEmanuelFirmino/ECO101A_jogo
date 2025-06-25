import { drawHUD, showEndScreen, showNarrativeScreen } from './ui.js';
import { ctx, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, assetSources, images, phaseConfigs } from './config.js';
import { gameState, resetGameState } from './gameState.js';
import { Player } from './entities.js';
import { isColliding, spawnEnemy, spawnItem, setupPhase, checkPhaseCompletion, updateCamera } from './gameLogic.js';
import { linkPhaseBackgrounds } from './config.js';
let lastLavaDamageTime = 0;

const startMenu = document.getElementById("start-menu");
const pauseMenu = document.getElementById("pause-menu");
const hud = document.getElementById("hud");
const gameContainer = document.getElementById("game-container");
const messageScreen = document.getElementById("message-screen");
const pauseButton = document.getElementById("pause-button");
const startButton = document.getElementById("start-button");
const resumeButton = document.getElementById("resume-button");
const restartPauseButton = document.getElementById("restart-pause-button");
const restartEndButton = document.getElementById("restart-button");

function applyPlayerDamage(damageAmount) {
  if (!gameState.player || gameState.isPlayerInvincible) return;
  gameState.player.takeDamage(damageAmount);
  gameState.isPlayerInvincible = true;
  setTimeout(() => { gameState.isPlayerInvincible = false; }, 1000);
}

function update() {
  if (gameState.isGameOver || !gameState.player) return;

  const now = Date.now();
  gameState.player.update();
  updateCamera();
  const config = phaseConfigs[gameState.phase];

  if (config.objectiveType !== "defeat_boss" && config.spawnInterval) {
    if (now - gameState.lastEnemySpawnTime > config.spawnInterval && gameState.enemies.length < config.maxEnemies) {
      spawnEnemy();
      gameState.lastEnemySpawnTime = now;
    }
  }

  if (now - gameState.lastItemSpawnTime > gameState.itemSpawnInterval && gameState.items.length < 3) {
    spawnItem();
    gameState.lastItemSpawnTime = now;
  }

  for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
    const p = gameState.projectiles[i];
    if (!p) continue;
    p.update();
    if (p.y + p.height < 0 || p.y > MAP_HEIGHT || p.x + p.width < 0 || p.x > MAP_WIDTH) {
      gameState.projectiles.splice(i, 1);
    }
  }

  for (let i = gameState.enemyProjectiles.length - 1; i >= 0; i--) {
    const p = gameState.enemyProjectiles[i];
    if (!p) continue;
    p.update();
    if (isColliding(gameState.player, p)) {
      applyPlayerDamage(p.damage);
      gameState.enemyProjectiles.splice(i, 1);
    } else if (p.y + p.height < 0 || p.y > MAP_HEIGHT || p.x + p.width < 0 || p.x > MAP_WIDTH) {
      gameState.enemyProjectiles.splice(i, 1);
    }
  }

  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    if (!enemy) continue;
    enemy.update(gameState.player);
    if (isColliding(gameState.player, enemy)) {
      applyPlayerDamage(enemy.damage);
    }
    for (let j = gameState.projectiles.length - 1; j >= 0; j--) {
      const proj = gameState.projectiles[j];
      if (!proj) continue;
      if (isColliding(proj, enemy)) {
        gameState.projectiles.splice(j, 1);
        if (enemy.takeDamage(20)) {
          gameState.enemies.splice(i, 1);
          if (config.objectiveType === "defeat") {
            gameState.score++;
          }
          break;
        }
      }
    }
  }

  for (let i = gameState.items.length - 1; i >= 0; i--) {
    const item = gameState.items[i];
    if (!item) continue;
    if (isColliding(gameState.player, item)) {
      gameState.player.applyEffect(item.effect);
      gameState.items.splice(i, 1);
    }
  }

  gameState.lavaPools.forEach(pool => pool.update());

  for (const pool of gameState.lavaPools) {
    if (isColliding(gameState.player, pool)) {
      const now = Date.now();

      if (now - lastLavaDamageTime > 700) {
        gameState.player.takeDamage(pool.damage);
        lastLavaDamageTime = now;
      }
      break;
    }
  }

  if (gameState.portal) gameState.portal.update();
  checkPhaseCompletion();
}
function drawVisionLimiter() {
  if (!gameState.player) return;
  const player = gameState.player;
  const playerViewX = player.x - gameState.camera.x + player.width / 2;
  const playerViewY = player.y - gameState.camera.y + player.height / 2;
  const outerRadius = Math.max(VIEWPORT_WIDTH, VIEWPORT_HEIGHT) / 1.5;
  const gradient = ctx.createRadialGradient(playerViewX, playerViewY, 100, playerViewX, playerViewY, outerRadius);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
}

function draw() {
  const config = phaseConfigs[gameState.phase];
  const bgImage = config?.bg;
  ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);
  if (bgImage && bgImage.complete && bgImage.naturalWidth !== 0) {
    ctx.drawImage(bgImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  }
  gameState.lavaPools.forEach((pool) => pool && pool.draw(ctx));
  if (gameState.portal) gameState.portal.draw(ctx);
  if (gameState.player) gameState.player.draw(ctx);
  gameState.items.forEach((item) => item && item.draw(ctx));
  gameState.enemies.forEach((enemy) => enemy && enemy.draw(ctx));
  gameState.projectiles.forEach((p) => p && p.draw(ctx));
  gameState.enemyProjectiles.forEach((p) => p && p.draw(ctx));
  gameState.enemyProjectiles.forEach((p) => p && p.draw(ctx));
  ctx.restore();
  if (config.hasFog && gameState.player) {
    drawVisionLimiter();
  }
}

let isGameLoopRunning = false;
function gameLoop() {
  if (gameState.isGameOver) {
    if (messageScreen.classList.contains("hidden")) { showEndScreen(false); }
    isGameLoopRunning = false;
    return;
  }
  if (!gameState.isPaused) {
    update();
    draw();
    drawHUD();
  }
  requestAnimationFrame(gameLoop);
}

function init() {
  resetGameState();
  messageScreen.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  gameState.player = new Player(MAP_WIDTH / 2, MAP_HEIGHT - PLAYABLE_AREA_BORDER - 60, 40, 60, 4, images.player_frente);
}
function startGame() {
  startMenu.classList.add('hidden');
  hud.classList.remove('hidden');
  gameContainer.classList.remove('hidden');
  playMusicOnFirstInteraction();

  init();

  showNarrativeScreen(
    "A Lenda da Masmorra de Fogo",
    "Reza a lenda que um grande tesouro se esconde nas profundezas de uma masmorra esquecida, no coração de uma montanha de fogo. Muitos tentaram... todos falharam. Você ousa entrar?",
    () => {

      setupPhase(0);
      if (!isGameLoopRunning) {
        isGameLoopRunning = true;
        requestAnimationFrame(gameLoop);
      }
    }
  );
}

function togglePause() {
  if (gameState.isGameOver || gameContainer.classList.contains('hidden')) return;
  gameState.isPaused = !gameState.isPaused;
  if (gameState.isPaused) {
    pauseMenu.classList.remove('hidden');
  } else {
    pauseMenu.classList.add('hidden');
  }
}

function returnToStartMenu() {
  isGameLoopRunning = false;
  hud.classList.add('hidden');
  gameContainer.classList.add('hidden');
  pauseMenu.classList.add('hidden');
  messageScreen.classList.add('hidden');
  startMenu.classList.remove('hidden');
}

function playMusicOnFirstInteraction() {
  const soundtrack = document.getElementById("game-soundtrack");
  if (soundtrack && soundtrack.paused) {
    soundtrack.play().catch(error => { console.error("Falha na reprodução da música:", error); });
  }
}

function loadAssets() {
  let loaded = 0;
  const total = Object.keys(assetSources).length;
  if (total === 0) {
    linkPhaseBackgrounds();
    return;
  }
  for (let key in assetSources) {
    images[key] = new Image();
    images[key].src = assetSources[key];
    images[key].onload = () => {
      loaded++;
      if (loaded === total) {
        console.log("Assets carregados. Jogo pronto para iniciar.");
        linkPhaseBackgrounds();
      }
    };
    images[key].onerror = () => {
      loaded++;
      console.error(`Falha ao carregar o asset: ${key}`);
      if (loaded === total) {
        console.log("Assets carregados com alguns erros.");
        linkPhaseBackgrounds();
      }
    };
  }
}

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
resumeButton.addEventListener("click", togglePause);
restartPauseButton.addEventListener("click", returnToStartMenu);
restartEndButton.addEventListener("click", returnToStartMenu);

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "escape") {
    togglePause();
  }

  if (gameState && gameState.keysPressed && !gameState.isPaused) {
    gameState.keysPressed[key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (gameState && gameState.keysPressed) {
    gameState.keysPressed[e.key.toLowerCase()] = false;
  }
});

loadAssets();

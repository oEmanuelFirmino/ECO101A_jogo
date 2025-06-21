// src/js/main.js

import { ctx, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, assetSources, images, phaseConfigs } from './config.js';
import { gameState, resetGameState } from './gameState.js';
import { Player } from './entities.js';
import { isColliding, spawnEnemy, spawnItem, setupPhase, checkPhaseCompletion, updateCamera } from './gameLogic.js';
import { drawHUD, showEndScreen } from './ui.js';

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
  if (gameState.portal) gameState.portal.update();
  checkPhaseCompletion();
}

function drawVisionLimiter() {
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
  if (gameState.portal) gameState.portal.draw(ctx);
  if (gameState.player) gameState.player.draw(ctx);
  gameState.items.forEach((item) => item && item.draw(ctx));
  gameState.enemies.forEach((enemy) => enemy && enemy.draw(ctx));
  gameState.projectiles.forEach((p) => p && p.draw(ctx));
  gameState.enemyProjectiles.forEach((p) => p && p.draw(ctx));
  ctx.restore();
  if (config.hasFog && gameState.player) {
      drawVisionLimiter();
  }
}

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

function init() {
  resetGameState();
  document.getElementById("message-screen").classList.add("hidden");
  gameState.player = new Player(MAP_WIDTH / 2 - 20, MAP_HEIGHT - PLAYABLE_AREA_BORDER - 80, 40, 60, 4, images.player_frente);
  setupPhase(0);
  gameLoop();
}

function playMusicOnFirstInteraction() {
  const soundtrack = document.getElementById("game-soundtrack");
  const startPlayback = () => {
    if (soundtrack && soundtrack.paused) {
      soundtrack.play().catch(error => { console.error("Falha na reprodução da música:", error); });
    }
    window.removeEventListener("keydown", startPlayback);
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("keydown", startPlayback);
  window.addEventListener("click", startPlayback);
}

function loadAssets() {
  let loaded = 0; 
  const total = Object.keys(assetSources).length;
  if (total === 0) {
      init();
      playMusicOnFirstInteraction();
      return;
  }
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
        playMusicOnFirstInteraction();
      }
    };
    images[key].onerror = () => {
        loaded++;
        console.error(`Falha ao carregar o asset: ${key} com src ${images[key].src}`);
        if (loaded === total) {
            init();
            playMusicOnFirstInteraction();
        }
    };
  }
}

window.addEventListener("keydown", (e) => { if (gameState && gameState.keysPressed) gameState.keysPressed[e.key.toLowerCase()] = true; });
window.addEventListener("keyup", (e) => { if (gameState && gameState.keysPressed) gameState.keysPressed[e.key.toLowerCase()] = false; });
document.getElementById("restart-button").addEventListener("click", init);

loadAssets();
import { gameState } from "./gameState.js";
import { phaseConfigs } from "../config/index.js";

/**
 * Inicializa uma nova fase do jogo, resetando entidades e definindo o objetivo da fase.
 *
 * @param {number} phaseIndex - Índice da fase a ser configurada.
 */
export function setupPhase(phaseIndex) {
  gameState.phase = phaseIndex;
  gameState.enemies = [];
  gameState.items = [];
  gameState.projectiles = [];
  gameState.phaseStartTime = Date.now();
  gameState.lastEnemySpawnTime = 0;
  gameState.portal = null;

  document.getElementById("boss-health-container").classList.add("hidden");

  const config = phaseConfigs[phaseIndex];
  document.getElementById("objective-text").textContent = `Objetivo: ${config.objectiveText}`;

  if (config.objectiveType === "reach_portal") {
    gameState.portal = new Portal(
      MAP_WIDTH - PLAYABLE_AREA_BORDER - 80,
      MAP_HEIGHT / 2 - 40,
      40
    );
  }

  if (config.objectiveType === "defeat_boss") {
    spawnEnemy();
    document.getElementById("boss-health-container").classList.remove("hidden");
  }
}

/**
 * Verifica se o objetivo da fase atual foi concluído.
 * Em caso afirmativo, avança para a próxima fase ou finaliza o jogo.
 */
export function checkPhaseCompletion() {
  const config = phaseConfigs[gameState.phase];
  let completed = false;

  if (config.objectiveType === "survive") {
    const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000;
    if (timeElapsed >= config.duration) completed = true;
  } else if (config.objectiveType === "defeat") {
    if (gameState.score >= config.killTarget) completed = true;
  } else if (config.objectiveType === "reach_portal") {
    if (gameState.portal && isColliding(gameState.player, gameState.portal)) completed = true;
  } else if (config.objectiveType === "defeat_boss") {
    if (gameState.enemies.length === 0) completed = true;
  }

  if (completed) {
    if (gameState.phase + 1 < phaseConfigs.length) {
      setupPhase(gameState.phase + 1);
    } else {
      gameState.isGameOver = true;
      showEndScreen(true);
    }
  }
}
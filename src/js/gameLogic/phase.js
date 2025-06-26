import { gameState } from '../gameState/gameState.js';
import { phaseConfigs } from '../config.js';
import { LavaPool } from '../entities/phaseAddons.entity.js';
import { showNarrativeScreen, showEndScreen } from '../ui.js';
import { narrativeTexts } from "./narratives.js";

export function setupPhase(phaseIndex) {
  if (!phaseConfigs[phaseIndex]) return;

  Object.assign(gameState, {
    phase: phaseIndex,
    enemies: [],
    items: [],
    projectiles: [],
    enemyProjectiles: [],
    portal: null,
    lavaPools: [],
    phaseStartTime: Date.now(),
    lastEnemySpawnTime: 0,
  });

  const config = phaseConfigs[phaseIndex];
  document.getElementById("objective-text").textContent = `Objetivo: ${config.objectiveText}`;


  const bossHealthContainer = document.getElementById("boss-health-container");

  if (config.objectiveType === "defeat_boss") {
    bossHealthContainer.classList.remove("hidden");
    spawnEnemy('final_boss');
  } else {
    bossHealthContainer.classList.add("hidden");
  }

  if (phaseIndex === 3) {
    const poolLocations = [
      { x: 200, y: 300, radius: 50 },
      { x: 800, y: 250, radius: 70 },
      { x: 400, y: 700, radius: 60 },
      { x: 750, y: 800, radius: 40 },
      { x: 400, y: 400, radius: 60 },
    ];

    poolLocations.forEach(p => {
      gameState.lavaPools.push(new LavaPool(p.x, p.y, p.radius));
    });
  }
}

export function checkPhaseCompletion() {
  const config = phaseConfigs[gameState.phase];
  if (!config) return;

  let completed = false;
  if (config.objectiveType === "survive") {
    const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000;
    if (timeElapsed >= config.duration) completed = true;
  } else if (config.objectiveType === "defeat") {
    if (gameState.score >= config.killTarget) completed = true;
  } else if (config.objectiveType === "reach_portal") {
    if (gameState.portal && isColliding(gameState.player, gameState.portal)) completed = true;
  } else if (config.objectiveType === "defeat_boss") {
    if (gameState.enemies.length === 0 && gameState.phaseStartTime > 0) completed = true;
  }

  if (completed) {
    const nextPhase = gameState.phase + 1;

    if (nextPhase < phaseConfigs.length) {
      const story = narrativeTexts[gameState.phase];
      if (story) {
        showNarrativeScreen(story.title, story.subtitle, () => {
          setupPhase(nextPhase);
        });
      } else {
        setupPhase(nextPhase);
      }
    } else {
      gameState.isGameOver = true;
      showEndScreen(true);
    }
  }
}
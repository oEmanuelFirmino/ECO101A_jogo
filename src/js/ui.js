import { gameState } from './gameState.js';
import { phaseConfigs } from './config.js';

export function drawHUD() {
  const playerHealth = (gameState.player.health / gameState.player.maxHealth) * 100;
  document.getElementById("player-health-bar").style.width = `${playerHealth}%`;
  document.getElementById("health-text").textContent = gameState.player.health;
  document.getElementById("phase-text").textContent = gameState.phase + 1;
  document.getElementById("score-text").textContent = gameState.score;
  const config = phaseConfigs[gameState.phase];
  if (config.objectiveType === "survive") {
    const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000;
    const timeLeft = Math.max(0, Math.ceil(config.duration - timeElapsed));
    document.getElementById("objective-text").textContent = `Sobreviva! ${timeLeft}s`;
  } else if (config.objectiveType === "defeat") {
    document.getElementById("objective-text").textContent = `Derrote ${config.killTarget} inimigos (${gameState.score}/${config.killTarget})`;
  }
  if (config.objectiveType === "defeat_boss" && gameState.enemies[0]) {
    const bossHealth = (gameState.enemies[0].health / gameState.enemies[0].maxHealth) * 100;
    document.getElementById("boss-health-bar").style.width = `${bossHealth}%`;
  }
}

export function showEndScreen(didWin) {
  const screen = document.getElementById("message-screen"); const title = document.getElementById("message-title"); const subtitle = document.getElementById("message-subtitle");
  if (didWin) { title.textContent = "Você Zerou!"; title.style.color = "#2ecc71"; subtitle.textContent = "A bravura prevaleceu!"; }
  else { title.textContent = "Game Over"; title.style.color = "#ff4136"; subtitle.textContent = "A escuridão venceu desta vez."; }
  screen.classList.remove("hidden");
}
// src/js/ui.js

import { gameState } from './gameState.js';
import { phaseConfigs } from './config.js';

export function drawHUD() {
  // Sai da função se o jogador ainda não existe
  if (!gameState.player) return;

  // --- Lógica da Barra de Vida do Jogador ---
  const playerHealthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  const playerHealthBar = document.getElementById("player-health-bar");
  if (playerHealthBar) {
    playerHealthBar.style.width = `${playerHealthPercent}%`;
  }
  
  // Atualiza o texto da vida sobre a barra
  const healthText = document.getElementById("player-health-text"); // <<< Mude o ID aqui
  if (healthText) {
    healthText.textContent = gameState.player.health;
  }

  // Atualiza outros textos da HUD
  document.getElementById("phase-text").textContent = gameState.phase + 1;
  document.getElementById("score-text").textContent = gameState.score;
  
  const config = phaseConfigs[gameState.phase];
  if (!config) return;


  const objectiveText = document.getElementById("objective-text");
  if (config.objectiveType === "survive") {
    const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000;
    const timeLeft = Math.max(0, Math.ceil(config.duration - timeElapsed));
    objectiveText.textContent = `Sobreviva! ${timeLeft}s`;
  } else if (config.objectiveType === "defeat") {
    objectiveText.textContent = `Derrote ${config.killTarget} inimigos (${gameState.score}/${config.killTarget})`;
  } else {
    objectiveText.textContent = config.objectiveText;
  }
  
  // Lógica da Barra de Vida do Boss
  if (config.objectiveType === "defeat_boss" && gameState.enemies[0]) {
    const bossHealthPercent = (gameState.enemies[0].health / gameState.enemies[0].maxHealth) * 100;
    document.getElementById("boss-health-bar").style.width = `${bossHealthPercent}%`;
  }
}


export function showEndScreen(didWin) {
  const screen = document.getElementById("message-screen");
  const title = document.getElementById("message-title");
  const subtitle = document.getElementById("message-subtitle");
  const restartButton = document.getElementById("restart-button");
  const continueButton = document.getElementById("continue-button");

  if (didWin) {
    title.textContent = "Você Venceu!";
    title.style.color = "#2ecc71";
    subtitle.textContent = "O tesouro é seu, mas a montanha treme... A aventura continua!";
  } else {
    title.textContent = "Game Over";
    title.style.color = "#ff4136";
    subtitle.textContent = "A escuridão venceu desta vez.";
  }
  
  // Garante que o botão de reiniciar está visível e o de continuar, escondido.
  continueButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  screen.classList.remove("hidden");
}

export function showNarrativeScreen(title, subtitle, onComplete) {
  const screen = document.getElementById("message-screen");
  const titleEl = document.getElementById("message-title");
  const subtitleEl = document.getElementById("message-subtitle");
  const restartButton = document.getElementById("restart-button");
  const continueButton = document.getElementById("continue-button");

  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;
  titleEl.style.color = '#ffc107'; // Cor de ouro para a narrativa

  restartButton.classList.add('hidden');
  continueButton.classList.remove('hidden');
  screen.classList.remove('hidden');

  // Pausa o jogo enquanto a história é exibida
  gameState.isPaused = true;

  const clickHandler = () => {
    screen.classList.add('hidden');
    continueButton.classList.add('hidden');
    gameState.isPaused = false;
    // Remove o listener para não ser chamado múltiplas vezes
    continueButton.removeEventListener('click', clickHandler);
    if (onComplete) {
      onComplete();
    }
  };

  continueButton.addEventListener('click', clickHandler, { once: true });
}



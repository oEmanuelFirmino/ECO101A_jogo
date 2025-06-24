// src/js/ui.js

import { gameState } from './gameState.js';
import { phaseConfigs } from './config.js';

// Substitua a função drawHUD inteira em ui.js

export function drawHUD() {
  if (!gameState.player) return;

  // --- LÓGICA DA BARRA DE VIDA DINÂMICA ---
  const playerHealthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  const playerHealthBar = document.getElementById("player-health-bar");
  
  if (playerHealthBar) {
    // Atualiza a largura da barra
    playerHealthBar.style.width = `${playerHealthPercent}%`;

    // Define o gradiente da cor com base no percentual de vida
    let healthGradient;
    if (playerHealthPercent > 60) {
      // Gradiente Verde (vida alta)
      healthGradient = 'linear-gradient(to right, #63e674, #28a745)';
    } else if (playerHealthPercent > 30) {
      // Gradiente Amarelo/Laranja (vida média)
      healthGradient = 'linear-gradient(to right, #ffdd57, #ff9f1a)';
    } else {
      // Gradiente Vermelho (vida baixa)
      healthGradient = 'linear-gradient(to right, #e85a5a, #dc3545)';
    }
    playerHealthBar.style.background = healthGradient;
  }
  
  // Atualiza o texto da vida
  const healthText = document.getElementById("player-health-text");
  if (healthText) {
    healthText.textContent = gameState.player.health;
  }

  // Atualiza o texto da fase
  document.getElementById("phase-text").textContent = gameState.phase + 1;
  
  // Atualiza o texto do objetivo
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

// Substitua a função showNarrativeScreen inteira em ui.js

export function showNarrativeScreen(title, subtitle, onComplete) {
  const screen = document.getElementById("message-screen");
  const titleEl = document.getElementById("message-title");
  const subtitleEl = document.getElementById("message-subtitle");
  const restartButton = document.getElementById("restart-button");
  const continueButton = document.getElementById("continue-button");
  const hud = document.getElementById("hud"); // Pega o elemento do HUD

  // Esconde o HUD do jogo
  hud.classList.add('hidden');

  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;
  
  restartButton.classList.add('hidden');
  continueButton.classList.remove('hidden');
  screen.classList.remove('hidden');

  gameState.isPaused = true;

  const clickHandler = () => {
    screen.classList.add('hidden');
    continueButton.classList.add('hidden');
    
    // Mostra o HUD novamente antes de continuar o jogo
    hud.classList.remove('hidden');

    gameState.isPaused = false;
    continueButton.removeEventListener('click', clickHandler);
    if (onComplete) {
      onComplete();
    }
  };

  continueButton.addEventListener('click', clickHandler, { once: true });
}
 



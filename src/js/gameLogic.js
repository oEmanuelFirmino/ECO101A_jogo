// src/js/gameLogic.js

import { gameState } from './gameState.js';
import { phaseConfigs, images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './config.js';
import { Enemy, DynamicEnemy, FinalBoss, Item, Portal } from './entities.js';
import { showEndScreen } from './ui.js';

export function isColliding(rect1, rect2) {
    if (!rect1 || !rect2) return false;
    return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y);
}

export function spawnEnemy(type = null) {
    const config = phaseConfigs[gameState.phase];
    if (!config || !config.enemyTypes) return;

    const enemyTypeKey = type || config.enemyTypes[Math.floor(Math.random() * config.enemyTypes.length)];
    
    let x, y;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { x = Math.random() * MAP_WIDTH; y = -50; }
    else if (side === 1) { x = MAP_WIDTH; y = Math.random() * MAP_HEIGHT; }
    else if (side === 2) { x = Math.random() * MAP_WIDTH; y = MAP_HEIGHT; }
    else { x = -50; y = Math.random() * MAP_HEIGHT; }

    switch (enemyTypeKey) {
        case "fast": gameState.enemies.push(new Enemy(x, y, 35, 35, 2.5, images.fastEnemy, 20, 50)); break;
        case "tank": gameState.enemies.push(new DynamicEnemy(x, y, 50, 50, 1, { up: images.golem_costas, down: images.golem_frente, left: images.golem_esquerda, right: images.golem_direita }, 80, 75)); break;
        case "final_boss": 
            const bossX = MAP_WIDTH / 2 - 60;
            const bossY = PLAYABLE_AREA_BORDER + 100;
            gameState.enemies.push(new FinalBoss(bossX, bossY, 120, 120, 1.5, images.finalBoss, 2500, 100)); 
            break;
        default: gameState.enemies.push(new Enemy(x, y, 40, 40, 1.5, images.enemy, 40, 25)); break;
    }
}

export function spawnItem() {
    const x = Math.random() * (MAP_WIDTH - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
    const y = Math.random() * (MAP_HEIGHT - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
    const types = [
        { sprite: images.itemHealth, effect: "heal" },
        { sprite: images.itemSpeed, effect: "speed" },
        { sprite: images.itemShield, effect: "shield" },
        { sprite: images.itemFireRate, effect: "firerate" }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type && type.sprite) {
        gameState.items.push(new Item(x, y, 30, 30, type.sprite, type.effect));
    }
}

export function setupPhase(phaseIndex) {
    if (!phaseConfigs[phaseIndex]) return;

    gameState.phase = phaseIndex; 
    gameState.enemies = []; 
    gameState.items = []; 
    gameState.projectiles = [];
    gameState.enemyProjectiles = [];
    gameState.phaseStartTime = Date.now(); 
    gameState.lastEnemySpawnTime = 0; 
    gameState.portal = null;
    
    const config = phaseConfigs[phaseIndex];
    document.getElementById("objective-text").textContent = `Objetivo: ${config.objectiveText}`;
    
    const bossHealthContainer = document.getElementById("boss-health-container");
    if (config.objectiveType === "defeat_boss") {
        bossHealthContainer.classList.remove("hidden");
        spawnEnemy('final_boss');
    } else {
        bossHealthContainer.classList.add("hidden");
    }

    if (config.objectiveType === "reach_portal") {
        const portalX = MAP_WIDTH - PLAYABLE_AREA_BORDER - 80;
        const portalY = MAP_HEIGHT / 2 - 40;
        gameState.portal = new Portal(portalX, portalY, 40);
    }
}

export function checkPhaseCompletion() {
    const config = phaseConfigs[gameState.phase]; 
    if (!config) return;
    
    let completed = false;
    if (config.objectiveType === "survive") { const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000; if (timeElapsed >= config.duration) completed = true; }
    else if (config.objectiveType === "defeat") { if (gameState.score >= config.killTarget) completed = true; }
    else if (config.objectiveType === "reach_portal") { if (gameState.portal && isColliding(gameState.player, gameState.portal)) completed = true; }
    else if (config.objectiveType === "defeat_boss") { 
        if (gameState.enemies.length === 0 && gameState.phaseStartTime > 0) completed = true; 
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

export function updateCamera() {
    if (!gameState || !gameState.player) return;
    const cam = gameState.camera;
    const player = gameState.player;
    cam.x = player.x - VIEWPORT_WIDTH / 2;
    cam.y = player.y - VIEWPORT_HEIGHT / 2;
    cam.x = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, cam.x));
    cam.y = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, cam.y));
    if (isNaN(cam.x)) cam.x = 0;
    if (isNaN(cam.y)) cam.y = 0;
}
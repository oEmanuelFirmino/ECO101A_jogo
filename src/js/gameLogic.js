// src/js/gameLogic.js

import { gameState } from './gameState.js';
import { phaseConfigs, images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './config.js';
import { Enemy, Boss, DynamicEnemy, Item, Portal } from './entities.js';
import { showEndScreen } from './ui.js';

export function isColliding(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y);
}

export function spawnEnemy() {
    const config = phaseConfigs[gameState.phase];
    const enemyTypeKey = config.enemyTypes[Math.floor(Math.random() * config.enemyTypes.length)];
    let x, y;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { x = Math.random() * MAP_WIDTH; y = -50; }
    else if (side === 1) { x = MAP_WIDTH; y = Math.random() * MAP_HEIGHT; }
    else if (side === 2) { x = Math.random() * MAP_WIDTH; y = MAP_HEIGHT; }
    else { x = -50; y = Math.random() * MAP_HEIGHT; }

    switch (enemyTypeKey) {
        case "fast": gameState.enemies.push(new Enemy(x, y, 35, 35, 2.5, images.fastEnemy, 20)); break;
        case "tank": gameState.enemies.push(new DynamicEnemy(x, y, 50, 50, 1, { up: images.golem_costas, down: images.golem_frente, left: images.golem_esquerda, right: images.golem_direita }, 80)); break;
        case "boss": gameState.enemies.push(new Boss(MAP_WIDTH / 2 - 50, PLAYABLE_AREA_BORDER + 50, 100, 100, 2, images.bossEnemy, 1000)); break;
        default: gameState.enemies.push(new Enemy(x, y, 40, 40, 1.5, images.enemy, 40)); break;
    }
}

export function spawnItem() {
    const x = Math.random() * (MAP_WIDTH - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
    const y = Math.random() * (MAP_HEIGHT - PLAYABLE_AREA_BORDER * 2 - 60) + PLAYABLE_AREA_BORDER + 30;
    const types = [
        { sprite: images.itemHealth, effect: "heal" },
        { sprite: images.itemSpeed, effect: "speed" },
        { sprite: images.itemShield, effect: "shield" },
        { sprite: images.itemFireRate, effect: "firerate" } // <-- NOVA LINHA AQUI
    ];
    const { sprite, effect } = types[Math.floor(Math.random() * types.length)];
    gameState.items.push(new Item(x, y, 30, 30, sprite, effect));
}

export function setupPhase(phaseIndex) {
    gameState.phase = phaseIndex; gameState.enemies = []; gameState.items = []; gameState.projectiles = [];
    gameState.phaseStartTime = Date.now(); gameState.lastEnemySpawnTime = 0; gameState.portal = null;
    document.getElementById("boss-health-container").classList.add("hidden");

    const config = phaseConfigs[phaseIndex];
    document.getElementById("objective-text").textContent = `Objetivo: ${config.objectiveText}`;
    if (config.objectiveType === "reach_portal") {
        const portalX = MAP_WIDTH - PLAYABLE_AREA_BORDER - 80;
        const portalY = MAP_HEIGHT / 2 - 40;
        gameState.portal = new Portal(portalX, portalY, 40);

        if (phaseIndex === 4) {
            const sprites = { up: images.golem_costas, down: images.golem_frente, left: images.golem_esquerda, right: images.golem_direita };
            gameState.enemies.push(new DynamicEnemy(portalX - 70, portalY, 50, 50, 1, sprites, 80));
            gameState.enemies.push(new DynamicEnemy(portalX + 100, portalY, 50, 50, 1, sprites, 80));
            gameState.enemies.push(new DynamicEnemy(portalX, portalY + 90, 50, 50, 1, sprites, 80));
        }
    }
    if (config.objectiveType === "defeat_boss") {
        spawnEnemy();
    }
}

export function checkPhaseCompletion() {
    const config = phaseConfigs[gameState.phase]; let completed = false;
    if (config.objectiveType === "survive") { const timeElapsed = (Date.now() - gameState.phaseStartTime) / 1000; if (timeElapsed >= config.duration) completed = true; }
    else if (config.objectiveType === "defeat") { if (gameState.score >= config.killTarget) completed = true; }
    else if (config.objectiveType === "reach_portal") { if (gameState.portal && isColliding(gameState.player, gameState.portal)) completed = true; }
    else if (config.objectiveType === "defeat_boss") { if (gameState.enemies.length === 0) completed = true; }

    if (completed) {
        if (gameState.phase + 1 < phaseConfigs.length) { setupPhase(gameState.phase + 1); }
        else { gameState.isGameOver = true; showEndScreen(true); }
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
}
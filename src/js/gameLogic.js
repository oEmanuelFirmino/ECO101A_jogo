import { gameState } from './gameState.js';
import { phaseConfigs, images, MAP_WIDTH, MAP_HEIGHT, PLAYABLE_AREA_BORDER, VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from './config.js';
import { Enemy, DynamicEnemy, FinalBoss, Item, Portal, LavaPool } from './entities.js';
import { showNarrativeScreen, showEndScreen } from './ui.js';

const narrativeTexts = [
    {
        title: "Um Eco nas Profundezas",
        subtitle: "Você sobreviveu à primeira horda. Um calor estranho emana das paredes de rocha você segue em direção a entrada da masmorra."
    },
    {
        title: "O Ar se Torna Rarefeito",
        subtitle: "Inimigos mais fortes surgem das sombras. O ar fica denso e a escuridão parece querer te engolir. O tesouro deve estar perto."
    },
    {
        title: "O Coração do Vulcão",
        subtitle: "O chão treme sob seus pés! Cinzas caem do teto e rios de lava brilham ao longe. A masmorra é o interior de um vulcão adormecido!"
    },
    {
        title: "O Guardião Ancestral",
        subtitle: "Você chegou à câmara final. O tesouro está à vista, mas uma criatura colossal, forjada em fogo e rocha, desperta para protegê-lo."
    }
];
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
        case "fast": gameState.enemies.push(new Enemy(x, y, 50, 50, 2.5, images.fastEnemy, 20, 50)); break;
        case "golem": gameState.enemies.push(new DynamicEnemy(x, y, 75, 75, 1.5, { up: images.golem_costas, down: images.golem_frente, left: images.golem_esquerda, right: images.golem_direita }, 80, 75)); break;
        case "tank": gameState.enemies.push(new DynamicEnemy(x, y, 100, 100, 0.75, { up: images.tank_costas, down: images.tank_frente, left: images.tank_esquerda, right: images.tank_direita }, 110, 15)); break;
        case "vulcon": gameState.enemies.push(new DynamicEnemy(x, y, 100, 100, 0.75, { up: images.vulcon_costas, down: images.vulcon_frente, left: images.vulcon_esquerda, right: images.vulcon_direita }, 110, 15)); break;
        case "larva": gameState.enemies.push(new DynamicEnemy(x, y, 65, 65, 1.5, { up: images.larva_costas, down: images.larva_frente, left: images.larva_esquerda, right: images.larva_direita }, 40, 25)); break;
        case "final_boss":
            const bossX = MAP_WIDTH / 2 - 60;
            const bossY = PLAYABLE_AREA_BORDER + 100;
            const bossSprites = {
                up: images.boss_costas,
                down: images.finalBoss,
                left: images.boss_esquerda,
                right: images.boss_direita,
            };
            gameState.enemies.push(new FinalBoss(bossX, bossY, 180, 180, 1, bossSprites, 2500, 100));
            break;
        default: gameState.enemies.push(new DynamicEnemy(x, y, 55, 55, 1.5, { up: images.normal_costas, down: images.normal_frente, left: images.normal_esquerda, right: images.normal_direita }, 40, 25)); break;
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
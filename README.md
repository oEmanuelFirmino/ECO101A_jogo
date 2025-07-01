# 🚀 Projeto de Jogo ECO101A: Aventura na Masmorra 🚀

## 🌌 Bem-vindos à Aventura!
Este projeto é um jogo desenvolvido como parte da disciplina de ECO101A - Introdução à Engenharia da Computação. Nosso objetivo foi aplicar conceitos fundamentais de lógica de programação, estruturas de dados e organização de código em um ambiente prático e divertido.

Prepare-se para uma experiência imersiva onde suas habilidades serão testadas!

## 📜 Sobre o Jogo
Aventura na Masmorra é um jogo de aventura 2D que te desafia a sobreviver a ondas de inimigos, derrotar chefes épicos, explorar mapas incríveis. Com uma jogabilidade dinâmica e gráficos simples, o jogo promete diversão e aprendizado sobre as bases da engenharia de software.

### Recursos Principais:

- 👾 Inimigos Dinâmicos: Enfrente uma variedade de adversários com padrões de ataque únicos.

- 💥 Sistema de Colisão: Interações precisas entre projéteis, personagens e o ambiente.

- 👹 Batalhas de Chefes: Encontros desafiadores com chefes poderosos e suas mecânicas especiais.

- 📖 Narrativa Integrada: Uma história envolvente que se desenrola conforme você avança pelas fases.

- 🌟 Múltiplas Fases: Progressão através de diferentes estágios com novos desafios.

- 🎮 Controles Intuitivos: Facilidade para aprender e dominar a movimentação e ataques.

## 🚀 Como Jogar
Você pode jogar o Aventura na Masmorra de duas maneiras:

Opção 1: Direto no Navegador (Recomendado!)
Acesse o jogo diretamente em nosso site:

👉 [mlhub.site](https://www.mlhub.site/)

Opção 2: Localmente pelo Repositório
Clone o Repositório:

```bash
git clone https://github.com/oemanuelfirmino/ECO101A_jogo.git
```

Navegue até o Diretório do Projeto:

```bash
cd ECO101A_jogo
```

Abra o Jogo:
Simplesmente abra o arquivo index.html em seu navegador web preferido. Não é necessário nenhum servidor web ou dependências adicionais!

`file:///caminho/para/o/seu/repositorio/ECO101A_jogo/index.html`

_**Dica: Para uma melhor experiência, use navegadores modernos como Google Chrome, Mozilla Firefox ou Microsoft Edge.**_

## 🛠️ Tecnologias Utilizadas
Este projeto foi construído utilizando as seguintes tecnologias web:

- HTML5: Estrutura base do jogo.

- CSS3: Estilização dos elementos visuais e da interface do usuário (HUD).

  - `src/css/main.css`

  - `src/css/gameCanvas.css`

  - `src/css/hud.css`

  - `src/css/healthBar.css`

  - `src/css/bossHeatlhBar.css`

  - `src/css/menus.css`

  - `src/css/messageScreen.css`

  - `src/css/restartButton.css`

  - `src/css/gameContainer.css`

  - `src/css/mainContainer.css`

- JavaScript (ES6+): Lógica principal do jogo, gerenciamento de entidades, colisões, fases e estado do jogo.

  - `src/js/main.js` (Ponto de entrada)

  - `src/js/config.js` (Configurações do jogo)

  - `src/js/ui.js` (Interface do usuário)

  - Entidades:

    - `src/js/entities/character.entity.js`

    - `src/js/entities/player.entity.js`

    - `src/js/entities/enemy.entity.js`

    - `src/js/entities/dynamicEnemy.entity.js`

    - `src/js/entities/finalBoss.entity.js`

    - `src/js/entities/projectile.entity.js`

    - `src/js/entities/phaseAddons.entity.js`

  - Lógica do Jogo:

    - `src/js/gameLogic/camera.js`

    - `src/js/gameLogic/collision.js`

    - `src/js/gameLogic/narratives.js`

    - `src/js/gameLogic/phase.js`

    - `src/js/gameLogic/spawn.js`

  - Estado do Jogo:

    - `src/js/gameState/gameState.js`

📂 Estrutura do Projeto
ECO101A_jogo/  
├── .gitignore  
├── images/  
│   └── hud-background_files/  
│       ├── RotateCookiesPage.html  
│       ├── bscframe.html  
│       └── editor.main.css  
├── src/  
│   ├── css/  
│   │   ├── bossHeatlhBar.css  
│   │   ├── gameCanvas.css  
│   │   ├── gameContainer.css  
│   │   ├── healthBar.css  
│   │   ├── hud.css  
│   │   ├── main.css  
│   │   ├── mainContainer.css  
│   │   ├── menus.css  
│   │   ├── messageScreen.css  
│   │   └── restartButton.css  
│   └── js/  
│       ├── config.js  
│       ├── entities/  
│       │   ├── character.entity.js  
│       │   ├── dynamicEnemy.entity.js  
│       │   ├── enemy.entity.js  
│       │   ├── finalBoss.entity.js  
│       │   ├── phaseAddons.entity.js  
│       │   ├── player.entity.js  
│       │   └── projectile.entity.js  
│       ├── gameLogic/  
│       │   ├── camera.js  
│       │   ├── collision.js  
│       │   ├── narratives.js  
│       │   ├── phase.js  
│       │   └── spawn.js  
│       ├── gameState/  
│       │   └── gameState.js  
│       ├── main.js  
│       └── ui.js  
└── index.html  


🤝 Contribuidores
Este projeto foi desenvolvido por:

Emanuel Firmino - [🔗Ir ao Perfil](https://github.com/oEmanuelFirmino)

Eduardo Luiz - [🔗Ir ao Perfil](https://github.com/Dudruu)

Enrique Mantovani - [🔗Ir ao Perfil](https://github.com/enriquemantovani)

Carlos Henrique


📝 Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

Agradecemos o seu interesse em nosso projeto! Divirta-se jogando e explorando o código! ✨

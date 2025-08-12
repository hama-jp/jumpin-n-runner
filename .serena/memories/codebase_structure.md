# Codebase Structure

## Directory Layout
```
├── index.html                    # Main HTML file with game UI
├── README.md / README_JA.md      # Documentation (English/Japanese)
├── src/
│   ├── css/
│   │   └── styles.css           # All game styling and responsive design
│   └── js/
│       ├── main.js              # Entry point and global functions
│       └── modules/             # Modular game systems
│           ├── AudioSystem.js    # Sound effects and BGM management
│           ├── Background.js     # Parallax background rendering
│           ├── GameEngine.js     # Core game loop and state management
│           ├── GrassEffect.js    # Visual grass effect system
│           ├── InputHandler.js   # Keyboard, mouse, and touch input
│           ├── Obstacle.js       # Obstacle generation and collision
│           ├── ParticleSystem.js # Visual effects system
│           └── Player.js         # Player character logic
└── assets/
    └── audio/                   # Reserved for future audio files

## Architecture
- **Modular Design**: Each game system isolated in separate classes
- **HTML5 Canvas**: Single canvas element for all rendering
- **Game Loop**: Standard requestAnimationFrame-based loop
- **Dependency Loading**: Scripts loaded via `<script>` tags in index.html
- **No Build Process**: Direct browser execution

## Key Classes
- **GameEngine**: Central orchestrator managing all systems
- **Player**: Character with variable jump mechanics
- **ObstacleManager**: Dynamic obstacle generation and collision
- **AudioSystem**: Procedural music and sound effects
- **ParticleSystem**: Visual effects management
- **Background**: Parallax scrolling environment
- **InputHandler**: Unified input system for all devices
# Jumpin' N Runner

An HTML5 Canvas browser game where you survive by jumping over obstacles in this 2D platformer.

🎮 **[Play Now!](https://hama-jp.github.io/jumpin-n-runner/)**

[日本語 README](README_JA.md)

## 🎮 Game Features

- **Variable Jump System**: Long press for high jumps, short press for low jumps
- **Progressive Difficulty**: Speed and complexity increase over time
- **Procedural Audio**: Real-time sound effects using Tone.js
- **Multi-Device Support**: Keyboard, mouse, and touch controls
- **Visual Effects**: Rich particle system for enhanced gameplay

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Click "Let's Roll!" button
3. Controls:
   - **PC**: Spacebar or Mouse Click
   - **Mobile**: Screen Tap
   - **Short Press**: Low jump (for small obstacles)
   - **Long Press**: High jump (for tall obstacles)

## 🏗️ Project Structure

```
├── index.html                    # Main HTML file
├── src/
│   ├── css/
│   │   └── styles.css           # Stylesheet
│   └── js/
│       ├── main.js              # Entry point
│       └── modules/
│           ├── AudioSystem.js    # Sound effects and BGM
│           ├── Background.js     # Parallax background
│           ├── GameEngine.js     # Core game loop
│           ├── InputHandler.js   # Input processing
│           ├── Obstacle.js       # Obstacle management
│           ├── ParticleSystem.js # Visual effects
│           └── Player.js         # Player character logic
└── assets/
    └── audio/                   # Reserved for future audio files
```

## 🛠️ Technology Stack

- **HTML5 Canvas**: Graphics rendering
- **Vanilla JavaScript**: ES6+ class syntax
- **Tone.js**: Web Audio API sound generation
- **CSS3**: Responsive design and animations

## 🎵 Audio System

- BGM: 4-measure procedural music pattern
- Sound Effects: Dynamic audio responding to player actions
  - Jump sounds: 3 levels based on charge amount
  - Point acquisition sound
  - Speed up sound
  - Game over sound

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 13+
- Edge 79+

## 🔧 Developer Information

### Running the Game
```bash
# Start local server (recommended)
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000 in browser
```

### Adding New Features
1. Create new module in `src/js/modules/`
2. Add script reference to `index.html`
3. Initialize in `GameEngine` class and integrate with game loop

### Debugging
- Use browser developer tools
- See `CLAUDE.md` for detailed development guidance

## 🎯 Game Rules

- **Score**: Automatically increases over time
- **Obstacles**: 3 types (box, spike, tall obstacle)
- **Difficulty**: Speed increases every 300 frames
- **Collision**: Game over when touching obstacles
- **High Score**: Saved in LocalStorage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is released under the MIT License.

## 🙏 Acknowledgments

- [Tone.js](https://tonejs.github.io/) - Web Audio API library
- HTML5 Canvas API
- Modern JavaScript ES6+ features
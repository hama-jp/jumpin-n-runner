# Suggested Commands

## Running the Game
```bash
# Start local HTTP server (recommended method)
python -m http.server 8000
# Alternative with Node.js
npx serve .
# Alternative with PHP
php -S localhost:8000

# Then open http://localhost:8000 in browser
```

## Development Workflow
```bash
# View project structure
ls -la src/js/modules/

# Search for specific code patterns
grep -r "function" src/js/
grep -r "class" src/js/modules/

# View game files
cat index.html
cat src/js/main.js

# Monitor for changes (if using file watcher)
# Note: No build process - just refresh browser after changes
```

## Git Operations
```bash
# Standard git workflow
git status
git add .
git commit -m "Add new feature"
git push origin feature-branch

# Create feature branch
git checkout -b feature/new-feature
```

## File Operations
```bash
# List all JavaScript files
find src -name "*.js" -type f

# List all project files
find . -name "*.html" -o -name "*.js" -o -name "*.css" | head -20

# View file sizes
du -sh src/js/modules/*
```

## System Utils
```bash
# Basic Linux commands available
ls, cat, grep, find, cd, pwd, chmod, cp, mv, rm
git, curl, wget, vim, nano

# Process management
ps aux | grep python  # if running local server
kill <pid>  # to stop local server
```

## Browser Development
- **F12**: Open browser developer tools
- **Console**: View JavaScript errors and debug output
- **Network tab**: Monitor resource loading (Tone.js CDN)
- **Performance tab**: Profile game performance
- **Responsive design mode**: Test mobile touch controls

## Notes
- No linting/formatting/testing commands (no build system)
- No package.json or npm scripts
- Testing done manually via browser refresh
- Audio requires user interaction to start (Web Audio API policy)
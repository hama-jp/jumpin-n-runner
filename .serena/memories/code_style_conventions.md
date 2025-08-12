# Code Style and Conventions

## Language and Syntax
- **ES6+ JavaScript**: Modern class syntax, arrow functions, const/let
- **Vanilla JS**: No framework dependencies, pure DOM/Canvas API usage
- **Modular Classes**: Each game system as separate ES6 class

## Naming Conventions
- **Classes**: PascalCase (GameEngine, Player, AudioSystem)
- **Methods/Functions**: camelCase (gameLoop, startJumpCharge, executeQuickJump)
- **Variables**: camelCase (gameState, chargeTime, particleSystem)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **File Names**: PascalCase.js for classes, camelCase.js for utilities

## Code Organization
- **One class per file** in modules directory
- **Constructor initialization** for all dependencies
- **Method grouping**: Constructor, lifecycle methods, utility methods
- **Consistent indentation**: 4 spaces
- **Method documentation**: Brief inline comments where needed

## HTML/CSS Conventions
- **BEM-style naming** for CSS classes where applicable
- **Responsive design** with viewport meta tag
- **Semantic HTML** structure
- **CSS custom properties** for theming
- **Touch-action optimization** for mobile support

## File Structure Patterns
- **index.html**: Single page application entry point
- **src/css/**: All styling consolidated
- **src/js/main.js**: Global functions and initialization
- **src/js/modules/**: Individual game system classes
- **CDN dependencies**: External libraries loaded via script tags

## Game-Specific Conventions
- **Canvas state management**: save/restore pattern
- **Event cleanup**: Proper listener removal in destroy methods  
- **Efficient rendering**: Minimal DOM manipulation during gameplay
- **Memory management**: Array filtering for object cleanup
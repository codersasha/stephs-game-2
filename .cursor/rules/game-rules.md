# Game Project Rules

## Project Setup
- **Technology**: Pure HTML5, CSS, and JavaScript - no frameworks, no build tools, no backend
- **Hosting**: Static GitHub Pages
- **Responsive**: Must work on phones, tablets, and desktops

## Workflow Rules
1. **Auto-commit and push**: After making changes, automatically commit with a descriptive message and push to GitHub
2. **Open in browser**: After changes, open the game locally using `python3 -m http.server 8080` and the Cursor browser
3. **Run tests**: If there's a test suite, run it after changes
4. **Fix bugs immediately**: If something breaks, fix it right away

## Game Development Rules
1. **Simple UI**: Make buttons big and easy to tap on phones
2. **Save progress**: Use localStorage to save game data
3. **Sound effects**: Use Web Audio API (no external files)
4. **Graphics**: Use SVG for graphics - they scale nicely
5. **Keep it simple**: Target audience is kids (~8 years old)

## File Structure
```
/
├── index.html          (main game page)
├── css/
│   └── style.css       (all styles)
├── js/
│   ├── game.js         (main game code)
│   └── game-logic.js   (testable game logic - pure functions)
├── tests/
│   └── test-runner.html (browser-based tests)
└── .github/
    └── workflows/
        └── deploy.yml  (GitHub Pages deployment)
```

## If Multiplayer Is Requested
Use PeerJS (WebRTC) from CDN:
- Include: `<script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>`
- Create "Host Game" and "Join Game" options
- Host generates a fun code (like "THUNDER1234")
- Sync player positions and game state
- Add chat and friends system

## Communication Style
- Be patient and helpful (user might be a kid)
- Ask simple questions if unclear
- Show the game after each change
- Make small changes and test often

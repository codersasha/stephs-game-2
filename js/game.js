/**
 * Main Game Controller
 * Handles DOM, events, sounds, and game loop
 */

const Game = {
    state: null,
    audioContext: null,
    screens: {},

    /**
     * Initialize the game
     */
    init: function() {
        // Get screen elements
        this.screens.home = document.getElementById('home-screen');
        this.screens.game = document.getElementById('game-screen');

        // Initialize game state
        this.state = GameLogic.createInitialState();

        // Load saved high score
        const savedData = GameLogic.loadFromStorage('gameData');
        if (savedData && savedData.highScore) {
            this.state.highScore = savedData.highScore;
        }

        // Set up event listeners
        this.setupEventListeners();

        console.log('🎮 Game initialized!');
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners: function() {
        // Start game on any input
        const startGame = (e) => {
            e.preventDefault();
            this.startGame();
        };

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (this.screens.home.classList.contains('active')) {
                startGame(e);
            }
        });

        // Touch and click
        this.screens.home.addEventListener('click', startGame);
        this.screens.home.addEventListener('touchstart', startGame, { passive: false });
    },

    /**
     * Play a sound effect using Web Audio API
     * @param {string} type - Type of sound ('start', 'click', 'score', 'gameover')
     */
    playSound: function(type) {
        // Initialize audio context on first user interaction
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch(type) {
            case 'start':
                // Cheerful ascending notes
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;

            case 'click':
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;

            case 'score':
                oscillator.frequency.setValueAtTime(523, ctx.currentTime);
                oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;

            case 'gameover':
                oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.6);
                break;
        }
    },

    /**
     * Switch to a different screen
     * @param {string} screenName - Name of screen to show
     */
    showScreen: function(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    },

    /**
     * Start the game
     */
    startGame: function() {
        this.playSound('start');
        this.state.isPlaying = true;
        this.state.startTime = Date.now();
        this.showScreen('game');
        console.log('🚀 Game started!');
    },

    /**
     * Save current game progress
     */
    saveProgress: function() {
        const saveData = {
            highScore: this.state.highScore,
            lastPlayed: Date.now()
        };
        GameLogic.saveToStorage('gameData', saveData);
    }
};

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

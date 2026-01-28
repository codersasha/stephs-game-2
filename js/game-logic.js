/**
 * Game Logic - Pure functions for game mechanics
 * Keep this file free of DOM manipulation for easy testing
 */

const GameLogic = {
    /**
     * Initialize a new game state
     * @returns {Object} Initial game state
     */
    createInitialState: function() {
        return {
            score: 0,
            level: 1,
            lives: 3,
            isPlaying: false,
            isPaused: false,
            startTime: null,
            highScore: 0
        };
    },

    /**
     * Add points to the score
     * @param {Object} state - Current game state
     * @param {number} points - Points to add
     * @returns {Object} Updated game state
     */
    addScore: function(state, points) {
        const newScore = state.score + points;
        return {
            ...state,
            score: newScore,
            highScore: Math.max(newScore, state.highScore)
        };
    },

    /**
     * Lose a life
     * @param {Object} state - Current game state
     * @returns {Object} Updated game state with one less life
     */
    loseLife: function(state) {
        const newLives = Math.max(0, state.lives - 1);
        return {
            ...state,
            lives: newLives,
            isPlaying: newLives > 0
        };
    },

    /**
     * Check if game is over
     * @param {Object} state - Current game state
     * @returns {boolean} True if game is over
     */
    isGameOver: function(state) {
        return state.lives <= 0;
    },

    /**
     * Advance to next level
     * @param {Object} state - Current game state
     * @returns {Object} Updated game state
     */
    nextLevel: function(state) {
        return {
            ...state,
            level: state.level + 1
        };
    },

    /**
     * Generate a random game code for multiplayer
     * @returns {string} A fun game code like "THUNDER1234"
     */
    generateGameCode: function() {
        const words = [
            'THUNDER', 'DRAGON', 'ROCKET', 'COSMIC', 'BLAZING',
            'MIGHTY', 'SUPER', 'GOLDEN', 'FLYING', 'TURBO'
        ];
        const word = words[Math.floor(Math.random() * words.length)];
        const number = Math.floor(1000 + Math.random() * 9000);
        return word + number;
    },

    /**
     * Save game data to localStorage
     * @param {string} key - Storage key
     * @param {Object} data - Data to save
     */
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
            return false;
        }
    },

    /**
     * Load game data from localStorage
     * @param {string} key - Storage key
     * @returns {Object|null} Loaded data or null
     */
    loadFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            return null;
        }
    }
};

// Export for testing (works in both browser and Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameLogic;
}

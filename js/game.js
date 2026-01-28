/**
 * Warrior Cat: Two Medicine Cats - Game Controller
 * Handles DOM, events, sounds, and game flow
 */

const Game = {
    state: null,
    audioContext: null,
    screens: {},
    elements: {},

    /**
     * Initialize the game
     */
    init: function() {
        // Get all screen elements
        this.screens = {
            home: document.getElementById('home-screen'),
            difficulty: document.getElementById('difficulty-screen'),
            game: document.getElementById('game-screen'),
            rest: document.getElementById('rest-screen'),
            gameover: document.getElementById('gameover-screen')
        };

        // Get game elements
        this.elements = {
            nightCount: document.getElementById('night-count'),
            scoreCount: document.getElementById('score-count'),
            reputationFill: document.getElementById('reputation-fill'),
            patientCard: document.getElementById('patient-card'),
            patientIcon: document.getElementById('patient-icon'),
            patientName: document.getElementById('patient-name'),
            patientAilment: document.getElementById('patient-ailment'),
            selectedHerbs: document.getElementById('selected-herbs'),
            herbCount: document.getElementById('herb-count'),
            herbGrid: document.getElementById('herb-grid'),
            treatBtn: document.getElementById('treat-btn'),
            resultModal: document.getElementById('result-modal'),
            resultIcon: document.getElementById('result-icon'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            resultDetails: document.getElementById('result-details'),
            continueBtn: document.getElementById('continue-btn'),
            catsHealed: document.getElementById('cats-healed'),
            catsLost: document.getElementById('cats-lost'),
            restMessage: document.getElementById('rest-message'),
            nextNightBtn: document.getElementById('next-night-btn'),
            playAgainBtn: document.getElementById('play-again-btn'),
            finalScore: document.getElementById('final-score'),
            finalHealed: document.getElementById('final-healed'),
            finalNights: document.getElementById('final-nights')
        };

        // Set up event listeners
        this.setupEventListeners();

        // Load saved high score
        const savedData = GameLogic.loadFromStorage('medicineCatData');
        if (savedData) {
            this.highScore = savedData.highScore || 0;
        }

        console.log('🐱 Medicine Cat game initialized!');
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners: function() {
        // Home screen - start on any tap
        this.screens.home.addEventListener('click', () => this.showScreen('difficulty'));
        this.screens.home.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showScreen('difficulty');
        }, { passive: false });

        // Difficulty buttons
        document.querySelectorAll('.btn-difficulty').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.startGame(difficulty);
            });
        });

        // Treat button
        this.elements.treatBtn.addEventListener('click', () => this.giveTreatment());

        // Continue button (in result modal)
        this.elements.continueBtn.addEventListener('click', () => this.continueGame());

        // Next night button
        this.elements.nextNightBtn.addEventListener('click', () => this.startNewNight());

        // Play again button
        this.elements.playAgainBtn.addEventListener('click', () => {
            this.showScreen('difficulty');
        });
    },

    /**
     * Play a sound effect
     */
    playSound: function(type) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch(type) {
            case 'select':
                oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;

            case 'deselect':
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;

            case 'success':
                oscillator.frequency.setValueAtTime(523, ctx.currentTime);
                oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
                break;

            case 'fail':
                oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
                break;

            case 'newpatient':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.setValueAtTime(500, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
        }
    },

    /**
     * Switch screens
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
     * Start a new game
     */
    startGame: function(difficulty) {
        this.state = GameLogic.createInitialState(difficulty);
        this.showScreen('game');
        this.updateUI();
        this.spawnNewPatient();
    },

    /**
     * Spawn a new patient
     */
    spawnNewPatient: function() {
        this.playSound('newpatient');
        
        // Generate patient and herbs
        this.state.currentPatient = GameLogic.generatePatient();
        this.state.availableHerbs = GameLogic.generateAvailableHerbs(this.state);
        this.state.selectedHerbs = [];

        // Update patient display
        const patient = this.state.currentPatient;
        this.elements.patientIcon.textContent = patient.ailmentData.icon;
        this.elements.patientName.textContent = patient.name;
        this.elements.patientAilment.textContent = `${patient.name} ${patient.ailmentData.description}`;

        // Render herbs
        this.renderHerbs();
        this.updateSelectedHerbs();
    },

    /**
     * Render available herbs
     */
    renderHerbs: function() {
        const grid = this.elements.herbGrid;
        grid.innerHTML = '';

        this.state.availableHerbs.forEach(herbKey => {
            const herb = GameLogic.HERBS[herbKey];
            const div = document.createElement('div');
            div.className = 'herb-item';
            div.dataset.herb = herbKey;
            
            if (this.state.selectedHerbs.includes(herbKey)) {
                div.classList.add('selected');
            }

            div.innerHTML = `
                <span class="herb-icon">${herb.icon}</span>
                <span class="herb-name">${herb.name}</span>
                <span class="herb-desc">${herb.description}</span>
            `;

            div.addEventListener('click', () => this.toggleHerb(herbKey));
            grid.appendChild(div);
        });
    },

    /**
     * Toggle herb selection
     */
    toggleHerb: function(herbKey) {
        const wasSelected = this.state.selectedHerbs.includes(herbKey);
        this.state = GameLogic.toggleHerbSelection(this.state, herbKey);
        
        this.playSound(wasSelected ? 'deselect' : 'select');
        
        // Update herb visual
        const herbItems = document.querySelectorAll('.herb-item');
        herbItems.forEach(item => {
            if (item.dataset.herb === herbKey) {
                item.classList.toggle('selected', this.state.selectedHerbs.includes(herbKey));
            }
        });

        this.updateSelectedHerbs();
    },

    /**
     * Update selected herbs display
     */
    updateSelectedHerbs: function() {
        const container = this.elements.selectedHerbs;
        const count = this.state.selectedHerbs.length;
        
        this.elements.herbCount.textContent = `(${count}/3)`;
        this.elements.treatBtn.disabled = count === 0;

        if (count === 0) {
            container.innerHTML = '<p class="empty-selection">Tap herbs below to select them</p>';
        } else {
            container.innerHTML = this.state.selectedHerbs.map(herbKey => {
                const herb = GameLogic.HERBS[herbKey];
                return `
                    <div class="selected-herb">
                        <span class="selected-herb-icon">${herb.icon}</span>
                        <span>${herb.name}</span>
                    </div>
                `;
            }).join('');
        }
    },

    /**
     * Give treatment to patient
     */
    giveTreatment: function() {
        const result = GameLogic.evaluateTreatment(this.state);
        this.state = GameLogic.applyTreatment(this.state, result);

        // Play sound
        this.playSound(result.success ? 'success' : 'fail');

        // Show result modal
        this.elements.resultIcon.textContent = result.success ? '💚' : '💔';
        this.elements.resultTitle.textContent = result.success ? 'Treatment Successful!' : 'Treatment Failed';
        this.elements.resultMessage.textContent = result.message;
        
        // Show which herbs were correct
        const correctHerbs = GameLogic.AILMENTS[this.state.currentPatient?.ailment || 'wounds']?.correctHerbs || [];
        const herbNames = correctHerbs.map(h => GameLogic.HERBS[h]?.name).join(', ');
        this.elements.resultDetails.innerHTML = `
            <p><strong>Good herbs for this ailment:</strong></p>
            <p>${herbNames}</p>
        `;

        // Store patient info before clearing
        this.lastPatient = this.state.currentPatient;

        this.elements.resultModal.classList.add('active');
        this.updateUI();
    },

    /**
     * Continue after seeing result
     */
    continueGame: function() {
        this.elements.resultModal.classList.remove('active');

        if (this.state.gameOver) {
            this.showGameOver();
        } else if (this.state.isResting) {
            this.showRestScreen();
        } else {
            this.spawnNewPatient();
        }
    },

    /**
     * Show rest screen
     */
    showRestScreen: function() {
        this.elements.catsHealed.textContent = this.state.catsHealed;
        this.elements.catsLost.textContent = this.state.catsLost;

        // Set rest message based on performance
        let message = '';
        if (this.state.catsLost === 0) {
            message = 'Perfect night! StarClan smiles upon you. Rest well, medicine cat.';
        } else if (this.state.catsHealed > this.state.catsLost) {
            message = 'You did well tonight. May StarClan guide your paws tomorrow.';
        } else {
            message = 'A difficult night... Learn from your mistakes and try again.';
        }
        this.elements.restMessage.textContent = message;

        this.showScreen('rest');
    },

    /**
     * Start a new night
     */
    startNewNight: function() {
        this.state = GameLogic.startNewNight(this.state);
        this.showScreen('game');
        this.updateUI();
        this.spawnNewPatient();
    },

    /**
     * Show game over screen
     */
    showGameOver: function() {
        this.elements.finalScore.textContent = this.state.score;
        this.elements.finalHealed.textContent = this.state.catsHealed;
        this.elements.finalNights.textContent = this.state.night;

        // Save high score
        GameLogic.saveToStorage('medicineCatData', {
            highScore: Math.max(this.state.score, this.highScore || 0)
        });

        this.showScreen('gameover');
    },

    /**
     * Update UI elements
     */
    updateUI: function() {
        this.elements.nightCount.textContent = this.state.night;
        this.elements.scoreCount.textContent = this.state.score;
        this.elements.reputationFill.style.width = `${this.state.reputation}%`;
    }
};

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

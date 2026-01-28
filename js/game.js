/**
 * Warrior Cat: Two Medicine Cats - Game Controller
 * Handles DOM, events, sounds, and game flow
 */

const Game = {
    state: null,
    audioContext: null,
    screens: {},
    elements: {},
    starCount: 0,
    playerName: '',
    selectedSuffix: '',

    /**
     * Initialize the game
     */
    init: function() {
        // Get all screen elements
        this.screens = {
            home: document.getElementById('home-screen'),
            name: document.getElementById('name-screen'),
            difficulty: document.getElementById('difficulty-screen'),
            game: document.getElementById('game-screen'),
            rest: document.getElementById('rest-screen'),
            gameover: document.getElementById('gameover-screen')
        };

        // Get game elements
        this.elements = {
            starsContainer: document.getElementById('stars-container'),
            playBtn: document.getElementById('play-btn'),
            namePrefix: document.getElementById('name-prefix'),
            suffixGrid: document.getElementById('suffix-grid'),
            fullNamePreview: document.getElementById('full-name-preview'),
            confirmNameBtn: document.getElementById('confirm-name-btn'),
            difficultyGreeting: document.getElementById('difficulty-greeting'),
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
            finalNights: document.getElementById('final-nights'),
            // StarClan elements
            starclanModal: document.getElementById('starclan-modal'),
            starclanSender: document.getElementById('starclan-sender'),
            starclanMessage: document.getElementById('starclan-message'),
            starclanResponseModal: document.getElementById('starclan-response-modal'),
            shareResultIcon: document.getElementById('share-result-icon'),
            shareResultTitle: document.getElementById('share-result-title'),
            shareResultMessage: document.getElementById('share-result-message'),
            starclanContinueBtn: document.getElementById('starclan-continue-btn')
        };

        // Create initial stars
        this.createInitialStars();

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
     * Create initial stars on home screen
     */
    createInitialStars: function() {
        const starTypes = ['⭐', '✨', '🌟', '💫'];
        const container = this.elements.starsContainer;
        
        // Create 15 initial stars
        for (let i = 0; i < 15; i++) {
            this.createStar(container, starTypes, false);
        }
        this.starCount = 15;
    },

    /**
     * Create a single clickable star
     */
    createStar: function(container, starTypes, isNew) {
        const star = document.createElement('span');
        star.className = 'star-clickable' + (isNew ? ' star-new' : '');
        star.textContent = starTypes[Math.floor(Math.random() * starTypes.length)];
        
        // Random position (avoid the center where the title is)
        let top, left;
        do {
            top = Math.random() * 85 + 5; // 5% to 90%
            left = Math.random() * 90 + 5; // 5% to 95%
        } while (top > 25 && top < 65 && left > 20 && left < 80); // Avoid center
        
        star.style.top = top + '%';
        star.style.left = left + '%';
        star.style.animationDelay = (Math.random() * 2) + 's';
        star.style.fontSize = (15 + Math.random() * 15) + 'px';
        
        // Click handler - Easter egg!
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onStarClick(star, container, starTypes);
        });
        
        container.appendChild(star);
    },

    /**
     * Handle star click - spawn more stars!
     */
    onStarClick: function(clickedStar, container, starTypes) {
        this.playSound('starburst');
        
        // Get position of clicked star
        const rect = clickedStar.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const centerX = rect.left - containerRect.left + rect.width / 2;
        const centerY = rect.top - containerRect.top + rect.height / 2;
        
        // Create burst effect
        for (let i = 0; i < 5; i++) {
            const burst = document.createElement('span');
            burst.className = 'star-burst';
            burst.textContent = starTypes[Math.floor(Math.random() * starTypes.length)];
            burst.style.left = centerX + 'px';
            burst.style.top = centerY + 'px';
            burst.style.setProperty('--angle', (i * 72) + 'deg');
            burst.style.transform = `rotate(${i * 72}deg)`;
            container.appendChild(burst);
            
            // Remove burst after animation
            setTimeout(() => burst.remove(), 1000);
        }
        
        // Add 3-5 new permanent stars
        const newStars = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < newStars; i++) {
            setTimeout(() => {
                this.createStar(container, starTypes, true);
                this.starCount++;
            }, i * 100);
        }
        
        // Make clicked star bigger briefly
        clickedStar.style.transform = 'scale(2)';
        setTimeout(() => {
            clickedStar.style.transform = '';
        }, 300);
        
        // Fun console message
        if (this.starCount > 50) {
            console.log('🌟 So many stars! StarClan is pleased!');
        }
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners: function() {
        // Play button on home screen - goes to name screen
        this.elements.playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSound('success');
            this.showScreen('name');
        });

        // Name prefix input
        this.elements.namePrefix.addEventListener('input', () => {
            this.updateNamePreview();
        });

        // Suffix buttons
        document.querySelectorAll('.suffix-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Deselect others
                document.querySelectorAll('.suffix-btn').forEach(b => b.classList.remove('selected'));
                // Select this one
                btn.classList.add('selected');
                this.selectedSuffix = btn.dataset.suffix;
                this.playSound('select');
                this.updateNamePreview();
            });
        });

        // Confirm name button
        this.elements.confirmNameBtn.addEventListener('click', () => {
            const prefix = this.elements.namePrefix.value.trim();
            if (prefix && this.selectedSuffix) {
                // Store the name (with 'paw' for now - apprentice)
                this.playerName = prefix + 'paw';
                this.fullWarriorName = prefix + this.selectedSuffix;
                this.playSound('success');
                
                // Update greeting on difficulty screen
                this.elements.difficultyGreeting.textContent = 
                    `Welcome, ${this.playerName}! How challenging should your training be?`;
                
                this.showScreen('difficulty');
            }
        });

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
            this.showScreen('name');
        });

        // StarClan sharing buttons
        document.querySelectorAll('.btn-share').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                this.handleStarClanChoice(choice);
            });
        });

        // StarClan continue button
        this.elements.starclanContinueBtn.addEventListener('click', () => {
            this.elements.starclanResponseModal.classList.remove('active');
            this.spawnNewPatient();
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

            case 'starburst':
                // Magical sparkle sound
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.05);
                oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(1400, ctx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.25);
                break;
        }
    },

    /**
     * Update name preview
     */
    updateNamePreview: function() {
        const prefix = this.elements.namePrefix.value.trim();
        const suffix = this.selectedSuffix || 'paw';
        
        if (prefix) {
            // Capitalize first letter
            const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
            this.elements.fullNamePreview.textContent = formattedPrefix + suffix;
            
            // Enable button if both prefix and suffix selected
            this.elements.confirmNameBtn.disabled = !this.selectedSuffix;
        } else {
            this.elements.fullNamePreview.textContent = '___paw';
            this.elements.confirmNameBtn.disabled = true;
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
        
        // Check if StarClan sends a welcome message on first night
        if (!this.maybeShowStarClanMessage()) {
            this.spawnNewPatient();
        }
    },

    /**
     * Spawn a new patient
     */
    spawnNewPatient: function() {
        this.playSound('newpatient');
        
        // Generate patient based on difficulty settings, and all herbs
        this.state.currentPatient = GameLogic.generatePatient(this.state.settings);
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
        
        // Check if StarClan sends a message
        if (!this.maybeShowStarClanMessage()) {
            // No StarClan message, spawn patient directly
            this.spawnNewPatient();
        }
        // If StarClan message shown, patient will spawn after player responds
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
    },

    /**
     * Show a StarClan message
     */
    showStarClanMessage: function() {
        const prophecy = GameLogic.getStarClanMessage();
        
        this.elements.starclanSender.textContent = prophecy.sender;
        this.elements.starclanMessage.textContent = `"${prophecy.message}"`;
        
        this.playSound('starburst');
        this.elements.starclanModal.classList.add('active');
    },

    /**
     * Handle player's choice about sharing the prophecy
     */
    handleStarClanChoice: function(choice) {
        const choiceData = GameLogic.SHARING_CHOICES[choice];
        
        // Apply reputation change
        this.state.reputation = Math.min(100, this.state.reputation + choiceData.reputationChange);
        this.state.score += choiceData.reputationChange * 5;
        
        // Hide StarClan modal
        this.elements.starclanModal.classList.remove('active');
        
        // Show response
        this.elements.shareResultIcon.textContent = choiceData.icon;
        this.elements.shareResultTitle.textContent = choiceData.name;
        this.elements.shareResultMessage.textContent = choiceData.response;
        
        this.playSound('select');
        this.elements.starclanResponseModal.classList.add('active');
        
        this.updateUI();
    },

    /**
     * Check if StarClan should send a message (random chance)
     */
    maybeShowStarClanMessage: function() {
        // 30% chance of getting a StarClan message at the start of each night
        if (Math.random() < 0.3) {
            this.showStarClanMessage();
            return true;
        }
        return false;
    }
};

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

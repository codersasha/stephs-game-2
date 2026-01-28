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
    selectedCatIcon: '🐱',
    selectedPattern: 'solid',
    apprentice: null,
    invasionSurvived: true,
    currentSaveSlot: null,
    tutorialLevel: null,
    tutorialHerbIndex: 0,
    tutorialHerbs: [],
    practiceCorrect: 0,

    /**
     * Initialize the game
     */
    init: function() {
        // Get all screen elements
        this.screens = {
            home: document.getElementById('home-screen'),
            tutorial: document.getElementById('tutorial-screen'),
            saves: document.getElementById('saves-screen'),
            name: document.getElementById('name-screen'),
            difficulty: document.getElementById('difficulty-screen'),
            game: document.getElementById('game-screen'),
            rest: document.getElementById('rest-screen'),
            dream: document.getElementById('dream-screen'),
            gameover: document.getElementById('gameover-screen')
        };

        // Get game elements
        this.elements = {
            starsContainer: document.getElementById('stars-container'),
            learnBtn: document.getElementById('learn-btn'),
            playBtn: document.getElementById('play-btn'),
            // Tutorial elements
            mentorSpeech: document.getElementById('mentor-speech'),
            tutorialOptions: document.getElementById('tutorial-options'),
            tutorialLesson: document.getElementById('tutorial-lesson'),
            tutorialPractice: document.getElementById('tutorial-practice'),
            teachingHerbIcon: document.getElementById('teaching-herb-icon'),
            teachingHerbName: document.getElementById('teaching-herb-name'),
            teachingHerbUse: document.getElementById('teaching-herb-use'),
            nextHerbBtn: document.getElementById('next-herb-btn'),
            practiceBtn: document.getElementById('practice-btn'),
            practiceQuestion: document.getElementById('practice-question'),
            practiceOptions: document.getElementById('practice-options'),
            practiceFeedback: document.getElementById('practice-feedback'),
            backToMenuBtn: document.getElementById('back-to-menu-btn'),
            imReadyBtn: document.getElementById('im-ready-btn'),
            savesBackBtn: document.getElementById('saves-back-btn'),
            namePrefix: document.getElementById('name-prefix'),
            suffixGrid: document.getElementById('suffix-grid'),
            fullNamePreview: document.getElementById('full-name-preview'),
            confirmNameBtn: document.getElementById('confirm-name-btn'),
            catPreviewIcon: document.getElementById('cat-preview-icon'),
            patternPreview: document.getElementById('pattern-preview'),
            difficultyGreeting: document.getElementById('difficulty-greeting'),
            sleepBtn: document.getElementById('sleep-btn'),
            sleepingCatIcon: document.getElementById('sleeping-cat-icon'),
            dreamScreen: document.getElementById('dream-screen'),
            dreamContent: document.getElementById('dream-content'),
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
            // Invasion elements
            invasionModal: document.getElementById('invasion-modal'),
            invasionIcon: document.getElementById('invasion-icon'),
            invasionMessage: document.getElementById('invasion-message'),
            invasionResult: document.getElementById('invasion-result'),
            invasionContinueBtn: document.getElementById('invasion-continue-btn'),
            // Apprentice elements
            apprenticeModal: document.getElementById('apprentice-modal'),
            apprenticeName: document.getElementById('apprentice-name'),
            apprenticePersonality: document.getElementById('apprentice-personality'),
            welcomeApprenticeBtn: document.getElementById('welcome-apprentice-btn'),
            apprenticeHint: document.getElementById('apprentice-hint'),
            hintApprenticeName: document.getElementById('hint-apprentice-name'),
            hintText: document.getElementById('hint-text'),
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

        // Load save slots
        this.loadSaveSlots();

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
        // Learn button - goes to tutorial
        this.elements.learnBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSound('select');
            this.showScreen('tutorial');
            this.resetTutorial();
        });

        // Play button on home screen - goes to save slots
        this.elements.playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSound('success');
            this.loadSaveSlots();
            this.showScreen('saves');
        });

        // Tutorial level buttons
        document.querySelectorAll('.btn-tutorial').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startTutorialLevel(btn.dataset.level);
            });
        });

        // Next herb button
        this.elements.nextHerbBtn.addEventListener('click', () => {
            this.nextTutorialHerb();
        });

        // Practice button
        this.elements.practiceBtn.addEventListener('click', () => {
            this.startPractice();
        });

        // Back to menu from tutorial
        this.elements.backToMenuBtn.addEventListener('click', () => {
            this.playSound('select');
            this.showScreen('home');
        });

        // I'm Ready button
        this.elements.imReadyBtn.addEventListener('click', () => {
            this.playSound('success');
            this.loadSaveSlots();
            this.showScreen('saves');
        });

        // Back to menu from saves
        this.elements.savesBackBtn.addEventListener('click', () => {
            this.playSound('select');
            this.showScreen('home');
        });

        // Save slot buttons
        document.querySelectorAll('.btn-slot-play').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectSaveSlot(parseInt(btn.dataset.slot));
            });
        });

        document.querySelectorAll('.btn-slot-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSaveSlot(parseInt(btn.dataset.slot));
            });
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

        // Cat fur color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedCatIcon = btn.dataset.fur;
                this.elements.catPreviewIcon.textContent = this.selectedCatIcon;
                this.playSound('select');
            });
        });

        // Cat pattern buttons
        document.querySelectorAll('.pattern-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedPattern = btn.dataset.pattern;
                this.elements.patternPreview.textContent = this.selectedPattern !== 'solid' ? `(${this.selectedPattern})` : '';
                this.playSound('select');
            });
        });

        // Confirm name button
        this.elements.confirmNameBtn.addEventListener('click', () => {
            const prefix = this.elements.namePrefix.value.trim();
            if (prefix && this.selectedSuffix) {
                // Capitalize first letter
                const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
                
                // Store the name (with 'paw' for now - apprentice)
                this.playerName = formattedPrefix + 'paw';
                this.fullWarriorName = formattedPrefix + this.selectedSuffix;
                this.playSound('success');
                
                // Update greeting on difficulty screen
                this.elements.difficultyGreeting.textContent = 
                    `Welcome, ${this.playerName}! How challenging should your training be?`;
                
                this.showScreen('difficulty');
            }
        });

        // Sleep button
        this.elements.sleepBtn.addEventListener('click', () => {
            this.playSound('select');
            this.enterDream();
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

        // Invasion continue button
        this.elements.invasionContinueBtn.addEventListener('click', () => {
            this.elements.invasionModal.classList.remove('active');
            if (this.invasionSurvived) {
                // Continue playing
                if (!this.maybeShowStarClanMessage()) {
                    this.spawnNewPatient();
                }
            } else {
                // Game over - died in invasion
                this.showGameOver();
            }
        });

        // Welcome apprentice button
        this.elements.welcomeApprenticeBtn.addEventListener('click', () => {
            this.elements.apprenticeModal.classList.remove('active');
            this.playSound('success');
            // Continue to check for StarClan message or spawn patient
            if (!this.maybeShowStarClanMessage()) {
                this.spawnNewPatient();
            }
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
        this.apprentice = null; // Reset apprentice for new game
        this.showScreen('game');
        this.updateUI();
        
        // First check for apprentice (rare on first night but possible)
        if (this.checkForApprentice()) {
            return;
        }
        
        // StarClan messages now happen during sleep
        this.spawnNewPatient();
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
        
        // Show apprentice hint if we have one
        this.showApprenticeHint();
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
     * Show rest/sleep screen
     */
    showRestScreen: function() {
        this.elements.catsHealed.textContent = this.state.catsHealed;
        this.elements.catsLost.textContent = this.state.catsLost;
        
        // Show the player's cat icon sleeping
        this.elements.sleepingCatIcon.textContent = this.selectedCatIcon;

        // Set rest message based on performance
        let message = '';
        if (this.state.catsLost === 0) {
            message = 'Perfect night! Close your eyes and let StarClan visit your dreams...';
        } else if (this.state.catsHealed > this.state.catsLost) {
            message = 'A good night. Time to sleep and see what dreams may come...';
        } else {
            message = 'A difficult night... Perhaps StarClan will send guidance in your dreams.';
        }
        this.elements.restMessage.textContent = message;

        this.showScreen('rest');
    },

    /**
     * Enter the dream state when falling asleep
     */
    enterDream: function() {
        // Check if StarClan sends a message (40% chance during sleep)
        if (Math.random() < 0.4) {
            this.showStarClanDream();
        } else {
            this.showPeacefulSleep();
        }
    },

    /**
     * Show a peaceful sleep (no StarClan message)
     */
    showPeacefulSleep: function() {
        this.elements.dreamContent.innerHTML = `
            <div class="peaceful-sleep">
                <h2>✨ Peaceful Dreams ✨</h2>
                <p>You dream of sunny meadows and gentle streams...</p>
                <p>Your ancestors watch over you from Silverpelt.</p>
                <button class="btn btn-primary" onclick="Game.wakeUp()">
                    ☀️ Wake Up
                </button>
            </div>
        `;
        this.showScreen('dream');
    },

    /**
     * Show StarClan message during dream
     */
    showStarClanDream: function() {
        const prophecy = GameLogic.getStarClanMessage();
        
        this.elements.dreamContent.innerHTML = `
            <div class="dream-starclan">
                <div class="dream-stars">✨⭐✨</div>
                <h2>A Vision from StarClan</h2>
                <p class="dream-sender">💫 ${prophecy.sender} appears before you...</p>
                <div class="dream-prophecy">
                    <p>"${prophecy.message}"</p>
                </div>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 15px;">What will you do with this prophecy?</p>
                <div class="dream-choices">
                    <button class="dream-choice-btn" onclick="Game.handleDreamChoice('secret')">
                        🤫 Keep it to yourself
                    </button>
                    <button class="dream-choice-btn" onclick="Game.handleDreamChoice('leader')">
                        👑 Tell only the leader
                    </button>
                    <button class="dream-choice-btn" onclick="Game.handleDreamChoice('clan')">
                        📢 Tell the whole Clan
                    </button>
                </div>
            </div>
        `;
        this.playSound('starburst');
        this.showScreen('dream');
    },

    /**
     * Handle choice about sharing dream prophecy
     */
    handleDreamChoice: function(choice) {
        const choiceData = GameLogic.SHARING_CHOICES[choice];
        
        // Apply reputation change
        this.state.reputation = Math.min(100, this.state.reputation + choiceData.reputationChange);
        this.state.score += choiceData.reputationChange * 5;
        
        // Show response then wake up
        this.elements.dreamContent.innerHTML = `
            <div class="peaceful-sleep">
                <h2>${choiceData.icon} ${choiceData.name}</h2>
                <p>${choiceData.response}</p>
                <p style="margin-top: 15px; color: rgba(255,255,255,0.7);">The vision fades as dawn approaches...</p>
                <button class="btn btn-primary" onclick="Game.wakeUp()">
                    ☀️ Wake Up
                </button>
            </div>
        `;
        this.playSound('select');
        this.updateUI();
    },

    /**
     * Wake up and start next night
     */
    wakeUp: function() {
        // Save progress before starting new night
        this.saveGame();
        this.startNewNight();
    },

    /**
     * Start a new night
     */
    startNewNight: function() {
        this.state = GameLogic.startNewNight(this.state);
        this.showScreen('game');
        this.updateUI();
        
        // First check for invasion (rare but deadly!)
        if (this.checkForInvasion()) {
            return;
        }
        
        // Then check for apprentice (if don't have one yet)
        if (this.checkForApprentice()) {
            // Apprentice modal shown, rest will happen after welcome
            return;
        }
        
        // StarClan messages now happen during sleep, not here
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
    },

    /**
     * Check if player gets an apprentice
     */
    checkForApprentice: function() {
        if (this.state.hasApprentice) return false;
        
        const newApprentice = GameLogic.checkForApprentice(this.state);
        if (newApprentice) {
            this.apprentice = newApprentice;
            this.state.hasApprentice = true;
            this.showApprenticeModal(newApprentice);
            return true;
        }
        return false;
    },

    /**
     * Show the apprentice arrival modal
     */
    showApprenticeModal: function(apprentice) {
        this.elements.apprenticeName.textContent = apprentice.name;
        this.elements.apprenticePersonality.textContent = `is ${apprentice.personality}`;
        this.playSound('success');
        this.elements.apprenticeModal.classList.add('active');
    },

    /**
     * Check for invasion (5-10% chance)
     */
    checkForInvasion: function() {
        const invasion = GameLogic.checkForInvasion();
        if (invasion) {
            this.showInvasion(invasion);
            return true;
        }
        return false;
    },

    /**
     * Show invasion event
     */
    showInvasion: function(invasion) {
        this.invasionSurvived = invasion.survived;
        
        this.elements.invasionIcon.textContent = invasion.icon;
        this.elements.invasionMessage.textContent = invasion.message;
        
        if (invasion.survived) {
            this.elements.invasionResult.className = 'invasion-result survived';
            this.elements.invasionResult.innerHTML = `
                <h3>✨ You Survived!</h3>
                <p>${invasion.surviveMessage}</p>
            `;
            this.elements.invasionContinueBtn.textContent = 'Thank StarClan! 🙏';
        } else {
            this.elements.invasionResult.className = 'invasion-result died';
            this.elements.invasionResult.innerHTML = `
                <h3>💔 You Have Fallen...</h3>
                <p>${invasion.deathMessage}</p>
                <p style="margin-top: 10px; color: #aaa;">You will join StarClan now...</p>
            `;
            this.elements.invasionContinueBtn.textContent = 'Join StarClan... ⭐';
        }
        
        this.playSound('fail');
        this.elements.invasionModal.classList.add('active');
    },

    /**
     * Show apprentice hint for current patient
     */
    showApprenticeHint: function() {
        if (!this.apprentice || !this.state.currentPatient) {
            this.elements.apprenticeHint.style.display = 'none';
            return;
        }

        // 60% chance apprentice gives a hint
        if (Math.random() < 0.6) {
            const hint = GameLogic.getApprenticeHint(this.state.currentPatient.ailment);
            if (hint) {
                this.elements.hintApprenticeName.textContent = this.apprentice.name + ':';
                this.elements.hintText.textContent = hint;
                this.elements.apprenticeHint.style.display = 'block';
                return;
            }
        }
        
        this.elements.apprenticeHint.style.display = 'none';
    },

    // ==================== TUTORIAL SYSTEM ====================

    /**
     * Reset tutorial to initial state
     */
    resetTutorial: function() {
        this.elements.tutorialOptions.style.display = 'block';
        this.elements.tutorialLesson.style.display = 'none';
        this.elements.tutorialPractice.style.display = 'none';
        this.elements.imReadyBtn.style.display = 'none';
        this.elements.mentorSpeech.innerHTML = '<p>"Welcome, young one! I am Healingheart, and I will teach you the ways of a medicine cat."</p>';
        this.practiceCorrect = 0;
    },

    /**
     * Start a tutorial level
     */
    startTutorialLevel: function(level) {
        this.tutorialLevel = level;
        this.tutorialHerbIndex = 0;
        this.playSound('select');

        // Get herbs based on difficulty
        const allHerbs = Object.entries(GameLogic.HERBS);
        if (level === 'easy') {
            this.tutorialHerbs = allHerbs.slice(0, 4); // First 4 herbs
        } else if (level === 'medium') {
            this.tutorialHerbs = allHerbs.slice(4, 8); // Middle 4 herbs
        } else {
            this.tutorialHerbs = allHerbs.slice(8); // Last herbs
        }

        this.elements.tutorialOptions.style.display = 'none';
        this.elements.tutorialLesson.style.display = 'block';
        this.elements.mentorSpeech.innerHTML = '<p>"Let me teach you about these herbs. Pay attention!"</p>';
        
        this.showTutorialHerb();
    },

    /**
     * Show current tutorial herb
     */
    showTutorialHerb: function() {
        const [key, herb] = this.tutorialHerbs[this.tutorialHerbIndex];
        
        this.elements.teachingHerbIcon.textContent = herb.icon;
        this.elements.teachingHerbName.textContent = herb.name;
        this.elements.teachingHerbUse.textContent = herb.description;

        // Update mentor speech
        const speeches = [
            `"This is ${herb.name}. Remember, it ${herb.description.toLowerCase()}."`,
            `"${herb.name} is very important. It ${herb.description.toLowerCase()}."`,
            `"Pay attention to ${herb.name}. A good medicine cat knows it ${herb.description.toLowerCase()}."`
        ];
        this.elements.mentorSpeech.innerHTML = `<p>${speeches[Math.floor(Math.random() * speeches.length)]}</p>`;

        // Update button text
        if (this.tutorialHerbIndex >= this.tutorialHerbs.length - 1) {
            this.elements.nextHerbBtn.textContent = "That's all!";
            this.elements.nextHerbBtn.disabled = true;
        } else {
            this.elements.nextHerbBtn.textContent = "Next Herb →";
            this.elements.nextHerbBtn.disabled = false;
        }
    },

    /**
     * Go to next tutorial herb
     */
    nextTutorialHerb: function() {
        this.tutorialHerbIndex++;
        this.playSound('select');
        
        if (this.tutorialHerbIndex < this.tutorialHerbs.length) {
            this.showTutorialHerb();
        }
    },

    /**
     * Start practice mode
     */
    startPractice: function() {
        this.playSound('select');
        this.elements.tutorialLesson.style.display = 'none';
        this.elements.tutorialPractice.style.display = 'block';
        this.elements.mentorSpeech.innerHTML = '<p>"Now let\'s see what you remember! Choose the correct herb."</p>';
        
        this.showPracticeQuestion();
    },

    /**
     * Show a practice question
     */
    showPracticeQuestion: function() {
        // Pick a random herb from what we learned
        const [correctKey, correctHerb] = this.tutorialHerbs[Math.floor(Math.random() * this.tutorialHerbs.length)];
        
        this.elements.practiceQuestion.textContent = `What herb ${correctHerb.description.toLowerCase()}?`;
        this.elements.practiceFeedback.textContent = '';
        
        // Create options (correct + 3 wrong)
        let options = [[correctKey, correctHerb]];
        const allHerbs = Object.entries(GameLogic.HERBS);
        while (options.length < 4) {
            const random = allHerbs[Math.floor(Math.random() * allHerbs.length)];
            if (!options.find(o => o[0] === random[0])) {
                options.push(random);
            }
        }
        
        // Shuffle options
        options = options.sort(() => Math.random() - 0.5);
        
        this.elements.practiceOptions.innerHTML = options.map(([key, herb]) => `
            <button class="practice-option" data-herb="${key}" data-correct="${key === correctKey}">
                ${herb.icon} ${herb.name}
            </button>
        `).join('');

        // Add click handlers
        this.elements.practiceOptions.querySelectorAll('.practice-option').forEach(btn => {
            btn.addEventListener('click', () => this.checkPracticeAnswer(btn));
        });
    },

    /**
     * Check practice answer
     */
    checkPracticeAnswer: function(btn) {
        const isCorrect = btn.dataset.correct === 'true';
        
        // Disable all buttons
        this.elements.practiceOptions.querySelectorAll('.practice-option').forEach(b => {
            b.style.pointerEvents = 'none';
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            } else if (b === btn && !isCorrect) {
                b.classList.add('wrong');
            }
        });

        if (isCorrect) {
            this.playSound('success');
            this.practiceCorrect++;
            this.elements.practiceFeedback.textContent = '✅ Correct! Well done!';
            this.elements.mentorSpeech.innerHTML = '<p>"Excellent! You remembered that one!"</p>';
        } else {
            this.playSound('fail');
            this.elements.practiceFeedback.textContent = '❌ Not quite. Look at the correct answer.';
            this.elements.mentorSpeech.innerHTML = '<p>"That\'s okay, keep learning. Look at the green one."</p>';
        }

        // Show I'm Ready button after some practice
        if (this.practiceCorrect >= 2) {
            this.elements.imReadyBtn.style.display = 'block';
        }

        // Next question after delay
        setTimeout(() => {
            this.showPracticeQuestion();
        }, 2000);
    },

    // ==================== SAVE SYSTEM ====================

    /**
     * Load and display save slots
     */
    loadSaveSlots: function() {
        for (let i = 1; i <= 3; i++) {
            const saveData = GameLogic.loadFromStorage(`saveSlot${i}`);
            const nameEl = document.getElementById(`slot-name-${i}`);
            const detailsEl = document.getElementById(`slot-details-${i}`);
            const iconEl = document.getElementById(`slot-icon-${i}`);
            const deleteBtn = document.querySelector(`.btn-slot-delete[data-slot="${i}"]`);
            const playBtn = document.querySelector(`.btn-slot-play[data-slot="${i}"]`);

            if (saveData) {
                nameEl.textContent = saveData.playerName || 'Unknown';
                detailsEl.textContent = `Night ${saveData.night || 1} | Score: ${saveData.score || 0}`;
                iconEl.textContent = saveData.catIcon || '🐱';
                deleteBtn.style.display = 'block';
                playBtn.textContent = 'Continue';
            } else {
                nameEl.textContent = 'Empty Slot';
                detailsEl.textContent = 'Start a new adventure';
                iconEl.textContent = '🐱';
                deleteBtn.style.display = 'none';
                playBtn.textContent = 'New Game';
            }
        }
    },

    /**
     * Select a save slot
     */
    selectSaveSlot: function(slot) {
        this.currentSaveSlot = slot;
        const saveData = GameLogic.loadFromStorage(`saveSlot${slot}`);
        
        if (saveData) {
            // Load existing game
            this.playerName = saveData.playerName;
            this.fullWarriorName = saveData.fullWarriorName;
            this.selectedCatIcon = saveData.catIcon;
            this.selectedPattern = saveData.pattern;
            this.apprentice = saveData.apprentice;
            this.state = saveData.state;
            
            this.playSound('success');
            this.showScreen('game');
            this.updateUI();
            this.spawnNewPatient();
        } else {
            // New game - go to name screen
            this.playSound('select');
            this.showScreen('name');
        }
    },

    /**
     * Delete a save slot
     */
    deleteSaveSlot: function(slot) {
        if (confirm('Are you sure you want to delete this save?')) {
            localStorage.removeItem(`saveSlot${slot}`);
            this.playSound('select');
            this.loadSaveSlots();
        }
    },

    /**
     * Save current game to slot
     */
    saveGame: function() {
        if (!this.currentSaveSlot) return;
        
        const saveData = {
            playerName: this.playerName,
            fullWarriorName: this.fullWarriorName,
            catIcon: this.selectedCatIcon,
            pattern: this.selectedPattern,
            apprentice: this.apprentice,
            state: this.state,
            night: this.state.night,
            score: this.state.score
        };
        
        GameLogic.saveToStorage(`saveSlot${this.currentSaveSlot}`, saveData);
    }
};

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

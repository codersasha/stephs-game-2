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
    playerAge: 8,
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
            gameover: document.getElementById('gameover-screen'),
            starclan: document.getElementById('starclan-screen')
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
            ageHint: document.getElementById('age-hint'),
            difficultyGreeting: document.getElementById('difficulty-greeting'),
            playerIcon: document.getElementById('player-icon'),
            playerNameDisplay: document.getElementById('player-name-display'),
            playerAgeDisplay: document.getElementById('player-age-display'),
            patientAge: document.getElementById('patient-age'),
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
            joinStarclanBtn: document.getElementById('join-starclan-btn'),
            starclanBackBtn: document.getElementById('starclan-back-btn'),
            starclanPlayerName: document.getElementById('starclan-player-name'),
            starclanAncestors: document.getElementById('starclan-ancestors'),
            dreamVisitBtn: document.getElementById('dream-visit-btn'),
            streamBtn: document.getElementById('stream-btn'),
            portalBtn: document.getElementById('portal-btn'),
            dreamVisitModal: document.getElementById('dream-visit-modal'),
            dreamCatName: document.getElementById('dream-cat-name'),
            dreamVisitClose: document.getElementById('dream-visit-close'),
            streamModal: document.getElementById('stream-modal'),
            visionText: document.getElementById('vision-text'),
            streamClose: document.getElementById('stream-close'),
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

        // StarClan buttons
        this.elements.joinStarclanBtn.addEventListener('click', () => {
            this.playSound('starburst');
            this.enterStarClan();
        });

        this.elements.starclanBackBtn.addEventListener('click', () => {
            this.playSound('select');
            this.showScreen('home');
        });

        this.elements.dreamVisitBtn.addEventListener('click', () => {
            this.startDreamVisit();
        });

        this.elements.streamBtn.addEventListener('click', () => {
            this.openStream();
        });

        this.elements.portalBtn.addEventListener('click', () => {
            this.portalToNewLife();
        });

        this.elements.dreamVisitClose.addEventListener('click', () => {
            this.elements.dreamVisitModal.classList.remove('active');
            // Reset to step 1 for next time
            this.showDreamStep(1);
        });

        this.elements.streamClose.addEventListener('click', () => {
            this.elements.streamModal.classList.remove('active');
        });

        // Dream visit step 1: message choices
        document.querySelectorAll('#message-choices .btn-dream-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectDreamMessage(btn.dataset.msg, btn.textContent);
            });
        });

        // Dream visit step 2: meaning choices
        document.querySelectorAll('#meaning-choices .btn-dream-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectDreamMeaning(btn.dataset.meaning, btn.textContent);
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

        // Age buttons
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.playerAge = parseInt(btn.dataset.age);
                this.updateAgeHint();
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
     * Update age hint text
     */
    updateAgeHint: function() {
        const hints = {
            6: "Just became an apprentice!",
            8: "Learning the ways of medicine",
            10: "Almost a full medicine cat!",
            12: "Ready for your ceremony!"
        };
        this.elements.ageHint.textContent = hints[this.playerAge] || "";
    },

    /**
     * Get age type based on moons
     */
    getAgeType: function(moons) {
        if (moons < 6) return 'kit';
        if (moons < 12) return 'apprentice';
        if (moons < 96) return 'warrior';
        return 'elder';
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

        // Generate random age for patient
        const patient = this.state.currentPatient;
        patient.age = this.generatePatientAge();
        const ageType = this.getAgeType(patient.age);
        
        // Update patient display
        this.elements.patientIcon.textContent = patient.ailmentData.icon;
        this.elements.patientName.textContent = patient.name;
        this.elements.patientAge.innerHTML = `${patient.age} moons old <span class="age-type">${ageType}</span>`;
        this.elements.patientAilment.textContent = `${patient.name} ${patient.ailmentData.description}`;

        // Update player display
        this.elements.playerIcon.textContent = this.selectedCatIcon;
        this.elements.playerNameDisplay.textContent = this.playerName;
        this.elements.playerAgeDisplay.textContent = `${this.playerAge} moons`;

        // Render herbs
        this.renderHerbs();
        this.updateSelectedHerbs();
        
        // Show apprentice hint if we have one
        this.showApprenticeHint();
    },

    /**
     * Generate a random age for a patient
     */
    generatePatientAge: function() {
        // Different probabilities for different age groups
        const roll = Math.random();
        if (roll < 0.15) {
            // Kit (1-5 moons)
            return Math.floor(Math.random() * 5) + 1;
        } else if (roll < 0.35) {
            // Apprentice (6-11 moons)
            return Math.floor(Math.random() * 6) + 6;
        } else if (roll < 0.85) {
            // Warrior (12-80 moons)
            return Math.floor(Math.random() * 69) + 12;
        } else {
            // Elder (81-150 moons)
            return Math.floor(Math.random() * 70) + 81;
        }
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
        // StarClan only sends messages when something meaningful is about to happen
        // Check if there's a prophecy-worthy event coming
        const upcomingEvent = this.checkForUpcomingEvent();
        
        if (upcomingEvent) {
            // StarClan has something important to share
            this.showStarClanDream(upcomingEvent);
        } else {
            this.showPeacefulSleep();
        }
    },

    /**
     * Check if there's an upcoming event worth a prophecy
     * Returns the event type or null if nothing special
     */
    checkForUpcomingEvent: function() {
        // Only ~15% chance of any prophecy, and only if something is happening
        if (Math.random() > 0.15) {
            return null;
        }

        // Possible meaningful events that could trigger prophecy
        const possibleEvents = [];

        // After many nights, higher chance of invasion warning
        if (this.state.night > 3 && Math.random() < 0.3) {
            possibleEvents.push('invasion');
        }

        // If reputation is dropping, warning about trust
        if (this.state.reputation < 60) {
            possibleEvents.push('trust');
        }

        // Random chance of other prophecies
        if (Math.random() < 0.2) {
            possibleEvents.push('hope');
        }
        if (Math.random() < 0.15) {
            possibleEvents.push('change');
        }
        if (Math.random() < 0.1) {
            possibleEvents.push('stranger');
        }

        // If no events, return null (peaceful sleep)
        if (possibleEvents.length === 0) {
            return null;
        }

        // Pick a random event from the possible ones
        return possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
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
     * Get a prophecy based on upcoming event
     */
    getProphecyForEvent: function(eventType) {
        const prophecies = {
            invasion: {
                senders: ['Bluestar', 'Firestar', 'Tallstar'],
                messages: [
                    "Blood will stain the forest floor before the next full moon...",
                    "Claws sharpen in the shadows. Be ready, young one.",
                    "The border will run red. Prepare your Clan.",
                    "Enemies gather where the two rivers meet..."
                ]
            },
            trust: {
                senders: ['Yellowfang', 'Cinderpelt', 'Spottedleaf'],
                messages: [
                    "A medicine cat's greatest herb is trust. Nurture it well.",
                    "Your path wavers. Remember why you chose to heal.",
                    "The Clan watches you. Show them your heart is true.",
                    "Doubt clouds the minds of warriors. Prove your worth."
                ]
            },
            hope: {
                senders: ['Spottedleaf', 'Feathertail', 'Silverstream'],
                messages: [
                    "New life will bring joy when the leaf-bare ends.",
                    "Light shines brightest after the darkest night.",
                    "A kit born under stars will bring great things.",
                    "Hope blooms where you least expect it."
                ]
            },
            change: {
                senders: ['Bluestar', 'Crookedstar', 'Leopardstar'],
                messages: [
                    "The old ways must bend, or they will break.",
                    "Change comes on swift paws. Embrace it.",
                    "What was will not always be. Prepare for the new.",
                    "The forest shifts. So must you."
                ]
            },
            stranger: {
                senders: ['Firestar', 'Cloudstar', 'Skywatcher'],
                messages: [
                    "A stranger walks toward your borders with secrets to tell.",
                    "Not all who wander are lost. Welcome the traveler.",
                    "Eyes from beyond the territories seek your Clan.",
                    "One from far away brings news of distant lands."
                ]
            }
        };

        const eventProphecy = prophecies[eventType] || prophecies.hope;
        const sender = eventProphecy.senders[Math.floor(Math.random() * eventProphecy.senders.length)];
        const message = eventProphecy.messages[Math.floor(Math.random() * eventProphecy.messages.length)];

        return { sender, message, eventType };
    },

    /**
     * Show StarClan message during dream
     */
    showStarClanDream: function(eventType) {
        const prophecy = this.getProphecyForEvent(eventType);
        
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
            this.playerAge = saveData.playerAge || 8;
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
            playerAge: this.playerAge,
            apprentice: this.apprentice,
            state: this.state,
            night: this.state.night,
            score: this.state.score
        };
        
        GameLogic.saveToStorage(`saveSlot${this.currentSaveSlot}`, saveData);
    },

    // ==================== STARCLAN AFTERLIFE ====================

    /**
     * Enter StarClan after death
     */
    enterStarClan: function() {
        // Show player's StarClan name (with full warrior suffix now)
        this.elements.starclanPlayerName.textContent = this.fullWarriorName || this.playerName;
        
        // Add ancestor cats
        this.populateAncestors();
        
        this.showScreen('starclan');
    },

    /**
     * Populate StarClan with ancestor spirits
     */
    populateAncestors: function() {
        const ancestors = ['😺', '🐱', '😸', '🐈', '😻'];
        const names = ['Bluestar', 'Yellowfang', 'Firestar', 'Spottedleaf', 'Cinderpelt'];
        
        this.elements.starclanAncestors.innerHTML = ancestors.map((cat, i) => `
            <div class="ancestor-cat" title="${names[i]}">${cat}</div>
        `).join('');
    },

    // Dream visit state
    dreamVisitData: {
        message: '',
        messageText: '',
        meaning: '',
        meaningText: '',
        targetCat: '',
        targetRole: ''
    },

    /**
     * Start a dream visit to a living cat
     */
    startDreamVisit: function() {
        // Reset to step 1
        this.dreamVisitData = { message: '', messageText: '', meaning: '', meaningText: '', targetCat: '', targetRole: '' };
        this.showDreamStep(1);
        this.playSound('starburst');
        this.elements.dreamVisitModal.classList.add('active');
    },

    /**
     * Show a specific dream step
     */
    showDreamStep: function(step) {
        document.querySelectorAll('.dream-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`dream-step-${step}`).classList.add('active');
    },

    /**
     * Step 1: Select the message/prophecy words
     */
    selectDreamMessage: function(msgKey, msgText) {
        this.dreamVisitData.message = msgKey;
        this.dreamVisitData.messageText = msgText;
        
        // Show in step 2
        document.getElementById('selected-message').textContent = msgText;
        
        this.playSound('select');
        this.showDreamStep(2);
    },

    /**
     * Step 2: Select the meaning
     */
    selectDreamMeaning: function(meaningKey, meaningText) {
        this.dreamVisitData.meaning = meaningKey;
        this.dreamVisitData.meaningText = meaningText;
        
        // Show full message in step 3
        document.getElementById('selected-full-msg').textContent = 
            `${this.dreamVisitData.messageText} (${meaningText})`;
        
        // Populate cat choices
        this.populateDreamCatChoices();
        
        this.playSound('select');
        this.showDreamStep(3);
    },

    /**
     * Populate the cat choices for dream visit
     */
    populateDreamCatChoices: function() {
        const cats = [
            { name: 'Bramblestar', role: 'Leader', icon: '🦁' },
            { name: 'Squirrelflight', role: 'Deputy', icon: '🐱' },
            { name: 'Jayfeather', role: 'Medicine Cat', icon: '😺' },
            { name: 'Lionblaze', role: 'Warrior', icon: '🦊' },
            { name: 'Dovewing', role: 'Warrior', icon: '🐈' },
            { name: 'Ivypool', role: 'Warrior', icon: '😸' },
            { name: 'Alderheart', role: 'Medicine Cat', icon: '🐱' },
            { name: 'Sparkpelt', role: 'Warrior', icon: '😻' }
        ];

        const container = document.getElementById('cat-choices');
        container.innerHTML = cats.map(cat => `
            <button class="cat-choice-btn" data-cat="${cat.name}" data-role="${cat.role}">
                <span class="cat-choice-icon">${cat.icon}</span>
                <span class="cat-choice-name">${cat.name}</span>
                <span class="cat-choice-role">${cat.role}</span>
            </button>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.cat-choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectDreamCat(btn.dataset.cat, btn.dataset.role);
            });
        });
    },

    /**
     * Step 3: Select which cat receives the dream
     */
    selectDreamCat: function(catName, catRole) {
        this.dreamVisitData.targetCat = catName;
        this.dreamVisitData.targetRole = catRole;
        
        // Show delivery
        this.deliverDream();
    },

    /**
     * Deliver the dream to the chosen cat
     */
    deliverDream: function() {
        const { messageText, meaningText, targetCat, targetRole } = this.dreamVisitData;
        
        this.elements.dreamCatName.textContent = targetCat;
        document.getElementById('your-message').textContent = messageText;
        
        // Generate reaction based on meaning and role
        const reactions = {
            danger: [
                `${targetCat} wakes with a start, fur bristling. "I must warn the Clan!"`,
                `The ${targetRole.toLowerCase()}'s eyes widen. "StarClan... I will be vigilant."`,
                `${targetCat} nods solemnly. "I understand. We must prepare."`
            ],
            hope: [
                `${targetCat}'s eyes shimmer with tears of joy. "Thank you, StarClan!"`,
                `A warm smile spreads across ${targetCat}'s face. "This gives me strength."`,
                `The ${targetRole.toLowerCase()} purrs softly. "I will hold onto this hope."`
            ],
            betrayal: [
                `${targetCat} looks troubled. "Who would betray us...?"`,
                `The ${targetRole.toLowerCase()}'s ears flatten. "I will watch carefully."`,
                `${targetCat} hisses softly. "I won't let this happen."`
            ],
            hero: [
                `${targetCat} stands taller. "Could it be... me?"`,
                `The ${targetRole.toLowerCase()} looks determined. "I will do what I must."`,
                `${targetCat}'s eyes glow with purpose. "I am ready."`
            ],
            journey: [
                `${targetCat} gazes toward the horizon. "Where must I go?"`,
                `The ${targetRole.toLowerCase()} nods. "I will follow the path StarClan shows."`,
                `${targetCat} stretches, ready for adventure. "I will find the way."`
            ],
            secret: [
                `${targetCat}'s ears prick up. "What secret? Tell me more!"`,
                `The ${targetRole.toLowerCase()} looks curious. "The truth will come out..."`,
                `${targetCat} narrows their eyes. "I will uncover it."`
            ]
        };
        
        const meaningReactions = reactions[this.dreamVisitData.meaning] || reactions.hope;
        const reaction = meaningReactions[Math.floor(Math.random() * meaningReactions.length)];
        
        document.getElementById('cat-reaction').textContent = reaction;
        
        this.playSound('success');
        this.showDreamStep(4);
    },

    /**
     * Open the Pool of Stars stream
     */
    openStream: function() {
        const visions = [
            "You see your old Clan... they are thriving.",
            "A young kit plays where you once walked...",
            "The medicine den has a new cat now, learning the herbs.",
            "Warriors patrol the borders, keeping the Clan safe.",
            "A new leader receives their nine lives at the Moonpool...",
            "Kits are being born in the nursery. Life continues.",
            "The forest changes with the seasons, but the Clan endures.",
            "Your apprentice has become a skilled medicine cat."
        ];
        
        const vision = visions[Math.floor(Math.random() * visions.length)];
        this.elements.visionText.textContent = vision;
        
        this.playSound('starburst');
        this.elements.streamModal.classList.add('active');
    },

    /**
     * Portal to a new life (restart game)
     */
    portalToNewLife: function() {
        this.playSound('success');
        
        // Delete current save if exists
        if (this.currentSaveSlot) {
            localStorage.removeItem(`saveSlot${this.currentSaveSlot}`);
        }
        
        // Go to save selection for new life
        this.loadSaveSlots();
        this.showScreen('saves');
    }
};

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

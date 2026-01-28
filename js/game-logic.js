/**
 * Warrior Cat: Two Medicine Cats - Game Logic
 * Pure functions for game mechanics
 */

const GameLogic = {
    // All available herbs in the game
    HERBS: {
        cobwebs: {
            name: 'Cobwebs',
            description: 'Stops bleeding',
            icon: '🕸️',
            color: '#e0e0e0'
        },
        marigold: {
            name: 'Marigold',
            description: 'Heals wounds and infections',
            icon: '🌼',
            color: '#ffd700'
        },
        poppy: {
            name: 'Poppy Seeds',
            description: 'Helps with pain and sleep',
            icon: '🌺',
            color: '#ff6b6b'
        },
        catmint: {
            name: 'Catmint',
            description: 'Cures greencough',
            icon: '🌿',
            color: '#98d8aa'
        },
        juniper: {
            name: 'Juniper Berries',
            description: 'Helps with bellyache and breathing',
            icon: '🫐',
            color: '#6b5b95'
        },
        horsetail: {
            name: 'Horsetail',
            description: 'Treats infections',
            icon: '🌾',
            color: '#8fbc8f'
        },
        feverfew: {
            name: 'Feverfew',
            description: 'Reduces fever and headaches',
            icon: '🌸',
            color: '#ffb6c1'
        },
        borage: {
            name: 'Borage Leaves',
            description: 'Helps nursing queens make milk',
            icon: '🍃',
            color: '#90ee90'
        },
        thyme: {
            name: 'Thyme',
            description: 'Calms anxiety and shock',
            icon: '🌱',
            color: '#9acd32'
        },
        honey: {
            name: 'Honey',
            description: 'Soothes sore throats',
            icon: '🍯',
            color: '#daa520'
        },
        chamomile: {
            name: 'Chamomile',
            description: 'Strengthens the heart and calms',
            icon: '🌼',
            color: '#fffacd'
        },
        dock: {
            name: 'Dock Leaves',
            description: 'Soothes scratches and sore pads',
            icon: '🥬',
            color: '#228b22'
        }
    },

    // Ailments and their correct treatments
    AILMENTS: {
        greencough: {
            name: 'Greencough',
            description: 'is coughing badly and has trouble breathing',
            correctHerbs: ['catmint', 'honey'],
            requiredCorrect: 1, // Need at least 1 correct
            icon: '🤒',
            severity: 'serious'
        },
        wounds: {
            name: 'Battle Wounds',
            description: 'has deep scratches from a battle',
            correctHerbs: ['cobwebs', 'marigold', 'horsetail'],
            requiredCorrect: 2,
            icon: '🩹',
            severity: 'medium'
        },
        bellyache: {
            name: 'Bellyache',
            description: 'has a terrible tummy ache',
            correctHerbs: ['juniper', 'chamomile'],
            requiredCorrect: 1,
            icon: '😿',
            severity: 'mild'
        },
        fever: {
            name: 'High Fever',
            description: 'is burning up with fever',
            correctHerbs: ['feverfew', 'borage'],
            requiredCorrect: 1,
            icon: '🌡️',
            severity: 'serious'
        },
        shock: {
            name: 'Shock',
            description: 'is in shock after a scary experience',
            correctHerbs: ['thyme', 'poppy', 'chamomile'],
            requiredCorrect: 1,
            icon: '😰',
            severity: 'medium'
        },
        sorethroat: {
            name: 'Sore Throat',
            description: 'can barely meow because of a sore throat',
            correctHerbs: ['honey', 'catmint'],
            requiredCorrect: 1,
            icon: '😾',
            severity: 'mild'
        },
        sorepads: {
            name: 'Sore Pads',
            description: 'has cracked and sore paw pads',
            correctHerbs: ['dock', 'marigold'],
            requiredCorrect: 1,
            icon: '🐾',
            severity: 'mild'
        },
        infection: {
            name: 'Infected Wound',
            description: 'has an infected wound that smells bad',
            correctHerbs: ['marigold', 'horsetail', 'cobwebs'],
            requiredCorrect: 2,
            icon: '🤕',
            severity: 'serious'
        },
        whitecough: {
            name: 'Whitecough',
            description: 'has a mild cough and sniffles',
            correctHerbs: ['catmint', 'honey', 'feverfew'],
            requiredCorrect: 1,
            icon: '🤧',
            severity: 'mild'
        },
        anxiety: {
            name: 'Anxiety',
            description: 'is very nervous and cannot calm down',
            correctHerbs: ['thyme', 'chamomile', 'poppy'],
            requiredCorrect: 1,
            icon: '😰',
            severity: 'mild'
        }
    },

    // StarClan prophecies and messages
    STARCLAN_MESSAGES: [
        {
            message: "Beware the shadow that creeps through the forest...",
            sender: "Bluestar"
        },
        {
            message: "When the moon runs red, danger comes to the Clan.",
            sender: "Yellowfang"
        },
        {
            message: "Trust in your healing paws, young one. They will guide you.",
            sender: "Spottedleaf"
        },
        {
            message: "A storm is coming. The Clan must stand together.",
            sender: "Firestar"
        },
        {
            message: "Look to the stars when hope seems lost.",
            sender: "Cinderpelt"
        },
        {
            message: "Three will become one, and the forest will be saved.",
            sender: "Midnight"
        },
        {
            message: "The darkest hour is just before dawn.",
            sender: "Tallstar"
        },
        {
            message: "Water will wash away the old, and bring forth the new.",
            sender: "Crookedstar"
        },
        {
            message: "A new warrior rises with the sun.",
            sender: "Lionheart"
        },
        {
            message: "Healing comes not just from herbs, but from the heart.",
            sender: "Leafpool"
        },
        {
            message: "The path ahead is difficult, but you are not alone.",
            sender: "Jayfeather"
        },
        {
            message: "Blood will spill blood, unless peace is chosen.",
            sender: "Bramblestar"
        },
        {
            message: "Keep your friends close, medicine cat.",
            sender: "Ravenpaw"
        },
        {
            message: "The herbs you seek grow where the sun meets shadow.",
            sender: "Mudfur"
        },
        {
            message: "Your ancestors walk beside you always.",
            sender: "Silverstream"
        }
    ],

    /**
     * Get a random StarClan message
     */
    getStarClanMessage: function() {
        const index = Math.floor(Math.random() * this.STARCLAN_MESSAGES.length);
        return this.STARCLAN_MESSAGES[index];
    },

    /**
     * Sharing choices and their effects
     */
    SHARING_CHOICES: {
        secret: {
            name: "Keep it secret",
            description: "Hold this message close to your heart",
            icon: "🤫",
            reputationChange: 0,
            response: "You keep the prophecy hidden in your heart. Perhaps the time is not right to share it..."
        },
        onecat: {
            name: "Tell one trusted friend",
            description: "Share with a close clanmate",
            icon: "🐱",
            reputationChange: 2,
            response: "Your friend listens carefully and promises to help watch for signs."
        },
        leader: {
            name: "Tell the leader",
            description: "Report to your Clan leader",
            icon: "👑",
            reputationChange: 5,
            response: "The leader nods thoughtfully. 'Thank you for telling me, medicine cat. We will be vigilant.'"
        },
        clan: {
            name: "Tell the whole Clan",
            description: "Announce at a Clan meeting",
            icon: "📢",
            reputationChange: 3,
            response: "The Clan murmurs with concern, but they are grateful to know what StarClan has shared."
        }
    },

    // Possible apprentice names (kit names that become paw)
    APPRENTICE_NAMES: [
        { prefix: 'Moss', personality: 'curious and eager to learn' },
        { prefix: 'Fern', personality: 'gentle and caring' },
        { prefix: 'Bramble', personality: 'determined and hardworking' },
        { prefix: 'Leaf', personality: 'calm and thoughtful' },
        { prefix: 'Willow', personality: 'graceful and patient' },
        { prefix: 'Echo', personality: 'quiet but observant' },
        { prefix: 'Dawn', personality: 'bright and optimistic' },
        { prefix: 'Honey', personality: 'sweet and helpful' },
        { prefix: 'Spotted', personality: 'clever and quick' },
        { prefix: 'Feather', personality: 'light-footed and gentle' },
        { prefix: 'Cloud', personality: 'dreamy but talented' },
        { prefix: 'Ivy', personality: 'sharp and dedicated' }
    ],

    /**
     * Generate a random apprentice
     */
    generateApprentice: function() {
        const apprentice = this.APPRENTICE_NAMES[Math.floor(Math.random() * this.APPRENTICE_NAMES.length)];
        return {
            name: apprentice.prefix + 'paw',
            prefix: apprentice.prefix,
            personality: apprentice.personality
        };
    },

    /**
     * Check if player gets an apprentice (10-30% chance per night)
     */
    checkForApprentice: function(state) {
        // Don't give another apprentice if already have one
        if (state.hasApprentice) {
            return null;
        }
        
        // Base 15% chance, increases slightly each night without one
        const baseChance = 0.15;
        const bonusChance = (state.night - 1) * 0.03; // +3% per night
        const totalChance = Math.min(0.30, baseChance + bonusChance); // Max 30%
        
        if (Math.random() < totalChance) {
            return this.generateApprentice();
        }
        return null;
    },

    /**
     * Get apprentice hint for current ailment
     */
    getApprenticeHint: function(ailmentKey) {
        const ailment = this.AILMENTS[ailmentKey];
        if (!ailment) return null;
        
        // Apprentice suggests one correct herb
        const correctHerb = ailment.correctHerbs[Math.floor(Math.random() * ailment.correctHerbs.length)];
        const herbData = this.HERBS[correctHerb];
        
        const hints = [
            `Maybe we should try ${herbData.name}? I read about it...`,
            `I think ${herbData.name} might help with this!`,
            `What about ${herbData.name}? It ${herbData.description.toLowerCase()}.`,
            `I remember learning that ${herbData.name} is good for this...`
        ];
        
        return hints[Math.floor(Math.random() * hints.length)];
    },

    // Cat names for patients
    CAT_NAMES: [
        'Fernpaw', 'Thornkit', 'Brambleclaw', 'Squirrelflight', 'Leafpool',
        'Jayfeather', 'Lionblaze', 'Hollyleaf', 'Dovewing', 'Ivypool',
        'Firestar', 'Graystripe', 'Sandstorm', 'Dustpelt', 'Ravenpaw',
        'Cloudtail', 'Brightheart', 'Whitewing', 'Birchfall', 'Berrynose',
        'Mousewhisker', 'Cinderheart', 'Poppyfrost', 'Honeyfern', 'Molepaw',
        'Cherrypaw', 'Molekit', 'Lilykit', 'Seedkit', 'Snowkit'
    ],

    // Difficulty settings
    DIFFICULTY: {
        easy: {
            name: 'Easy',
            description: 'Simple sicknesses, all herbs available',
            allowedSeverities: ['mild'],  // Only mild sicknesses
            wrongHerbsTolerated: 2,
            patientsPerNight: 3
        },
        medium: {
            name: 'Medium',
            description: 'Moderate sicknesses, all herbs available',
            allowedSeverities: ['mild', 'medium'],  // Mild and medium
            preferSeverity: 'medium',  // Prefer medium sicknesses
            wrongHerbsTolerated: 1,
            patientsPerNight: 4
        },
        hard: {
            name: 'Hard',
            description: 'Serious sicknesses, all herbs available',
            allowedSeverities: ['mild', 'medium', 'serious'],  // All types
            preferSeverity: 'serious',  // Prefer serious sicknesses
            wrongHerbsTolerated: 0,
            patientsPerNight: 5
        }
    },

    /**
     * Create initial game state
     */
    createInitialState: function(difficulty = 'easy') {
        return {
            difficulty: difficulty,
            settings: this.DIFFICULTY[difficulty],
            score: 0,
            catsHealed: 0,
            catsLost: 0,
            reputation: 100,
            currentPatient: null,
            availableHerbs: [],
            selectedHerbs: [],
            night: 1,
            patientsTonight: 0,
            isResting: false,
            hasApprentice: false,
            highScore: 0,
            gameOver: false
        };
    },

    /**
     * Generate available herbs - always ALL herbs so player must search
     */
    generateAvailableHerbs: function(state) {
        // Always return ALL herbs - player must search through them
        const allHerbKeys = Object.keys(this.HERBS);
        // Shuffle them so they're in a different order each time
        return [...allHerbKeys].sort(() => Math.random() - 0.5);
    },

    /**
     * Generate a new patient based on difficulty
     */
    generatePatient: function(settings) {
        const allowedSeverities = settings?.allowedSeverities || ['mild', 'medium', 'serious'];
        const preferSeverity = settings?.preferSeverity || null;
        
        // Filter ailments by allowed severities
        const ailmentKeys = Object.keys(this.AILMENTS).filter(key => {
            return allowedSeverities.includes(this.AILMENTS[key].severity);
        });
        
        let selectedAilmentKey;
        
        // If there's a preferred severity, 70% chance to pick from that severity
        if (preferSeverity && Math.random() < 0.7) {
            const preferredAilments = ailmentKeys.filter(key => 
                this.AILMENTS[key].severity === preferSeverity
            );
            if (preferredAilments.length > 0) {
                selectedAilmentKey = preferredAilments[Math.floor(Math.random() * preferredAilments.length)];
            }
        }
        
        // Otherwise pick randomly from allowed ailments
        if (!selectedAilmentKey) {
            selectedAilmentKey = ailmentKeys[Math.floor(Math.random() * ailmentKeys.length)];
        }
        
        const ailment = this.AILMENTS[selectedAilmentKey];
        const name = this.CAT_NAMES[Math.floor(Math.random() * this.CAT_NAMES.length)];
        
        return {
            name: name,
            ailment: selectedAilmentKey,
            ailmentData: ailment,
            arrived: Date.now()
        };
    },

    /**
     * Check if treatment is successful
     */
    evaluateTreatment: function(state) {
        if (!state.currentPatient || state.selectedHerbs.length === 0) {
            return { success: false, message: 'No herbs given!', correctCount: 0, wrongCount: 0 };
        }

        const ailment = this.AILMENTS[state.currentPatient.ailment];
        const correctHerbs = ailment.correctHerbs;
        
        let correctCount = 0;
        let wrongCount = 0;
        
        state.selectedHerbs.forEach(herb => {
            if (correctHerbs.includes(herb)) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });

        const success = correctCount >= ailment.requiredCorrect && 
                       wrongCount <= state.settings.wrongHerbsTolerated;

        let message = '';
        if (success) {
            if (wrongCount === 0) {
                message = `Perfect treatment! ${state.currentPatient.name} feels much better!`;
            } else {
                message = `${state.currentPatient.name} will recover, though the treatment wasn't perfect.`;
            }
        } else {
            if (correctCount === 0) {
                message = `Oh no! Those herbs didn't help ${state.currentPatient.name} at all...`;
            } else {
                message = `The treatment wasn't right. ${state.currentPatient.name} is still very sick...`;
            }
        }

        return { success, message, correctCount, wrongCount };
    },

    /**
     * Apply treatment results to state
     */
    applyTreatment: function(state, result) {
        let newState = { ...state };
        
        if (result.success) {
            newState.catsHealed++;
            newState.score += 100 + (result.correctCount * 25) - (result.wrongCount * 10);
            newState.reputation = Math.min(100, newState.reputation + 5);
        } else {
            newState.catsLost++;
            newState.reputation = Math.max(0, newState.reputation - 15);
        }
        
        newState.patientsTonight++;
        newState.selectedHerbs = [];
        newState.currentPatient = null;
        
        // Check if night is over
        if (newState.patientsTonight >= newState.settings.patientsPerNight) {
            newState.isResting = true;
        }
        
        // Check for game over
        if (newState.reputation <= 0) {
            newState.gameOver = true;
        }
        
        // Update high score
        newState.highScore = Math.max(newState.highScore, newState.score);
        
        return newState;
    },

    /**
     * Start a new night
     */
    startNewNight: function(state) {
        return {
            ...state,
            night: state.night + 1,
            patientsTonight: 0,
            isResting: false,
            selectedHerbs: []
        };
    },

    /**
     * Toggle herb selection
     */
    toggleHerbSelection: function(state, herbKey) {
        const selected = [...state.selectedHerbs];
        const index = selected.indexOf(herbKey);
        
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            if (selected.length < 3) { // Max 3 herbs per treatment
                selected.push(herbKey);
            }
        }
        
        return { ...state, selectedHerbs: selected };
    },

    /**
     * Get correct herbs hint (for teaching)
     */
    getHerbHint: function(ailmentKey) {
        const ailment = this.AILMENTS[ailmentKey];
        if (!ailment) return '';
        
        const herbNames = ailment.correctHerbs.map(h => this.HERBS[h].name);
        return `Good herbs for ${ailment.name}: ${herbNames.join(', ')}`;
    },

    /**
     * Save game data
     */
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Could not save:', e);
            return false;
        }
    },

    /**
     * Load game data
     */
    loadFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameLogic;
}

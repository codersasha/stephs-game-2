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
            description: 'More herbs available, more time',
            herbCount: 8,
            wrongHerbsTolerated: 2,
            timePerPatient: 60,
            patientsPerNight: 3
        },
        medium: {
            name: 'Medium',
            description: 'Fewer herbs, less time',
            herbCount: 6,
            wrongHerbsTolerated: 1,
            timePerPatient: 45,
            patientsPerNight: 4
        },
        hard: {
            name: 'Hard',
            description: 'Limited herbs, strict timing',
            herbCount: 5,
            wrongHerbsTolerated: 0,
            timePerPatient: 30,
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
            timeRemaining: 0,
            highScore: 0,
            gameOver: false
        };
    },

    /**
     * Generate random available herbs (what warriors brought)
     */
    generateAvailableHerbs: function(state) {
        const allHerbKeys = Object.keys(this.HERBS);
        const shuffled = [...allHerbKeys].sort(() => Math.random() - 0.5);
        const count = state.settings.herbCount;
        
        // Make sure we include at least one correct herb for the current patient
        let selected = shuffled.slice(0, count);
        
        if (state.currentPatient) {
            const correctHerbs = this.AILMENTS[state.currentPatient.ailment].correctHerbs;
            const hasCorrect = selected.some(h => correctHerbs.includes(h));
            
            if (!hasCorrect) {
                // Replace one random herb with a correct one
                const correctHerb = correctHerbs[Math.floor(Math.random() * correctHerbs.length)];
                selected[0] = correctHerb;
            }
        }
        
        return selected;
    },

    /**
     * Generate a new patient
     */
    generatePatient: function() {
        const ailmentKeys = Object.keys(this.AILMENTS);
        const ailmentKey = ailmentKeys[Math.floor(Math.random() * ailmentKeys.length)];
        const ailment = this.AILMENTS[ailmentKey];
        const name = this.CAT_NAMES[Math.floor(Math.random() * this.CAT_NAMES.length)];
        
        return {
            name: name,
            ailment: ailmentKey,
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

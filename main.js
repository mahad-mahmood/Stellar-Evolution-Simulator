class StellarEvolutionApp {
    constructor() {
        this.physics = new StellarPhysics();
        this.visualization = new StellarVisualization();
        
        this.currentStar = null;
        this.isAnimating = false;
        
        this.initializeEventListeners();
        this.loadFamousStars();
    }

    initializeEventListeners() {
        // Mass slider
        const massSlider = document.getElementById('starMass');
        const massValue = document.getElementById('massValue');
        
        massSlider.addEventListener('input', (e) => {
            const mass = parseFloat(e.target.value);
            massValue.textContent = `${mass.toFixed(1)} M☉`;
        });


        // Simulate button
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.addEventListener('click', () => {
            this.runSimulation();
        });

        // Next phase button
        const nextPhaseBtn = document.getElementById('nextPhaseBtn');
        nextPhaseBtn.addEventListener('click', () => {
            this.visualization.nextPhase();
        });


        // Preset star buttons
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mass = parseFloat(e.target.dataset.mass);
                
                this.setStarParameters(mass);
                this.runSimulation();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.runSimulation();
            } else if (e.key === 'Escape') {
                this.stopSimulation();
            }
        });
    }

    setStarParameters(mass) {
        document.getElementById('starMass').value = mass;
        document.getElementById('massValue').textContent = `${mass.toFixed(1)} M☉`;
    }

    runSimulation() {
        if (this.isAnimating) {
            this.stopSimulation();
            return;
        }

        const mass = parseFloat(document.getElementById('starMass').value);

        // Validate inputs
        if (mass < 0.1 || mass > 100) {
            alert('Mass must be between 0.1 and 100 solar masses');
            return;
        }

        try {
            // Calculate stellar properties
            this.currentStar = this.physics.calculateStellarProperties(mass);
            
            // Update star name
            document.getElementById('starName').textContent = this.getStarName(mass);
            
            // Start evolution
            this.isAnimating = true;
            this.visualization.startEvolution(this.currentStar);
            
            // Update button text
            const simulateBtn = document.getElementById('simulateBtn');
            simulateBtn.textContent = '⏹️ Stop Evolution';
            simulateBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff4757)';
        } catch (error) {
            console.error('Error in runSimulation:', error);
            alert('Error starting simulation: ' + error.message);
        }
    }


    stopSimulation() {
        this.isAnimating = false;
        this.visualization.stopEvolution();
        
        // Reset button
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.textContent = '🚀 Start Evolution';
        simulateBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    }

    getStarName(mass) {
        if (mass < 0.5) return 'Red Dwarf';
        if (mass < 1.5) return 'Solar-type Star';
        if (mass < 8) return 'Intermediate Mass Star';
        if (mass < 20) return 'High Mass Star';
        return 'Very High Mass Star';
    }

    loadFamousStars() {
        const famousStars = this.physics.getFamousStarData();
        
        // Add more preset buttons dynamically
        const presetContainer = document.querySelector('.preset-stars');
        
        // Add additional famous stars
        const additionalStars = [
            { name: '⭐ Sirius A', mass: 2.1, color: '#aabfff' },
            { name: '💫 Vega', mass: 2.1, color: '#cad7ff' },
            { name: '🌟 Rigel', mass: 23, color: '#9bb0ff' },
            { name: '🔴 Antares', mass: 15, color: '#ff6b6b' },
            { name: '🟡 Capella', mass: 2.5, color: '#ffd700' }
        ];
        
        additionalStars.forEach(star => {
            const btn = document.createElement('button');
            btn.className = 'preset-btn';
            btn.dataset.mass = star.mass;
            btn.textContent = star.name;
            btn.style.borderLeftColor = star.color;
            btn.addEventListener('click', (e) => {
                const mass = parseFloat(e.target.dataset.mass);
                this.setStarParameters(mass);
                this.runSimulation();
            });
            presetContainer.appendChild(btn);
        });
    }

}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.stellarApp = new StellarEvolutionApp();
    
    // Add some helpful console messages
    console.log('🌟 Stellar Evolution Simulator loaded!');
    console.log('💡 Try different masses: 0.5 M☉ (red dwarf), 1.0 M☉ (Sun), 20 M☉ (supergiant)');
    console.log('⌨️ Press Enter or Space to run simulation, Escape to stop');
});

// Add some educational tooltips and help
function addEducationalTooltips() {
    const tooltips = [
        {
            selector: '#starMass',
            content: 'Mass determines the star\'s evolution path. Low mass → white dwarf, high mass → neutron star/black hole'
        }
    ];
    
    tooltips.forEach(tooltip => {
        const element = document.querySelector(tooltip.selector);
        if (element) {
            element.title = tooltip.content;
        }
    });
}

// Add tooltips when page loads
document.addEventListener('DOMContentLoaded', addEducationalTooltips);

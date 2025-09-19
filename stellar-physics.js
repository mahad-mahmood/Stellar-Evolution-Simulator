class StellarPhysics {
    constructor() {
        this.solarMass = 1.989e30; // kg
        this.solarRadius = 6.96e8; // m
        this.solarLuminosity = 3.828e26; // W
        this.solarTemperature = 5778; // K
        
        // Physical constants
        this.G = 6.674e-11; // Gravitational constant
        this.c = 3e8; // Speed of light
        this.kB = 1.381e-23; // Boltzmann constant
        this.h = 6.626e-34; // Planck constant
        this.sigma = 5.67e-8; // Stefan-Boltzmann constant
        this.mu = 0.6; // Mean molecular weight
        this.gamma = 5/3; // Adiabatic index
    }

    // Calculate stellar properties based on mass
    calculateStellarProperties(mass, metallicity = 0.02) {
        const properties = {
            mass: mass,
            metallicity: metallicity,
            radius: this.calculateRadius(mass),
            luminosity: this.calculateLuminosity(mass),
            temperature: this.calculateTemperature(mass),
            lifetime: this.calculateLifetime(mass, metallicity),
            evolutionPath: this.determineEvolutionPath(mass),
            currentStage: 'Main Sequence',
            age: 0,
            stages: []
        };

        // Generate evolution stages
        properties.stages = this.generateEvolutionStages(mass, metallicity);
        
        return properties;
    }

    // Mass-radius relationship (simplified)
    calculateRadius(mass) {
        if (mass < 0.5) {
            // Low-mass stars: R ∝ M^0.8
            return Math.pow(mass, 0.8);
        } else if (mass < 2.0) {
            // Solar-type stars: R ∝ M^0.8
            return Math.pow(mass, 0.8);
        } else if (mass < 20) {
            // High-mass stars: R ∝ M^0.6
            return Math.pow(mass, 0.6);
        } else {
            // Very massive stars: R ∝ M^0.5
            return Math.pow(mass, 0.5);
        }
    }

    // Mass-luminosity relationship
    calculateLuminosity(mass) {
        if (mass < 0.43) {
            // Low-mass stars: L ∝ M^2.3
            return Math.pow(mass, 2.3);
        } else if (mass < 2.0) {
            // Solar-type stars: L ∝ M^4
            return Math.pow(mass, 4);
        } else if (mass < 20) {
            // High-mass stars: L ∝ M^3.5
            return Math.pow(mass, 3.5);
        } else {
            // Very massive stars: L ∝ M^3
            return Math.pow(mass, 3);
        }
    }

    // Effective temperature from Stefan-Boltzmann law
    calculateTemperature(mass) {
        const radius = this.calculateRadius(mass);
        const luminosity = this.calculateLuminosity(mass);
        
        // T = (L / (4πσR²))^0.25
        const temperature = Math.pow(
            (luminosity * this.solarLuminosity) / 
            (4 * Math.PI * this.sigma * Math.pow(radius * this.solarRadius, 2)), 
            0.25
        );
        
        return temperature;
    }

    // Stellar lifetime (simplified)
    calculateLifetime(mass, metallicity = 0.02) {
        // t ∝ M^(-2.5) for main sequence
        const mainSequenceLifetime = Math.pow(mass, -2.5) * 1e10; // years
        
        // Adjust for metallicity (higher metallicity = longer lifetime)
        const metallicityFactor = Math.pow(metallicity / 0.02, 0.1);
        
        return mainSequenceLifetime * metallicityFactor;
    }

    // Determine evolution path based on mass
    determineEvolutionPath(mass) {
        if (mass < 0.5) {
            return {
                type: 'Low Mass',
                finalState: 'White Dwarf',
                description: 'Red dwarf → White dwarf',
                supernova: false
            };
        } else if (mass < 8) {
            return {
                type: 'Intermediate Mass',
                finalState: 'White Dwarf',
                description: 'Main sequence → Red giant → White dwarf',
                supernova: false
            };
        } else if (mass < 20) {
            return {
                type: 'High Mass',
                finalState: 'Neutron Star',
                description: 'Main sequence → Red supergiant → Supernova → Neutron star',
                supernova: true
            };
        } else {
            return {
                type: 'Very High Mass',
                finalState: 'Black Hole',
                description: 'Main sequence → Blue supergiant → Supernova → Black hole',
                supernova: true
            };
        }
    }

    // Generate detailed evolution stages
    generateEvolutionStages(mass, metallicity = 0.02) {
        const stages = [];
        const lifetime = this.calculateLifetime(mass, metallicity);
        const evolutionPath = this.determineEvolutionPath(mass);

        // Main Sequence Stage
        stages.push({
            name: 'Main Sequence',
            duration: lifetime * 0.9,
            startTime: 0,
            endTime: lifetime * 0.9,
            temperature: this.calculateTemperature(mass),
            luminosity: this.calculateLuminosity(mass),
            radius: this.calculateRadius(mass),
            fusion: 'Hydrogen → Helium',
            color: this.getStarColor(this.calculateTemperature(mass)),
            description: 'Core hydrogen fusion, stable burning',
            imageUrl: this.getStarImage('Main Sequence', mass)
        });

        if (mass >= 0.5) {
            // Red Giant/Supergiant Stage
            const redGiantDuration = lifetime * 0.08;
            stages.push({
                name: mass < 8 ? 'Red Giant' : 'Red Supergiant',
                duration: redGiantDuration,
                startTime: lifetime * 0.9,
                endTime: lifetime * 0.98,
                temperature: mass < 8 ? 3000 : 3500,
                luminosity: this.calculateLuminosity(mass) * 100,
                radius: this.calculateRadius(mass) * 50,
                fusion: 'Helium → Carbon/Oxygen',
                color: '#ff4500',
                description: 'Shell hydrogen burning, core helium fusion',
                imageUrl: this.getStarImage(mass < 8 ? 'Red Giant' : 'Red Supergiant', mass)
            });

            if (mass >= 8) {
                // Advanced burning stages for massive stars
                const advancedDuration = lifetime * 0.02;
                stages.push({
                    name: 'Advanced Burning',
                    duration: advancedDuration,
                    startTime: lifetime * 0.98,
                    endTime: lifetime,
                    temperature: 5000,
                    luminosity: this.calculateLuminosity(mass) * 1000,
                    radius: this.calculateRadius(mass) * 100,
                    fusion: 'Carbon → Oxygen → Silicon → Iron',
                    color: '#ff6b6b',
                    description: 'Multiple shell burning, onion-like structure',
                    imageUrl: this.getStarImage('Advanced Burning', mass)
                });
            }
        }

        // Final stage
        if (evolutionPath.supernova) {
            stages.push({
                name: 'Supernova',
                duration: 0.01, // Very short
                startTime: lifetime,
                endTime: lifetime + 0.01,
                temperature: 1e9,
                luminosity: this.calculateLuminosity(mass) * 1e9,
                radius: 0.001,
                fusion: 'Core collapse',
                color: '#ffffff',
                description: 'Core collapse, explosive nucleosynthesis',
                imageUrl: this.getStarImage('Supernova', mass)
            });
        }

        // Remnant stage
        stages.push({
            name: evolutionPath.finalState,
            duration: Infinity,
            startTime: evolutionPath.supernova ? lifetime + 0.01 : lifetime,
            endTime: Infinity,
            temperature: this.getRemnantTemperature(evolutionPath.finalState, mass),
            luminosity: this.getRemnantLuminosity(evolutionPath.finalState, mass),
            radius: this.getRemnantRadius(evolutionPath.finalState, mass),
            fusion: 'None',
            color: this.getRemnantColor(evolutionPath.finalState),
            description: this.getRemnantDescription(evolutionPath.finalState, mass),
            imageUrl: this.getStarImage(evolutionPath.finalState, mass)
        });

        return stages;
    }

    // Get star color based on temperature
    getStarColor(temperature) {
        if (temperature > 30000) return '#9bb0ff'; // Blue-white
        if (temperature > 10000) return '#aabfff'; // Blue
        if (temperature > 7500) return '#cad7ff'; // Blue-white
        if (temperature > 6000) return '#f8f7ff'; // White
        if (temperature > 5000) return '#fff4ea'; // Yellow-white
        if (temperature > 3700) return '#ffd700'; // Yellow
        if (temperature > 3000) return '#ff6b6b'; // Orange
        return '#ff4500'; // Red
    }

    // Get remnant properties
    getRemnantTemperature(finalState, mass) {
        switch (finalState) {
            case 'White Dwarf': return 10000;
            case 'Neutron Star': return 1e6;
            case 'Black Hole': return 0;
            default: return 0;
        }
    }

    getRemnantLuminosity(finalState, mass) {
        switch (finalState) {
            case 'White Dwarf': return 0.01;
            case 'Neutron Star': return 0.001;
            case 'Black Hole': return 0;
            default: return 0;
        }
    }

    getRemnantRadius(finalState, mass) {
        switch (finalState) {
            case 'White Dwarf': return 0.01; // Earth-sized
            case 'Neutron Star': return 0.0001; // 10 km
            case 'Black Hole': return 0.00001; // Schwarzschild radius
            default: return 0;
        }
    }

    getRemnantColor(finalState) {
        switch (finalState) {
            case 'White Dwarf': return '#ffffff';
            case 'Neutron Star': return '#ff6b6b';
            case 'Black Hole': return '#000000';
            default: return '#666666';
        }
    }

    getRemnantDescription(finalState, mass) {
        switch (finalState) {
            case 'White Dwarf':
                return `Degenerate electron core, slowly cooling over billions of years`;
            case 'Neutron Star':
                return `Degenerate neutron core, extremely dense, may be a pulsar`;
            case 'Black Hole':
                return `Gravitational singularity, event horizon at ${(2 * this.G * mass * this.solarMass / (this.c * this.c) / 1000).toFixed(2)} km`;
            default:
                return 'Stellar remnant';
        }
    }

    // Calculate energy output for each stage
    calculateEnergyOutput(stage, mass) {
        const baseLuminosity = this.calculateLuminosity(mass, 0.02);
        const stageLuminosity = stage.luminosity * this.solarLuminosity;
        const duration = stage.duration * 365.25 * 24 * 3600; // Convert to seconds
        
        return {
            power: stageLuminosity, // Watts
            totalEnergy: stageLuminosity * duration, // Joules
            duration: stage.duration
        };
    }

    // Calculate element production (simplified)
    calculateElementProduction(mass, metallicity) {
        const elements = {
            hydrogen: 0.7,
            helium: 0.28,
            carbon: 0.01,
            oxygen: 0.005,
            nitrogen: 0.001,
            iron: 0.001,
            other: 0.003
        };

        // Adjust based on mass and metallicity
        if (mass > 8) {
            elements.carbon += 0.02;
            elements.oxygen += 0.02;
            elements.iron += 0.01;
        }

        if (mass > 20) {
            elements.iron += 0.05;
            elements.other += 0.02;
        }

        // Adjust for metallicity
        const metallicityFactor = metallicity / 0.02;
        elements.carbon *= metallicityFactor;
        elements.oxygen *= metallicityFactor;
        elements.nitrogen *= metallicityFactor;
        elements.iron *= metallicityFactor;
        elements.other *= metallicityFactor;

        return elements;
    }

    // Get famous star data for comparison
    getFamousStarData() {
        return {
            'Sun': { 
                mass: 1.0, 
                metallicity: 0.02, 
                temperature: 5778, 
                luminosity: 1.0, 
                radius: 1.0,
                age: 4.6e9,
                type: 'G-type main sequence',
                description: 'Our home star, middle-aged and stable'
            },
            'Proxima Centauri': { 
                mass: 0.12, 
                metallicity: 0.02, 
                temperature: 3042, 
                luminosity: 0.0017, 
                radius: 0.14,
                age: 4.8e9,
                type: 'M-type red dwarf',
                description: 'Nearest star to Earth, will live trillions of years'
            },
            'Betelgeuse': { 
                mass: 20, 
                metallicity: 0.02, 
                temperature: 3600, 
                luminosity: 120000, 
                radius: 1000,
                age: 8e6,
                type: 'M-type red supergiant',
                description: 'Massive star near the end of its life, future supernova'
            },
            'Sirius A': { 
                mass: 2.1, 
                metallicity: 0.02, 
                temperature: 9940, 
                luminosity: 25, 
                radius: 1.7,
                age: 2.3e8,
                type: 'A-type main sequence',
                description: 'Brightest star in Earth\'s night sky'
            },
            'Vega': { 
                mass: 2.1, 
                metallicity: 0.02, 
                temperature: 9602, 
                luminosity: 40, 
                radius: 2.4,
                age: 4.5e8,
                type: 'A-type main sequence',
                description: 'Former pole star, rapidly rotating'
            },
            'Rigel': {
                mass: 23,
                metallicity: 0.02,
                temperature: 12100,
                luminosity: 120000,
                radius: 78,
                age: 8e6,
                type: 'B-type blue supergiant',
                description: 'One of the most luminous stars known'
            },
            'Antares': {
                mass: 15,
                metallicity: 0.02,
                temperature: 3600,
                luminosity: 10000,
                radius: 800,
                age: 1.2e7,
                type: 'M-type red supergiant',
                description: 'Heart of Scorpius, massive and unstable'
            },
            'Capella': {
                mass: 2.5,
                metallicity: 0.02,
                temperature: 4940,
                luminosity: 78,
                radius: 12,
                age: 6.2e8,
                type: 'G-type giant',
                description: 'Binary star system, evolved off main sequence'
            }
        };
    }

    // Calculate stellar age based on mass and current stage
    calculateStellarAge(mass, metallicity, currentStage) {
        const lifetime = this.calculateLifetime(mass, metallicity);
        const stageProgress = this.getStageProgress(currentStage, mass);
        return lifetime * stageProgress;
    }

    // Get progress through current stage (0-1)
    getStageProgress(stageName, mass) {
        const stageProgress = {
            'Main Sequence': 0.5, // Middle of main sequence
            'Red Giant': 0.95, // Near end of red giant phase
            'Red Supergiant': 0.98, // Near end of supergiant phase
            'Advanced Burning': 0.99, // Very near end
            'Supernova': 1.0, // At the end
            'White Dwarf': 1.0, // Post-evolution
            'Neutron Star': 1.0, // Post-evolution
            'Black Hole': 1.0 // Post-evolution
        };
        return stageProgress[stageName] || 0.5;
    }

    // Calculate stellar wind mass loss rate
    calculateMassLossRate(mass, luminosity, radius) {
        // Reimers formula for stellar wind mass loss
        const L = luminosity * this.solarLuminosity;
        const R = radius * this.solarRadius;
        const M = mass * this.solarMass;
        
        // Mass loss rate in solar masses per year
        const massLossRate = 4e-13 * (L / this.solarLuminosity) * (R / this.solarRadius) / (M / this.solarMass);
        
        return Math.max(0, massLossRate);
    }

    // Calculate stellar rotation period
    calculateRotationPeriod(mass, age) {
        // Simplified rotation period calculation
        const basePeriod = 25; // Solar rotation period in days
        const massFactor = Math.pow(mass, -0.5);
        const ageFactor = Math.pow(age / 4.6e9, 0.5); // Slowing down with age
        
        return basePeriod * massFactor * ageFactor;
    }

    // Calculate magnetic field strength
    calculateMagneticField(mass, rotationPeriod) {
        // Simplified magnetic field calculation
        const baseField = 1e-4; // Tesla
        const massFactor = Math.pow(mass, 0.5);
        const rotationFactor = Math.pow(25 / rotationPeriod, 0.5);
        
        return baseField * massFactor * rotationFactor;
    }

    // Get real star images for different phases
    getStarImage(phase, mass) {
        const images = {
            'Main Sequence': {
                'low': 'https://theplanets.org/123/2021/05/main-sequence-star-1024x683.png', // Red dwarf
                'medium': 'https://theplanets.org/123/2021/05/main-sequence-star-1024x683.png', // Sun-like
                'high': 'https://theplanets.org/123/2021/05/main-sequence-star-1024x683.png' // Blue giant
            },
            'Red Giant': 'https://static.wikia.nocookie.net/planet-archives/images/a/a4/RedGiantMock.png/revision/latest?cb=20240801115704', // Red giant
            'Red Supergiant': 'https://theplanets.org/123/2022/04/What-Is-a-Red-Supergiant-Star.jpg', // Red supergiant
            'Advanced Burning': 'https://theplanets.org/123/2022/04/What-Is-a-Red-Supergiant-Star.jpg', // Advanced burning
            'Supernova': 'https://cdn.mos.cms.futurecdn.net/r6VkfLP3F2zbrWXdgeDis.jpg', // Supernova
            'White Dwarf': 'https://cdn.mos.cms.futurecdn.net/DWKzCqjuCtirYCu8qH5ZU7.jpg', // White dwarf
            'Neutron Star': 'https://www.physik.tu-darmstadt.de/media/fachbereich_physik/aktuelles/artikel/What_is_a_neutron_star_870x0.jpg', // Neutron star
            'Black Hole': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg' // Black hole
        };

        if (phase === 'Main Sequence') {
            if (mass < 0.5) return images['Main Sequence'].low;
            if (mass < 8) return images['Main Sequence'].medium;
            return images['Main Sequence'].high;
        }

        return images[phase] || images['Main Sequence'].medium;
    }
}

class StellarVisualization {
    constructor() {
        this.starIcon = document.getElementById('starIcon');
        this.timeline = document.getElementById('timeline');
        this.starInfo = document.getElementById('starInfo');
        this.physicsInfo = document.getElementById('physicsInfo');
        this.starPhoto = document.getElementById('starPhoto');
        this.imageCaption = document.getElementById('imageCaption');
        this.nextPhaseBtn = document.getElementById('nextPhaseBtn');
        
        this.currentStar = null;
        this.currentStageIndex = 0;
        this.isAnimating = false;
    }


    updateStarDisplay(starData, currentStage) {
        if (!starData || !currentStage) return;
        
        // Update star icon with more realistic appearance
        this.starIcon.innerHTML = this.getRealisticStarIcon(currentStage);
        this.starIcon.style.fontSize = this.getStarSize(currentStage.radius) + 'rem';
        this.starIcon.style.textShadow = `0 0 ${Math.min(currentStage.luminosity / 100, 50)}px ${currentStage.color}`;
        
        // Update star properties
        this.updateStarProperties(starData, currentStage);
        
        // Update star image
        this.updateStarImage(currentStage);
    }

    getRealisticStarIcon(currentStage) {
        // Create a more realistic star representation using CSS
        const size = this.getStarSize(currentStage.radius);
        const color = currentStage.color;
        const luminosity = Math.min(currentStage.luminosity / 100, 50);
        
        return `
            <div style="
                width: ${size}rem;
                height: ${size}rem;
                background: radial-gradient(circle, ${color} 0%, ${this.darkenColor(color, 0.3)} 70%, transparent 100%);
                border-radius: 50%;
                box-shadow: 
                    0 0 ${luminosity}px ${color},
                    0 0 ${luminosity * 2}px ${color},
                    inset 0 0 ${luminosity / 2}px rgba(255,255,255,0.3);
                position: relative;
                animation: pulse 2s ease-in-out infinite alternate;
            ">
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 60%;
                    height: 60%;
                    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
                    border-radius: 50%;
                "></div>
            </div>
        `;
    }

    darkenColor(color, factor) {
        // Simple color darkening function
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * factor);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * factor);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * factor);
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }

    updateStarImage(currentStage) {
        if (currentStage.imageUrl) {
            // Show the image
            this.starPhoto.src = currentStage.imageUrl;
            this.starPhoto.style.display = 'block';
            this.starPhoto.alt = `${currentStage.name} phase`;
            
            // Update caption with phase name and description
            this.imageCaption.innerHTML = `
                <h3 style="color: #ffd700; margin-bottom: 10px;">${currentStage.name}</h3>
                <p style="color: #b0b0b0; font-size: 0.9rem;">${currentStage.description}</p>
                <p style="color: #4ecdc4; font-size: 0.8rem; margin-top: 5px;"><strong>Fusion:</strong> ${currentStage.fusion}</p>
            `;
        } else {
            this.starPhoto.style.display = 'none';
            this.imageCaption.textContent = '';
        }
    }

    getStarSize(radius) {
        // Scale star size based on radius (logarithmic scale)
        const size = Math.max(2, Math.min(8, 2 + Math.log10(radius) * 1.5));
        return size;
    }

    updateStarProperties(starData, currentStage) {
        const propertiesHtml = `
            <div class="property">
                <div class="property-label">Mass</div>
                <div class="property-value">${starData.mass.toFixed(2)} M☉</div>
            </div>
            <div class="property">
                <div class="property-label">Radius</div>
                <div class="property-value">${currentStage.radius.toFixed(2)} R☉</div>
            </div>
            <div class="property">
                <div class="property-label">Luminosity</div>
                <div class="property-value">${currentStage.luminosity.toExponential(2)} L☉</div>
            </div>
            <div class="property">
                <div class="property-label">Temperature</div>
                <div class="property-value">${Math.round(currentStage.temperature)} K</div>
            </div>
            <div class="property">
                <div class="property-label">Age</div>
                <div class="property-value">${(starData.age / 1e6).toFixed(1)} Myr</div>
            </div>
            <div class="property">
                <div class="property-label">Stage</div>
                <div class="property-value">${currentStage.name}</div>
            </div>
        `;
        
        const starPropertiesEl = document.getElementById('starProperties');
        if (starPropertiesEl) {
            starPropertiesEl.innerHTML = propertiesHtml;
        }
    }

    updateTimeline(starData) {
        if (!starData || !starData.stages) return;
        
        this.timeline.innerHTML = '';
        
        starData.stages.forEach((stage, index) => {
            const isActive = index === this.currentStageIndex;
            const timeStr = stage.duration === Infinity ? '∞' : `${(stage.duration / 1e6).toFixed(1)} Myr`;
            
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${isActive ? 'active' : ''}`;
            timelineItem.innerHTML = `
                <div class="time">${timeStr}</div>
                <h4>${stage.name}</h4>
                <p>${stage.description}</p>
                <p><strong>Fusion:</strong> ${stage.fusion}</p>
            `;
            
            this.timeline.appendChild(timelineItem);
        });
    }

    updatePhysicsInfo(starData, currentStage) {
        if (!starData || !currentStage) return;
        
        const energyOutput = this.calculateEnergyOutput(currentStage, starData.mass);
        const elementProduction = this.calculateElementProduction(starData.mass, starData.metallicity);
        
        const currentStageEl = document.getElementById('currentStage');
        if (currentStageEl) {
            currentStageEl.innerHTML = `
                <p><strong>${currentStage.name}</strong></p>
                <p>${currentStage.description}</p>
                <p><strong>Fusion:</strong> ${currentStage.fusion}</p>
            `;
        }
        
        const energyOutputEl = document.getElementById('energyOutput');
        if (energyOutputEl) {
            energyOutputEl.innerHTML = `
                <p><strong>Power:</strong> ${energyOutput.power.toExponential(2)} W</p>
                <p><strong>Total Energy:</strong> ${(energyOutput.totalEnergy / 1e36).toFixed(2)} × 10³⁶ J</p>
                <p><strong>Duration:</strong> ${(energyOutput.duration / 1e6).toFixed(1)} Myr</p>
            `;
        }
        
        const elementHtml = Object.entries(elementProduction)
            .map(([element, fraction]) => 
                `<span style="color: #ffd700;">${element}:</span> ${(fraction * 100).toFixed(1)}% `
            ).join('<br>');
        
        const elementProductionEl = document.getElementById('elementProduction');
        if (elementProductionEl) {
            elementProductionEl.innerHTML = elementHtml;
        }
        
        // Update stellar properties
        this.updateStellarProperties(starData, currentStage);
        
        // Update star comparison
        this.updateStarComparison(starData, currentStage);
    }

    updateStellarProperties(starData, currentStage) {
        const physics = new StellarPhysics();
        const age = physics.calculateStellarAge(starData.mass, starData.metallicity, currentStage.name);
        const massLossRate = physics.calculateMassLossRate(starData.mass, currentStage.luminosity, currentStage.radius);
        const rotationPeriod = physics.calculateRotationPeriod(starData.mass, age);
        const magneticField = physics.calculateMagneticField(starData.mass, rotationPeriod);
        
        const stellarPropertiesEl = document.getElementById('stellarProperties');
        if (stellarPropertiesEl) {
            stellarPropertiesEl.innerHTML = `
                <p><strong>Age:</strong> ${(age / 1e6).toFixed(1)} Myr</p>
                <p><strong>Mass Loss:</strong> ${(massLossRate * 1e6).toFixed(2)} × 10⁻⁶ M☉/yr</p>
                <p><strong>Rotation:</strong> ${rotationPeriod.toFixed(1)} days</p>
                <p><strong>Magnetic Field:</strong> ${(magneticField * 1e4).toFixed(2)} G</p>
                <p><strong>Density:</strong> ${this.calculateDensity(starData.mass, currentStage.radius).toExponential(2)} kg/m³</p>
            `;
        }
    }

    calculateDensity(mass, radius) {
        const solarMass = 1.989e30; // kg
        const solarRadius = 6.96e8; // m
        const volume = (4/3) * Math.PI * Math.pow(radius * solarRadius, 3);
        return (mass * solarMass) / volume;
    }

    updateStarComparison(starData, currentStage) {
        const physics = new StellarPhysics();
        const comparisons = this.compareWithRealStars(starData, currentStage);
        
        const starComparisonEl = document.getElementById('starComparison');
        if (!starComparisonEl) return;
        
        if (comparisons.length === 0) {
            starComparisonEl.innerHTML = `
                <p>No similar real stars found. Try adjusting the mass or metallicity!</p>
            `;
            return;
        }
        
        const comparisonHtml = comparisons.map(comp => `
            <div class="comparison-item">
                <h4>${comp.name}</h4>
                <div class="similarity">${comp.similarity.toFixed(1)}% similar</div>
                <p class="star-type">${comp.data.type}</p>
                <p><strong>Mass:</strong> ${comp.data.mass} M☉</p>
                <p><strong>Temperature:</strong> ${Math.round(comp.data.temperature)} K</p>
                <p><strong>Luminosity:</strong> ${comp.data.luminosity.toExponential(2)} L☉</p>
                <p><strong>Age:</strong> ${(comp.data.age / 1e6).toFixed(1)} Myr</p>
                <p>${comp.data.description}</p>
            </div>
        `).join('');
        
        starComparisonEl.innerHTML = comparisonHtml;
    }

    compareWithRealStars(starData, currentStage) {
        const physics = new StellarPhysics();
        const famousStars = physics.getFamousStarData();
        const comparisons = [];
        
        Object.entries(famousStars).forEach(([name, data]) => {
            const massDiff = Math.abs(starData.mass - data.mass) / Math.max(starData.mass, data.mass);
            const tempDiff = Math.abs(Math.log10(currentStage.temperature) - Math.log10(data.temperature));
            const lumDiff = Math.abs(Math.log10(currentStage.luminosity) - Math.log10(data.luminosity));
            
            const similarity = 1 - (massDiff + tempDiff + lumDiff) / 3;
            
            if (similarity > 0.6) {
                comparisons.push({
                    name,
                    similarity: similarity * 100,
                    data
                });
            }
        });
        
        return comparisons.sort((a, b) => b.similarity - a.similarity).slice(0, 4);
    }

    calculateEnergyOutput(stage, mass) {
        const baseLuminosity = 3.828e26; // Solar luminosity in watts
        const stageLuminosity = stage.luminosity * baseLuminosity;
        const duration = stage.duration * 365.25 * 24 * 3600; // Convert to seconds
        
        return {
            power: stageLuminosity,
            totalEnergy: stageLuminosity * duration,
            duration: stage.duration
        };
    }

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

        if (mass > 8) {
            elements.carbon += 0.02;
            elements.oxygen += 0.02;
            elements.iron += 0.01;
        }

        if (mass > 20) {
            elements.iron += 0.05;
            elements.other += 0.02;
        }

        const metallicityFactor = metallicity / 0.02;
        Object.keys(elements).forEach(key => {
            if (key !== 'hydrogen' && key !== 'helium') {
                elements[key] *= metallicityFactor;
            }
        });

        return elements;
    }


    startEvolution(starData) {
        this.currentStar = starData;
        this.currentStageIndex = 0;
        this.isAnimating = true;
        
        // Show the first stage
        this.showCurrentStage();
        
        // Show next phase button
        if (this.nextPhaseBtn) {
            this.nextPhaseBtn.style.display = 'block';
            this.nextPhaseBtn.disabled = false;
            this.nextPhaseBtn.textContent = '⏭️ Next Phase';
        }
    }

    nextPhase() {
        if (!this.currentStar || !this.isAnimating) return;
        
        if (this.currentStageIndex < this.currentStar.stages.length - 1) {
            this.currentStageIndex++;
            this.showCurrentStage();
            
            // Check if we're at the last stage
            if (this.currentStageIndex === this.currentStar.stages.length - 1) {
                this.nextPhaseBtn.textContent = '✅ Complete';
                this.nextPhaseBtn.disabled = true;
            }
        }
    }

    showCurrentStage() {
        if (!this.currentStar) return;
        
        const currentStage = this.currentStar.stages[this.currentStageIndex];
        
        // Update displays
        this.updateStarDisplay(this.currentStar, currentStage);
        this.updateTimeline(this.currentStar);
        this.updatePhysicsInfo(this.currentStar, currentStage);
        
        // Highlight current timeline item
        const timelineItems = this.timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentStageIndex);
        });
    }

    stopEvolution() {
        this.isAnimating = false;
        if (this.nextPhaseBtn) {
            this.nextPhaseBtn.style.display = 'none';
        }
        this.currentStar = null;
        this.currentStageIndex = 0;
    }
}

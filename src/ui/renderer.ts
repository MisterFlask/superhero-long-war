import {
    GameState, GamePhase, Hero, Mission, CombatState, CardInstance,
    Enemy, ResourceType, HeroClass, Faction, StatusEffectType,
    CombatPhase
} from '../models/types.js';

// ============================================
// UI RENDERER
// ============================================

export class GameRenderer {
    private container: HTMLElement;
    private onAction: (action: string, payload?: any) => void;

    constructor(containerId: string, onAction: (action: string, payload?: any) => void) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Container ${containerId} not found`);
        this.container = element;
        this.onAction = onAction;
    }

    render(state: GameState): void {
        switch (state.phase) {
            case GamePhase.Strategic:
                this.renderStrategic(state);
                break;
            case GamePhase.MissionSelect:
                this.renderMissionSelect(state);
                break;
            case GamePhase.Combat:
                this.renderCombat(state);
                break;
            case GamePhase.PostCombat:
                this.renderPostCombat(state);
                break;
            case GamePhase.Bazaar:
                this.renderBazaar(state);
                break;
            case GamePhase.GameOver:
                this.renderGameOver(state, false);
                break;
            case GamePhase.Victory:
                this.renderGameOver(state, true);
                break;
        }
    }

    // ============================================
    // STRATEGIC VIEW
    // ============================================

    private renderStrategic(state: GameState): void {
        this.container.innerHTML = `
            <div class="game-screen strategic-screen">
                <header class="game-header">
                    <div class="header-left">
                        <h1>Superhero Long War</h1>
                        <span class="day-counter">Day ${state.day}</span>
                    </div>
                    <div class="header-center">
                        ${this.renderDoomCounter(state)}
                    </div>
                    <div class="header-right">
                        <span class="money"><span class="money-icon">$</span>${state.money}</span>
                        <button class="btn btn-bazaar" data-action="openBazaar">Bazaar</button>
                    </div>
                </header>

                <div class="strategic-content">
                    <aside class="roster-panel">
                        <h2>Your Heroes</h2>
                        <div class="roster-list">
                            ${state.roster.map(h => this.renderHeroCard(h)).join('')}
                        </div>
                    </aside>

                    <main class="map-panel">
                        <div class="heat-meters">
                            ${this.renderHeatMeters(state)}
                        </div>
                        <div class="missions-list">
                            <h2>Active Missions</h2>
                            ${state.missions.length === 0 ?
                                '<p class="no-missions">No active missions. Advance the day to generate new threats.</p>' :
                                state.missions.map(m => this.renderMissionCard(m, state)).join('')
                            }
                        </div>
                        <div class="territories-overview">
                            <h3>Your Territories</h3>
                            ${this.renderTerritoriesOverview(state)}
                        </div>
                    </main>
                </div>

                <footer class="game-footer">
                    <button class="btn btn-primary btn-large" data-action="advanceDay">
                        Advance Day
                    </button>
                </footer>
            </div>
        `;

        this.bindEventListeners();
    }

    private renderDoomCounter(state: GameState): string {
        const segments = [];
        for (let i = 0; i < state.maxDoom; i++) {
            const filled = i < state.doomCounter;
            segments.push(`<div class="doom-segment ${filled ? 'filled' : ''}"></div>`);
        }
        return `
            <div class="doom-counter">
                <span class="doom-label">DOOM</span>
                <div class="doom-bar">${segments.join('')}</div>
                <span class="doom-faction">${state.actFaction} Threat - Act ${state.currentAct}</span>
            </div>
        `;
    }

    private renderHeatMeters(state: GameState): string {
        return Object.entries(state.factionHeat).map(([faction, heat]) => `
            <div class="heat-meter faction-${faction.toLowerCase()}">
                <span class="heat-label">${faction}</span>
                <div class="heat-bar">
                    <div class="heat-fill" style="width: ${Math.min(100, heat)}%"></div>
                </div>
                <span class="heat-value">${heat}%</span>
            </div>
        `).join('');
    }

    private renderHeroCard(hero: Hero): string {
        const hpPercent = (hero.currentHp / hero.maxHp) * 100;
        const stressPercent = (hero.stress / hero.maxStress) * 100;
        const classColor = this.getClassColor(hero.heroClass);

        return `
            <div class="hero-card ${!hero.isAvailable ? 'unavailable' : ''}"
                 data-hero-id="${hero.id}"
                 style="--class-color: ${classColor}">
                <div class="hero-header">
                    <span class="hero-name">${hero.name}</span>
                    <span class="hero-class">${hero.heroClass}</span>
                </div>
                <div class="hero-bars">
                    <div class="bar hp-bar">
                        <div class="bar-fill" style="width: ${hpPercent}%"></div>
                        <span class="bar-text">${hero.currentHp}/${hero.maxHp}</span>
                    </div>
                    <div class="bar stress-bar">
                        <div class="bar-fill" style="width: ${stressPercent}%"></div>
                        <span class="bar-text">Stress: ${hero.stress}%</span>
                    </div>
                </div>
                <div class="hero-info">
                    <span class="deck-size">${hero.deck.length} cards</span>
                    ${hero.traumaCards.length > 0 ?
                        `<span class="trauma-count">${hero.traumaCards.length} trauma</span>` : ''}
                </div>
                ${!hero.isAvailable ?
                    `<div class="unavailable-overlay">Unavailable (${hero.daysUnavailable} days)</div>` : ''}
            </div>
        `;
    }

    private renderMissionCard(mission: Mission, state: GameState): string {
        const territory = state.territories.find(t => t.id === mission.territoryId);
        const urgencyClass = mission.turnsRemaining <= 2 ? 'urgent' : '';

        return `
            <div class="mission-card ${urgencyClass} mission-${mission.type.toLowerCase()} faction-${mission.faction.toLowerCase()}">
                <div class="mission-header">
                    <span class="mission-type ${mission.isStory ? 'story' : ''}">${mission.type}</span>
                    <span class="mission-timer">${mission.turnsRemaining} days</span>
                </div>
                <h3 class="mission-title">${mission.description}</h3>
                <div class="mission-details">
                    <span class="mission-location">${territory?.name || 'Unknown'}</span>
                    <span class="mission-difficulty">Difficulty: ${mission.difficulty}</span>
                    <span class="mission-combats">${mission.combatCount} combat${mission.combatCount > 1 ? 's' : ''}</span>
                </div>
                <div class="mission-rewards">
                    <span class="reward-money">$${mission.rewards.money}</span>
                    <span class="reward-cards">${mission.rewards.cardRewards} card reward${mission.rewards.cardRewards > 1 ? 's' : ''}</span>
                </div>
                <button class="btn btn-mission" data-action="selectMission" data-mission-id="${mission.id}">
                    Deploy Team
                </button>
            </div>
        `;
    }

    private renderTerritoriesOverview(state: GameState): string {
        const playerTerritories = state.territories.filter(t => t.controlledBy === 'player');
        const income = playerTerritories.reduce((sum, t) => sum + t.moneyGeneration, 0);

        return `
            <div class="territories-summary">
                <div class="territory-count">${playerTerritories.length} Territories</div>
                <div class="territory-income">Daily Income: $${income}</div>
            </div>
            <div class="territory-list">
                ${playerTerritories.map(t => `
                    <div class="territory-item ${t.isLandmark ? 'landmark' : ''}">
                        <span class="territory-name">${t.name}</span>
                        ${t.isLandmark ? `<span class="landmark-icon">${this.getLandmarkIcon(t.landmarkType!)}</span>` : ''}
                        <span class="territory-money">$${t.moneyGeneration}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ============================================
    // MISSION SELECT VIEW
    // ============================================

    private renderMissionSelect(state: GameState): void {
        const mission = state.missions.find(m =>
            (state as any).selectedMissionId === m.id
        ) || state.missions[0];

        const availableHeroes = state.roster.filter(h => h.isAvailable && h.currentHp > 0);

        this.container.innerHTML = `
            <div class="game-screen mission-select-screen">
                <header class="game-header">
                    <button class="btn btn-back" data-action="cancelMission">Back</button>
                    <h1>Select Your Team</h1>
                    <div></div>
                </header>

                <div class="mission-select-content">
                    <div class="mission-brief">
                        <h2>${mission?.description || 'Select a Mission'}</h2>
                        <div class="mission-info">
                            <span>Faction: ${mission?.faction}</span>
                            <span>Combats: ${mission?.combatCount}</span>
                            <span>Difficulty: ${mission?.difficulty}</span>
                        </div>
                    </div>

                    <div class="team-selection">
                        <h3>Select 3 Heroes</h3>
                        <div class="selected-heroes" id="selectedHeroes">
                            <div class="hero-slot empty" data-slot="0">Select Hero</div>
                            <div class="hero-slot empty" data-slot="1">Select Hero</div>
                            <div class="hero-slot empty" data-slot="2">Select Hero</div>
                        </div>
                    </div>

                    <div class="available-heroes">
                        <h3>Available Heroes</h3>
                        <div class="hero-grid">
                            ${availableHeroes.map(h => this.renderSelectableHero(h)).join('')}
                        </div>
                    </div>
                </div>

                <footer class="game-footer">
                    <button class="btn btn-primary btn-large" id="startMissionBtn"
                            data-action="startMission" disabled>
                        Begin Mission
                    </button>
                </footer>
            </div>
        `;

        this.bindMissionSelectListeners();
    }

    private renderSelectableHero(hero: Hero): string {
        const hpPercent = (hero.currentHp / hero.maxHp) * 100;
        return `
            <div class="selectable-hero" data-hero-id="${hero.id}">
                <div class="hero-portrait" style="--class-color: ${this.getClassColor(hero.heroClass)}">
                    <span class="class-icon">${this.getClassIcon(hero.heroClass)}</span>
                </div>
                <div class="hero-details">
                    <span class="name">${hero.name}</span>
                    <span class="class">${hero.heroClass}</span>
                    <div class="mini-hp-bar">
                        <div class="fill" style="width: ${hpPercent}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // COMBAT VIEW
    // ============================================

    private renderCombat(state: GameState): void {
        const combat = state.currentCombat!;

        this.container.innerHTML = `
            <div class="game-screen combat-screen">
                <header class="combat-header">
                    <div class="combat-info">
                        <span class="turn-counter">Turn ${combat.turn}</span>
                        <span class="combat-progress">${state.currentCombatIndex + 1}/${state.activeMission?.combatCount}</span>
                    </div>
                    ${this.renderCombatResources(combat)}
                    <div class="energy-display">
                        <span class="energy-value">${combat.energy}</span>
                        <span class="energy-max">/ ${combat.maxEnergy}</span>
                        <span class="energy-label">Energy</span>
                    </div>
                </header>

                <div class="combat-arena">
                    <div class="enemies-row">
                        ${combat.enemies.map(e => this.renderEnemyUnit(e)).join('')}
                    </div>

                    <div class="combat-middle">
                        ${this.renderGadgets(combat)}
                    </div>

                    <div class="heroes-row">
                        ${combat.heroes.map(h => this.renderCombatHero(h)).join('')}
                    </div>
                </div>

                <div class="hand-area">
                    <div class="card-hand" id="cardHand">
                        ${combat.hand.map(c => this.renderHandCard(c, combat)).join('')}
                    </div>
                </div>

                <footer class="combat-footer">
                    <div class="resource-abilities">
                        ${this.renderResourceAbilities(combat)}
                    </div>
                    <div class="combat-actions">
                        <button class="btn btn-danger" data-action="retreat"
                                ${combat.energy < 3 ? 'disabled' : ''}>
                            Retreat (3 Energy)
                        </button>
                        <button class="btn btn-primary btn-large" data-action="endTurn">
                            End Turn
                        </button>
                    </div>
                </footer>
            </div>
        `;

        this.bindCombatListeners(combat);
    }

    private renderCombatResources(combat: CombatState): string {
        const resources = [
            { type: ResourceType.Blood, color: '#dc2626', icon: '🩸' },
            { type: ResourceType.Glint, color: '#fbbf24', icon: '✨' },
            { type: ResourceType.Ashes, color: '#6b7280', icon: '🔥' },
            { type: ResourceType.Pages, color: '#3b82f6', icon: '📖' },
            { type: ResourceType.Iron, color: '#a1a1aa', icon: '🛡️' }
        ];

        return `
            <div class="combat-resources">
                ${resources.map(r => `
                    <div class="resource-display" style="--resource-color: ${r.color}">
                        <span class="resource-icon">${r.icon}</span>
                        <span class="resource-value">${combat.resources[r.type]}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    private renderEnemyUnit(enemy: Enemy): string {
        const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
        const isDead = enemy.currentHp <= 0;
        const block = enemy.statusEffects.find(s => s.type === StatusEffectType.Block);

        return `
            <div class="enemy-unit ${isDead ? 'dead' : ''} ${enemy.isBoss ? 'boss' : ''}"
                 data-enemy-id="${enemy.id}">
                <div class="enemy-intent">
                    ${this.renderEnemyIntent(enemy)}
                </div>
                <div class="enemy-portrait">
                    <span class="enemy-icon">${this.getEnemyIcon(enemy)}</span>
                </div>
                <div class="enemy-name">${enemy.name}</div>
                <div class="enemy-hp-bar">
                    ${block ? `<div class="block-overlay">${block.stacks}</div>` : ''}
                    <div class="hp-fill" style="width: ${hpPercent}%"></div>
                    <span class="hp-text">${enemy.currentHp}/${enemy.maxHp}</span>
                </div>
                <div class="enemy-status">
                    ${this.renderStatusEffects(enemy.statusEffects)}
                </div>
            </div>
        `;
    }

    private renderEnemyIntent(enemy: Enemy): string {
        const intentIcons: Record<string, string> = {
            'Attack': '⚔️',
            'Block': '🛡️',
            'Buff': '⬆️',
            'Debuff': '⬇️',
            'Summon': '👥',
            'Special': '⭐'
        };

        return `
            <div class="intent ${enemy.intent.type.toLowerCase()}">
                <span class="intent-icon">${intentIcons[enemy.intent.type] || '❓'}</span>
                ${enemy.intent.value ? `<span class="intent-value">${enemy.intent.value}</span>` : ''}
                <span class="intent-name">${enemy.intent.description}</span>
            </div>
        `;
    }

    private renderCombatHero(hero: Hero): string {
        const hpPercent = (hero.currentHp / hero.maxHp) * 100;
        const isDead = hero.currentHp <= 0;
        const block = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
        const isHidden = hero.statusEffects.some(s => s.type === StatusEffectType.Hidden);

        return `
            <div class="combat-hero ${isDead ? 'dead' : ''} ${isHidden ? 'hidden' : ''}"
                 data-hero-id="${hero.id}"
                 style="--class-color: ${this.getClassColor(hero.heroClass)}">
                <div class="hero-portrait">
                    <span class="class-icon">${this.getClassIcon(hero.heroClass)}</span>
                    ${isHidden ? '<div class="hidden-indicator">Hidden</div>' : ''}
                </div>
                <div class="hero-name">${hero.name}</div>
                <div class="hero-hp-bar">
                    ${block ? `<div class="block-indicator">${block.stacks}</div>` : ''}
                    <div class="hp-fill" style="width: ${hpPercent}%"></div>
                    <span class="hp-text">${hero.currentHp}/${hero.maxHp}</span>
                </div>
                <div class="hero-status">
                    ${this.renderStatusEffects(hero.statusEffects)}
                </div>
            </div>
        `;
    }

    private renderHandCard(card: CardInstance, combat: CombatState): string {
        const canPlay = combat.phase === CombatPhase.PlayerTurn &&
                       card.energyCost <= combat.energy;
        const owner = combat.heroes.find(h => h.id === card.ownerId);
        const ownerDead = !owner || owner.currentHp <= 0;

        return `
            <div class="hand-card ${canPlay && !ownerDead ? 'playable' : 'unplayable'}"
                 data-card-id="${card.instanceId}"
                 style="--class-color: ${this.getClassColor(card.heroClass)}">
                <div class="card-cost">${card.energyCost}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-type">${card.type}</div>
                <div class="card-effect">${this.formatCardDescription(card, combat)}</div>
                ${owner ? `<div class="card-owner">${owner.name}</div>` : ''}
            </div>
        `;
    }

    private formatCardDescription(card: CardInstance, combat: CombatState): string {
        let desc = card.description;

        // Replace resource placeholders with actual values
        Object.entries(combat.resources).forEach(([type, value]) => {
            desc = desc.replace(`[${type}]`, `<span class="resource-value">${value}</span>`);
        });

        return desc;
    }

    private renderGadgets(combat: CombatState): string {
        if (combat.gadgets.length === 0) return '';

        return `
            <div class="gadgets-display">
                ${combat.gadgets.map(g => `
                    <div class="gadget">
                        <span class="gadget-name">${g.name}</span>
                        <span class="gadget-duration">${g.turnsRemaining} turns</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    private renderResourceAbilities(combat: CombatState): string {
        const abilities = [
            { resource: ResourceType.Blood, name: 'Blood Strike', effect: 'Deal 8 damage' },
            { resource: ResourceType.Glint, name: 'Clarity', effect: 'Draw 2 cards' },
            { resource: ResourceType.Iron, name: 'Fortify', effect: 'Gain 8 block (all)' }
        ];

        return abilities.map(a => {
            const canUse = combat.energy >= 1 && combat.resources[a.resource] >= 3;
            return `
                <button class="resource-ability ${canUse ? '' : 'disabled'}"
                        data-action="useAbility"
                        data-resource="${a.resource}"
                        ${canUse ? '' : 'disabled'}>
                    <span class="ability-cost">1⚡ 3${a.resource.charAt(0)}</span>
                    <span class="ability-name">${a.name}</span>
                    <span class="ability-effect">${a.effect}</span>
                </button>
            `;
        }).join('');
    }

    private renderStatusEffects(effects: any[]): string {
        const displayEffects = effects.filter(e =>
            e.type !== StatusEffectType.Block
        );

        return displayEffects.map(e => {
            const icon = this.getStatusIcon(e.type);
            return `<span class="status-effect status-${e.type.toLowerCase()}" title="${e.type}: ${e.stacks}">
                ${icon}${e.stacks}
            </span>`;
        }).join('');
    }

    // ============================================
    // POST COMBAT VIEW
    // ============================================

    private renderPostCombat(state: GameState): void {
        const combat = state.currentCombat!;
        const survivingHeroes = combat.heroes.filter(h => h.currentHp > 0);

        this.container.innerHTML = `
            <div class="game-screen post-combat-screen">
                <header class="game-header">
                    <h1>Victory!</h1>
                </header>

                <div class="post-combat-content">
                    <div class="rewards-summary">
                        <h2>Mission Complete</h2>
                        <div class="reward-item">
                            <span class="reward-label">Money Earned:</span>
                            <span class="reward-value">$${state.activeMission?.rewards.money || 0}</span>
                        </div>
                    </div>

                    <div class="hero-rewards">
                        <h3>Card Rewards</h3>
                        ${survivingHeroes.map(h => this.renderHeroCardReward(h, state)).join('')}
                    </div>
                </div>

                <footer class="game-footer">
                    <button class="btn btn-primary btn-large" data-action="finishPostCombat">
                        Continue
                    </button>
                </footer>
            </div>
        `;

        this.bindPostCombatListeners(state);
    }

    private renderHeroCardReward(hero: Hero, state: GameState): string {
        const classCards = this.getRewardCards(hero.heroClass);

        return `
            <div class="hero-reward-section" data-hero-id="${hero.id}">
                <h4>${hero.name} - Select a Card</h4>
                <div class="card-choices">
                    ${classCards.map(card => `
                        <div class="reward-card" data-card-id="${card.id}"
                             style="--class-color: ${this.getClassColor(card.heroClass)}">
                            <div class="card-cost">${card.energyCost}</div>
                            <div class="card-name">${card.name}</div>
                            <div class="card-type">${card.rarity} ${card.type}</div>
                            <div class="card-effect">${card.description}</div>
                        </div>
                    `).join('')}
                    <div class="reward-card skip-card" data-card-id="skip">
                        <div class="skip-text">Skip</div>
                        <div class="skip-subtext">Don't add a card</div>
                    </div>
                </div>
            </div>
        `;
    }

    private getRewardCards(heroClass: HeroClass): any[] {
        // Import would create circular dependency, so we'll pass cards differently
        // For now return placeholder
        return [];
    }

    // ============================================
    // BAZAAR VIEW
    // ============================================

    private renderBazaar(state: GameState): void {
        this.container.innerHTML = `
            <div class="game-screen bazaar-screen">
                <header class="game-header">
                    <button class="btn btn-back" data-action="closeBazaar">Back</button>
                    <h1>The Bazaar</h1>
                    <span class="money">$${state.money}</span>
                </header>

                <div class="bazaar-content">
                    <div class="offerings-grid">
                        ${state.bazaarOfferings.map(o => this.renderBazaarOffering(o, state)).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindEventListeners();
    }

    private renderBazaarOffering(offering: any, state: GameState): string {
        const canAfford = state.money >= offering.cost;
        const isHero = offering.type === 'hero';

        return `
            <div class="bazaar-offering ${canAfford ? '' : 'cant-afford'}"
                 data-offering-id="${offering.id}">
                <div class="offering-type">${offering.type.toUpperCase()}</div>
                ${isHero && offering.hero ? `
                    <div class="offering-hero" style="--class-color: ${this.getClassColor(offering.hero.heroClass)}">
                        <span class="class-icon">${this.getClassIcon(offering.hero.heroClass)}</span>
                        <span class="hero-name">${offering.hero.name}</span>
                        <span class="hero-class">${offering.hero.heroClass}</span>
                    </div>
                ` : `
                    <div class="offering-content">
                        <span class="offering-name">${offering.description}</span>
                    </div>
                `}
                <div class="offering-cost">$${offering.cost}</div>
                <button class="btn btn-purchase"
                        data-action="purchase"
                        data-offering-id="${offering.id}"
                        ${canAfford ? '' : 'disabled'}>
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            </div>
        `;
    }

    // ============================================
    // GAME OVER VIEW
    // ============================================

    private renderGameOver(state: GameState, isVictory: boolean): void {
        this.container.innerHTML = `
            <div class="game-screen game-over-screen ${isVictory ? 'victory' : 'defeat'}">
                <div class="game-over-content">
                    <h1>${isVictory ? 'VICTORY' : 'GAME OVER'}</h1>
                    <p class="game-over-message">
                        ${isVictory ?
                            'Against all odds, you have held back the darkness. The war continues, but humanity survives another day.' :
                            'The darkness has consumed everything. The war is lost.'}
                    </p>
                    <div class="final-stats">
                        <div class="stat">
                            <span class="stat-label">Days Survived</span>
                            <span class="stat-value">${state.day}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Heroes Lost</span>
                            <span class="stat-value">${5 - state.roster.length}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Final Act</span>
                            <span class="stat-value">${state.currentAct}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-large" data-action="newGame">
                        New Game
                    </button>
                </div>
            </div>
        `;

        this.bindEventListeners();
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private getClassColor(heroClass: HeroClass): string {
        const colors: Record<HeroClass, string> = {
            [HeroClass.Brute]: '#dc2626',
            [HeroClass.Blaster]: '#f97316',
            [HeroClass.Tinker]: '#3b82f6',
            [HeroClass.Thinker]: '#a855f7',
            [HeroClass.Mover]: '#22c55e',
            [HeroClass.Stranger]: '#6366f1'
        };
        return colors[heroClass];
    }

    private getClassIcon(heroClass: HeroClass): string {
        const icons: Record<HeroClass, string> = {
            [HeroClass.Brute]: '💪',
            [HeroClass.Blaster]: '💥',
            [HeroClass.Tinker]: '⚙️',
            [HeroClass.Thinker]: '🧠',
            [HeroClass.Mover]: '⚡',
            [HeroClass.Stranger]: '👤'
        };
        return icons[heroClass];
    }

    private getEnemyIcon(enemy: Enemy): string {
        const icons: Record<Faction, Record<string, string>> = {
            [Faction.Cult]: {
                'Cultist': '🧙',
                'Void Spawn': '👁️',
                'Eldritch Horror': '🐙',
                'High Priest of the Veil': '👿'
            },
            [Faction.Undead]: {
                'Skeleton': '💀',
                'Zombie': '🧟',
                'Death Knight': '⚔️',
                'Lich King': '👑'
            },
            [Faction.Swarm]: {
                'Drone': '🐜',
                'Spitter': '🦂',
                'Warrior': '🦗',
                'Hive Queen': '👸'
            }
        };

        return icons[enemy.faction]?.[enemy.name] || '👾';
    }

    private getStatusIcon(type: StatusEffectType): string {
        const icons: Record<StatusEffectType, string> = {
            [StatusEffectType.Block]: '🛡️',
            [StatusEffectType.Strength]: '⚔️',
            [StatusEffectType.Hidden]: '👤',
            [StatusEffectType.Untargetable]: '✨',
            [StatusEffectType.Vulnerable]: '💔',
            [StatusEffectType.Weak]: '📉',
            [StatusEffectType.Poison]: '☠️',
            [StatusEffectType.Marked]: '🎯',
            [StatusEffectType.Thorns]: '🌹',
            [StatusEffectType.Regeneration]: '💚'
        };
        return icons[type] || '❓';
    }

    private getLandmarkIcon(type: string): string {
        const icons: Record<string, string> = {
            'foundry': '🏭',
            'academy': '🎓',
            'sanctuary': '🏥',
            'listeningPost': '📡'
        };
        return icons[type] || '🏰';
    }

    // ============================================
    // EVENT BINDING
    // ============================================

    private bindEventListeners(): void {
        this.container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                const action = (e.currentTarget as HTMLElement).dataset.action!;
                const payload: any = {};

                // Collect data attributes
                Object.entries((e.currentTarget as HTMLElement).dataset).forEach(([key, value]) => {
                    if (key !== 'action') {
                        payload[key] = value;
                    }
                });

                this.onAction(action, payload);
            });
        });
    }

    private bindMissionSelectListeners(): void {
        const selectedHeroes: string[] = [];
        const slots = this.container.querySelectorAll('.hero-slot');
        const heroes = this.container.querySelectorAll('.selectable-hero');
        const startBtn = this.container.getElementById('startMissionBtn') as HTMLButtonElement;

        heroes.forEach(hero => {
            hero.addEventListener('click', () => {
                const heroId = (hero as HTMLElement).dataset.heroId!;

                if (selectedHeroes.includes(heroId)) {
                    // Deselect
                    const index = selectedHeroes.indexOf(heroId);
                    selectedHeroes.splice(index, 1);
                    hero.classList.remove('selected');
                } else if (selectedHeroes.length < 3) {
                    // Select
                    selectedHeroes.push(heroId);
                    hero.classList.add('selected');
                }

                // Update slots display
                slots.forEach((slot, i) => {
                    if (selectedHeroes[i]) {
                        const h = this.container.querySelector(
                            `.selectable-hero[data-hero-id="${selectedHeroes[i]}"]`
                        );
                        if (h) {
                            slot.innerHTML = h.querySelector('.hero-details')?.innerHTML || '';
                            slot.classList.remove('empty');
                        }
                    } else {
                        slot.innerHTML = 'Select Hero';
                        slot.classList.add('empty');
                    }
                });

                // Enable/disable start button
                startBtn.disabled = selectedHeroes.length !== 3;
            });
        });

        startBtn.addEventListener('click', () => {
            if (selectedHeroes.length === 3) {
                this.onAction('startMission', { heroIds: selectedHeroes });
            }
        });

        this.container.querySelector('[data-action="cancelMission"]')?.addEventListener('click', () => {
            this.onAction('cancelMission');
        });
    }

    private bindCombatListeners(combat: CombatState): void {
        // Card playing
        this.container.querySelectorAll('.hand-card.playable').forEach(card => {
            card.addEventListener('click', () => {
                const cardId = (card as HTMLElement).dataset.cardId!;
                const cardInstance = combat.hand.find(c => c.instanceId === cardId);
                if (cardInstance) {
                    // For attack cards, need to select target
                    if (cardInstance.effect.damage !== undefined && !cardInstance.effect.damageAll) {
                        this.startTargeting(cardInstance, combat);
                    } else {
                        this.onAction('playCard', { card: cardInstance });
                    }
                }
            });
        });

        // Enemy targeting
        this.container.querySelectorAll('.enemy-unit:not(.dead)').forEach(enemy => {
            enemy.addEventListener('click', () => {
                if (combat.targetingMode) {
                    const enemyId = (enemy as HTMLElement).dataset.enemyId!;
                    this.onAction('playCard', {
                        card: combat.targetingMode.card,
                        targetId: enemyId
                    });
                }
            });
        });

        this.bindEventListeners();
    }

    private startTargeting(card: CardInstance, combat: CombatState): void {
        combat.targetingMode = { card, validTargets: 'enemy' };
        this.container.querySelectorAll('.enemy-unit:not(.dead)').forEach(e => {
            e.classList.add('targetable');
        });
    }

    private bindPostCombatListeners(state: GameState): void {
        this.container.querySelectorAll('.reward-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const section = (e.currentTarget as HTMLElement).closest('.hero-reward-section');
                const heroId = section?.getAttribute('data-hero-id');
                const cardId = (e.currentTarget as HTMLElement).dataset.cardId;

                if (heroId && cardId && cardId !== 'skip') {
                    this.onAction('selectCardReward', { heroId, cardId });
                }

                // Mark as selected
                section?.querySelectorAll('.reward-card').forEach(c => c.classList.remove('selected'));
                (e.currentTarget as HTMLElement).classList.add('selected');
            });
        });

        this.bindEventListeners();
    }
}

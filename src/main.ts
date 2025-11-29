import { GameState, GamePhase, ResourceType, CombatPhase, Hero, Enemy, StatusEffectType } from './models/types.js';
import { GameRenderer } from './ui/renderer.js';
import {
    createNewGame,
    advanceDay,
    startMission,
    handleCombatAction,
    selectCardReward,
    finishPostCombat,
    openBazaar,
    closeBazaar,
    purchaseBazaarOffering
} from './game/GameState.js';

// ============================================
// MAIN APPLICATION
// ============================================

class SuperheroLongWar {
    private state: GameState;
    private renderer: GameRenderer;
    private selectedMissionId: string | null = null;
    private isAnimating: boolean = false;

    constructor() {
        this.state = createNewGame();
        this.renderer = new GameRenderer('game-container', this.handleAction.bind(this));
        this.render();
    }

    private async handleAction(action: string, payload?: any): Promise<void> {
        // Prevent actions during animations
        if (this.isAnimating && action !== 'newGame') {
            return;
        }

        console.log('Action:', action, payload);

        switch (action) {
            case 'advanceDay':
                this.state = advanceDay(this.state);
                break;

            case 'selectMission':
                this.selectedMissionId = payload.missionId;
                this.state = { ...this.state, phase: GamePhase.MissionSelect };
                (this.state as any).selectedMissionId = this.selectedMissionId;
                break;

            case 'cancelMission':
                this.selectedMissionId = null;
                this.state = { ...this.state, phase: GamePhase.Strategic };
                break;

            case 'startMission':
                if (this.selectedMissionId && payload.heroIds) {
                    this.state = startMission(this.state, this.selectedMissionId, payload.heroIds);
                    this.selectedMissionId = null;

                    // Log turn start
                    if (this.state.currentCombat) {
                        this.renderer.getCombatLog().logTurnStart(true, this.state.currentCombat.turn);
                    }
                }
                break;

            case 'playCard':
                await this.handlePlayCard(payload);
                return; // Return early - already handles render

            case 'endTurn':
                await this.handleEndTurn();
                return; // Return early - already handles render

            case 'retreat':
                this.state = handleCombatAction(this.state, 'retreat');
                break;

            case 'useAbility':
                await this.handleUseAbility(payload);
                return; // Return early - already handles render

            case 'selectCardReward':
                this.state = selectCardReward(this.state, payload.heroId, payload.cardId);
                break;

            case 'finishPostCombat':
                this.state = finishPostCombat(this.state);
                break;

            case 'openBazaar':
                this.state = openBazaar(this.state);
                break;

            case 'closeBazaar':
                this.state = closeBazaar(this.state);
                break;

            case 'purchase':
                this.state = purchaseBazaarOffering(this.state, payload.offeringId);
                break;

            case 'newGame':
                this.isAnimating = false;
                this.state = createNewGame();
                break;

            default:
                console.warn('Unknown action:', action);
        }

        this.render();
    }

    private async handlePlayCard(payload: any): Promise<void> {
        if (!this.state.currentCombat) return;

        const oldCombat = this.state.currentCombat;
        const card = payload.card;
        const targetId = payload.targetId;

        // Get before state
        const beforeEnemyHp = new Map(oldCombat.enemies.map(e => [e.id, e.currentHp]));
        const beforeHeroHp = new Map(oldCombat.heroes.map(h => [h.id, h.currentHp]));

        // Execute the action
        this.state = handleCombatAction(this.state, 'playCard', payload);

        // Render immediately so we can animate
        this.render();

        const newCombat = this.state.currentCombat;
        if (!newCombat) return;

        const animationManager = this.renderer.getAnimationManager();
        const combatLog = this.renderer.getCombatLog();

        // Check for damage dealt to enemies
        for (const enemy of newCombat.enemies) {
            const beforeHp = beforeEnemyHp.get(enemy.id) || enemy.maxHp;
            if (enemy.currentHp < beforeHp) {
                const damage = beforeHp - enemy.currentHp;
                await animationManager.animatePlayerAttack(enemy.id, damage);
                combatLog.logDamage(card.name, enemy.name, damage);
            }
        }

        // Check for block gained by heroes
        for (const hero of newCombat.heroes) {
            const blockStatus = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
            const oldHero = oldCombat.heroes.find(h => h.id === hero.id);
            const oldBlock = oldHero?.statusEffects.find(s => s.type === StatusEffectType.Block);

            if (blockStatus && (!oldBlock || blockStatus.stacks > oldBlock.stacks)) {
                const blockGained = blockStatus.stacks - (oldBlock?.stacks || 0);
                animationManager.animatePlayerBlock(hero.id, blockGained);
                combatLog.logBlock(hero.name, blockGained);
            }
        }
    }

    private async handleEndTurn(): Promise<void> {
        if (!this.state.currentCombat) return;

        const animationManager = this.renderer.getAnimationManager();
        const combatLog = this.renderer.getCombatLog();

        // Capture before state for animation comparison
        const beforeCombat = this.state.currentCombat;
        const beforeHeroHp = new Map(beforeCombat.heroes.map(h => [h.id, { hp: h.currentHp, name: h.name }]));
        const beforeEnemyCount = beforeCombat.enemies.length;

        this.isAnimating = true;

        // Show enemy turn transition
        await animationManager.showTurnTransition(false);

        // Log enemy turn start
        combatLog.logTurnStart(false, beforeCombat.turn);

        // Execute the end turn (which triggers enemy turn)
        this.state = handleCombatAction(this.state, 'endTurn');

        // Render to update the UI
        this.render();

        const afterCombat = this.state.currentCombat;

        // Animate enemy actions if we have combat state
        if (afterCombat && afterCombat.phase !== CombatPhase.Victory && afterCombat.phase !== CombatPhase.Defeat) {
            // Animate damage to heroes
            for (const [heroId, before] of beforeHeroHp) {
                const afterHero = afterCombat.heroes.find(h => h.id === heroId);
                if (afterHero && afterHero.currentHp < before.hp) {
                    const damage = before.hp - afterHero.currentHp;

                    // Find which enemy attacked (we'll attribute to first alive enemy for now)
                    const attacker = beforeCombat.enemies.find(e => e.currentHp > 0);
                    if (attacker) {
                        await animationManager.animateEnemyAttack(attacker.id, heroId, damage);
                        combatLog.logDamage(attacker.name, before.name, damage);
                    }
                }
            }

            // Check for new enemies (summons)
            if (afterCombat.enemies.length > beforeEnemyCount) {
                for (const enemy of afterCombat.enemies) {
                    if (!beforeCombat.enemies.find(e => e.id === enemy.id)) {
                        await animationManager.animateSummon(enemy.id);
                        combatLog.addEntry(`${enemy.name} was summoned!`, 'info');
                    }
                }
            }

            // Show player turn transition
            await animationManager.showTurnTransition(true);

            // Log new turn
            combatLog.logTurnStart(true, afterCombat.turn);
        }

        this.isAnimating = false;

        // Final render
        this.render();
    }

    private async handleUseAbility(payload: any): Promise<void> {
        if (!this.state.currentCombat) return;

        const beforeCombat = this.state.currentCombat;
        const beforeEnemyHp = new Map(beforeCombat.enemies.map(e => [e.id, e.currentHp]));

        this.state = handleCombatAction(this.state, 'useAbility', {
            resource: payload.resource as ResourceType,
            targetId: payload.targetId
        });

        this.render();

        const afterCombat = this.state.currentCombat;
        if (!afterCombat) return;

        const animationManager = this.renderer.getAnimationManager();
        const combatLog = this.renderer.getCombatLog();

        const abilityName = payload.resource === ResourceType.Blood ? 'Blood Strike' :
                          payload.resource === ResourceType.Glint ? 'Clarity' :
                          payload.resource === ResourceType.Iron ? 'Fortify' : 'Ability';

        // Check for damage dealt to enemies (Blood Strike)
        for (const enemy of afterCombat.enemies) {
            const beforeHp = beforeEnemyHp.get(enemy.id) || enemy.maxHp;
            if (enemy.currentHp < beforeHp) {
                const damage = beforeHp - enemy.currentHp;
                await animationManager.animatePlayerAttack(enemy.id, damage);
                combatLog.logDamage(abilityName, enemy.name, damage);
            }
        }

        // Check for block on all heroes (Fortify)
        if (payload.resource === ResourceType.Iron) {
            for (const hero of afterCombat.heroes) {
                if (hero.currentHp > 0) {
                    animationManager.animatePlayerBlock(hero.id, 8);
                    combatLog.logBlock(hero.name, 8);
                }
            }
        }

        // Log card draw (Clarity)
        if (payload.resource === ResourceType.Glint) {
            combatLog.addEntry('Drew 2 cards from Clarity', 'card-play');
        }
    }

    private render(): void {
        this.renderer.render(this.state);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SuperheroLongWar();
});

// Export for potential module use
export { SuperheroLongWar };

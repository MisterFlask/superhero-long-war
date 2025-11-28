import { GameState, GamePhase, ResourceType } from './models/types.js';
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

    constructor() {
        this.state = createNewGame();
        this.renderer = new GameRenderer('game-container', this.handleAction.bind(this));
        this.render();
    }

    private handleAction(action: string, payload?: any): void {
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
                }
                break;

            case 'playCard':
                this.state = handleCombatAction(this.state, 'playCard', payload);
                break;

            case 'endTurn':
                this.state = handleCombatAction(this.state, 'endTurn');
                break;

            case 'retreat':
                this.state = handleCombatAction(this.state, 'retreat');
                break;

            case 'useAbility':
                this.state = handleCombatAction(this.state, 'useAbility', {
                    resource: payload.resource as ResourceType,
                    targetId: payload.targetId
                });
                break;

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
                this.state = createNewGame();
                break;

            default:
                console.warn('Unknown action:', action);
        }

        this.render();
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

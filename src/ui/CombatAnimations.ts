import { Enemy, Hero, EnemyIntentType, StatusEffectType } from '../models/types.js';

// ============================================
// COMBAT LOG
// ============================================

export interface CombatLogEntry {
    message: string;
    type: 'damage' | 'heal' | 'block' | 'buff' | 'debuff' | 'card-play' | 'turn' | 'info';
    timestamp: number;
}

export class CombatLog {
    private entries: CombatLogEntry[] = [];
    private maxEntries: number = 50;
    private element: HTMLElement | null = null;
    private collapsed: boolean = false;

    public initialize(container: HTMLElement): void {
        this.element = document.createElement('div');
        this.element.className = 'combat-log';
        this.element.innerHTML = `
            <div class="combat-log-header">
                <span>Combat Log</span>
                <button class="combat-log-toggle">Collapse</button>
            </div>
            <div class="combat-log-content"></div>
        `;

        container.appendChild(this.element);

        const toggleBtn = this.element.querySelector('.combat-log-toggle');
        toggleBtn?.addEventListener('click', () => this.toggle());

        this.render();
    }

    public destroy(): void {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.entries = [];
    }

    public clear(): void {
        this.entries = [];
        this.render();
    }

    public toggle(): void {
        this.collapsed = !this.collapsed;
        if (this.element) {
            this.element.classList.toggle('collapsed', this.collapsed);
            const toggleBtn = this.element.querySelector('.combat-log-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = this.collapsed ? 'Expand' : 'Collapse';
            }
        }
    }

    public addEntry(message: string, type: CombatLogEntry['type']): void {
        const entry: CombatLogEntry = {
            message,
            type,
            timestamp: Date.now()
        };

        this.entries.unshift(entry);

        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(0, this.maxEntries);
        }

        this.render();
    }

    private render(): void {
        if (!this.element) return;

        const content = this.element.querySelector('.combat-log-content');
        if (!content) return;

        content.innerHTML = this.entries.map(entry => `
            <div class="combat-log-entry ${entry.type}">
                ${entry.message}
            </div>
        `).join('');
    }

    // Convenience methods
    public logDamage(source: string, target: string, amount: number): void {
        this.addEntry(`${source} dealt ${amount} damage to ${target}`, 'damage');
    }

    public logHeal(target: string, amount: number): void {
        this.addEntry(`${target} healed for ${amount} HP`, 'heal');
    }

    public logBlock(target: string, amount: number): void {
        this.addEntry(`${target} gained ${amount} Block`, 'block');
    }

    public logBuff(target: string, buff: string, stacks: number): void {
        this.addEntry(`${target} gained ${stacks} ${buff}`, 'buff');
    }

    public logDebuff(target: string, debuff: string, stacks: number): void {
        this.addEntry(`${target} received ${stacks} ${debuff}`, 'debuff');
    }

    public logCardPlay(heroName: string, cardName: string): void {
        this.addEntry(`${heroName} played ${cardName}`, 'card-play');
    }

    public logTurnStart(isPlayer: boolean, turnNumber: number): void {
        const turnType = isPlayer ? 'Player Turn' : 'Enemy Turn';
        this.addEntry(`--- ${turnType} ${turnNumber} ---`, 'turn');
    }

    public logEnemyAction(enemyName: string, actionName: string): void {
        this.addEntry(`${enemyName} uses ${actionName}`, 'info');
    }
}

// ============================================
// COMBAT ANIMATION MANAGER
// ============================================

export class CombatAnimationManager {
    private animationQueue: Array<() => Promise<void>> = [];
    private isProcessing: boolean = false;

    // Show floating text at a position
    public showFloatingText(
        text: string,
        x: number,
        y: number,
        type: 'damage' | 'heal' | 'block' | 'buff' | 'debuff' | 'resource' | 'miss'
    ): void {
        const element = document.createElement('div');
        element.className = `floating-text ${type}`;
        element.textContent = text;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        document.body.appendChild(element);

        // Remove after animation completes
        setTimeout(() => {
            element.remove();
        }, 1200);
    }

    // Show floating text above an element
    public showFloatingTextOnElement(
        elementSelector: string,
        text: string,
        type: 'damage' | 'heal' | 'block' | 'buff' | 'debuff' | 'resource' | 'miss'
    ): void {
        const element = document.querySelector(elementSelector);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - 20;
        const y = rect.top;

        this.showFloatingText(text, x, y, type);
    }

    // Apply animation class to element
    public animate(
        elementSelector: string,
        animationClass: string,
        duration: number = 500
    ): Promise<void> {
        return new Promise((resolve) => {
            const element = document.querySelector(elementSelector);
            if (!element) {
                resolve();
                return;
            }

            element.classList.add(animationClass);

            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve();
            }, duration);
        });
    }

    // Queue an animation
    public queueAnimation(animation: () => Promise<void>): void {
        this.animationQueue.push(animation);
        this.processQueue();
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing) return;

        this.isProcessing = true;

        while (this.animationQueue.length > 0) {
            const animation = this.animationQueue.shift();
            if (animation) {
                await animation();
            }
        }

        this.isProcessing = false;
    }

    // Show turn transition overlay
    public showTurnTransition(isPlayerTurn: boolean): Promise<void> {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'turn-transition';
            overlay.innerHTML = `
                <div class="turn-transition-text ${isPlayerTurn ? 'player-turn' : 'enemy-turn'}">
                    ${isPlayerTurn ? 'Your Turn' : 'Enemy Turn'}
                </div>
            `;

            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.remove();
                resolve();
            }, 1500);
        });
    }

    // Animate enemy attack
    public async animateEnemyAttack(
        enemyId: string,
        targetHeroId: string,
        damage: number
    ): Promise<void> {
        const enemySelector = `.enemy-unit[data-enemy-id="${enemyId}"]`;
        const heroSelector = `.combat-hero[data-hero-id="${targetHeroId}"]`;

        // Enemy attack animation
        await this.animate(enemySelector, 'enemy-attacking', 600);

        // Hero taking damage
        this.animate(heroSelector, 'taking-damage', 400);
        this.animate(heroSelector, 'damage-flash', 500);

        // Show damage number
        this.showFloatingTextOnElement(heroSelector, `-${damage}`, 'damage');
    }

    // Animate enemy block
    public async animateEnemyBlock(enemyId: string, blockAmount: number): Promise<void> {
        const selector = `.enemy-unit[data-enemy-id="${enemyId}"]`;
        await this.animate(selector, 'enemy-blocking', 400);
        this.showFloatingTextOnElement(selector, `+${blockAmount}`, 'block');
    }

    // Animate enemy buff
    public async animateEnemyBuff(enemyId: string, buffName: string): Promise<void> {
        const selector = `.enemy-unit[data-enemy-id="${enemyId}"]`;
        await this.animate(selector, 'enemy-buffing', 500);
        this.showFloatingTextOnElement(selector, buffName, 'buff');
    }

    // Animate enemy debuff on hero
    public async animateDebuffOnHero(heroId: string, debuffName: string): Promise<void> {
        const selector = `.combat-hero[data-hero-id="${heroId}"]`;
        await this.animate(selector, 'debuff-applied', 600);
        this.showFloatingTextOnElement(selector, debuffName, 'debuff');
    }

    // Animate buff on hero
    public async animateBuffOnHero(heroId: string, buffName: string): Promise<void> {
        const selector = `.combat-hero[data-hero-id="${heroId}"]`;
        await this.animate(selector, 'buff-applied', 600);
        this.showFloatingTextOnElement(selector, buffName, 'buff');
    }

    // Animate summon
    public async animateSummon(enemyId: string): Promise<void> {
        const selector = `.enemy-unit[data-enemy-id="${enemyId}"]`;
        await this.animate(selector, 'enemy-summoned', 600);
    }

    // Animate card being played
    public animateCardPlay(cardId: string): Promise<void> {
        return new Promise((resolve) => {
            const selector = `.hand-card[data-card-id="${cardId}"]`;
            const element = document.querySelector(selector);
            if (!element) {
                resolve();
                return;
            }

            element.classList.add('card-playing');

            setTimeout(() => {
                resolve();
            }, 400);
        });
    }

    // Animate player attack on enemy
    public async animatePlayerAttack(
        enemyId: string,
        damage: number
    ): Promise<void> {
        const selector = `.enemy-unit[data-enemy-id="${enemyId}"]`;

        await this.animate(selector, 'taking-damage', 400);
        this.animate(selector, 'damage-flash', 500);
        this.showFloatingTextOnElement(selector, `-${damage}`, 'damage');
    }

    // Animate player gaining block
    public animatePlayerBlock(heroId: string, blockAmount: number): void {
        const selector = `.combat-hero[data-hero-id="${heroId}"]`;
        this.animate(selector, 'block-flash', 400);
        this.showFloatingTextOnElement(selector, `+${blockAmount}`, 'block');
    }

    // Animate resource gain
    public animateResourceGain(resourceType: string, amount: number): void {
        // Find the resource display element
        const resourceDisplays = document.querySelectorAll('.resource-display');
        resourceDisplays.forEach(display => {
            const text = display.textContent || '';
            if (text.includes(resourceType.charAt(0))) {
                const rect = display.getBoundingClientRect();
                this.showFloatingText(`+${amount}`, rect.left, rect.top, 'resource');
            }
        });
    }
}

// ============================================
// ENEMY ACTION EXECUTOR WITH ANIMATIONS
// ============================================

export interface EnemyActionResult {
    enemyId: string;
    enemyName: string;
    actionName: string;
    intentType: EnemyIntentType;
    targets: {
        heroId?: string;
        heroName?: string;
        damage?: number;
        block?: number;
        statusApplied?: { type: StatusEffectType; stacks: number };
    }[];
    selfEffects?: {
        block?: number;
        statusApplied?: { type: StatusEffectType; stacks: number }[];
    };
    summonedEnemy?: string;
}

export async function executeEnemyActionsWithAnimation(
    actions: EnemyActionResult[],
    animationManager: CombatAnimationManager,
    combatLog: CombatLog
): Promise<void> {
    for (const action of actions) {
        // Log the action
        combatLog.logEnemyAction(action.enemyName, action.actionName);

        // Process based on intent type
        switch (action.intentType) {
            case EnemyIntentType.Attack:
                for (const target of action.targets) {
                    if (target.heroId && target.damage !== undefined) {
                        await animationManager.animateEnemyAttack(
                            action.enemyId,
                            target.heroId,
                            target.damage
                        );
                        combatLog.logDamage(action.enemyName, target.heroName || 'Hero', target.damage);

                        // Small delay between multiple targets
                        await delay(200);
                    }
                }
                break;

            case EnemyIntentType.Block:
                if (action.selfEffects?.block) {
                    await animationManager.animateEnemyBlock(action.enemyId, action.selfEffects.block);
                    combatLog.logBlock(action.enemyName, action.selfEffects.block);
                }
                break;

            case EnemyIntentType.Buff:
                if (action.selfEffects?.statusApplied) {
                    for (const status of action.selfEffects.statusApplied) {
                        await animationManager.animateEnemyBuff(action.enemyId, status.type);
                        combatLog.logBuff(action.enemyName, status.type, status.stacks);
                    }
                }
                break;

            case EnemyIntentType.Debuff:
                for (const target of action.targets) {
                    if (target.heroId && target.statusApplied) {
                        await animationManager.animateDebuffOnHero(target.heroId, target.statusApplied.type);
                        combatLog.logDebuff(target.heroName || 'Hero', target.statusApplied.type, target.statusApplied.stacks);
                        await delay(200);
                    }
                }
                break;

            case EnemyIntentType.Summon:
                if (action.summonedEnemy) {
                    // The summoned enemy ID would need to be tracked
                    combatLog.addEntry(`${action.enemyName} summoned ${action.summonedEnemy}!`, 'info');
                }
                break;
        }

        // Delay between enemy actions
        await delay(300);
    }
}

// Helper function for delays
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// TARGETING HELPER
// ============================================

export type TargetType = 'enemy' | 'hero' | 'card' | 'any';

export interface TargetingConfig {
    validTargets: TargetType;
    callback: (targetId: string, targetType: TargetType) => void;
    cancelCallback: () => void;
    hintText: string;
}

export class TargetingManager {
    private active: boolean = false;
    private config: TargetingConfig | null = null;
    private overlayElement: HTMLElement | null = null;
    private hintElement: HTMLElement | null = null;
    private cancelButton: HTMLElement | null = null;

    public startTargeting(config: TargetingConfig): void {
        this.active = true;
        this.config = config;

        // Add targeting class to body
        document.body.classList.add('targeting-mode');

        // Create overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'targeting-overlay';
        document.body.appendChild(this.overlayElement);

        // Create hint
        this.hintElement = document.createElement('div');
        this.hintElement.className = 'targeting-hint';
        this.hintElement.textContent = config.hintText;
        document.body.appendChild(this.hintElement);

        // Create cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.className = 'btn btn-danger cancel-targeting';
        this.cancelButton.textContent = 'Cancel';
        this.cancelButton.addEventListener('click', () => this.cancel());
        document.body.appendChild(this.cancelButton);

        // Add targetable class to valid targets
        this.highlightValidTargets();

        // Add click handlers
        this.addTargetClickHandlers();
    }

    private highlightValidTargets(): void {
        if (!this.config) return;

        switch (this.config.validTargets) {
            case 'enemy':
                document.querySelectorAll('.enemy-unit:not(.dead)').forEach(el => {
                    el.classList.add('targetable');
                });
                break;
            case 'hero':
                document.querySelectorAll('.combat-hero:not(.dead)').forEach(el => {
                    el.classList.add('targetable');
                });
                break;
            case 'card':
                document.querySelectorAll('.hand-card').forEach(el => {
                    el.classList.add('card-targetable');
                });
                break;
            case 'any':
                document.querySelectorAll('.enemy-unit:not(.dead), .combat-hero:not(.dead)').forEach(el => {
                    el.classList.add('targetable');
                });
                break;
        }
    }

    private addTargetClickHandlers(): void {
        if (!this.config) return;

        // Handle clicks on valid targets
        document.querySelectorAll('.targetable, .card-targetable').forEach(el => {
            el.addEventListener('click', this.handleTargetClick.bind(this), { once: true });
        });

        // Handle escape key
        document.addEventListener('keydown', this.handleEscapeKey.bind(this), { once: true });
    }

    private handleTargetClick = (event: Event): void => {
        if (!this.config || !this.active) return;

        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;

        let targetId: string | undefined;
        let targetType: TargetType;

        if (target.classList.contains('enemy-unit')) {
            targetId = target.dataset.enemyId;
            targetType = 'enemy';
        } else if (target.classList.contains('combat-hero')) {
            targetId = target.dataset.heroId;
            targetType = 'hero';
        } else if (target.classList.contains('hand-card')) {
            targetId = target.dataset.cardId;
            targetType = 'card';
        } else {
            return;
        }

        if (targetId) {
            this.config.callback(targetId, targetType);
        }

        this.cleanup();
    };

    private handleEscapeKey = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.cancel();
        }
    };

    public cancel(): void {
        if (this.config) {
            this.config.cancelCallback();
        }
        this.cleanup();
    }

    private cleanup(): void {
        this.active = false;
        this.config = null;

        // Remove targeting class
        document.body.classList.remove('targeting-mode');

        // Remove elements
        this.overlayElement?.remove();
        this.hintElement?.remove();
        this.cancelButton?.remove();

        // Remove targetable classes
        document.querySelectorAll('.targetable, .card-targetable').forEach(el => {
            el.classList.remove('targetable', 'card-targetable');
        });
    }

    public isActive(): boolean {
        return this.active;
    }
}

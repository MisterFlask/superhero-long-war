import {
    StatusEffectType, ResourceType, HeroClass, Faction,
    CardInstance, Enemy, Hero, CombatState, EnemyIntentType
} from '../models/types.js';

// ============================================
// TOOLTIP DATA DEFINITIONS
// ============================================

export const STATUS_EFFECT_INFO: Record<StatusEffectType, { description: string; type: 'positive' | 'negative' | 'neutral' }> = {
    [StatusEffectType.Block]: {
        description: 'Reduces incoming damage. Block is removed at the start of your turn.',
        type: 'positive'
    },
    [StatusEffectType.Strength]: {
        description: 'Increases damage dealt by attacks. Each stack adds +1 damage.',
        type: 'positive'
    },
    [StatusEffectType.Hidden]: {
        description: 'Cannot be targeted by single-target enemy attacks. Removed after attacking (unless specified otherwise).',
        type: 'positive'
    },
    [StatusEffectType.Untargetable]: {
        description: 'Cannot be targeted by enemy attacks. Different from Hidden - does not break on attacking.',
        type: 'positive'
    },
    [StatusEffectType.Vulnerable]: {
        description: 'Takes 50% more damage from attacks. Decreases by 1 each turn.',
        type: 'negative'
    },
    [StatusEffectType.Weak]: {
        description: 'Deals 25% less damage with attacks. Decreases by 1 each turn.',
        type: 'negative'
    },
    [StatusEffectType.Poison]: {
        description: 'Takes damage equal to stacks at the start of turn. Poison decreases by 1 each turn.',
        type: 'negative'
    },
    [StatusEffectType.Marked]: {
        description: 'Enemies prioritize attacking marked targets. May trigger special effects.',
        type: 'negative'
    },
    [StatusEffectType.Thorns]: {
        description: 'When attacked, deals damage back to the attacker equal to Thorns stacks.',
        type: 'neutral'
    },
    [StatusEffectType.Regeneration]: {
        description: 'Heals HP equal to stacks at the start of each turn.',
        type: 'positive'
    }
};

export const RESOURCE_INFO: Record<ResourceType, { description: string; icon: string; color: string; primaryClasses: string[]; abilities: string }> = {
    [ResourceType.Blood]: {
        description: 'Generated through combat and sacrifice. Represents vitality and life force.',
        icon: '🩸',
        color: '#dc2626',
        primaryClasses: ['Brute', 'Blaster'],
        abilities: 'Blood Strike: Spend 3 Blood + 1 Energy to deal 8 damage.'
    },
    [ResourceType.Glint]: {
        description: 'Gained through perception and insight. Represents opportunity and awareness.',
        icon: '✨',
        color: '#fbbf24',
        primaryClasses: ['Thinker', 'Mover', 'Stranger'],
        abilities: 'Clarity: Spend 3 Glint + 1 Energy to draw 2 cards.'
    },
    [ResourceType.Ashes]: {
        description: 'Created through destruction. Represents entropy and transformation.',
        icon: '🔥',
        color: '#6b7280',
        primaryClasses: ['Blaster', 'Stranger'],
        abilities: 'Spend 3 Ashes to exhaust a card from hand.'
    },
    [ResourceType.Pages]: {
        description: 'Accumulated through knowledge. Represents preparation and wisdom.',
        icon: '📖',
        color: '#3b82f6',
        primaryClasses: ['Tinker', 'Thinker'],
        abilities: 'Spend 3 Pages to scry 3 cards.'
    },
    [ResourceType.Iron]: {
        description: 'Built through endurance. Represents willpower and fortitude.',
        icon: '🛡️',
        color: '#a1a1aa',
        primaryClasses: ['Brute', 'Mover'],
        abilities: 'Fortify: Spend 3 Iron + 1 Energy to give all heroes 8 Block.'
    }
};

export const HERO_CLASS_INFO: Record<HeroClass, { description: string; icon: string; playstyle: string; primaryResources: string }> = {
    [HeroClass.Brute]: {
        description: 'Tank specialists who absorb damage and protect their team.',
        icon: '💪',
        playstyle: 'High HP, Block generation, self-damage synergies',
        primaryResources: 'Blood and Iron'
    },
    [HeroClass.Blaster]: {
        description: 'Damage dealers who excel at eliminating enemies quickly.',
        icon: '💥',
        playstyle: 'High damage, AoE attacks, glass cannon',
        primaryResources: 'Ashes and Blood'
    },
    [HeroClass.Tinker]: {
        description: 'Gadget deployers who create lasting effects on the battlefield.',
        icon: '⚙️',
        playstyle: 'Gadget deployment, sustained value, turrets and shields',
        primaryResources: 'Pages and Glint'
    },
    [HeroClass.Thinker]: {
        description: 'Support specialists who enhance the team and control card flow.',
        icon: '🧠',
        playstyle: 'Card draw, team buffs, resource generation',
        primaryResources: 'Glint and Pages'
    },
    [HeroClass.Mover]: {
        description: 'Agile fighters who evade attacks and strike unpredictably.',
        icon: '⚡',
        playstyle: 'Evasion, Untargetable, hit-and-run tactics',
        primaryResources: 'Glint and Iron'
    },
    [HeroClass.Stranger]: {
        description: 'Stealth operatives who deal massive damage from the shadows.',
        icon: '👤',
        playstyle: 'Hidden status, burst damage, assassination',
        primaryResources: 'Ashes and Glint'
    }
};

export const FACTION_INFO: Record<Faction, { description: string; enemies: string; mechanics: string }> = {
    [Faction.Cult]: {
        description: 'The Cult of the Veil - Lovecraftian horrors from the Southern States.',
        enemies: 'Cultists, Void Spawns, Eldritch Horrors, High Priests',
        mechanics: 'Debuffs, Summoning, Ritual damage'
    },
    [Faction.Undead]: {
        description: 'The Undead Horde - Necromantic forces from the Eastern States.',
        enemies: 'Skeletons, Zombies, Death Knights, Lich Kings',
        mechanics: 'Regeneration, Life Drain, Resurrection'
    },
    [Faction.Swarm]: {
        description: 'The Swarm - Alien insectoid invaders from the Western States.',
        enemies: 'Drones, Spitters, Warriors, Hive Queens',
        mechanics: 'Poison, Numbers advantage, Frenzy'
    }
};

export const INTENT_INFO: Record<EnemyIntentType, { description: string; icon: string }> = {
    [EnemyIntentType.Attack]: {
        description: 'This enemy intends to deal damage. The number shows expected damage.',
        icon: '⚔️'
    },
    [EnemyIntentType.Block]: {
        description: 'This enemy will gain Block, reducing damage it takes.',
        icon: '🛡️'
    },
    [EnemyIntentType.Buff]: {
        description: 'This enemy will buff itself, gaining Strength or other positive effects.',
        icon: '⬆️'
    },
    [EnemyIntentType.Debuff]: {
        description: 'This enemy will debuff your heroes with Weak, Vulnerable, or other negative effects.',
        icon: '⬇️'
    },
    [EnemyIntentType.Summon]: {
        description: 'This enemy will summon additional enemies to the fight.',
        icon: '👥'
    },
    [EnemyIntentType.Special]: {
        description: 'This enemy is preparing a special ability.',
        icon: '⭐'
    }
};

// ============================================
// TOOLTIP MANAGER CLASS
// ============================================

export class TooltipManager {
    private tooltipElement: HTMLElement | null = null;
    private hideTimeout: number | null = null;

    constructor() {
        this.createTooltipElement();
        this.bindGlobalListeners();
    }

    private createTooltipElement(): void {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip-container';
        this.tooltipElement.style.display = 'none';
        document.body.appendChild(this.tooltipElement);
    }

    private bindGlobalListeners(): void {
        // Hide tooltip when clicking anywhere
        document.addEventListener('click', () => this.hide());
        document.addEventListener('scroll', () => this.hide(), true);
    }

    public show(content: string, x: number, y: number): void {
        if (!this.tooltipElement) return;

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        this.tooltipElement.innerHTML = content;
        this.tooltipElement.style.display = 'block';

        // Position tooltip
        const rect = this.tooltipElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = x + 15;
        let top = y - 10;

        // Keep tooltip within viewport
        if (left + rect.width > viewportWidth - 10) {
            left = x - rect.width - 15;
        }
        if (top + rect.height > viewportHeight - 10) {
            top = viewportHeight - rect.height - 10;
        }
        if (top < 10) {
            top = 10;
        }
        if (left < 10) {
            left = 10;
        }

        this.tooltipElement.style.left = `${left}px`;
        this.tooltipElement.style.top = `${top}px`;
    }

    public hide(): void {
        if (!this.tooltipElement) return;
        this.tooltipElement.style.display = 'none';
    }

    public hideWithDelay(delay: number = 100): void {
        this.hideTimeout = window.setTimeout(() => this.hide(), delay);
    }

    // ============================================
    // TOOLTIP CONTENT GENERATORS
    // ============================================

    public generateStatusEffectTooltip(type: StatusEffectType, stacks: number): string {
        const info = STATUS_EFFECT_INFO[type];
        const effectClass = info.type;
        const icon = this.getStatusIcon(type);

        return `
            <div class="tooltip-title">
                <span>${icon}</span>
                <span>${type}</span>
                <span style="color: var(--accent-blue); margin-left: auto;">${stacks} stacks</span>
            </div>
            <div class="tooltip-effect ${effectClass}">
                <span>${info.description}</span>
            </div>
        `;
    }

    public generateResourceTooltip(type: ResourceType, currentValue: number): string {
        const info = RESOURCE_INFO[type];

        return `
            <div class="tooltip-title">
                <span>${info.icon}</span>
                <span>${type}</span>
                <span style="color: ${info.color}; margin-left: auto;">${currentValue}</span>
            </div>
            <div class="tooltip-description">${info.description}</div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Primary Classes</span>
                    <span class="tooltip-stat-value">${info.primaryClasses.join(', ')}</span>
                </div>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-description" style="color: var(--accent-blue);">
                <strong>Ability:</strong> ${info.abilities}
            </div>
        `;
    }

    public generateHeroClassTooltip(heroClass: HeroClass): string {
        const info = HERO_CLASS_INFO[heroClass];

        return `
            <div class="tooltip-title">
                <span>${info.icon}</span>
                <span>${heroClass}</span>
            </div>
            <div class="tooltip-description">${info.description}</div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Playstyle</span>
                    <span class="tooltip-stat-value">${info.playstyle}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Resources</span>
                    <span class="tooltip-stat-value">${info.primaryResources}</span>
                </div>
            </div>
        `;
    }

    public generateCardTooltip(card: CardInstance, combat?: CombatState): string {
        const classInfo = HERO_CLASS_INFO[card.heroClass];
        let effectDetails = this.generateCardEffectDetails(card, combat);

        return `
            <div class="tooltip-title">
                <span class="tooltip-card-cost" style="background: ${this.getClassColor(card.heroClass)};">${card.energyCost}</span>
                <span>${card.name}</span>
            </div>
            <div class="tooltip-subtitle">
                <span class="tooltip-card-type">${card.rarity} ${card.type}</span>
                <span style="color: ${this.getClassColor(card.heroClass)}; margin-left: 8px;">${classInfo.icon} ${card.heroClass}</span>
            </div>
            <div class="tooltip-description">${card.description}</div>
            ${effectDetails}
            ${card.flavorText ? `<div class="tooltip-divider"></div><div class="tooltip-description" style="font-style: italic; color: var(--text-muted);">"${card.flavorText}"</div>` : ''}
        `;
    }

    private generateCardEffectDetails(card: CardInstance, combat?: CombatState): string {
        const effect = card.effect;
        const details: string[] = [];

        if (effect.damage !== undefined) {
            let damageText = `${effect.damage} damage`;
            if (effect.damageScaling) {
                const resourceValue = combat ? combat.resources[effect.damageScaling.resource] : 0;
                const bonus = resourceValue * effect.damageScaling.multiplier;
                damageText = `${effect.damage} + ${effect.damageScaling.multiplier}x ${effect.damageScaling.resource} (${effect.damage + bonus})`;
            }
            if (effect.damageAll) {
                damageText += ' to ALL enemies';
            }
            details.push(`<span style="color: var(--accent-red);">⚔️ ${damageText}</span>`);
        }

        if (effect.block !== undefined) {
            let blockText = `${effect.block} block`;
            if (effect.blockScaling) {
                const resourceValue = combat ? combat.resources[effect.blockScaling.resource] : 0;
                const bonus = resourceValue * effect.blockScaling.multiplier;
                blockText = `${effect.block} + ${effect.blockScaling.multiplier}x ${effect.blockScaling.resource} (${effect.block + bonus})`;
            }
            details.push(`<span style="color: var(--accent-blue);">🛡️ ${blockText}</span>`);
        }

        if (effect.draw) {
            let drawText = `Draw ${effect.draw} card${effect.draw > 1 ? 's' : ''}`;
            if (effect.drawScaling) {
                drawText += ` + ${effect.drawScaling.multiplier}x ${effect.drawScaling.resource}`;
            }
            details.push(`<span style="color: var(--glint);">📋 ${drawText}</span>`);
        }

        if (effect.generateResource) {
            const res = effect.generateResource;
            details.push(`<span style="color: ${RESOURCE_INFO[res.type].color};">${RESOURCE_INFO[res.type].icon} +${res.amount} ${res.type}</span>`);
        }

        if (effect.applyToEnemy && effect.applyToEnemy.length > 0) {
            effect.applyToEnemy.forEach(status => {
                details.push(`<span style="color: var(--accent-purple);">Apply ${status.stacks} ${status.type} to enemy</span>`);
            });
        }

        if (effect.applyToSelf && effect.applyToSelf.length > 0) {
            effect.applyToSelf.forEach(status => {
                const info = STATUS_EFFECT_INFO[status.type];
                const color = info.type === 'positive' ? 'var(--accent-green)' : info.type === 'negative' ? 'var(--accent-red)' : 'var(--accent-blue)';
                details.push(`<span style="color: ${color};">Gain ${status.stacks} ${status.type}</span>`);
            });
        }

        if (effect.deployGadget) {
            details.push(`<span style="color: var(--tinker);">⚙️ Deploy ${effect.deployGadget.name} (${effect.deployGadget.duration} turns)</span>`);
        }

        if (effect.exhaust) {
            details.push(`<span style="color: var(--accent-orange);">Exhaust</span>`);
        }

        if (effect.becomeHidden) {
            details.push(`<span style="color: var(--stranger);">Become Hidden</span>`);
        }

        if (details.length === 0) return '';

        return `
            <div class="tooltip-stats">
                ${details.map(d => `<div class="tooltip-stat">${d}</div>`).join('')}
            </div>
        `;
    }

    public generateEnemyTooltip(enemy: Enemy): string {
        const factionInfo = FACTION_INFO[enemy.faction];
        const intentInfo = INTENT_INFO[enemy.intent.type];

        let abilitiesHtml = enemy.abilities.map(ability => {
            const intentIcon = INTENT_INFO[ability.intentType].icon;
            return `<div class="tooltip-stat">
                <span>${intentIcon} ${ability.name}</span>
                ${ability.intentValue ? `<span style="color: var(--accent-red);">${ability.intentValue}</span>` : ''}
            </div>`;
        }).join('');

        return `
            <div class="tooltip-title">
                <span>${enemy.name}</span>
                ${enemy.isBoss ? '<span style="color: var(--accent-orange);">BOSS</span>' : ''}
            </div>
            <div class="tooltip-subtitle">${enemy.faction} Faction</div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">HP</span>
                    <span class="tooltip-stat-value">${enemy.currentHp}/${enemy.maxHp}</span>
                </div>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-description" style="color: var(--text-muted);">
                <strong>Current Intent:</strong> ${intentInfo.icon} ${enemy.intent.description}
                <br><small>${intentInfo.description}</small>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-description"><strong>Abilities:</strong></div>
            <div class="tooltip-stats">
                ${abilitiesHtml}
            </div>
        `;
    }

    public generateHeroTooltip(hero: Hero): string {
        const classInfo = HERO_CLASS_INFO[hero.heroClass];
        const statusEffectsHtml = hero.statusEffects.length > 0
            ? hero.statusEffects.map(s => {
                const info = STATUS_EFFECT_INFO[s.type];
                const icon = this.getStatusIcon(s.type);
                return `<span class="tooltip-effect ${info.type}">${icon} ${s.type}: ${s.stacks}</span>`;
            }).join('')
            : '<span style="color: var(--text-muted);">No active effects</span>';

        return `
            <div class="tooltip-title">
                <span>${classInfo.icon}</span>
                <span>${hero.name}</span>
            </div>
            <div class="tooltip-subtitle">${hero.heroClass}</div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">HP</span>
                    <span class="tooltip-stat-value" style="color: var(--accent-red);">${hero.currentHp}/${hero.maxHp}</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Stress</span>
                    <span class="tooltip-stat-value" style="color: var(--accent-orange);">${hero.stress}%</span>
                </div>
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Deck Size</span>
                    <span class="tooltip-stat-value">${hero.deck.length} cards</span>
                </div>
                ${hero.traumaCards.length > 0 ? `
                <div class="tooltip-stat">
                    <span class="tooltip-stat-label">Trauma Cards</span>
                    <span class="tooltip-stat-value" style="color: var(--accent-red);">${hero.traumaCards.length}</span>
                </div>
                ` : ''}
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-description"><strong>Status Effects:</strong></div>
            ${statusEffectsHtml}
            <div class="tooltip-divider"></div>
            <div class="tooltip-description" style="color: var(--text-muted);">${classInfo.description}</div>
        `;
    }

    public generateIntentTooltip(enemy: Enemy): string {
        const intentInfo = INTENT_INFO[enemy.intent.type];

        return `
            <div class="tooltip-title">
                <span>${intentInfo.icon}</span>
                <span>${enemy.intent.description}</span>
            </div>
            <div class="tooltip-description">${intentInfo.description}</div>
            ${enemy.intent.value ? `
                <div class="tooltip-stats">
                    <div class="tooltip-stat">
                        <span class="tooltip-stat-label">Value</span>
                        <span class="tooltip-stat-value" style="color: var(--accent-red);">${enemy.intent.value}</span>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

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
}

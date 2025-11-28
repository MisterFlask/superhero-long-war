import {
    CombatState, CombatPhase, Hero, Enemy, CardInstance,
    Resources, ResourceType, StatusEffectType, StatusEffect,
    GadgetInstance, createEmptyResources, generateId, EnemyIntentType
} from '../models/types.js';
import { selectAbility, getSummonedEnemy } from '../data/enemies.js';

// ============================================
// COMBAT INITIALIZATION
// ============================================

export function initializeCombat(heroes: Hero[], enemies: Enemy[]): CombatState {
    // Merge all hero decks
    const allCards: CardInstance[] = [];
    heroes.forEach(hero => {
        // Add hero's regular deck and trauma cards
        allCards.push(...hero.deck);
        allCards.push(...hero.traumaCards);
    });

    // Shuffle the combined deck
    const shuffledDeck = shuffleArray([...allCards]);

    return {
        heroes: heroes.map(h => ({
            ...h,
            statusEffects: []
        })),
        enemies: enemies.map(e => ({
            ...e,
            statusEffects: []
        })),
        drawPile: shuffledDeck,
        hand: [],
        discardPile: [],
        exhaustPile: [],
        resources: createEmptyResources(),
        energy: 3,
        maxEnergy: 3,
        turn: 0,
        phase: CombatPhase.PlayerTurn,
        cardsPlayedThisTurn: 0,
        gadgets: [],
        damageDealtThisTurn: 0,
        targetingMode: null
    };
}

export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ============================================
// TURN MANAGEMENT
// ============================================

export function startPlayerTurn(state: CombatState): CombatState {
    const newState = { ...state };
    newState.turn++;
    newState.phase = CombatPhase.PlayerTurn;
    newState.energy = newState.maxEnergy;
    newState.cardsPlayedThisTurn = 0;
    newState.damageDealtThisTurn = 0;

    // Process start-of-turn gadgets (shield generators)
    newState.gadgets.forEach(gadget => {
        if (gadget.effectPerTurn.block) {
            const block = calculateBlock(gadget.effectPerTurn, newState.resources);
            applyBlockToTeam(newState, block);
        }
    });

    // Process regeneration on heroes
    newState.heroes.forEach(hero => {
        const regen = hero.statusEffects.find(s => s.type === StatusEffectType.Regeneration);
        if (regen) {
            hero.currentHp = Math.min(hero.maxHp, hero.currentHp + regen.stacks);
        }
    });

    // Draw cards
    drawCards(newState, 5);

    // Decay status effects
    decayStatusEffects(newState.heroes);

    return newState;
}

export function endPlayerTurn(state: CombatState): CombatState {
    const newState = { ...state };

    // Process end-of-turn gadgets (turrets)
    newState.gadgets.forEach(gadget => {
        if (gadget.effectPerTurn.damage) {
            const damage = gadget.effectPerTurn.damage;
            const aliveEnemies = newState.enemies.filter(e => e.currentHp > 0);
            if (aliveEnemies.length > 0) {
                const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                applyDamageToEnemy(newState, target, damage);
            }
        }

        // Reduce gadget duration
        gadget.turnsRemaining--;
    });

    // Remove expired gadgets
    newState.gadgets = newState.gadgets.filter(g => g.turnsRemaining > 0);

    // Discard hand
    newState.discardPile.push(...newState.hand);
    newState.hand = [];

    // Clear block from heroes
    newState.heroes.forEach(hero => {
        hero.statusEffects = hero.statusEffects.filter(s => s.type !== StatusEffectType.Block);
    });

    newState.phase = CombatPhase.EnemyTurn;
    return newState;
}

export function executeEnemyTurn(state: CombatState): CombatState {
    let newState = { ...state };

    // Process each enemy
    for (const enemy of newState.enemies) {
        if (enemy.currentHp <= 0) continue;

        // Process poison on enemy
        const poison = enemy.statusEffects.find(s => s.type === StatusEffectType.Poison);
        if (poison) {
            enemy.currentHp -= poison.stacks;
            poison.stacks--; // Poison decreases each turn
            if (poison.stacks <= 0) {
                enemy.statusEffects = enemy.statusEffects.filter(s => s.type !== StatusEffectType.Poison);
            }
        }

        if (enemy.currentHp <= 0) continue;

        // Execute enemy intent
        const ability = enemy.abilities.find(a => a.name === enemy.intent.description);
        if (ability) {
            newState = executeEnemyAbility(newState, enemy, ability);
        }

        // Select new intent
        const nextAbility = selectAbility(enemy.abilities);
        enemy.intent = {
            type: nextAbility.intentType,
            value: nextAbility.intentValue,
            description: nextAbility.name
        };
    }

    // Decay enemy status effects
    decayEnemyStatusEffects(newState.enemies);

    // Process regeneration on enemies
    newState.enemies.forEach(enemy => {
        const regen = enemy.statusEffects.find(s => s.type === StatusEffectType.Regeneration);
        if (regen) {
            enemy.currentHp = Math.min(enemy.maxHp, enemy.currentHp + regen.stacks);
        }
    });

    // Check for victory/defeat
    newState = checkCombatEnd(newState);

    if (newState.phase === CombatPhase.EnemyTurn) {
        newState = startPlayerTurn(newState);
    }

    return newState;
}

function executeEnemyAbility(state: CombatState, enemy: Enemy, ability: any): CombatState {
    const newState = { ...state };
    const effect = ability.effect;

    // Find target hero (based on threat or random)
    const aliveHeroes = newState.heroes.filter(h => h.currentHp > 0);
    if (aliveHeroes.length === 0) return newState;

    // Check for untargetable heroes
    const targetableHeroes = aliveHeroes.filter(h =>
        !h.statusEffects.some(s => s.type === StatusEffectType.Untargetable)
    );

    const targetPool = targetableHeroes.length > 0 ? targetableHeroes : aliveHeroes;
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    // Get enemy strength bonus
    const strength = enemy.statusEffects.find(s => s.type === StatusEffectType.Strength);
    const strengthBonus = strength ? strength.stacks : 0;

    // Apply damage
    if (effect.damage) {
        let damage = effect.damage + strengthBonus;

        // Check for vulnerable on target
        const vulnerable = target.statusEffects.find(s => s.type === StatusEffectType.Vulnerable);
        if (vulnerable) {
            damage = Math.floor(damage * 1.5);
        }

        // Check for weak on enemy
        const weak = enemy.statusEffects.find(s => s.type === StatusEffectType.Weak);
        if (weak) {
            damage = Math.floor(damage * 0.75);
        }

        if (effect.damageAll) {
            // Damage all heroes
            newState.heroes.forEach(h => {
                if (h.currentHp > 0) {
                    applyDamageToHero(newState, h, damage);
                }
            });
        } else {
            applyDamageToHero(newState, target, damage);
        }
    }

    // Apply block
    if (effect.block) {
        applyStatusEffect(enemy, { type: StatusEffectType.Block, stacks: effect.block });
    }

    // Apply debuffs to heroes
    if (effect.applyToEnemy) {
        effect.applyToEnemy.forEach((status: StatusEffect) => {
            applyStatusEffect(target, status);
        });
    }

    if (effect.applyToAllEnemies) {
        // In enemy context, "all enemies" means all heroes
        effect.applyToAllEnemies.forEach((status: StatusEffect) => {
            newState.heroes.forEach(h => {
                if (h.currentHp > 0) {
                    applyStatusEffect(h, status);
                }
            });
        });
    }

    // Apply buffs to self
    if (effect.applyToSelf) {
        effect.applyToSelf.forEach((status: StatusEffect) => {
            applyStatusEffect(enemy, status);
        });
    }

    // Handle summon
    if (ability.intentType === EnemyIntentType.Summon) {
        const summon = getSummonedEnemy(enemy.faction, 1);
        newState.enemies.push(summon);
    }

    return newState;
}

// ============================================
// CARD PLAYING
// ============================================

export function canPlayCard(state: CombatState, card: CardInstance): boolean {
    // Check if we're in player turn
    if (state.phase !== CombatPhase.PlayerTurn) return false;

    // Check energy cost
    if (card.energyCost > state.energy) return false;

    // Check if hero is still alive
    const owner = state.heroes.find(h => h.id === card.ownerId);
    if (!owner || owner.currentHp <= 0) return false;

    // Check if card requires hidden status
    if (card.effect.condition?.type === 'hidden') {
        const isHidden = owner.statusEffects.some(s => s.type === StatusEffectType.Hidden);
        if (card.id === 'stranger_assassination' && !isHidden) return false;
    }

    return true;
}

export function playCard(
    state: CombatState,
    card: CardInstance,
    targetEnemyId?: string
): CombatState {
    if (!canPlayCard(state, card)) return state;

    const newState = { ...state };
    const owner = newState.heroes.find(h => h.id === card.ownerId)!;
    const effect = card.effect;

    // Pay energy cost
    newState.energy -= card.energyCost;

    // Remove card from hand
    newState.hand = newState.hand.filter(c => c.instanceId !== card.instanceId);

    // Track cards played
    newState.cardsPlayedThisTurn++;

    // Find target enemy if needed
    let targetEnemy: Enemy | undefined;
    if (targetEnemyId) {
        targetEnemy = newState.enemies.find(e => e.id === targetEnemyId);
    } else {
        // Default to first alive enemy
        targetEnemy = newState.enemies.find(e => e.currentHp > 0);
    }

    // Calculate and apply damage
    if (effect.damage !== undefined) {
        let damage = effect.damage;

        // Apply scaling
        if (effect.damageScaling) {
            const resourceValue = newState.resources[effect.damageScaling.resource];
            damage += resourceValue * effect.damageScaling.multiplier;
        }

        // Check for conditional damage boost
        if (effect.condition && effect.conditionalEffect?.damage) {
            if (checkCondition(effect.condition, newState, owner)) {
                damage += effect.conditionalEffect.damage;
            }
        }

        // Apply strength bonus
        const strength = owner.statusEffects.find(s => s.type === StatusEffectType.Strength);
        if (strength) {
            damage += strength.stacks;
        }

        // Apply hidden bonus for Stranger
        if (effect.condition?.type === 'hidden') {
            const isHidden = owner.statusEffects.some(s => s.type === StatusEffectType.Hidden);
            if (isHidden && effect.conditionalEffect?.damage) {
                damage = effect.conditionalEffect.damage; // Use conditional damage instead
            }
        }

        // Apply cards played scaling for momentum strike
        if (effect.condition?.type === 'cardsPlayedThisTurn') {
            damage += 2 * (newState.cardsPlayedThisTurn - 1);
        }

        // Apply gadget count scaling for overload
        if (effect.condition?.type === 'gadgetCount') {
            damage = damage * newState.gadgets.length;
        }

        if (effect.damageAll) {
            newState.enemies.forEach(enemy => {
                if (enemy.currentHp > 0) {
                    applyDamageToEnemy(newState, enemy, damage);
                }
            });
        } else if (targetEnemy && targetEnemy.currentHp > 0) {
            const killed = applyDamageToEnemy(newState, targetEnemy, damage);

            // Check for kill conditions
            if (killed && effect.condition?.type === 'killsEnemy') {
                if (effect.conditionalEffect?.generateResource) {
                    const res = effect.conditionalEffect.generateResource;
                    newState.resources[res.type] += res.amount;
                }
                if (effect.conditionalEffect?.becomeHidden) {
                    applyStatusEffect(owner, { type: StatusEffectType.Hidden, stacks: 1 });
                }
            }
        }

        newState.damageDealtThisTurn += damage;
    }

    // Apply block
    if (effect.block !== undefined) {
        let block = effect.block;

        // Apply scaling
        if (effect.blockScaling) {
            const resourceValue = newState.resources[effect.blockScaling.resource];
            block += resourceValue * effect.blockScaling.multiplier;
        }

        // Check for conditional block
        if (effect.condition && effect.conditionalEffect?.block) {
            if (checkCondition(effect.condition, newState, owner)) {
                block += effect.conditionalEffect.block;
            }
        }

        applyStatusEffect(owner, { type: StatusEffectType.Block, stacks: block });
    }

    // Generate resources
    if (effect.generateResource) {
        newState.resources[effect.generateResource.type] += effect.generateResource.amount;
    }

    // Draw cards
    if (effect.draw) {
        let drawCount = effect.draw;

        // Apply draw scaling
        if (effect.drawScaling) {
            const resourceValue = newState.resources[effect.drawScaling.resource];
            const bonus = Math.min(
                resourceValue * effect.drawScaling.multiplier,
                effect.drawScaling.max || 10
            );
            drawCount += bonus;
        }

        drawCards(newState, drawCount);
    }

    // Apply status effects
    if (effect.applyToSelf) {
        effect.applyToSelf.forEach(status => {
            applyStatusEffect(owner, status);
        });
    }

    if (effect.applyToEnemy && targetEnemy) {
        effect.applyToEnemy.forEach(status => {
            applyStatusEffect(targetEnemy!, status);
        });
    }

    if (effect.applyToAllEnemies) {
        effect.applyToAllEnemies.forEach(status => {
            newState.enemies.forEach(enemy => {
                if (enemy.currentHp > 0) {
                    applyStatusEffect(enemy, status);
                }
            });
        });
    }

    if (effect.applyToAllAllies) {
        effect.applyToAllAllies.forEach(status => {
            newState.heroes.forEach(hero => {
                if (hero.currentHp > 0) {
                    applyStatusEffect(hero, status);
                }
            });
        });
    }

    // Check for conditional effects
    if (effect.condition && effect.conditionalEffect) {
        if (checkCondition(effect.condition, newState, owner)) {
            if (effect.conditionalEffect.applyToSelf) {
                effect.conditionalEffect.applyToSelf.forEach(status => {
                    applyStatusEffect(owner, status);
                });
            }
            if (effect.conditionalEffect.generateResource) {
                const res = effect.conditionalEffect.generateResource;
                newState.resources[res.type] += res.amount;
            }
        }
    }

    // Become hidden
    if (effect.becomeHidden) {
        applyStatusEffect(owner, { type: StatusEffectType.Hidden, stacks: 1 });
    }

    // Self damage
    if (effect.selfDamage) {
        owner.currentHp = Math.max(0, owner.currentHp - effect.selfDamage);
    }

    // Deploy gadget
    if (effect.deployGadget) {
        newState.gadgets.push({
            name: effect.deployGadget.name,
            turnsRemaining: effect.deployGadget.duration,
            effectPerTurn: effect.deployGadget.effectPerTurn,
            ownerId: owner.id
        });
    }

    // Reduce energy cost of next card
    if (effect.reduceEnergyCost) {
        // This would need to be tracked separately
    }

    // Exhaust or discard
    if (effect.exhaust) {
        newState.exhaustPile.push(card);
    } else {
        newState.discardPile.push(card);
    }

    // Removing hidden status after attacking
    if (effect.damage !== undefined && !effect.becomeHidden) {
        owner.statusEffects = owner.statusEffects.filter(s => s.type !== StatusEffectType.Hidden);
    }

    // Check for combat end
    return checkCombatEnd(newState);
}

function checkCondition(condition: any, state: CombatState, hero: Hero): boolean {
    switch (condition.type) {
        case 'resourceThreshold':
            const value = state.resources[condition.resource as ResourceType];
            if (condition.comparison === 'gte') return value >= condition.threshold;
            if (condition.comparison === 'lte') return value <= condition.threshold;
            return value === condition.threshold;

        case 'hidden':
            return hero.statusEffects.some(s => s.type === StatusEffectType.Hidden);

        case 'cardsPlayedThisTurn':
            return state.cardsPlayedThisTurn > 0;

        case 'gadgetCount':
            return state.gadgets.length > 0;

        default:
            return false;
    }
}

// ============================================
// BASELINE RESOURCE ABILITIES
// ============================================

export function useBaselineAbility(state: CombatState, resource: ResourceType, targetEnemyId?: string): CombatState {
    if (state.energy < 1 || state.resources[resource] < 3) {
        return state;
    }

    const newState = { ...state };
    newState.energy -= 1;
    newState.resources[resource] -= 3;

    switch (resource) {
        case ResourceType.Blood:
            // Deal 8 damage to any enemy
            if (targetEnemyId) {
                const target = newState.enemies.find(e => e.id === targetEnemyId);
                if (target) {
                    applyDamageToEnemy(newState, target, 8);
                }
            }
            break;

        case ResourceType.Glint:
            // Draw 2 cards
            drawCards(newState, 2);
            break;

        case ResourceType.Ashes:
            // Exhaust a card from hand (would need targeting)
            break;

        case ResourceType.Pages:
            // TBD effect - for now, scry 3
            break;

        case ResourceType.Iron:
            // Gain 8 block to all heroes
            newState.heroes.forEach(hero => {
                if (hero.currentHp > 0) {
                    applyStatusEffect(hero, { type: StatusEffectType.Block, stacks: 8 });
                }
            });
            break;
    }

    return checkCombatEnd(newState);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function drawCards(state: CombatState, count: number): void {
    for (let i = 0; i < count; i++) {
        if (state.drawPile.length === 0) {
            // Shuffle discard into draw pile
            if (state.discardPile.length === 0) return;
            state.drawPile = shuffleArray([...state.discardPile]);
            state.discardPile = [];
        }

        const card = state.drawPile.pop();
        if (card) {
            // Check if hero is still alive
            const owner = state.heroes.find(h => h.id === card.ownerId);
            if (owner && owner.currentHp > 0) {
                state.hand.push(card);
            } else {
                // Dead hero's card - goes to discard
                state.discardPile.push(card);
            }
        }
    }
}

function applyDamageToEnemy(state: CombatState, enemy: Enemy, damage: number): boolean {
    // Check for block
    const block = enemy.statusEffects.find(s => s.type === StatusEffectType.Block);
    if (block) {
        const blocked = Math.min(block.stacks, damage);
        block.stacks -= blocked;
        damage -= blocked;
        if (block.stacks <= 0) {
            enemy.statusEffects = enemy.statusEffects.filter(s => s.type !== StatusEffectType.Block);
        }
    }

    // Check for vulnerable
    const vulnerable = enemy.statusEffects.find(s => s.type === StatusEffectType.Vulnerable);
    if (vulnerable) {
        damage = Math.floor(damage * 1.5);
    }

    enemy.currentHp = Math.max(0, enemy.currentHp - damage);

    return enemy.currentHp <= 0;
}

function applyDamageToHero(state: CombatState, hero: Hero, damage: number): void {
    // Check for block
    const block = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
    if (block) {
        const blocked = Math.min(block.stacks, damage);
        block.stacks -= blocked;
        damage -= blocked;
        if (block.stacks <= 0) {
            hero.statusEffects = hero.statusEffects.filter(s => s.type !== StatusEffectType.Block);
        }
    }

    // Check for thorns
    // (Would need to track attacker)

    hero.currentHp = Math.max(0, hero.currentHp - damage);
}

function applyBlockToTeam(state: CombatState, block: number): void {
    state.heroes.forEach(hero => {
        if (hero.currentHp > 0) {
            applyStatusEffect(hero, { type: StatusEffectType.Block, stacks: block });
        }
    });
}

function calculateBlock(effect: any, resources: Resources): number {
    let block = effect.block || 0;
    if (effect.blockScaling) {
        block += resources[effect.blockScaling.resource] * effect.blockScaling.multiplier;
    }
    return block;
}

function applyStatusEffect(entity: Hero | Enemy, effect: StatusEffect): void {
    const existing = entity.statusEffects.find(s => s.type === effect.type);
    if (existing) {
        existing.stacks += effect.stacks;
        if (effect.duration !== undefined) {
            existing.duration = Math.max(existing.duration || 0, effect.duration);
        }
    } else {
        entity.statusEffects.push({ ...effect });
    }
}

function decayStatusEffects(heroes: Hero[]): void {
    heroes.forEach(hero => {
        hero.statusEffects = hero.statusEffects.filter(effect => {
            if (effect.duration !== undefined) {
                effect.duration--;
                return effect.duration > 0;
            }
            // Permanent effects like Strength stay
            if (effect.type === StatusEffectType.Block) return false; // Block cleared each turn
            return true;
        });
    });
}

function decayEnemyStatusEffects(enemies: Enemy[]): void {
    enemies.forEach(enemy => {
        enemy.statusEffects = enemy.statusEffects.filter(effect => {
            if (effect.duration !== undefined) {
                effect.duration--;
                return effect.duration > 0;
            }
            if (effect.type === StatusEffectType.Block) return false;
            // Decay debuffs
            if (effect.type === StatusEffectType.Weak || effect.type === StatusEffectType.Vulnerable) {
                effect.stacks--;
                return effect.stacks > 0;
            }
            return true;
        });
    });
}

function checkCombatEnd(state: CombatState): CombatState {
    const newState = { ...state };

    // Check for victory
    const allEnemiesDead = newState.enemies.every(e => e.currentHp <= 0);
    if (allEnemiesDead) {
        newState.phase = CombatPhase.Victory;
        return newState;
    }

    // Check for defeat
    const allHeroesDead = newState.heroes.every(h => h.currentHp <= 0);
    if (allHeroesDead) {
        newState.phase = CombatPhase.Defeat;
        return newState;
    }

    return newState;
}

// ============================================
// RETREAT
// ============================================

export function initiateRetreat(state: CombatState): CombatState {
    if (state.energy < 3) return state;

    const newState = { ...state };
    newState.energy -= 3;

    // Enemies get one final attack
    newState.enemies.forEach(enemy => {
        if (enemy.currentHp <= 0) return;

        const ability = enemy.abilities.find(a => a.name === enemy.intent.description);
        if (ability && ability.effect.damage) {
            const aliveHeroes = newState.heroes.filter(h => h.currentHp > 0);
            if (aliveHeroes.length > 0) {
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                applyDamageToHero(newState, target, ability.effect.damage);
            }
        }
    });

    newState.phase = CombatPhase.Retreat;
    return newState;
}

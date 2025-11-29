import {
    Card, CardType, CardRarity, HeroClass, ResourceType, StatusEffectType
} from '../models/types';

// ============================================
// BRUTE CARDS - Tank/Damage, Blood/Iron scaling
// ============================================

export const bruteCards: Card[] = [
    {
        id: 'brute_haymaker',
        name: 'Haymaker',
        heroClass: HeroClass.Brute,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 6,
            damageScaling: { resource: ResourceType.Blood, multiplier: 1 }
        },
        description: 'Deal 6 damage. Deal +[Blood] additional damage.',
        flavorText: '"Stay down."'
    },
    {
        id: 'brute_brace',
        name: 'Brace',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 5,
            blockScaling: { resource: ResourceType.Iron, multiplier: 1 }
        },
        description: 'Gain 5 block. Gain +[Iron] additional block.',
        flavorText: '"I can take it."'
    },
    {
        id: 'brute_retaliate',
        name: 'Retaliate',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 3,
            applyToSelf: [{ type: StatusEffectType.Thorns, stacks: 1, duration: 1 }],
            generateResource: { type: ResourceType.Blood, amount: 1 },
            condition: { type: 'resourceThreshold', resource: ResourceType.Blood, threshold: 0 }
        },
        description: 'Gain 3 block. When you take damage this turn, generate 1 Blood.',
        flavorText: '"Hit me. I dare you."'
    },
    {
        id: 'brute_bulk_up',
        name: 'Bulk Up',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 4,
            generateResource: { type: ResourceType.Iron, amount: 1 }
        },
        description: 'Gain 4 block. Generate 1 Iron.',
        flavorText: '"Getting stronger every day."'
    },
    {
        id: 'brute_reckless_charge',
        name: 'Reckless Charge',
        heroClass: HeroClass.Brute,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            damage: 10,
            selfDamage: 3,
            generateResource: { type: ResourceType.Blood, amount: 2 }
        },
        description: 'Deal 10 damage. Take 3 damage. Generate 2 Blood.',
        flavorText: '"Pain is just weakness leaving the body."'
    },
    {
        id: 'brute_immovable',
        name: 'Immovable',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            block: 12,
            condition: { type: 'resourceThreshold', resource: ResourceType.Iron, threshold: 4, comparison: 'gte' },
            conditionalEffect: { block: 6 }
        },
        description: 'Gain 12 block. If you have 4+ Iron, gain 6 additional block.',
        flavorText: '"I\'m not going anywhere."'
    },
    {
        id: 'brute_bloodletting',
        name: 'Bloodletting',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Uncommon,
        energyCost: 0,
        effect: {
            selfDamage: 5,
            generateResource: { type: ResourceType.Blood, amount: 3 }
        },
        description: 'Take 5 damage. Generate 3 Blood.',
        flavorText: '"Every drop counts."'
    },
    {
        id: 'brute_rampage',
        name: 'Rampage',
        heroClass: HeroClass.Brute,
        type: CardType.Attack,
        rarity: CardRarity.Rare,
        energyCost: 3,
        effect: {
            damage: 8,
            damageScaling: { resource: ResourceType.Blood, multiplier: 2 },
            damageAll: true
        },
        description: 'Deal 8 + Blood x2 damage to ALL enemies.',
        flavorText: '"RAAAAAGH!"'
    }
];

// ============================================
// BLASTER CARDS - Damage dealer, Ashes/Blood scaling
// ============================================

export const blasterCards: Card[] = [
    {
        id: 'blaster_energy_bolt',
        name: 'Energy Bolt',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 7,
            damageScaling: { resource: ResourceType.Ashes, multiplier: 1 }
        },
        description: 'Deal 7 damage. Deal +[Ashes] additional damage.',
        flavorText: '"Clean. Simple. Effective."'
    },
    {
        id: 'blaster_energy_shield',
        name: 'Energy Shield',
        heroClass: HeroClass.Blaster,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 4,
            generateResource: { type: ResourceType.Ashes, amount: 1 }
        },
        description: 'Gain 4 block. Generate 1 Ashes.',
        flavorText: '"Defense is just offense waiting to happen."'
    },
    {
        id: 'blaster_searing_ray',
        name: 'Searing Ray',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 5,
            condition: { type: 'killsEnemy' },
            conditionalEffect: { generateResource: { type: ResourceType.Ashes, amount: 2 } }
        },
        description: 'Deal 5 damage. If this kills an enemy, generate 2 Ashes.',
        flavorText: '"Nothing left but cinders."'
    },
    {
        id: 'blaster_charge_shot',
        name: 'Charge Shot',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 4,
            generateResource: { type: ResourceType.Blood, amount: 1 }
        },
        description: 'Deal 4 damage. Generate 1 Blood.',
        flavorText: '"Building up to something big."'
    },
    {
        id: 'blaster_scatter_blast',
        name: 'Scatter Blast',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            damage: 4,
            damageAll: true,
            generateResource: { type: ResourceType.Ashes, amount: 1 }
        },
        description: 'Deal 4 damage to ALL enemies. Generate 1 Ashes for each enemy hit.',
        flavorText: '"Nowhere to hide."'
    },
    {
        id: 'blaster_nova_burst',
        name: 'Nova Burst',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 3,
        effect: {
            damage: 8,
            condition: { type: 'resourceThreshold', resource: ResourceType.Ashes, threshold: 5, comparison: 'gte' },
            conditionalEffect: { damage: 8 }
        },
        description: 'Deal 8 damage. If you have 5+ Ashes, deal 16 damage instead.',
        flavorText: '"This ends now."'
    },
    {
        id: 'blaster_inferno',
        name: 'Inferno',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Uncommon,
        energyCost: 2,
        effect: {
            damage: 6,
            damageAll: true,
            applyToAllEnemies: [{ type: StatusEffectType.Vulnerable, stacks: 2 }]
        },
        description: 'Deal 6 damage to ALL enemies. Apply 2 Vulnerable to ALL enemies.',
        flavorText: '"Everything burns."'
    },
    {
        id: 'blaster_supernova',
        name: 'Supernova',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Rare,
        energyCost: 4,
        effect: {
            damage: 15,
            damageScaling: { resource: ResourceType.Ashes, multiplier: 3 },
            damageAll: true,
            exhaust: true
        },
        description: 'Deal 15 + Ashes x3 damage to ALL enemies. Exhaust.',
        flavorText: '"Witness the end of all things."'
    }
];

// ============================================
// TINKER CARDS - Buildup/Control, Pages/Glint scaling
// ============================================

export const tinkerCards: Card[] = [
    {
        id: 'tinker_jury_rig',
        name: 'Jury-Rig',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 4,
            generateResource: { type: ResourceType.Pages, amount: 1 }
        },
        description: 'Gain 4 block. Generate 1 Pages.',
        flavorText: '"Give me a minute and some duct tape."'
    },
    {
        id: 'tinker_zap_gun',
        name: 'Zap Gun',
        heroClass: HeroClass.Tinker,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 5,
            damageScaling: { resource: ResourceType.Pages, multiplier: 1 }
        },
        description: 'Deal 5 damage. Deal +[Pages] additional damage.',
        flavorText: '"Prototype 47. This one probably won\'t explode."'
    },
    {
        id: 'tinker_deploy_turret',
        name: 'Deploy Turret',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            deployGadget: {
                name: 'Turret',
                duration: 3,
                effectPerTurn: { damage: 2 }
            }
        },
        description: 'At the end of your turn, deal 2 damage to a random enemy. (Lasts 3 turns)',
        flavorText: '"Automated defense systems online."'
    },
    {
        id: 'tinker_analyze',
        name: 'Analyze',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            generateResource: { type: ResourceType.Glint, amount: 1 },
            draw: 1
        },
        description: 'Generate 1 Glint and 1 Pages. Draw 1 card.',
        flavorText: '"Interesting. Very interesting."'
    },
    {
        id: 'tinker_shield_generator',
        name: 'Shield Generator',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            deployGadget: {
                name: 'Shield Generator',
                duration: 3,
                effectPerTurn: {
                    block: 3,
                    blockScaling: { resource: ResourceType.Pages, multiplier: 1 }
                }
            }
        },
        description: 'At the start of each turn, gain 3 block. Gain +1 block per Pages. (Lasts 3 turns)',
        flavorText: '"Sustainable defense beats brute force."'
    },
    {
        id: 'tinker_overload',
        name: 'Overload',
        heroClass: HeroClass.Tinker,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            damage: 3,
            condition: { type: 'gadgetCount' },
            generateResource: { type: ResourceType.Ashes, amount: 2 }
        },
        description: 'Deal 3 damage for each gadget you have deployed. Generate 2 Ashes.',
        flavorText: '"All systems: maximum output."'
    },
    {
        id: 'tinker_drone_swarm',
        name: 'Drone Swarm',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Uncommon,
        energyCost: 3,
        effect: {
            deployGadget: {
                name: 'Attack Drone',
                duration: 4,
                effectPerTurn: { damage: 4 }
            },
            generateResource: { type: ResourceType.Pages, amount: 2 }
        },
        description: 'Deploy an Attack Drone that deals 4 damage each turn for 4 turns. Generate 2 Pages.',
        flavorText: '"They\'re everywhere."'
    },
    {
        id: 'tinker_masterwork',
        name: 'Masterwork',
        heroClass: HeroClass.Tinker,
        type: CardType.Power,
        rarity: CardRarity.Rare,
        energyCost: 3,
        effect: {
            applyToSelf: [{ type: StatusEffectType.Strength, stacks: 1 }],
            generateResource: { type: ResourceType.Pages, amount: 3 }
        },
        description: 'All gadgets deal double damage. Generate 3 Pages.',
        flavorText: '"My finest work yet."'
    }
];

// ============================================
// THINKER CARDS - Support/Control, Glint/Pages scaling
// ============================================

export const thinkerCards: Card[] = [
    {
        id: 'thinker_insight',
        name: 'Insight',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            draw: 2,
            generateResource: { type: ResourceType.Glint, amount: 1 }
        },
        description: 'Draw 2 cards. Generate 1 Glint.',
        flavorText: '"I see exactly what we need."'
    },
    {
        id: 'thinker_calculated_strike',
        name: 'Calculated Strike',
        heroClass: HeroClass.Thinker,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 4,
            damageScaling: { resource: ResourceType.Glint, multiplier: 2 }
        },
        description: 'Deal 4 damage. Deal +[Glint] x2 additional damage.',
        flavorText: '"Precision over power."'
    },
    {
        id: 'thinker_precognition',
        name: 'Precognition',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            scry: 3,
            block: 3,
            condition: { type: 'discardedCard' },
            conditionalEffect: { generateResource: { type: ResourceType.Glint, amount: 1 } }
        },
        description: 'Scry 3. Gain 3 block. If you discarded a card, generate 1 Glint.',
        flavorText: '"I know what\'s coming."'
    },
    {
        id: 'thinker_coordinate',
        name: 'Coordinate',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            reduceEnergyCost: 1,
            generateResource: { type: ResourceType.Pages, amount: 1 }
        },
        description: 'The next card you play this turn costs 1 less. Generate 1 Pages.',
        flavorText: '"Everyone in position. Now."'
    },
    {
        id: 'thinker_perfect_timing',
        name: 'Perfect Timing',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 1,
        effect: {
            draw: 1,
            drawScaling: { resource: ResourceType.Glint, multiplier: 1, max: 4 },
            condition: { type: 'resourceThreshold', resource: ResourceType.Glint, threshold: 4, comparison: 'gte' }
        },
        description: 'Draw 1 card. +1 card per Glint (max 4). If you drew 4+ cards, gain 1 energy.',
        flavorText: '"Patience. Wait for it..."'
    },
    {
        id: 'thinker_tactical_analysis',
        name: 'Tactical Analysis',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            generateResource: { type: ResourceType.Glint, amount: 2 },
            applyToAllAllies: [{ type: StatusEffectType.Strength, stacks: 2, duration: 1 }]
        },
        description: 'Generate 2 Glint. All allies deal +2 damage this turn.',
        flavorText: '"Their weakness is... there."'
    },
    {
        id: 'thinker_mind_over_matter',
        name: 'Mind Over Matter',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Uncommon,
        energyCost: 1,
        effect: {
            block: 0,
            blockScaling: { resource: ResourceType.Glint, multiplier: 3 },
            generateResource: { type: ResourceType.Iron, amount: 1 }
        },
        description: 'Gain block equal to Glint x3. Generate 1 Iron.',
        flavorText: '"The body follows where the mind leads."'
    },
    {
        id: 'thinker_master_plan',
        name: 'Master Plan',
        heroClass: HeroClass.Thinker,
        type: CardType.Power,
        rarity: CardRarity.Rare,
        energyCost: 2,
        effect: {
            draw: 3,
            generateResource: { type: ResourceType.Glint, amount: 5 }
        },
        description: 'Draw 3 cards. Generate 5 Glint.',
        flavorText: '"Everything is proceeding according to plan."'
    }
];

// ============================================
// MOVER CARDS - Evasion/Utility, Glint/Iron scaling
// ============================================

export const moverCards: Card[] = [
    {
        id: 'mover_dash',
        name: 'Dash',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 5,
            generateResource: { type: ResourceType.Glint, amount: 1 }
        },
        description: 'Gain 5 block. Generate 1 Glint.',
        flavorText: '"Can\'t hit what you can\'t catch."'
    },
    {
        id: 'mover_hit_and_run',
        name: 'Hit and Run',
        heroClass: HeroClass.Mover,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 5,
            block: 3,
            damageScaling: { resource: ResourceType.Glint, multiplier: 1 }
        },
        description: 'Deal 5 damage. Gain 3 block. Deal +[Glint] additional damage.',
        flavorText: '"In, out, done."'
    },
    {
        id: 'mover_sidestep',
        name: 'Sidestep',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            block: 2,
            draw: 1
        },
        description: 'Gain 2 block. Draw 1 card.',
        flavorText: '"Too slow."'
    },
    {
        id: 'mover_redirect',
        name: 'Redirect',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            generateResource: { type: ResourceType.Iron, amount: 1 }
        },
        description: 'The next attack targeting an ally targets a different random enemy instead. Generate 1 Iron.',
        flavorText: '"Wrong target."'
    },
    {
        id: 'mover_blur',
        name: 'Blur',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            block: 8,
            condition: { type: 'resourceThreshold', resource: ResourceType.Glint, threshold: 3, comparison: 'gte' },
            conditionalEffect: { applyToSelf: [{ type: StatusEffectType.Untargetable, stacks: 1, duration: 1 }] }
        },
        description: 'Gain 8 block. If you have 3+ Glint, become Untargetable until your next turn.',
        flavorText: '"Now you see me..."'
    },
    {
        id: 'mover_momentum_strike',
        name: 'Momentum Strike',
        heroClass: HeroClass.Mover,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            damage: 6,
            condition: { type: 'cardsPlayedThisTurn' }
        },
        description: 'Deal 6 damage. Deal +2 damage for each card played this turn before this one.',
        flavorText: '"Building speed..."'
    },
    {
        id: 'mover_afterimage',
        name: 'Afterimage',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Uncommon,
        energyCost: 1,
        effect: {
            block: 4,
            draw: 2,
            generateResource: { type: ResourceType.Glint, amount: 2 }
        },
        description: 'Gain 4 block. Draw 2 cards. Generate 2 Glint.',
        flavorText: '"Was I ever there?"'
    },
    {
        id: 'mover_lightspeed',
        name: 'Lightspeed',
        heroClass: HeroClass.Mover,
        type: CardType.Power,
        rarity: CardRarity.Rare,
        energyCost: 3,
        effect: {
            applyToSelf: [{ type: StatusEffectType.Untargetable, stacks: 1, duration: 2 }],
            generateResource: { type: ResourceType.Glint, amount: 4 }
        },
        description: 'Become Untargetable for 2 turns. Generate 4 Glint.',
        flavorText: '"Try to keep up."'
    }
];

// ============================================
// STRANGER CARDS - Stealth/Burst, Ashes/Glint scaling
// ============================================

export const strangerCards: Card[] = [
    {
        id: 'stranger_backstab',
        name: 'Backstab',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            damage: 5,
            condition: { type: 'hidden' },
            conditionalEffect: { damage: 5 }
        },
        description: 'Deal 5 damage. If you are Hidden, deal 10 damage instead.',
        flavorText: '"You never saw me coming."'
    },
    {
        id: 'stranger_fade',
        name: 'Fade',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 3,
            becomeHidden: true,
            generateResource: { type: ResourceType.Glint, amount: 1 }
        },
        description: 'Gain 3 block. Become Hidden. Generate 1 Glint.',
        flavorText: '"Where did they go?"'
    },
    {
        id: 'stranger_misdirect',
        name: 'Misdirect',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {
            block: 4,
            reduceThreat: 2,
            generateResource: { type: ResourceType.Ashes, amount: 1 }
        },
        description: 'Gain 4 block. Reduce this hero\'s Threat by 2. Generate 1 Ashes.',
        flavorText: '"Look over there."'
    },
    {
        id: 'stranger_slip_away',
        name: 'Slip Away',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            block: 2,
            condition: { type: 'hidden' },
            conditionalEffect: { draw: 1 }
        },
        description: 'Gain 2 block. If you are Hidden, draw 1 card.',
        flavorText: '"I was never here."'
    },
    {
        id: 'stranger_shadow_strike',
        name: 'Shadow Strike',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: {
            damage: 8,
            damageScaling: { resource: ResourceType.Ashes, multiplier: 1 },
            condition: { type: 'killsEnemy' },
            conditionalEffect: { becomeHidden: true }
        },
        description: 'Deal 8 damage. Deal +[Ashes] additional damage. If this kills, become Hidden.',
        flavorText: '"One down, silent as the grave."'
    },
    {
        id: 'stranger_ambush',
        name: 'Ambush',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 3,
        effect: {
            damage: 6,
            condition: { type: 'hidden' },
            conditionalEffect: {
                damage: 12,
                generateResource: { type: ResourceType.Ashes, amount: 3 }
            }
        },
        description: 'Deal 6 damage. If you are Hidden: deal 18 damage instead and generate 3 Ashes.',
        flavorText: '"Surprise."'
    },
    {
        id: 'stranger_vanish',
        name: 'Vanish',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Uncommon,
        energyCost: 1,
        effect: {
            becomeHidden: true,
            applyToSelf: [{ type: StatusEffectType.Untargetable, stacks: 1, duration: 1 }],
            generateResource: { type: ResourceType.Glint, amount: 2 }
        },
        description: 'Become Hidden and Untargetable until your next turn. Generate 2 Glint.',
        flavorText: '"Gone without a trace."'
    },
    {
        id: 'stranger_assassination',
        name: 'Assassination',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Rare,
        energyCost: 4,
        effect: {
            damage: 50,
            condition: { type: 'hidden' },
            exhaust: true
        },
        description: 'Can only be played while Hidden. Deal 50 damage. Exhaust.',
        flavorText: '"The job is done."'
    }
];

// ============================================
// TRAUMA CARDS - Negative cards from breakdowns
// ============================================

export const traumaCards: Card[] = [
    {
        id: 'trauma_flashback',
        name: 'Flashback',
        heroClass: HeroClass.Brute, // Applies to any class
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            selfDamage: 3
        },
        description: 'Unplayable. Take 3 damage at the start of your turn.',
        flavorText: '"The memories won\'t stop."'
    },
    {
        id: 'trauma_hesitation',
        name: 'Hesitation',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: {},
        description: 'Unplayable. Cannot be discarded.',
        flavorText: '"I... I can\'t..."'
    },
    {
        id: 'trauma_paranoia',
        name: 'Paranoia',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: {
            exhaustFromHand: 1
        },
        description: 'When drawn, exhaust a random card from your hand.',
        flavorText: '"They\'re everywhere. Trust no one."'
    },
    {
        id: 'trauma_guilt',
        name: 'Guilt',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 2,
        effect: {
            draw: 1
        },
        description: 'Draw 1 card. (This card exists only to waste energy)',
        flavorText: '"I should have saved them."'
    }
];

// ============================================
// ALL CARDS BY CLASS
// ============================================

export const allCardsByClass: Record<HeroClass, Card[]> = {
    [HeroClass.Brute]: bruteCards,
    [HeroClass.Blaster]: blasterCards,
    [HeroClass.Tinker]: tinkerCards,
    [HeroClass.Thinker]: thinkerCards,
    [HeroClass.Mover]: moverCards,
    [HeroClass.Stranger]: strangerCards
};

export function getStarterDeck(heroClass: HeroClass): Card[] {
    const classCards = allCardsByClass[heroClass];
    const basicCards = classCards.filter(c => c.rarity === CardRarity.Basic);
    const commonCards = classCards.filter(c => c.rarity === CardRarity.Common);

    // 4 basics + 1 random common
    const deck = [...basicCards];
    if (commonCards.length > 0) {
        const randomCommon = commonCards[Math.floor(Math.random() * commonCards.length)];
        deck.push(randomCommon);
    }

    return deck;
}

export function getCardsByRarity(heroClass: HeroClass, rarity: CardRarity): Card[] {
    return allCardsByClass[heroClass].filter(c => c.rarity === rarity);
}

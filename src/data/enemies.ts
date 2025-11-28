import {
    Enemy, EnemyAbility, EnemyIntentType, Faction,
    StatusEffectType, generateId
} from '../models/types.js';

// ============================================
// ENEMY TEMPLATES
// ============================================

export interface EnemyTemplate {
    name: string;
    faction: Faction;
    baseHp: number;
    hpScaling: number; // HP increase per difficulty
    abilities: EnemyAbility[];
    isBoss: boolean;
}

// ============================================
// CULT OF THE VEIL ENEMIES
// ============================================

export const cultEnemies: EnemyTemplate[] = [
    {
        name: 'Cultist',
        faction: Faction.Cult,
        baseHp: 20,
        hpScaling: 5,
        isBoss: false,
        abilities: [
            {
                name: 'Dark Ritual',
                intentType: EnemyIntentType.Attack,
                weight: 50,
                intentValue: 6,
                effect: { damage: 6 }
            },
            {
                name: 'Summon',
                intentType: EnemyIntentType.Summon,
                weight: 30,
                effect: {}
            },
            {
                name: 'Curse',
                intentType: EnemyIntentType.Debuff,
                weight: 20,
                effect: {
                    applyToEnemy: [{ type: StatusEffectType.Weak, stacks: 2 }]
                }
            }
        ]
    },
    {
        name: 'Void Spawn',
        faction: Faction.Cult,
        baseHp: 30,
        hpScaling: 8,
        isBoss: false,
        abilities: [
            {
                name: 'Tentacle Lash',
                intentType: EnemyIntentType.Attack,
                weight: 60,
                intentValue: 8,
                effect: { damage: 8 }
            },
            {
                name: 'Mind Flay',
                intentType: EnemyIntentType.Attack,
                weight: 40,
                intentValue: 5,
                effect: {
                    damage: 5,
                    applyToEnemy: [{ type: StatusEffectType.Vulnerable, stacks: 1 }]
                }
            }
        ]
    },
    {
        name: 'Eldritch Horror',
        faction: Faction.Cult,
        baseHp: 45,
        hpScaling: 12,
        isBoss: false,
        abilities: [
            {
                name: 'Reality Tear',
                intentType: EnemyIntentType.Attack,
                weight: 40,
                intentValue: 12,
                effect: { damage: 12 }
            },
            {
                name: 'Psychic Scream',
                intentType: EnemyIntentType.Attack,
                weight: 30,
                intentValue: 6,
                effect: {
                    damage: 6,
                    damageAll: true
                }
            },
            {
                name: 'Madness',
                intentType: EnemyIntentType.Debuff,
                weight: 30,
                effect: {
                    applyToEnemy: [
                        { type: StatusEffectType.Weak, stacks: 2 },
                        { type: StatusEffectType.Vulnerable, stacks: 2 }
                    ]
                }
            }
        ]
    },
    {
        name: 'High Priest of the Veil',
        faction: Faction.Cult,
        baseHp: 150,
        hpScaling: 30,
        isBoss: true,
        abilities: [
            {
                name: 'Dark Invocation',
                intentType: EnemyIntentType.Attack,
                weight: 30,
                intentValue: 15,
                effect: { damage: 15 }
            },
            {
                name: 'Mass Hysteria',
                intentType: EnemyIntentType.Attack,
                weight: 25,
                intentValue: 8,
                effect: {
                    damage: 8,
                    damageAll: true,
                    applyToAllEnemies: [{ type: StatusEffectType.Weak, stacks: 1 }]
                }
            },
            {
                name: 'Summon the Faithful',
                intentType: EnemyIntentType.Summon,
                weight: 25,
                effect: {}
            },
            {
                name: 'Veil\'s Embrace',
                intentType: EnemyIntentType.Buff,
                weight: 20,
                effect: {
                    applyToSelf: [
                        { type: StatusEffectType.Strength, stacks: 3 },
                        { type: StatusEffectType.Block, stacks: 15 }
                    ]
                }
            }
        ]
    }
];

// ============================================
// UNDEAD HORDE ENEMIES
// ============================================

export const undeadEnemies: EnemyTemplate[] = [
    {
        name: 'Skeleton',
        faction: Faction.Undead,
        baseHp: 15,
        hpScaling: 4,
        isBoss: false,
        abilities: [
            {
                name: 'Bone Strike',
                intentType: EnemyIntentType.Attack,
                weight: 70,
                intentValue: 5,
                effect: { damage: 5 }
            },
            {
                name: 'Reassemble',
                intentType: EnemyIntentType.Buff,
                weight: 30,
                effect: {
                    applyToSelf: [{ type: StatusEffectType.Regeneration, stacks: 3 }]
                }
            }
        ]
    },
    {
        name: 'Zombie',
        faction: Faction.Undead,
        baseHp: 35,
        hpScaling: 8,
        isBoss: false,
        abilities: [
            {
                name: 'Slam',
                intentType: EnemyIntentType.Attack,
                weight: 60,
                intentValue: 10,
                effect: { damage: 10 }
            },
            {
                name: 'Infectious Bite',
                intentType: EnemyIntentType.Attack,
                weight: 40,
                intentValue: 7,
                effect: {
                    damage: 7,
                    applyToEnemy: [{ type: StatusEffectType.Poison, stacks: 3 }]
                }
            }
        ]
    },
    {
        name: 'Death Knight',
        faction: Faction.Undead,
        baseHp: 50,
        hpScaling: 15,
        isBoss: false,
        abilities: [
            {
                name: 'Soul Reaver',
                intentType: EnemyIntentType.Attack,
                weight: 40,
                intentValue: 14,
                effect: { damage: 14 }
            },
            {
                name: 'Life Drain',
                intentType: EnemyIntentType.Attack,
                weight: 35,
                intentValue: 8,
                effect: {
                    damage: 8,
                    applyToSelf: [{ type: StatusEffectType.Regeneration, stacks: 5 }]
                }
            },
            {
                name: 'Dark Aegis',
                intentType: EnemyIntentType.Block,
                weight: 25,
                effect: {
                    block: 12
                }
            }
        ]
    },
    {
        name: 'Lich King',
        faction: Faction.Undead,
        baseHp: 180,
        hpScaling: 40,
        isBoss: true,
        abilities: [
            {
                name: 'Death Coil',
                intentType: EnemyIntentType.Attack,
                weight: 25,
                intentValue: 18,
                effect: { damage: 18 }
            },
            {
                name: 'Army of the Dead',
                intentType: EnemyIntentType.Summon,
                weight: 25,
                effect: {}
            },
            {
                name: 'Soul Harvest',
                intentType: EnemyIntentType.Attack,
                weight: 25,
                intentValue: 10,
                effect: {
                    damage: 10,
                    damageAll: true,
                    applyToSelf: [{ type: StatusEffectType.Regeneration, stacks: 10 }]
                }
            },
            {
                name: 'Phylactery Shield',
                intentType: EnemyIntentType.Block,
                weight: 25,
                effect: {
                    block: 25,
                    applyToSelf: [{ type: StatusEffectType.Thorns, stacks: 5 }]
                }
            }
        ]
    }
];

// ============================================
// SWARM ENEMIES
// ============================================

export const swarmEnemies: EnemyTemplate[] = [
    {
        name: 'Drone',
        faction: Faction.Swarm,
        baseHp: 10,
        hpScaling: 3,
        isBoss: false,
        abilities: [
            {
                name: 'Bite',
                intentType: EnemyIntentType.Attack,
                weight: 70,
                intentValue: 4,
                effect: { damage: 4 }
            },
            {
                name: 'Toxic Spit',
                intentType: EnemyIntentType.Debuff,
                weight: 30,
                effect: {
                    applyToEnemy: [{ type: StatusEffectType.Poison, stacks: 2 }]
                }
            }
        ]
    },
    {
        name: 'Spitter',
        faction: Faction.Swarm,
        baseHp: 25,
        hpScaling: 6,
        isBoss: false,
        abilities: [
            {
                name: 'Acid Spray',
                intentType: EnemyIntentType.Attack,
                weight: 50,
                intentValue: 6,
                effect: {
                    damage: 6,
                    applyToEnemy: [{ type: StatusEffectType.Poison, stacks: 3 }]
                }
            },
            {
                name: 'Corrosive Cloud',
                intentType: EnemyIntentType.Debuff,
                weight: 50,
                effect: {
                    applyToAllEnemies: [{ type: StatusEffectType.Poison, stacks: 2 }]
                }
            }
        ]
    },
    {
        name: 'Warrior',
        faction: Faction.Swarm,
        baseHp: 40,
        hpScaling: 10,
        isBoss: false,
        abilities: [
            {
                name: 'Rending Claws',
                intentType: EnemyIntentType.Attack,
                weight: 50,
                intentValue: 11,
                effect: { damage: 11 }
            },
            {
                name: 'Frenzy',
                intentType: EnemyIntentType.Attack,
                weight: 30,
                intentValue: 6,
                effect: {
                    damage: 6,
                    applyToSelf: [{ type: StatusEffectType.Strength, stacks: 2 }]
                }
            },
            {
                name: 'Carapace',
                intentType: EnemyIntentType.Block,
                weight: 20,
                effect: {
                    block: 10
                }
            }
        ]
    },
    {
        name: 'Hive Queen',
        faction: Faction.Swarm,
        baseHp: 200,
        hpScaling: 50,
        isBoss: true,
        abilities: [
            {
                name: 'Royal Strike',
                intentType: EnemyIntentType.Attack,
                weight: 20,
                intentValue: 20,
                effect: { damage: 20 }
            },
            {
                name: 'Spawn Brood',
                intentType: EnemyIntentType.Summon,
                weight: 30,
                effect: {}
            },
            {
                name: 'Toxic Nova',
                intentType: EnemyIntentType.Attack,
                weight: 25,
                intentValue: 8,
                effect: {
                    damage: 8,
                    damageAll: true,
                    applyToAllEnemies: [{ type: StatusEffectType.Poison, stacks: 4 }]
                }
            },
            {
                name: 'Hive Mind',
                intentType: EnemyIntentType.Buff,
                weight: 25,
                effect: {
                    applyToSelf: [{ type: StatusEffectType.Strength, stacks: 5 }]
                }
            }
        ]
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const allEnemiesByFaction: Record<Faction, EnemyTemplate[]> = {
    [Faction.Cult]: cultEnemies,
    [Faction.Undead]: undeadEnemies,
    [Faction.Swarm]: swarmEnemies
};

export function createEnemy(template: EnemyTemplate, difficulty: number): Enemy {
    const hp = template.baseHp + (template.hpScaling * difficulty);

    // Select initial intent
    const ability = selectAbility(template.abilities);

    return {
        id: generateId(),
        name: template.name,
        faction: template.faction,
        maxHp: hp,
        currentHp: hp,
        intent: {
            type: ability.intentType,
            value: ability.intentValue,
            description: ability.name
        },
        statusEffects: [],
        abilities: template.abilities,
        isBoss: template.isBoss
    };
}

export function selectAbility(abilities: EnemyAbility[]): EnemyAbility {
    const totalWeight = abilities.reduce((sum, a) => sum + a.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const ability of abilities) {
        roll -= ability.weight;
        if (roll <= 0) {
            return ability;
        }
    }

    return abilities[0];
}

export function getEnemiesForEncounter(
    faction: Faction,
    difficulty: number,
    isBossEncounter: boolean
): Enemy[] {
    const templates = allEnemiesByFaction[faction];
    const enemies: Enemy[] = [];

    if (isBossEncounter) {
        const bossTemplate = templates.find(t => t.isBoss);
        if (bossTemplate) {
            enemies.push(createEnemy(bossTemplate, difficulty));
        }
        // Add some minions with boss
        const minions = templates.filter(t => !t.isBoss);
        const minionCount = Math.min(2, minions.length);
        for (let i = 0; i < minionCount; i++) {
            const template = minions[Math.floor(Math.random() * minions.length)];
            enemies.push(createEnemy(template, difficulty));
        }
    } else {
        // Regular encounter - 2-4 enemies
        const nonBoss = templates.filter(t => !t.isBoss);
        const count = 2 + Math.floor(Math.random() * 3); // 2-4 enemies

        for (let i = 0; i < count; i++) {
            const template = nonBoss[Math.floor(Math.random() * nonBoss.length)];
            enemies.push(createEnemy(template, difficulty));
        }
    }

    return enemies;
}

export function getSummonedEnemy(faction: Faction, difficulty: number): Enemy {
    const templates = allEnemiesByFaction[faction].filter(t => !t.isBoss);
    // Pick weakest enemy for summoning
    const weakest = templates.reduce((a, b) => a.baseHp < b.baseHp ? a : b);
    return createEnemy(weakest, Math.max(0, difficulty - 1));
}

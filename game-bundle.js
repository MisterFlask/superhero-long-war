// ============================================
// SUPERHERO LONG WAR - BUNDLED GAME
// A roguelike deckbuilder combining XCOM strategy with Slay the Spire combat
// ============================================

// ============================================
// ENUMS AND CONSTANTS
// ============================================

const HeroClass = {
    Brute: 'Brute',
    Blaster: 'Blaster',
    Tinker: 'Tinker',
    Thinker: 'Thinker',
    Mover: 'Mover',
    Stranger: 'Stranger'
};

const Faction = {
    Cult: 'Cult',
    Undead: 'Undead',
    Swarm: 'Swarm'
};

const ResourceType = {
    Blood: 'Blood',
    Glint: 'Glint',
    Ashes: 'Ashes',
    Pages: 'Pages',
    Iron: 'Iron'
};

const CardType = {
    Attack: 'Attack',
    Skill: 'Skill',
    Power: 'Power'
};

const CardRarity = {
    Basic: 'Basic',
    Common: 'Common',
    Uncommon: 'Uncommon',
    Rare: 'Rare'
};

const MissionType = {
    Defense: 'Defense',
    Story: 'Story',
    Capture: 'Capture'
};

const GamePhase = {
    Strategic: 'Strategic',
    MissionSelect: 'MissionSelect',
    Combat: 'Combat',
    PostCombat: 'PostCombat',
    Bazaar: 'Bazaar',
    GameOver: 'GameOver',
    Victory: 'Victory'
};

const CombatPhase = {
    PlayerTurn: 'PlayerTurn',
    EnemyTurn: 'EnemyTurn',
    Victory: 'Victory',
    Defeat: 'Defeat',
    Retreat: 'Retreat'
};

const EnemyIntentType = {
    Attack: 'Attack',
    Block: 'Block',
    Buff: 'Buff',
    Debuff: 'Debuff',
    Summon: 'Summon',
    Special: 'Special'
};

const StatusEffectType = {
    Block: 'Block',
    Strength: 'Strength',
    Hidden: 'Hidden',
    Untargetable: 'Untargetable',
    Vulnerable: 'Vulnerable',
    Weak: 'Weak',
    Poison: 'Poison',
    Marked: 'Marked',
    Thorns: 'Thorns',
    Regeneration: 'Regeneration'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return Math.random().toString(36).substring(2, 11);
}

function createEmptyResources() {
    return {
        [ResourceType.Blood]: 0,
        [ResourceType.Glint]: 0,
        [ResourceType.Ashes]: 0,
        [ResourceType.Pages]: 0,
        [ResourceType.Iron]: 0
    };
}

function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ============================================
// CARD DEFINITIONS
// ============================================

const bruteCards = [
    {
        id: 'brute_haymaker',
        name: 'Haymaker',
        heroClass: HeroClass.Brute,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { damage: 6, damageScaling: { resource: ResourceType.Blood, multiplier: 1 } },
        description: 'Deal 6 + Blood damage.',
        flavorText: '"Stay down."'
    },
    {
        id: 'brute_brace',
        name: 'Brace',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 5, blockScaling: { resource: ResourceType.Iron, multiplier: 1 } },
        description: 'Gain 5 + Iron block.',
        flavorText: '"I can take it."'
    },
    {
        id: 'brute_retaliate',
        name: 'Retaliate',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 3, generateResource: { type: ResourceType.Blood, amount: 1 } },
        description: 'Gain 3 block. Generate 1 Blood.',
        flavorText: '"Hit me. I dare you."'
    },
    {
        id: 'brute_bulk_up',
        name: 'Bulk Up',
        heroClass: HeroClass.Brute,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 4, generateResource: { type: ResourceType.Iron, amount: 1 } },
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
        effect: { damage: 10, selfDamage: 3, generateResource: { type: ResourceType.Blood, amount: 2 } },
        description: 'Deal 10 damage. Take 3 damage. Generate 2 Blood.',
        flavorText: '"Pain is just weakness leaving the body."'
    }
];

const blasterCards = [
    {
        id: 'blaster_energy_bolt',
        name: 'Energy Bolt',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { damage: 7, damageScaling: { resource: ResourceType.Ashes, multiplier: 1 } },
        description: 'Deal 7 + Ashes damage.',
        flavorText: '"Clean. Simple. Effective."'
    },
    {
        id: 'blaster_energy_shield',
        name: 'Energy Shield',
        heroClass: HeroClass.Blaster,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 4, generateResource: { type: ResourceType.Ashes, amount: 1 } },
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
        effect: { damage: 5 },
        description: 'Deal 5 damage.',
        flavorText: '"Nothing left but cinders."'
    },
    {
        id: 'blaster_charge_shot',
        name: 'Charge Shot',
        heroClass: HeroClass.Blaster,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { damage: 4, generateResource: { type: ResourceType.Blood, amount: 1 } },
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
        effect: { damage: 4, damageAll: true, generateResource: { type: ResourceType.Ashes, amount: 1 } },
        description: 'Deal 4 damage to ALL enemies. Generate 1 Ashes.',
        flavorText: '"Nowhere to hide."'
    }
];

const tinkerCards = [
    {
        id: 'tinker_jury_rig',
        name: 'Jury-Rig',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 4, generateResource: { type: ResourceType.Pages, amount: 1 } },
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
        effect: { damage: 5, damageScaling: { resource: ResourceType.Pages, multiplier: 1 } },
        description: 'Deal 5 + Pages damage.',
        flavorText: '"Prototype 47. This one probably won\'t explode."'
    },
    {
        id: 'tinker_deploy_turret',
        name: 'Deploy Turret',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { deployGadget: { name: 'Turret', duration: 3, effectPerTurn: { damage: 3 } } },
        description: 'Deploy a Turret that deals 3 damage each turn for 3 turns.',
        flavorText: '"Automated defense systems online."'
    },
    {
        id: 'tinker_analyze',
        name: 'Analyze',
        heroClass: HeroClass.Tinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: { generateResource: { type: ResourceType.Glint, amount: 1 }, draw: 1 },
        description: 'Generate 1 Glint. Draw 1 card.',
        flavorText: '"Interesting. Very interesting."'
    },
    {
        id: 'tinker_overload',
        name: 'Overload',
        heroClass: HeroClass.Tinker,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: { damage: 8, generateResource: { type: ResourceType.Ashes, amount: 2 } },
        description: 'Deal 8 damage. Generate 2 Ashes.',
        flavorText: '"All systems: maximum output."'
    }
];

const thinkerCards = [
    {
        id: 'thinker_insight',
        name: 'Insight',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { draw: 2, generateResource: { type: ResourceType.Glint, amount: 1 } },
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
        effect: { damage: 4, damageScaling: { resource: ResourceType.Glint, multiplier: 2 } },
        description: 'Deal 4 + Glint x2 damage.',
        flavorText: '"Precision over power."'
    },
    {
        id: 'thinker_precognition',
        name: 'Precognition',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 5, generateResource: { type: ResourceType.Glint, amount: 1 } },
        description: 'Gain 5 block. Generate 1 Glint.',
        flavorText: '"I know what\'s coming."'
    },
    {
        id: 'thinker_coordinate',
        name: 'Coordinate',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: { generateResource: { type: ResourceType.Pages, amount: 1 }, draw: 1 },
        description: 'Generate 1 Pages. Draw 1 card.',
        flavorText: '"Everyone in position. Now."'
    },
    {
        id: 'thinker_tactical_analysis',
        name: 'Tactical Analysis',
        heroClass: HeroClass.Thinker,
        type: CardType.Skill,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: { generateResource: { type: ResourceType.Glint, amount: 2 }, draw: 1 },
        description: 'Generate 2 Glint. Draw 1 card.',
        flavorText: '"Their weakness is... there."'
    }
];

const moverCards = [
    {
        id: 'mover_dash',
        name: 'Dash',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 5, generateResource: { type: ResourceType.Glint, amount: 1 } },
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
        effect: { damage: 5, block: 3, damageScaling: { resource: ResourceType.Glint, multiplier: 1 } },
        description: 'Deal 5 + Glint damage. Gain 3 block.',
        flavorText: '"In, out, done."'
    },
    {
        id: 'mover_sidestep',
        name: 'Sidestep',
        heroClass: HeroClass.Mover,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: { block: 2, draw: 1 },
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
        effect: { block: 4, generateResource: { type: ResourceType.Iron, amount: 1 } },
        description: 'Gain 4 block. Generate 1 Iron.',
        flavorText: '"Wrong target."'
    },
    {
        id: 'mover_momentum_strike',
        name: 'Momentum Strike',
        heroClass: HeroClass.Mover,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: { damage: 10, generateResource: { type: ResourceType.Glint, amount: 1 } },
        description: 'Deal 10 damage. Generate 1 Glint.',
        flavorText: '"Building speed..."'
    }
];

const strangerCards = [
    {
        id: 'stranger_backstab',
        name: 'Backstab',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { damage: 8 },
        description: 'Deal 8 damage.',
        flavorText: '"You never saw me coming."'
    },
    {
        id: 'stranger_fade',
        name: 'Fade',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 1,
        effect: { block: 3, becomeHidden: true, generateResource: { type: ResourceType.Glint, amount: 1 } },
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
        effect: { block: 4, generateResource: { type: ResourceType.Ashes, amount: 1 } },
        description: 'Gain 4 block. Generate 1 Ashes.',
        flavorText: '"Look over there."'
    },
    {
        id: 'stranger_slip_away',
        name: 'Slip Away',
        heroClass: HeroClass.Stranger,
        type: CardType.Skill,
        rarity: CardRarity.Basic,
        energyCost: 0,
        effect: { block: 2, draw: 1 },
        description: 'Gain 2 block. Draw 1 card.',
        flavorText: '"I was never here."'
    },
    {
        id: 'stranger_shadow_strike',
        name: 'Shadow Strike',
        heroClass: HeroClass.Stranger,
        type: CardType.Attack,
        rarity: CardRarity.Common,
        energyCost: 2,
        effect: { damage: 12, damageScaling: { resource: ResourceType.Ashes, multiplier: 1 } },
        description: 'Deal 12 + Ashes damage.',
        flavorText: '"One down, silent as the grave."'
    }
];

const allCardsByClass = {
    [HeroClass.Brute]: bruteCards,
    [HeroClass.Blaster]: blasterCards,
    [HeroClass.Tinker]: tinkerCards,
    [HeroClass.Thinker]: thinkerCards,
    [HeroClass.Mover]: moverCards,
    [HeroClass.Stranger]: strangerCards
};

function getStarterDeck(heroClass) {
    const classCards = allCardsByClass[heroClass];
    const basicCards = classCards.filter(c => c.rarity === CardRarity.Basic);
    const commonCards = classCards.filter(c => c.rarity === CardRarity.Common);

    const deck = [...basicCards];
    if (commonCards.length > 0) {
        deck.push(commonCards[Math.floor(Math.random() * commonCards.length)]);
    }

    return deck;
}

// ============================================
// ENEMY DEFINITIONS
// ============================================

const enemyTemplates = {
    [Faction.Cult]: [
        {
            name: 'Cultist',
            faction: Faction.Cult,
            baseHp: 20,
            isBoss: false,
            abilities: [
                { name: 'Dark Ritual', intentType: EnemyIntentType.Attack, weight: 60, damage: 6 },
                { name: 'Curse', intentType: EnemyIntentType.Debuff, weight: 40, damage: 0 }
            ]
        },
        {
            name: 'Void Spawn',
            faction: Faction.Cult,
            baseHp: 30,
            isBoss: false,
            abilities: [
                { name: 'Tentacle Lash', intentType: EnemyIntentType.Attack, weight: 70, damage: 8 },
                { name: 'Mind Flay', intentType: EnemyIntentType.Attack, weight: 30, damage: 5 }
            ]
        },
        {
            name: 'High Priest',
            faction: Faction.Cult,
            baseHp: 100,
            isBoss: true,
            abilities: [
                { name: 'Dark Invocation', intentType: EnemyIntentType.Attack, weight: 40, damage: 15 },
                { name: 'Mass Hysteria', intentType: EnemyIntentType.Attack, weight: 30, damage: 8, aoe: true },
                { name: 'Summon', intentType: EnemyIntentType.Summon, weight: 30, damage: 0 }
            ]
        }
    ],
    [Faction.Undead]: [
        {
            name: 'Skeleton',
            faction: Faction.Undead,
            baseHp: 15,
            isBoss: false,
            abilities: [
                { name: 'Bone Strike', intentType: EnemyIntentType.Attack, weight: 80, damage: 5 },
                { name: 'Reassemble', intentType: EnemyIntentType.Buff, weight: 20, damage: 0 }
            ]
        },
        {
            name: 'Zombie',
            faction: Faction.Undead,
            baseHp: 35,
            isBoss: false,
            abilities: [
                { name: 'Slam', intentType: EnemyIntentType.Attack, weight: 60, damage: 10 },
                { name: 'Infectious Bite', intentType: EnemyIntentType.Attack, weight: 40, damage: 7 }
            ]
        },
        {
            name: 'Lich King',
            faction: Faction.Undead,
            baseHp: 120,
            isBoss: true,
            abilities: [
                { name: 'Death Coil', intentType: EnemyIntentType.Attack, weight: 35, damage: 18 },
                { name: 'Soul Harvest', intentType: EnemyIntentType.Attack, weight: 35, damage: 10, aoe: true },
                { name: 'Raise Dead', intentType: EnemyIntentType.Summon, weight: 30, damage: 0 }
            ]
        }
    ],
    [Faction.Swarm]: [
        {
            name: 'Drone',
            faction: Faction.Swarm,
            baseHp: 10,
            isBoss: false,
            abilities: [
                { name: 'Bite', intentType: EnemyIntentType.Attack, weight: 70, damage: 4 },
                { name: 'Toxic Spit', intentType: EnemyIntentType.Debuff, weight: 30, damage: 2 }
            ]
        },
        {
            name: 'Warrior',
            faction: Faction.Swarm,
            baseHp: 40,
            isBoss: false,
            abilities: [
                { name: 'Rending Claws', intentType: EnemyIntentType.Attack, weight: 60, damage: 11 },
                { name: 'Frenzy', intentType: EnemyIntentType.Attack, weight: 40, damage: 6 }
            ]
        },
        {
            name: 'Hive Queen',
            faction: Faction.Swarm,
            baseHp: 150,
            isBoss: true,
            abilities: [
                { name: 'Royal Strike', intentType: EnemyIntentType.Attack, weight: 30, damage: 20 },
                { name: 'Spawn Brood', intentType: EnemyIntentType.Summon, weight: 40, damage: 0 },
                { name: 'Toxic Nova', intentType: EnemyIntentType.Attack, weight: 30, damage: 8, aoe: true }
            ]
        }
    ]
};

function selectAbility(abilities) {
    const totalWeight = abilities.reduce((sum, a) => sum + a.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const ability of abilities) {
        roll -= ability.weight;
        if (roll <= 0) return ability;
    }
    return abilities[0];
}

function createEnemy(template, difficulty) {
    const hp = template.baseHp + (difficulty * 5);
    const ability = selectAbility(template.abilities);

    return {
        id: generateId(),
        name: template.name,
        faction: template.faction,
        maxHp: hp,
        currentHp: hp,
        intent: {
            type: ability.intentType,
            value: ability.damage,
            description: ability.name,
            aoe: ability.aoe
        },
        statusEffects: [],
        abilities: template.abilities,
        isBoss: template.isBoss
    };
}

function getEnemiesForEncounter(faction, difficulty, isBossEncounter) {
    const templates = enemyTemplates[faction];
    const enemies = [];

    if (isBossEncounter) {
        const bossTemplate = templates.find(t => t.isBoss);
        if (bossTemplate) {
            enemies.push(createEnemy(bossTemplate, difficulty));
        }
        const minions = templates.filter(t => !t.isBoss);
        for (let i = 0; i < 2; i++) {
            const template = minions[Math.floor(Math.random() * minions.length)];
            enemies.push(createEnemy(template, difficulty));
        }
    } else {
        const nonBoss = templates.filter(t => !t.isBoss);
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            const template = nonBoss[Math.floor(Math.random() * nonBoss.length)];
            enemies.push(createEnemy(template, difficulty));
        }
    }

    return enemies;
}

// ============================================
// HERO MANAGEMENT
// ============================================

const heroNames = {
    [HeroClass.Brute]: ['Titan', 'Colossus', 'Juggernaut', 'Goliath', 'Rampart'],
    [HeroClass.Blaster]: ['Nova', 'Radiance', 'Sunfire', 'Starburst', 'Inferno'],
    [HeroClass.Tinker]: ['Gadget', 'Cogsworth', 'Machina', 'Sprocket', 'Widget'],
    [HeroClass.Thinker]: ['Oracle', 'Sage', 'Cerebro', 'Insight', 'Prophecy'],
    [HeroClass.Mover]: ['Flash', 'Velocity', 'Quickstep', 'Blur', 'Dash'],
    [HeroClass.Stranger]: ['Shadow', 'Phantom', 'Specter', 'Ghost', 'Wraith']
};

const usedNames = new Set();

function generateHeroName(heroClass) {
    const names = heroNames[heroClass];
    const available = names.filter(n => !usedNames.has(n));

    if (available.length === 0) {
        const baseName = names[Math.floor(Math.random() * names.length)];
        let suffix = 2;
        while (usedNames.has(`${baseName} ${suffix}`)) suffix++;
        const name = `${baseName} ${suffix}`;
        usedNames.add(name);
        return name;
    }

    const name = available[Math.floor(Math.random() * available.length)];
    usedNames.add(name);
    return name;
}

const baseHp = {
    [HeroClass.Brute]: 90,
    [HeroClass.Blaster]: 65,
    [HeroClass.Tinker]: 70,
    [HeroClass.Thinker]: 60,
    [HeroClass.Mover]: 70,
    [HeroClass.Stranger]: 65
};

function createHero(heroClass) {
    const name = generateHeroName(heroClass);
    const starterCards = getStarterDeck(heroClass);
    const heroId = generateId();

    const deck = starterCards.map(card => ({
        ...card,
        instanceId: generateId(),
        ownerId: heroId,
        appliedUpgrades: []
    }));

    return {
        id: heroId,
        name,
        heroClass,
        maxHp: baseHp[heroClass],
        currentHp: baseHp[heroClass],
        deck,
        stress: 0,
        maxStress: 100,
        traumaCards: [],
        resistances: { [Faction.Cult]: 0, [Faction.Undead]: 0, [Faction.Swarm]: 0 },
        isAvailable: true,
        daysUnavailable: 0,
        statusEffects: []
    };
}

function createStartingRoster() {
    return [
        createHero(HeroClass.Brute),
        createHero(HeroClass.Blaster),
        createHero(HeroClass.Tinker),
        createHero(HeroClass.Thinker),
        createHero(HeroClass.Mover)
    ];
}

// ============================================
// TERRITORY & MISSION MANAGEMENT
// ============================================

function createInitialTerritories() {
    return [
        { id: 'chicago', name: 'Chicago', controlledBy: 'player', adjacentTo: ['detroit', 'indianapolis'], isLandmark: true, landmarkType: 'foundry', moneyGeneration: 150 },
        { id: 'indianapolis', name: 'Indianapolis', controlledBy: 'player', adjacentTo: ['chicago', 'cincinnati'], isLandmark: false, moneyGeneration: 80 },
        { id: 'detroit', name: 'Detroit', controlledBy: 'player', adjacentTo: ['chicago', 'cleveland'], isLandmark: true, landmarkType: 'academy', moneyGeneration: 100 },
        { id: 'milwaukee', name: 'Milwaukee', controlledBy: 'player', adjacentTo: ['chicago', 'minneapolis'], isLandmark: false, moneyGeneration: 70 },
        { id: 'st_louis', name: 'St. Louis', controlledBy: 'player', adjacentTo: ['chicago', 'kansas_city'], isLandmark: true, landmarkType: 'sanctuary', moneyGeneration: 90 },
        { id: 'cleveland', name: 'Cleveland', controlledBy: Faction.Undead, adjacentTo: ['detroit'], isLandmark: false, moneyGeneration: 80 },
        { id: 'cincinnati', name: 'Cincinnati', controlledBy: Faction.Undead, adjacentTo: ['indianapolis'], isLandmark: false, moneyGeneration: 75 },
        { id: 'louisville', name: 'Louisville', controlledBy: Faction.Cult, adjacentTo: ['indianapolis'], isLandmark: false, moneyGeneration: 70 },
        { id: 'nashville', name: 'Nashville', controlledBy: Faction.Cult, adjacentTo: ['louisville'], isLandmark: false, moneyGeneration: 80 },
        { id: 'minneapolis', name: 'Minneapolis', controlledBy: Faction.Swarm, adjacentTo: ['milwaukee'], isLandmark: false, moneyGeneration: 85 },
        { id: 'kansas_city', name: 'Kansas City', controlledBy: Faction.Swarm, adjacentTo: ['st_louis'], isLandmark: false, moneyGeneration: 80 }
    ];
}

function generateDefenseMission(territory, attackingFaction, difficulty) {
    return {
        id: generateId(),
        type: MissionType.Defense,
        faction: attackingFaction,
        territoryId: territory.id,
        difficulty,
        combatCount: 1,
        turnsRemaining: 3,
        rewards: { money: 100 + difficulty * 25, cardRewards: 1 },
        description: `Defend ${territory.name} from ${attackingFaction} attack`,
        isStory: false
    };
}

function generateStoryMission(faction, act) {
    const descriptions = {
        [Faction.Cult]: ['Disrupt the Cult\'s ritual', 'Destroy the Veil Anchor', 'Confront the High Priest'],
        [Faction.Undead]: ['Cleanse the Necropolis', 'Destroy the Phylactery', 'Defeat the Lich King'],
        [Faction.Swarm]: ['Burn the breeding grounds', 'Destroy the Hive Node', 'Assassinate the Hive Queen']
    };

    return {
        id: generateId(),
        type: MissionType.Story,
        faction,
        territoryId: 'story_location',
        difficulty: act * 2,
        combatCount: 2,
        turnsRemaining: 5,
        rewards: { money: 200 + act * 100, cardRewards: 2 },
        description: descriptions[faction][Math.min(act - 1, 2)],
        isStory: true
    };
}

// ============================================
// COMBAT SYSTEM
// ============================================

function initializeCombat(heroes, enemies) {
    const allCards = [];
    heroes.forEach(hero => {
        allCards.push(...hero.deck);
    });

    return {
        heroes: heroes.map(h => ({ ...h, statusEffects: [] })),
        enemies: enemies.map(e => ({ ...e, statusEffects: [] })),
        drawPile: shuffleArray([...allCards]),
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
        targetingMode: null
    };
}

function drawCards(state, count) {
    for (let i = 0; i < count; i++) {
        if (state.drawPile.length === 0) {
            if (state.discardPile.length === 0) return;
            state.drawPile = shuffleArray([...state.discardPile]);
            state.discardPile = [];
        }

        const card = state.drawPile.pop();
        if (card) {
            const owner = state.heroes.find(h => h.id === card.ownerId);
            if (owner && owner.currentHp > 0) {
                state.hand.push(card);
            } else {
                state.discardPile.push(card);
            }
        }
    }
}

function startPlayerTurn(state) {
    const newState = { ...state };
    newState.turn++;
    newState.phase = CombatPhase.PlayerTurn;
    newState.energy = newState.maxEnergy;
    newState.cardsPlayedThisTurn = 0;

    // Process gadgets
    newState.gadgets.forEach(gadget => {
        if (gadget.effectPerTurn.block) {
            newState.heroes.forEach(h => {
                if (h.currentHp > 0) {
                    const existing = h.statusEffects.find(s => s.type === StatusEffectType.Block);
                    if (existing) existing.stacks += gadget.effectPerTurn.block;
                    else h.statusEffects.push({ type: StatusEffectType.Block, stacks: gadget.effectPerTurn.block });
                }
            });
        }
    });

    // Clear block
    newState.heroes.forEach(h => {
        h.statusEffects = h.statusEffects.filter(s => s.type !== StatusEffectType.Block);
    });

    drawCards(newState, 5);
    return newState;
}

function canPlayCard(state, card) {
    if (state.phase !== CombatPhase.PlayerTurn) return false;
    if (card.energyCost > state.energy) return false;
    const owner = state.heroes.find(h => h.id === card.ownerId);
    if (!owner || owner.currentHp <= 0) return false;
    return true;
}

function applyDamageToEnemy(state, enemy, damage) {
    const block = enemy.statusEffects.find(s => s.type === StatusEffectType.Block);
    if (block) {
        const blocked = Math.min(block.stacks, damage);
        block.stacks -= blocked;
        damage -= blocked;
        if (block.stacks <= 0) {
            enemy.statusEffects = enemy.statusEffects.filter(s => s.type !== StatusEffectType.Block);
        }
    }

    const vulnerable = enemy.statusEffects.find(s => s.type === StatusEffectType.Vulnerable);
    if (vulnerable) {
        damage = Math.floor(damage * 1.5);
    }

    enemy.currentHp = Math.max(0, enemy.currentHp - damage);
    return enemy.currentHp <= 0;
}

function applyDamageToHero(state, hero, damage) {
    const block = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
    if (block) {
        const blocked = Math.min(block.stacks, damage);
        block.stacks -= blocked;
        damage -= blocked;
        if (block.stacks <= 0) {
            hero.statusEffects = hero.statusEffects.filter(s => s.type !== StatusEffectType.Block);
        }
    }
    hero.currentHp = Math.max(0, hero.currentHp - damage);
}

function playCard(state, card, targetEnemyId) {
    if (!canPlayCard(state, card)) return state;

    const newState = { ...state };
    const owner = newState.heroes.find(h => h.id === card.ownerId);
    const effect = card.effect;

    newState.energy -= card.energyCost;
    newState.hand = newState.hand.filter(c => c.instanceId !== card.instanceId);
    newState.cardsPlayedThisTurn++;

    let targetEnemy;
    if (targetEnemyId) {
        targetEnemy = newState.enemies.find(e => e.id === targetEnemyId);
    } else {
        targetEnemy = newState.enemies.find(e => e.currentHp > 0);
    }

    // Apply damage
    if (effect.damage !== undefined) {
        let damage = effect.damage;

        if (effect.damageScaling) {
            damage += newState.resources[effect.damageScaling.resource] * effect.damageScaling.multiplier;
        }

        const strength = owner.statusEffects.find(s => s.type === StatusEffectType.Strength);
        if (strength) damage += strength.stacks;

        if (effect.damageAll) {
            newState.enemies.forEach(enemy => {
                if (enemy.currentHp > 0) {
                    applyDamageToEnemy(newState, enemy, damage);
                }
            });
        } else if (targetEnemy && targetEnemy.currentHp > 0) {
            applyDamageToEnemy(newState, targetEnemy, damage);
        }
    }

    // Apply block
    if (effect.block !== undefined) {
        let block = effect.block;
        if (effect.blockScaling) {
            block += newState.resources[effect.blockScaling.resource] * effect.blockScaling.multiplier;
        }

        const existing = owner.statusEffects.find(s => s.type === StatusEffectType.Block);
        if (existing) existing.stacks += block;
        else owner.statusEffects.push({ type: StatusEffectType.Block, stacks: block });
    }

    // Generate resources
    if (effect.generateResource) {
        newState.resources[effect.generateResource.type] += effect.generateResource.amount;
    }

    // Draw cards
    if (effect.draw) {
        drawCards(newState, effect.draw);
    }

    // Become hidden
    if (effect.becomeHidden) {
        owner.statusEffects.push({ type: StatusEffectType.Hidden, stacks: 1 });
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

    // Exhaust or discard
    if (effect.exhaust) {
        newState.exhaustPile.push(card);
    } else {
        newState.discardPile.push(card);
    }

    // Remove hidden when attacking
    if (effect.damage !== undefined && !effect.becomeHidden) {
        owner.statusEffects = owner.statusEffects.filter(s => s.type !== StatusEffectType.Hidden);
    }

    return checkCombatEnd(newState);
}

function endPlayerTurn(state) {
    const newState = { ...state };

    // Process gadgets
    newState.gadgets.forEach(gadget => {
        if (gadget.effectPerTurn.damage) {
            const aliveEnemies = newState.enemies.filter(e => e.currentHp > 0);
            if (aliveEnemies.length > 0) {
                const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                applyDamageToEnemy(newState, target, gadget.effectPerTurn.damage);
            }
        }
        gadget.turnsRemaining--;
    });

    newState.gadgets = newState.gadgets.filter(g => g.turnsRemaining > 0);
    newState.discardPile.push(...newState.hand);
    newState.hand = [];
    newState.heroes.forEach(h => {
        h.statusEffects = h.statusEffects.filter(s => s.type !== StatusEffectType.Block);
    });

    newState.phase = CombatPhase.EnemyTurn;
    return newState;
}

function executeEnemyTurn(state) {
    let newState = { ...state };

    for (const enemy of newState.enemies) {
        if (enemy.currentHp <= 0) continue;

        const aliveHeroes = newState.heroes.filter(h => h.currentHp > 0);
        if (aliveHeroes.length === 0) break;

        const targetableHeroes = aliveHeroes.filter(h =>
            !h.statusEffects.some(s => s.type === StatusEffectType.Untargetable)
        );
        const targetPool = targetableHeroes.length > 0 ? targetableHeroes : aliveHeroes;
        const target = targetPool[Math.floor(Math.random() * targetPool.length)];

        if (enemy.intent.type === EnemyIntentType.Attack && enemy.intent.value) {
            if (enemy.intent.aoe) {
                aliveHeroes.forEach(h => applyDamageToHero(newState, h, enemy.intent.value));
            } else {
                applyDamageToHero(newState, target, enemy.intent.value);
            }
        }

        // Select next intent
        const nextAbility = selectAbility(enemy.abilities);
        enemy.intent = {
            type: nextAbility.intentType,
            value: nextAbility.damage,
            description: nextAbility.name,
            aoe: nextAbility.aoe
        };
    }

    // Clear enemy block
    newState.enemies.forEach(e => {
        e.statusEffects = e.statusEffects.filter(s => s.type !== StatusEffectType.Block);
    });

    newState = checkCombatEnd(newState);
    if (newState.phase === CombatPhase.EnemyTurn) {
        newState = startPlayerTurn(newState);
    }

    return newState;
}

function useBaselineAbility(state, resource, targetEnemyId) {
    if (state.energy < 1 || state.resources[resource] < 3) return state;

    const newState = { ...state };
    newState.energy -= 1;
    newState.resources[resource] -= 3;

    switch (resource) {
        case ResourceType.Blood:
            if (targetEnemyId) {
                const target = newState.enemies.find(e => e.id === targetEnemyId);
                if (target) applyDamageToEnemy(newState, target, 8);
            }
            break;
        case ResourceType.Glint:
            drawCards(newState, 2);
            break;
        case ResourceType.Iron:
            newState.heroes.forEach(hero => {
                if (hero.currentHp > 0) {
                    const existing = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
                    if (existing) existing.stacks += 8;
                    else hero.statusEffects.push({ type: StatusEffectType.Block, stacks: 8 });
                }
            });
            break;
    }

    return checkCombatEnd(newState);
}

function initiateRetreat(state) {
    if (state.energy < 3) return state;

    const newState = { ...state };
    newState.energy -= 3;

    newState.enemies.forEach(enemy => {
        if (enemy.currentHp <= 0) return;
        if (enemy.intent.type === EnemyIntentType.Attack && enemy.intent.value) {
            const aliveHeroes = newState.heroes.filter(h => h.currentHp > 0);
            if (aliveHeroes.length > 0) {
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                applyDamageToHero(newState, target, enemy.intent.value);
            }
        }
    });

    newState.phase = CombatPhase.Retreat;
    return newState;
}

function checkCombatEnd(state) {
    const newState = { ...state };

    if (newState.enemies.every(e => e.currentHp <= 0)) {
        newState.phase = CombatPhase.Victory;
    } else if (newState.heroes.every(h => h.currentHp <= 0)) {
        newState.phase = CombatPhase.Defeat;
    }

    return newState;
}

// ============================================
// GAME STATE MANAGEMENT
// ============================================

function createNewGame() {
    const territories = createInitialTerritories();
    const roster = createStartingRoster();
    const factions = [Faction.Cult, Faction.Undead, Faction.Swarm];
    const startingFaction = factions[Math.floor(Math.random() * factions.length)];

    return {
        phase: GamePhase.Strategic,
        day: 1,
        money: 500,
        roster,
        territories,
        missions: [],
        activeMission: null,
        currentCombat: null,
        currentCombatIndex: 0,
        factionHeat: { [Faction.Cult]: 30, [Faction.Undead]: 30, [Faction.Swarm]: 30 },
        doomCounter: 0,
        maxDoom: 10,
        currentAct: 1,
        actFaction: startingFaction,
        bazaarOfferings: [],
        completedStoryMissions: [],
        selectedMissionId: null,
        selectedHeroIds: []
    };
}

function advanceDay(state) {
    const newState = { ...state };
    newState.day++;

    // Calculate income
    const playerTerritories = newState.territories.filter(t => t.controlledBy === 'player');
    const income = playerTerritories.reduce((sum, t) => sum + t.moneyGeneration, 0);
    newState.money += income;

    // Reduce mission timers
    newState.missions = newState.missions.map(m => ({ ...m, turnsRemaining: m.turnsRemaining - 1 }));

    // Handle expired missions
    newState.missions.filter(m => m.turnsRemaining <= 0).forEach(m => {
        if (m.type === MissionType.Defense) {
            const territory = newState.territories.find(t => t.id === m.territoryId);
            if (territory) territory.controlledBy = m.faction;
        } else if (m.type === MissionType.Story) {
            newState.doomCounter += 2;
            if (newState.doomCounter >= newState.maxDoom) {
                newState.phase = GamePhase.GameOver;
            }
        }
    });
    newState.missions = newState.missions.filter(m => m.turnsRemaining > 0);

    // Update hero availability
    newState.roster.forEach(hero => {
        if (!hero.isAvailable && hero.daysUnavailable > 0) {
            hero.daysUnavailable--;
            if (hero.daysUnavailable <= 0) hero.isAvailable = true;
        }
        hero.stress = Math.max(0, hero.stress - 10);
    });

    // Generate new missions
    Object.entries(newState.factionHeat).forEach(([faction, heat]) => {
        if (Math.random() * 100 < heat) {
            const frontlines = playerTerritories.filter(t =>
                t.adjacentTo.some(adjId => {
                    const adj = newState.territories.find(t2 => t2.id === adjId);
                    return adj && adj.controlledBy === faction;
                })
            );
            if (frontlines.length > 0) {
                const target = frontlines[Math.floor(Math.random() * frontlines.length)];
                if (!newState.missions.some(m => m.territoryId === target.id && m.type === MissionType.Defense)) {
                    newState.missions.push(generateDefenseMission(target, faction, newState.currentAct));
                }
            }
        }
    });

    // Ensure story mission exists
    if (!newState.missions.some(m => m.isStory && m.faction === newState.actFaction)) {
        newState.missions.push(generateStoryMission(newState.actFaction, newState.currentAct));
    }

    // Heat decay
    Object.keys(newState.factionHeat).forEach(f => {
        newState.factionHeat[f] = Math.max(0, newState.factionHeat[f] - 2);
    });

    return newState;
}

function startMission(state, missionId, heroIds) {
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || heroIds.length !== 3) return state;

    const heroes = heroIds.map(id => state.roster.find(h => h.id === id)).filter(Boolean);
    if (heroes.length !== 3 || heroes.some(h => !h.isAvailable || h.currentHp <= 0)) return state;

    const newState = { ...state };
    newState.activeMission = mission;
    newState.currentCombatIndex = 0;
    newState.phase = GamePhase.Combat;

    heroes.forEach(h => {
        const hero = newState.roster.find(rh => rh.id === h.id);
        hero.isAvailable = false;
    });

    const enemies = getEnemiesForEncounter(
        mission.faction,
        mission.difficulty,
        newState.currentCombatIndex === mission.combatCount - 1
    );

    newState.currentCombat = initializeCombat(heroes, enemies);
    newState.currentCombat = startPlayerTurn(newState.currentCombat);

    return newState;
}

function handleCombatVictory(state) {
    const newState = { ...state };
    const mission = newState.activeMission;
    const combat = newState.currentCombat;

    // Update heroes
    combat.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            rosterHero.currentHp = combatHero.currentHp;
            rosterHero.statusEffects = [];
        }
    });

    newState.currentCombatIndex++;

    if (newState.currentCombatIndex < mission.combatCount) {
        const aliveHeroes = combat.heroes.filter(h => h.currentHp > 0);
        if (aliveHeroes.length === 0) return handleMissionFailure(newState);

        const enemies = getEnemiesForEncounter(
            mission.faction,
            mission.difficulty,
            newState.currentCombatIndex === mission.combatCount - 1
        );

        newState.currentCombat = initializeCombat(aliveHeroes, enemies);
        newState.currentCombat = startPlayerTurn(newState.currentCombat);
        return newState;
    }

    return handleMissionSuccess(newState);
}

function handleMissionSuccess(state) {
    const newState = { ...state };
    const mission = newState.activeMission;
    const combat = newState.currentCombat;

    newState.money += mission.rewards.money;
    newState.factionHeat[mission.faction] += 15;

    combat.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            rosterHero.resistances[mission.faction] += 5;
            rosterHero.isAvailable = true;
            rosterHero.stress = Math.min(100, rosterHero.stress + 10);
        }
    });

    if (mission.type === MissionType.Defense) {
        newState.factionHeat[mission.faction] -= 10;
    } else if (mission.type === MissionType.Capture) {
        const territory = newState.territories.find(t => t.id === mission.territoryId);
        if (territory) territory.controlledBy = 'player';
    } else if (mission.type === MissionType.Story) {
        newState.completedStoryMissions.push(`${mission.faction}_${newState.currentAct}`);

        const storyCount = newState.completedStoryMissions.filter(id => id.startsWith(mission.faction)).length;
        if (storyCount >= 3) {
            newState.currentAct++;
            if (newState.currentAct > 3) {
                newState.phase = GamePhase.Victory;
                return newState;
            }
            const factions = [Faction.Cult, Faction.Undead, Faction.Swarm];
            const currentIndex = factions.indexOf(newState.actFaction);
            newState.actFaction = factions[(currentIndex + 1) % 3];
            newState.doomCounter = 0;
        }
    }

    newState.missions = newState.missions.filter(m => m.id !== mission.id);
    newState.phase = GamePhase.PostCombat;

    return newState;
}

function handleMissionFailure(state) {
    const newState = { ...state };
    const mission = newState.activeMission;

    if (mission.type === MissionType.Defense) {
        const territory = newState.territories.find(t => t.id === mission.territoryId);
        if (territory) territory.controlledBy = mission.faction;
    } else if (mission.type === MissionType.Story) {
        newState.doomCounter++;
        if (newState.doomCounter >= newState.maxDoom) {
            newState.phase = GamePhase.GameOver;
            return newState;
        }
    }

    newState.currentCombat?.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero && combatHero.currentHp <= 0) {
            newState.roster = newState.roster.filter(h => h.id !== rosterHero.id);
        } else if (rosterHero) {
            rosterHero.currentHp = combatHero.currentHp;
            rosterHero.isAvailable = true;
            rosterHero.stress = Math.min(100, rosterHero.stress + 30);
        }
    });

    newState.missions = newState.missions.filter(m => m.id !== mission.id);
    newState.activeMission = null;
    newState.currentCombat = null;
    newState.phase = GamePhase.Strategic;

    return newState;
}

function handleCombatRetreat(state) {
    const newState = { ...state };

    newState.currentCombat?.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            if (combatHero.currentHp <= 0) {
                newState.roster = newState.roster.filter(h => h.id !== rosterHero.id);
            } else {
                rosterHero.currentHp = combatHero.currentHp;
                rosterHero.isAvailable = true;
                rosterHero.stress = Math.min(100, rosterHero.stress + 20);
            }
        }
    });

    newState.activeMission = null;
    newState.currentCombat = null;
    newState.phase = GamePhase.Strategic;

    return newState;
}

function generateBazaarOfferings(state) {
    const offerings = [];
    const classes = Object.values(HeroClass);

    for (let i = 0; i < 3; i++) {
        const heroClass = classes[Math.floor(Math.random() * classes.length)];
        const hero = createHero(heroClass);
        offerings.push({
            id: generateId(),
            type: 'hero',
            hero,
            cost: 200 + state.currentAct * 50,
            description: `Recruit ${hero.name} (${heroClass})`
        });
    }

    return offerings;
}

// ============================================
// GAME RENDERER
// ============================================

class GameRenderer {
    constructor(containerId, onAction) {
        this.container = document.getElementById(containerId);
        this.onAction = onAction;
    }

    render(state) {
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

    getClassColor(heroClass) {
        const colors = {
            [HeroClass.Brute]: '#dc2626',
            [HeroClass.Blaster]: '#f97316',
            [HeroClass.Tinker]: '#3b82f6',
            [HeroClass.Thinker]: '#a855f7',
            [HeroClass.Mover]: '#22c55e',
            [HeroClass.Stranger]: '#6366f1'
        };
        return colors[heroClass] || '#58a6ff';
    }

    getClassIcon(heroClass) {
        const icons = {
            [HeroClass.Brute]: '💪',
            [HeroClass.Blaster]: '💥',
            [HeroClass.Tinker]: '⚙️',
            [HeroClass.Thinker]: '🧠',
            [HeroClass.Mover]: '⚡',
            [HeroClass.Stranger]: '👤'
        };
        return icons[heroClass] || '?';
    }

    getEnemyIcon(enemy) {
        const icons = {
            'Cultist': '🧙', 'Void Spawn': '👁️', 'High Priest': '👿',
            'Skeleton': '💀', 'Zombie': '🧟', 'Lich King': '👑',
            'Drone': '🐜', 'Warrior': '🦗', 'Hive Queen': '👸'
        };
        return icons[enemy.name] || '👾';
    }

    renderStrategic(state) {
        const playerTerritories = state.territories.filter(t => t.controlledBy === 'player');
        const income = playerTerritories.reduce((sum, t) => sum + t.moneyGeneration, 0);

        this.container.innerHTML = `
            <div class="game-screen strategic-screen">
                <header class="game-header">
                    <div class="header-left">
                        <h1>Superhero Long War</h1>
                        <span class="day-counter">Day ${state.day}</span>
                    </div>
                    <div class="header-center">
                        <div class="doom-counter">
                            <span class="doom-label">DOOM</span>
                            <div class="doom-bar">
                                ${Array(state.maxDoom).fill(0).map((_, i) =>
                                    `<div class="doom-segment ${i < state.doomCounter ? 'filled' : ''}"></div>`
                                ).join('')}
                            </div>
                            <span class="doom-faction">${state.actFaction} Threat - Act ${state.currentAct}</span>
                        </div>
                    </div>
                    <div class="header-right">
                        <span class="money">$${state.money}</span>
                        <button class="btn btn-bazaar" data-action="openBazaar">Bazaar</button>
                    </div>
                </header>

                <div class="strategic-content">
                    <aside class="roster-panel">
                        <h2>Your Heroes (${state.roster.length})</h2>
                        <div class="roster-list">
                            ${state.roster.map(h => this.renderHeroCard(h)).join('')}
                        </div>
                    </aside>

                    <main class="map-panel">
                        <div class="heat-meters">
                            ${Object.entries(state.factionHeat).map(([faction, heat]) => `
                                <div class="heat-meter faction-${faction.toLowerCase()}">
                                    <span class="heat-label">${faction}</span>
                                    <div class="heat-bar">
                                        <div class="heat-fill" style="width: ${Math.min(100, heat)}%"></div>
                                    </div>
                                    <span class="heat-value">${heat}%</span>
                                </div>
                            `).join('')}
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
                            <div class="territories-summary">
                                <div class="territory-count">${playerTerritories.length} Territories</div>
                                <div class="territory-income">Daily Income: $${income}</div>
                            </div>
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

    renderHeroCard(hero) {
        const hpPercent = (hero.currentHp / hero.maxHp) * 100;
        const stressPercent = (hero.stress / hero.maxStress) * 100;

        return `
            <div class="hero-card ${!hero.isAvailable ? 'unavailable' : ''}"
                 style="--class-color: ${this.getClassColor(hero.heroClass)}">
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
                </div>
                ${!hero.isAvailable ? `<div class="unavailable-overlay">Unavailable</div>` : ''}
            </div>
        `;
    }

    renderMissionCard(mission, state) {
        const territory = state.territories.find(t => t.id === mission.territoryId);

        return `
            <div class="mission-card ${mission.turnsRemaining <= 2 ? 'urgent' : ''} faction-${mission.faction.toLowerCase()}">
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

    renderMissionSelect(state) {
        const mission = state.missions.find(m => m.id === state.selectedMissionId);
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
                        <h2>${mission?.description || 'Mission'}</h2>
                        <div class="mission-info">
                            <span>Faction: ${mission?.faction}</span>
                            <span>Combats: ${mission?.combatCount}</span>
                            <span>Difficulty: ${mission?.difficulty}</span>
                        </div>
                    </div>

                    <div class="team-selection">
                        <h3>Select 3 Heroes</h3>
                        <div class="selected-heroes">
                            ${[0, 1, 2].map(i => {
                                const heroId = state.selectedHeroIds[i];
                                const hero = heroId ? state.roster.find(h => h.id === heroId) : null;
                                return `
                                    <div class="hero-slot ${hero ? '' : 'empty'}" data-slot="${i}">
                                        ${hero ? `
                                            <span class="class-icon">${this.getClassIcon(hero.heroClass)}</span>
                                            <span class="name">${hero.name}</span>
                                        ` : 'Select Hero'}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div class="available-heroes">
                        <h3>Available Heroes</h3>
                        <div class="hero-grid">
                            ${availableHeroes.map(h => `
                                <div class="selectable-hero ${state.selectedHeroIds.includes(h.id) ? 'selected' : ''}"
                                     data-hero-id="${h.id}">
                                    <div class="hero-portrait" style="--class-color: ${this.getClassColor(h.heroClass)}">
                                        <span class="class-icon">${this.getClassIcon(h.heroClass)}</span>
                                    </div>
                                    <div class="hero-details">
                                        <span class="name">${h.name}</span>
                                        <span class="class">${h.heroClass}</span>
                                        <div class="mini-hp-bar">
                                            <div class="fill" style="width: ${(h.currentHp / h.maxHp) * 100}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <footer class="game-footer">
                    <button class="btn btn-primary btn-large"
                            data-action="startMission"
                            ${state.selectedHeroIds.length !== 3 ? 'disabled' : ''}>
                        Begin Mission
                    </button>
                </footer>
            </div>
        `;

        this.bindMissionSelectListeners(state);
    }

    renderCombat(state) {
        const combat = state.currentCombat;

        this.container.innerHTML = `
            <div class="game-screen combat-screen">
                <header class="combat-header">
                    <div class="combat-info">
                        <span class="turn-counter">Turn ${combat.turn}</span>
                        <span class="combat-progress">${state.currentCombatIndex + 1}/${state.activeMission?.combatCount}</span>
                    </div>
                    <div class="combat-resources">
                        ${[
                            { type: ResourceType.Blood, icon: '🩸', color: '#dc2626' },
                            { type: ResourceType.Glint, icon: '✨', color: '#fbbf24' },
                            { type: ResourceType.Ashes, icon: '🔥', color: '#6b7280' },
                            { type: ResourceType.Pages, icon: '📖', color: '#3b82f6' },
                            { type: ResourceType.Iron, icon: '🛡️', color: '#a1a1aa' }
                        ].map(r => `
                            <div class="resource-display" style="--resource-color: ${r.color}">
                                <span class="resource-icon">${r.icon}</span>
                                <span class="resource-value">${combat.resources[r.type]}</span>
                            </div>
                        `).join('')}
                    </div>
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
                        ${combat.gadgets.length > 0 ? `
                            <div class="gadgets-display">
                                ${combat.gadgets.map(g => `
                                    <div class="gadget">
                                        <span class="gadget-name">${g.name}</span>
                                        <span class="gadget-duration">${g.turnsRemaining}t</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="heroes-row">
                        ${combat.heroes.map(h => this.renderCombatHero(h)).join('')}
                    </div>
                </div>

                <div class="hand-area">
                    <div class="card-hand">
                        ${combat.hand.map(c => this.renderHandCard(c, combat)).join('')}
                    </div>
                </div>

                <footer class="combat-footer">
                    <div class="resource-abilities">
                        ${[
                            { resource: ResourceType.Blood, name: 'Blood Strike', effect: 'Deal 8 dmg' },
                            { resource: ResourceType.Glint, name: 'Clarity', effect: 'Draw 2' },
                            { resource: ResourceType.Iron, name: 'Fortify', effect: '+8 block all' }
                        ].map(a => {
                            const canUse = combat.energy >= 1 && combat.resources[a.resource] >= 3;
                            return `
                                <button class="resource-ability ${canUse ? '' : 'disabled'}"
                                        data-action="useAbility"
                                        data-resource="${a.resource}"
                                        ${canUse ? '' : 'disabled'}>
                                    <span class="ability-cost">1⚡ 3${a.resource[0]}</span>
                                    <span class="ability-name">${a.name}</span>
                                    <span class="ability-effect">${a.effect}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                    <div class="combat-actions">
                        <button class="btn btn-danger" data-action="retreat" ${combat.energy < 3 ? 'disabled' : ''}>
                            Retreat (3⚡)
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

    renderEnemyUnit(enemy) {
        const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
        const block = enemy.statusEffects.find(s => s.type === StatusEffectType.Block);
        const intentIcons = {
            'Attack': '⚔️', 'Block': '🛡️', 'Buff': '⬆️', 'Debuff': '⬇️', 'Summon': '👥'
        };

        return `
            <div class="enemy-unit ${enemy.currentHp <= 0 ? 'dead' : ''} ${enemy.isBoss ? 'boss' : ''}"
                 data-enemy-id="${enemy.id}">
                <div class="enemy-intent">
                    <span class="intent-icon">${intentIcons[enemy.intent.type] || '❓'}</span>
                    ${enemy.intent.value ? `<span class="intent-value">${enemy.intent.value}</span>` : ''}
                    <span class="intent-name">${enemy.intent.description}</span>
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
            </div>
        `;
    }

    renderCombatHero(hero) {
        const hpPercent = (hero.currentHp / hero.maxHp) * 100;
        const block = hero.statusEffects.find(s => s.type === StatusEffectType.Block);
        const isHidden = hero.statusEffects.some(s => s.type === StatusEffectType.Hidden);

        return `
            <div class="combat-hero ${hero.currentHp <= 0 ? 'dead' : ''}"
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
            </div>
        `;
    }

    renderHandCard(card, combat) {
        const canPlay = combat.phase === CombatPhase.PlayerTurn && card.energyCost <= combat.energy;
        const owner = combat.heroes.find(h => h.id === card.ownerId);
        const ownerDead = !owner || owner.currentHp <= 0;

        return `
            <div class="hand-card ${canPlay && !ownerDead ? 'playable' : 'unplayable'}"
                 data-card-id="${card.instanceId}"
                 style="--class-color: ${this.getClassColor(card.heroClass)}">
                <div class="card-cost">${card.energyCost}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-type">${card.type}</div>
                <div class="card-effect">${card.description}</div>
                ${owner ? `<div class="card-owner">${owner.name}</div>` : ''}
            </div>
        `;
    }

    renderPostCombat(state) {
        const combat = state.currentCombat;
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
                        <h3>Surviving Heroes</h3>
                        <div class="hero-grid" style="justify-content: center;">
                            ${survivingHeroes.map(h => `
                                <div class="selectable-hero" style="cursor: default;">
                                    <div class="hero-portrait" style="--class-color: ${this.getClassColor(h.heroClass)}">
                                        <span class="class-icon">${this.getClassIcon(h.heroClass)}</span>
                                    </div>
                                    <div class="hero-details">
                                        <span class="name">${h.name}</span>
                                        <span class="class">${h.heroClass}</span>
                                        <div class="mini-hp-bar">
                                            <div class="fill" style="width: ${(h.currentHp / h.maxHp) * 100}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <footer class="game-footer">
                    <button class="btn btn-primary btn-large" data-action="finishPostCombat">
                        Continue
                    </button>
                </footer>
            </div>
        `;

        this.bindEventListeners();
    }

    renderBazaar(state) {
        this.container.innerHTML = `
            <div class="game-screen bazaar-screen">
                <header class="game-header">
                    <button class="btn btn-back" data-action="closeBazaar">Back</button>
                    <h1>The Bazaar</h1>
                    <span class="money">$${state.money}</span>
                </header>

                <div class="bazaar-content">
                    <div class="offerings-grid">
                        ${state.bazaarOfferings.map(o => `
                            <div class="bazaar-offering ${state.money < o.cost ? 'cant-afford' : ''}">
                                <div class="offering-type">HERO</div>
                                ${o.hero ? `
                                    <div class="offering-hero" style="--class-color: ${this.getClassColor(o.hero.heroClass)}">
                                        <span class="class-icon" style="font-size: 2rem;">${this.getClassIcon(o.hero.heroClass)}</span>
                                        <span class="hero-name">${o.hero.name}</span>
                                        <span class="hero-class">${o.hero.heroClass}</span>
                                    </div>
                                ` : ''}
                                <div class="offering-cost">$${o.cost}</div>
                                <button class="btn btn-purchase"
                                        data-action="purchase"
                                        data-offering-id="${o.id}"
                                        ${state.money < o.cost || state.roster.length >= 12 ? 'disabled' : ''}>
                                    ${state.money >= o.cost ? 'Purchase' : 'Cannot Afford'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.bindEventListeners();
    }

    renderGameOver(state, isVictory) {
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

    bindEventListeners() {
        this.container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const payload = { ...e.currentTarget.dataset };
                delete payload.action;
                this.onAction(action, payload);
            });
        });
    }

    bindMissionSelectListeners(state) {
        const heroes = this.container.querySelectorAll('.selectable-hero');

        heroes.forEach(hero => {
            hero.addEventListener('click', () => {
                const heroId = hero.dataset.heroId;
                this.onAction('toggleHeroSelection', { heroId });
            });
        });

        this.bindEventListeners();
    }

    bindCombatListeners(combat) {
        const cards = this.container.querySelectorAll('.hand-card.playable');
        const enemies = this.container.querySelectorAll('.enemy-unit:not(.dead)');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const cardId = card.dataset.cardId;
                const cardInstance = combat.hand.find(c => c.instanceId === cardId);

                if (cardInstance && cardInstance.effect.damage !== undefined && !cardInstance.effect.damageAll) {
                    // Enable targeting mode
                    enemies.forEach(e => e.classList.add('targetable'));
                    this.container.dataset.targetingCard = cardId;
                } else {
                    this.onAction('playCard', { cardId });
                }
            });
        });

        enemies.forEach(enemy => {
            enemy.addEventListener('click', () => {
                const targetingCardId = this.container.dataset.targetingCard;
                if (targetingCardId) {
                    this.onAction('playCard', {
                        cardId: targetingCardId,
                        targetId: enemy.dataset.enemyId
                    });
                    delete this.container.dataset.targetingCard;
                }
            });
        });

        this.bindEventListeners();
    }
}

// ============================================
// MAIN GAME CLASS
// ============================================

class SuperheroLongWar {
    constructor() {
        this.state = createNewGame();
        this.renderer = new GameRenderer('game-container', this.handleAction.bind(this));
        this.render();
    }

    handleAction(action, payload = {}) {
        console.log('Action:', action, payload);

        switch (action) {
            case 'advanceDay':
                this.state = advanceDay(this.state);
                break;

            case 'selectMission':
                this.state.selectedMissionId = payload.missionId;
                this.state.selectedHeroIds = [];
                this.state.phase = GamePhase.MissionSelect;
                break;

            case 'cancelMission':
                this.state.selectedMissionId = null;
                this.state.selectedHeroIds = [];
                this.state.phase = GamePhase.Strategic;
                break;

            case 'toggleHeroSelection':
                const heroId = payload.heroId;
                const idx = this.state.selectedHeroIds.indexOf(heroId);
                if (idx >= 0) {
                    this.state.selectedHeroIds.splice(idx, 1);
                } else if (this.state.selectedHeroIds.length < 3) {
                    this.state.selectedHeroIds.push(heroId);
                }
                break;

            case 'startMission':
                if (this.state.selectedMissionId && this.state.selectedHeroIds.length === 3) {
                    this.state = startMission(this.state, this.state.selectedMissionId, this.state.selectedHeroIds);
                }
                break;

            case 'playCard':
                if (this.state.currentCombat) {
                    const card = this.state.currentCombat.hand.find(c => c.instanceId === payload.cardId);
                    if (card) {
                        this.state.currentCombat = playCard(this.state.currentCombat, card, payload.targetId);
                        this.checkCombatResult();
                    }
                }
                break;

            case 'endTurn':
                if (this.state.currentCombat) {
                    this.state.currentCombat = endPlayerTurn(this.state.currentCombat);
                    this.state.currentCombat = executeEnemyTurn(this.state.currentCombat);
                    this.checkCombatResult();
                }
                break;

            case 'retreat':
                if (this.state.currentCombat) {
                    this.state.currentCombat = initiateRetreat(this.state.currentCombat);
                    this.state = handleCombatRetreat(this.state);
                }
                break;

            case 'useAbility':
                if (this.state.currentCombat) {
                    const firstEnemy = this.state.currentCombat.enemies.find(e => e.currentHp > 0);
                    this.state.currentCombat = useBaselineAbility(
                        this.state.currentCombat,
                        payload.resource,
                        firstEnemy?.id
                    );
                    this.checkCombatResult();
                }
                break;

            case 'finishPostCombat':
                this.state.activeMission = null;
                this.state.currentCombat = null;
                this.state.phase = GamePhase.Strategic;
                break;

            case 'openBazaar':
                if (this.state.bazaarOfferings.length === 0) {
                    this.state.bazaarOfferings = generateBazaarOfferings(this.state);
                }
                this.state.phase = GamePhase.Bazaar;
                break;

            case 'closeBazaar':
                this.state.phase = GamePhase.Strategic;
                break;

            case 'purchase':
                const offering = this.state.bazaarOfferings.find(o => o.id === payload.offeringId);
                if (offering && this.state.money >= offering.cost && this.state.roster.length < 12) {
                    this.state.money -= offering.cost;
                    if (offering.hero) {
                        this.state.roster.push(offering.hero);
                    }
                    this.state.bazaarOfferings = this.state.bazaarOfferings.filter(o => o.id !== offering.id);
                }
                break;

            case 'newGame':
                usedNames.clear();
                this.state = createNewGame();
                break;
        }

        this.render();
    }

    checkCombatResult() {
        if (!this.state.currentCombat) return;

        const combat = this.state.currentCombat;

        if (combat.phase === CombatPhase.Victory) {
            this.state = handleCombatVictory(this.state);
        } else if (combat.phase === CombatPhase.Defeat) {
            this.state = handleMissionFailure(this.state);
        }
    }

    render() {
        this.renderer.render(this.state);
    }
}

// ============================================
// INITIALIZE GAME
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.game = new SuperheroLongWar();
});

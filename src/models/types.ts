// Core type definitions for Superhero Long War

// ============================================
// ENUMS
// ============================================

export enum HeroClass {
    Brute = 'Brute',
    Blaster = 'Blaster',
    Tinker = 'Tinker',
    Thinker = 'Thinker',
    Mover = 'Mover',
    Stranger = 'Stranger'
}

export enum Faction {
    Cult = 'Cult',      // Southern States - Lovecraftian horrors
    Undead = 'Undead',  // Eastern States - Necromancers
    Swarm = 'Swarm'     // Western States - Alien bugs
}

export enum ResourceType {
    Blood = 'Blood',    // Vitality, sacrifice
    Glint = 'Glint',    // Perception, opportunity
    Ashes = 'Ashes',    // Destruction, entropy
    Pages = 'Pages',    // Knowledge, preparation
    Iron = 'Iron'       // Will, endurance
}

export enum CardType {
    Attack = 'Attack',
    Skill = 'Skill',
    Power = 'Power'
}

export enum CardRarity {
    Basic = 'Basic',
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare'
}

export enum MissionType {
    Defense = 'Defense',
    Story = 'Story',
    Capture = 'Capture'
}

export enum GamePhase {
    Strategic = 'Strategic',
    MissionSelect = 'MissionSelect',
    Combat = 'Combat',
    PostCombat = 'PostCombat',
    Bazaar = 'Bazaar',
    GameOver = 'GameOver',
    Victory = 'Victory'
}

export enum CombatPhase {
    PlayerTurn = 'PlayerTurn',
    EnemyTurn = 'EnemyTurn',
    Victory = 'Victory',
    Defeat = 'Defeat',
    Retreat = 'Retreat'
}

export enum EnemyIntentType {
    Attack = 'Attack',
    Block = 'Block',
    Buff = 'Buff',
    Debuff = 'Debuff',
    Summon = 'Summon',
    Special = 'Special'
}

export enum StatusEffectType {
    // Positive
    Block = 'Block',
    Strength = 'Strength',
    Hidden = 'Hidden',
    Untargetable = 'Untargetable',

    // Negative
    Vulnerable = 'Vulnerable',
    Weak = 'Weak',
    Poison = 'Poison',
    Marked = 'Marked',

    // Neutral / Special
    Thorns = 'Thorns',
    Regeneration = 'Regeneration'
}

// ============================================
// INTERFACES
// ============================================

export interface Resources {
    [ResourceType.Blood]: number;
    [ResourceType.Glint]: number;
    [ResourceType.Ashes]: number;
    [ResourceType.Pages]: number;
    [ResourceType.Iron]: number;
}

export interface StatusEffect {
    type: StatusEffectType;
    stacks: number;
    duration?: number; // undefined = permanent until removed
}

export interface CardEffect {
    // Damage
    damage?: number;
    damageScaling?: { resource: ResourceType; multiplier: number };
    damageAll?: boolean;

    // Block
    block?: number;
    blockScaling?: { resource: ResourceType; multiplier: number };

    // Resources
    generateResource?: { type: ResourceType; amount: number };
    consumeResource?: { type: ResourceType; amount: number };

    // Card manipulation
    draw?: number;
    drawScaling?: { resource: ResourceType; multiplier: number; max?: number };
    scry?: number;
    exhaust?: boolean;
    exhaustFromHand?: number;

    // Status effects
    applyToSelf?: StatusEffect[];
    applyToEnemy?: StatusEffect[];
    applyToAllEnemies?: StatusEffect[];
    applyToAllAllies?: StatusEffect[];

    // Conditional effects
    condition?: CardCondition;
    conditionalEffect?: Partial<CardEffect>;

    // Special effects
    becomeHidden?: boolean;
    reduceEnergyCost?: number;
    deployGadget?: GadgetEffect;
    selfDamage?: number;

    // Threat manipulation
    reduceThreat?: number;
    increaseThreat?: number;
}

export interface CardCondition {
    type: 'resourceThreshold' | 'hidden' | 'killsEnemy' | 'cardsPlayedThisTurn' | 'discardedCard' | 'gadgetCount';
    resource?: ResourceType;
    threshold?: number;
    comparison?: 'gte' | 'lte' | 'eq';
}

export interface GadgetEffect {
    name: string;
    duration: number;
    effectPerTurn: Partial<CardEffect>;
}

export interface Card {
    id: string;
    name: string;
    heroClass: HeroClass;
    type: CardType;
    rarity: CardRarity;
    energyCost: number;
    effect: CardEffect;
    description: string;
    flavorText?: string;
    upgrades?: CardUpgrade[];
}

export interface CardUpgrade {
    description: string;
    modifyEffect: Partial<CardEffect>;
    modifyEnergyCost?: number;
}

export interface CardInstance extends Card {
    instanceId: string;
    ownerId: string; // Hero ID
    appliedUpgrades: CardUpgrade[];
}

export interface Hero {
    id: string;
    name: string;
    heroClass: HeroClass;
    maxHp: number;
    currentHp: number;
    deck: CardInstance[];
    stress: number;
    maxStress: number;
    traumaCards: CardInstance[];
    resistances: FactionResistances;
    isAvailable: boolean;
    daysUnavailable: number;
    statusEffects: StatusEffect[];
}

export interface FactionResistances {
    [Faction.Cult]: number;    // Mental fortitude
    [Faction.Undead]: number;  // Death's defiance
    [Faction.Swarm]: number;   // Toxin tolerance
}

export interface Enemy {
    id: string;
    name: string;
    faction: Faction;
    maxHp: number;
    currentHp: number;
    intent: EnemyIntent;
    statusEffects: StatusEffect[];
    abilities: EnemyAbility[];
    isBoss: boolean;
}

export interface EnemyIntent {
    type: EnemyIntentType;
    value?: number;
    description: string;
}

export interface EnemyAbility {
    name: string;
    intentType: EnemyIntentType;
    weight: number; // For random selection
    effect: CardEffect;
    intentValue?: number;
    condition?: (enemy: Enemy, combatState: any) => boolean;
}

export interface Territory {
    id: string;
    name: string;
    controlledBy: 'player' | Faction | 'neutral';
    adjacentTo: string[];
    isLandmark: boolean;
    landmarkType?: 'foundry' | 'academy' | 'sanctuary' | 'listeningPost';
    moneyGeneration: number;
    specialBonus?: string;
}

export interface Mission {
    id: string;
    type: MissionType;
    faction: Faction;
    territoryId: string;
    difficulty: number;
    combatCount: number; // 1 for defense, 2-3 for story
    turnsRemaining: number;
    rewards: MissionRewards;
    description: string;
    isStory: boolean;
}

export interface MissionRewards {
    money: number;
    cardRewards: number; // Number of card choices per hero
    specialReward?: string;
}

export interface CombatState {
    heroes: Hero[];
    enemies: Enemy[];
    drawPile: CardInstance[];
    hand: CardInstance[];
    discardPile: CardInstance[];
    exhaustPile: CardInstance[];
    resources: Resources;
    energy: number;
    maxEnergy: number;
    turn: number;
    phase: CombatPhase;
    cardsPlayedThisTurn: number;
    gadgets: GadgetInstance[];
    damageDealtThisTurn: number;
    targetingMode: TargetingMode | null;
}

export interface GadgetInstance {
    name: string;
    turnsRemaining: number;
    effectPerTurn: Partial<CardEffect>;
    ownerId: string;
}

export interface TargetingMode {
    card: CardInstance;
    validTargets: 'enemy' | 'hero' | 'any';
}

export interface GameState {
    phase: GamePhase;
    day: number;
    money: number;
    roster: Hero[];
    territories: Territory[];
    missions: Mission[];
    activeMission: Mission | null;
    currentCombat: CombatState | null;
    currentCombatIndex: number; // For multi-combat missions
    factionHeat: { [key in Faction]: number };
    doomCounter: number;
    maxDoom: number;
    currentAct: number;
    actFaction: Faction; // Which faction's story is active
    bazaarOfferings: BazaarOffering[];
    completedStoryMissions: string[];
}

export interface BazaarOffering {
    id: string;
    type: 'hero' | 'upgrade' | 'training';
    hero?: Hero;
    upgradeCard?: CardInstance;
    trainingBonus?: string;
    cost: number;
    description: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createEmptyResources(): Resources {
    return {
        [ResourceType.Blood]: 0,
        [ResourceType.Glint]: 0,
        [ResourceType.Ashes]: 0,
        [ResourceType.Pages]: 0,
        [ResourceType.Iron]: 0
    };
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

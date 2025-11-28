import {
    Hero, HeroClass, CardInstance, Faction, generateId
} from '../models/types.js';
import { getStarterDeck } from './cards.js';

// ============================================
// HERO NAMES BY CLASS
// ============================================

const heroNames: Record<HeroClass, string[]> = {
    [HeroClass.Brute]: [
        'Titan', 'Colossus', 'Juggernaut', 'Goliath', 'Rampart',
        'Fortress', 'Bulwark', 'Bastion', 'Ironclad', 'Monolith'
    ],
    [HeroClass.Blaster]: [
        'Nova', 'Radiance', 'Sunfire', 'Starburst', 'Inferno',
        'Pulse', 'Beam', 'Flare', 'Corona', 'Photon'
    ],
    [HeroClass.Tinker]: [
        'Gadget', 'Cogsworth', 'Machina', 'Sprocket', 'Widget',
        'Gizmo', 'Techne', 'Circuit', 'Forge', 'Blueprint'
    ],
    [HeroClass.Thinker]: [
        'Oracle', 'Sage', 'Cerebro', 'Insight', 'Prophecy',
        'Axiom', 'Theorem', 'Logic', 'Cipher', 'Augur'
    ],
    [HeroClass.Mover]: [
        'Flash', 'Velocity', 'Quickstep', 'Blur', 'Dash',
        'Zephyr', 'Swift', 'Streak', 'Bolt', 'Rush'
    ],
    [HeroClass.Stranger]: [
        'Shadow', 'Phantom', 'Specter', 'Ghost', 'Wraith',
        'Shade', 'Whisper', 'Veil', 'Mirage', 'Echo'
    ]
};

const usedNames = new Set<string>();

// ============================================
// HERO GENERATION
// ============================================

export function generateHeroName(heroClass: HeroClass): string {
    const names = heroNames[heroClass];
    const available = names.filter(n => !usedNames.has(n));

    if (available.length === 0) {
        // All names used, add a number suffix
        const baseName = names[Math.floor(Math.random() * names.length)];
        let suffix = 2;
        while (usedNames.has(`${baseName} ${suffix}`)) {
            suffix++;
        }
        const name = `${baseName} ${suffix}`;
        usedNames.add(name);
        return name;
    }

    const name = available[Math.floor(Math.random() * available.length)];
    usedNames.add(name);
    return name;
}

export function createHero(heroClass: HeroClass): Hero {
    const name = generateHeroName(heroClass);
    const starterCards = getStarterDeck(heroClass);

    // Convert cards to card instances
    const deck: CardInstance[] = starterCards.map(card => ({
        ...card,
        instanceId: generateId(),
        ownerId: '', // Will be set after hero creation
        appliedUpgrades: []
    }));

    const heroId = generateId();

    // Update ownerId on all cards
    deck.forEach(card => {
        card.ownerId = heroId;
    });

    // Base HP varies by class
    const baseHp: Record<HeroClass, number> = {
        [HeroClass.Brute]: 90,
        [HeroClass.Blaster]: 65,
        [HeroClass.Tinker]: 70,
        [HeroClass.Thinker]: 60,
        [HeroClass.Mover]: 70,
        [HeroClass.Stranger]: 65
    };

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
        resistances: {
            [Faction.Cult]: 0,
            [Faction.Undead]: 0,
            [Faction.Swarm]: 0
        },
        isAvailable: true,
        daysUnavailable: 0,
        statusEffects: []
    };
}

export function createStartingRoster(): Hero[] {
    // Start with 5 heroes, one of each class except one duplicate
    const roster: Hero[] = [
        createHero(HeroClass.Brute),
        createHero(HeroClass.Blaster),
        createHero(HeroClass.Tinker),
        createHero(HeroClass.Thinker),
        createHero(HeroClass.Mover)
    ];

    return roster;
}

export function getAvailableHeroes(roster: Hero[]): Hero[] {
    return roster.filter(h => h.isAvailable && h.currentHp > 0);
}

export function healHero(hero: Hero, amount: number): void {
    hero.currentHp = Math.min(hero.maxHp, hero.currentHp + amount);
}

export function damageHero(hero: Hero, amount: number): void {
    hero.currentHp = Math.max(0, hero.currentHp - amount);
}

export function addStress(hero: Hero, amount: number): boolean {
    hero.stress += amount;

    // Check for breakdown
    if (hero.stress >= hero.maxStress) {
        hero.stress = 0; // Reset stress after breakdown
        return true; // Breakdown occurred
    }

    return false;
}

export function reduceStress(hero: Hero, amount: number): void {
    hero.stress = Math.max(0, hero.stress - amount);
}

export function addCardToHero(hero: Hero, card: CardInstance): void {
    card.ownerId = hero.id;
    hero.deck.push(card);
}

export function getHeroThreat(hero: Hero): number {
    // Base threat based on class
    const baseThreat: Record<HeroClass, number> = {
        [HeroClass.Brute]: 3,
        [HeroClass.Blaster]: 4,
        [HeroClass.Tinker]: 2,
        [HeroClass.Thinker]: 2,
        [HeroClass.Mover]: 2,
        [HeroClass.Stranger]: 1
    };

    return baseThreat[hero.heroClass];
}

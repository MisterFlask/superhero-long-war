import {
    GameState, GamePhase, Faction, Hero, Mission, CombatState,
    CombatPhase, BazaarOffering, CardInstance, generateId, HeroClass
} from '../models/types.js';
import { createInitialTerritories, generateDefenseMission, generateStoryMission,
         generateCaptureMission, getFrontlineTerritories, getCapturableTerritories,
         calculateIncome, transferTerritory, getPlayerTerritories } from '../strategic/map.js';
import { createStartingRoster, createHero, addStress } from '../data/heroes.js';
import { initializeCombat, startPlayerTurn, playCard, endPlayerTurn,
         executeEnemyTurn, initiateRetreat, useBaselineAbility } from '../combat/combat.js';
import { getEnemiesForEncounter } from '../data/enemies.js';
import { getCardsByRarity, allCardsByClass } from '../data/cards.js';
import { CardRarity } from '../models/types.js';

// ============================================
// GAME STATE MANAGEMENT
// ============================================

export function createNewGame(): GameState {
    const territories = createInitialTerritories();
    const roster = createStartingRoster();

    // Randomly select which faction's story starts
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
        factionHeat: {
            [Faction.Cult]: 30,
            [Faction.Undead]: 30,
            [Faction.Swarm]: 30
        },
        doomCounter: 0,
        maxDoom: 10,
        currentAct: 1,
        actFaction: startingFaction,
        bazaarOfferings: [],
        completedStoryMissions: []
    };
}

// ============================================
// DAY PROGRESSION
// ============================================

export function advanceDay(state: GameState): GameState {
    const newState = { ...state };
    newState.day++;

    // Collect income
    newState.money += calculateIncome(newState.territories);

    // Reduce mission timers
    newState.missions = newState.missions.map(m => ({
        ...m,
        turnsRemaining: m.turnsRemaining - 1
    }));

    // Check for expired missions
    const expiredMissions = newState.missions.filter(m => m.turnsRemaining <= 0);
    expiredMissions.forEach(m => {
        handleExpiredMission(newState, m);
    });
    newState.missions = newState.missions.filter(m => m.turnsRemaining > 0);

    // Update hero availability
    newState.roster.forEach(hero => {
        if (!hero.isAvailable && hero.daysUnavailable > 0) {
            hero.daysUnavailable--;
            if (hero.daysUnavailable <= 0) {
                hero.isAvailable = true;
            }
        }
    });

    // Recover some stress for all heroes
    newState.roster.forEach(hero => {
        const recovery = hasSanctuary(newState) ? 15 : 10;
        hero.stress = Math.max(0, hero.stress - recovery);
    });

    // Generate new missions based on heat
    generateNewMissions(newState);

    // Refresh bazaar weekly
    if (newState.day % 7 === 0) {
        newState.bazaarOfferings = generateBazaarOfferings(newState);
    }

    // Heat decay
    Object.keys(newState.factionHeat).forEach(faction => {
        const f = faction as Faction;
        newState.factionHeat[f] = Math.max(0, newState.factionHeat[f] - 2);
    });

    return newState;
}

function handleExpiredMission(state: GameState, mission: Mission): void {
    switch (mission.type) {
        case 'Defense':
            // Lose the territory
            const territory = state.territories.find(t => t.id === mission.territoryId);
            if (territory) {
                territory.controlledBy = mission.faction;
            }
            break;

        case 'Story':
            // Advance doom counter
            state.doomCounter += 2;
            if (state.doomCounter >= state.maxDoom) {
                state.phase = GamePhase.GameOver;
            }
            break;

        case 'Capture':
            // Nothing happens, opportunity lost
            break;
    }
}

function generateNewMissions(state: GameState): void {
    // Check each faction for attacks based on heat
    Object.entries(state.factionHeat).forEach(([faction, heat]) => {
        const f = faction as Faction;

        // Chance to attack based on heat
        if (Math.random() * 100 < heat) {
            const frontlines = getFrontlineTerritories(state.territories);
            const validTargets = frontlines.filter(t =>
                t.adjacentTo.some(adjId => {
                    const adj = state.territories.find(t => t.id === adjId);
                    return adj && adj.controlledBy === f;
                })
            );

            if (validTargets.length > 0) {
                const target = validTargets[Math.floor(Math.random() * validTargets.length)];
                // Don't create duplicate defense missions
                if (!state.missions.some(m => m.territoryId === target.id && m.type === 'Defense')) {
                    state.missions.push(generateDefenseMission(target, f, state.currentAct));
                }
            }
        }
    });

    // Ensure story mission exists for current act
    const hasStoryMission = state.missions.some(m =>
        m.isStory && m.faction === state.actFaction
    );

    if (!hasStoryMission && state.completedStoryMissions.filter(
        id => id.startsWith(state.actFaction)
    ).length < 3) {
        const storyIndex = state.completedStoryMissions.filter(
            id => id.startsWith(state.actFaction)
        ).length;
        state.missions.push(generateStoryMission(state.actFaction, state.currentAct, storyIndex));
    }

    // Occasionally generate capture missions
    if (Math.random() < 0.2) {
        const capturable = getCapturableTerritories(state.territories);
        if (capturable.length > 0) {
            const target = capturable[Math.floor(Math.random() * capturable.length)];
            if (!state.missions.some(m => m.territoryId === target.id)) {
                state.missions.push(generateCaptureMission(target, state.currentAct));
            }
        }
    }
}

function hasSanctuary(state: GameState): boolean {
    return state.territories.some(t =>
        t.controlledBy === 'player' && t.landmarkType === 'sanctuary'
    );
}

// ============================================
// MISSION MANAGEMENT
// ============================================

export function startMission(state: GameState, missionId: string, heroIds: string[]): GameState {
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || heroIds.length !== 3) return state;

    const heroes = heroIds.map(id => state.roster.find(h => h.id === id)).filter(Boolean) as Hero[];
    if (heroes.length !== 3 || heroes.some(h => !h.isAvailable || h.currentHp <= 0)) {
        return state;
    }

    const newState = { ...state };
    newState.activeMission = mission;
    newState.currentCombatIndex = 0;
    newState.phase = GamePhase.Combat;

    // Mark heroes as unavailable
    heroes.forEach(h => {
        const hero = newState.roster.find(rh => rh.id === h.id)!;
        hero.isAvailable = false;
    });

    // Start first combat
    const enemies = getEnemiesForEncounter(
        mission.faction,
        mission.difficulty,
        newState.currentCombatIndex === mission.combatCount - 1
    );

    newState.currentCombat = initializeCombat(heroes, enemies);
    newState.currentCombat = startPlayerTurn(newState.currentCombat);

    return newState;
}

export function handleCombatAction(
    state: GameState,
    action: 'playCard' | 'endTurn' | 'retreat' | 'useAbility',
    payload?: any
): GameState {
    if (!state.currentCombat || state.phase !== GamePhase.Combat) {
        return state;
    }

    let newCombat: CombatState;

    switch (action) {
        case 'playCard':
            newCombat = playCard(state.currentCombat, payload.card, payload.targetId);
            break;

        case 'endTurn':
            newCombat = endPlayerTurn(state.currentCombat);
            newCombat = executeEnemyTurn(newCombat);
            break;

        case 'retreat':
            newCombat = initiateRetreat(state.currentCombat);
            break;

        case 'useAbility':
            newCombat = useBaselineAbility(state.currentCombat, payload.resource, payload.targetId);
            break;

        default:
            return state;
    }

    const newState = { ...state, currentCombat: newCombat };

    // Check for combat end
    if (newCombat.phase === CombatPhase.Victory) {
        return handleCombatVictory(newState);
    } else if (newCombat.phase === CombatPhase.Defeat) {
        return handleCombatDefeat(newState);
    } else if (newCombat.phase === CombatPhase.Retreat) {
        return handleCombatRetreat(newState);
    }

    return newState;
}

function handleCombatVictory(state: GameState): GameState {
    const newState = { ...state };
    const mission = newState.activeMission!;
    const combat = newState.currentCombat!;

    // Update heroes with combat results
    combat.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            rosterHero.currentHp = combatHero.currentHp;
            rosterHero.statusEffects = [];
        }
    });

    newState.currentCombatIndex++;

    // Check if more combats in mission
    if (newState.currentCombatIndex < mission.combatCount) {
        // Start next combat
        const aliveHeroes = combat.heroes.filter(h => h.currentHp > 0);
        if (aliveHeroes.length === 0) {
            return handleMissionFailure(newState);
        }

        const enemies = getEnemiesForEncounter(
            mission.faction,
            mission.difficulty,
            newState.currentCombatIndex === mission.combatCount - 1
        );

        newState.currentCombat = initializeCombat(aliveHeroes, enemies);
        newState.currentCombat = startPlayerTurn(newState.currentCombat);
        return newState;
    }

    // Mission complete!
    return handleMissionSuccess(newState);
}

function handleMissionSuccess(state: GameState): GameState {
    const newState = { ...state };
    const mission = newState.activeMission!;
    const combat = newState.currentCombat!;

    // Award rewards
    newState.money += mission.rewards.money;

    // Increase faction heat
    newState.factionHeat[mission.faction] += 15;

    // Build resistance for participating heroes
    combat.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            rosterHero.resistances[mission.faction] += 5;
            rosterHero.isAvailable = true;

            // Add stress for deployment
            addStress(rosterHero, 10);
        }
    });

    // Handle territory changes
    if (mission.type === 'Defense') {
        // Territory remains player-controlled (do nothing)
        newState.factionHeat[mission.faction] -= 10; // Heat reduction for successful defense
    } else if (mission.type === 'Capture') {
        transferTerritory(newState.territories, mission.territoryId, 'player');
    } else if (mission.type === 'Story') {
        newState.completedStoryMissions.push(`${mission.faction}_${newState.currentAct}`);

        // Check for act progression
        const storyCount = newState.completedStoryMissions.filter(
            id => id.startsWith(mission.faction)
        ).length;

        if (storyCount >= 3) {
            progressAct(newState);
        }
    }

    // Remove mission
    newState.missions = newState.missions.filter(m => m.id !== mission.id);

    // Move to post-combat for rewards
    newState.phase = GamePhase.PostCombat;

    return newState;
}

function handleMissionFailure(state: GameState): GameState {
    const newState = { ...state };
    const mission = newState.activeMission!;

    if (mission.type === 'Defense') {
        // Lose territory
        transferTerritory(newState.territories, mission.territoryId, mission.faction);
    } else if (mission.type === 'Story') {
        // Advance doom
        newState.doomCounter++;
        if (newState.doomCounter >= newState.maxDoom) {
            newState.phase = GamePhase.GameOver;
            return newState;
        }
    }

    // Mark dead heroes
    newState.currentCombat?.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero && combatHero.currentHp <= 0) {
            // Permadeath - remove from roster
            newState.roster = newState.roster.filter(h => h.id !== rosterHero.id);
        } else if (rosterHero) {
            rosterHero.currentHp = combatHero.currentHp;
            rosterHero.isAvailable = true;
            addStress(rosterHero, 30); // High stress from failed mission
        }
    });

    newState.missions = newState.missions.filter(m => m.id !== mission.id);
    newState.activeMission = null;
    newState.currentCombat = null;
    newState.phase = GamePhase.Strategic;

    return newState;
}

function handleCombatDefeat(state: GameState): GameState {
    return handleMissionFailure(state);
}

function handleCombatRetreat(state: GameState): GameState {
    const newState = { ...state };

    // Update heroes - survivors take stress
    newState.currentCombat?.heroes.forEach(combatHero => {
        const rosterHero = newState.roster.find(h => h.id === combatHero.id);
        if (rosterHero) {
            if (combatHero.currentHp <= 0) {
                // Died during retreat
                newState.roster = newState.roster.filter(h => h.id !== rosterHero.id);
            } else {
                rosterHero.currentHp = combatHero.currentHp;
                rosterHero.isAvailable = true;
                addStress(rosterHero, 20);
            }
        }
    });

    // Mission remains active but we abort
    newState.activeMission = null;
    newState.currentCombat = null;
    newState.phase = GamePhase.Strategic;

    return newState;
}

function progressAct(state: GameState): void {
    state.currentAct++;

    if (state.currentAct > 3) {
        // Game complete!
        state.phase = GamePhase.Victory;
        return;
    }

    // Rotate to next faction
    const factions = [Faction.Cult, Faction.Undead, Faction.Swarm];
    const currentIndex = factions.indexOf(state.actFaction);
    state.actFaction = factions[(currentIndex + 1) % 3];

    // Reset doom for new act
    state.doomCounter = 0;

    // Increase all heat slightly
    Object.keys(state.factionHeat).forEach(f => {
        state.factionHeat[f as Faction] += 10;
    });
}

// ============================================
// POST COMBAT REWARDS
// ============================================

export function selectCardReward(state: GameState, heroId: string, cardId: string): GameState {
    const newState = { ...state };
    const hero = newState.roster.find(h => h.id === heroId);
    if (!hero) return state;

    const classCards = allCardsByClass[hero.heroClass];
    const card = classCards.find(c => c.id === cardId);
    if (!card) return state;

    const cardInstance: CardInstance = {
        ...card,
        instanceId: generateId(),
        ownerId: heroId,
        appliedUpgrades: []
    };

    hero.deck.push(cardInstance);
    return newState;
}

export function finishPostCombat(state: GameState): GameState {
    const newState = { ...state };
    newState.activeMission = null;
    newState.currentCombat = null;
    newState.phase = GamePhase.Strategic;
    return newState;
}

// ============================================
// BAZAAR
// ============================================

function generateBazaarOfferings(state: GameState): BazaarOffering[] {
    const offerings: BazaarOffering[] = [];

    // 2-3 hero offerings
    const heroCount = 2 + Math.floor(Math.random() * 2);
    const classes = Object.values(HeroClass);

    for (let i = 0; i < heroCount; i++) {
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

    // 2 training opportunities
    for (let i = 0; i < 2; i++) {
        offerings.push({
            id: generateId(),
            type: 'training',
            trainingBonus: ['Card Upgrade', 'Stat Boost', 'Skill Training'][Math.floor(Math.random() * 3)],
            cost: 150 + state.currentAct * 30,
            description: 'Train a hero to improve their abilities'
        });
    }

    return offerings;
}

export function purchaseBazaarOffering(state: GameState, offeringId: string): GameState {
    const offering = state.bazaarOfferings.find(o => o.id === offeringId);
    if (!offering || state.money < offering.cost) return state;

    const newState = { ...state };
    newState.money -= offering.cost;

    if (offering.type === 'hero' && offering.hero) {
        if (newState.roster.length < 12) {
            newState.roster.push(offering.hero);
        }
    }

    // Remove offering
    newState.bazaarOfferings = newState.bazaarOfferings.filter(o => o.id !== offeringId);

    return newState;
}

export function openBazaar(state: GameState): GameState {
    if (state.bazaarOfferings.length === 0) {
        return {
            ...state,
            bazaarOfferings: generateBazaarOfferings(state),
            phase: GamePhase.Bazaar
        };
    }
    return { ...state, phase: GamePhase.Bazaar };
}

export function closeBazaar(state: GameState): GameState {
    return { ...state, phase: GamePhase.Strategic };
}

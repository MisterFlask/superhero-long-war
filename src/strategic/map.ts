import {
    Territory, Mission, MissionType, Faction, MissionRewards, generateId
} from '../models/types';

// ============================================
// TERRITORY DEFINITIONS
// ============================================

export function createInitialTerritories(): Territory[] {
    return [
        // Player starting territories (Midwest)
        {
            id: 'chicago',
            name: 'Chicago',
            controlledBy: 'player',
            adjacentTo: ['detroit', 'indianapolis', 'milwaukee', 'st_louis'],
            isLandmark: true,
            landmarkType: 'foundry',
            moneyGeneration: 150,
            specialBonus: 'Industrial hub: +50% money generation'
        },
        {
            id: 'indianapolis',
            name: 'Indianapolis',
            controlledBy: 'player',
            adjacentTo: ['chicago', 'cincinnati', 'st_louis', 'louisville'],
            isLandmark: false,
            moneyGeneration: 80
        },
        {
            id: 'detroit',
            name: 'Detroit',
            controlledBy: 'player',
            adjacentTo: ['chicago', 'cleveland', 'toledo'],
            isLandmark: true,
            landmarkType: 'academy',
            moneyGeneration: 100,
            specialBonus: 'Training Academy: -25% training time'
        },
        {
            id: 'milwaukee',
            name: 'Milwaukee',
            controlledBy: 'player',
            adjacentTo: ['chicago', 'minneapolis', 'madison'],
            isLandmark: false,
            moneyGeneration: 70
        },
        {
            id: 'st_louis',
            name: 'St. Louis',
            controlledBy: 'player',
            adjacentTo: ['chicago', 'indianapolis', 'kansas_city', 'memphis'],
            isLandmark: true,
            landmarkType: 'sanctuary',
            moneyGeneration: 90,
            specialBonus: 'Recovery Sanctuary: +50% stress recovery'
        },

        // Eastern territories (Undead)
        {
            id: 'cleveland',
            name: 'Cleveland',
            controlledBy: Faction.Undead,
            adjacentTo: ['detroit', 'pittsburgh', 'columbus'],
            isLandmark: false,
            moneyGeneration: 80
        },
        {
            id: 'pittsburgh',
            name: 'Pittsburgh',
            controlledBy: Faction.Undead,
            adjacentTo: ['cleveland', 'philadelphia', 'baltimore'],
            isLandmark: false,
            moneyGeneration: 90
        },
        {
            id: 'cincinnati',
            name: 'Cincinnati',
            controlledBy: Faction.Undead,
            adjacentTo: ['indianapolis', 'columbus', 'louisville'],
            isLandmark: false,
            moneyGeneration: 75
        },
        {
            id: 'columbus',
            name: 'Columbus',
            controlledBy: Faction.Undead,
            adjacentTo: ['cleveland', 'cincinnati', 'pittsburgh'],
            isLandmark: false,
            moneyGeneration: 85
        },

        // Southern territories (Cult)
        {
            id: 'louisville',
            name: 'Louisville',
            controlledBy: Faction.Cult,
            adjacentTo: ['indianapolis', 'cincinnati', 'nashville'],
            isLandmark: false,
            moneyGeneration: 70
        },
        {
            id: 'nashville',
            name: 'Nashville',
            controlledBy: Faction.Cult,
            adjacentTo: ['louisville', 'memphis', 'atlanta'],
            isLandmark: false,
            moneyGeneration: 80
        },
        {
            id: 'memphis',
            name: 'Memphis',
            controlledBy: Faction.Cult,
            adjacentTo: ['st_louis', 'nashville', 'little_rock', 'new_orleans'],
            isLandmark: false,
            moneyGeneration: 75
        },
        {
            id: 'atlanta',
            name: 'Atlanta',
            controlledBy: Faction.Cult,
            adjacentTo: ['nashville', 'birmingham', 'charleston'],
            isLandmark: false,
            moneyGeneration: 100
        },

        // Western territories (Swarm)
        {
            id: 'minneapolis',
            name: 'Minneapolis',
            controlledBy: Faction.Swarm,
            adjacentTo: ['milwaukee', 'des_moines', 'sioux_falls'],
            isLandmark: false,
            moneyGeneration: 85
        },
        {
            id: 'kansas_city',
            name: 'Kansas City',
            controlledBy: Faction.Swarm,
            adjacentTo: ['st_louis', 'des_moines', 'omaha', 'denver'],
            isLandmark: false,
            moneyGeneration: 80
        },
        {
            id: 'des_moines',
            name: 'Des Moines',
            controlledBy: Faction.Swarm,
            adjacentTo: ['minneapolis', 'kansas_city', 'omaha'],
            isLandmark: false,
            moneyGeneration: 60
        },
        {
            id: 'omaha',
            name: 'Omaha',
            controlledBy: Faction.Swarm,
            adjacentTo: ['des_moines', 'kansas_city', 'denver'],
            isLandmark: true,
            landmarkType: 'listeningPost',
            moneyGeneration: 70,
            specialBonus: 'Listening Post: +1 day warning for attacks'
        },

        // Neutral territories (contested zones)
        {
            id: 'toledo',
            name: 'Toledo',
            controlledBy: 'neutral',
            adjacentTo: ['detroit', 'cleveland'],
            isLandmark: false,
            moneyGeneration: 50
        },
        {
            id: 'madison',
            name: 'Madison',
            controlledBy: 'neutral',
            adjacentTo: ['milwaukee', 'minneapolis'],
            isLandmark: false,
            moneyGeneration: 55
        }
    ];
}

// ============================================
// MISSION GENERATION
// ============================================

export function generateDefenseMission(
    territory: Territory,
    attackingFaction: Faction,
    difficulty: number
): Mission {
    return {
        id: generateId(),
        type: MissionType.Defense,
        faction: attackingFaction,
        territoryId: territory.id,
        difficulty,
        combatCount: 1,
        turnsRemaining: 3 + Math.floor(Math.random() * 2), // 3-4 turns
        rewards: {
            money: 100 + difficulty * 25,
            cardRewards: 1
        },
        description: `Defend ${territory.name} from ${attackingFaction} attack`,
        isStory: false
    };
}

export function generateStoryMission(
    faction: Faction,
    act: number,
    storyIndex: number
): Mission {
    const storyDetails = getStoryMissionDetails(faction, act, storyIndex);

    return {
        id: generateId(),
        type: MissionType.Story,
        faction,
        territoryId: storyDetails.territoryId,
        difficulty: act * 2 + storyIndex,
        combatCount: 2 + (storyIndex > 1 ? 1 : 0), // 2-3 combats
        turnsRemaining: 5 + act, // More time for story missions
        rewards: {
            money: 200 + act * 100,
            cardRewards: 2,
            specialReward: storyDetails.specialReward
        },
        description: storyDetails.description,
        isStory: true
    };
}

export function generateCaptureMission(
    territory: Territory,
    difficulty: number
): Mission {
    return {
        id: generateId(),
        type: MissionType.Capture,
        faction: territory.controlledBy as Faction,
        territoryId: territory.id,
        difficulty,
        combatCount: 2,
        turnsRemaining: 4,
        rewards: {
            money: 150 + difficulty * 30,
            cardRewards: 1,
            specialReward: `Control of ${territory.name}`
        },
        description: `Capture ${territory.name} from ${territory.controlledBy}`,
        isStory: false
    };
}

function getStoryMissionDetails(faction: Faction, act: number, storyIndex: number): {
    description: string;
    territoryId: string;
    specialReward?: string;
} {
    const storyMissions: Record<Faction, { description: string; territoryId: string; specialReward?: string }[]> = {
        [Faction.Cult]: [
            {
                description: 'Disrupt the Cult\'s ritual gathering',
                territoryId: 'louisville',
                specialReward: 'Mental Fortitude Training'
            },
            {
                description: 'Destroy the Veil Anchor',
                territoryId: 'nashville',
                specialReward: 'Rare Artifact'
            },
            {
                description: 'Confront the High Priest',
                territoryId: 'atlanta',
                specialReward: 'Veil Fragment'
            }
        ],
        [Faction.Undead]: [
            {
                description: 'Cleanse the Necropolis outskirts',
                territoryId: 'cleveland',
                specialReward: 'Death Ward Training'
            },
            {
                description: 'Destroy the Phylactery Cache',
                territoryId: 'pittsburgh',
                specialReward: 'Soul Gem'
            },
            {
                description: 'Defeat the Lich King',
                territoryId: 'columbus',
                specialReward: 'Crown of the Dead'
            }
        ],
        [Faction.Swarm]: [
            {
                description: 'Burn the breeding grounds',
                territoryId: 'minneapolis',
                specialReward: 'Toxin Resistance Training'
            },
            {
                description: 'Destroy the Hive Node',
                territoryId: 'kansas_city',
                specialReward: 'Chitin Armor'
            },
            {
                description: 'Assassinate the Hive Queen',
                territoryId: 'omaha',
                specialReward: 'Swarm Control Device'
            }
        ]
    };

    const missions = storyMissions[faction];
    const index = Math.min(storyIndex, missions.length - 1);
    return missions[index];
}

// ============================================
// TERRITORY MANAGEMENT
// ============================================

export function getPlayerTerritories(territories: Territory[]): Territory[] {
    return territories.filter(t => t.controlledBy === 'player');
}

export function getFrontlineTerritories(territories: Territory[]): Territory[] {
    const playerTerritories = getPlayerTerritories(territories);
    return playerTerritories.filter(pt =>
        pt.adjacentTo.some(adjId => {
            const adj = territories.find(t => t.id === adjId);
            return adj && adj.controlledBy !== 'player';
        })
    );
}

export function getCapturableTerritories(territories: Territory[]): Territory[] {
    const playerTerritories = getPlayerTerritories(territories);
    const adjacentIds = new Set<string>();

    playerTerritories.forEach(pt => {
        pt.adjacentTo.forEach(id => adjacentIds.add(id));
    });

    return territories.filter(t =>
        adjacentIds.has(t.id) &&
        t.controlledBy !== 'player' &&
        t.controlledBy !== 'neutral'
    );
}

export function calculateIncome(territories: Territory[]): number {
    return getPlayerTerritories(territories).reduce((sum, t) => {
        let income = t.moneyGeneration;
        if (t.landmarkType === 'foundry') {
            income = Math.floor(income * 1.5);
        }
        return sum + income;
    }, 0);
}

export function transferTerritory(
    territories: Territory[],
    territoryId: string,
    newOwner: 'player' | Faction
): void {
    const territory = territories.find(t => t.id === territoryId);
    if (territory) {
        territory.controlledBy = newOwner;
    }
}

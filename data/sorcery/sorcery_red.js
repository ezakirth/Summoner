sorcery.red = {
        engulfing_flames: {
                color: "red",
                type: "sorcery",
                name: "Engulfing Flames",
                id: "engulfing_flames",
                target: "closestEnemy",
                life: -1,
                power: 0,
                cost: 1,
                castTime: 1000,
                abilities: Array("noregeneration"),
                // button;
                icon: "♨️",
        },

        reckless_charge: {
                color: "red",
                type: "sorcery",
                name: "Reckless Charge",
                id: "reckless_charge",
                target: "closestFriendly",
                life: 0,
                power: 3,
                cost: 1,
                castTime: 1000,
                abilities: Array("haste", "forceattack"),
                // button;
                icon: "🍁",
        },

        scorching_missile: {
                color: "red",
                type: "sorcery",
                name: "Scorching Missile",
                id: "scorching_missile",
                target: "enemyHero",
                life: -4,
                power: 0,
                cost: 4,
                castTime: 1000,
                abilities: Array(),
                // button;
                icon: "🍁",
        },

        threaten: {
                color: "red",
                type: "sorcery",
                name: "Threaten",
                id: "threaten",
                target: "closestEnemyMinion",
                life: 0,
                power: 0,
                cost: 4,
                castTime: 1000,
                abilities: Array("betray", "haste", "forceattack"),
                // button;
                icon: "🍁",
        },

        inferno: {
                color: "red",
                type: "sorcery",
                name: "Inferno",
                id: "inferno",
                target: "all",
                life: -6,
                power: 0,
                cost: 6,
                castTime: 1000,
                abilities: Array(),
                // button;
                icon: "🍁",
        }
};
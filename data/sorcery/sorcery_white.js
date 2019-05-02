sorcery.white = {
        guided_strike: {
                color: "white",
                type: "sorcery",
                name: "Guided Strike",
                id: "guided_strike",
                target: "closestFriendly",
                life: 0,
                power: 1,
                cost: 1,
                castTime: 1000,
                abilities: ["firststrike"],
                // button;
                icon: "🍀",
        },

        warriors_honor: {
                color: "white",
                type: "sorcery",
                name: "Warrior's Honor",
                id: "warriors_honor",
                target: "allFriendlyMinions",
                life: 1,
                power: 1,
                cost: 2,
                castTime: 2000,
                abilities: [],
                // button;
                icon: "🍃",
        },

        spiritualize: {
                color: "white",
                type: "sorcery",
                name: "Spiritualize",
                id: "spiritualize",
                target: "closestFriendly",
                life: 0,
                power: 0,
                cost: 2,
                castTime: 1000,
                abilities: ["lifelink"],
                // button;
                icon: "❤️",
        },

        demistify: {
                color: "white",
                type: "sorcery",
                name: "Demistify",
                id: "demistify",
                target: "enemyHero",
                life: 0,
                power: 0,
                cost: 3,
                castTime: 1000,
                abilities: ["demistify"],
                // button;
                icon: "🍃",
        },

        wrath_of_god: {
                color: "white",
                type: "sorcery",
                name: "Wrath of God",
                id: "wrath_of_god",
                target: "allMinions",
                life: 0,
                power: 0,
                cost: 5,
                castTime: 3000,
                abilities: ["destroy"],
                // button;
                icon: "🍃",
        }
};
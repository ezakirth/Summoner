sorcery.green = {
        giant_growth: {
                color: "green",
                type: "sorcery",
                name: "Giant Growth",
                id: "giant_growth",
                target: "closestFriendly",
                life: 2,
                power: 2,
                cost: 2,
                castTime: 1000,
                abilities: [],
                // button;
                icon: "🍀",
        },

        run_wild: {
                color: "green",
                type: "sorcery",
                name: "Run Wild",
                id: "run_wild",
                target: "closestFriendly",
                life: 0,
                power: 0,
                cost: 1,
                castTime: 1000,
                abilities: ["trample", "regeneration", "forceattack"],
                // button;
                icon: "🍃",
        },

        untamed_wilds: {
                color: "green",
                type: "sorcery",
                name: "Untamed Wilds",
                id: "untamed_wilds",
                target: "friendlyHero",
                life: 0,
                power: 0,
                cost: 3,
                castTime: 1000,
                abilities: ["makecrystal"],
                // button;
                icon: "🍃",
        },

        tranquility: {
                color: "green",
                type: "sorcery",
                name: "Tranquility",
                id: "tranquility",
                target: "allHeroes",
                life: 0,
                power: 0,
                cost: 4,
                castTime: 1000,
                abilities: ["tranquility"],
                // button;
                icon: "🍃",
        },

        overrun: {
                color: "green",
                type: "sorcery",
                name: "Overrun",
                id: "overrun",
                target: "allFriendlyMinions",
                life: 3,
                power: 3,
                cost: 6,
                castTime: 1000,
                abilities: ["trample", "forceattack"],
                // button;
                icon: "🍃",
        }
};
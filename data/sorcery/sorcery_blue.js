sorcery.blue = {
        unsummon: {
                color: "blue",
                type: "sorcery",
                name: "Unsummon",
                id: "unsummon",
                target: "closestEnemyMinion",
                life: 0,
                power: 0,
                cost: 1,
                castTime: 1000,
                abilities: new Array("unsummon"),
                // button;
                icon: "💨",
        },

        deluge: {
                color: "blue",
                type: "sorcery",
                name: "Deluge",
                id: "deluge",
                target: "allMinions",
                life: 0,
                power: 0,
                cost: 3,
                castTime: 1000,
                abilities: new Array("freeze"),
                // button;
                icon: "❄️",
        },

        mages_guile: {
                color: "blue",
                type: "sorcery",
                name: "Mage's Guile",
                id: "mages_guile",
                target: "closestFriendly",
                life: 0,
                power: 0,
                cost: 1,
                castTime: 1000,
                abilities: new Array("spellproof"),
                // button;
                icon: "💨",
        },

        counterspell: {
                color: "blue",
                type: "sorcery",
                name: "Counterspell",
                id: "counterspell",
                target: "enemyHero",
                life: 0,
                power: 0,
                cost: 2,
                castTime: 1000,
                abilities: new Array("counterspell"),
                // button;
                icon: "💨",
        },

        spelljack: {
                color: "blue",
                type: "sorcery",
                name: "Spelljack",
                id: "spelljack",
                target: "enemyHero",
                life: 0,
                power: 0,
                cost: 4,
                castTime: 2000,
                abilities: new Array("spelljack"),
                // button;
                icon: "💨",
        },

        mana_short: {
                color: "blue",
                type: "sorcery",
                name: "Mana Short",
                id: "mana_short",
                target: "enemyHero",
                life: 0,
                power: 0,
                cost: 5,
                castTime: 2000,
                abilities: new Array("manashort"),
                // button;
                icon: "💨",
        },

        clone: {
                color: "blue",
                type: "sorcery",
                name: "Clone",
                id: "clone",
                target: "closestMinion",
                life: 0,
                power: 0,
                cost: 5,
                castTime: 2000,
                abilities: new Array("clone"),
                // button;
                icon: "💨",
        }
};
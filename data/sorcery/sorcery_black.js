sorcery.black = {
    vicious_hunger : {
            color : "black",
            type : "sorcery",
            name : "Vicious Hunger",
            id : "vicious_hunger",
            target : "closestEnemyMinion",
            life : -2,
            power : 0,
            cost : 4,
            castTime : 1,
            abilities : Array( "leech" ),
            // button;
            icon : "🍀",
    },
    
    infest : {
            color : "black",
            type : "sorcery",
            name : "Infest",
            id : "infest",
            target : "allMinions",
            life : -2,
            power : -2,
            cost : 4,
            castTime : 2,
            abilities : Array(),
            // button;
            icon : "🍃",
    },

    dark_banishing : {
            color : "black",
            type : "sorcery",
            name : "Dark Banishing",
            id : "dark_banishing",
            target : "closestEnemyMinion",
            life : 0,
            power : 0,
            cost : 5,
            castTime : 2,
            abilities : Array( "destroy" ),
            // button;
            icon : "🍃",
    },

    hellfire : {
            color : "black",
            type : "sorcery",
            name : "Hellfire",
            id : "hellfire",
            target : "allMinions",
            life : 0,
            power : 0,
            cost : 6,
            castTime : 2,
            abilities : Array( "destroy", "feedback" ),
            // button;
            icon : "🍃",
    },

    soul_feast : {
            color : "black",
            type : "sorcery",
            name : "Soul Feast",
            id : "soul_feast",
            target : "enemyHero",
            life : -4,
            power : 0,
            cost : 7,
            castTime : 2,
            abilities : Array( "leech" ),
            // button;
            icon : "🍃",
    }
};

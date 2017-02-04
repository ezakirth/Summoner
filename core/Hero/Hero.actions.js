/**
 * @desc Makes the player attack
 * @param void
 * @return void
 */
Hero.prototype.attack = function ()
{
    // attack only if no other actions are happening
    if (this.activeTimer() === false)
    {
        this.status = "attack";
        this.timers.push(this.attackTimer);
    }
}


/**
 * @desc Initiates a spellcast for the player (either a creature, a sorcery or an enchantment)
 * @param creature/enchantment/sorcery:action, AIaction:AIaction
 * @return void
 */
Hero.prototype.doAction = function (action, AIaction)
{
    // Checks if cast is from human or AI
    this.AIaction = AIaction || this.AIaction;

    // Only cast the spell player has the mana and no other actions are happening
    if (this.activeTimer() === false && action.cost <= this.mana)
    {
        if (this.showGui)
            this.gui.setPage("home");

        // prevent casting a creature if already at max
        if (!(action.type == "creatures" && this.summons.length >= 5))
        {
            this.timers.push(new Timer(action.castTime, action.type));
            this.mana -= action.cost;
            this.castSpell = action;
        }
    }
}


/**
 * @desc Summons a creature for the player
 * @param void
 * @return void
 */
Hero.prototype.summon = function (creature)
{
    if (this.summons.length < 5)
    {
        var minion = new Minion(creature, this);
        if (this.enchantments.length > 0)
        {
            var enchant = this.enchantments[0];
            minion.power = minion.power + enchant.power;
            minion.life = minion.life + enchant.life;
            minion.updateStats();
        }
        this.summons.push(minion);
    }
}


/**
 * @desc Casts a spell for the player (sorcery or enchantment)
 * @param void
 * @return void
 */
Hero.prototype.resolveSpell = function (spell) {
    if (spell.type == "enchantments") {
        this.enchantments.push(spell);
    } else {
        // Finds targets for the spell (closestEnemyMinion, allMinions, etc.)
        var targets = this[spell.target](this);

        targets.forEach((target) => {

            if (target.spellburn) {
                this.life = this.life - 3;
            }

            if (target.type == "creatures") {
                spell.abilities.forEach((ability) => {
                    target.tempAbilities.push(ability);
                });
                target.checkAbilities();
            }

            target.life = target.life + spell.life;
            target.power = target.power + spell.power;
            target.updateStats();


            spell.abilities.forEach((ability) => {
                if (ability == "manashort") {
                    target.mana = 0;
                }
                if (ability == "clone") {
                    if (target.type == "creatures") {
                        this.summon(creatures[target.id]);
                    }
                }
                if (ability == "counterspell") {
                    target.stopcasting();
                }
                if (ability == "spelljack") {
                    var targetCast = target.castSpell;
                    if (targetCast) {
                        if (targetCast.type == "creatures") {
                            this.summon(targetCast);
                        } else {
                            this.resolveSpell(targetCast);
                        }
                        target.stopcasting();
                    }
                }

                if (ability == "tranquility") {
                    target.enchantments = Array();
                }
                if (ability == "demistify") {
                    target.enchantments = Array();
                }
                if (ability == "destroy") {
                    target.life = 0;
                }
                if (ability == "betray") {
                    target.controller = target.owner.opponent;
                }
                if (ability == "makecrystal") {
                    crystals.addCrystal(new vec2(this.pos.x + 100 * this.side, this.pos.y), null);
                }
                if (ability == "unsummon") {
                    target.respawn();
                }
                if (ability == "freeze") {
                    target.timers.push(new Timer(500, "frozen"));
                }
                if (ability == "leech") {
                    this.life = this.life + Math.abs(spell.life);
                }
            });


        });


        this.updateStats();

    }
}

/**
 * @desc Interrupts spellcasting
 * @param void
 * @return void
 */
Hero.prototype.stopcasting = function () {
    this.timers.splice(0, 1);
}

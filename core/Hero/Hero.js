function Hero(ent, showGui) {
    this.crystal = {};
    this.crystal.count = ent.crystals;
    this.crystal.pos = vec2(0, 0);
    this.crystal.delay = 3000;
    this.crystal.ready = false;
    this.crystal.timer = Array();
    this.crystal.timer.push(new Timer(this.crystal.delay, "crystal"));

    this.deck = ent.deck;
    if (showGui) this.gui = new GUI(this, this.deck);
    this.showGui = showGui;
    this.name = ent.name;
    this.id = ent.id;
    this.life = ent.life;
    this.power = ent.power;
    this.speed = ent.speed;
    this.mana = ent.mana;

    this.shielding = false;
    this.updateStats();

    this.AIaction = new Action({});

    this.status = "idle";
    // 1 = left side, -1 = right side;
    this.side = 1;

    this.enchantments = Array();
    this.auras = Array();

    this.pos = new vec2(0,0);
    this.opponent = null;
    this.summons = Array();
    this.castSpell = null;
    this.timers = Array();

    this.attackTimer = new Timer(500, "attack");

    this.setupText();
    this.setupSprite();
}


/**
 * @desc Main process function
 * @param void
 * @return void
 */
Hero.prototype.process = function () {
    this.processCleanup();
    this.processManaRegen();
    this.processTimers();
};

/**
 * @desc Removes all inactive minions and effects
 * @param void
 * @return void
 */
Hero.prototype.processCleanup = function ()
{
    if (this.auras[0] == null) {
        this.auras.splice(0, 1);
    }

    var dead_minion = null;
    this.summons.forEach((minion, index) => {
        if (minion.dead) {
            dead_minion = index;

            for (obj in minion.text) {
                minion.text[obj].destroy();
            }

            for (obj in minion.sprites) {
                minion.sprites[obj].destroy();
            }
        }
    });

    if (dead_minion !== null) {
        this.summons.splice(dead_minion, 1);
    }
}


/**
 * @desc Handles mana regeneration over time
 * @param void
 * @return void
 */
Hero.prototype.processManaRegen = function()
{
    if (this.mana <= 0) {
        this.shielding = false;
        this.mana = 0;
    }

    if (this.crystal.count > 10) {
        this.crystal.count = 10;
    }

    // Update mana (only regen when not shielding)
    if (this.shielding)
    {
        this.mana -= 3 * (DeltaTime / 1000);
    }
    else
    {
        var min_regen = 4;
        var regen = (20 / (1 + this.mana));
        if (regen > min_regen)
            regen = min_regen;

        this.mana += 3 * (DeltaTime / 1000) / regen;
        if (this.mana > this.crystal.count)
            this.mana = this.crystal.count;
    }
    this.manaText = this.setMana(this.mana);
};



/**
 * @desc Handles timers (spell casts etc.)
 * @param void
 * @return void
 */
Hero.prototype.processTimers = function () {
    var timer = this.timers[0];
    if (timer) {
        if (!timer.started) {
            timer.reset();
        }
        if (timer.isDone()) {

            if (timer.id == "sorcery" || timer.id == "enchantments" || timer.id == "creatures") {
                if (timer.id == "creatures") {
                    var minion = new Minion(this.castSpell, this);

                    if (this.enchantments.length > 0) {
                        var enchant = this.enchantments[0];
                        minion.power = minion.power + enchant.power;
                        minion.life = minion.life + enchant.life;
                        minion.updateStats();
                    }

                    this.summons.push(minion);
                    this.castSpell = null;
                }

                if (timer.id == "sorcery" || timer.id == "enchantments") {
                    this.resolveSpell(this.castSpell);
                    this.castSpell = null;
                }

                if (this.AIaction.done == false) {
                    this.AIaction.done = true
                }
            }



            if (timer.id == "attack") {
                var closest = this.closestTarget();
                var target = closest[0];
                if (target) {
                    var dist = this.pos.dist(target.pos);
                    var infront = target.pos.x > this.pos.x;
                    if (this.side == -1) {
                        infront = target.pos.x < this.pos.x;
                    }
                    if (dist <= 128 && infront) {
                        target.life = target.life - this.power;
                        target.updateStats();
                    }
                }

            }

            this.timers.splice(0, 1);
        }
    }
};


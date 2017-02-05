function Minion(ent, owner) {


    this.life = ent.life;
    this.power = ent.power;
    this.speed = ent.speed;
    this.cost = ent.cost;
    this.name = ent.name;
    this.id = ent.id;
    this.race = ent.race;
    this.type = ent.type;
    this.abilities = ent.abilities;
    this.icon = ent.icon;
    this.buffs = "";
    this.tempAbilities = Array()
    this.baseLife = this.life;
    this.basePower = this.power;

    this.checkAbilities();
    this.updateStats();

    this.offset = 0;

    if (this.flying) {
        this.offset = 80;
    }

    this.owner = owner;
    this.controller = owner;
    this.spawnPos = new vec2(owner.pos.x + 64 * owner.side, owner.pos.y);
    this.pos = new vec2(this.spawnPos.x, this.spawnPos.y);

    this.inDuel = false;
    this.dying = false;
    this.dead = false;

    this.status = "idle";


    this.timers = Array();
    this.attackTimer = new Timer(500, "attack");
    this.deathTimer = new Timer(1000, "death");
    this.removeTimer = new Timer(500, "remove");
    this.spawnTimer = new Timer(1000, "spawn");
    this.unsummonTimer = new Timer(500, "unsummon");

    this.new = true;

    if (this.goblinbuff) {
        this.owner.auras.push("goblinbuff");
    }



    this.setupSprite();
    this.setupText();


}

Minion.prototype.checkAbilities = function () {
    this.haste = false;
    this.firststrike = false;
    this.deathtouch = false;
    this.trample = false;
    this.lifelink = false;
    this.regeneration = false;
    this.noregeneration = false;
    this.flying = false;
    this.doublestrike = false;
    this.forceattack = false;
    this.blocking = false;
    this.spellproof = false;
    this.spellburn = false;

    this.abilities.forEach((ability) => {
        this[ability] = true;
    });

    this.tempAbilities.forEach((ability) => {
        this[ability] = true;
    });

    var buffs = "";
    if (this.firststrike) buffs = buffs + "🔪";
    if (this.trample) buffs = buffs + "🐘";
    if (this.lifelink) buffs = buffs + "❤️";
    if (this.flying) buffs = buffs + "✈️";
    if (this.haste) buffs = buffs + "🐇";
    if (this.deathtouch) buffs = buffs + "💀";
    if (this.spellproof) buffs = buffs + "✳️";
    if (this.spellburn) buffs = buffs + "💥";
    if (this.regeneration && !this.noregeneration) buffs = buffs + "♻️";

    this.buffs = buffs;
}

Minion.prototype.updateStats = function () {
    this.lifeText = this.setStat(this.life);
    this.powerText = this.setStat(this.power);
}

Minion.prototype.respawn = function () {
    this.inDuel = false;
    this.duel = null;
    this.dying = false;

    this.tempAbilities = Array();

    this.controller = this.owner;

    this.power = this.basePower;
    if (this.life > this.baseLife) {
        this.life = this.baseLife;
    }

    this.checkAbilities();

    if (!this.new && this.respawnliability) {
        this.owner.life = this.owner.life - 1;
        this.owner.updateStats();
    }

    this.updateStats();

    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
    this.new = false;

}

Minion.prototype.activeTimer = function () {
    var timer = this.timers[0];
    if (timer) {
        return timer.id;
    } else {
        if (this.inDuel) {
            return "duel";
        } else {
            return false;
        }
    }
}

Minion.prototype.checkEnemy = function ()
{
    this.controller.opponent.summons.some((minion) => {
        if (minion != this && !minion.activeTimer() && this.pos.dist(minion.pos) < 64)
        {
            if (this.flying == minion.flying && !minion.dying)
            {
                duels.add(this, minion);
                return true;
            }
        }
    });
}


Minion.prototype.process = function () {
    if (this.activeTimer() == "spawn" || this.activeTimer() == "unsummon") {
        this.status = "idle";
    }
    if (this.life <= 0 && !this.dying) {
        this.timers = Array();
        this.timers.push(this.deathTimer);
        this.dying = true;
        this.status = "death";
    }

    var timer = this.timers[0];
    if (timer) {

        if (!timer.started) {
            timer.reset();
        }
        if (timer.isDone()) {
            if (timer.id == "spawn") {
                this.sprites.spell.x = this.pos.x;
                this.sprites.spell.y = this.pos.y;
                this.sprites.spell.animations.play('poof', 10, false);

                // remove invulnerability
                this.show();
            }

            if (timer.id == "unsummon") {
                this.sprites.spell.x = this.pos.x;
                this.sprites.spell.y = this.pos.y;
                this.sprites.spell.animations.play('poof', 10, false);

                this.respawn();
                this.timers.push(this.spawnTimer);

                this.hide();
            }

            if (timer.id == "remove") {
                this.dead = true;
            }

            if (timer.id == "death") {
                this.hide()

                this.sprites.spell.x = this.pos.x;
                this.sprites.spell.y = this.pos.y;
                this.sprites.spell.animations.play('poof', 10, false);

                if (this.deathrattle1) {
                    this.controller.resolveSpell(specials.deathrattle1);
                }

                if (this.regeneration && !this.noregeneration && this.owner.mana >= 2) {
                    this.life = this.baseLife;
                    this.owner.mana -= 2;
                    this.respawn();
                    this.timers.push(this.spawnTimer);
                } else {
                    if (this.goblinbuff) {
                        this.owner.auras.some((aura, index) => {
                            if (aura == "goblinbuff") {
                                this.owner.auras[index] = null;
                                return true;
                            }
                        });
                    }
                    crystals.addShards(this.pos, this.cost / 2);
                    this.timers.push(this.removeTimer);

                }
            }

            if (timer.id == "attack") {
                if (this.life > 0) {
                    var shielding = 1;
                    if (this.controller.opponent.shielding) {
                        shielding = 2;
                    }
                    if (this.lifelink) {
                        this.controller.life = this.controller.life + this.power;
                    }
                    this.controller.opponent.life = this.controller.opponent.life - Math.floor(this.power / shielding);
                    this.controller.opponent.lifeText = this.setStat(this.controller.opponent.life);
                }

                if (!this.dying) {
                    this.sprites.spell.x = this.pos.x;
                    this.sprites.spell.y = this.pos.y;

                    this.status = "idle";

                    this.timers.push(this.unsummonTimer);
                }

            }

            this.timers.splice(0, 1);
        }
    } else {
        if (!this.activeTimer()) {
            if (this.blocking && !this.forceattack) {
                this.status = "blocking";
            } else {
                this.status = "moving";
            }
            this.checkEnemy();
            this.move();
        }
        if (this.inDuel) {
            this.status = "moving";

            if (this.duel.ready) {
                this.status = "attack";
            }
        }

    }
}

Minion.prototype.isVisible = function () {
    return this.unsummonTimer.isDone();
}

Minion.prototype.move = function () {
    var haste = 0;
    if (this.haste) {
        haste = 1;
    }
    if (!this.blocking || this.forceattack) {
        var dir = this.controller.opponent.pos.subtract(this.pos).normalize();
        this.pos.x += dir.x * (this.speed + haste) * game_speed;
        this.pos.y += dir.y * (this.speed + haste) * game_speed;
    }

    if (!this.inDuel && this.pos.dist(this.controller.opponent.pos) < 64) {
        this.timers.push(this.attackTimer);
        this.status = "attack";
    }
}




// convert numeral stats to graphics so it can be displayed;
Minion.prototype.setStat = function (val) {
    var txt = "";
    for (var i = 1; i <= val; i++) {
        txt = txt + "|";
    }
    return txt;
}
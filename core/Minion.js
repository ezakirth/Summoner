function Minion(ent, owner)
{
    this.sprites = {};

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

    if (this.flying)
    {
        this.offset = 80;
    }

    this.owner = owner;
    this.controller = owner;
    this.spawnPos = new vec2(owner.pos.x + 64*owner.side, owner.pos.y);
    this.pos = new vec2(this.spawnPos.x, this.spawnPos.y);
    
    this.inDuel = false;
    this.dying = false;
    this.dead = false;
    
    this.status = "idle";
    
    
    this.timers = Array();
    this.attackTimer = new Timer(500, "attack");
    this.deathTimer = new Timer(500, "death");
    this.spawnTimer = new Timer(1000, "spawn");
    this.unsummonTimer = new Timer(1000, "unsummon");
    
    this.new = true;
    
    if ( this.goblinbuff )
    {
        table.insert(this.owner.auras, "goblinbuff");
    }
    
	


	this.text = {};
	this.text.name = game.add.text(0, 0, this.name, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.action = game.add.text(0, 0, this.status, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.powerText = game.add.text(0, 0, this.powerText, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.lifeText = game.add.text(0, 0, this.lifeText, { boundsAlignH: "center", boundsAlignV : "center" });


    drawText(this.text.name, 12, rgbToHex(255, 255, 255, 255), this.name + " " + this.buffs, this.pos.x - 80,   this.pos.y - 100 - this.offset, 160, 160);
    drawText(this.text.action, 10, rgbToHex(255, 255, 255, 255), "", this.pos.x - 80,                           this.pos.y + 10 - this.offset, 160, 160);
    drawText(this.text.lifeText, 17, rgbToHex(0, 255, 0, 255), this.lifeText, this.pos.x - 80,                  this.pos.y + 20 - this.offset, 160, 160);
    drawText(this.text.powerText, 17, rgbToHex(255, 0, 0, 255), this.powerText, this.pos.x - 80,                this.pos.y + 39 - this.offset, 160, 160);


    if (this.flying)
    {
        this.sprites.model = game.add.image(this.pos.x, this.pos.y, 'bat');
        this.sprites.model.animations.add('idle',   [0]);
        this.sprites.model.animations.add('moving', [0, 1, 2, 3]);
        this.sprites.model.animations.add('dead',   [8, 9, 10, 11, 12, 13]);
        this.sprites.model.animations.add('hurt',   [16, 17]);
        this.sprites.model.animations.add('attack', [24, 25, 26, 27, 28, 29, 30, 31]);
        this.sprites.model.anchor.setTo(.5, 1.25); 
    }
    else
    {
        this.sprites.model = game.add.image(this.pos.x, this.pos.y, 'goblin');
        this.sprites.model.animations.add('idle',   [0]);
        this.sprites.model.animations.add('moving', [0, 1, 2, 3, 4, 5, 6, 7]);
        this.sprites.model.animations.add('dead',   [8, 9, 10, 11, 12, 13, 14]);
        this.sprites.model.animations.add('attack', [16, 17, 18, 19, 20, 21]);
        this.sprites.model.animations.add('hurt',   [24, 25, 26, 27]);
        this.sprites.model.anchor.setTo(.5,.8);
    }

    Layers.sprites.add(this.sprites.model);

    this.sprites.shadow = game.add.image(this.pos.x - 5*this.owner.side, this.pos.y, 'shadow');
    this.sprites.shadow.anchor.setTo(.5, .5);
    Layers.shadows.add(this.sprites.shadow);

    this.sprites.spawn = game.add.image(this.pos.x - 5*this.owner.side, this.pos.y, 'spawn');
    this.sprites.spawn.anchor.setTo(.5, .5);
    Layers.bg.add(this.sprites.spawn);

    this.sprites.spell = game.add.image(this.pos.x, this.pos.y, 'smoke');
    this.sprites.spell.animations.add('poof');
    this.sprites.spell.anchor.setTo(.5, .8);
    Layers.spells.add(this.sprites.spell);

    this.sprites.model.scale.x = this.owner.side * -1;

    this.sprites.model.x = this.pos.x;
    this.sprites.model.y = this.pos.y;

    this.respawn();
}

Minion.prototype.checkAbilities = function()
{
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
    
    this.abilities.forEach((ability) =>
    {
        this[ability] = true;
    });
    
    this.tempAbilities.forEach((ability) =>
    {
        this[ability] = true;
    });
    
    var buffs = "";
    if ( this.firststrike )
    {
        buffs = buffs + "🔪";
    }
    if ( this.trample )
    {
        buffs = buffs + "🐘";
    }
    if ( this.lifelink )
    {
        buffs = buffs + "❤️";
    }
    if ( this.flying )
    {
        buffs = buffs + "✈️";
    }
    if ( this.haste )
    {
        buffs = buffs + "🐇";
    }
    if ( this.deathtouch )
    {
        buffs = buffs + "💀";
    }
    if ( this.spellproof )
    {
        buffs = buffs + "✳️";
    }
    if ( this.spellburn )
    {
        buffs = buffs + "💥";
    }
    if ( this.regeneration && ! this.noregeneration )
    {
        buffs = buffs + "♻️";
    }
    this.buffs = buffs;
}

Minion.prototype.updateStats = function()
{
    this.lifeText = this.setStat(this.life);
    this.powerText = this.setStat(this.power);
}

Minion.prototype.respawn = function()
{
    this.inDuel = false;
    this.duel = null;
    
    this.tempabilities = Array();
    
    this.controller = this.owner;
    
    this.power = this.basePower;
    if ( this.life > this.baseLife )
    {
        this.life = this.baseLife;
    }
    
    this.checkAbilities();
    
    if ( ! this.new && this.respawnliability )
    {
        this.owner.life = this.owner.life - 1;
        this.owner.updateStats();
    }
    
    this.updateStats();
    
    this.pos.x = this.spawnPos.x;
    this.pos.y = this.spawnPos.y;
    table.insert(this.timers, this.spawnTimer);
    this.new = false;

    this.sprites.spell.x = this.pos.x;
    this.sprites.spell.y = this.pos.y;
    this.sprites.spell.animations.play('poof', 10, false);
}

Minion.prototype.activeTimer = function()
{
    var timer = this.timers[0];
    if ( timer )
    {
        return timer.id;
    }
    else
    {
        if ( this.inDuel )
        {
            return "duel";
        }
        else
        {
            return false;
        }
    }
}

Minion.prototype.checkEnemy = function()
{
    this.controller.opponent.summons.some((minion) =>
    {
        if ( minion != this && ! minion.activeTimer() && this.pos.dist(minion.pos) < 64 )
        {
            if ( (! this.flying && ! minion.flying) || (this.flying && minion.flying) )
            {
                duels.add(this, minion);
                return true;
            }
        }
    });
}

Minion.prototype.animate = function()
{
    if ( this.activeTimer() == "spawn" || this.activeTimer() == "unsummon" )
    {
        this.status = "idle";
    }
    if ( this.life <= 0 && ! this.dying )
    {
        this.timers = Array();
        table.insert(this.timers, this.deathTimer);
        this.dying = true;
        this.status = "idle";
    }
    
    var timer = this.timers[0];
    if ( timer )
    {
        
        if ( ! timer.started )
        {
            timer.reset();
        }
        if ( timer.isDone() )
        {
            if ( timer.id == "spawn" )
            {
                // remove invulnerability
            }
            
            if ( timer.id == "unsummon" )
            {
                this.respawn();
            }
            
            if ( timer.id == "death" )
            {
                if ( this.deathrattle1 )
                {
                    this.controller.resolveSpell(specials.deathrattle1);
                }
                
                if ( this.regeneration && ! this.noregeneration && this.owner.mana >= 2 )
                {
                    this.life = this.baseLife;
                    this.dying = false;
                    this.owner.mana = this.owner.mana - 2;
                    this.respawn();
                }
                else
                {
                    if ( this.goblinbuff )
                    {
                        this.owner.auras.some((aura, index) =>
                        {
                            if ( aura == "goblinbuff" )
                            {
                                this.owner.auras[index] = null;
                                return true;
                            }
                        });
                    }
                    crystals.addShards(new vec2(this.pos.x, this.pos.y, this.cost/2));
                    this.dead = true;
                }
            }
            
            if ( timer.id == "attack" )
            {
                if ( this.life > 0 )
                {
                    var shielding = 1;
                    if ( this.controller.opponent.shielding )
                    {
                        shielding = 2;
                    }
                    if ( this.lifelink )
                    {
                        this.controller.life = this.controller.life + this.power;
                    }
                    this.controller.opponent.life = this.controller.opponent.life - Math.floor(this.power/shielding);
                    this.controller.opponent.lifeText = this.setStat(this.controller.opponent.life);
                }


                this.sprites.spell.x = this.pos.x;
                this.sprites.spell.y = this.pos.y;

                this.status = "idle";
                this.sprites.model.visible = false;
                this.sprites.spell.animations.play('poof', 10, false);

                table.insert(this.timers, this.unsummonTimer);

            }
            
            table.remove(this.timers, 0);
        }
    }
    else
    {
        if ( ! this.activeTimer() )
        {
            if ( this.blocking && ! this.forceattack )
            {
                this.status = "blocking";
            }
            else
            {
                this.status = "moving";
            }
            this.checkEnemy();
            this.move();
        }
        if ( this.inDuel )
        {
            this.status = "moving";
            
            if ( this.duel.ready )
            {
                this.status = "attack";
            }
        }
        
    }
}

Minion.prototype.isVisible = function()
{
    return this.unsummonTimer.isDone();
}

Minion.prototype.move = function()
{
    var haste = 0;
    if ( this.haste )
    {
        haste = 1;
    }
    if ( ! this.blocking || this.forceattack )
    {
        var dir = this.controller.opponent.pos.subtract(this.pos).normalize();
        this.pos.x += dir.x * (this.speed + haste);
        this.pos.y += dir.y * (this.speed + haste);
    }
    
    if ( ! this.inDuel && this.pos.dist(this.controller.opponent.pos) < 96)
    {
        table.insert(this.timers, this.attackTimer);
        this.status = "attack";
    }
}

Minion.prototype.render = function()
{
    var tmp_action = "moving";
    if ( this.blocking && ! this.forceattack ) 
    {
        tmp_action = "blocking";
    }
    
    
    var action = this.activeTimer() || tmp_action;

    this.sprites.spawn.scale.setTo(1 + Math.sin(ElapsedTime*2)/10, 1 + Math.sin(ElapsedTime*2)/10);

    if ( this.isVisible() )
    {
        this.sprites.model.visible = true;
        this.sprites.shadow.visible = true;

        this.sprites.shadow.position.setTo(this.pos.x - 5*this.owner.side, this.pos.y);
        
        if ( action == "moving" )
        {
            this.sprites.shadow.width = 64 - this.offset/3 + (64 - this.offset/3) * Math.sin(ElapsedTime*8)/10;
        }
        else
        {
            this.sprites.shadow.width = 64 - this.offset/3 + (64 - this.offset/3) * Math.sin(ElapsedTime*2)/10;
        }

        
        if ( this.controller.side == 1 )
        {
			stroke(0, 0, 255, 255);
        }
        else
        {
			stroke(255, 0, 0, 255);
        }

        drawText(this.text.name, 12, rgbToHex(255, 255, 255, 255), this.name + " " + this.buffs, this.pos.x - 80,   this.pos.y - 100 - this.offset, 160, 160);
        drawText(this.text.action, 10, rgbToHex(255, 255, 255, 255), action, this.pos.x - 80,                       this.pos.y + 10 - this.offset, 160, 160);
        drawText(this.text.lifeText, 17, rgbToHex(0, 255, 0, 255), this.lifeText, this.pos.x - 80,                  this.pos.y + 20 - this.offset, 160, 160);
        drawText(this.text.powerText, 17, rgbToHex(255, 0, 0, 255), this.powerText, this.pos.x - 80,                this.pos.y + 39 - this.offset, 160, 160);

        this.text.name.alpha = 1;
        this.text.action.alpha = 1;
        this.text.powerText.alpha = 1;
        this.text.lifeText.alpha = 1;
    }
    else
    {
        this.text.name.alpha = 0;
        this.text.action.alpha = 0;
        this.text.powerText.alpha = 0;
        this.text.lifeText.alpha = 0;

        this.sprites.model.visible = false;
        this.sprites.shadow.visible = false;
    }

    this.sprites.model.x = this.pos.x;
    this.sprites.model.y = this.pos.y;
    this.sprites.model.animations.play(this.status, 10, true);

}


// convert numeral stats to graphics so it can be displayed;
Minion.prototype.setStat = function(val)
{
    var txt = "";
    for ( var i=1; i<=val; i++ )
    {
        txt = txt + "|";
    }
    return txt;
}



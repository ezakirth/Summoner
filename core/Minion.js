function Minion(ent, owner)
{
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
    
    this.pos = new vec2();
    this.owner = owner;
    this.controller = owner;
    this.spawn = new vec2(owner.pos.x + 64*owner.side, owner.pos.y);
    
    this.inDuel = false;
    this.dying = false;
    this.dead = false;
    
    this.status = "idle";
    
    
    this.timers = Array();
    this.attackTimer = new Timer(1, "attack");
    this.deathTimer = new Timer(.5, "death");
    this.spawnTimer = new Timer(.5, "spawn");
    this.unsummonTimer = new Timer(.5, "unsummon");
    
    this.new = true;
    
    if ( this.goblinbuff )
    {
        table.insert(this.owner.auras, "goblinbuff");
    }
    
    
	this.text = {};
	this.text.buffs = game.add.text(0, 0, this.buffs, { boundsAlignH: "center", boundsAlignV : "center", wordWrap: true, align : "center" });
	this.text.name = game.add.text(0, 0, this.name, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.action = game.add.text(0, 0, this.status, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.powerText = game.add.text(0, 0, this.powerText, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.lifeText = game.add.text(0, 0, this.lifeText, { boundsAlignH: "center", boundsAlignV : "center" });
	
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
    
    this.pos.x = this.spawn.x;
    this.pos.y = this.spawn.y;
    table.insert(this.timers, this.spawnTimer);
    this.new = false;
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
    
    if ( ! this.inDuel && this.pos.dist(this.controller.opponent.pos) < 96 )
    {
        table.insert(this.timers, this.attackTimer);
        this.status = "attack";
        table.insert(this.timers, this.unsummonTimer);
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

    var flying = 0;
    
    if ( this.flying )
    {
        flying = 60;
    }

    Graphics.lineStyle(10, rgbToHex(128, 128, 255, 255, true) );
    Graphics.beginFill(rgbToHex(128, 128, 255, 255, true), 0);
    Graphics.drawEllipse(this.spawn.x, this.spawn.y + 30, 32 + 32 * Math.sin(ElapsedTime*5)/10, 8);
    Graphics.endFill();


    if ( this.isVisible() )
    {

        if ( action == "moving" )
        {
            Graphics.lineStyle(0);
            Graphics.beginFill(rgbToHex(32, 32, 32, 255, true), 1);
            Graphics.drawEllipse(this.pos.x, this.pos.y + 30, 48 + 32 * Math.sin(ElapsedTime*5)/10 - flying/2, 16 - flying/10);
            Graphics.endFill();
        }
        else
        {
            Graphics.lineStyle(0);
            Graphics.beginFill(rgbToHex(32, 32, 32, 255, true), 1);
            Graphics.drawEllipse(this.pos.x, this.pos.y + 30, 48 + 32 * Math.sin(ElapsedTime*2)/10 - flying/2, 16 - flying/10);
            Graphics.endFill();
        }
        
        if ( this.controller.side == 1 )
        {
			stroke(0, 0, 255, 255);
        }
        else
        {
			stroke(255, 0, 0, 255);
        }

		Graphics.beginFill(rgbToHex(255, 181, 0, 255, true));
		Graphics.drawRect(this.pos.x - 30, this.pos.y - 30 - flying, 60, 60);
		Graphics.endFill();
        
		this.text.name.fontSize = 12;
		this.text.name.fill = rgbToHex(255, 255, 255, 255);
        this.text.name.setTextBounds(this.pos.x - 30, this.pos.y - 50 - flying, 60, 60)
		
		this.text.buffs.fontSize = 15;
		this.text.buffs.fill = rgbToHex(255, 255, 255, 255);
		this.text.buffs.text = this.buffs;
        this.text.buffs.setTextBounds(this.pos.x - 30, this.pos.y - 8 - flying, 60, 60)

		this.text.action.fontSize = 10;
		this.text.action.fill = rgbToHex(255, 255, 255, 255);
		this.text.action.text = action;
        this.text.action.setTextBounds(this.pos.x - 30, this.pos.y + 15 - flying, 60, 60)


		this.text.powerText.fontSize = 17;
		this.text.powerText.fill = rgbToHex(255, 0, 0, 255);
		this.text.powerText.text = this.powerText;
        this.text.powerText.setTextBounds(this.pos.x - 30, this.pos.y + 34 + 17 - flying, 60, 60)

		this.text.lifeText.fontSize = 17;
		this.text.lifeText.fill = rgbToHex(0, 255, 0, 255);
		this.text.lifeText.text = this.powerText;			
        this.text.lifeText.setTextBounds(this.pos.x - 30, this.pos.y + 32 - flying, 60, 60)


        this.text.name.alpha = 1;
        this.text.buffs.alpha = 1;
        this.text.action.alpha = 1;
        this.text.powerText.alpha = 1;
        this.text.lifeText.alpha = 1;
    }
    else
    {
        this.text.name.alpha = 0;
        this.text.buffs.alpha = 0;
        this.text.action.alpha = 0;
        this.text.powerText.alpha = 0;
        this.text.lifeText.alpha = 0;
    }

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



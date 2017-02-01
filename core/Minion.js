function Minion(ent, owner)
{
    this.model = new Entity(graphics.creatures[ent.color], this);
    
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
    this.model.timer = this.model.timer + DeltaTime;
    
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
                    
                    crystals.addShards(vec3(this.pos.x, this.pos.y, this.cost/2));
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
        var dir = this.controller.opponent.pos.substract(this.pos).normalize();
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
    
    
    pushMatrix();
    translate(this.spawn.x,this.spawn.y-20);
    scale(2 + Math.sin(ElapsedTime*5)/10,2);
    sprite("Dropbox.Spawn", 0, 0, 64, 32);
    popMatrix();
    
    if ( this.isVisible() )
    {
        pushMatrix();
        translate(this.pos.x,this.pos.y);
        
        fill(255, 181, 0, 255);
        
        if ( this.controller.side == 1 )
        {
            stroke(0, 0, 255, 255);
        }
        else
        {
            stroke(255, 0, 0, 255);
        }
        
        var flying = 0;
        
        if ( this.flying ) {
            flying = 40;
        }
        
        if ( action == "moving" )
        {
            sprite("Dropbox.Shadow", 0, -30, 128+Math.sin(ElapsedTime*6)*10 - flying, 64 - flying);
        }
        else
        {
            sprite("Dropbox.Shadow", 0, -30, 128+Math.sin(ElapsedTime*2)*10 - flying, 64 - flying);
        }
        
        if ( cartoon )
        {
            this.model.draw();
        }
        else
        {
            rect(-30, -30 + flying, 60, 60);
        }
        
        fill(255, 255, 255, 255);
        text(this.name, 0, 40 + flying);
        text(this.buffs, 0, 10 + flying);
        text(action, 0, -10 + flying);
        popMatrix();
        
        fill(255, 0, 0, 255);
        text(this.powerText, this.pos.x, this.pos.y - 42);
        fill(0, 255, 0, 255);
        text(this.lifeText, this.pos.x, this.pos.y - 64);
        
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



Minion = class();

function Minion:init(ent, owner)
{
    this.model = Entity(graphics["creature"], this);
    
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
    this.tempabilities = Array()
    this.baseLife = this.life;
    this.basePower = this.power;
    
    this:checkAbilities();
    this:updateStats();
    
    this.pos = vec2();
    this.owner = owner;
    this.controller = owner;
    this.spawn = vec2(owner.pos.x + 64*owner.side, owner.pos.y);
    
    this.inDuel = false;
    this.dying = false;
    this.dead = false;
    
    this.status = "idle";
    
    
    this.timers = {}
    this.attackTimer = Timer(1, "attack");
    this.deathTimer = Timer(.5, "death");
    this.spawnTimer = Timer(.5, "spawn");
    this.unsummonTimer = Timer(.5, "unsummon");
    
    this.new = true;
    
    if ( this.goblinbuff ) {
        table.insert(this.owner.auras, "goblinbuff");
    }
    
    
    this:respawn();
}

function Minion:checkAbilities()
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
    
    for ( _, ability in ipairs(this.abilities) ) {
        this[ability] = true;
    }
    
    for ( _, ability in ipairs(this.tempAbilities) ) {
        this[ability] = true;
    }
    
    var buffs = "";
    if ( this.firststrike ) {
        buffs = buffs .. "🔪";
    }
    if ( this.trample ) {
        buffs = buffs .. "🐘";
    }
    if ( this.lifelink ) {
        buffs = buffs .. "❤️";
    }
    if ( this.flying ) {
        buffs = buffs .. "✈️";
    }
    if ( this.haste ) {
        buffs = buffs .. "🐇";
    }
    if ( this.deathtouch ) {
        buffs = buffs .. "💀";
    }
    if ( this.spellproof ) {
        buffs = buffs .. "✳️";
    }
    if ( this.spellburn ) {
        buffs = buffs .. "💥";
    }
    if ( this.regeneration and not this.noregeneration ) {
        buffs = buffs .. "♻️";
    }
    this.buffs = buffs;
}

function Minion:updateStats()
{
    this.lifeText = this:setStat(this.life);
    this.powerText = this:setStat(this.power);
}

function Minion:respawn()
{
    this.inDuel = false;
    this.duel = nil;
    
    this.tempabilities = Array()
    
    this.controller = this.owner;
    
    this.power = this.basePower;
    if ( this.life > this.baseLife ) {
        this.life = this.baseLife;
    }
    
    this:checkAbilities();
    
    if ( not this.new and this.respawnliability ) {
        this.owner.life = this.owner.life - 1;
        this.owner:updateStats();
    }
    
    this:updateStats();
    
    this.pos.x = this.spawn.x;
    this.pos.y = this.spawn.y;
    table.insert(this.timers, this.spawnTimer);
    this.new = false;
}

function Minion:activeTimer()
{
    var timer = this.timers[1];
    if ( timer ) {
        return timer.id;
    } else {
        if ( this.inDuel ) {
            return "duel";
        } else {
            return false;
        }
    }
}

function Minion:checkEnemy()
{
    for ( _, minion in ipairs(this.controller.opponent.summons) ) {
        if ( minion ~= this and not minion:activeTimer() and this.pos:dist(minion.pos) < 64 ) {
            if ( (not this.flying and not minion.flying) or (this.flying and minion.flying) ) {
                duels:add(this, minion);
                break;
            }
        }
    }
}

function Minion:animate()
{
    this.model.timer = this.model.timer + DeltaTime;
    
    if ( this:activeTimer() == "spawn" or this:activeTimer() == "unsummon" ) {
        this.status = "idle";
    }
    if ( this.life <= 0 and not this.dying ) {
        this.timers = {}
        table.insert(this.timers, this.deathTimer);
        this.dying = true;
        this.status = "idle";
    }
    
    var timer = this.timers[1];
    if ( timer ) {
        
        if ( not timer.started ) {
            timer:reset();
        }
        if ( timer:isDone() ) {
            
            if ( timer.id == "unsummon" ) {
                this:respawn();
            }
            
            if ( timer.id == "death" ) {
                if ( this.deathrattle1 ) {
                    this.controller:resolveSpell(specials.deathrattle1);
                }
                
                if ( this.regeneration and not this.noregeneration and this.owner.mana >= 2 ) {
                    this.life = this.baseLife;
                    this.dying = false;
                    this.owner.mana = this.owner.mana - 2;
                    this:respawn();
                } else {
                    if ( this.goblinbuff ) {
                        for ( index, aura in ipairs(this.owner.auras) ) {
                            if ( aura == "goblinbuff" ) {
                                this.owner.auras[index] = nil;
                                break;
                            }
                        }
                    }
                    
                    crystals:addShards(vec3(this.pos.x, this.pos.y, this.cost/2));
                    this.dead = true;
                }
            }
            
            if ( timer.id == "attack" ) {
                if ( this.life > 0 ) {
                    var shielding = 1;
                    if ( this.controller.opponent.shielding ) {
                        shielding = 2;
                    }
                    if ( this.lifelink ) {
                        this.controller.life = this.controller.life + this.power;
                    }
                    this.controller.opponent.life = this.controller.opponent.life - math.floor(this.power/shielding);
                    this.controller.opponent.lifeText = this:setStat(this.controller.opponent.life);
                }
            }
            
            table.remove(this.timers, 1);
        }
    } else {
        if ( not this:activeTimer() ) {
            if ( this.blocking and not this.for (ceattack ) ) {
                this.status = "blocking";
            } else {
                this.status = "moving";
            }
            this:checkEnemy();
            this:move();
        }
        if ( this.inDuel ) {
            this.status = "moving";
            
            if ( this.duel.ready ) {
                this.status = "attack";
            }
        }
        
    }
}

function Minion:isVisible()
{
    return this.unsummonTimer:isDone();
}

function Minion:move()
{
    var haste = 0;
    if ( this.haste ) {
        haste = 1;
    }
    
    if ( not this.blocking or this.for (ceattack ) ) {
        var dir = (this.controller.opponent.pos - this.pos):normalize();
        this.pos = this.pos + dir * (this.speed + haste);
    }
    
    if ( not this.inDuel and this.pos:dist(this.controller.opponent.pos) < 96 ) {
        table.insert(this.timers, this.attackTimer);
        this.status = "attack";
        table.insert(this.timers, this.unsummonTimer);
    }
}

function Minion:render()
{
    var tmp_action = "moving";
    if ( this.blocking and not this.for (ceattack ) ) {
        tmp_action = "blocking";
    }
    
    
    var action = this:activeTimer() or tmp_action;
    
    
    pushMatrix();
    translate(this.spawn.x,this.spawn.y-20);
    scale(2 + math.sin(ElapsedTime*5)/10,2);
    sprite("Dropbox:Spawn", 0, 0, 64, 32);
    popMatrix();
    
    if ( this:isVisible() ) {
        pushMatrix();
        translate(this.pos.x,this.pos.y);
        
        fill(255, 181, 0, 255);
        
        if ( this.controller.side == 1 ) {
            stroke(0, 0, 255, 255);
        } else {
            stroke(255, 0, 0, 255);
        }
        
        var flying = 0;
        
        if ( this.flying ) {
            flying = 40;
        }
        
        if ( action == "moving" ) {
            sprite("Dropbox:Shadow", 0, -30, 128+math.sin(ElapsedTime*6)*10 - flying, 64 - flying);
        } else {
            sprite("Dropbox:Shadow", 0, -30, 128+math.sin(ElapsedTime*2)*10 - flying, 64 - flying);
        }
        
        if ( cartoon ) {
            this.model:draw();
        } else {
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
function Minion:setStat(val)
{
    var txt = "";
    for ( i=1, val ) {
        txt = txt.."|";
    }
    return txt;
}



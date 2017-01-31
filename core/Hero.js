function Hero(ent)
{
    this.deck = ent.deck;
    this.model = Entity(graphics["creature"], this);
    this.gui = GUI(this, this.deck);
    this.name = ent.name;
    this.id = ent.id;
    this.life = ent.life;
    this.power = ent.power;
    this.speed = ent.speed;
    this.mana = ent.mana;
    this.crystals = ent.crystals;
    this.type = ent.type;
    this.shielding = false;
    this.updateStats();
    
    this.status = "idle";
    // 1 = left side, -1 = right side;
    this.side = 1;
    
    this.enchantments = {}
    this.auras = {}
    
    this.pos = vec2();
    this.opponent = nil;
    this.summons = {}
    this.castSpell = nil;
    this.timers = {}
    
    this.attackTimer = Timer(.5, "attack");
}

Hero.prototype.updateStats = function()
{
    this.lifeText = this.setStat(this.life);
    this.manaText = this.setMana(this.mana);
}


Hero.prototype.attack = function()
{
    if ( ! this.activeTimer() ) {
        this.status = "attack";
        table.insert(this.timers, this.attackTimer);
    }
}

Hero.prototype.summon = function(creature)
{
    if ( this.summons.length < 5 ) {
        var minion = Minion(creature, this);
        if ( this.enchantments.length > 0 ) {
            var enchant = this.enchantments[1];
            minion.power = minion.power + enchant.power;
            minion.life = minion.life + enchant.life;
            minion.updateStats();
        }
        table.insert(this.summons, minion);
    }
}

Hero.prototype.doAction = function(action)
{
    if ( ! this.activeTimer() && action.cost <= this.mana ) {
        this.gui.setPage("home");
        if ( action.type == "creatures" && this.summons.length >= 5  ) {
            print("max 5 creatures");
        } else {
            table.insert(this.timers, Timer(action.castTime, action.type));;
            this.mana = this.mana - action.cost;
            this.castSpell = action;
        }
        
    }
}

Hero.prototype.activeTimer = function()
{
    var timer = this.timers[1];
    if ( timer ) {
        return timer.id;
    } else {
        return false;
    }
}


Hero.prototype.resolveSpell = function(spell)
{
    if ( spell.type == "enchantments" ) {
        table.insert(this.enchantments, spell);
    } else {
        var targets = this[spell.target](this);
        
        var target = nil;
        
        for ( var i=0; i < targets.length; i++ ) {
            target = targets[i];
            
            if ( target.spellburn ) {
                this.life = this.life - 3;
            }
            
            if ( target.type == "creatures" ) {
              /*  for ( _, ability in ipairs(spell.abilities) ) {
                    table.insert(target.tempAbilities, ability);
                }
                */
                target.checkAbilities();
            }
            
            target.life = target.life + spell.life;
            target.power = target.power + spell.power;
            target.updateStats();
            
            
         //   for ( _, ability in ipairs(spell.abilities) )
			{
                if ( ability == "manashort" ) {
                    target.mana = 0;
                }
                if ( ability == "clone" ) {
                    if ( target.type == "creatures" ) {
                        this.summon(creatures[target.id]);
                    }
                }
                if ( ability == "counterspell" ) {
                    target.stopcasting();
                }
                if ( ability == "spelljack" ) {
                    var targetCast = target.castSpell;
                    if ( targetCast ) {
                        if ( targetCast.type == "creatures" ) {
                            this.summon(targetCast);
                        } else {
                            this.resolveSpell(targetCast);
                        }
                        target.stopcasting();
                    }
                }
                
                if ( ability == "tranquility" ) {
                    target.enchantments = {}
                }
                if ( ability == "demistify" ) {
                    target.enchantments = {}
                }
                if ( ability == "destroy" ) {
                    target.life = 0;
                }
                if ( ability == "betray" ) {
                    target.controller = target.owner.opponent;
                }
                if ( ability == "makecrystal" ) {
                    crystals.forceSpawnCrystal(target);
                }
                if ( ability == "unsummon" ) {
                    target.respawn();
                }
                if ( ability == "freeze" ) {
                    table.insert(target.timers, Timer(5, "frozen"));
                }
                if ( ability == "leech" ) {
                    this.life = this.life + math.abs(spell.life);
                }
            }
            
            
        }
        
        
        this.updateStats();
        
    }
}

Hero.prototype.stopcasting = function()
{
    table.remove(this.timers, 1);
}

Hero.prototype.animate = function()
{
    this.model.timer = this.model.timer + DeltaTime;
    
    
    
    if ( this.auras[1] == nil ) {
        table.remove(this.auras, 1);
    }
    
    if ( this.mana <= 0 ) {
        this.shielding = false;
        this.mana = 0;
    }
    
    if ( this.shielding ) {
        this.mana = this.mana - DeltaTime;
    } else {
        var min_regen = 4;
        var regen = (20/(1+this.mana));
        if ( regen > min_regen ) {
            regen = min_regen;
        }
        this.mana = this.mana + DeltaTime/regen;
        if ( this.mana > this.crystals ) {
            this.mana = this.crystals;
        }
    }
    this.manaText = this.setMana(this.mana);
    
    var timer = this.timers[1];
    if ( timer ) {
        if ( ! timer.started ) {
            timer.reset();
        }
        if ( timer.isDone() ) {
            if ( timer.id == "crystal" ) {
                this.spawnCrystal();
            }
            
            if ( timer.id == "creatures" ) {
                var minion = Minion(this.castSpell, this);
                
                if ( this.enchantments.length > 0 ) {
                    var enchant = this.enchantments[1];
                    minion.power = minion.power + enchant.power;
                    minion.life = minion.life + enchant.life;
                    minion.updateStats();
                }
                
                table.insert(this.summons, minion);
                this.castSpell = nil;
            }
            
            if ( timer.id == "sorcery" || timer.id == "enchantments" ) {
                this.resolveSpell(this.castSpell);
                this.castSpell = nil;
            }
            
            if ( timer.id == "attack" ) {
                var closest = this.closestTarget();
                var target = closest[1];
                if ( target ) {
                    var dist = this.pos.dist(target.pos);
                    var infront = target.pos.x > this.pos.x;
                    if ( this.side == -1 ) {
                        infront = target.pos.x < this.pos.x;
                    }
                    if ( dist <= 128 && infront ) {
                        target.life = target.life - this.power;
                        target.updateStats();
                    }
                }
                
            }
            
            table.remove(this.timers, 1);
        }
    }
    
    
    
    var dead_minion = nil;
  /*  for ( index, minion in ipairs(this.summons) )
	{
        if ( minion.dead ) {
            dead_minion = index;
        }
    }*/
    
    if ( dead_minion ) {
        table.remove(this.summons, dead_minion);
    }
}

Hero.prototype.render = function()
{
    
    
    
    var action = this.activeTimer() || this.status;
    
    fontSize(17);
    
    pushMatrix();
    translate(this.pos.x,this.pos.y);
    
    scale(this.side *2, 2);
    
    
    fill(255, 255, 255, 255);
    
    if ( this.side == 1 ) {
        stroke(0, 0, 255, 255);
    } else {
        stroke(255, 0, 0, 255);
    }
    
    if ( this.status == "moving" ) {
        sprite("Dropbox.Shadow", 0, -15, 64+math.sin(ElapsedTime*6)*5, 32);
    } else {
        sprite("Dropbox.Shadow", 0, -15, 64+math.sin(ElapsedTime*2)*5, 32);
    }
    
    if ( cartoon ) {
        this.model.draw();
    } else {
        rect(-20, -15, 40, 60);
    }
    
    if ( this.shielding ) {
        sprite("Dropbox.Shield (1)", 0, 15, 100, 120);
    }
    
    if ( action == "attack" || this.castSpell ) {
        var name = "";
        if ( action == "attack" ) {
            name = "Die !";
        } else {
            if ( this.castSpell ) {
                name = this.castSpell.name + " !";
            }
        }
        sprite("Dropbox.chat", 40, 50, 10 + 5*string.len(name), 40);
        scale(this.side *.5, .5);
        fill(0, 0, 0, 255);
        text(name, 80 * this.side, 107);
    }
    popMatrix();
    
    fill(0, 255, 0, 255);
    text(this.life + " " + this.lifeText, this.pos.x, this.pos.y - 42);
    fill(255, 255, 255, 255);
    fontSize(10);
    text(this.manaText, this.pos.x, this.pos.y - 64);
    fontSize(17);
    
    fill(0, 0, 0, 255);
    text(this.name, this.pos.x, this.pos.y + 60);
    text(action, this.pos.x, this.pos.y);
    
}


// convert numeral stats to graphics so it can be displayed;
Hero.prototype.setStat = function(val)
{
    var txt = "";
    for ( var i=1; i < val; i++ ) {
        txt = txt + "|";
    }
    return txt;
}
// convert numeral stats to graphics so it can be displayed;
Hero.prototype.setMana = function(val)
{
    var txt = "";
    for ( var i=1; i < val; i++ ) {
        txt = txt + "🔵";
    }
    
    var empty = math.ceil(this.crystals - val);
    for ( var i=1; i < empty; i++ ) {
        txt = txt + "⚪️";
    }
    
    return txt;
}

/*

Hero.prototype.closestFriendly = function()
{
    var minions = this.allFriendlyMinions();
    var minDist = 9999;
    var closest = 0;
   // for ( index, minion in ipairs(minions) ) 
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof ) {
            minDist = dist;
            closest = index;
        }
    }
    return Array( minions[closest] );
}

Hero.prototype.closestEnemy = function()
{
    var minion = this.closestEnemyMinion();
    if ( minion[1] ) {
        return minion;
    } else {
        return {this.opponent}
    }
}

Hero.prototype.closestTarget = function()
{
    var minion = this.closestMinion();
    if ( minion[1] ) {
        return minion;
    } else {
        return {this.opponent}
    }
}

Hero.prototype.closestEnemyMinion = function()
{
    var minions = this.allEnemyMinions();
    var minDist = 9999;
    var closest = 0;
   // for ( index, minion in ipairs(minions) )
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof ) {
            minDist = dist;
            closest = index;
        }
    }
    return {minions[closest]}
}

Hero.prototype.closestMinion = function()
{
    var minions = this.allMinions();
    var minDist = 9999;
    var closest = 0;
   // for ( index, minion in ipairs(minions) )
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof ) {
            minDist = dist;
            closest = index;
        }
    }
    return {minions[closest]}
}


Hero.prototype.allFriendlyMinions = function()
{
    var array = {}
  //  for ( _, minion in ipairs(this.summons) )
	{
        if ( ! minion.dead ) {
            table.insert(array, minion);
        }
    }
    return array;
}

Hero.prototype.allEnemyMinions = function()
{
    var array = {}
  //  for ( _, minion in ipairs(this.opponent.summons) )
	{
        if ( ! minion.dead ) {
            table.insert(array, minion);
        }
    }
    return array;
}

Hero.prototype.allMinions = function()
{
    var array = {}
    var enemies = this.allEnemyMinions();
    var friendlies = this.allFriendlyMinions();
  //  for ( _, minion in ipairs(enemies) )
	{
        table.insert(array, minion);
    }
   // for ( _, minion in ipairs(friendlies) ) 
	{
        table.insert(array, minion);
    }
    return array;
}

Hero.prototype.all = function()
{
    var array = this.allMinions();
    table.insert(array, this);
    table.insert(array, this.opponent);
    return array;
}

Hero.prototype.enemyHero = function()
{
    return { this.opponent }
}

Hero.prototype.friendlyHero = function()
{
    return { this }
}

Hero.prototype.allHeroes = function()
{
    return { this, this.opponent }
}
*/
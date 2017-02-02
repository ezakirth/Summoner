function Hero(ent, showGui)
{
    this.deck = ent.deck;
    this.gui = new GUI(this, this.deck);
    this.showGui = showGui;
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
    
    this.enchantments = Array();
    this.auras = Array();
    
    this.pos = new vec2();
    this.opponent = null;
    this.summons = Array();
    this.castSpell = null;
    this.timers = Array();
    
    this.attackTimer = new Timer(.5, "attack");
	

	    
	this.text = {};
	this.text.name = game.add.text(0, 0, this.name, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.dialog = game.add.text(0, 0, "", { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.action = game.add.text(0, 0, this.status, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.manaText = game.add.text(0, 0, this.manaText, { boundsAlignH: "center", boundsAlignV : "center" });
	this.text.lifeText = game.add.text(0, 0, this.life + " " + this.lifeText, { boundsAlignH: "center", boundsAlignV : "center" });
	
	
}

Hero.prototype.updateStats = function()
{
    this.lifeText = this.setStat(this.life);
    this.manaText = this.setMana(this.mana);
}


Hero.prototype.attack = function()
{
    if ( this.activeTimer() === false)
    {
        this.status = "attack";
        table.insert(this.timers, this.attackTimer);
    }
}

Hero.prototype.summon = function(creature)
{
    if ( this.summons.length < 5 )
    {
        var minion = new Minion(creature, this);
        if ( this.enchantments.length > 0 )
        {
            var enchant = this.enchantments[0];
            minion.power = minion.power + enchant.power;
            minion.life = minion.life + enchant.life;
            minion.updateStats();
        }
        table.insert(this.summons, minion);
    }
}

Hero.prototype.doAction = function(action)
{
    if ( ! this.activeTimer() && action.cost <= this.mana )
    {
        this.gui.setPage("home");
        if ( action.type == "creatures" && this.summons.length >= 5  )
        {
            print("max 5 creatures");
        }
        else
        {
            table.insert(this.timers, new Timer(action.castTime, action.type));
            this.mana = this.mana - action.cost;
            this.castSpell = action;
        }
    }
}

Hero.prototype.activeTimer = function()
{
    var timer = this.timers[0];
    if ( timer )
    {
        return timer.id;
    }
    else
    {
        return false;
    }
}


Hero.prototype.resolveSpell = function(spell)
{
    if ( spell.type == "enchantments" )
    {
        table.insert(this.enchantments, spell);
    }
    else
    {
        var targets = this[spell.target](this);
        
        var target = null;
        
        for ( var i=0; i < targets.length; i++ ) {
            target = targets[i];
            
            if ( target.spellburn ) {
                this.life = this.life - 3;
            }
            
            if ( target.type == "creatures" )
            {
                spell.abilities.forEach((ability) =>
                {
                    table.insert(target.tempAbilities, ability);
                });
                target.checkAbilities();
            }
            
            target.life = target.life + spell.life;
            target.power = target.power + spell.power;
            target.updateStats();
            
            
            spell.abilities.forEach((ability) =>
			{
                if ( ability == "manashort" )
                {
                    target.mana = 0;
                }
                if ( ability == "clone" )
                {
                    if ( target.type == "creatures" )
                    {
                        this.summon(creatures[target.id]);
                    }
                }
                if ( ability == "counterspell" )
                {
                    target.stopcasting();
                }
                if ( ability == "spelljack" )
                {
                    var targetCast = target.castSpell;
                    if ( targetCast ) {
                        if ( targetCast.type == "creatures" )
                        {
                            this.summon(targetCast);
                        }
                        else
                        {
                            this.resolveSpell(targetCast);
                        }
                        target.stopcasting();
                    }
                }
                
                if ( ability == "tranquility" )
                {
                    target.enchantments = Array();
                }
                if ( ability == "demistify" )
                {
                    target.enchantments = Array();
                }
                if ( ability == "destroy" )
                {
                    target.life = 0;
                }
                if ( ability == "betray" )
                {
                    target.controller = target.owner.opponent;
                }
                if ( ability == "makecrystal" )
                {
                    crystals.forceSpawnCrystal(target);
                }
                if ( ability == "unsummon" )
                {
                    target.respawn();
                }
                if ( ability == "freeze" )
                {
                    table.insert(target.timers, new Timer(5, "frozen"));
                }
                if ( ability == "leech" )
                {
                    this.life = this.life + Math.abs(spell.life);
                }
            });
            
            
        }
        
        
        this.updateStats();
        
    }
}

Hero.prototype.stopcasting = function()
{
    table.remove(this.timers, 0);
}

Hero.prototype.animate = function()
{
    if ( this.auras[0] == null )
    {
        table.remove(this.auras, 0);
    }
    
    if ( this.mana <= 0 )
    {
        this.shielding = false;
        this.mana = 0;
    }
    
    if ( this.shielding )
    {
        this.mana = this.mana - DeltaTime;
    }
    else
    {
        var min_regen = 4;
        var regen = (20/(1+this.mana));
        if ( regen > min_regen )
        {
            regen = min_regen;
        }
        this.mana = this.mana + DeltaTime/regen;
        if ( this.mana > this.crystals )
        {
            this.mana = this.crystals;
        }
    }
    this.manaText = this.setMana(this.mana);
    
    var timer = this.timers[0];
    if ( timer )
    {
        if ( ! timer.started )
        {
            timer.reset();
        }
        if ( timer.isDone() )
        {
            if ( timer.id == "crystal" )
            {
                this.spawnCrystal();
            }
            
            if ( timer.id == "creatures" )
            {
                var minion = new Minion(this.castSpell, this);
                
                if ( this.enchantments.length > 0 )
                {
                    var enchant = this.enchantments[0];
                    minion.power = minion.power + enchant.power;
                    minion.life = minion.life + enchant.life;
                    minion.updateStats();
                }
                
                table.insert(this.summons, minion);
                this.castSpell = null;
            }
            
            if ( timer.id == "sorcery" || timer.id == "enchantments" )
            {
                this.resolveSpell(this.castSpell);
                this.castSpell = null;
            }
            
            if ( timer.id == "attack" )
            {
                var closest = this.closestTarget();
                var target = closest[0];
                if ( target )
                {
                    var dist = this.pos.dist(target.pos);
                    var infront = target.pos.x > this.pos.x;
                    if ( this.side == -1 )
                    {
                        infront = target.pos.x < this.pos.x;
                    }
                    if ( dist <= 128 && infront )
                    {
                        target.life = target.life - this.power;
                        target.updateStats();
                    }
                }
                
            }
            
            table.remove(this.timers, 0);
        }
    }
    
    
    
    var dead_minion = null;
    this.summons.forEach((minion, index) =>
    {
        if ( minion.dead )
        {
            dead_minion = index;

            minion.text.name.destroy();
            minion.text.buffs.destroy();
            minion.text.action.destroy();
            minion.text.powerText.destroy();
            minion.text.lifeText.destroy();

        }
    });
    
    if ( dead_minion )
    {
        table.remove(this.summons, dead_minion);
    }
}

Hero.prototype.render = function()
{
    
    var action = this.activeTimer() || this.status;
    
    

    
    if ( this.status == "moving" )
    {
        Graphics.lineStyle(0);
        Graphics.beginFill(rgbToHex(32, 32, 32, 255, true), 1);
        Graphics.drawEllipse(this.pos.x, this.pos.y + 60, 64 + 64 * Math.sin(ElapsedTime*5)/10, 20);
        Graphics.endFill();
    }
    else
    {
        Graphics.lineStyle(0);
        Graphics.beginFill(rgbToHex(32, 32, 32, 255, true), 1);
        Graphics.drawEllipse(this.pos.x, this.pos.y + 60, 64 + 64 * Math.sin(ElapsedTime*2)/10, 20);
        Graphics.endFill();
    }
    
    if ( this.side == 1 )
    {
        stroke(0, 0, 255, 255);
    }
    else
    {
        stroke(255, 0, 0, 255);
    }

	Graphics.beginFill(rgbToHex(255, 255, 255, 255, true));
	Graphics.drawRect(this.pos.x - 40, this.pos.y - 60, 80, 120);
	Graphics.endFill();	
	
    
    if ( this.shielding )
    {
        Graphics.lineStyle(0);
		Graphics.beginFill(rgbToHex(0, 0, 255, 255, true), .5);
		Graphics.drawRect(this.pos.x - 50, this.pos.y - 70 , 100, 140);
		Graphics.endFill();	
    }
    
    if ( action == "attack" || this.castSpell)
    {
        var name = "";
        if ( action == "attack" )
        {
            name = "Die !";
        }
        else
        {
            if ( this.castSpell )
            {
                name = this.castSpell.name + " !";
            }
        }

        Graphics.lineStyle(3, rgbToHex(0, 0, 0, 255, true));
		Graphics.beginFill(rgbToHex(255, 255, 255, 255, true), 1);
        Graphics.drawRect(this.pos.x - (10 + 10*name.length)/2 + 100*this.side, this.pos.y - 96 , 10 + 10*name.length, 60);
		Graphics.endFill();	

		this.text.dialog.fontSize = 17;
		this.text.dialog.fill = rgbToHex(0, 0, 0, 255);
		this.text.dialog.text = name;
        this.text.dialog.setTextBounds(this.pos.x - (10 + 10*name.length)/2 + 100*this.side, this.pos.y - 74, 10 + 10*name.length, 60);
        this.text.dialog.alpha = 1;
    }
    else
    {
        this.text.dialog.alpha = 0;
    }

    
	this.text.lifeText.fontSize = 17;
	this.text.lifeText.fill = rgbToHex(0, 255, 0, 255);
	this.text.lifeText.text = this.life + " " + this.lifeText;
    this.text.lifeText.setTextBounds(this.pos.x - 40, this.pos.y + 70, 80, 140)
	
	
	this.text.manaText.fontSize = 5;
	this.text.manaText.fill = rgbToHex(255, 255, 255, 255);
	this.text.manaText.text = this.manaText;		
    this.text.manaText.setTextBounds(this.pos.x - 40, this.pos.y + 50, 80, 140)

	this.text.name.fontSize = 17;
	this.text.name.fill = rgbToHex(0, 0, 0, 255);
    this.text.name.setTextBounds(this.pos.x - 40, this.pos.y - 50, 80, 140)

    
	this.text.action.fontSize = 15;
	this.text.action.fill = rgbToHex(0, 0, 0, 255);
	this.text.action.text = action;
    this.text.action.setTextBounds(this.pos.x - 40, this.pos.y, 80, 140)
	
}


// convert numeral stats to graphics so it can be displayed;
Hero.prototype.setStat = function(val)
{
    var txt = "";
    for ( var i=1; i <= val; i++ )
    {
        txt = txt + "|";
    }
    return txt;
}
// convert numeral stats to graphics so it can be displayed;
Hero.prototype.setMana = function(val)
{
    var txt = "";
    for ( var i=1; i <= val; i++ )
    {
        txt = txt + "🔵";
    }
    
    var empty = Math.ceil(this.crystals - val);
    for ( var i=1; i <= empty; i++ )
    {
        txt = txt + "⚪️";
    }
    
    return txt;
}


Hero.prototype.closestFriendly = function()
{
    var minions = this.allFriendlyMinions();
    var minDist = 9999;
    var closest = 0;
    minions.forEach((minion, index) =>
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof )
        {
            minDist = dist;
            closest = index;
        }
    });
    return Array( minions[closest] );
}

Hero.prototype.closestEnemy = function()
{
    var minion = this.closestEnemyMinion();
    if ( minion[0] )
    {
        return minion;
    }
    else
    {
        return Array(this.opponent);
    }
}

Hero.prototype.closestTarget = function()
{
    var minion = this.closestMinion();
    if ( minion[0] )
    {
        return minion;
    }
    else
    {
        return Array(this.opponent);
    }
}

Hero.prototype.closestEnemyMinion = function()
{
    var minions = this.allEnemyMinions();
    var minDist = 9999;
    var closest = 0;
    minions.forEach((minion, index) =>
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof )
        {
            minDist = dist;
            closest = index;
        }
    });
    return Array(minions[closest]);
}

Hero.prototype.closestMinion = function()
{
    var minions = this.allMinions();
    var minDist = 9999;
    var closest = 0;
    minions.forEach((minion, index) =>
	{
        var dist = this.pos.dist(minion.pos);
        if ( dist < minDist && ! minion.spellproof )
        {
            minDist = dist;
            closest = index;
        }
    });
    return Array(minions[closest]);
}


Hero.prototype.allFriendlyMinions = function()
{
    var array = Array();
    this.summons.forEach((minion) =>
	{
        if ( ! minion.dead )
        {
            table.insert(array, minion);
        }
    });
    return array;
}

Hero.prototype.allEnemyMinions = function()
{
    var array = Array();
    this.opponent.summons.forEach((minion) =>
	{
        if ( ! minion.dead ) {
            table.insert(array, minion);
        }
    });
    return array;
}

Hero.prototype.allMinions = function()
{
    var array = Array();
    var enemies = this.allEnemyMinions();
    var friendlies = this.allFriendlyMinions();
    enemies.forEach((minion) =>
	{
        table.insert(array, minion);
    });
    friendlies.forEach((minion) =>
    {
        table.insert(array, minion);
    });
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
    return Array(this.opponent);
}

Hero.prototype.friendlyHero = function()
{
    return Array(this);
}

Hero.prototype.allHeroes = function()
{
    return Array(this, this.opponent);
}

function AI(player)
{
    this.player = player;
    this.spawnPos = new vec2(player.pos.x, player.pos.y);
    this.actions = Array();
}

AI.prototype.process = function()
{
    if ( this.actions.length == 0 )
    {
        this.findJob();
    }
    else
    {
        var job = this.actions[0];
        if ( job == null )
        {
            table.remove(this.actions, 0);
        }
        else
        {
            this.doAction(job);
            
            this.actions.forEach((action, index) =>
            {
                if ( action.done )
                {
                    this.actions[index] = null;
                }
            });
        }
    }
    
}

AI.prototype.findJob = function()
{
    if ( crystals.p2.crystalReady )
    {
        table.insert(this.actions, {type : "move", dest : crystals.p2.crystalPos});
        table.insert(this.actions, {type : "move", dest : this.spawnPos});
    }
    else
    {
        if ( this.player.mana >= 1 && this.player.summons.length < 1)
        {
            this.player.doAction(creatures.red.raging_goblin);
        }

        if ( this.player.mana >= 1 && this.player.summons.length < 3)
        {
            this.player.doAction(creatures.red.raging_goblin);
        }
        else
        if ( this.player.mana >= 2 && this.player.summons.length < 5)
        {
            this.player.doAction(creatures.red.goblin_hero);
        }
        else
        if ( this.player.mana >= 2 && this.player.summons.length == 5)
        {
            this.player.doAction(sorcery.red.reckless_charge);
        }
        
    }
}


AI.prototype.doAction = function(action)
{
    if ( action.type == "move" )
    {
        this.moveTo(action);
    }
}

AI.prototype.moveTo = function(action)
{
    var pos = action.dest;
    
    if ( this.player.pos.dist(pos) < 5 )
    {
        action.done = true;
        this.player.status = "idle";
    }
    else
    {
        this.player.status = "moving";
        var dir = (pos.subtract(this.player.pos)).normalize();
        this.player.pos.x += dir.x * (this.player.speed);
        this.player.pos.y += dir.y * (this.player.speed);
    }
    
}

function Action(action)
{
    this.done = false;
    this.type = action.type;
    this.dest = action.dest;
}

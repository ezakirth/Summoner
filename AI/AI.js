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
        table.insert(this.actions, new Action({type : "move", goal : crystals.p2.crystalPos}));
        table.insert(this.actions, new Action({type : "move", goal : this.spawnPos}));
        return
    }

    if ( this.player.mana >= 1 && this.player.summons.length < 1)
    {
//        table.insert(this.actions, new Action({type : "move", goal : new vec2(Math.floor(WIDTH/2 + (WIDTH/2)*Math.random()), Math.floor(HEIGHT*Math.random()))}));
        table.insert(this.actions, new Action({type : "cast", goal : creatures.red.raging_goblin}));
//        table.insert(this.actions, new Action({type : "move", goal : this.spawnPos}));
        return
    }
/*
    if ( this.player.mana >= 2 && this.player.summons.length < 2)
    {
        table.insert(this.actions, new Action({type : "move", goal : new vec2(Math.floor(WIDTH/2 + (WIDTH/2)*Math.random()), Math.floor(HEIGHT*Math.random()))}));
        table.insert(this.actions, new Action({type : "cast", goal : creatures.red.goblin_hero}));
        table.insert(this.actions, new Action({type : "move", goal : this.spawnPos}));
        return
    }

    if ( this.player.mana >= 1 && this.player.summons.length < 2)
    {
        table.insert(this.actions, new Action({type : "move", goal : new vec2(Math.floor(WIDTH/2 + (WIDTH/2)*Math.random()), Math.floor(HEIGHT*Math.random()))}));
        table.insert(this.actions, new Action({type : "cast", goal : creatures.red.raging_goblin}));
        table.insert(this.actions, new Action({type : "move", goal : this.spawnPos}));
        return
    }
    
    if ( this.player.mana >= 3)
    {
        table.insert(this.actions, new Action({type : "cast", goal : sorcery.red.reckless_charge}));
        return
    }*/

}


AI.prototype.doAction = function(action)
{
    if ( action.type == "move" )
    {
        this.moveTo(action);
    }

    if ( action.type == "cast" )
    {
        this.player.doAction(action.goal, action);
        action.type == "casting"
    }    

    
}

AI.prototype.moveTo = function(action)
{
    var pos = action.goal;
    
    if ( this.player.pos.dist(pos) < 5 )
    {
        action.done = true;
        this.player.status = "idle";
    }
    else
    {
        this.player.status = "moving";
        var dir = (pos.subtract(this.player.pos)).normalize();
        this.player.pos.x += dir.x * (this.player.speed) * game_speed;
        this.player.pos.y += dir.y * (this.player.speed) * game_speed;
    }
    
}

function Action(action)
{
    this.done = false;
    this.type = action.type;
    this.goal = action.goal;
}

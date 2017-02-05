function AI(player) {
    this.player = player;
    this.spawnPos = new vec2(player.pos.x, player.pos.y);
    this.action = {
        type : "none",
        goal : null,
        priority: 0,
        done: true
    };

    this.active = true;
}

AI.prototype.process = function ()
{
    if (this.active)
    {
        this.findJob();
        this.processJob();
     }
}

AI.prototype.findJob = function () {

    /*
    if (this.player.status == "idle" && this.player.summons.length < 1)
    {
        console.log("ok");
        this.actions.push(new Action({type : "cast", goal : creatures.red.raging_goblin}));
    }
    if (true) return;
*/

    if (this.action.priority < 3)
    {
        if (this.player.crystal.ready)
        {
            this.action.priority = 3;
            this.action.type = "move";
            this.action.goal = this.player.crystal.pos;
            this.action.done = false;
        }
    }

    if (this.action.priority < 2)
    {
        if ( this.player.mana >= 2 && this.player.summons.length < 2)
        {
            this.action.priority = 2;
            this.action.type = "cast";
            this.action.goal = creatures.red.goblin_hero;
            this.action.done = false;
        }
    }


    if (this.action.priority < 1)
    {
        if (this.player.mana < this.player.crystal.count) {
            var foundCrystal = this.findCrystal();

            if (foundCrystal)
            {
                this.action.priority = 1;
                this.action.type = "move";
                this.action.goal = foundCrystal.pos;
                this.action.done = false;
            }
        }
    }

    if (this.action.done)
    {
        this.action.priority = 0;
        this.action.type = "move";
        this.action.goal = this.spawnPos;
        this.action.done = false;
    }
}

AI.prototype.findCrystal = function ()
{
    var found = null;
    crystals.crystals.some((obj) =>
    {
        if (obj)
        {
            // check on left side if player1, right side if player 2
            var proxyTest = (this.player == p1) ? obj.pos.x <= WIDTH/2 : obj.pos.x >= WIDTH/2;

            if ( proxyTest )
            {
                found = obj;
                return true;
            }
        }
    });

    return found;
}

AI.prototype.processJob = function ()
{
    if (this.action.goal)
    {
        if (this.action.type == "move" && this.action.goal)
        {
            this.movePlayer();
        }

        if (this.action.type == "cast")
        {
            this.player.doAction(this.action.goal, this.action);
            this.action.type = "casting"
        }
    }
}

AI.prototype.movePlayer = function () {
    var pos = this.action.goal;

    if (this.player.pos.dist(pos) < 5)
    {
        this.action.done = true;
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

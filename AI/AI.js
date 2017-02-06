function AI(player) {
    this.player = player;
    this.spawnPos = new vec2(Math.floor(player.pos.x), Math.floor(player.pos.y));
    this.jobs = Array();

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
    var currentJob = this.jobs[0] || {  priority: 0,
                                        type: "",
                                        goal: null,
                                        done: true};


    if (currentJob.type != "casting" && currentJob.type != "attacking")
    {
        if (currentJob.priority < 4)
        {
            var closestEnemy = this.player.closestEnemy()[0];
            if (this.player.pos.dist(closestEnemy.pos) < 128)
            {
                this.jobs = Array(new Job({
                    priority: 4,
                    type: "attack",
                    goal: "",
                    done: false
                }));                
            }

        }


        if (currentJob.priority < 3)
        {
            if (this.player.crystal.ready)
            {
                this.jobs = Array(new Job({
                    priority: 3,
                    type: "move",
                    goal: this.player.crystal.pos,
                    done: false
                }));
            }
        }

        if (currentJob.priority < 2)
        {

            if (this.player.name == "Druid")
            {
                var creature = creatures.green.defiant_elf;
                var spell = sorcery.green.giant_growth;
                if (this.player.mana >= creature.cost && this.player.summons.length < 1)
                {
                    this.jobs = Array(new Job({
                        priority: 2,
                        type: "cast",
                        goal: creature,
                        done: false
                    }));
                    return true;
                }
                else
                    if (this.player.mana >= spell.cost && this.player.summons.length == 1)
                    {
                        this.jobs = Array(new Job({
                            priority: 2,
                            type: "cast",
                            goal: spell,
                            done: false
                        }));
                        return true;
                    }
            }

            if (this.player.name == "Warrior")
            {
                var creature = creatures.red.raging_goblin;
                var spell = sorcery.red.engulfing_flames;
                if ( this.player.mana >= creature.cost && this.player.summons.length < 4)
                {
                    this.jobs = Array(new Job({
                        priority: 2,
                        type: "cast",
                        goal: creature,
                        done: false
                    }));
                    return true;
                }
                else
                    if (this.player.mana >= spell.cost)
                    {
                        this.jobs = Array(new Job({
                            priority: 2,
                            type: "cast",
                            goal: spell,
                            done: false
                        }));
                        return true;
                    }
            }
        }

/*
        if (currentJob.priority < 2)
        {

            var creatures = Array();
            var spells = Array();

            this.player.deck.some((spell) =>
            {
                if (spell.type == "creatures")
                    creatures.push(spell);
                if (spell.type == "sorcery")
                    spells.push(spell);
            });


            var creature = creatures[Math.floor(Math.random()*creatures.length)];
            var sorcery = spells[Math.floor(Math.random()*creatures.length)];

            var cast = null;
            if (this.player.summons.length > 1 + Math.random()*2)
                cast = sorcery;
            else
                cast = creature;

            if ( this.player.mana >= cast.cost && this.player.summons.length < 5)
            {
                this.jobs = Array(new Job({
                    priority: 2,
                    type: "cast",
                    goal: cast,
                    done: false
                }));
                return true;
            }
        }
*/


        if (currentJob.priority < 1)
        {
            if (this.player.mana < this.player.crystal.count) {
                var foundCrystal = this.findCrystal();

                if (foundCrystal)
                {
                    this.jobs = Array(new Job({
                        priority: 1,
                        type: "move",
                        goal: foundCrystal.pos,
                        done: false
                    }));
                }
            }
        }
        
    }

    if (this.jobs.length == 0)
    {
        this.jobs = Array(new Job({
            priority: 0,
            type: "move",
            goal: this.spawnPos,
            done: false
        }));
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
    var job = this.jobs[0];

    if (job)
    {
        if (job.type == "move")
        {
            this.movePlayer(job);
        }

        if (job.type == "cast")
        {
            if (this.player.doAction(job.goal, job))
                job.type = "casting"
        }

        if (job.type == "attack")
        {
            if (this.player.attack(job))
                job.type = "attacking"
        }        

        if (job.done)
        {
            this.jobs.shift();
        }
    }
}

AI.prototype.movePlayer = function (job)
{
    if (this.player.pos.dist(job.goal) < 5 * game_speed)
    {
        job.done = true;
        this.player.status = "idle";
    }
    else
    {
        this.player.status = "moving";
        var dir = (job.goal.subtract(this.player.pos)).normalize();
        this.player.pos.x += dir.x * (this.player.speed) * game_speed;
        this.player.pos.y += dir.y * (this.player.speed) * game_speed;
    }
}


function Job(job)
{
    this.type = job.type;
    this.goal = job.goal;
    this.priority = job.priority;
    this.done = job.done;
}
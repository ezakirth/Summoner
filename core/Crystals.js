function Crystals()
{
    this.shards = Array();
    
    this.p1 = {};
    this.p1.crystalPos = null;
    this.p1.crystalDelay = 3000;
    this.p1.crystalCount = 0;
    this.p1.crystalReady = false;
    this.p1.crystalTimer = Array();

    this.p2 = {};
    this.p2.crystalPos = null;
    this.p2.crystalDelay = 3000;
    this.p2.crystalCount = 0;
    this.p2.crystalReady = false;
    this.p2.crystalTimer = Array();
    
    this.owners = Array();
    table.insert(this.owners, this.p1);
    table.insert(this.owners, this.p2);

    this.summoned = Array();
    table.insert(this.p1.crystalTimer, new Timer(this.p1.crystalDelay, "crystal"));
    table.insert(this.p2.crystalTimer, new Timer(this.p2.crystalDelay, "crystal"));
}

Crystals.prototype.spawnCrystal = function(owner)
{
    owner.crystalReady = true;
    if ( owner == this.p1 )
    {
        owner.crystalPos = new vec2(Math.random()*450, 200 + Math.random()*200);
    }
    else
    {
        owner.crystalPos = new vec2(560 + Math.random()*450, 200 + Math.random()*200);
    }
}

Crystals.prototype.forceSpawnCrystal = function(player)
{
    var crystal = Array();
    crystal.crystalPos = new vec2(player.pos.x + 100 * player.side, player.pos.y);
    table.insert(this.summoned, crystal);
}

Crystals.prototype.addShards = function(shard)
{
    table.insert(this.shards, Array(new vec2(shard.x, shard.y), shard.val));
}

Crystals.prototype.draw = function()
{
    fill(255, 255, 255, 255);
    if ( this.shards[0] == null )
    {
        table.remove(this.shards, 0);
    }
    if ( this.summoned[0] == null )
    {
        table.remove(this.summoned, 0);
    }
    
    
    this.owners.forEach((owner) =>
    {
        var timer = owner.crystalTimer[0];
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
                    this.spawnCrystal(owner);
                }
                table.remove(owner.crystalTimer, 0);
            }
        }
        
        if ( owner.crystalReady )
        {
            fontSize(60);
            text("💎", owner.crystalPos.x, owner.crystalPos.y);
            players.some((player) =>
            {
                var dist = owner.crystalPos.dist(player.pos);
                if ( dist < 64 )
                {
                    if (player.crystals < 10)
                    {
                        player.crystals = player.crystals + 1;
                    }
                    player.mana = player.mana + 1;
                    
                    if (player.mana > player.crystals)
                    {
                        player.mana = player.crystals;
                    }

                    owner.crystalReady = false;
                    owner.crystalDelay = owner.crystalDelay + 3000;
                    table.insert(owner.crystalTimer, new Timer(owner.crystalDelay, "crystal"));
                    return true;
                }
            });
        }
    });
    
    this.summoned.forEach((player, index) =>
    {
        if ( crystal )
        {
            fontSize(60);
            text("💎", crystal.crystalPos.x, crystal.crystalPos.y);
            players.some((player) =>
            {
                var dist = crystal.crystalPos.dist(player.pos);
                if ( dist < 64 && ! crystal.taken )
                {
                    player.crystals = player.crystals + 1;
                    player.mana = player.mana + 1;
                    this.summoned[index] = null;
                    return true;
                }
            });
        }
    });
        
    fontSize(17);
    this.shards.forEach((shard, index) =>
    {
        if ( shard )
        {
            text(shard[1] + "💎", shard[0].x, shard[0].y);
            players.some((player) =>
            {
                var dist = shard[0].dist(player.pos);
                if ( dist < 64 )
                {
                    player.mana = player.mana + shard[1];
                    this.shards[index] = null;
                    return true;
                }
            });
        }
    });
}

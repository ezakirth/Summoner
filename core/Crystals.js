Crystals = class();

function Crystals:init()
{
    this.shards = {}
    
    this.p1 = {}
    this.p1.crystalPos = nil;
    this.p1.crystalDelay = 3;
    this.p1.crystalCount = 0;
    this.p1.crystalReady = false;
    this.p1.crystalTimer = {}

    this.p2 = {}
    this.p2.crystalPos = nil;
    this.p2.crystalDelay = 3;
    this.p2.crystalCount = 0;
    this.p2.crystalReady = false;
    this.p2.crystalTimer = {}
    
    this.owners = {}
    table.insert(this.owners, this.p1);
    table.insert(this.owners, this.p2);

    this.summoned = {}
    
    table.insert(this.p1.crystalTimer, Timer(this.p1.crystalDelay, "crystal"));
    table.insert(this.p2.crystalTimer, Timer(this.p2.crystalDelay, "crystal"))    ;
}

function Crystals:spawnCrystal(owner)
{
    owner.crystalReady = true;
    if ( owner == this.p1 ) {
        owner.crystalPos = vec2(math.random(450), 200 + math.random(200));
    } else {
        owner.crystalPos = vec2(560 + math.random(450), 200 + math.random(200));
    }
}

function Crystals:forceSpawnCrystal(player)
{
    var crystal = {}
    crystal.crystalPos = vec2(player.pos.x + 100 * player.side, player.pos.y);
    table.insert(this.summoned, crystal);
}

function Crystals:addShards(shard)
{
    table.insert(this.shards, {vec2(shard.x, shard.y), shard.z});
}

function Crystals:draw()
{
    fill(255, 255, 255, 255);
    if ( this.shards[1] == nil ) {
        table.remove(this.shards, 1);
    }
    if ( this.summoned[1] == nil ) {
        table.remove(this.summoned, 1);
    }
    
    
    for ( _, owner in ipairs(this.owners) ) {
        var timer = owner.crystalTimer[1];
        if ( timer ) {
            if ( not timer.started ) {
                timer:reset();
            }
            if ( timer:isDone() ) {
                if ( timer.id == "crystal" ) {
                    this:spawnCrystal(owner);
                }
                table.remove(owner.crystalTimer, 1);
            }
        }
        
        if ( owner.crystalReady ) {
            fontSize(60);
            text("💎", owner.crystalPos.x, owner.crystalPos.y);
            for ( _, player in ipairs(players) ) {
                var dist = owner.crystalPos:dist(player.pos);
                if ( dist < 64 ) {
                    player.crystals = player.crystals + 1;
                    player.mana = player.mana + 1;
                    
                    owner.crystalReady = false;
                    owner.crystalDelay = owner.crystalDelay + 3;
                    table.insert(owner.crystalTimer, Timer(owner.crystalDelay, "crystal"));
                    break;
                }
            }
        }
    }
    
    for ( index, crystal in ipairs(this.summoned) ) {
        if ( crystal ) {
            fontSize(60);
            text("💎", crystal.crystalPos.x, crystal.crystalPos.y);
            for ( _, player in ipairs(players) ) {
                var dist = crystal.crystalPos:dist(player.pos);
                if ( dist < 64 and not crystal.taken ) {
                    player.crystals = player.crystals + 1;
                    player.mana = player.mana + 1;
                    this.summoned[index] = nil;
                    break;
                }
            }
        }
    }
        
    fontSize(17);
    for ( index, shard in ipairs(this.shards) ) {
        if ( shard ) {
            text(shard[2] .. "💎", shard[1].x, shard[1].y);
            for ( _, player in ipairs(players) ) {
                var dist = shard[1]:dist(player.pos);
                if ( dist < 64 ) {
                    player.mana = player.mana + shard[2];
                    this.shards[index] = nil;
                    break;
                }
            }
        }
    }
}

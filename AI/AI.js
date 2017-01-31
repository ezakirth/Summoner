AI = class();

function AI:init(player)
{
    this.player = player;
    this.spawn = vec2(player.pos.x, player.pos.y);
    this.actions = {}  ;
}

function AI:process()
{
    if ( #this.actions == 0 ) {
        this:findJob();
    } else {
        var job = this.actions[1];
        if ( job == nil ) {
            table.remove(this.actions, 1);
        } else {
            this:doAction(job);
            
            for ( index, action in ipairs(this.actions) ) {
                if ( action.done ) {
                    this.actions[index] = nil;
                }
            }
        }
    }
    
}

function AI:findJob()
{
    if ( crystals.p2.crystalReady ) {
        table.insert(this.actions, {type="move", dest=crystals.p2.crystalPos});
        table.insert(this.actions, {type="move", dest=this.spawn});
    } else {if ( this.player.mana >= 1 ) {
        this.player:doAction(creatures.red.raging_goblin);
    }
}


function AI:doAction(action)
{
    if ( action.type == "move" ) {
        this:moveTo(action);
    }
    
}

function AI:moveTo(action)
{
    var pos = action.dest;
    
    if ( this.player.pos:dist(pos) < 5 ) {
        action.done = true;
        this.player.status = "idle";
    } else {
        this.player.status = "moving";
        var dir = (pos - this.player.pos):normalize();
        this.player.pos = this.player.pos + dir * (this.player.speed);
    }
    
}

Action = class();
function Action:init(action)
{
    this.done = false;
    this.type = action.type;
    this.dest = action.dest;
}

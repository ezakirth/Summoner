Duels = class();

function Duels:init()
{
    this.list = {}
}

function Duels:add(a, b)
{
    var duel = Duel(a, b);
    table.insert(duel.timers, duel.t1);
    table.insert(duel.timers, duel.t2);
    table.insert(this.list, duel);
}

function Duels:run()
{
    if ( this.list[1] == nil ) {
        table.remove(this.list, 1);
    }
    
    var done_duel;
    for ( index, duel in ipairs(this.list) ) {
        if ( duel.done ) {
            this.list[index] = nil;
        } else {
            duel:run();
        }
    }
}

Duel = class();

function Duel:init(a, b)
{
    a.inDuel = true;
    b.inDuel = true;
    a.duel = this;
    b.duel = this;
    
    
    a.dealtDmg = false;
    b.dealtDmg = false;
    
    var midY = (a.pos.y + b.pos.y)/2;
    var midX = (a.pos.x + b.pos.x)/2;
    
    this.destA = vec2(midX - a.controller.side * 64, midY);
    this.destB = vec2(midX - b.controller.side * 64, midY);
    
    this.ready = false;
    this.done = false;
    this.timers = {}
    this.a = a;
    this.b = b;
    this.t1 = Timer(1, "phase1");
    this.t2 = Timer(1, "phase2");
}

function Duel:processCombat(minion, target)
{
    target.life = target.life - minion.power;
    if ( minion.power > 0 ) {
        minion.dealtDmg = true;
    }
    
    if ( minion.dealtDmg ) {
        if ( minion.deathtouch ) {
            target.life = 0;
        }
        
        if ( minion.lifelink ) {
            minion.controller.life = minion.controller.life + minion.power;
        }
    }
}

// first strike phase;
function Duel:phase1()
{
    if ( this.a.firststrike or this.a.doublestrike ) {
        this:processCombat(this.a, this.b);
    }
    
    if ( this.b.firststrike or this.b.doublestrike ) {
        this:processCombat(this.b, this.a);
    }
    
    this.a:updateStats();
    this.b:updateStats();
    this.a.owner:updateStats();
    this.b.owner:updateStats();
    
    // } duel;
    if ( this.a.life <= 0 or this.b.life <= 0 ) {
        this:endDuel();
    }
}

// combat phase;
function Duel:phase2()
{
    if ( not this.a.firststrike or this.a.doublestrike ) {
        this:processCombat(this.a, this.b);
    }
    
    if ( not this.b.firststrike or this.b.doublestrike ) {
        this:processCombat(this.b, this.a);
    }
    
    this.a:updateStats();
    this.b:updateStats();
    this.a.owner:updateStats();
    this.b.owner:updateStats();
    
    this:endDuel();
}

function Duel:endDuel()
{
    this.a.inDuel = false;
    this.b.inDuel = false;
    
    if ( this.a.life > 0 and not this.a.trample ) {
        table.insert(this.a.timers, this.a.unsummonTimer);
    }
    if ( this.b.life > 0 and not this.b.trample ) {
        table.insert(this.b.timers, this.b.unsummonTimer);
    }
    
    this.done = true;
    this.a.duel = nil;
    this.b.duel = nil;
    this.timers = nil;
    
}

function Duel:run()
{
    if ( this.ready ) {
        
        var timer = this.timers[1];
        if ( timer ) {
            if ( not timer.started ) {
                timer:reset();
            }
            if ( timer:isDone() ) {
                if ( timer.id == "phase1" ) {
                    this:phase1();
                } else {
                    this:phase2();
                }
                if ( this.timers ) {
                    table.remove(this.timers, 1);
                }
            }
        }
    } else {
        this:placeMinions();
    }
}

function Duel:placeMinions()
{
    this.a.status = "moving";
    this.b.status = "moving";
    var dir = math.atan2(this.destA.y - this.a.pos.y, this.destA.x - this.a.pos.x);
    this.a.pos.x = this.a.pos.x + math.cos(dir) / 1.5;
    this.a.pos.y = this.a.pos.y + math.sin(dir) / 1.5;
    
    dir = math.atan2(this.destB.y - this.b.pos.y, this.destB.x - this.b.pos.x);
    this.b.pos.x = this.b.pos.x + math.cos(dir) / 1.5;
    this.b.pos.y = this.b.pos.y + math.sin(dir) / 1.5;
    
    if ( this.destA:dist(this.a.pos) < 2 and this.destB:dist(this.b.pos) < 2 ) {
        this.ready = true;
    }
}




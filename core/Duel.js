function Duel(a, b) {
    a.inDuel = true;
    b.inDuel = true;
    a.duel = this;
    b.duel = this;


    a.dealtDmg = false;
    b.dealtDmg = false;

    var midY = (a.pos.y + b.pos.y) / 2;
    var midX = (a.pos.x + b.pos.x) / 2;

    this.destA = new vec2(midX - a.controller.side * 32, midY);
    this.destB = new vec2(midX - b.controller.side * 32, midY);

    this.ready = false;
    this.done = false;
    this.timers = Array();
    this.a = a;
    this.b = b;
    this.t1 = new Timer(1000, "phase1");
    this.t2 = new Timer(1000, "phase2");
}

Duel.prototype.processCombat = function (minion, target) {
    target.life = target.life - minion.power;
    if (minion.power > 0) {
        minion.dealtDmg = true;
    }

    if (minion.dealtDmg) {
        if (minion.deathtouch) {
            target.life = 0;
        }

        if (minion.lifelink) {
            minion.controller.life = minion.controller.life + minion.power;
        }
    }
}

// first strike phase;
Duel.prototype.phase1 = function () {
    if (this.a.firststrike || this.a.doublestrike) {
        this.processCombat(this.a, this.b);
    }

    if (this.b.firststrike || this.b.doublestrike) {
        this.processCombat(this.b, this.a);
    }

    this.a.updateStats();
    this.b.updateStats();
    this.a.owner.updateStats();
    this.b.owner.updateStats();

    // end duel;
    if (this.a.life <= 0 || this.b.life <= 0) {
        this.endDuel();
    }
}

// combat phase;
Duel.prototype.phase2 = function () {
    if (!this.a.firststrike || this.a.doublestrike) {
        this.processCombat(this.a, this.b);
    }

    if (!this.b.firststrike || this.b.doublestrike) {
        this.processCombat(this.b, this.a);
    }

    this.a.updateStats();
    this.b.updateStats();
    this.a.owner.updateStats();
    this.b.owner.updateStats();

    this.endDuel();
}

Duel.prototype.endDuel = function () {
    this.a.inDuel = false;
    this.b.inDuel = false;

    if (this.a.life > 0 && !this.a.trample) {
        this.a.timers.push(this.a.unsummonTimer);
    }
    if (this.b.life > 0 && !this.b.trample) {
        this.b.timers.push(this.b.unsummonTimer);
    }

    this.done = true;
    this.a.duel = null;
    this.b.duel = null;
    this.timers = null;

}

Duel.prototype.run = function () {
    if (this.ready) {

        var timer = this.timers[0];
        if (timer) {
            if (!timer.started) {
                timer.reset();
            }
            if (timer.isDone()) {
                if (timer.id == "phase1") {
                    this.phase1();
                } else {
                    this.phase2();
                }

                if (this.timers) {
                    this.timers.splice(0, 1);
                }
            }
        }
    } else {
        this.placeMinions();
    }
}

Duel.prototype.placeMinions = function () {
    this.a.status = "moving";
    this.b.status = "moving";
    var dir = Math.atan2(this.destA.y - this.a.pos.y, this.destA.x - this.a.pos.x);
    this.a.pos.x += game_speed * Math.cos(dir) / 1.5;
    this.a.pos.y += game_speed * Math.sin(dir) / 1.5;

    dir = Math.atan2(this.destB.y - this.b.pos.y, this.destB.x - this.b.pos.x);
    this.b.pos.x += game_speed * Math.cos(dir) / 1.5;
    this.b.pos.y += game_speed * Math.sin(dir) / 1.5;

    if (this.destA.dist(this.a.pos) < 2 && this.destB.dist(this.b.pos) < 2) {
        this.ready = true;
    }
}
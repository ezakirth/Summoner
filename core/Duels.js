function Duels() {
    this.list = new Array();
}

Duels.prototype.add = function (a, b) {
    var duel = new Duel(a, b);
    duel.timers.push(duel.t1);
    duel.timers.push(duel.t2);
    this.list.push(duel);
}

Duels.prototype.run = function () {
    if (this.list[0] == null) {
        this.list.shift();
    }

    var done_duel;
    this.list.forEach((duel, index) => {
        if (duel)
        {
            if (duel.done) {
                this.list[index] = null;
            } else {
                duel.run();
            }
        }
    });
}
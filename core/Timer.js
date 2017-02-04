function Timer(sec, id) {
    this.delay = sec;
    this.max = ElapsedTime + this.delay;
    this.done = true;
    this.started = false;
    this.id = id;
}

Timer.prototype.reset = function () {
    this.done = false;
    this.started = true;
    this.max = ElapsedTime + this.delay;
}

Timer.prototype.isDone = function () {
    if (ElapsedTime > this.max) {
        this.done = true;
        this.started = false;
    }
    return this.done;
}
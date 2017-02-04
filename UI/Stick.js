function Stick(owner) {
    this.owner = owner;
    this.active = false;
    this.pos = new vec2();
    this.origin = new vec2();
    this.dist = 0;
}

Stick.prototype.render = function () {
    if (!this.owner.activeTimer()) {
        this.owner.status = "idle";
    }

    if (this.active) {
        if (!this.owner.activeTimer()) {
            this.owner.status = "moving";

            var vec = new vec2(this.pos.x - this.origin.x, this.pos.y - this.origin.y);
            var dir = new vec2(0, 0);
            if (vec.x != dir.x && vec.y != dir.y) {
                dir = vec.normalize();
            }

            this.owner.pos.x += game_speed * dir.x * this.owner.speed * this.dist / 50;
            this.owner.pos.y += game_speed * dir.y * this.owner.speed * this.dist / 50;




        }


    }
}

Stick.prototype.touched = function (touch) {
    this.active = true;
    if (touch.state == BEGAN) {
        this.origin.x = touch.x;
        this.origin.y = touch.y;
    }

    if (touch.state == ENDED) {
        this.active = false;
    }

    this.pos.x = touch.x;
    this.pos.y = touch.y;

    this.dist = this.pos.dist(this.origin);
    if (this.dist > 50) {
        this.dist = 50
    }
}
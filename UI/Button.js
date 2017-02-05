function Button(obj, owner, pos, page) {
    this.owner = owner;

    this.pos = obj.pos;
    this.color = obj.color;
    this.name = obj.name;
    this.type = obj.type;
    this.icon = obj.icon;
    this.cost = obj.cost || 0;
    this.id = obj.id;

    this.cost = this.setStat(this.cost);

    this.text = {};
    this.text.icon = game.add.text(0, 0, this.icon, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fill: "#000000"
    });
    this.text.name = game.add.text(0, 0, this.name, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fill: "#000000",
        fontSize: 12
    });
    this.text.cost = game.add.text(0, 0, this.cost, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fill: "#000000",
        fontSize: 15
    });

    if (pos) {
        this.pos = new vec2(WIDTH - 64, HEIGHT - (520 - 192 - pos * 70));
    }
    this.page = page || 1;

    this.w = 64;
    this.h = 64;

    if (this.type != "action") {
        this.w = 128;
    }


}

Button.prototype.render = function () {
    if (this.type != "action") {
        this.text.icon.fontSize = 25;
        this.text.icon.setTextBounds(this.pos.x - this.w / 2, this.pos.y - this.h / 2 + 8, this.w, this.h);
        this.text.name.setTextBounds(this.pos.x - this.w / 2, this.pos.y + 12, this.w, this.h);
    } else {
        this.text.icon.fontSize = 40;
        this.text.icon.setTextBounds(this.pos.x - this.w / 2, this.pos.y - this.h / 2 + 6, this.w, this.h);
        this.text.name.setTextBounds(this.pos.x - this.w / 2, this.pos.y + 18, this.w, this.h);
    }


    if (this.type != "action") {
        if (this.id != "home" && this.id != "next") {
            this.text.name.setTextBounds(this.pos.x - this.w / 2, this.pos.y + 8, this.w, this.h);
        }

        this.text.cost.setTextBounds(this.pos.x - this.w / 2, this.pos.y + 18, this.w, this.h);
    }
}

Button.prototype.touched = function (touch) {
    var xr, xl, yt, yb, newpos = null;

    xr = this.pos.x + this.w / 2;
    xl = this.pos.x - this.w / 2;
    yt = this.pos.y + this.h / 2;
    yb = this.pos.y - this.h / 2;

    var touching = touch.x < xr && touch.x > xl && touch.y < yt && touch.y > yb;
    if (touching) {
        if (touch.state == BEGAN && this.type == "action") {
            if (this.id == "shield") {
                this.owner.shielding = true;
            }
            if (this.id == "sword") {
                this.owner.attack();
            }
        }

        if (touch.state == ENDED) {
            if (this.type == "button") {
                this.owner.gui.setPage(this.id);
            } else {
                if (this.type == "action") {
                    this.owner.shielding = false;
                } else {
                    this.owner.doAction(window[this.type][this.color][this.id]);
                }
            }
        }
    }
}

// convert numeral stats to graphics so it can be displayed;
Button.prototype.setStat = function (val) {
    var txt = "";
    for (var i = 1; i <= val; i++) {
        txt = txt + "•";
    }
    return txt;
}
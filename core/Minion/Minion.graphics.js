/**
 * @desc Generates the minion info text
 * @param void
 * @return void
 */
Minion.prototype.setupText = function()
{
    this.text = {};
    this.text.name = game.add.text(0, 0, this.name, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fontSize: 12,
        fill: "#ffffff"
    });
    this.text.action = game.add.text(0, 0, this.status, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fontSize: 10,
        fill: "#ffffff"
    });
    this.text.powerText = game.add.text(0, 0, this.powerText, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fontSize: 17,
        fill: "#00ff00"
    });
    this.text.lifeText = game.add.text(0, 0, this.lifeText, {
        boundsAlignH: "center",
        boundsAlignV: "center",
        fontSize: 17,
        fill: "#ff0000"
    });

    drawText(this.text.name, this.name + " " + this.buffs, this.pos.x - 80, this.pos.y - 100 - this.offset, 160, 160);
    drawText(this.text.action, "", this.pos.x - 80, this.pos.y + 10 - this.offset, 160, 160);
    drawText(this.text.lifeText, this.lifeText, this.pos.x - 80, this.pos.y + 20 - this.offset, 160, 160);
    drawText(this.text.powerText, this.powerText, this.pos.x - 80, this.pos.y + 39 - this.offset, 160, 160);
    

    Layers.sprites.add(this.text.name);
    Layers.sprites.add(this.text.action);
    Layers.sprites.add(this.text.lifeText);
    Layers.sprites.add(this.text.powerText);
};


/**
 * @desc Generates the minion sprite
 * @param void
 * @return void
 */
Minion.prototype.setupSprite = function()
{
    this.sprites = {};

    if (this.flying) {
        this.sprites.model = game.add.image(this.pos.x, this.pos.y, 'bat');
        this.sprites.model.animations.add('idle', [0]);
        this.sprites.model.animations.add('moving', [0, 1, 2, 3]);
        this.sprites.model.animations.add('death', [8, 9, 10, 11, 12, 13]);
        this.sprites.model.animations.add('hurt', [16, 17]);
        this.sprites.model.animations.add('attack', [24, 25, 26, 27, 28, 29, 30, 31]);
        this.sprites.model.anchor.setTo(.5, 1.25);
    } else {
        this.sprites.model = game.add.image(this.pos.x, this.pos.y, 'goblin');
        this.sprites.model.animations.add('idle', [16]);
        this.sprites.model.animations.add('moving', [0, 1, 2, 3, 4, 5, 6, 7]);
        this.sprites.model.animations.add('death', [8, 9, 10, 11, 12, 13, 14]);
        this.sprites.model.animations.add('attack', [16, 17, 18, 19, 20, 21]);
        this.sprites.model.animations.add('hurt', [24, 25, 26, 27]);
        this.sprites.model.anchor.setTo(.5, .8);
    }

    Layers.sprites.add(this.sprites.model);

    this.sprites.spell = game.add.image(this.pos.x, this.pos.y, 'smoke');
    this.sprites.spell.animations.add('poof');
    this.sprites.spell.anchor.setTo(.5, .8);
    Layers.sprites.add(this.sprites.spell);

    this.sprites.shadow = game.add.image(this.pos.x - 5 * this.owner.side, this.pos.y, 'shadow');
    this.sprites.shadow.anchor.setTo(.5, .5);
    Layers.shadows.add(this.sprites.shadow);

    this.sprites.spawn = game.add.image(this.pos.x - 5 * this.owner.side, this.pos.y, 'spawn');
    this.sprites.spawn.anchor.setTo(.5, .5);
    Layers.bg.add(this.sprites.spawn);



    this.sprites.model.scale.x = this.owner.side * -1;

    this.sprites.model.x = this.pos.x;
    this.sprites.model.y = this.pos.y;

    this.sprites.spell.x = this.pos.x;
    this.sprites.spell.y = this.pos.y;
    this.sprites.spell.animations.play('poof', 10, false);
};


/**
 * @desc Updates the minion model
 * @param void
 * @return void
 */
Minion.prototype.render = function () {
    var tmp_action = "moving";
    if (this.blocking && !this.forceattack) {
        tmp_action = "blocking";
    }


    var action = this.activeTimer() || tmp_action;

    this.sprites.spawn.scale.setTo(1 + Math.sin(ElapsedTime / 250) / 10, 1 + Math.sin(ElapsedTime / 250) / 10);

    if (this.isVisible()) {

        this.sprites.shadow.position.setTo(this.pos.x - 5 * this.owner.side, this.pos.y);

        if (action == "moving") {
            this.sprites.shadow.width = 64 - this.offset / 3 + (64 - this.offset / 3) * Math.sin(ElapsedTime / 60) / 10;
        } else {
            this.sprites.shadow.width = 64 - this.offset / 3 + (64 - this.offset / 3) * Math.sin(ElapsedTime / 250) / 10;
        }

        drawText(this.text.name, this.name + " " + this.buffs, this.pos.x - 80, this.pos.y - 100 - this.offset, 160, 160);
        drawText(this.text.action, action, this.pos.x - 80, this.pos.y + 10 - this.offset, 160, 160);
        drawText(this.text.lifeText, this.lifeText, this.pos.x - 80, this.pos.y + 20 - this.offset, 160, 160);
        drawText(this.text.powerText, this.powerText, this.pos.x - 80, this.pos.y + 39 - this.offset, 160, 160);


    }

    this.sprites.model.x = this.pos.x;
    this.sprites.model.y = this.pos.y;

    if (this.status == "death") {
        this.sprites.model.animations.play(this.status, 7, true);
    } else
    if (this.status == "attack") {
        this.sprites.model.animations.play(this.status, 12, true);
    } else {
        this.sprites.model.animations.play(this.status, 10, true);
    }

};


/**
 * @desc Shows the minion model
 * @param void
 * @return void
 */
Minion.prototype.show = function ()
{
    this.text.name.alpha = 1;
    this.text.action.alpha = 1;
    this.text.powerText.alpha = 1;
    this.text.lifeText.alpha = 1;
    this.sprites.model.visible = true;
    this.sprites.shadow.visible = true;
};

/**
 * @desc Hides the minion model
 * @param void
 * @return void
 */
Minion.prototype.hide = function ()
{
    this.text.name.alpha = 0;
    this.text.action.alpha = 0;
    this.text.powerText.alpha = 0;
    this.text.lifeText.alpha = 0;
    this.sprites.model.visible = false;
    this.sprites.shadow.visible = false;
};
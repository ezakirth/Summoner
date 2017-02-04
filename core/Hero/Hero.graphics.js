/**
 * @desc Generates the player info text
 * @param void
 * @return void
 */
Hero.prototype.setupText = function()
{
    this.text = {
        name : game.add.text(0, 0, this.name, {boundsAlignH: "center", boundsAlignV: "center"}),
        dialog : game.add.text(0, 0, "", {boundsAlignH: "center", boundsAlignV: "center"}),
        action : game.add.text(0, 0, this.status, {boundsAlignH: "center", boundsAlignV: "center"}),
        manaText : game.add.text(0, 0, this.manaText, {boundsAlignH: "center", boundsAlignV: "center"}),
        lifeText : game.add.text(0, 0, this.life + " " + this.lifeText, {boundsAlignH: "center", boundsAlignV: "center"}),
    };

    Layers.sprites.add(this.text.name);
    Layers.sprites.add(this.text.dialog);
    Layers.sprites.add(this.text.action);
    Layers.sprites.add(this.text.manaText);
    Layers.sprites.add(this.text.lifeText);    
};


/**
 * @desc Generates the player sprite
 * @param void
 * @return void
 */
Hero.prototype.setupSprite = function()
{
    this.sprites = {};
    this.sprites.model = game.add.image(this.pos.x, this.pos.y, 'knight');
    this.sprites.model.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7]);
    this.sprites.model.animations.add('moving', [12, 13, 14, 15, 16, 17, 18, 19]);
    this.sprites.model.animations.add('death', [24, 25, 26, 27, 28, 29, 30, 31]);
    this.sprites.model.animations.add('attack', [36, 38, 39, 40, 43, 46]);
    //		this.sprites.model.animations.add('attack', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
    this.sprites.model.anchor.setTo(.5, 1);

    this.sprites.shadow = game.add.image(this.pos.x + 5, this.pos.y + 60, 'shadow');
    this.sprites.shadow.anchor.setTo(.5, .5);

    Layers.sprites.add(this.sprites.model);
    Layers.shadows.add(this.sprites.shadow);
};

/**
 * @desc Updates the player model
 * @param void
 * @return void
 */
Hero.prototype.render = function ()
{
    var action = this.activeTimer() || this.status;

    this.sprites.shadow.position.setTo(this.pos.x, this.pos.y);

    if (this.status == "moving")
        this.sprites.shadow.width = 96 + 64 * Math.sin(ElapsedTime / 60) / 10;
    else
        this.sprites.shadow.width = 96 + 64 * Math.sin(ElapsedTime / 250) / 10;

    if (this.shielding) {
        // draw shielding
    }

    if (action == "attack" || this.castSpell)
    {
        var name = "";
        if (action == "attack")
        {
            name = "Die !";
        }
        else
        {
            if (this.castSpell)
            {
                name = this.castSpell.name + " !";
            }
        }

        // draw text bubble
        //Graphics.drawRect(this.pos.x - (10 + 10*name.length)/2 + 100*this.side, this.pos.y - 96 , 10 + 10*name.length, 60);
        drawText(this.text.dialog, 17, rgbToHex(0, 0, 0, 255), name, this.pos.x - (10 + 10 * name.length) / 2 + 100 * this.side, this.pos.y - 74, 10 + 10 * name.length, 60);
        this.text.dialog.alpha = 1;
    }
    else
    {
        this.text.dialog.alpha = 0;
    }

    drawText(this.text.name, 17, rgbToHex(255, 255, 255, 255), this.name, this.pos.x - 80, this.pos.y - 140, 160, 160);
    drawText(this.text.action, 10, rgbToHex(255, 255, 255, 255), action, this.pos.x - 80, this.pos.y, 160, 160);
    drawText(this.text.lifeText, 17, rgbToHex(0, 255, 0, 255), this.life + " " + this.lifeText, this.pos.x - 80, this.pos.y + 12, 160, 160);
    drawText(this.text.manaText, 8, rgbToHex(0, 255, 255, 255), this.manaText, this.pos.x - 80, this.pos.y + 37, 160, 160);
};
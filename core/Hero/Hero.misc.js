
/**
 * @desc Converts the player stats from value to graphics
 * @param void
 * @return void
 */
Hero.prototype.updateStats = function ()
{
    this.lifeText = this.setStat(this.life);
    this.manaText = this.setMana(this.mana);
}

/**
 * @desc Convert numeral life to graphics so it can be displayed
 * @param void
 * @return string
 */
Hero.prototype.setStat = function (val)
{
    var txt = "";
    for (var i = 1; i <= val; i++)
    {
        txt = txt + "|";
    }
    return txt;
}

/**
 * @desc Convert numeral mana to graphics so it can be displayed
 * @param void
 * @return string
 */
Hero.prototype.setMana = function (val)
{
    var txt = "";
    for (var i = 1; i <= val; i++)
    {
        txt = txt + "🔵";
    }

    var empty = Math.ceil(this.crystal.count - val);
    for (var i = 1; i <= empty; i++)
    {
        txt = txt + "⚪️";
    }

    return txt;
};


/**
 * @desc Tests if an action is happening
 * @param void
 * @return bool or string
 */
Hero.prototype.activeTimer = function ()
{
    var timer = this.timers[0];
    if (timer)
        return timer.id;
    else
        return false;
};

/**
 * @desc Finds the closest friendly character
 * @param void
 * @return Array of targets
 */
Hero.prototype.closestFriendly = function ()
{
    var minions = this.allFriendlyMinions();
    var minDist = 9999;
    var closest = 0;
    var found = false;
    minions.forEach((minion, index) =>
    {
        var dist = this.pos.dist(minion.pos);
        if (dist < minDist && !minion.spellproof)
        {
            minDist = dist;
            closest = index;
            found = true;
        }
    });
    if (found)
        return new Array(minions[closest]);
    else
        return new Array();
}

/**
 * @desc Finds the closest enemy character
 * @param void
 * @return Array of targets
 */
Hero.prototype.closestEnemy = function ()
{
    var minion = this.closestEnemyMinion();
    if (minion[0])
        return minion;
    else
        return new Array(this.opponent);
}

/**
 * @desc Finds the closest character
 * @param void
 * @return Array of targets
 */
Hero.prototype.closestTarget = function ()
{
    var minion = this.closestMinion();
    if (minion[0])
        return minion;
    else
        return new Array(this.opponent);
}

/**
 * @desc Finds the closest enemy minion
 * @param void
 * @return Array of targets
 */
Hero.prototype.closestEnemyMinion = function ()
{
    var minions = this.allEnemyMinions();
    var minDist = 9999;
    var closest = 0;
    var found = false;
    minions.forEach((minion, index) =>
    {
        var dist = this.pos.dist(minion.pos);
        if (dist < minDist && !minion.spellproof)
        {
            minDist = dist;
            closest = index;
            found = true;
        }
    });
    if (found)
        return new Array(minions[closest]);
    else
        return new Array();
}

/**
 * @desc Finds the closest minion
 * @param void
 * @return Array of targets
 */
Hero.prototype.closestMinion = function () {
    var minions = this.allMinions();
    var minDist = 9999;
    var closest = 0;
    var found = false;
    minions.forEach((minion, index) => {
        var dist = this.pos.dist(minion.pos);
        if (dist < minDist && !minion.spellproof) {
            minDist = dist;
            closest = index;
            found = true;
        }
    });
    if (found)
        return new Array(minions[closest]);
    else
        return new Array();
}

/**
 * @desc Finds all friendly minions
 * @param void
 * @return Array of targets
 */
Hero.prototype.allFriendlyMinions = function (all) {
    var array = new Array();
    this.summons.forEach((minion) => {
        if (all || !(minion.dying || minion.dead)) {
            array.push(minion);
        }
    });
    return array;
}

/**
 * @desc Finds all enemy minions
 * @param void
 * @return Array of targets
 */
Hero.prototype.allEnemyMinions = function (all) {
    var array = new Array();
    this.opponent.summons.forEach((minion) => {
        if (all || !(minion.dying || minion.dead)) {
            array.push(minion);
        }
    });
    return array;
}

/**
 * @desc Finds all minions
 * @param void
 * @return Array of targets
 */
Hero.prototype.allMinions = function (all) {
    var array = new Array();
    var enemies = this.allEnemyMinions(all);
    var friendlies = this.allFriendlyMinions(all);
    enemies.forEach((minion) => {
        array.push(minion);
    });
    friendlies.forEach((minion) => {
        array.push(minion);
    });
    return array;
}

/**
 * @desc Finds all characters
 * @param void
 * @return Array of targets
 */
Hero.prototype.all = function (all) {
    var array = this.allMinions(all);
    array.push(this);
    array.push(this.opponent);
    return array;
}

/**
 * @desc Finds the enemy hero
 * @param void
 * @return Array of targets
 */
Hero.prototype.enemyHero = function () {
    return new Array(this.opponent);
}

/**
 * @desc Finds the friendly hero
 * @param void
 * @return Array of targets
 */
Hero.prototype.friendlyHero = function () {
    return new Array(this);
}

/**
 * @desc Finds all heroes
 * @param void
 * @return Array of targets
 */
Hero.prototype.allHeroes = function () {
    return new Array(this, this.opponent);
}

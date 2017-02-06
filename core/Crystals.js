/**
 * @desc Crystal handling class
 * @param void
 * @return void
 */
function Crystals() {
    this.crystals = Array();
}


/**
 * @desc Generates a mana crystal of shard
 * @param string:type, vec2:pos, Hero:owner
 * @return object
 */
Crystals.prototype.generateCrystal = function (type, pos, owner) {
    var crystal = {};
    crystal.owner = owner;
    crystal.pos = new vec2(pos.x, pos.y);
    crystal.type = type;
    crystal.value = (type == "crystal") ? 1 : .5;;
    crystal.capIncrease = (type == "crystal") ? 1 : 0;

    this.setupSprite(crystal, pos);

    Layers.sprites.add(crystal.model);
    Layers.shadows.add(crystal.shadow);

    return crystal;
};

/**
 * @desc Generates a crystal sprite
 * @param object:crystal, vec2:pos
 * @return void
 */
Crystals.prototype.setupSprite = function (crystal, pos) {
    crystal.model = game.add.image(pos.x, pos.y, 'crystal_blue');
    crystal.model.anchor.setTo(.5, 1);
    crystal.model.animations.add('rotate');
    crystal.model.animations.play('rotate', 16, true);
    crystal.model.scale.setTo(crystal.value, crystal.value);

    crystal.shadow = game.add.image(pos.x, pos.y, 'shadow');
    crystal.shadow.anchor.setTo(.5, .5);
    crystal.shadow.scale.setTo(crystal.value, crystal.value);
}

/**
 * @desc Generates a crystal
 * @param vec2:pos, Hero:owner
 * @return void
 */
Crystals.prototype.addCrystal = function (pos, owner) {
    var crystal = this.generateCrystal("crystal", pos, owner);

    this.crystals.push(crystal);
};

/**
 * @desc Generates shards
 * @param vec2:pos, float:value
 * @return void
 */
Crystals.prototype.addShards = function (pos, value) {
    var nb_shards = Math.ceil(value);
    var shard, px, py;

    for (var i = 0; i < nb_shards; i++) {
        px = pos.x + (-.5 + Math.random()) * 50
        py = pos.y + (-.5 + Math.random()) * 50

        shard = this.generateCrystal("shard", new vec2(px, py), null);

        this.crystals.push(shard);
    }
};


/**
 * @desc Crystal spawn timer processing
 * @param void
 * @return void
 */
Crystals.prototype.processTimers = function () {
    // removed crystals that have been picked up
    if (this.crystals[0] == null) {
        this.crystals.shift();
    }

    players.forEach((player) =>
    {
        // get first available timer
        var timer = player.crystal.timer[0];
        if (timer)
        {
            if (!timer.started)
            {
                timer.reset();
            }

            // spawn a crystal once the timer is complete
            if (timer.isDone())
            {
                if (timer.id == "crystal")
                {
                    player.crystal.ready = true;
                    var offset = (player == p1) ? 0 : WIDTH / 2;
                    // if crystal is for player2, spawn it on the right side of the screen
                    player.crystal.pos = new vec2(offset + Math.random() * WIDTH / 2, Math.random() * (HEIGHT - 200) + 200);

                    this.addCrystal(player.crystal.pos, player);
                }
                // remove used up timer
                player.crystal.timer.shift();
            }
        }
    });
};

/**
 * @desc Crystal pickup processing
 * @param void
 * @return void
 */
Crystals.prototype.processCrystals = function () {
    // test each crystal against players
    this.crystals.forEach((crystal, index) =>
    {
        players.some((player) =>
        {
            if (crystal)
            {
                // if a player collides with the crystal, pick it up
                var speed_val = game_speed;
                if (speed_val < 5)
                    speed_val = 5;
                if (crystal.pos.dist(player.pos) < 64 * (speed_val/5))
                {
                    player.mana += crystal.value;
                    player.crystal.count += crystal.capIncrease;

                    // if the crystal wasn't summoned by a player
                    if (crystal.type == "crystal" && crystal.owner)
                    {
                        // add respawn delay only if crystal wasn't stolen
                        if (crystal.owner == player)
                        {
                            crystal.owner.crystal.delay += 3000;
                        }
                        crystal.owner.crystal.ready = false;

                        // start new crystal timer
                        if (crystal.owner.crystal.count < 10)
                            crystal.owner.crystal.timer.push(new Timer(crystal.owner.crystal.delay, "crystal"));
                    }
                    
                    // destroy phaser objects
                    crystal.model.destroy();
                    crystal.shadow.destroy();

                    this.crystals[index] = null;
                    return true;
                }
            }
        });
    });
};


/**
 * @desc Main process function
 * @param void
 * @return void
 */
Crystals.prototype.process = function () {
    this.processTimers();
    this.processCrystals();
};
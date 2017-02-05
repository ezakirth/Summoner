var game = null;
var Graphics = null;
var test = null;
var game_speed = 1;
var lastElapsedTime = 0;

WIDTH = 960;
HEIGHT = 640;
ElapsedTime = 0;
DeltaTime = 0;

var Sprite = null;
BEGAN = 1;
MOVING = 2;
ENDED = 0;

var Touch = {};
Touch.x = 0;
Touch.y = 0;
Touch.state = 0;

var bg = null;
var vignette = null;
var Layers = {};



game = new Phaser.Game(960, 640, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});

function preload() {
	game.time.advancedTiming = true;

	game.load.spritesheet('knight', 'assets/heroes/knight.png', 160, 160);
	game.load.spritesheet('goblin', 'assets/creatures/goblin.png', 160, 160);
	game.load.spritesheet('bat', 'assets/creatures/bat.png', 160, 160);
	game.load.spritesheet('crystal_blue', 'assets/crystals/crystal_blue.png', 64, 64);

	game.load.image('bg', 'assets/specials/bg.png');
	game.load.image('vignette', 'assets/specials/vignette.png');

	game.load.spritesheet('smoke', 'assets/specials/smoke.png', 256, 256);
	game.load.image('spawn', 'assets/specials/spawn.png');
	game.load.image('shadow', 'assets/specials/shadow.png');


}


function create() {
	Graphics = game.add.graphics();
	WIDTH = game.stage.width;
	HEIGHT = game.stage.height;

	bg = game.add.image(0, 0, 'bg');
	bg.width = WIDTH;
	bg.height = HEIGHT;

	Layers.bg = game.add.group();
	Layers.bg.z = 0;

	Layers.shadows = game.add.group();
	Layers.shadows.z = 1;

	Layers.sprites = game.add.group();
	Layers.sprites.z = 2;

	Layers.spells = game.add.group();
	Layers.spells.z = 3;


    // hero;
    p1 = new Hero(heroes.basic.green, true);
    p2 = new Hero(heroes.basic.blue);
    p1.opponent = p2;
    p2.opponent = p1;
    p1.pos = new vec2(200, 300);
    p2.pos = new vec2(WIDTH - 200, 300);

    p2.side = -1;
    p2.sprites.model.scale.x = p2.side;


    players = Array();
    players.push(p1);
    players.push(p2);

    crystals = new Crystals();
    duels = new Duels();

/*
	p2.crystal.count = 10;
	p2.mana = 10;

	p1.crystal.count = 10;
	p1.mana = 10;
*/

    ai = new AI(p1);
    ai2 = new AI(p2);
    ai.active = false;
   // ai2.active = false;



	Layers.bg.add(bg);


	vignette = game.add.image(0, 0, 'vignette');
	vignette.width = bg.width;
	vignette.height = bg.height;

}

function update() {
	ai.process();
	ai2.process();

	var entities = p1.all();
	entities.forEach((entity) => {
		entity.process();
	});

	duels.run();

	/*
		var mid = new vec2((p1.pos.x + p2.pos.x)/2, (p1.pos.y + p2.pos.y)/2);
		var dist = (new vec2(-128, 0).add(p1.pos)).dist(p2.pos.add(new vec2(128,0)));
		ortho(mid.x - dist/2 , mid.x + dist/2 , mid.y - (dist*3/4)/2, mid.y + (dist*3/4)/2);
	*/


	p1.enchantments.forEach((enchantment) => {
		//sprite("Planet Cute.Gem Green", 135, 505);
		//text(enchantment.name, 135, 505);
	});

	crystals.process();

	entities.forEach((entity) => {
		entity.render();
	});



	p1.gui.render();
	p1.gui.stick.render();





	inputHandler();

	game_speed = 1; //(game.time.elapsedMS*144)/1000;
	Layers.sprites.sort('y', Phaser.Group.SORT_ASCENDING);

	ElapsedTime = game.time.time - game.time._started;

	DeltaTime = ElapsedTime - lastElapsedTime;
	lastElapsedTime = ElapsedTime;

	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}



function touched(touch) {
	if (touch.x < WIDTH / 2) {
		p1.gui.stick.touched(touch);
	} else {
		p1.gui.touched(touch);
	}
}


function inputHandler() {




	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		p1.pos.y -= game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		p1.pos.y += game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		p1.pos.x -= game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		p1.pos.x += game_speed * p1.speed;
		p1.status = "moving";
	}


	if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
		game.camera.scale.x += .01;
		game.camera.scale.y += .01;
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
		game.camera.scale.x -= .01;
		game.camera.scale.y -= .01;

	}


	if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
		p1.attack();
	}


	if (p1.status == "attack") {
		p1.sprites.model.animations.play('attack', 12, false);
	} else {
		p1.sprites.model.animations.play(p1.status, 10, true);
	}

	p1.sprites.model.x = p1.pos.x;
	p1.sprites.model.y = p1.pos.y;

	p2.sprites.model.animations.play(p2.status, 10, true);
	p2.sprites.model.x = p2.pos.x;
	p2.sprites.model.y = p2.pos.y;

	if (game.input.mousePointer.isDown) {
		if (Touch.state == ENDED)
			Touch.state = BEGAN;
		else
			Touch.state = MOVING;

		Touch.x = game.input.mousePointer.x;
		Touch.y = game.input.mousePointer.y;
		touched(Touch)
	} else
	if (game.input.mousePointer.isUp && Touch.state != ENDED) {
		Touch.state = ENDED;
		Touch.x = game.input.mousePointer.x;
		Touch.y = game.input.mousePointer.y;
		touched(Touch)
	}
	/*
		if (game.input.pointer1.isDown)
	    {
	        if (Touch.state == ENDED)
	            Touch.state = BEGAN;
	        else
	            Touch.state = MOVING;

	        Touch.x = game.input.pointer1.x;
	        Touch.y = game.input.pointer1.y;
	        touched(Touch)
	    }
	    else
	    if (game.input.pointer1.isUp && Touch.state != ENDED)
	    {
	        Touch.state = ENDED;
	        Touch.x = game.input.pointer1.x;
	        Touch.y = game.input.pointer1.y;
	        touched(Touch)
	    }*/

}
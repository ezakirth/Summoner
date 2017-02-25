var game_speed = 1;


var game = null;
var Graphics = null;
var test = null;
var lastElapsedTime = 0;

WIDTH = 960;
HEIGHT = 640;
ElapsedTime = 0;
DeltaTime = 0;


var buttonsPressed = {
	home: false,
	next: false,
	creatures: false,
	sorcery: false,
	enchantments: false
};

var nextButtonPressed = false;

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


    players = new Array();
    // hero;
    p1 = new Hero(heroes.basic.green, true);
    players.push(p1);
    p2 = new Hero(heroes.basic.red);
    players.push(p2);

    p1.opponent = p2;
    p2.opponent = p1;
    p1.pos = new vec2(200, 300);
    p2.pos = new vec2(WIDTH - 200, 300);




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
 //   ai2.active = false;



	Layers.bg.add(bg);


	vignette = game.add.image(0, 0, 'vignette');
	vignette.width = bg.width;
	vignette.height = bg.height;

}

function update() {
	ai.process();
	ai2.process();

	var entities = p1.all(true);
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

//	game_speed = (game.time.elapsedMS*144)/1000;

	if (game_speed > 10)
		game_speed = 10;

	Layers.sprites.sort('y', Phaser.Group.SORT_ASCENDING);

	ElapsedTime = (game.time.time - game.time._started)*game_speed;

	DeltaTime = ElapsedTime - lastElapsedTime;
	lastElapsedTime = ElapsedTime;

	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}




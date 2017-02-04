var game = null;
var Graphics = null;
var test = null;
var game_speed = 1;

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
var center = null;


window.onload = function()
{
	game = new Phaser.Game(960, 640, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	
	function preload ()
	{
		game.time.advancedTiming = true;

		game.load.spritesheet('knight', 'assets/heroes/knight.png', 160, 160);
		game.load.spritesheet('goblin', 'assets/creatures/goblin.png', 160, 160);
		game.load.spritesheet('bat', 'assets/creatures/bat.png', 160, 160);


		game.load.image('bg', 'assets/specials/bg.png');
		game.load.image('vignette', 'assets/specials/vignette.png');

		game.load.spritesheet('smoke', 'assets/specials/smoke.png', 256, 256);
		game.load.image('spawn', 'assets/specials/spawn.png');
		game.load.image('shadow', 'assets/specials/shadow.png');


	}


	function create ()
	{
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

		setup();

		p1.sprites.model = game.add.sprite(p1.pos.x, p1.pos.y, 'knight');
		p1.sprites.model.animations.add('idle',   [0, 1, 2, 3, 4, 5, 6, 7]);
		p1.sprites.model.animations.add('moving',   [12, 13, 14, 15, 16, 17, 18, 19]);
		p1.sprites.model.animations.add('death',   [24, 25, 26, 27, 28, 29, 30, 31]);
		p1.sprites.model.animations.add('attack', [36, 38, 39, 40, 43, 46]);
//		p1.sprites.model.animations.add('attack', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
		p1.sprites.model.anchor.setTo(.5, 1);

		p2.sprites.model = game.add.sprite(p2.pos.x -70, p2.pos.y - 100, 'knight');
		p2.sprites.model.animations.add('idle',   [0, 1, 2, 3, 4, 5, 6, 7]);
		p2.sprites.model.animations.add('moving',   [12, 13, 14, 15, 16, 17, 18, 19]);
		p2.sprites.model.animations.add('death',   [24, 25, 26, 27, 28, 29, 30, 31]);
		p2.sprites.model.animations.add('attack', [36, 38, 39, 40, 43, 46]);
//		p2.sprites.model.animations.add('attack', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
		p2.sprites.model.anchor.setTo(.5, 1);
		p2.sprites.model.scale.x = -1


		center = game.add.sprite(0, 0);


		p1.sprites.shadow = game.add.image(p1.pos.x + 5, p1.pos.y + 60, 'shadow');
		p2.sprites.shadow = game.add.image(p2.pos.x + 5, p2.pos.y + 60, 'shadow');
		p1.sprites.shadow.anchor.setTo(.5, .5);
		p2.sprites.shadow.anchor.setTo(.5, .5);

		Layers.sprites.add(p1.sprites.model);
		Layers.sprites.add(p2.sprites.model);

		Layers.bg.add(bg);
		Layers.shadows.add(p1.sprites.shadow);
		Layers.shadows.add(p2.sprites.shadow);


		vignette = game.add.image(0, 0, 'vignette');
		vignette.width = bg.width;
		vignette.height = bg.height;




game.camera.follow(center);
//game.camera.bounds.setTo(-3000, -3000, 6000, 6000);

	}
	
	function update()
	{
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(center, 32, 500);
	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");

		draw();
	}

};


function inputHandler()
{




	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		p1.pos.y -= game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		p1.pos.y += game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
		p1.pos.x -= game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	{
		p1.pos.x += game_speed * p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.A))
	{
		p1.attack();
	}


	if (p1.status == "attack")
	{
		p1.sprites.model.animations.play('attack', 12, false);
	}
	else
	{
		p1.sprites.model.animations.play(p1.status, 10, true);
	}

	p1.sprites.model.x = p1.pos.x;
	p1.sprites.model.y = p1.pos.y;

	p2.sprites.model.animations.play(p2.status, 10, true);
	p2.sprites.model.x = p2.pos.x;
	p2.sprites.model.y = p2.pos.y;
/*
	if (game.input.mousePointer.isDown)
    {
        if (Touch.state == ENDED)
            Touch.state = BEGAN;
        else
            Touch.state = MOVING;

        Touch.x = game.input.mousePointer.x;
        Touch.y = game.input.mousePointer.y;
        touched(Touch)
    }
    else
    if (game.input.mousePointer.isUp && Touch.state != ENDED)
    {
        Touch.state = ENDED;
        Touch.x = game.input.mousePointer.x;
        Touch.y = game.input.mousePointer.y;
        touched(Touch)
    }
*/
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
    }

}
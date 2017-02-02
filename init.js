var game = null;
var Graphics = null;
var test = null;
var fps = null;

BEGAN = 1;
MOVING = 2;
ENDED = 0;

var Touch = {};
Touch.x = 0;
Touch.y = 0;
Touch.state = 0;


window.onload = function()
{
	game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	
	function preload ()
	{
		game.time.advancedTiming = true;
	}


	function create ()
	{
		game.stage.backgroundColor = rgbToHex(64, 64, 64, 255);
		Graphics = game.add.graphics();
		WIDTH = game.stage.width;
		HEIGHT = game.stage.height;

		setup();


		fps = game.add.text(0, 0, "", { boundsAlignH: "center", boundsAlignV : "center" });
		fps.fontSize = 12;
		fps.fill = rgbToHex(255, 255, 255, 255);
        fps.setTextBounds(0, 0, 300, 300)
	}
	
	function update()
	{

		fps.text = game.time.fps;

		inputHandler();

		draw();
	}

};


function inputHandler()
{

	p1.status = "idle";
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	{
		p1.pos.y -= p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	{
		p1.pos.y += p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	{
		p1.pos.x -= p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	{
		p1.pos.x += p1.speed;
		p1.status = "moving";
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.A))
	{
		p1.attack();
	}

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
    else
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
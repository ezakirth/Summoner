window.onload = function()
{
	game = new Phaser.Game("100", "100", Phaser.AUTO, '', { create: create, update: update });
	

	function create ()
	{
		game.add.text(game.world.centerX, game.world.centerY, "ok", { font: "65px Arial", fill: "#ff0044", align: "center" });
		Graphics = game.add.graphics();
		setup()
	}
	
	function update()
	{
		if (game.time.elapsed < 10)
		draw();
	}

};

var game = null;
var Graphics = null;

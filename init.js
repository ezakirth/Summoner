window.onload = function()
{
	var game = new Phaser.Game("100", "100", Phaser.AUTO, '', { create: create, update: update });
	

	function create ()
	{
		game.add.text(game.world.centerX, game.world.centerY, "ok", { font: "65px Arial", fill: "#ff0044", align: "center" });
		graphics = game.add.graphics();
	}
	
	var time = 0;
	function update()
	{
		time += 0;//game.time.elapsedMS;
		
		rect(20, 20, 100, 100);
	}

};

var graphics = null;


function init()
{
	setup();
	draw();
}

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


	if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
		p1.attack();
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.ONE) && !buttonsPressed.creatures) {
		p1.gui.touched({x: buttons.creatures.pos.x, y: buttons.creatures.pos.y, state: ENDED});
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.TWO) && !buttonsPressed.sorcery) {
		p1.gui.touched({x: buttons.sorcery.pos.x, y: buttons.sorcery.pos.y, state: ENDED});
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.THREE) && !buttonsPressed.enchantments) {
		p1.gui.touched({x: buttons.enchantments.pos.x, y: buttons.enchantments.pos.y, state: ENDED});
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.FOUR) && !buttonsPressed.home) {
		p1.gui.touched({x: buttons.home.pos.x, y: buttons.home.pos.y, state: ENDED});
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.QUOTES) && !buttonsPressed.next) {
		p1.gui.touched({x: buttons.next.pos.x, y: buttons.next.pos.y, state: ENDED});
	}


	buttonsPressed.creatures = game.input.keyboard.downDuration(Phaser.Keyboard.ONE, 100);
	buttonsPressed.sorcery = game.input.keyboard.downDuration(Phaser.Keyboard.TWO, 100);
	buttonsPressed.enchantments = game.input.keyboard.downDuration(Phaser.Keyboard.THREE, 100);
	buttonsPressed.home = game.input.keyboard.downDuration(Phaser.Keyboard.FOUR, 100);
	buttonsPressed.next = game.input.keyboard.downDuration(Phaser.Keyboard.QUOTES, 100);


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
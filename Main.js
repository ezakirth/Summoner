function setup()
{
    printCard(creatures.red.retromancer);
    parameter.watch("#ai.actions");

    lastFps = 0;
    time = 0;
    cartoon = false;
    font("Futura-CondensedExtraBold");
    
    strokeWidth(3);
    stroke(0, 0, 0, 255);
    fill(255, 255, 255, 255);
    
    // hero;
    p1 = new Hero(heroes.basic.black, true);
    p2 = new Hero(heroes.basic.blue);
    p1.opponent = p2;
    p2.opponent = p1;
    p1.pos = new vec2(200, 300);
    p2.pos = new vec2(WIDTH - 200, 300);
    p2.side = -1;
    

    p2.gui.buttons.forEach((button) =>
    {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    p2.gui.home.forEach((button) =>
    {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    p2.gui.creatures.forEach((button) =>
    {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    p2.gui.sorcery.forEach((button) =>
    {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    p2.gui.enchantments.forEach((button) =>
    {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });   







    players = Array();
    table.insert(players, p1);
    table.insert(players, p2);
    
    crystals = new Crystals();
    duels = new Duels();
    
    var w, h;
    w, h = spriteSize("Dropbox.BG_new");
	
    BG = image(w, h);
    setContext(BG);
    
    sprite("Dropbox.BG_new", w/2, h/2);
    
    w, h = spriteSize("Dropbox.0001");
    vignette = image(w, h);
    setContext(vignette);
    sprite("Dropbox.0001", w/2, h/2);
    
    setContext();

    //p1.doAction(creatures.black.deaths_head_buzzard);    

    ai = new AI(p2);
    
}

function draw()
{
    background(0, 0, 0, 255);
    var entities = p1.all();
    table.sort(entities, function (a,b) { return a.pos.y > b.pos.y });
    
    ai.process();
    
    entities.forEach((entity) =>
    {
        entity.animate();
    });
    
    duels.run();
    
    var dist = (new vec2(-128, 0).add(p1.pos)).dist(p2.pos.add(new vec2(128,0)));
    var mid = new vec2((p1.pos.x + p2.pos.x)/2, (p1.pos.y + p2.pos.y)/2);
    
    ortho(mid.x - dist/2 , mid.x + dist/2 , mid.y - (dist*3/4)/2, mid.y + (dist*3/4)/2);
    
    p1.enchantments.forEach((enchantment) =>
    {
        sprite("Planet Cute.Gem Green", 135, 505);
        text(enchantment.name, 135, 505);
    });
    
    crystals.draw();
    
    entities.forEach((entity) =>
    {
        entity.render();
    });
    
    ortho(0, WIDTH, 0, HEIGHT);
    sprite(vignette, (WIDTH)/2, HEIGHT/2, WIDTH, HEIGHT);
    

    p1.gui.render();
    p1.gui.stick.render();
    


    DeltaTime = game.time.elapsedMS;
    ElapsedTime += DeltaTime;

}


function touched(touch)
{
    if ( touch.x < WIDTH/2 )
    {
        p1.gui.stick.touched(touch);
    }
    else
    {
        p1.gui.touched(touch);
    }
}





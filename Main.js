function printCard(card)
{
    print(card.name);
    print(card.power + "/" + card.life);
    var abilities = "";
    card.abilities.forEach((ability) =>
    {
        abilities = abilities + ability;
    });
    print(abilities);
    
}
function setup()
{
    printCard(creatures.red.retromancer);
    parameter.watch("#ai.actions");
    multi = false;
    lastFps = 0;
    time = 0;
    cartoon = false;
    font("Futura-CondensedExtraBold");
    
    strokeWidth(3);
    stroke(0, 0, 0, 255);
    fill(255, 255, 255, 255);
    
    // hero;
    p1 = new Hero(heroes.basic.black);
    p2 = new Hero(heroes.basic.blue);
    p1.opponent = p2;
    p2.opponent = p1;
    p1.pos = new vec2(50, 300);
    p2.pos = new vec2(970, 300);
    p2.side = -1;
    
    players = Array();
    table.insert(players, p1);
    table.insert(players, p2);
    
    crystals = new Crystals();
    duels = new Duels();
    
    var w, h;
    if ( cartoon )
    {
        w, h = spriteSize("Dropbox.BG");
    }
    else
    {
        
        w, h = spriteSize("Dropbox.BG_new");
    }
    BG = image(w, h);
    setContext(BG);
    
    if ( cartoon )
    {
        sprite("Dropbox.BG", w/2, h/2);
    }
    else
    {
        sprite("Dropbox.BG_new", w/2, h/2);
    }
    
    w, h = spriteSize("Dropbox.0001");
    vignette = image(w, h);
    setContext(vignette);
    sprite("Dropbox.0001", w/2, h/2);
    
    setContext();
    
   // p2.summon(creatures.red.raging_goblin);
    
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
    
    if ( multi )
    {
        img = image(WIDTH/2, HEIGHT/2);
        setContext(img);
        background(170, 170, 170, 255);
    }
    
    var dist = (new vec2(-128, 0).add(p1.pos)).dist(p2.pos.add(new vec2(128,0)));
    var mid = new vec2((p1.pos.x + p2.pos.x)/2, (p1.pos.y + p2.pos.y)/2);
    
    ortho(mid.x - dist/2 , mid.x + dist/2 , mid.y - (dist*3/4)/2, mid.y + (dist*3/4)/2);
 //   sprite(BG, WIDTH/2, HEIGHT/2, WIDTH*1.5, HEIGHT*1.0);
    
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
    
    if ( multi )
    {
        setContext();
        
        pushMatrix();
        scale(2/3, 2/3);
        rotate(-90);
        translate(-WIDTH, 0);
        sprite(img, (WIDTH-128)/2, HEIGHT/2, WIDTH+128, HEIGHT);
        popMatrix();
        
        pushMatrix();
        scale(2/3, -2/3);
        translate(0, -HEIGHT*3/2);
        rotate(90);
        translate(0, -HEIGHT*2);
        sprite(img, (WIDTH+128)/2, HEIGHT/2, WIDTH+128, HEIGHT);
        popMatrix();
        
        pushMatrix();
        rotate(-90);
        translate(-WIDTH, 0);
        p1.gui.render();
        popMatrix();
        
        pushMatrix();
        rotate(90);
        translate(-WIDTH/4, -HEIGHT*4/3);
        p2.gui.render();
        popMatrix();
        
        p1.gui.stick.render();
        p2.gui.stick.render();
    }
    else
    {
        p1.gui.render();
        p1.gui.stick.render();
    }
    
    if ( time > .3 )
    {
        time = 0;
        lastFps = Math.floor(1/DeltaTime);
    }
    
    time = time + DeltaTime;
    
    //  }
    
    text(lastFps, 300, 20);
    
    collectgarbage();

    DeltaTime = 1/60;
    ElapsedTime += DeltaTime;
    requestAnimationFrame(draw);
}

function lerp(v0, v1, t)
{
    return (1-t)*v0 + t*v1;
}

function touched(touch)
{
    if ( multi )
    {
        if ( touch.x < WIDTH/2 )
        {
            if ( touch.y < HEIGHT/2 )
            {
                p1.gui.touched(touch);
            }
            else
            {
                p1.gui.stick.touched(touch);
            }
        }
        else
        {
            if ( touch.y < HEIGHT/2 )
            {
                p2.gui.stick.touched(touch);
            }
            else
            {
                p2.gui.touched(touch);
            }
        }
    }
    else
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
}





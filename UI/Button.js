function Button(obj, owner, pos, page)
{
    this.owner = owner;
    
    this.pos = obj.pos;
    this.color = obj.color;
    this.name = obj.name;
    this.type = obj.type;
    this.icon = obj.icon;
    this.cost = obj.cost || 0;
    this.id = obj.id;
    
    this.cost = this.setStat(this.cost);
    
    if ( pos )
    {
        this.pos = new vec2(WIDTH - 64, 520 - 192 - pos * 70);
    }
    this.page = page || 1;
    
    this.w = 64;
    this.h = 64;
    
    if ( this.type != "action" )
    {
        this.w = 128;
    }
    
    
}

Button.prototype.render = function()
{
    pushMatrix();
    translate(this.pos.x - this.w/2, this.pos.y - this.h/2);
    fill(255, 255, 255, 128);
    stroke(186, 186, 186, 255);
    rect(0, 0, this.w, this.h);
    
    popMatrix();
    
    pushMatrix();
    fill(255, 255, 255, 255);
    translate(this.pos.x, this.pos.y);
    if ( this.type != "action" )
    {
        fontSize(30);
        text(this.icon, 0, -5);
    }
    else
    {
        fontSize(40);
        text(this.icon, 0, 0);
    }
    
    popMatrix();
    
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    fontSize(15);
    fill(0, 0, 0, 255);
    if ( this.type != "action" )
    {
        if ( this.id != "home" && this.id != "next" )
        {
            text(this.name, 0, 20);
        }
        text(this.cost, 0, -25);
    }
    
    popMatrix();
    
}

Button.prototype.touched = function(touch)
{
    var xr, xl, yt, yb, newpos = null;
    if ( multi )
    {
        if ( this.owner.side == 1 )
        {
            newpos = this.pos.rotate(Math.rad(-90));
            newpos.y = newpos.y + WIDTH;
            xr = newpos.x + this.h/2;
            xl = newpos.x - this.h/2;
            yt = newpos.y + this.w/2;
            yb = newpos.y - this.w/2;
        }
        else
        {
            newpos = this.pos.rotate(Math.rad(90));
            newpos.x = newpos.x + WIDTH;
            newpos.y = newpos.y - (WIDTH-HEIGHT)            ;
            xr = newpos.x + this.h/2;
            xl = newpos.x - this.h/2;
            yt = newpos.y + this.w/2;
            yb = newpos.y - this.w/2;
        }
    }
    else
    {
        xr = this.pos.x + this.w/2;
        xl = this.pos.x - this.w/2;
        yt = this.pos.y + this.h/2;
        yb = this.pos.y - this.h/2;
    }
    
    var touching = touch.x < xr && touch.x > xl && touch.y < yt && touch.y > yb;
    if ( touching )
    {
        if ( touch.state == BEGAN && this.type == "action" )
        {
            if ( this.id == "shield" )
            {
                this.owner.shielding = true;
            }
            if ( this.id == "sword" )
            {
                this.owner.attack();
            }
        }
        
        if ( touch.state == ENDED )
        {
            if ( this.type == "button" )
            {
                this.owner.gui.setPage(this.id);
            }
            else
            {
                if ( this.type == "action" )
                {
                    this.owner.shielding = false;
                }
                else
                {
                    this.owner.doAction(_G[this.type][this.color][this.id]);
                }
            }
        }
    }
}

// convert numeral stats to graphics so it can be displayed;
Button.prototype.setStat = function(val)
{
    var txt = "";
    for ( var i=1; i<=val; i++ )
    {
        txt = txt + "•";
    }
    return txt;
}


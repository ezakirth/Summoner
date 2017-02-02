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


	this.text = {};
	this.text.icon = game.add.text(0, 0, this.icon);
	this.text.name = game.add.text(0, 0, this.name);
	this.text.cost = game.add.text(0, 0, this.cost);    
    
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
    stroke(186, 186, 186, 255);

	Graphics.beginFill(rgbToHex(255, 255, 255, 255, true));
	Graphics.drawRect(this.pos.x - this.w/2, this.pos.y - this.h/2, this.w, this.h);
	Graphics.endFill();		

    if ( this.type != "action" )
    {
        this.text.icon.fontSize = 30;
        this.text.icon.x = this.pos.x;
        this.text.icon.y = this.pos.y - 5;
    }
    else
    {
        this.text.icon.fontSize = 40;
        this.text.icon.x = this.pos.x;
        this.text.icon.y = this.pos.y;
        
    }


    if ( this.type != "action" )
    {
        if ( this.id != "home" && this.id != "next" )
        {
            this.text.name.fontSize = 15;
            this.text.name.fill = rgbToHex(0, 0, 0, 255);
            this.text.name.x = this.pos.x;
            this.text.name.y = this.pos.y;            
        }

        this.text.cost.fontSize = 15;
        this.text.cost.fill = rgbToHex(0, 0, 0, 255);
        this.text.cost.x = this.pos.x;
        this.text.cost.y = this.pos.y;
    }
}

Button.prototype.touched = function(touch)
{
    var xr, xl, yt, yb, newpos = null;

    xr = this.pos.x + this.w/2;
    xl = this.pos.x - this.w/2;
    yt = this.pos.y + this.h/2;
    yb = this.pos.y - this.h/2;
    
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


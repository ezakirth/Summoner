function Element(x, y, src, type, owner)
{
    if ( src )
    {
        this.type = type;
        this.owner = owner;
        this.model = new mesh();
        var w, h = spriteSize(src);
        if ( this.type == "shadow" )
        {
            h = h/2;
        }

        if ( this.type == "arm_R" )
        { 
            this.model.addRect(x, y, w, h, 45);
        }
        else
        {
            if ( this.type == "weapon" )
            {
                this.model.addRect(x, y, w, h, -30*Math.PI/180);
            }
            else
            {
                this.model.addRect(x, y, w, h);
            }
            this.model.texture = src;
        }
    }
}

Element.prototype.attack = function()
{
    if ( this.type )
    {
        pushMatrix();
        if ( this.type != "foot_L" && this.type != "foot_R" )
        {
            translate(0, this.owner.sin*.7);
            if ( this.type != "body" && this.type != "shadow" && this.type != "arm_L" )
            {
                rotate(this.owner.sin);
            }
        }
        
        if ( this.type == "weapon" || this.type == "arm_R" )
        {
            rotate(this.owner.absSin*40);
        }
        this.model.draw();
        popMatrix();
    }
}

Element.prototype.idle = function()
{
    if ( this.type )
    {
        pushMatrix();
        if ( this.type != "foot_L" && this.type != "foot_R" )
        {
            translate(0, this.owner.sin*.7);
            if ( this.type != "body" && this.type != "shadow" && this.type != "arm_L" )
            {
                rotate(this.owner.sin);
            }
        }
        this.model.draw();
        popMatrix();
    }
}

Element.prototype.moving = function()
{
    if ( this.type )
    {
        pushMatrix();

        if ( this.type == "foot_L" )
        {
            translate(-this.owner.sin*2, this.owner.sin);
        }

        if ( this.type == "foot_R" )
        {
            var speed = this.owner.timer*7 + this.owner.seed + Math.PI;
            var sin = Math.sin(speed);
            translate(-sin*2, sin);
        }

        if ( this.type == "arm_R" || this.type == "weapon" )
        {
            translate(0, this.owner.absSin);
        }

        if ( this.type == "arm_L" )
        {
            translate(-this.owner.absSin, 0);
        }
            
        if ( this.type != "foot_L" && this.type != "foot_R" )
        {
            translate(0, this.owner.absSin*2);
        }

        if ( this.type != "body" && this.type != "shadow" )
        {
            rotate(this.owner.absSin*2);
        }

        this.model.draw();
        popMatrix();
    }
}


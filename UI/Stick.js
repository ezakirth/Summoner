function Stick(owner)
{
    this.owner = owner;
    this.active = false;
    this.pos = new vec2();
    this.origin = new vec2();
    this.dist = 0;
}

Stick.prototype.render = function()
{
    if ( ! this.owner.activeTimer() )
    {
        this.owner.status = "idle";
    }
    
    if ( this.active )
    {
        if ( ! this.owner.activeTimer() )
        {
            this.owner.status = "moving";
            
            var vec = new vec2(this.pos.x - this.origin.x, this.pos.y - this.origin.y);
            var dir = new vec2(0,0);
            if ( vec.x != dir.x && vec.y != dir.y )
            {
                dir = vec.normalize();
            }

            this.owner.pos.x += dir.x * this.owner.speed * this.dist/50;
            this.owner.pos.y += dir.y * this.owner.speed * this.dist/50;




           /* 
            if ( this.owner.pos.y > 410 )
            {
                this.owner.pos.y = 410;
            }
            if ( this.owner.pos.y < 150 )
            {
                this.owner.pos.y = 150;
            }
            
            var offset_left = ((this.owner.pos.y - 150)/260)*150;
            if ( this.owner.pos.x < offset_left - 150 )
            {
                this.owner.pos.x = offset_left - 150;
            }
            
            var offset_right = ((this.owner.pos.y - 150)/260)*150;
            if ( this.owner.pos.x > 1170 - offset_right )
            {
                this.owner.pos.x = 1170 - offset_right;
            }*/
            
        }

        Graphics.lineStyle(30, rgbToHex(96, 96, 96, 255, true), .5 );
        Graphics.beginFill(rgbToHex(255, 255, 255, 255, true), 0);
        Graphics.drawCircle(this.origin.x, this.origin.y, 128);
        Graphics.endFill();

        Graphics.lineStyle(0);
        Graphics.beginFill(rgbToHex(128, 128, 128, 255, true), .5);
        Graphics.drawCircle(this.pos.x, this.pos.y, 96);
        Graphics.endFill();

    }
}
    
Stick.prototype.touched = function(touch)
{
    this.active = true;
    if ( touch.state == BEGAN )
    {
        this.origin.x = touch.x;
        this.origin.y = touch.y;
    }
    
    if ( touch.state == ENDED )
    {
        this.active = false;
    }
    
    this.pos.x = touch.x;
    this.pos.y = touch.y;
    
    this.dist = this.pos.dist(this.origin);
    if ( this.dist > 50 )
    { 
        this.dist = 50
    }
}



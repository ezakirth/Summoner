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
            
            var vec = (this.pos - this.origin);
            var dir = new vec2(0,0);
            if ( vec != dir )
            {
                dir = vec.normalize();
            }
            
            if ( multi )
            {
                dir = dir.rotate(Math.rad(90)*this.owner.side);
                dir.x = dir.x * this.owner.side;
            }
            
            this.owner.pos = this.owner.pos + dir * this.owner.speed * this.dist/50;
            
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
            }
            
        }
        sprite("Dropbox.stick", this.pos.x, this.pos.y);
        sprite("Dropbox.stick_bg", this.origin.x, this.origin.y);
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



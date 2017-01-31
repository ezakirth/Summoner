Stick = class();

function Stick:init(owner)
{
    this.owner = owner;
    this.active = false;
    this.pos = vec2();
    this.origin = vec2();
    this.dist = 0;
}

function Stick:render()
{
    if ( not this.owner:activeTimer() ) {
        this.owner.status = "idle";
    }
    
    if ( this.active ) {
        if ( not this.owner:activeTimer() ) {
            this.owner.status = "moving";
            
            var vec = (this.pos - this.origin);
            var dir = vec2(0,0);
            if ( vec ~= dir ) {
                dir = vec:normalize();
            }
            
            if ( multi ) {
                dir = dir:rotate(math.rad(90)*this.owner.side);
                dir.x = dir.x * this.owner.side;
            }
            
            this.owner.pos = this.owner.pos + dir * this.owner.speed * this.dist/50;
            
            if ( this.owner.pos.y > 410 ) {
                this.owner.pos.y = 410;
            }
            if ( this.owner.pos.y < 150 ) {
                this.owner.pos.y = 150;
            }
            
            var offset_left = ((this.owner.pos.y - 150)/260)*150;
            if ( this.owner.pos.x < offset_left - 150 ) {
                this.owner.pos.x = offset_left - 150;
            }
            
            var offset_right = ((this.owner.pos.y - 150)/260)*150;
            if ( this.owner.pos.x > 1170 - offset_right ) {
                this.owner.pos.x = 1170 - offset_right;
            }
            
        }
        sprite("Dropbox:stick", this.pos.x, this.pos.y);
        sprite("Dropbox:stick_bg", this.origin.x, this.origin.y);
    }
}
    
function Stick:touched(touch)
{
    this.active = true;
    if ( touch.state == BEGAN ) {
        this.origin.x = touch.x;
        this.origin.y = touch.y;
    }
    
    if ( touch.state == ENDED ) {
        this.active = false;
    }
    
    this.pos.x = touch.x;
    this.pos.y = touch.y;
    
    this.dist = this.pos:dist(this.origin);
    if ( this.dist > 50 ) { this.dist = 50 }
}



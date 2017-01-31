Entity = class();
function Entity:init(ent, owner)
{
    this.owner = owner;
    this.seed = 0//math.random(math.pi);
    
    this.helm = Element(0,40, ent.helm, "helm", this);
    this.head = Element(0,40, ent.head, "head", this);
    this.eyes = Element(7,27, ent.eyes, "eyes", this);
    this.body = Element(0,7, ent.body, "body", this);
    this.armL = Element(-5,5, ent.arm_L, "arm_L", this);
    this.armR = Element(12,8, ent.arm_R, "arm_R", this);
    this.weapon = Element(32,26, ent.weapon, "weapon", this);
    this.footL = Element(-5,-7, ent.foot_L, "foot_L", this);
    this.footR = Element(5,-6, ent.foot_R, "foot_R", this);
    this.shadow = Element(0, -11, "Dropbox:Shadow", "shadow", this);
    this.timer = 0;
}

function Entity:draw()
{
  //  this.timer = this.timer + DeltaTime ;
    var action = this.owner.status;
    //action = "attack";
    var speed = 0;
    if ( action == "idle" ) { speed = this.timer*3 + this.seed }
    if ( action == "moving" ) { speed = this.timer*7 + this.seed }
    
    if ( action == "attack" ) { speed = this.timer*4 + this.seed }
    
    this.sin = math.sin(speed);
    this.absSin = math.abs(this.sin);
    
    this.shadow[action](this.shadow);
    this.footR[action](this.footR);
    this.footL[action](this.footL);
    this.weapon[action](this.weapon);
    this.armR[action](this.armR);
    this.body[action](this.body);
    this.head[action](this.head);
    this.eyes[action](this.eyes);
    this.helm[action](this.helm);
    this.armL[action](this.armL);
}



Element = class();

function Element:init(x, y, src, type, owner)
{
    if ( src ) {
        this.type = type;
        this.owner = owner;
        this.model = mesh();
        var w, h = spriteSize(src);
        if ( this.type == "shadow" ) {
            h = h/2;
        }
        if ( this.type == "arm_R" ) { ;
            this.model:addRect(x, y, w, h, 45);
        } else {if ( this.type == "weapon" ) {
            this.model:addRect(x, y, w, h, -30*math.pi/180);
        } else {
            this.model:addRect(x, y, w, h);
        }
        this.model.texture = src;
    }
    
    
}

function Element:attack()
{
    if ( this.type ) {
        
        pushMatrix();
        if ( this.type ~= "foot_L" and this.type ~= "foot_R" ) {
            translate(0, this.owner.sin*.7);
            if ( this.type ~= "body" and this.type ~= "shadow" and this.type ~= "arm_L" ) {
                rotate(this.owner.sin);
            }
        }
        
        if ( this.type == "weapon" or this.type == "arm_R" ) {
            rotate(this.owner.absSin*40);
        }
        this.model:draw();
        popMatrix();
    }
}

function Element:idle()
{
    if ( this.type ) {
        
        pushMatrix();
        if ( this.type ~= "foot_L" and this.type ~= "foot_R" ) {
            translate(0, this.owner.sin*.7);
            if ( this.type ~= "body" and this.type ~= "shadow" and this.type ~= "arm_L" ) {
                rotate(this.owner.sin);
            }
        }
        this.model:draw();
        popMatrix();
    }
}

function Element:moving()
{
    if ( this.type ) {
        
        pushMatrix();
        if ( this.type == "foot_L" ) {
            translate(-this.owner.sin*2, this.owner.sin);
        } else {if ( this.type == "foot_R" ) {
            var speed = this.owner.timer*7 + this.owner.seed + math.pi;
            var sin = math.sin(speed);
            translate(-sin*2, sin);
        } else {
            if ( this.type == "arm_R" or this.type == "weapon" ) {
                translate(0, this.owner.absSin);
            } else {if ( this.type == "arm_L" ) {
                translate(-this.owner.absSin, 0);
            }
            
            translate(0, this.owner.absSin*2);
            if ( this.type ~= "body" and this.type ~= "shadow" ) {
                rotate(this.owner.absSin*2);
            }
        }
        this.model:draw();
        popMatrix();
    }
}


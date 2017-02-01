function Entity(ent, owner)
{
    this.owner = owner;
    this.seed = 0//Math.random()*Math.PI;
    
    this.helm = new Element(0,40, ent.helm, "helm", this);
    this.head = new Element(0,40, ent.head, "head", this);
    this.eyes = new Element(7,27, ent.eyes, "eyes", this);
    this.body = new Element(0,7, ent.body, "body", this);
    this.armL = new Element(-5,5, ent.arm_L, "arm_L", this);
    this.armR = new Element(12,8, ent.arm_R, "arm_R", this);
    this.weapon = new Element(32,26, ent.weapon, "weapon", this);
    this.footL = new Element(-5,-7, ent.foot_L, "foot_L", this);
    this.footR = new Element(5,-6, ent.foot_R, "foot_R", this);
    this.shadow = new Element(0, -11, "Dropbox.Shadow", "shadow", this);
    this.timer = 0;
}

Entity.prototype.draw = function()
{
  //  this.timer = this.timer + DeltaTime ;
    var action = this.owner.status;
    //action = "attack";
    var speed = 0;
    if ( action == "idle" )
    {
        speed = this.timer*3 + this.seed
    }
    if ( action == "moving" )
    {
        speed = this.timer*7 + this.seed
    }
    
    if ( action == "attack" )
    {
        speed = this.timer*4 + this.seed
    }
    
    this.sin = Math.sin(speed);
    this.absSin = Math.abs(this.sin);
    
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

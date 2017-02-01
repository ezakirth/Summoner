// Simple Vector Class
var vec2 = function(x, y) {
    this.x = x;
    this.y = y;
}

vec2.prototype.add = function(v) {
    return new vec2(this.x + v.x, this.y + v.y);
}

vec2.prototype.addSelf = function(v) {
    this.x += v.x; this.y += v.y;
}

vec2.prototype.subtract = function(v) {
    return new vec2(this.x - v.x, this.y - v.y);
}

vec2.prototype.subtractSelf = function(v) {
    this.x -= v.x; this.y -= v.y;
}

/*
vec2.prototype.subtract = function(v, out) {
    out.x = this.x - v.x;
    out.y = this.y - v.y;
}*/

vec2.prototype.scale = function(v) {
    return new vec2(this.x * v, this.y * v);
}

vec2.prototype.scaleSelf = function(v) {
    this.x *= v; this.y *= v;
}

vec2.prototype.normalize = function() {
    var iLen = 1 / this.length();
    return new vec2(this.x * iLen, this.y * iLen);
}

vec2.prototype.normalizeSelf = function() {
    var iLen = 1 / this.length();
    this.x *= iLen; this.y *= iLen;
}

vec2.prototype.length = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

vec2.prototype.dist = function(v)
{
	return Math.sqrt( (this.x - v.x)*(this.x - v.x) + (this.y - v.y)*(this.y - v.y) );
};
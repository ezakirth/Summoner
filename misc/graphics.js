var fillColor = '0xff0000';
function fill(r, g, b, a)
{
    fillColor = '0x' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}
function ortho(){};
function background(){};
function text(){};
function scale(){};
function rect(x, y, w, h){
	graphics.beginFill(fillColor);
    graphics.drawRect(x, y, w, h);
    graphics.endFill();
};
function translate(){};
function popMatrix(){};
function pushMatrix(){};
function fontSize(){};
function font(){};
function strokeWidth(){};
function stroke(){};
function image(){};
function setContext(){};
function sprite(){};
function mesh(){};
mesh.prototype.addRect = function(){};
function spriteSize(){};
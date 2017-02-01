var fillColor = '0xff0000';

var translate_x = 0;
var translate_y = 0;

var backup_x = 0;
var backup_y = 0;

function fill(r, g, b, a)
{
    fillColor = '0x' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}
function ortho(){};
function background(){};
function text(){};
function scale(){};
function rect(x, y, w, h)
{
	Graphics.beginFill(fillColor);
    Graphics.drawRect(x + translate_x, y + translate_y, w, h);
    Graphics.endFill();
};
function translate(x, y)
{
    translate_x += x;
    translate_y += y;
};
function popMatrix()
{
    translate_x = backup_x;
    translate_y = backup_y;
};
function pushMatrix()
{
    backup_x = translate_x;
    backup_y = translate_y;
};
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
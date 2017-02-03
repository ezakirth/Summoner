var fillColor = '0xff0000';
var textSize = 12;
var translate_x = 0;
var translate_y = 0;

var backup_x = 0;
var backup_y = 0;

var backup_scale_x = 0;
var backup_scale_y = 0;

var scale_x = 1;
var scale_y = 1;

var strokeSize = 1;

var texts = Array();

function fill(r, g, b, a)
{
    return '0x' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}

function rgbToHex(r, g, b, a, fill)
{
    if (fill)
        return '0x' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    else
        return '#' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}


function ortho(){};
function background()
{
    Graphics.clear();

    for (var i=0; i<texts.length; i++)
    {
        texts[i].destroy();
    }
    texts = Array();
};
function text(str, x, y)
{
    texts.push(game.add.text(x, y, str, { font: (textSize + "px Arial"), fill: fillColor, align: "center" }));
};


function drawText(obj, size, col, text, x, y, w, h)
{
	obj.fontSize = size;
	obj.fill = col;
	obj.text = text;
    obj.setTextBounds(x, y, w, h)
}

function fontSize(size)
{
    textSize = size;
};
function font(){};
function strokeWidth(size)
{
    strokeSize = size;
};
function stroke(r, g, b, a)
{
    Graphics.lineStyle(strokeSize, rgbToHex(r, g, b, a, true), 1);
};

function image(){};
function setContext(){};
function sprite(){};
function mesh(){};
mesh.prototype.addRect = function(){};
function spriteSize(){};
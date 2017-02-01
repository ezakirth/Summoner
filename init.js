function loadjs(filename)
{
	var fileref = document.createElement('script');
	fileref.setAttribute("src", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

function init()
{
	setup();
	draw();
}

function fill(){};
function ortho(){};
function background(){};
function text(){};
function scale(){};
function rect(){};
function collectgarbage(){};
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

string = {};
string.len = function(){};


function print(msg)
{
	console.log(msg);
}

function vec3(x, y, z)
{
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	return this;
}

function vec2(x, y)
{
	this.x = x || 0;
	this.y = y || 0;
	return this;
}
vec2.prototype.dist = function(v)
{
	return Math.sqrt( (this.x - v.x)*(this.x - v.x) + (this.y - v.y)*(this.y - v.y) );
};

vec2.prototype.add = function(v)
{
	return new vec2(this.x + v.x, this.y + v.y);
};


vec2.prototype.substract = function(v)
{
	return new vec2(this.x - v.x, this.y - v.y);
};

vec2.prototype.normalize = function()
{
	var mag = Math.sqrt(this.x * this.x + this.y * this.y);

	var x, y;
	if (mag === 0)
	{
		x = 0;
		y = 0;
	}
	else
	{
		x = this.x / mag;
		y = this.y / mag;
	}
	return new vec2(x, y);
};

vec2.prototype.getNormalized = function()
{
	var mag = Math.sqrt(this.x * this.x + this.y * this.y);

	if (mag === 0)
	{
		this.x = 0;
		this.y = 0;
	}
	else
	{
		this.x /= mag;
		this.y /= mag;
	}
	return this;
};


function spriteSize(){};

parameter = {};
parameter.watch = function(){};

table = {};
table.insert = function(array, value)
{
	array.push(value);
};

table.remove = function(array, index)
{
	array.splice(index, 1);
};

table.sort = function(array, index)
{
};

WIDTH = 1024;
HEIGHT = 768;
ElapsedTime = 1;
DeltaTime = .1;
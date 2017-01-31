function loadjs(filename)
{
	var fileref = document.createElement('script');
	fileref.setAttribute("src", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

function init()
{
	p1 = Hero(heroes.basic.black);
}

function fill(){};
function text(){};
function popMatrix(){};
function fontSize(){};

function loadjs(filename)
{
	var fileref = document.createElement('script');
	fileref.setAttribute("src", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}


string = {};
string.len = function(){};

function collectgarbage(){};

function print(msg)
{
	console.log(msg);
}



parameter = {};
parameter.watch = function(){};



WIDTH = 1024;
HEIGHT = 768;
ElapsedTime = 0;
DeltaTime = 0;
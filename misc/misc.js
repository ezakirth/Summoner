function loadjs(filename)
{
	var fileref = document.createElement('script');
	fileref.setAttribute("src", filename);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}


function printCard(card)
{
    print(card.name);
    print(card.power + "/" + card.life);
    var abilities = "";
    card.abilities.forEach((ability) =>
    {
        abilities = abilities + ability;
    });
    print(abilities);
    
}


function lerp(v0, v1, t)
{
    return (1-t)*v0 + t*v1;
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
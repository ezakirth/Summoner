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



WIDTH = 960;
HEIGHT = 640;
ElapsedTime = 0;
DeltaTime = 0;
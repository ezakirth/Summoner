function printCard(card) {
    print(card.name);
    print(card.power + "/" + card.life);
    var abilities = "";
    card.abilities.forEach((ability) => {
        abilities = abilities + ability;
    });
    print(abilities);

}


function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}
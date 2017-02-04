function GUI(owner, deck) {
    this.owner = owner;
    this.stick = new Stick(owner);
    this.currentPage = 1;
    this.currentFolderName = "home";

    this.buttons = Array();
    this.buttons.push(new Button(buttons.sword, owner));
    this.buttons.push(new Button(buttons.shield, owner));

    this.home = Array();
    this.home.push(new Button(buttons.creatures, owner));
    this.home.push(new Button(buttons.enchantments, owner));
    this.home.push(new Button(buttons.sorcery, owner));

    this.creatures = Array();
    this.creatures.push(new Button(buttons.home, owner));
    this.creatures.push(new Button(buttons.next, owner));

    this.sorcery = Array();
    this.sorcery.push(new Button(buttons.home, owner));
    this.sorcery.push(new Button(buttons.next, owner));

    this.enchantments = Array();
    this.enchantments.push(new Button(buttons.home, owner));
    this.enchantments.push(new Button(buttons.next, owner));

    this.reset();

    var nb_creatures = 0;
    var nb_sorcery = 0;
    var nb_enchantments = 0;
    var pos_creatures = 0;
    var pos_sorcery = 0;
    var pos_enchantments = 0;

    var pages_creatures = 1;
    var pages_sorcery = 1;
    var pages_enchantments = 1;

    deck.forEach((spell) => {
        if (spell.type == "creatures") {
            nb_creatures = nb_creatures + 1;
            pos_creatures = pos_creatures + 1;
            if (nb_creatures > 3 * pages_creatures) {
                pos_creatures = 1;
                pages_creatures = pages_creatures + 1;
            }
            this.creatures.push(new Button(spell, owner, pos_creatures, pages_creatures));
        }
        if (spell.type == "sorcery") {
            nb_sorcery = nb_sorcery + 1;
            pos_sorcery = pos_sorcery + 1;
            if (nb_sorcery > 3 * pages_sorcery) {
                pos_sorcery = 1;
                pages_sorcery = pages_sorcery + 1;
            }
            this.sorcery.push(new Button(spell, owner, pos_sorcery, pages_sorcery));
        }
        if (spell.type == "enchantments") {
            nb_enchantments = nb_enchantments + 1;
            pos_enchantments = pos_enchantments + 1;
            if (nb_enchantments > 3 * pages_enchantments) {
                pos_enchantments = 1;
                pages_enchantments = pages_enchantments + 1;
            }
            this.enchantments.push(new Button(spell, owner, pos_enchantments, pages_enchantments));
        }
    });

    this.pages_creatures = pages_creatures;
    this.pages_sorcery = pages_sorcery;
    this.pages_enchantments = pages_enchantments;


}

GUI.prototype.reset = function () {
    this.currentFolder = this.home;
}

GUI.prototype.setPage = function (page) {
    if (page != "next") {
        this.currentFolder = this[page];
        this.currentFolderName = page;
    }
    if (page == "home") {
        this.currentPage = 1;
    }
    if (page == "next") {
        this.currentPage = this.currentPage + 1;

        var max = this["pages_" + this.currentFolderName];
        if (this.currentPage > max) {
            this.currentPage = 1;
        }
    }
}

GUI.prototype.render = function () {
    this.buttons.forEach((button) => {
        button.render();
    });

    this.home.forEach((button) => {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    this.creatures.forEach((button) => {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    this.sorcery.forEach((button) => {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    this.enchantments.forEach((button) => {
        button.text.icon.alpha = 0;
        button.text.name.alpha = 0;
        button.text.cost.alpha = 0;
    });

    this.currentFolder.forEach((button) => {
        if (button.id != "next" && (button.id == "home" || button.page == this.currentPage)) {
            button.text.icon.alpha = 1;
            button.text.name.alpha = 1;
            button.text.cost.alpha = 1;

            button.render();
        }

        if (button.id == "next" && this["pages_" + this.currentFolderName] > 1) {
            button.text.icon.alpha = 1;
            button.text.name.alpha = 1;
            button.text.cost.alpha = 1;

            button.render();
        }
    });
}

GUI.prototype.touched = function (touch) {
    this.buttons.forEach((button) => {
        button.touched(touch);
    });

    this.currentFolder.forEach((button) => {
        button.touched(touch);
    });
}
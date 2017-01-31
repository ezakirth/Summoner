GUI = class();

function GUI:init(owner, deck)
{
    this.owner = owner;
    this.stick = Stick(owner)    ;
    this.currentPage = 1;
    this.currentFolderName = "home";
    
    this.buttons = {}
    table.insert(this.buttons, Button(buttons.sword, owner));
    table.insert(this.buttons, Button(buttons.shield, owner));
    
    this.home = {}
    table.insert(this.home, Button(buttons.creatures, owner));
    table.insert(this.home, Button(buttons.enchantments, owner));
    table.insert(this.home, Button(buttons.sorcery, owner));
    
    this.creatures = {}
    table.insert(this.creatures, Button(buttons.home, owner));
    table.insert(this.creatures, Button(buttons.next, owner));
    
    this.sorcery = {}
    table.insert(this.sorcery, Button(buttons.home, owner));
    table.insert(this.sorcery, Button(buttons.next, owner));
        
    this.enchantments = {}
    table.insert(this.enchantments, Button(buttons.home, owner));
    table.insert(this.enchantments, Button(buttons.next, owner));
        
    this:reset();
    
    var nb_creatures = 0;
    var nb_sorcery = 0;
    var nb_enchantments = 0;
    var pos_creatures = 0;
    var pos_sorcery = 0;
    var pos_enchantments = 0;
    
    var pages_creatures = 1;
    var pages_sorcery = 1;
    var pages_enchantments = 1;
    
    for ( _, spell in ipairs(deck) ) {
        if ( spell.type == "creatures" ) {
            nb_creatures = nb_creatures + 1;
            pos_creatures = pos_creatures + 1;
            if ( nb_creatures > 3*pages_creatures ) {
                pos_creatures = 1;
                pages_creatures = pages_creatures + 1;
            }
            table.insert(this.creatures, Button(spell, owner, pos_creatures, pages_creatures));
        }
        if ( spell.type == "sorcery" ) {
            nb_sorcery = nb_sorcery + 1;
            pos_sorcery = pos_sorcery + 1;
            if ( nb_sorcery > 3*pages_sorcery ) {
                pos_sorcery = 1;
                pages_sorcery = pages_sorcery + 1;
            }
            table.insert(this.sorcery, Button(spell, owner, pos_sorcery, pages_sorcery));
        }
        if ( spell.type == "enchantments" ) {
            nb_enchantments = nb_enchantments + 1;
            pos_enchantments = pos_enchantments + 1;
            if ( nb_enchantments > 3*pages_enchantments ) {
                pos_enchantments = 1;
                pages_enchantments = pages_enchantments + 1;
            }
            table.insert(this.enchantments, Button(spell, owner, pos_enchantments, pages_enchantments));
        }
    }
    
    this.pages_creatures = pages_creatures;
    this.pages_sorcery = pages_sorcery;
    this.pages_enchantments = pages_enchantments;
    
    
}

function GUI:reset()
{
    this.currentFolder = this.home;
}

function GUI:setPage(page)
{
    if ( page ~= "next" ) {
        this.currentFolder = this[page];
        this.currentFolderName = page;
    }
    if ( page == "home" ) {
        this.currentPage = 1;
    }
    if ( page == "next" ) {
        this.currentPage = this.currentPage + 1;
        
        var max = this["pages_"..this.currentFolderName];
        if ( this.currentPage > max ) {
            this.currentPage = 1;
        }
    }
}

function GUI:render()
{
    font("HelveticaNeue");

    for ( _, button in pairs(this.buttons) ) {
        button:render();
    }
    
    for ( _, button in pairs(this.currentFolder) ) {
        if ( button.id ~= "next" and (button.id == "home" or button.page == this.currentPage) ) {
            button:render();
        }
        if ( button.id == "next" and this["pages_"..this.currentFolderName] > 1 ) {
            button:render();
        }
    }
    
    font("Futura-CondensedExtraBold");

}

function GUI:touched(touch)
{
    for ( _, button in pairs(this.buttons) ) {
        button:touched(touch);
    }
    
    for ( _, button in pairs(this.currentFolder) ) {
        button:touched(touch);
    }
}



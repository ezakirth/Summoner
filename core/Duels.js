function Duels()
{
    this.list = Array();
}

Duels.prototype.add = function(a, b)
{
    var duel = new Duel(a, b);
    table.insert(duel.timers, duel.t1);
    table.insert(duel.timers, duel.t2);
    table.insert(this.list, duel);
}

Duels.prototype.run = function()
{
    if ( this.list[0] == null )
    {
        table.remove(this.list, 0);
    }
    
    var done_duel;
    this.list.forEach((duel, index) =>
    {
        if ( duel.done )
        {
            this.list[index] = null;
        }
        else
        {
            duel.run();
        }
    });
}
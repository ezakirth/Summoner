Timer = class();

function Timer:init(sec, id)
{
    // you can accept and set parameters here;
    this.delay = sec;
    this.max = ElapsedTime + this.delay;
    this.done = true;
    this.started = false;
    this.id = id;
}

function Timer:reset()
{
    this.done = false;
    this.started = true;
    this.max = ElapsedTime + this.delay;
}

function Timer:isDone()
{
    if ( ElapsedTime > this.max ) {
        this.done = true;
        this.started = false;
    }
    return this.done;
}

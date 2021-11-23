class ForcePair{
    constructor(obj1, obj2, G){
        this.obj1 = obj1;
        this.obj2 = obj2;

        this.dv = {
            x: this.obj2.x - this.obj1.x,
            y: this.obj2.y - this.obj1.y,
        }

        this.sqDistance = (this.dv.x * this.dv.x) + (this.dv.y * this.dv.y)
        this.nv = null;
        this.fg = null;
        this.fgx = null;
        this.fgy = null;
    }

    calcGravity(){
        this.nv = {
            x: this.dv.x * this.dv.x / this.sqDistance,
            y: this.dv.y * this.dv.y / this.sqDistance,
        }

        this.fg = ((G * this.obj2.mass * this.obj1.mass) * (G * this.obj2.mass * this.obj1.mass)) / (this.sqDistance)

        this.fgx = this.fg * this.nv.x;
        this.fgy = this.fg * this.nv.y;


    }
}
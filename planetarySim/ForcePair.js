class ForcePair{
    constructor(obj1, obj2, G, context){
        this.obj1 = obj1;
        this.obj2 = obj2;

        this.minDistance = obj1.radius + obj2.radius;

        this.dv = {
            x: this.obj2.x - this.obj1.x,
            y: this.obj2.y - this.obj1.y,
        }

        this.distance = Math.sqrt((this.dv.x * this.dv.x) + (this.dv.y * this.dv.y))

        this.collisionDepth = this.minDistance - this.distance;

        this.nv = {
            x: this.dv.x / this.distance,
            y: this.dv.y / this.distance,
        }

        this.fg = (G * this.obj2.mass * this.obj1.mass) / (this.distance)

        this.fgx = this.fg * this.nv.x;
        this.fgy = this.fg * this.nv.y;
        // context.beginPath()
        // context.moveTo(obj1.x, obj1.y);
        // context.lineTo(obj1.x + (this.nv.x * 100), obj1.y + (this.nv.y * 100))
        // context.stroke();
    }
}
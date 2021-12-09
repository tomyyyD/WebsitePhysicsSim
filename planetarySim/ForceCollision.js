class ForceCollision{
    constructor(obj1, obj2){
        this.obj1 = obj1;
        this.obj2 = obj2;
     
        this.dv = {
            x: this.obj2.x - this.obj1.x,
            y: this.obj2.y - this.obj1.y,
        }

        this.sqdistance = (this.dv.x * this.dv.x) + (this.dv.y * this.dv.y)

        this.minDistance = obj1.radius + obj2.radius;


    }
}
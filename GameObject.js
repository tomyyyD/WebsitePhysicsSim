class GameObject{
    constructor (context, x, y, vx, vy, mass, gravity){
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.gravity = gravity

        this.isColliding = false;
    }
}
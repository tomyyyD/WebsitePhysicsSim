class CollisionPair{
    constructor(obj1, obj2){
        this.obj1 = obj1
        this.obj2 = obj2

        //collision vector - the vector between the center of objects 1 and 2
        this.vCollision = {x: this.obj2.x - this.obj1.x, y: this.obj2.y - this.obj1.y};

        // distance between objects 1 and 2 - magnitude of collision vector
        this.distance = Math.sqrt((this.obj2.x - this.obj1.x)*(this.obj2.x - this.obj1.x) + (this.obj2.y - this.obj1.y)*(this.obj2.y - this.obj1.y));

        //normal collision vector - collision vector but with a magnitude of one
        this.vCollisionNorm = {x: this.vCollision.x / this.distance, y: this.vCollision.y / this.distance};

        //depth of collision at frame
        this.collisionDepth = this.obj1.radius + this.obj2.radius - this.distance;

        //vector between two velocities
        this.vRelativeVelocity = {x: this.obj1.vx - this.obj2.vx, y: this.obj1.vy - this.obj2.vy};

        //"speed" of collision aka relative velocity at collision angle
        this.speed = this.vRelativeVelocity.x * this.vCollisionNorm.x + this.vRelativeVelocity.y * this.vCollisionNorm.y

        //impulse of collision
        this.impulse = 2 * this.speed / (this.obj1.mass + this.obj2.mass)
    }
}
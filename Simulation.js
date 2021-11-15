class PhysicsSim{
    constructor (canvasId, gravity, restitution){
        this.canvas = null;
        this.gravity = gravity
        this.ctx = null;
        this.lastTime = performance.now();
        this.gameObjects = [];
        this.width = null;
        this.height = null;;
        this.restitution = 1 - (restitution / 100);
        this.pause = false;
        console.log(this.restitution)

        this.init(canvasId);
    }
    init(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.container = document.getElementById("simulation")
        this.ctx = this.canvas.getContext('2d');

        canvas.width = this.container.clientWidth;
        canvas.height = this.container.clientHeight;
        this.width = canvas.width;
        this.height = canvas.height;

        this.createWorld()

        //console.log(this.gravity)

        //calls the gameLoop for the first time to start the loop
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)})
    }

    randInRange(min, max){
        return (Math.random() * (max-min)) + min;
    }
    //creates the particles
    //eventually transition this into being mousepos and clicks
    createWorld(){

        let step = 200;
        for (var i = 0; i < Math.floor(this.width / step); i++){
            for (var j = 0; j < Math.floor(this.height / step); j ++){
                
                let size = this.randInRange(50, 200)
                let x = i * step + step/2;
                let y = j * step+ step/2;
                let vx = this.randInRange(-50, 50);
                let vy = this.randInRange(-50, 50);

                var newObj = new Circle(this.ctx, x, y, vx, vy, size, this.gravity)
                this.gameObjects.push(newObj);
                //console.log(newObj)
            }                
        }

        // //test single circle
        // this.gameObjects.push(new Circle(this.ctx,this.width/2, this.height/2, 0, 0, 50))

    }

    gameLoop(timeStamp){
        //calc time difference
        var secondsPassed = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;

        //loops over to update all physics objects
        for (var i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update(secondsPassed);
        }

        //here I need to detect collision
        this.detectCollision();
        this.edgeDetection();
        this.clearCanvas();

        //loops over to draw all physics objects
        for (var i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].draw();
        }

        //recursion moment
        if (!this.pause){
            window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp))
        }

    }

    clearCanvas(){
        //clears the entire canvas element
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    resolveCollisionOOP(collision){
        //adjusts position of objects so they are no longer overlapping
        collision.obj1.x -= collision.vCollisionNorm.x * (collision.collisionDepth/2)
        collision.obj1.y -= collision.vCollisionNorm.y * (collision.collisionDepth/2)
        collision.obj2.x += collision.vCollisionNorm.x * (collision.collisionDepth/2)
        collision.obj2.y += collision.vCollisionNorm.y * (collision.collisionDepth/2)

        //adjusts velocities
        collision.obj1.vx -= (collision.impulse * collision.obj2.mass * collision.vCollisionNorm.x)
        collision.obj1.vy -= (collision.impulse * collision.obj2.mass * collision.vCollisionNorm.y)
        collision.obj2.vx += (collision.impulse * collision.obj1.mass * collision.vCollisionNorm.x)
        collision.obj2.vy += (collision.impulse * collision.obj1.mass * collision.vCollisionNorm.y)
    }

    detectCollision(){
        let obj1;
        let obj2;
        
        //sets collision state to false for all objects
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].isColliding = false;
        }

        //loop through all pairs of objects
        for (let i = 0; i < this.gameObjects.length; i++){
            obj1 = this.gameObjects[i];

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                //get collision pair
                let collision = new CollisionPair(obj1, obj2);

                //check for collision between object 1 and 2
                if(this.circleCheck(collision)){

                    // obj1.isColliding = true;
                    // obj2.isColliding = true;

                    this.resolveCollisionOOP(collision);

                    //this.resolveCollision(obj1, obj2)
                }


            }
        }
    }

    edgeDetection(){
        let obj;
        for (let i = 0; i < this.gameObjects.length; i++){
            obj = this.gameObjects[i]

            //check left wall
            if(obj.x < (obj.size/2)){
                obj.vx = Math.abs(obj.vx) * this.restitution;
                obj.x = (obj.size/2);
            }
            //check right wall
            else if(obj.x > this.width - (obj.size/2)){
                obj.vx = -Math.abs(obj.vx) * this.restitution;
                obj.x = this.width - (obj.size/2);
            }

            //check top
            if (obj.y < (obj.size/2)){
                obj.vy = Math.abs(obj.vy) * this.restitution;
                obj.y = (obj.size/2);
            }
            //check bottom
            else if (obj.y > this.height - (obj.size/2)){
                obj.vy = -Math.abs(obj.vy) * this.restitution;
                obj.y = this.height - (obj.size/2);
            }
        }
    }

    boxCheck(x1, y1, w1, h1, x2, y2, w2, h2){
        //box collision
        //check box one and two for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }

    /*
        (x1, y1): position of circle 1
        d1: diameter of circle 1

        (x2, y2): position of circle 2
        d2: diameter of circle 2
    */
    circleCheck(collision){
        //radii added together equals the collision distance
        let minDistance = collision.obj1.radius + collision.obj2.radius;

        //if distance > radii added together collision is happening
        if (collision.distance < minDistance){
            return true
        }else{
            return false
        }
    }
}
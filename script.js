class PhysicsSim{
    constructor (canvasId){
        this.canvas = null;
        this.ctx = null;
        this.lastTime = null;
        this.gameObjects = [];
        this.width = window.innerWidth-20;
        this.height = window.innerHeight-20;
        
        this.init(canvasId);
        this.restitution = 1;
    }
    init(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        canvas.width = this.width;
        canvas.height = this.height;

        this.createWorld()
        this.restitution = 0.75;

        //calls the gameLoop for the first time to start the loop
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)})
    }

    randInRange(min, max){
        return (Math.random() * (max-min)) + min;
    }
    //creates the particles
    //eventually transition this into being mousepos and clicks
    createWorld(){
        // this.gameObjects = [
        //     new Square(this.ctx, 250, 50, 0, 40, 5),
        //     new Square(this.ctx, 250, 300, 0, -20, 5),
        //     new Square(this.ctx, 150, 600, 50, 50, 5),
        //     new Square(this.ctx, 800, 150, 50, 50, 5),
        //     new Square(this.ctx, 800, 600, -50, 50, 5),
        //     new Square(this.ctx, 300, 300, 50, -50, 5)
        // ]
        for (var i = 0; i < Math.floor(this.width / 200); i++){
            for (var j = 0; j < Math.floor(this.height / 200); j ++){
                let size = this.randInRange(50, 100)
                this.gameObjects.push(new Circle(this.ctx, i * 200 + 100, j * 200 + 100, this.randInRange(-20, 20), this.randInRange(-20, 20), size));
            }                
        }
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
        this.clearCanvas();

        //loops over to draw all physics objects
        for (var i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].draw();
        }

        //recursion moment
        window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp))
    }

    clearCanvas(){
        //clears the entire canvas element
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    calcVelocities(obj1, obj2){

        //finds the vector between the two objects
        let collisionVector = {
            x: obj2.x - obj1.x, 
            y: obj2.y - obj1.y,
        }
        //finds the magnitude of above vector
        let magnitude = Math.sqrt((collisionVector.x * collisionVector.x) + (collisionVector.y * collisionVector.y))

        //creates the unit vector of the collision vector. AKA direction with magnitude of 1
        let collisionNormal = {
            x: collisionVector.x / magnitude,
            y: collisionVector.y / magnitude,
        }

        let relativeVolocity = {
            x: obj1.vx - obj2.vx,
            y: obj1.vy - obj2.vy,
        }
        let speed = relativeVolocity.x * collisionNormal.x + relativeVolocity.y + collisionNormal.y;
        if (speed < 0){
            return;
        }

        let impulse = 2* speed / (obj1.mass + obj2.mass)
        obj1.vx -= (impulse * obj2.mass * collisionNormal.x);
        obj1.vy -= (impulse * obj2.mass * collisionNormal.y);
        obj2.vx += (impulse * obj1.mass * collisionNormal.x);
        obj2.vy += (impulse * obj1.mass * collisionNormal.y);


    }

    detectCollision(){
        let obj1;
        let obj2;
        
        //sets collision state to false for all objects
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].isColliding = false;
        }

        //checking for collision
        for (let i = 0; i < this.gameObjects.length; i++){
            obj1 = this.gameObjects[i];

            //checks with walls
            if (obj1.x < 0 + (obj1.size/2) || obj1.x > this.width - (obj1.size/2)){
                // obj1.vx *= -1;
                if (obj1.x < (obj1.size/2)){
                    obj1.vx = Math.abs(obj1.vx);
                }else if (obj1.x > this.width - (obj1.size/2)){
                    obj1.vx = -1 * Math.abs(obj1.vx)
                }
            }
            if (obj1.y < 0 + (obj1.size/2) || obj1.y > this.height - (obj1.size/2)){
                if (obj1.y < (obj1.size/2)){
                    obj1.vy = Math.abs(obj1.vy);
                }else if (obj1.y > this.height - (obj1.size/2)){
                    obj1.vy = -1 * Math.abs(obj1.vy)
                }
            }

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                if(this.circleCheck(obj1.x, obj1.y, obj1.size, obj2.x, obj2.y, obj2.size)){
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    //collision vector - the vector between the center of objects 1 and 2
                    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                    // distance between objects 1 and 2 - magnitude of collision vector
                    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));

                    //normal collision vector - collision vector but with a magnitude of one
                    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    //relative velocity vector - the vector between the velocity vector of the 2 objects
                    let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                    //the speed of the collision
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    //if objects are travelling in the same direction
                    if (speed < 0) {
                        break;
                    }

                    //apply collision speed to the objects
                    let impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                    
                }
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

    circleCheck(x1, y1, r1, x2, y2, r2){
        //radii added together equals the collision distance
        let minDistance = r1/2 + r2/2;

        //finds distance between two objects
        let dx = x2 - x1;
        let dy = y2 - y1;
        let colMagnitude = Math.sqrt(dx * dx + dy * dy);

        //if distance > radii added together collision is happening
        if (colMagnitude < minDistance){
            return true
        }else{
            return false
        }
    }
}
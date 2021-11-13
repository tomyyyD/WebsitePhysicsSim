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

        for (var i = 0; i < Math.floor(this.width / 200); i++){
            for (var j = 0; j < Math.floor(this.height / 200); j ++){
                
                let size = this.randInRange(50, 100)
                let x = i * 200 + 100;
                let y = j * 200 + 100;
                let vx = this.randInRange(-100, 100);
                let vy = this.randInRange(-100, 100);

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

                    //depth of collision at frame
                    let collisionDepth = obj1.size/2 + obj2.size/2 - distance;

                    //pushes each object half of the collision depth
                    //so that there is no overlap
                    //credit to Martin Heinz for this part
                    obj1.x -= vCollisionNorm.x * (collisionDepth/2)
                    obj1.y -= vCollisionNorm.y * (collisionDepth/2)
                    obj2.x += vCollisionNorm.x * (collisionDepth/2);
                    obj2.y += vCollisionNorm.y * (collisionDepth/2);

                    //relative velocity vector - the vector between the velocity vector of the 2 objects
                    let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                    //the speed of the collision
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    speed *= this.restitution

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
    circleCheck(x1, y1, d1, x2, y2, d2){
        //radii added together equals the collision distance
        let minDistance = d1/2 + d2/2;

        //finds distance between two objects
        let dx = x2 - x1;
        let dy = y2 - y1;

        //distance formula but optimized so no square roots
        let colMagnitude = dx * dx + dy * dy;

        //if distance > radii added together collision is happening
        if (colMagnitude < minDistance * minDistance){
            return true
        }else{
            return false
        }
    }
}
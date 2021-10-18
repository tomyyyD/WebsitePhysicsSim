class PhysicsSim{
    constructor (canvasId){
        this.canvas = null;
        this.ctx = null;
        this.lastTime = null;
        this.gameObjects = [];
        this.width = window.innerWidth-20;
        this.height = window.innerHeight-20;
        
        this.init(canvasId);
    }
    init(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        canvas.width = this.width;
        canvas.height = this.height;

        this.createWorld()

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
        for (var i = 0; i < this.randInRange(20, 50); i++){
            this.gameObjects.push(new Square(this.ctx, this.randInRange(0, this.width - 100), this.randInRange(0, this.height- 100), this.randInRange(-20, 20), this.randInRange(-20, 20), this.randInRange(10, 100)));
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
            if (obj1.x < 0 || obj1.x > this.width - obj1.size){
                obj1.vx *= -1;
                if (obj1.vx > 0){
                    obj1.x = 0;
                }else if (obj1.vx < 0){
                    obj1.x = this.width - obj1.size;
                }
            }
            if (obj1.y < 0 || obj1.y > this.height - obj1.size){
                obj1.vy *= -1;
            }

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                if(this.boxCheck(obj1.x, obj1.y, obj1.size, obj1.size, obj2.x, obj2.y, obj2.size, obj2.size)){
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    //calculates momentum
                    //p=mv
                    let p1x = obj1.mass * obj1.vx;
                    let p1y = obj1.mass * obj1.vy;
                    let p2x = obj2.mass * obj2.vx;
                    let p2y = obj2.mass * obj2.vy;

                    //assigns new momentum
                    obj1.vx = p2x/obj1.mass
                    obj1.vy = p2y/obj1.mass
                    obj2.vx = p1x/obj2.mass
                    obj2.vy = p1y/obj2.mass
                }
            }
        }
    }

    boxCheck(x1, y1, w1, h1, x2, y2, w2, h2){
        //check box one and two for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }
}
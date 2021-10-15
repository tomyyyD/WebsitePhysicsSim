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

    //creates the particles
    //eventually transition this into being mousepos and clicks
    createWorld(){
        this.gameObjects = [
            new Square(this.ctx, 250, 50, 0, 50),
            new Square(this.ctx, 250, 300, 0, -50),
            new Square(this.ctx, 150, 0, 50, 50),
            new Square(this.ctx, 250, 150, 50, 50),
            new Square(this.ctx, 350, 75, -50, 50),
            new Square(this.ctx, 300, 300, 50, -50)
        ]
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

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                if(this.boxCheck(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                    console.log("collision moment");
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
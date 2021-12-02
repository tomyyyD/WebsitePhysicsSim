class PlanetaryCollision{
    constructor(canvasId, gravitationalConstant){
        //this.gravity = gravity
        this.G = gravitationalConstant;
        //this.timestamp = null;
        this.lasttime = performance.now();
        this.gameObjects = [];

        this.init(canvasId);
    }

    init(canvasId){
        //getting canvas stuff
        this.canvas = document.getElementById(canvasId);
        this.container = document.getElementById("simulation")
        this.context = canvas.getContext('2d');

        //sets canvas size values
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.createObjects()

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))

    }

    randInRange(min, max){
        return (Math.random() * (max-min)) + min;
    }

    createObjects(){
        let intervals = 200
        let widthVal = this.width/intervals
        for (var i = 0; i < 1; i++){
            let mass =  this.randInRange(50,200);
            let radius = this.randInRange(50,100);
            let xPos = i * intervals + (intervals/2);
            let yPos = intervals

            let object = new ForceObject(this.context, xPos, yPos, mass, radius)

            this.gameObjects.push(object);
        }
    }

    gameLoop(timestamp){
        this.deltaTime = (timestamp - this.lasttime) / 1000;
        this.lasttime = timestamp;

        //loop through all objects
        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].update(this.deltaTime);
        }

        this.clearCanvas();
        //applyForces();

        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].draw()
        }

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
        
    }

    clearCanvas(){
        //clears the entire canvas element
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    applyForces(){
//check for collision against walls
        //loop through all pairs of objects
        for (let i = 0; i < this.gameObjects.length; i++){
            obj1 = this.gameObjects[i];

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                let interaction = new ForcePair(obj1, obj2);

                interaction.calcGravity()

                obj1.fx = obj1.fx + interaction.fgx
                obj1.fx = obj1.fx + interaction.fgx
                
                obj2.fx = obj2.fx + interaction.fgx
                obj2.fx = obj2.fx + interaction.fgx
            }
        }        
    }
}
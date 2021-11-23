class PlanetaryCollision{
    constructor(canvasId, gravity, gravitationalConstant){
        this.gravity = gravity
        this.G = gravitationalConstant;
        //this.timestamp = null;
        this.lasttime = performance.now();

        this.init(canvasId);
    }

    init(){
        //getting canvas stuff
        this.canvas = document.getElementById(canvasId);
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
        let gameObjects = [];
        let intervals = 200
        let widthVal = this.width/intervals
        for (var i = 0; i < widthVal; i + 200){
            let mass =  this.randInRange(50,200);
            let radius = this.randInRange(50,100);
            let xPos = i * intervals + (intervals/2);
            let yPos = intervals

            let object = new ForceObject(xPos, yPos, mass, radius)

            gameObjects.push(object);
        }
    }

    gameLoop(timestamp){
        this.deltaTime = (timestamp - this.lasttime) / 1000;
        this.lasttime = timestamp;

        //loop through all objects
        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].update(this.deltaTime);
        }

        //check for collision against walls
        //loop through all pairs of objects
        for (let i = 0; i < this.gameObjects.length; i++){
            obj1 = this.gameObjects[i];

            for (let j = i+1; j < this.gameObjects.length; j++){
                obj2 = this.gameObjects[j];

                

            }
        }        
    }
}
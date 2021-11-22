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

    createObjects(){
        let gameObjects = [];
        let intervals = 200
        let widthVal = this.width/intervals
        for (var i = 0; i < widthVal; i + 200){
            let mass =  Simulation.randInRange(50,200);
            let radius = Simulation.randInRange(50,100);
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
        
    }
}
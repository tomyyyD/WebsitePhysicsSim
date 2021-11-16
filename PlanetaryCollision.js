class PlanetCollision{
    constructor(canvasId, gravity, gravitationalConstant){
        this.gravity = gravity
        this.G = gravitationalConstant;
        //this.timestamp = null;
        this.lasttime = performance.now();

        this.init(canvasId);
    }

    init(){
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext('2d');

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))

    }

    gameLoop(timestamp){
        this.deltaTime = (timestamp - this.lasttime) / 1000;
        this.lasttime = timestamp;

        //loop through all objects

    }
}
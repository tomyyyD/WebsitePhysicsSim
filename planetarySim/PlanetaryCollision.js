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
        for (var i = 0; i < 3; i++){
            let mass =  this.randInRange(50,200);
            let radius = this.randInRange(50,100);
            let xPos = i * intervals + (intervals/2);
            let yPos = i * intervals + (intervals/2);

            let object = new ForceObject(this.context, xPos, yPos, mass, radius)

            this.gameObjects.push(object);
        }
    }

    applyForces(){
        //check for collision against walls
        //loop through all pairs of objects
        for (let i = 0; i < this.gameObjects.length; i++){
            let obj1 = this.gameObjects[i];

            for (let j = i+1; j < this.gameObjects.length; j++){
                let obj2 = this.gameObjects[j];

                let interaction = new ForcePair(obj1, obj2, this.G);

                let isColliding = this.circleCollision(interaction)

                //console.log(isColliding);

                if (isColliding){
                    obj1.fx = -obj1.fx;
                    obj1.fy = -obj1.fy;
                    obj2.fx = -obj1.fx;
                    obj1.fy = -obj1.fy;
                }else{
                    obj1.fx = interaction.fgx
                    obj1.fy = interaction.fgy
                    
                    obj2.fx = -interaction.fgx
                    obj2.fy = -interaction.fgy    
                }

            }
        }        
    }

    gameLoop(timestamp){
        this.deltaTime = (timestamp - this.lasttime) / 1000;
        this.lasttime = timestamp;

        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update(this.deltaTime);
        }

        this.clearCanvas();

        this.edgeDetection();
        this.applyForces();

        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].draw()
        }

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
        
    }

    clearCanvas(){
        //clears the entire canvas element
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    circleCollision(interaction){
        let minDistance = interaction.obj1.radius + interaction.obj2.radius;

        if (interaction.sqDistance < (minDistance*minDistance)){
            return true;
        }else{
            return false;
        }
    }

    edgeDetection(){
        let obj;
        for (let i = 0; i < this.gameObjects.length; i++){
            obj = this.gameObjects[i]

            //check left wall
            if(obj.x < (obj.radius)){
                obj.vx = Math.abs(obj.vx);
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


}
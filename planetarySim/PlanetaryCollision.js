class PlanetaryCollision{
    constructor(canvasId, gravitationalConstant){
        //this.gravity = gravity
        this.G = gravitationalConstant;
        //this.timestamp = null;
        this.lasttime = performance.now();
        this.gameObjects = [];
        this.paused = false;
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
        this.totalMass = 0

        this.createObjects()

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))

    }

    randInRange(min, max){
        return (Math.random() * (max-min)) + min;
    }

    createObjects(){

        //forceObject(context, xPos, yPos, vx, vy, mass, radius)
        // let object1 = new ForceObject(this.context, 500, 400, 0, 0, 900, 30)
        // let object2 = new ForceObject(this.context, 700, 400, 0, -150, 100, 10)
        // let object3 = new ForceObject(this.context, 300, 400, 0, 150, 100, 10)
        // let object3 = new ForceObject(this.context, 600, 400, 18, -19, 10, 20)
        // let object4 = new ForceObject(this.context, 300, 200, -2, 16, 50, 40)   
        // this.totalMass = 90 + 30 + 10

        // this.gameObjects.push(object1)
        // this.gameObjects.push(object2)
        // this.gameObjects.push(object3)
        // this.gameObjects.push(object4)

        let intervals = 300
        let widthVal = Math.floor(this.width/intervals);
        let heightVal = Math.floor(this.height/intervals)
        for (var i = 0; i < widthVal; i++){
            for (var j = 0; j < heightVal; j++){
                let radius = this.randInRange(5,50);
                let mass =  (1/Math.PI) * radius * radius;
                let xPos = intervals * i + intervals/2;
                let yPos = intervals * j + intervals/2;
                // let vx = 0;
                // let vy = 0;
                let vx = this.randInRange(-50,50);
                let vy = this.randInRange(-50,50);
                
                let object = new ForceObject(this.context, xPos, yPos, vx, vy, mass, radius)
    
                this.gameObjects.push(object);
                this.totalMass += mass;
            }
        }
    }

    applyForces(deltaTime){
        //check for collision against walls
        //loop through all pairs of objects
        for (let i = 0; i < this.gameObjects.length; i++){
            let obj1 = this.gameObjects[i];

            for (let j = i + 1; j < this.gameObjects.length; j++){
                let obj2 = this.gameObjects[j];

                let interaction = new ForcePair(obj1, obj2, this.G, this.context);

                let isColliding = this.circleCollision(interaction)

                //console.log(isColliding);

                //new force 
                //F = ma so...
                //F = m dV/dt
                //F = m delta V / delta t
                //F = -Vnaught * mass / change in time

                if (isColliding){

                    obj1.x -= interaction.nv.x * (interaction.collisionDepth/2)
                    obj1.y -= interaction.nv.y * (interaction.collisionDepth/2)
                    obj2.x += interaction.nv.x * (interaction.collisionDepth/2)
                    obj2.y += interaction.nv.y * (interaction.collisionDepth/2)

                    // obj1.fx += obj2.fx;
                    // obj1.fy += obj2.fy;
                    // obj2.fx += -obj2.mass * obj2.vx / deltaTime;
                    // obj2.fy += -obj2.mass * obj2.vy / deltaTime;

                    // let velDiffX = obj2.vx - obj1.vx
                    // let velDiffY = obj2.vy - obj1.vy;


                    // obj1.fx += obj2.mass * velDiffX / deltaTime;
                    // obj1.fy += obj2.mass * velDiffY / deltaTime;
                    // obj2.fx += -obj2.mass * velDiffX / deltaTime;
                    // obj2.fy += -obj2.mass * velDiffY / deltaTime;
                    
                    //console.log(`${obj1.fx} || ${obj2.fx} || ${velDiffX}:${velDiffY}`)
                    // console.log(`${obj2.mass * velDiffX / deltaTime} : ${interaction.fgx}`)
                    // console.log(`${obj2.mass * velDiffY / deltaTime} : ${interaction.fgy}`)
                }
            }
        }        
    }

    moveObjects(){
        for (let i = 0; i < this.gameObjects.length; i++){
            let obj1 = this.gameObjects[i];

            for (let j = i + 1; j < this.gameObjects.length; j++){
                let obj2 = this.gameObjects[j];
                
                let interaction = new ForcePair(obj1, obj2, this.G, this.context);

                obj1.fx += interaction.fgx
                obj1.fy += interaction.fgy
                obj2.fx += -interaction.fgx
                obj2.fy += -interaction.fgy
                //console.log(`(${obj1.fx}:${obj1.fy}) || (${obj2.fx}:${obj2.fy})`)
            }
        }
    }

    gameLoop(timestamp){
        this.deltaTime = (timestamp - this.lasttime) / 1000;
        this.lasttime = timestamp;

        for (let i = 0; i < this.gameObjects.length; i++){
            // console.log(`${this.gameObjects[i].fx} : ${this.gameObjects[i].fy}`)
            this.gameObjects[i].fx = 0;
            this.gameObjects[i].fy = 0;

        }
        //this.clearForces();
        this.moveObjects();
        this.applyForces(this.deltaTime);
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update(this.deltaTime);
        }

        this.clearCanvas();

        this.edgeDetection();

        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].draw()
        }

        if (!this.paused){
            window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
        }

        
    }

    clearCanvas(){
        //clears the entire canvas element
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    circleCollision(interaction){
        let minDistance = interaction.obj1.radius + interaction.obj2.radius;

        if (interaction.distance < minDistance){
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
                obj.fx = 0.8*Math.abs(obj.fx);
                obj.vx = Math.abs(obj.vx);
                obj.x = (obj.radius);
            }
            //check right wall
            else if(obj.x > this.width - (obj.radius)){
                obj.fx = -0.8*Math.abs(obj.fx);
                obj.vx = -Math.abs(obj.vx);
                obj.x = this.width - (obj.radius);
            }

            //check top
            if (obj.y < (obj.radius)){
                obj.fy = 0.8*Math.abs(obj.fy);
                obj.vy = Math.abs(obj.vy);
                obj.y = (obj.radius);
            }
            //check bottom
            else if (obj.y > this.height - (obj.radius)){
                obj.fy = -0.8*Math.abs(obj.fy);
                obj.vy = -Math.abs(obj.vy);
                obj.y = this.height - (obj.radius);
            }
        }
    }


}
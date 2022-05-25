class FluidSim{
    constructor(canvasId){
        this.gravity = 9.81;
        this.canvas = null;
        this.ctx = null;
        this.lastTime = performance.now();
        this.gameObjects = [];
        this.width = null;
        this.height = null;
        this.isDrawing = false;
        this.startMousePos = {x:0,y:0};
        //console.log('ran the constructor');

        this.init(canvasId);
    }

    init(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.container = document.getElementById('sim');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;

        canvas.addEventListener('mousedown', function(evt){
            console.log("Mousedown");
            this.isDrawing = true;
            let rect = canvas.getBoundingClientRect()
            let mouseX = evt.clientX - rect.left;
            let mouseY = evt.clientY - rect.top;
            this.startMousePos = {
                x: mouseX, 
                y: mouseY
            };    
        }.bind(this), false);
        this.canvas.addEventListener('mouseup', function(evt){
            this.isDrawing = false;
            this.spawnObjects(evt)
        }.bind(this), false);
        this.canvas.addEventListener("mousemove", function(evt){
            if (this.isDrawing){
                console.log("drawing")
                this.createSpawnVisual(evt);
            }
        }.bind(this), false);
        
        window.requestAnimationFrame((timestamp) => {this.gameLoop(timestamp)})
    }

    gameLoop(timestamp){
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }

    update(dt){
        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].fy = this.gameObjects[i].mass * this.gravity;
            this.gameObjects[i].update(dt);
        }
    }

    draw(){
        this.clearCanvas();
        for (let i = 0; i < this.gameObjects.length; i ++){
            this.gameObjects[i].draw();
        }
    }

    clearCanvas(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    getMousePos(evt){
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    }

    addObject(evt){
        let rect = canvas.getBoundingClientRect()
        let mouseX = evt.clientX - rect.left;
        let mouseY = evt.clientY - rect.top;
        let mousePos = {
            x: mouseX, 
            y: mouseY
        };

        // this.ctx.beginPath();
        // this.ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI);
        // this.ctx.fill();

        let newObj = new Molecule(this.ctx, mousePos.x, mousePos.y);
        //console.log(newObj);

        this.gameObjects.push(newObj);
        //console.log(this.gameObjects);
    }

    createSpawnVisual(evt){
        let rect = canvas.getBoundingClientRect()
        let curMousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
        console.log(`(${this.startMousePos.x} : ${this.startMousePos.y})`)
        console.log(`(${curMousePos.x} : ${curMousePos.y})`)

        this.ctx.fillstyle = '#3273a8'
        this.ctx.beginPath();
        this.ctx.rect(this.startMousePos.x, this.startMousePos.y, curMousePos.x, curMousePos.y);
        this.ctx.fill();
        this.ctx.stroke();
    }

    spawnObjects(evt){
        let rect = canvas.getBoundingClientRect()
        let curMousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
        
        let xDif = this.startMousePos.x - curMousePos.x;
        let yDif = this.startMousePos.y - curMousePos.y;

        for (let i = 0; i < xDif/10; i++){
            let newObj = new Molecule(this.ctx, this.startMousePos.x + i, this.startMousePos.y);
            this.gameObjects.push(newObj);
        }
    }
}

window.onload = function (){
    //console.log("running the onload function");
    fluidSim = new FluidSim('canvas');
}
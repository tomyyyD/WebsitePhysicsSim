var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width, height;

var resize = function() {
    width = window.innerWidth-20;
    height = window.innerHeight-20;
    canvas.width = width;
    canvas.height = height;
}
window.onresize = resize
resize()

var size = 40
var object1 = {
    x: 90,
    y: 300,
    size: size,
}
var object2 = {
    x: 150,
    y: 500,
    size: size,
}

var objects = [object1, object2];

function draw(){
    ctx.clearRect(0,0, width, height)
    //draws all objects in list
    for (var i = 0; i < objects.length; i++){
        ctx.fillRect(objects[i].x, objects[i].y, objects[i].size, objects[i].size)
    }
}

function update(){

    //check for box collision
    if (objects[0].x < objects[1].x + objects[1].size && 
        objects[0].x + objects[0].size > objects[1].x &&
        objects[0].y < objects[1].y + objects[1].size && 
        objects[0].y + objects[0].size > objects[1].y){
        //there is collision
        if (objects[0].x > objects[1].x+objects[1].size){

        }
        
            console.log("collision");
    }

    //floor detection
    for (var i = 0; i < objects.length; i++){
        if (objects[i].y < height - size){
            //console.log(`${objects[i][1]} | ${height}`)
            objects[i].y += 9.81;
        }else{
            objects[i].y = height - size;
        }
    }
    
}

function clickToDraw(event){
    var xPos = event.clientX;
    var yPos = event.clientY;

    //adds new object to list
    var object = {
        x: xPos - (size/2),
        y: yPos - (size/2),
        size: size,
    }
    objects.push(object);
}

function loop(timestamp){
    var progress = (timestamp - lastRender)
    
    draw()
    update();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);

//window.addEventListener("mousedown", clickToDraw);
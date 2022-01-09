var physicsSim = null;
var canvas = document.getElementById('canvas')

function main(canvasId){
    var gravSlider = document.getElementById('gravity')

    var restitutionSlider = document.getElementById('restitution')

    physicsSim = new PhysicsSim(canvasId, gravSlider.value, restitutionSlider.value)
}

//get live gravity
var gravSlider = document.getElementById('gravity');
var gravlabel = document.getElementById('gravLabel')

gravSlider.oninput = function(){
    gravlabel.innerHTML = "Gravity: " + this.value;
    physicsSim.gravity = this.value;
    //console.log(physicsSim.gravity)
}

var restSlider = document.getElementById('restitution')
var restLabel = document.getElementById('restLabel')

restSlider.oninput = function(){
    restLabel.innerHTML = "Restitution: " + this.value;
    physicsSim.restitution = 1 - (this.value / 100);
    //console.log(physicsSim.gravity)
}

canvas.addEventListener('click', function(evt){
    // console.log("click occured");
    var mousePos = getMousePos(evt)

    //gets random values
    let size = physicsSim.randInRange(50, 200)
    let vx = physicsSim.randInRange(-50, 50)
    let vy = physicsSim.randInRange(-50, 50)

    //creates new circle object
    var newObj = new Circle(physicsSim.ctx, mousePos.x, mousePos.y, vx, vy, size, gravSlider.value)
    
    //pushes new object to gameobject list
    physicsSim.gameObjects.push(newObj);
}, false)

function getMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
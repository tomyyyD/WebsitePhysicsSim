let physicsSim = null;

function startPlanets(canvasId){

    physicsSim = null;
    //G in real life = 6674 / 100000000000000
    //let gravConstant = 6674 / 100000000000000
    let gravConstant = 10;

    physicsSim = new PlanetaryCollision(canvasId, gravConstant)
}

function pause (){
    physicsSim.paused = !physicsSim.paused;
    var button = document.getElementById("pauseButton");
    var startButton = document.getElementById("startButton");
    if (physicsSim.paused){
        button.innerHTML = "play";
        startButton.disabled = true;
    }else{
        button.innerHTML = "pause";
        startButton.disabled = false;
    }
        
}

let physicsSim = null;

function startPlanets(canvasId){

    //G in real life = 6674 / 100000000000000
    let gravConstant = 1;

    physicsSim = new PlanetaryCollision(canvasId, gravConstant)
}

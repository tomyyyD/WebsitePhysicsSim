function startPlanets(canvasId){

    let gravConstant = 6674 / 100000000000000;

    physicsSim = new PlanetaryCollision(canvasId, gravConstant)
}

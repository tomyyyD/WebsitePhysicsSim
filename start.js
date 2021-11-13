

function main(canvasId){
    var physicsSim = null;
    var gravSlider = document.getElementById('gravity')

    var restitutionSlider = document.getElementById('restitution')

    physicsSim = new PhysicsSim(canvasId, gravSlider.value, restitutionSlider.value)
}

//function 
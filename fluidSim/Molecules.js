class Molecule{
    constructor(context, px, py){
        this.context = context;
        this.px = px;
        this.py = py;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.fx = 0;
        this.fy = 0;

        this.isColliding = false;
        this.radius = 5;
        this.mass = 5;
    }

    draw(){
        this.context.fillStyle = '#3273a8';
        this.context.beginPath();
        this.context.arc(this.px, this.py, this.radius, 0, 2 * Math.PI);
        this.context.fill();

        this.context.stroke()
    }

    update(dt){
        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        this.vx = this.vx + this.ax * dt;
        this.vy = this.vy + this.ay * dt;

        this.px = this.px + this.vx * dt + 0.5 * this.ax * dt * dt;
        this.py = this.py + this.vy * dt + 0.5 * this.ay * dt * dt;

    }
}
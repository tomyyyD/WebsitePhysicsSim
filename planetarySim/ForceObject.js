class ForceObject{
    constructor(context, x,y, mass, radius){
        this.context = context

        this.x = x;
        this.y = y;
        this.mass = mass;
        this.radius = radius;
        this.fx = 0;
        this.fy = 0;
        this.ax = 0;
        this.ay = 0;
        this.vx = 0;
        this.vy = 0;
    }

    draw(){
        //draw the square
        this.context.fillStyle = '#0099b0';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius/2, 0, 2*Math.PI);
        this.context.fill();
        this.context.fillStyle = 'black';

        //actually draw stuff to screen
        this.context.stroke();
    }

    update(deltaTime){
        //calc acceleration in x and y w/ f=ma
        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        //calc velocity with vf = vi + at
        this.vx += this.ax * deltaTime;
        this.vy += this.ay * deltaTime;

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
}
class Circle extends GameObject{
    constructor(context, x, y, vx, vy, mass, gravity){
        super(context, x, y, vx, vy, mass, gravity);

        //default width and height
        this.size = this.mass;
        this.radius = this.size / 2;
    }

    draw(){
        //draw the square
        this.context.fillStyle = '#0099b0';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size/2, 0, 2*Math.PI);
        this.context.fill();
        this.context.fillStyle = 'black';

        //draw velocity vector
        this.context.moveTo(this.x, this.y)
        this.context.lineTo(this.x + this.vx/3, this.y + this.vy/3)
        
        //actually draw stuff to screen
        this.context.stroke();
    }

    update(secondsPassed){
        //gravity
        this.vy += this.gravity * 100 * secondsPassed;

        //move with velocity
        this.x += (this.vx * secondsPassed);
        this.y += (this.vy * secondsPassed);
    }
}
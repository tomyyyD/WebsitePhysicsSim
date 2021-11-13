class Circle extends GameObject{
    constructor(context, x, y, vx, vy, mass, gravity){
        super(context, x, y, vx, vy, mass, gravity);

        //default width and height
        this.size = this.mass;
    }

    draw(){
        //draw the square
        //weird JS if statement changing color if block is in collision
        this.context.fillStyle = '#0099b0';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.size/2, 0, 2*Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    update(secondsPassed){
        //gravity
        //console.log(secondsPassed)
        this.vy += this.gravity * 100 * secondsPassed;
        


        //move with velocity
        this.x += (this.vx * secondsPassed);
        this.y += (this.vy * secondsPassed);

        //console.log(this.vy)
    }
}
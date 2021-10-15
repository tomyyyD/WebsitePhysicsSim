class Square extends GameObject{
    constructor(context, x, y, vx, vy, mass){
        super(context, x, y, vx, vy, mass);

        //default width and height
        this.width = 50;
        this.height = 50;
    }

    draw(){
        //draw the square
        //weird JS if statement changing color if block is in collision
        this.context.fillstyle = this.isColliding?'#ff8080':'#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);

    }
}
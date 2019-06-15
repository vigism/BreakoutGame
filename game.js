var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dX = 2;
var dY = -2;
var ballRadius = 10;

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall();

    if(y + dY > canvas.height-ballRadius || y + dY < ballRadius){
        dY = -dY;
    }

    if(x + dX > canvas.width-ballRadius || x + dX < ballRadius){
        dX = -dX;
    }
    x += dX;
    y +=  dY;
    
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

setInterval(draw,10);
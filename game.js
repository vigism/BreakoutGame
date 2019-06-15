var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//canvas variables
var x = canvas.width/2;
var y = canvas.height-30;

//ball variables
var dX = 2;
var dY = -2;
var ballRadius = 10;

//paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//control variables
var rightPressed = false;
var leftPressed = false;

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    //ball logic
    drawBall();

    if(y + dY > canvas.height-ballRadius || y + dY < ballRadius){
        dY = -dY;
    }

    if(x + dX > canvas.width-ballRadius || x + dX < ballRadius){
        dX = -dX;
    }
    x += dX;
    y +=  dY;

    //paddle logic
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }else if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    drawPaddle();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth,paddleHeight);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

//listeners
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }else if (e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
}

setInterval(draw,10);
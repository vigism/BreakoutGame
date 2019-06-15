var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//ball variables
var x = canvas.width/2;
var y = canvas.height-30;
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

//brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount;c++){
    bricks[c] = [];
    for(var r = 0;r < brickRowCount; r++){
        bricks[c][r] = {x:0,y:0};
    }
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    //ball logic
    drawBall();
    if( y + dY < ballRadius){
        dY = -dY;
    } else if (y + dY > canvas.height-ballRadius){
        if (x>paddleX && x < paddleX+paddleWidth){
            dY = -dY;
        }else{ //game over logic
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
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
    drawBricks();
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

function drawBricks(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0;r < brickRowCount; r++){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth,brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
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

var interval = setInterval(draw,10);

class Brick {

    constructor(x, y, status, type) {
        this.x = x;
        this.y = y;
        this.status = status;
        this.type = type;
    }

}

class Bomb {

    constructor(x, y) {
        this.x = x;
        this.y = y;

    }

}


let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//ball variables
let x = canvas.width/2;
let y = canvas.height-30;
let dX = 5;
let dY = -4;
let ballRadius = 14;

//paddle variables
let paddleHeight = 25;
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth)/2;

//control variables
let rightPressed = false;
let leftPressed = false;

//brick variables
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 100;
let brickHeight = 40;
let brickPadding = 20;
let brickOffsetTop = 50;
let brickOffsetLeft = 70;
let bricks = [];
for(let c=0; c<brickColumnCount;c++){
    bricks[c] = [];
    for(let r = 0;r < brickRowCount; r++){
        bricks[c][r] = new Brick(0,0,1,(c+r)%3);
    }
}

//game variables
let score = 0;
let lives = 3;

//control reversed
let reverseControl = false;

//bomb variables
let bombs = [];
let bombRadius = 14;
let bombDY = -3;

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    //ball logic
    drawBall();
    if( y + dY < ballRadius){
        dY = -dY;
    } else if (y + dY > canvas.height-paddleHeight){
        if (x>paddleX && x < paddleX+paddleWidth){
            dY = -dY;
        }else{ //game over logic
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                 // Needed for Chrome to end game
            }
            else {
                x = canvas.width/2;
                y = canvas.height-200;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x + dX > canvas.width-ballRadius || x + dX < ballRadius){
        dX = -dX;
    }
    x += dX;
    y +=  dY;

    //paddle logic
    if(!reverseControl){
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    }else if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    }else{
        if(leftPressed && paddleX < canvas.width-paddleWidth){
            paddleX += 7;
        }else if (rightPressed && paddleX > 0){
            paddleX -= 7;
        }
    }

    //move bombs
    for(let i = 0; i < bombs.length; i++) {
        bombs[i].y -= bombDY;
        if(bombs[i].y > canvas.height) {
            bombs.splice(i, 1);

        }
    }
    drawPaddle();
    drawScore();
    drawHUD();
    drawLives();
    collisionDetection();
    collisionDetectionBomb();
    collisionDetectionBombPaddle();
    drawBricks();
    drawBombs();
    requestAnimationFrame(draw);
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
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0;r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                if(bricks[c][r].type===0){
                    ctx.fillStyle = "#0095DD";
                }else if(bricks[c][r].type===1){
                    ctx.fillStyle = "#008000";
                }else {
                    ctx.fillStyle = "#B22222";
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBombs() {
    for(let i = 0; i < bombs.length; i++) {
        ctx.beginPath();
        ctx.arc(bombs[i].x,bombs[i].y,bombRadius,0,Math.PI*2);
        ctx.fillStyle="#000000";
        ctx.fill();
        ctx.closePath();
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score,8,20);

}

function drawHUD() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Controls Reversed: "+reverseControl,100,20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65 ,20);
}

//listeners
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX>0 && relativeX<canvas.width){
        paddleX = relativeX- paddleWidth/2;
    }
}


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

//collision detection with ball and bricks
function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0;r < brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status === 1){
                if (x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
                    if(b.type === 1){
                        reverseControl = !reverseControl;
                    }else if(b.type === 2) {
                        bombs.push(new Bomb(b.x+brickWidth/2, b.y+brickHeight))
                    }
                    
                    dY = -dY;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                         
                    }
                }
            }
        }
    }
}

//collision detection with bomb and bricks
function collisionDetectionBomb(){
    for(let i = 0; i < bombs.length; i++) {
        let curBomb = bombs[i];
        for(let c = 0; c < brickColumnCount; c++){
            for(let r = 0;r < brickRowCount; r++){
                let b = bricks[c][r];
                if(b.status === 1){
                    if (curBomb.x>b.x && curBomb.x<b.x+brickWidth && curBomb.y>b.y && curBomb.y<b.y+brickHeight){
                        if(b.type === 1){
                            reverseControl = !reverseControl;
                        }else if(b.type === 2) {
                            bombs.push(new Bomb(b.x+brickWidth/2, b.y+brickHeight))
                        }
                        b.status = 0;
                        score++;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                             
                        }
                        bombs.splice(i,1)
                    }
                }
            }
        }

    }
}

//collision of bomb with paddle
function collisionDetectionBombPaddle() {

    for(let i = 0; i < bombs.length; i++) {
        let curBomb = bombs[i];
        if(curBomb.x > paddleX && curBomb.x < paddleX + (paddleWidth-(bombRadius/2)) && curBomb.y > canvas.height-paddleHeight){
            //if bomb hits paddle
            bombs.splice(i,1);
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
                 // Needed for Chrome to end game
            }
            else {
                x = canvas.width/2;
                y = canvas.height-200;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

}
draw();



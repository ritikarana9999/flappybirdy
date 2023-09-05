//board

let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//bird
let birdwidth = 34;
let birdheight = 24;
let birdx = boardwidth/8;
let birdy = boardheight/2;
let birdimg;

let bird = {
    x : birdx,
    y : birdy,
    width : birdwidth,
    height : birdheight
}

//pipes 
let piparr = [];
let pipwidth = 64;
let pipheight = 512;
let pipx = boardwidth;
let pipey = 0;

let toppipimg;
let bottompipimg ;

//physics 
let velocityx = -2;
let velocityy = 0; //bird jump speed
let gravity = 0.4;

let gameover = false;
let score = 0;



window.onload = function(){
    board= document.getElementById("board")
    board.height = boardheight;
    board.width = boardwidth;
    context= board.getContext("2d"); //used for drawing the board


    //drawing the bird
    /*context.fillStyle = "green" 
    context.fillRect(bird.x , bird.y, bird.width, bird.height); */


    //loading the image
    birdimg = new Image();
    birdimg.src="./bird.png";
    birdimg.onload = function(){
        context.drawImage(birdimg, bird.x,bird.y,bird.width,bird.height);
    }

toppipimg = new Image();
toppipimg.src = "./down.png";

bottompipimg = new Image();
bottompipimg.src = "./pipe.png";

requestAnimationFrame(update);
setInterval(placepip, 1500);
document.addEventListener("keydown", movebird);
document.addEventListener("click", movebird);

}

function update() {
    requestAnimationFrame(update);
    if (gameover){
        return;
    }
    context.clearRect(0,0, board.width, board.height);
 
    //bird
    velocityy += gravity;
    //bird.y += velocityy;
    bird.y = Math.max(bird.y + velocityy, 0);
    context.drawImage(birdimg, bird.x,bird.y,bird.width,bird.height);

    if (bird.y > board.height){
        gameover = true;
    }

    
    //pipes
    for (let i = 0 ; i< piparr.length; i++){
        let pipe = piparr[i];
        pipe.x += velocityx; // for moving the pipe in the right direction,
        context.drawImage(pipe.img , pipe.x , pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipwidth){
            score += 0.5; // 2 pipes
            pipe.passed = true;
        }
        if (detectcollision(bird , pipe)){
            gameover = true;
        }
    }

    //clear pipes
    while(piparr.length > 0 && piparr[0].x < -pipwidth){
        piparr.shift();
    }

    //score
    context.fillStyle ="white";
    context.font ="45px sans-serif";
    context.fillText(score,5,45);

    if (gameover){
        context.fillText("GAME OVER",5,90);
    }

}

function placepip(){

    if (gameover){
        return;
    }

    let randompipey = pipey - pipheight/4 - Math.random()*(pipheight/2);
    let openspace = board.height/4;

    let toppip = {
        img : toppipimg, 
        x : pipx,
        y : randompipey,
        width : pipwidth,
        height : pipheight,
        passed : false
    }


    piparr.push(toppip);
    
    let bottompip = {
        img: bottompipimg,
        x : pipx,
        y : randompipey + pipheight + openspace,
        width : pipwidth,
        height : pipheight,
        passed : false
    }

    piparr.push(bottompip);


}


function movebird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.type == "click"|| e.code == "keyx"){
        velocityy = -6;

        // reset
        if (gameover){
            bird.y = birdy;
            piparr = [];
            score = 0;
            gameover = false;
        }
    }
}

function detectcollision(a,b){

    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

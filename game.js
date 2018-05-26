var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var w1 = (screenWidth/2) - screenWidth*0.1;;
var w2 = screenWidth*0.14;
document.getElementById("title").style.marginLeft = w1+"px";//Aligning title in the centre by manipulating margin-left property
canvas.style.marginLeft = w2+"px";//Aligning canvas in the centre by manipulating margin-left property

var mouseX=100;
var mouseY=300;
var oldMouseX=100;
var oldMouseY=300; 
var radius=30;//Character's radius
var score=0;
var nWalls=6;//Number of walls to be generated initially
var speed=2.7;//speed at which the obstacles approach the character

var collision=false; 
var pause=false;
var quit=false;
var gameOver=false;

var obstacleArray = new Array();

var x;
var y;
var side;
var breadth=45;
var length;
var i=0;
var j=0;
var time=0;
var inc=0.05;

var dead = new Audio("audio/dead.wav");

document.onmousemove = readMouseMove;

document.addEventListener("keydown",function(event){

	if(event.keyCode == 82){// R keyCode
		stopAudio(dead);
		window.location.reload();
	}

	if(event.keyCode==80){//p pause/resume
        if(pause==false){
        	pause=true;
        }
        else{
        	pause=false;	
        	animation();
        }
       	if(quit==true&&pause==true){
        	initialise();
			quit=false;
			pauseGameDraw();
       	}
    }

    if(event.keyCode==81){//q quit
        quit=true;
    }

},false);

function stopAudio(audio) {    //Function to stop audio the current audio from playing
    audio.pause();
    audio.currentTime = 0;
}

function circleRectangleCollision(circle,rect){
	var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    //Testing collision at points other than corners
    if(distX>(rect.w/2 + circle.r)){
    	return false; 
    }
    if(distY>(rect.h/2 + circle.r)){
    	return false;
    }
    if(distX<=(rect.w/2)){
    	console.log(distX-rect.w/2);
    	return true;
    } 
   	if(distY<=(rect.h/2)){
   		return true;
   	}

   	//Testing for collision at corner points 
   	var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return(dx*dx+dy*dy<=(circle.r*circle.r));	
}

function readMouseMove(e){
	if(pause==false&&gameOver==false){
		mouseX = e.clientX-243;
		mouseY = e.clientY-126;
		if(mouseX<0){
			mouseX=0;
		}
		if(mouseX>canvasWidth){
			mouseX=canvasWidth;
		}
		if(mouseY<0){
			mouseY=0;
		}
		if(mouseY>canvasHeight){
			mouseY=canvasHeight;
		}
		if(oldMouseX<mouseX||oldMouseY!=mouseY){
			scoreUpdate();
		}
		oldMouseX=mouseX;
		oldMouseY=mouseY;
		drawCharacter();
	}
}

function obstacle(x,y,breadth,length,side){
	this.x=x;
	this.y=y;
	this.breadth = breadth;
	this.length = length;
	this.side = side;

	this.update = function(){
		if(this.x<-breadth){
			this.x=canvasWidth;
			if(this.side=="north"){
				this.length = 300+Math.random()*100;
			}
			else{
				this.length=500;
				this.y=270+Math.random()*100;
			}
		}
	}

	this.collide = function(){
		var circle={x:mouseX,y:mouseY,r:radius};
		var rect={x:this.x,y:this.y,w:this.breadth,h:this.height};

		collision=circleRectangleCollision(circle,rect);
		if(collision==true){
			console.log("Gameover");
			//gameOver=true;
		}
	}
}

function obstaclePosition(i){
	x = canvasWidth-170*i;
	x+=250;
	if(i%2==0){
		side="north";
		y=0;
		length = 300+Math.random()*100;
	}
	else{
		side="south";
		y=270+Math.random()*100;
		length=500;
	}
	breadth = 45;
	obstacleArray.push(new obstacle(x,y,breadth,length,side)); 
}

for(i=0;i<nWalls;i++){
	obstaclePosition(i);
}

function drawCharacter(){
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.arc(mouseX,mouseY,radius,0,2*Math.PI);
	ctx.fill();	
}

function drawObstacles(x,y,breadth,length){
	ctx.fillStyle = "#ff1744";
	ctx.fillRect(x,y,breadth,length);
}

function obstaclesUpdate(){
	for(j=0;j<nWalls;j++){
		obstacleArray[j].update();
		obstacleArray[j].collide();
		drawObstacles(obstacleArray[j].x,obstacleArray[j].y,obstacleArray[j].breadth,obstacleArray[j].length);
		obstacleArray[j].x-=speed;
	}
}

function scoreUpdate(){
	time+=inc;
	score=Math.round(speed*time);
}

function scoreDraw(){	
	ctx.fillStyle = "white";
	ctx.font = "25px bold Trebuchet MS";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.12,canvasHeight-canvasHeight*0.05);
	ctx.fillStyle = "#ff1744";
}	

function initialise(){
	drawCharacter();
	obstaclesUpdate();
	scoreDraw();
}

function pauseGameDraw(){//Function which draws the card placed on game pause
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,600,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("GAME PAUSED",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Press P to resume",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.52);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.40);
}

function quitGameDraw(){//Function which draws the card placed on game quit
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,600,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("Are you sure to Quit?",canvasWidth-canvasWidth*0.64,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Press P to resume",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.52);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.40);
}

function gameOverDraw(){//end screen to draw on canvas when the game is over
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,600,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("GAME OVER",canvasWidth-canvasWidth*0.59,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.57,canvasHeight-canvasHeight*0.53);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.60,canvasHeight-canvasHeight*0.40);
}


function animation(){

	initialise();

	if(pause==true){
		pauseGameDraw();
		return;
	}
	if(quit==true){
		pause=true;
		quitGameDraw();
		return;
	}
	if(gameOver==true){//Gameover condition checking
		dead.play();
		gameOverDraw();
		return;
	}

	requestAnimationFrame(animation);
}

animation();
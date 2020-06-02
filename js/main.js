const FPS = 10; // Frames per second
var canvas = null;
var context2D = null;

var snakes = new Array();
var x = new Array();
var y = new Array();
var dx = new Array();
var dy = new Array();

var crash;
var pause;
var go = new Image();
go.src = "img/gameover.PNG";

var points = 0;

var xf, yf;
var eaten;
var food = new Image();
var foods = ["img/apple.PNG", "img/banana.PNG", "img/peach.PNG", "img/strawberry.PNG"];

var xb, yb;
var bonusactivated;
var bonus = new Image();
var bonusimg = ["img/fruta1.gif", "img/fruta2.gif", "img/fruta3.gif"];
var bonusimgn, bonuspoint, bonuson, bonusused;

var keys = new Array();
window.addEventListener('keydown', keyDown, true);
window.addEventListener('mouseup', mouseUp, true);

function keyDown(evt){
	keys[37] = false;keys[65] = false;keys[39] = false;keys[68] = false;keys[38] = false;keys[87] = false;keys[40] = false;keys[83] = false;
	keys[evt.keyCode] = true;
}

var xdp, ydp, click;
function mouseUp(evt){
	xdp = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	ydp = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	xdp -= canvas.offsetLeft;
	ydp -= canvas.offsetTop;
	click = true;
}

function loadImages(sources, callback){
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	for (var src in sources) {
		numImages++;
	}
	for (var src in sources) {
		images[src] = new Image();
		images[src].onload = function(){
			if (++loadedImages >= numImages) {
				callback(images);
			}
		};
		images[src].src = sources[src];
	}
	console.log("loaded");
}

window.onload = function(){
	var sources = {
		apple: 		"img/apple.PNG",
		banana: 	"img/banana.PNG", 
		peach: 		"img/peach.PNG", 
		strawberry: "img/strawberry.PNG", 
		bodyx: 		"img/bodyx.PNG", 
		bodyy: 		"img/bodyy.PNG", 
		headx1: 	"img/headx-.PNG",
		headx2: 	"img/headx+.PNG", 
		heady1: 	"img/heady-.PNG",
		heady2:		"img/heady+.PNG", 
		tailx1: 	"img/tailx-.PNG", 
		tailx2:		"img/tailx+.PNG", 
		taily1: 	"img/taily-.PNG",
		taily2: 	"img/taily+.PNG", 
		turn1: 		"img/turn1.PNG", 
		turn2:		"img/turn2.PNG",
		turn3: 		"img/turn3.PNG",
		turn4: 		"img/turn4.PNG",
		gameOver: 	"img/gameover.PNG",
		fruta1: 	"img/fruta1.PNG",
		fruta2: 	"img/fruta2.PNG",
		fruta3: 	"img/fruta3.PNG"
	};
	loadImages(sources, drawImages);
};
	
function gameOver() {
	crash = true;
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	context2D.drawImage(go, 0, 180);
	snakes = [];
	x = [];
	y = [];
	dx = [];
	dy = [];
}

function rank() {
	var nome = prompt("Por favor digite seu nome","Jogador");
	var ranktext = document.getElementById("right");
	ranktext.innerHTML= $('div.rank').html() + "<br />" + nome + ": " + points + " pontos";
	gameOver();
}

function delBonus() {
	console.log("acabo");
	bonusactivated = false;
	bonuson == false;
}

function createBonus() {
	if(bonusactivated == true) {
		if(bonusused == false) {
			bonusused = true;
			xb = Math.floor(Math.random()*20);
			yb = Math.floor(Math.random()*20);
			for(var i = 0; i <= snakes.length; i++) {
				if(xb == x[i] && yb == y[i]) {
					xb = Math.floor(Math.random()*20);
					yb = Math.floor(Math.random()*20);
				} 
			}
			console.log(xb + " " + xb);
			bonus.src = bonusimg[bonusimgn];
		}
	}
}

function start() {
	keys[37] = false;keys[65] = false;keys[39] = false;keys[68] = false;keys[38] = false;keys[87] = false;keys[40] = false;keys[83] = false;
	crash = false;
	click = false;
	eaten = true;
	bonusactivated = false;
	bonuson = false;
	bonusused = false;
	bonusimgn = 0;
	bonuspoint = Math.floor(Math.random()*100)*10;
	console.log(bonuspoint);
	pause = false;
	snakes[0] = new Image();
	snakes[0].src = "img/headx-.PNG";
	x[0] = 500;
	y[0] = 0;
	dx[0] = -25;
	dy[0] = 0;
	createTail();
	createTail();
	points = 0;
}

function createFood() {
	if(eaten == true) {
		eaten = false;
		var randf = Math.floor(Math.random()*4);
		xf = Math.floor(Math.random()*20);
		yf = Math.floor(Math.random()*20);
		for(var i = 0; i <= snakes.length; i++) {
			if(xf == x[i] && yf == y[i]) {
				xf = Math.floor(Math.random()*20);
				yf = Math.floor(Math.random()*20);
			} 
		}
		food.src = foods[randf];
	}
}

function createTail() {
	var tam = snakes.length;
	snakes[tam] = new Image();
	
	if(tam > 0) {
		if((dx[tam-1] == 25) && (dy[tam-1] ==0)) {
			x[tam] = x[tam-1] - 25;
			y[tam] = y[tam-1];
			dx[tam] = 25;
			dy[tam] = 0;
			snakes[tam-1].src = "img/bodyx.PNG";
			snakes[tam].src = "img/tailx+.PNG";
		} else if((dx[tam-1] == -25) && (dy[tam-1] == 0)) {
			x[tam] = x[tam-1] + 25;
			y[tam] = y[tam-1];
			dx[tam] = -25;
			dy[tam] = 0;
			snakes[tam-1].src = "img/bodyx.PNG";
			snakes[tam].src = "img/tailx-.PNG";
		} else if((dx[tam-1] == 0) && (dy[tam-1] == 25)) {
			x[tam] = x[tam-1];
			y[tam] = y[tam-1] - 25;
			dx[tam] = 0;
			dy[tam] = 25;
			snakes[tam-1].src = "img/bodyy.PNG";
			snakes[tam].src = "img/taily+.PNG";
		} else if((dx[tam-1] == 0) && (dy[tam-1] == -25)) {
			x[tam] = x[tam-1]
			y[tam] = y[tam-1] + 25;
			dx[tam] = 0;
			dy[tam] = -25;
			snakes[tam-1].src = "img/bodyy.PNG";
			snakes[tam].src = "img/taily-.PNG";
		}
		
	}
}

function checkEat() {
	if(bonusactivated == true) {
		if(x[0] == xb*25 && y[0] == yb*25) {
			points = points + 50;
			bonusactivated = false;
			createTail();
		}
	}
	if(x[0] == xf*25 && y[0] == yf*25) {
		points = points + 10;
		eaten = true;
		createTail();
	}
}

function checkWall() {
	var obj = document.getElementById('block');
	if(obj.checked)
		return true;
	else
		return false;
}

window.onload = init;
function init() {
	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');
	var textbox = document.getElementById('pontos');
	textbox.readOnly = true;
	start();
	key = false;
	setInterval(commands, 1);
	setInterval(randbonusimg, 500);
	setInterval(draw, 1000/FPS);
}

function randbonusimg() {
	if(bonusimgn == 2)
		bonusimgn = 0
	else
		bonusimgn = bonusimgn + 1;
	bonus.src = bonusimg[bonusimgn];
}

function draw() {
	if(crash == false) {
		if (80 in keys && keys[80]) {
			false;keys[80] = false;
			if(pause == true) {
				pause = false;
			} else if(pause == false) {
				pause = true;
			}
		}
		if(pause == false) {
			update();
			context2D.clearRect(0, 0, canvas.width, canvas.height);
			context2D.strokeStyle = "rgba(0,0,0,255)";
			for(var i = 0; i<snakes.length; i++) {
				context2D.drawImage(snakes[i], x[i], y[i]);
			}
			if(dx[0] == -25)
				snakes[0].src = "img/headx-.PNG";
			addPoints();
			context2D.drawImage(food, xf*25, yf*25);
			if(bonusactivated == true)
				context2D.drawImage(bonus, xb*25, yb*25);
		}
		if (82 in keys && keys[82]) {
			keys[82] = false;
			rank();
			//gameOver();
			setTimeout("start()",1000);
		}
	} else {
		//rank();
		gameOver();
	}
}

function commands() {
	if(crash == false) {
		if(click) {
			if(xdp >= 165 && ydp >= 0 && xdp <= 500-165 && ydp <= 165) {
				keys[38] = true;
			} else if(xdp >= 165 && ydp >= 500-165 && xdp <= 500-165 && ydp <= 500) {
				keys[40] = true;
			} else if(xdp >= 0 && ydp >= 165 && xdp <= 165 && ydp <= 500-165) {
				keys[37] = true;
			} else if(xdp >= 500-165 && ydp >= 165 && xdp <= 500 && ydp <= 500-165) {
				keys[39] = true;
			}
			click = false;
		}
		if(dx[0] != 25) {
			if ((keys[37]) || (keys[65]) ) { //left
				dx[0] = -25;
				dy[0] = 0;
				snakes[0].src = "img/headx-.PNG";
				keys[37] = false;
			}
		}
		if(dx[0] != -25) {
			if ((keys[39]) || (keys[68])) { //right
				dx[0] = 25;
				dy[0] = 0;
				snakes[0].src = "img/headx+.PNG";
				keys[39] = false;
			}
		}
		if(dy[0] != 25) {
			if ((keys[38]) || (keys[87])) { //up
				dx[0] = 0;
				dy[0] = -25;
				snakes[0].src = "img/heady-.PNG";
				keys[38] = false;
			}
		}
		if(dy[0] != -25) {
			if ((keys[40]) || (keys[83])) { //down
				dx[0] = 0;
				dy[0] = 25;
				snakes[0].src = "img/heady+.PNG";
				keys[40] = false;
			}
		}
	}
}

function update() {
	for(var d = snakes.length - 1; d > 0; d--) {
		if(d != 0) {
			x[d] = x[d-1];
			y[d] = y[d-1];
			dx[d] = dx[d-1];
			dy[d] = dy[d-1];
		}
	}
	
	x[0] = x[0] + dx[0];
	y[0] = y[0] + dy[0];
	
	if(snakes.length > 1) {
		for(var i = 1; i<snakes.length; i++) {
			if(x[0] == x[i] && y[0] == y[i]) {
				if(dy[0] == -25 && dy[i] == 25) {
					dy[0] = 25;	y[0] = y[1] + 25;
					snakes[0].src = "img/heady+.PNG";
				} else if(dy[0] == 25 && dy[i] == -25) {
					dy[0] = -25;
					y[0] = y[1] - 25;
					snakes[0].src = "img/heady-.PNG";
				} else if(dx[0] == 25 && dx[i] == -25) {
					dx[0] = -25;
					x[0] = x[1] - 25;
					snakes[0].src = "img/headx-.PNG";
				} else if(dx[0] == -25 && dx[i] == 25) {
					dx[0] = 25;
					x[0] = x[1] + 25;
					snakes[0].src = "img/headx+.PNG";
				} else {
					rank();
					setTimeout("start()",1000);
				}
			}
		}
	}
	
	for(var i = 1; i<snakes.length; i++) {
		if(i-1 != 0) {
			if(x[i] == x[i-1])
				snakes[i-1].src = "img/bodyy.PNG";
			if(y[i] == y[i-1])
				snakes[i-1].src = "img/bodyx.PNG";
				
			if(dx[i] == 25 && dy[i-1] == -25)
				snakes[i-1].src = "img/turn1.PNG";
			else if(dx[i] == 25 && dy[i-1] == 25)
				snakes[i-1].src = "img/turn3.PNG";
			else if(dx[i] == -25 && dy[i-1] == 25)
				snakes[i-1].src = "img/turn2.PNG";
			else if(dx[i] == -25 && dy[i-1] == -25)
				snakes[i-1].src = "img/turn4.PNG";
			else if(dx[i-1] == 25 && dy[i] == -25)
				snakes[i-1].src = "img/turn2.PNG";
			else if(dx[i-1] == 25 && dy[i] == 25)
				snakes[i-1].src = "img/turn4.PNG";
			else if(dx[i-1] == -25 && dy[i] == 25)
				snakes[i-1].src = "img/turn1.PNG";
			else if(dx[i-1] == -25 && dy[i] == -25)
				snakes[i-1].src = "img/turn3.PNG";
		}
	}

	if(dx[snakes.length-1] == 25)
		snakes[snakes.length-1].src = "img/tailx+.PNG";
	else if(dx[snakes.length-1] == -25)
		snakes[snakes.length-1].src = "img/tailx-.PNG";
	else if(dy[snakes.length-1] == 25)
		snakes[snakes.length-1].src = "img/taily+.PNG";
	else if(dy[snakes.length-1] == -25)
		snakes[snakes.length-1].src = "img/taily-.PNG";
	
	if(checkWall() == false) {
		if( x[0] == 500 )
			x[0] = 0;
		if(x[0] == -25 )
			x[0] = 475;
		if( y[0] == 500)
			y[0] = 0;
		if(y[0] == -25 )
			y[0] = 475;
	} else {
		if( x[0] == 500 || x[0] == -25 ||  y[0] == 500 || y[0] == -25 ) {
			rank();
			//gameOver();
			setTimeout("start()",1000);
		}
	}

	checkEat();
	createFood();
}

function addPoints() {
	var textbox = document.getElementById('pontos');
	textbox.value = points;
	if(bonuson == false) {
		if(points == bonuspoint) {
			bonuson = true;
			bonusactivated = true;
			createBonus();
			setInterval(delBonus, 5000);
		}
	}
}

function Pause() {
	if(pause == true) {
		pause = false;
		document.getElementById("pausar").value="Pausar";
	} else if(pause == false) {
		pause = true;
		document.getElementById("pausar").value="Despausar";
	}
}

function Reset() {
	if(crash == false) {
		rank();
		gameOver();
		setTimeout("start()",1000);
	}
}
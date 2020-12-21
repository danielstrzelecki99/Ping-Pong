const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");
const cw = canvas.width = 800;
const ch = canvas.height = 900;

const ballSize = 16;
const paddlewidth = 100;
const paddleheight = 10;

let ballX = cw/2 - ballSize/2;
let ballY = ch/2 - ballSize/2;
let ballSpeedX = 3;
let ballSpeedY = 4;
let paddleX = cw/2 - paddlewidth/2;
let paddle2X = cw/2 - paddlewidth/2;
let pkt = 0;
let pkt2 = 0;

let a = false;
let d = false;
let j = false;
let l = false;
let kierunek = 1;
let pauzaa = false;
let start = true;

function rysujmape(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,cw,ch);
	ctx.fillStyle = "gray";
	for(let i = 0; i < cw; i+=30){
		ctx.fillRect(i,ch/2-3,20,6);
	}
	ctx.font = "italic bold 50px Arial";
	ctx.fillText(pkt, 30, 50);
	ctx.fillText(pkt2, 30, ch-30);
}

function rysujpilke(){
	ctx.fillStyle = "white";
	ctx.fillRect(ballX,ballY,ballSize,ballSize);
	ballX+=ballSpeedX;
	ballY+=ballSpeedY;
	//odbicie piłki od bocznych krawędzi
	if(ballX < 0 || ballX + ballSize > cw){
		ballSpeedX = -ballSpeedX;
	}
	//zdobycie punktu przez drugiego gracza
	if(ballY < 0 - ballSize){
		pkt2++;
		//przekazanie do funkcji informacji który gracz przegrał aby mógł zaczynać
		nowaRunda(-1);
	}
	//zdobycie punktu przez pierwszego gracza
	if(ballY > ch){
		pkt++;
		//przekazanie do funkcji informacji który gracz przegrał aby mógł zaczynać
		nowaRunda(1);
	}
	//odbicie od paletki pierwszego gracza
	if(ballX >= paddleX - ballSize && ballX <= paddleX+paddlewidth && ballY <= 30+paddleheight && ballY >= 30){
		ballSpeedY = -ballSpeedY;
		speedup();
	}
	//odbicie od paletki drugiego gracza
	if(ballX >= paddle2X - ballSize && ballX <= paddle2X+paddlewidth && ballY + ballSize >= ch-30-paddleheight && ballY + ballSize <= ch-30){
		ballSpeedY = -ballSpeedY;
		speedup();
	}
}

function rysujpaletke(){
	ctx.fillStyle = "pink";
	ctx.fillRect(paddleX,30,paddlewidth,paddleheight);
	//aby paletka nie wychodziła poza mapę
	if(paddleX <= 0){
		paddleX = 0;
	}
	if(paddleX + paddlewidth >= cw){
		paddleX = cw - paddlewidth ;
	}
}

function rysujpaletke2(){
	ctx.fillStyle = "green";
	ctx.fillRect(paddle2X,ch - 30 - paddleheight,paddlewidth,paddleheight);
	//aby paletka nie wychodziła poza mapę
	if(paddle2X <= 0){
		paddle2X = 0;
	}
	if(paddle2X + paddlewidth >= cw){
		paddle2X = cw - paddlewidth ;
	}
}
//trzy kolejne funkcje odpowiadają za płynne poruszanie paletkami
function ruszajpaletke(){
	if (a == true) {
		paddleX-=10;
	}
	if (d == true) {
        paddleX+=10;
    }
	if(j == true){
		paddle2X-=10;
	}
	if(l == true){
		paddle2X+=10;
	}
}

function obslugaklawiszy(e){
	if (e.keyCode == 65) {
		a = true;
	}
	if (e.keyCode == 68) {
        d = true;
    }
	if(e.keyCode == 74){
		j = true;
	}
	if(e.keyCode == 76){
		l = true;
	}
	if(e.keyCode == 27){
		pauza();
	}
}

function obslugaklawiszystop(e){
	if (e.keyCode == 65) {
		a = false;
	}
	if (e.keyCode == 68) {
        d = false;
    }
	if(e.keyCode == 74){
		j = false;
	}
	if(e.keyCode == 76){
		l = false;
	}
}

function gra(){
	rysujmape();
	rysujpilke();
	rysujpaletke();
	rysujpaletke2();
	ruszajpaletke();
}

function speedup(){
	if(Math.abs(ballSpeedX) < 7){
		ballSpeedX*=1.1;
	}
	if(Math.abs(ballSpeedY) < 10){
		ballSpeedY*=1.1;
	}
}

function nowaRunda(gracz){
	kierunek = - kierunek;
	ballX = cw/2 - ballSize/2;
	ballY = ch/2 - ballSize/2;
	ballSpeedX = 3*kierunek;
	ballSpeedY = 4*gracz;
	paddleX = cw/2 - paddlewidth/2;
	paddle2X = cw/2 - paddlewidth/2;
}

function pauza(){
	if (pauzaa){
		gamerender = setInterval(gra, 1000/60);
		pauzaa = false;
		
	}
	else{
		clearInterval(gamerender);
		pauzaa = true;
	}
}

/*function start(){
	if(start){
		//uruchamianie funkcji rysujących 60 razy na sekunde
		let gamerender = setInterval(gra,1000/60);
		start = false;
	}
}*/

let gamerender = setInterval(gra,1000/60);

//obsługa klawiszy
document.addEventListener("keydown", obslugaklawiszy);
document.addEventListener("keyup", obslugaklawiszystop);
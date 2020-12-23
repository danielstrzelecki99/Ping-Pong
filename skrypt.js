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
let pauzaa = true;
let gamerender;
let nowagra = false;
let trybgry = 0;

let ping = new Audio("audio/ping.mp3");
let pong = new Audio("audio/pong.mp3");
let koniec_snd = new Audio("audio/koniec.mp3");
let punkt_snd = new Audio("audio/punkt.mp3");

//wyrenderowanie pierwszej klatki i pokazanie instrukcji
nowagraNapis();
//cztery kolejne funkcje odpowiadają za wyświetlanie wszystkich elementów na ekranie
function rysujmape(){
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,cw,ch);
	ctx.fillStyle = "white";
	ctx.fillRect(cw/2 - 1, 0 , 2, ch);
	for(let i = 0; i < cw; i+=30){
		ctx.fillRect(i,ch/2-3,20,6);
	}
	ctx.font = "italic bold 50px Arial";
	ctx.fillText(pkt, 30, 50);
	ctx.fillText(pkt2, 30, ch-30);
}

function ruchpilki(){
	ballX+=ballSpeedX;
	ballY+=ballSpeedY;
}

function rysujpilke(){
	ctx.fillStyle = "white";
	ctx.fillRect(ballX,ballY,ballSize,ballSize);
	if(pkt == 10 || pkt2 == 10){
		koniecGry();
	}
	//odbicie piłki od bocznych krawędzi
	if(ballX < 0 || ballX + ballSize > cw){
		ballSpeedX = -ballSpeedX;
	}
	//zdobycie punktu przez drugiego gracza
	if(ballY < 0 - ballSize){
		pkt2++;
		punkt_snd.play();
		//przekazanie do funkcji informacji który gracz przegrał aby mógł zaczynać
		nowaRunda(-1);
		//ballSpeedY = -ballSpeedY;
	}
	//zdobycie punktu przez pierwszego gracza
	if(ballY > ch){
		pkt++;
		punkt_snd.play();
		//przekazanie do funkcji informacji który gracz przegrał aby mógł zaczynać
		nowaRunda(1);
		//ballSpeedY = -ballSpeedY;
	}
	//odbicie od paletki pierwszego gracza
	if(ballX >= paddleX - ballSize && ballX <= paddleX+paddlewidth && ballY <= 30+paddleheight && ballY >= 30){
		ballSpeedY = -ballSpeedY;
		speedup();
		ping.play();
	}
	//odbicie od paletki drugiego gracza
	if(ballX >= paddle2X - ballSize && ballX <= paddle2X+paddlewidth && ballY + ballSize >= ch-30-paddleheight && ballY + ballSize <= ch-30){
		ballSpeedY = -ballSpeedY;
		speedup();
		pong.play();
	}
}

function rysujpaletke(){
	ctx.fillStyle = "red";
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
	ctx.fillStyle = "black";
	ctx.fillRect(paddle2X,ch - 30 - paddleheight,paddlewidth,paddleheight);
	//aby paletka nie wychodziła poza mapę
	if(paddle2X <= 0){
		paddle2X = 0;
	}
	if(paddle2X + paddlewidth >= cw){
		paddle2X = cw - paddlewidth ;
	}
}

function renderklatki(){
	rysujmape();
	rysujpilke();
	rysujpaletke();
	rysujpaletke2();
}
//trzy kolejne funkcje odpowiadają za płynne poruszanie paletkami
function ruszajpaletke(){
	if (a == true) {
		paddleX-=10;
	}
	if (d == true) {
        paddleX+=10;
    }
	if(j == true && trybgry == 2){
		paddle2X-=10;
	}
	if(l == true && trybgry == 2){
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
	if(e.keyCode == 32 && nowagra == true){
		nowaGra();
	}
	if(e.keyCode == 32 && nowagra == false){
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

function klik(e){
	const mouseX = e.clientX - can.offsetLeft;
	const mouseY = e.clientY - can.offsetTop;
	if(mouseX >= 56 && mouseX <= 356 && mouseY >= 506 && mouseY <= 606){
		console.log("1 gracz");
		trybgry = 1;
		document.removeEventListener("click", klik);
		startGryBot();
	}else if(mouseX >= cw/2 + 55 && mouseX <= cw/2 + 355 && mouseY >= 506 && mouseY <= 606){
		console.log("2 gracz");
		trybgry = 2;
		document.removeEventListener("click", klik);
		startGry()
	}

}

function gra(){
	rysujmape();
	rysujpilke();
	ruchpilki();
	rysujpaletke();
	rysujpaletke2();
	ruszajpaletke();
	if(trybgry == 1) aiPosition();
}

function aiPosition(){
	const middlepaddle = paddle2X + paddlewidth/2;
	if(ballY >= 450){
		if(ballX - middlepaddle <= -200){
			paddle2X -= 25;
		}else if(ballX - middlepaddle < -50){
			paddle2X -= 10;
		}else if(ballX - middlepaddle < -20){
			paddle2X -= 5;
		}else if(ballX - middlepaddle >= 200){
			paddle2X += 25;
		}else if(ballX - middlepaddle > 50){
			paddle2X += 10;
		}else if(ballX - middlepaddle > 20){
			paddle2X += 5;
		}
		
	}
	else{
		if(ballX - middlepaddle >= 100){
			paddle2X += 5;
		}else if(ballX - middlepaddle <= -100){
			paddle2X -= 5;
		}
	}
}
//przyspieszanie piłki po każdym odbiciu od paletki
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
	renderklatki();
	if(pkt < 10 && pkt2 < 10){	
		pauzaNapis();
		pauza();
	}
}

function pauza(){
	if (pauzaa){
		gamerender = setInterval(gra, 1000/60);
		pauzaa = false;
		
	}
	else{
		clearInterval(gamerender);
		pauzaa = true;
		if(trybgry != 0)pauzaNapis();
	}
}

function koniecGry(){
	clearInterval(gamerender);
	ctx.fillText("KONIEC GRY", 240, 210);
	if(pkt == 10 && trybgry == 1){
		ctx.fillText("Gratulacje, udało Ci się wygrać!!!", 160, 290);
		koniec_snd.play();
	}
	else if (pkt2 == 10 && trybgry == 1){
		ctx.font = "italic bold 40px Arial";
		ctx.fillText("Niestety przegrales, spróbuj jeszcze raz", 30, 290);
	}else if (pkt == 10 && trybgry == 2){
		ctx.fillText("Wygrywa gracz 1 !!!", 160, 290);
		koniec_snd.play();
	}else if (pkt2 == 10 && trybgry == 2){
		ctx.fillText("Wygrywa gracz 2 !!!", 160, 290);
		koniec_snd.play();
	}
	ctx.fillStyle = "#aaaaaa";
	ctx.font = "italic bold 40px Arial";
	ctx.fillText("Aby kontynuować, naciśnij SPACJĘ", 70, 550);
	nowagra = true;
}

function pauzaNapis(){
	ctx.fillStyle = "#aaaaaa";
	ctx.font = "italic bold 40px Arial";
	ctx.fillText("Aby rozpocząć grę, naciśnij SPACJĘ", 50, 400);
}

function nowagraNapis(){
	document.removeEventListener("keydown", obslugaklawiszy);
	document.removeEventListener("keyup", obslugaklawiszystop);
	document.addEventListener("click", klik);
	renderklatki();
	ctx.fillStyle = "white";
	ctx.font = "italic bold 100px Arial";
	ctx.fillText("PING - PONG", 90, 230);
	ctx.fillStyle = "#aaaaaa";
	ctx.font = "italic bold 40px Arial";
	ctx.fillText("Wybierz tryb gry:", 250, 400);
	ctx.strokeStyle = "#aaaaaa";
	ctx.strokeRect(50, 500, 300, 100);
	ctx.strokeRect(cw/2 + 50, 500, 300, 100);
	ctx.fillText("1 osoba", 115, 565);
	ctx.fillText("2 osoby", cw/2 + 115, 565);
}

function startGry(){
	document.addEventListener("keydown", obslugaklawiszy);
	document.addEventListener("keyup", obslugaklawiszystop);
	renderklatki();
	pauzaNapis();
	ctx.fillText("A <---            ---> D ", 229, 45);
	ctx.fillText("Gracz 1", 330, 85);
	ctx.fillStyle = "white";
	ctx.font = "italic bold 100px Arial";
	ctx.fillText("PING - PONG", 90, 230);
	ctx.fillStyle = "#aaaaaa";
	ctx.font = "italic bold 40px Arial";
	ctx.fillText("J <---            ---> L", 235, ch - 25);
	ctx.fillText("Gracz 2", 330, ch - 55);
}

function startGryBot(){
	document.addEventListener("keydown", obslugaklawiszy);
	document.addEventListener("keyup", obslugaklawiszystop);
	renderklatki();
	pauzaNapis();
	ctx.fillText("A <---            ---> D ", 229, 45);
	ctx.fillText("Gracz ", 340, 85);
	ctx.fillStyle = "white";
	ctx.font = "italic bold 100px Arial";
	ctx.fillText("PING - PONG", 90, 230);
	ctx.fillStyle = "#aaaaaa";
	ctx.font = "italic bold 40px Arial";
	ctx.fillText("Komputer", 320, ch - 55);
}

function nowaGra(){
	pkt = 0;
	pkt2 = 0;
	ballX = cw/2 - ballSize/2;
	ballY = ch/2 - ballSize/2;
	trybgry = 0;
	nowagra = false;
	nowagraNapis();
}

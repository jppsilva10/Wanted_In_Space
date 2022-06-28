"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ff0000";
	ctx.font = "50pt pixel";

	canvas.addEventListener("initend", initEndHandler);
	canvas.addEventListener("gameOver", gameOver);

	var spArray;
	var generator;
	ctx.pause = false;
	var repeat = false;

	var source;
	ctx.dif=0;
	ctx.volume=0.5;
	function messageHandler(ev){
		// retomar o foco dos eventos à janela do jogo
		if(ev.data=="continue"){
			ctx.pause= false;
			pause.style.height = 0;
			startAnim(ctx, spArray);
			repeat= true; 
			window.focus();
			tid = setInterval(update, 100);
		}
		else if (ev.data != null){
			// obter as armas e os sons
			source = ev.source;
			ctx.dif = ev.data[2];
			ctx.volume=ev.data[1];
			var weapons = new Array(4);
			for(let i = 3; i<ev.data.length;i++){
				weapons[i-3] = ev.data[i];
			}
			ctx.weapons = weapons;
			if(ctx.weapons[0]!=null)
				init(ctx, loadBar);
			if(ctx.dif!=0)
				canvas.addEventListener("win", win);
		}
	}
	window.addEventListener("message", messageHandler);

	// menu de pausa
	var pause = document.getElementsByTagName("iframe")[0]; 
	pause.contentWindow.postMessage('hello frame', '*');
	var loadBar = pause.contentWindow.document.getElementById("carregamento");
	var ptext = pause.contentWindow.document.getElementById("ptext");
	var Sbtn = pause.contentWindow.document.getElementsByTagName("button")[0];
	var Cbtn = pause.contentWindow.document.getElementsByTagName("button")[1];

	function buttonClickHandler(ev){
		var btn = ev.currentTarget;
		switch(btn){
			case Sbtn:
				if (ctx.dif == 0){
					var str = "§" + Math.trunc(ctx.time / 10);
					source.postMessage(str, '*');
				}
				source.postMessage('../html/MenuPrincipal.html', '*');
				break;
			case Cbtn:
				ctx.pause= false;
				pause.style.height = 0;
				startAnim(ctx, spArray);
				window.focus()
				tid = setInterval(update, 100);
				break;
		}
	}

	Sbtn.addEventListener("click", buttonClickHandler);
	Cbtn.addEventListener("click", buttonClickHandler);
	Sbtn.disabled=true;
	Cbtn.disabled=true;

	// cronometro
	ctx.time = 0;
	var tid;
	ctx.nInimigos = 30;
	ctx.totInimigos = 30;
	ctx.Count=0;
	function update(){
		ctx.time+=1;
		if(ctx.nInimigos>0) {
			generator.generate(ctx.time, ctx);
		}
		for(let i = 0; i<4; i++){
			spArray.sp.weapons[i].shoot(ctx.time);
		}
	}


	//controlar a movimentação da nave

	var Move;
	var Stop;
	function initEndHandler(ev)
	{
		spArray = ev.spArray;
		generator = ev.generator;
		var sp = spArray.sp;
		function move(ev){
			switch(ev.keyCode){
				case 87:
					sp.up=true;
					break;
				case 65:
					sp.left=true;
					break;
				case 83:
					sp.down=true;
					break;
				case 68:
					sp.right=true;
					break;
				case 37:
					sp.Rleft=true;
					break;
				case 39:
					sp.Rright=true;
					break;
				case 27: // menu de pausa
					if(ctx.pause){
						if(!repeat){
							ctx.pause= false;
							pause.style.height = 0;
							startAnim(ctx, spArray);
							tid = setInterval(update, 100);
							repeat= true; // evitar repetições por tecla precionada
						}
					} 
					else{
						if(!repeat){
							pause.style.height = "100%";
							clearInterval(tid);
							ctx.pause=true;
							repeat= true; // evitar repetições por tecla precionada
						}
					}
				break;
			}
		}
		Move=move;

		function stop(ev){
			switch(ev.keyCode){
				case 87:
					sp.up=false;
					break;
				case 65:
					sp.left=false;
					break;
				case 83:
					sp.down=false;
					break;
				case 68:
					sp.right=false;
					break;
				case 37:
					sp.Rleft=false;
					break;
				case 39:
					sp.Rright=false;
					break;
				case 27:
					repeat = false;
					break;
			}
		}
		Stop = stop;
		window.addEventListener("keydown", move);
		window.addEventListener("keyup", stop);

		pause.style.height = 0;
		loadBar.style.opacity=0;
		ptext.innerHTML="PAUSA";

		Sbtn.style.display= "inline-block";
		Cbtn.style.display= "inline-block";

		Sbtn.disabled=false;
		Cbtn.disabled=false;
		tid = setInterval(update, 100);
		//iniciar a animação
		startAnim(ctx, spArray);
	}

	function gameOver(ev) {
		if (ctx.dif == 0){
			var str = "§" + Math.trunc(ctx.time / 10);
			source.postMessage(str, '*');
		}
		ptext.innerHTML="FIM DE JOGO";
		Cbtn.style.display= "none";
		Sbtn.style.display= "block";
		Sbtn.style.marginLeft= "auto";
		Sbtn.style.marginRight= "auto";
		Sbtn.style.marginTop= "5%";
		pause.style.height = "100%";
		window.removeEventListener("keydown", Move);
		window.removeEventListener("keyup", Stop);
		clearInterval(tid);
	}
	function win(ev){
		var str;
		switch(ctx.dif){
			case 0.6:
				str = "´" + 1;
				break;
			case 0.9:
				str = "´" + 2;
				break;
			case 1.2:
				str = "´" + 3;
				break;
		}
		source.postMessage(str, '*');
		ptext.innerHTML="VENCESTE";
		Cbtn.style.display= "none";
		Sbtn.style.display= "block";
		Sbtn.style.marginLeft= "auto";
		Sbtn.style.marginRight= "auto";
		Sbtn.style.marginTop= "5%";
		pause.style.height = "100%";
		window.removeEventListener("keydown", Move);
		window.removeEventListener("keyup", Stop);
		clearInterval(tid);
	}

}


//init: carregamento de componentes
function init(ctx, loadBar)
{
	var nLoad = 0;
	var totLoad = 25;
	var spArray = new ArrayList();
	var generator= new Gerador(spArray, ctx.dif);
	generator.explosion = new Array(4);
	generator.images = new Array(5);

	//carregar imagens e criar sprites
	var img1 = new Image();

	img1.addEventListener("load", imgLoadedHandler);
	img1.border=0;
	img1.id="nave";
	img1.src = "../resources/nave.png";

	ctx.canvas.addEventListener("loadEnimies", loadEnimies);

	function loadEnimies(ev){

		var arma1 = new Image();
		arma1.addEventListener("load", imgLoadedHandler);
		arma1.id="arma";
		arma1.index=1;
		arma1.src = ctx.weapons[0];
		var arma2 = new Image();
		arma2.addEventListener("load", imgLoadedHandler);
		arma2.id="arma";
		arma2.index=2;
		arma2.src = ctx.weapons[1];
		var arma3 = new Image();
		arma3.addEventListener("load", imgLoadedHandler);
		arma3.id="arma";
		arma3.index=3;
		arma3.src = ctx.weapons[2];
		var arma4 = new Image();
		arma4.addEventListener("load", imgLoadedHandler);
		arma4.id="arma";
		arma4.index=4;
		arma4.src = ctx.weapons[3];
		ctx.weapons = null;

		var enimigo = new Image();
		enimigo.addEventListener("load", imgLoadedHandler);
		enimigo.id="inimigo";
		enimigo.index=0;
		enimigo.src = "../resources/inimigo0.png";

		var enimigo1 = new Image();
		enimigo1.addEventListener("load", imgLoadedHandler);
		enimigo1.id="inimigo";
		enimigo1.index=1;
		enimigo1.src = "../resources/inimigo1.png";

		var enimigo2 = new Image();
		enimigo2.addEventListener("load", imgLoadedHandler);
		enimigo2.id="inimigo";
		enimigo2.index=2;
		enimigo2.src = "../resources/inimigo2.png";

		var enimigo3 = new Image();
		enimigo3.addEventListener("load", imgLoadedHandler);
		enimigo3.id="inimigo";
		enimigo3.index=3;
		enimigo3.src = "../resources/inimigo3.png";

		var enimigo4 = new Image();
		enimigo4.addEventListener("load", imgLoadedHandler);
		enimigo4.id="inimigo";
		enimigo4.index=4;
		enimigo4.src = "../resources/inimigo4.png";

		var explosao = new Image();
		explosao.addEventListener("load", imgLoadedHandler);
		explosao.id="explosao";
		explosao.index=0;
		explosao.src = "../resources/explosao0.png";

		var explosao2 = new Image();
		explosao2.addEventListener("load", imgLoadedHandler);
		explosao2.id="explosao";
		explosao2.index=1;
		explosao2.src = "../resources/explosao1.png";

		var explosao3 = new Image();
		explosao3.addEventListener("load", imgLoadedHandler);
		explosao3.id="explosao";
		explosao3.index=2;
		explosao3.src = "../resources/explosao2.png";

		var explosao4 = new Image();
		explosao4.addEventListener("load", imgLoadedHandler);
		explosao4.id="explosao";
		explosao4.index=3;
		explosao4.src = "../resources/explosao3.png";

		var life = new Image();
		life.addEventListener("load", imgLoadedHandler);
		life.id="life";
		life.src = "../resources/life.png";

		var lifeBar = new Image();
		lifeBar.addEventListener("load", imgLoadedHandler);
		lifeBar.id="lifeBar";
		lifeBar.src = "../resources/lifeBar.png";

		var audio = new Audio();
		audio.addEventListener('canplaythrough', imgLoadedHandler);
		audio.src = "../resources/audio/explosao.mp3";
		audio.id = "explosion";
		audio.volume=ctx.volume;
	}

	function imgLoadedHandler(ev)
	{

		var img = ev.target;
		console.log(img.id);
		var canvas;
		var context;
		if(img.id!="audio" && img.id!="explosion") {
			img.border = 0;
			var nw = img.naturalWidth;
			var nh = img.naturalHeight;

			// criar ctx para o getImageData
			canvas = document.createElement('canvas');
			canvas.width = Math.round(nw / 4);
			canvas.height = Math.round(nh / 4);
			context = canvas.getContext("2d");
		}
		else
			img.removeEventListener('canplaythrough', imgLoadedHandler);
		switch(img.id) {
			case "nave":
				var sp = new Nave(img, Math.round(nw / 4), Math.round(nh / 4), Math.round(ctx.canvas.width / 2), Math.round(ctx.canvas.height / 2), 0, context, 100, 3);
				spArray.sp = sp;
				sp.listPointer = spArray;
				var ev = new Event("loadEnimies");
				ctx.canvas.dispatchEvent(ev);
				nLoad++;
				break;

			case "inimigo":

				generator.images[img.index] = img;
				nLoad++;
				break;

			case "arma":
				var sp
				var direction = img.index * Math.PI / 2;
				switch (img.src[img.src.length - 5]) {
					case "0":
						sp = new Arma(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "1":
						sp = new Arma1(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "2":
						sp = new Arma2(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "3":
						sp = new Arma3(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "4":
						sp = new Arma4(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "5":
						sp = new Arma5(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "6":
						sp = new Arma6(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
					case "7":
						sp = new Arma7(img, Math.round(nw / 4), Math.round(nh / 4), spArray.sp.width / 2 - Math.round(nw / 4) / 2, Math.round(nw / 4) / 2, direction);
						break;
				}
				spArray.sp.addWeapon(sp);

				var img2 = new Image();
				img2.addEventListener("load", imgLoadedHandler);
				img2.src = "../resources/tiro" + img.src[img.src.length - 5] + ".png";
				img2.id = "tiro";

				var audio= new Audio();
				audio.addEventListener('canplaythrough', imgLoadedHandler);
				audio.src = "../resources/audio/tiro" + img.src[img.src.length - 5] + ".mp3";
				audio.id = "audio";
				audio.volume=ctx.volume;
				nLoad++;
				break;
			case "life":
				var aux = spArray;

				while (aux != null) {
					aux.sp.setLifeImg(img, Math.round(nw / 2), Math.round(nh / 2));
					aux = aux.next;
				}
				generator.setLifeImg(img, Math.round(nw / 2), Math.round(nh / 2));
				nLoad++;
				break;
			case "lifeBar":
				var aux = spArray;

				while (aux != null) {
					aux.sp.setLifeBarImg(img);
					aux = aux.next;
				}
				generator.setLifeBarImg(img);
				nLoad++;
				break;
			case "tiro":
				var nave = spArray.sp;
				var i = 0;
				while (nave.weapons[i].img.src[nave.weapons[i].img.src.length - 5] != img.src[img.src.length - 5]) {
					i++;
				}
				nave.weapons[i].addBullet(img, Math.round(nw / 2), Math.round(nh / 2));

				nLoad++;
				break;
			case "audio":
				var nave = spArray.sp;
				var i = 0;
				while (nave.weapons[i].img.src[nave.weapons[i].img.src.length - 5] != img.src[img.src.length - 5]) {
					i++;
				}
				nave.weapons[i].audio=img;
				nLoad++;
				break;
			case "explosao":
				generator.explosion[img.index] = img;
				nLoad++;
				break;
			case "explosion":
				generator.audio=img;
				nLoad++;
				break;
		}
		loadBar.style.width= "" +  (Math.round((nLoad/totLoad)*70)%70) + "%";
		if (nLoad == totLoad)
		{
			spArray.sp.imageData = spArray.sp.getImageData();
			var ev = new Event("initend");
			ev.spArray = spArray;
			ev.generator = generator;
			ctx.canvas.dispatchEvent(ev);
		}
	}	
}


//iniciar animação
function startAnim(ctx, spArray)
{
	draw(ctx, spArray);
	animLoop(ctx, spArray, 0);	
}


//desenhar sprites
function draw(ctx, spArray)
{
	var aux = spArray;

	while(aux!=null)
	{
		aux.sp.draw(ctx);
		aux = aux.next;
	}
}

function animLoop(ctx, spArray, startTime, time)
{	
	var al = function(time)
	{
		if(startTime==0){
			startTime = time;
		}
		animLoop(ctx, spArray, startTime, time);
	}
	var reqID = window.requestAnimationFrame(al);
	render(ctx, spArray, reqID, time - startTime);
}


function render(ctx, spArray, reqID, dt)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//apagar canvas
	ctx.clearRect(0, 0, cw, ch);

	var aux = spArray;

	while(aux!=null)
	{
		aux.sp.rotate();
		aux.sp.move(cw, ch);
		var aux2= aux.next;
		while(aux2!=null){

			if(aux.sp.react(aux2.sp, ctx))
				aux2.sp.react(aux.sp, ctx)
			aux2 = aux2.next;

			if(aux.sp==null)
				break;
		}
		aux = aux.next;
	}
	draw(ctx, spArray);

	if(ctx.dif==0){
		//desenhar o cronometro
		var txt = "";
		if(Math.trunc(ctx.time/600)<10)
			txt += "0";
		txt += Math.trunc(ctx.time/600) + ":"
		if(Math.trunc(ctx.time/10)%60<10)
			txt += "0";
		txt += Math.trunc(ctx.time/10)%60;
		ctx.fillText(txt, 0.8*cw, 0+0.1*ch);

	}
	else{
		var txt = "";
		if(ctx.count<10)
			txt += "0";
		txt += ctx.Count;
		txt += "/";
		txt += ctx.totInimigos;
		ctx.fillText(txt, 0.8*cw, 0+0.1*ch);
	}
	if(ctx.pause)
		window.cancelAnimationFrame(reqID);

	if(spArray.sp.life<=0) {
		var ev = new Event("gameOver");
		ctx.canvas.dispatchEvent(ev);
		window.cancelAnimationFrame(reqID);
	}
	else if(ctx.Count==ctx.totInimigos){
		var ev = new Event("win");
		ctx.canvas.dispatchEvent(ev);
		window.cancelAnimationFrame(reqID);
	}
}

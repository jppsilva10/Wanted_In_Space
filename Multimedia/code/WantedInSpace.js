"use strict";

const totPages = 3;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	document.documentElement.requestFullscreen();
	var audio = document.getElementsByTagName("audio")[0];
	audio.play();
	var equip = document.getElementsByTagName("audio")[1];
	var remove = document.getElementsByTagName("audio")[2];
	var volume = 0.5;
	audio.volume = 0.5;
	equip.volume = 0.5;
	remove.volume = 0.5;
	var user = "";
	var score = 0;
	var dif = 0;
	var level = 0;

	var direction = 0;
	function messageHandler(ev){
		var str = ev.data;
		if(str == "sair")
			window.close();
		else if(str == "voltar"){
			nave.left = true;
			nave.down = true;
			nave.Rleft = true;
			nave.weapons = new Array(0);
			if (ctx.pause){
				ctx.pause = false;
				startAnim(ctx, nave);
			}
		}
		else if(str[0]=="£"){
			dif = str.substring(1, str.length)/1;
			console.log(dif);
		}
		else if(str[0]=="´"){
			var	value = str.substring(1, str.length)/1;
			if(value>level) {
				level = value;
				var str = "" + score + "/" + level;
				setCookie(user, str, 1);
			}
		}
		else if(str[0]=="#"){
			var	value = str.substring(2, str.length)/1;

			if(str[1]=="m"){
				audio.volume = value/100; 
			}
			else{
				volume = value/100;
				equip.volume = volume;
				remove.volume = volume;
			}
		}
		else if(str[0]=="$"){
			equip.currentTime = 0;
			equip.play();
			direction = addWeapon(nave, direction, str);
		}
		else if(str[0]=="&"){
			remove.currentTime = 0;
			remove.play();
			direction = removeWeapon(str[1], nave, direction);
		}
		else if(str[0]=="€"){
			user = str.substring(1, str.length)
			console.log(user);
			var value = userHandler(user);
			score = value.substring(0, value.indexOf("/"));
			console.log(value);
			console.log(score);
			score = Math.trunc(score/1);
			console.log(score);
			level = value.substring(value.indexOf("/")+1, value.length)/1;
			console.log(level);
		}
		else if(str[0]=="§"){
			var value =str.substring(1, str.length);
			value = Math.trunc(value/1);
			if(value>score){
				score = value;
				var str = "" + score + "/" + level;
				setCookie(user, str, 1);
			}
		}
		else
			showPage(ev.data, frm, nave, ctx);
	}
	window.addEventListener("message", messageHandler);

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.canvas.addEventListener("start", anim);
	ctx.pause = false;

	var nave;
	var img = new Image();
	img.addEventListener("load", imgLoadedHandler);
	img.src = "../resources/nave.png";

	var frm = document.getElementsByTagName("iframe")[0];
	function flh(ev){
		var info;
		if (frm.src.substring(frm.src.indexOf('/main'),frm.src.length) == '/main.html'){
			info = new Array(7);
			info[2] = dif;
			for(let i =3 ; i<info.length; i++) {
				info[i] = nave.weapons[i - 3].img.src;
			}
			ctx.pause = true;
		}
		else{
			info = new Array(3);
			info[2] = level;
		}
		info[0]= audio.volume;
		info[1]= volume;
		frm.contentWindow.postMessage(info, '*');
	}
	frm.addEventListener("load", flh);

	function imgLoadedHandler(ev)
	{
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		nave = new Nave(img, Math.round(nw/2), Math.round(nh/2), Math.round(ctx.canvas.width/2), Math.round(ctx.canvas.height/2), 0, null, 200, 1.5);
		nave.getImageData = function f(){
			return null;
		}
		nave.setLifeImg(img, 0, 0);
		nave.setLifeBarImg(img);
		nave.left = true;
		nave.down = true;
		nave.Rleft = true;
		nave.weapons = new Array(0);
		var ev4 = new Event("start");
		ctx.canvas.dispatchEvent(ev4);
	}

	function anim(ev){
		startAnim(ctx, nave);
	}
	
	var startPage = "../html/MenuInicial.html";
	showPage(startPage, frm, nave, ctx);
}

function startAnim(ctx, nave)
{
	nave.draw(ctx);
	animLoop(ctx, nave, 0);
}

function animLoop(ctx, nave, startTime, time)
{	
	var al = function(time)
	{
		if(startTime==0){
			startTime = time;
		}
		animLoop(ctx, nave, startTime, time);
	}
	var reqID = window.requestAnimationFrame(al);
	render(ctx, nave, reqID, time - startTime);
}

function render(ctx, nave, reqID, dt)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	ctx.clearRect(0, 0, cw, ch);
	if (nave.x + nave.width >= cw){
		nave.right=false;
		nave.left= true;
		if(nave.up){
			nave.Rleft=false;
			nave.Rright=true;
		}
		else{
			nave.Rleft=true;
			nave.Rright=false;
		}
	}
	if (nave.x <= 0){
		nave.right=true;
		nave.left= false;
		if(nave.up){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	if (nave.y + nave.height >= ch){
		nave.down=false;
		nave.up= true;
		if(nave.left){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	if (nave.y <= 0){
		nave.down=true;
		nave.up= false;
		if(nave.right){
			nave.Rleft=true;
			nave.Rright=false;
		}
		else{
			nave.Rleft=false;
			nave.Rright=true;
		}
	}
	nave.rotate();
	nave.move(cw, ch);
	nave.draw(ctx);
	if(ctx.pause)
		window.cancelAnimationFrame(reqID);
}

function showPage(page, frm, nave, ctx)
{
	frm.src = page;
	if (page == '../html/MenuCustomizacao.html'){
		nave.up=false;
		nave.left=false;
		nave.down=false;
		nave.right=false;
		nave.Rleft=false;
		nave.Rright=false;
		nave.direction=0;
		nave.x = ctx.canvas.width/2-nave.width/2;
		nave.y = ctx.canvas.height/2-nave.height/2;
	}
	else if(page == '../html/MenuPrincipal.html' && nave.up==false && nave.left==false && nave.down==false && nave.right==false && nave.Rleft==false && nave.Rright==false) {
		nave.left = true;
		nave.down = true;
		nave.Rleft = true;
		nave.weapons = new Array(0);
		if (ctx.pause){
			ctx.pause = false;
			startAnim(ctx, nave);
		}
	}
}

function addWeapon(nave, direction, str){
	var img1 = new Image();
	img1.addEventListener("load", ilh);
	img1.src = "../resources/arma" + str[1] + ".png";
	img1.id = "arma";

	function ilh(ev){
		var img = ev.target;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		if(img.id == "arma") {
			var aux = new Array(nave.weapons.length + 1);
			for (let i = 0; i < nave.weapons.length; i++) {
				aux[i] = nave.weapons[i];
			}
			nave.weapons = aux;
			var sp
			switch (str[1]) {
				case "0":
					sp = new Arma(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "1":
					sp = new Arma1(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "2":
					sp = new Arma2(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "3":
					sp = new Arma3(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "4":
					sp = new Arma4(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "5":
					sp = new Arma5(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "6":
					sp = new Arma6(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
				case "7":
					sp = new Arma7(img, Math.round(nw / 2), Math.round(nh / 2), nave.width / 2 - Math.round(nw / 2) / 2, Math.round(nw / 2) / 2, direction);
					break;
			}
			direction += Math.PI / 2;
			nave.addWeapon(sp);
		}
	}
	return direction;
}

function removeWeapon(n, nave, direction){
	var src = "../resources/arma" + n + ".png";
	direction = 0;
	var aux = new Array(nave.weapons.length-1);
	var j = 0;
	for(let i=0; i<nave.weapons.length; i++){
		if(nave.weapons[i].img.src[nave.weapons[i].img.src.length-5]!=n){
			nave.weapons[i].direction = direction;
			aux[j] = nave.weapons[i];
			direction += Math.PI/2;
			j++;
		} 
	}
	nave.weapons = aux;
	return direction;
}

function userHandler(user){
	var cookie = getCookie(user);
	if (cookie == "") {
		setCookie(user, "0/0", 1);
		return "0/0";
	}
	else
		console.log(cookie);
	return cookie;
}


//      https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}


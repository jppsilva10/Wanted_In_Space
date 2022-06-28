"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var source;
	function messageHandler(ev){
		if(ev.data=="hello frame"){
			source = ev.source;
    	}
	}
    window.addEventListener("message", messageHandler);

	function Focus(ev){
		if(ev.keyCode==27)
		source.postMessage('continue', '*');
	}
	window.addEventListener("keydown", Focus);

	var btns = document.getElementsByTagName("button");
	var audio = document.getElementById('hover'); //????????????????????????????

	function hoverHandler(ev){
		audio.currentTime = 0
		audio.play();
	}

	for(let i = 0; i<btns.length; i++){
		btns[i].addEventListener("mouseover", hoverHandler);
	}
}
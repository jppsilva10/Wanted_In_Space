"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
    var audio = document.getElementById('hover');

	var source;
	function messageHandler(ev){
		source = ev.source;
        audio.volume = ev.data[1];
	}
    window.addEventListener("message", messageHandler);
	var Cbtn = document.getElementById("criarConta");
    var Ibtn = document.getElementById("iniciarSessao");
    var Sbtn = document.getElementById("sair");
    var Obtn = document.getElementById("opcoes");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
    	if(btn==Cbtn)
    		source.postMessage('../html/CriarConta.html', '*');
    	else if(btn==Ibtn)
    		source.postMessage('../html/IniciarSessao.html', '*');
        else if(btn==Sbtn)
            source.postMessage('sair', '*');
        else if(btn==Obtn)
            source.postMessage('../html/Opcoes.html', '*');
    }
    Cbtn.addEventListener("click", buttonClickHandler);
    Ibtn.addEventListener("click", buttonClickHandler);
    Sbtn.addEventListener("click", buttonClickHandler);
    Obtn.addEventListener("click", buttonClickHandler);

    function hoverHandler(ev){
        audio.currentTime = 0;
        audio.play();
    }

    Cbtn.addEventListener("mouseover", hoverHandler);
    Ibtn.addEventListener("mouseover", hoverHandler);
    Sbtn.addEventListener("mouseover", hoverHandler);
    Obtn.addEventListener("mouseover", hoverHandler);
}
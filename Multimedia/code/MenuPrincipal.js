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

	var Cbtn = document.getElementById("campanha");
    var Sbtn = document.getElementById("sobrevivencia");
    var Rbtn = document.getElementById("ranking");
    var Obtn = document.getElementById("opcoes");
    var Abtn = document.getElementById("ajuda");
    var cbtn = document.getElementById("creditos");
    var Qbtn = document.getElementById("sair");
    var Bbtn = document.getElementById("voltar");
    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
        switch (btn){
    	case Cbtn:
    		source.postMessage('../html/Campanha.html', '*');
            break;
        case Sbtn:
            source.postMessage('£0', '*');
            source.postMessage('../html/MenuCustomizacao.html', '*');
            break;
        case Rbtn:
            source.postMessage('../html/Ranking.html', '*');
            break;
        case Obtn:
            source.postMessage('../html/Opcoes.html', '*');
            break;
        case Abtn:
            source.postMessage('../html/Ajuda.html', '*');
            break;
        case cbtn:
            source.postMessage('../html/Creditos.html', '*');
            break;
        case Bbtn:
            source.postMessage('../html/MenuInicial.html', '*');
            break;
        case Qbtn:
            source.postMessage('sair', '*');
            break;
        }
    }
    Cbtn.addEventListener("click", buttonClickHandler);
    Sbtn.addEventListener("click", buttonClickHandler);
    Rbtn.addEventListener("click", buttonClickHandler);
    Obtn.addEventListener("click", buttonClickHandler);
    Abtn.addEventListener("click", buttonClickHandler);
    cbtn.addEventListener("click", buttonClickHandler);
    Qbtn.addEventListener("click", buttonClickHandler);
    Bbtn.addEventListener("click", buttonClickHandler);

    function hoverHandler(ev){
        audio.currentTime = 0;
        audio.play();
    }

    Cbtn.addEventListener("mouseover", hoverHandler);
    Sbtn.addEventListener("mouseover", hoverHandler);
    Rbtn.addEventListener("mouseover", hoverHandler);
    Obtn.addEventListener("mouseover", hoverHandler);
    Abtn.addEventListener("mouseover", hoverHandler);
    cbtn.addEventListener("click", buttonClickHandler);
    Qbtn.addEventListener("mouseover", hoverHandler);
    Bbtn.addEventListener("mouseover", hoverHandler);
}
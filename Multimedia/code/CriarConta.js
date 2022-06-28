"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var audio = document.getElementById('hover');
    //document.cookie = "=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //document.cookie = "jp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	var source;
	function messageHandler(ev){
		source = ev.source;
        audio.volume = ev.data[1];  
	}

    window.addEventListener("message", messageHandler);
	var Bbtn = document.getElementById("voltar");
    function buttonClickHandler(ev){

    	source.postMessage('../html/MenuInicial.html', '*');
    }
    Bbtn.addEventListener("click", buttonClickHandler);

    var Cbtn = document.getElementById("criarConta");
    var input = document.getElementById("fname");
    var text = document.getElementById("erro");

    function criarConta(ev){
        var user = input.value;
        if(user == ""){
            text.innerHTML="Introduza um nome para a conta!";
            return;
        }
        var c = getCookie(user);
        if(c!=""){
            text.innerHTML="Já existe uma conta com esse nome!";
            return;
        }

        var str = "€" + user;
        source.postMessage(str, '*');
        source.postMessage('../html/MenuPrincipal.html', '*');
    }
    Cbtn.addEventListener("click",criarConta);
    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
    }
    Bbtn.addEventListener("mouseover", hoverHandler);
    Cbtn.addEventListener("mouseover", hoverHandler);
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
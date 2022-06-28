"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
    var audio = document.getElementById('hover');
    var text = document.getElementById("text");

	var source;
	function messageHandler(ev){
		source = ev.source;
        audio.volume = ev.data[1];  
	}
    window.addEventListener("message", messageHandler);

	var n_weapons =0;
	var btns = document.getElementsByTagName("button");
    var Bbtn = document.getElementById("voltar");
    var Pbtn = document.getElementById("jogar");

    function buttonClickHandler(ev){
    	var btn = ev.currentTarget;
        switch (btn){
    	    case btns[0]:
                if (btn.childNodes[1].style.opacity == 1){
    		        source.postMessage('$0', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&0', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[1]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$1', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&1', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[2]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$2', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&2', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[3]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$3', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&3', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[4]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$4', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&4', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[5]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$5', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&5', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[6]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$6', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&6', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case btns[7]:
                if (btn.childNodes[1].style.opacity == 1){
                    source.postMessage('$7', '*');
                    btn.childNodes[1].style.opacity = 0.3;
                    n_weapons++;
                }
                else{
                    source.postMessage('&7', '*');
                    btn.childNodes[1].style.opacity = 1;
                    n_weapons--;
                }
                break;
            case Bbtn:
                source.postMessage('voltar', '*');
                window.history.back();
                break;
            case Pbtn:
                source.postMessage('../html/main.html', '*');
                break;
        }
        if(n_weapons<4) {
            if(Pbtn.disabled==false) {
                Pbtn.disabled = true;
                Pbtn.style.opacity = 0.3;
                Pbtn.style.cursor = "initial";
                Pbtn.style.pointerEvents = "none";
                for (let i = 0; i < 8; i++) {
                    btns[i].disabled = false;
                    btns[i].style.cursor = "pointer";
                    btns[i].style.pointerEvents = "auto";
                }
            }
        }
        else{
            Pbtn.disabled = false;
            Pbtn.style.opacity=1;
            Pbtn.style.cursor= "pointer";
            Pbtn.style.pointerEvents = "auto";
            for(let i = 0; i<8; i++){
                if(btns[i].childNodes[1].style.opacity == 1) {
                    btns[i].disabled = true;
                    btns[i].style.cursor= "initial";
                    btns[i].style.pointerEvents = "none";
                }
            }
        }
    }

    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
        if(ev.currentTarget!=Bbtn && ev.currentTarget!=Pbtn) {
            var str;

            switch(ev.currentTarget.childNodes[1].src[ev.currentTarget.childNodes[1].src.length - 5]){
                case "0":
                    str = "Dano: 20<br>Tempo de recarga: 1<br>Alcance: 500<br>Velocidade do projetil: 7<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
                case "1":
                    str = "Dano: 10<br> Tempo de recarga: 0.2<br>Alcance: 250<br>Velocidade do projetil: 8<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
                case "2":
                    str = "Dano: 80<br> Tempo de recarga: 2<br>Alcance: 240<br>Velocidade do projetil: 6<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
                case "3":
                    str = "Dano: 1000<br> Tempo de recarga: 2.7<br>Alcance: 900<br>Velocidade do projetil: 9<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
                case "4":
                    str = "Dano: 45<br> Tempo de recarga: 2<br>Alcance: 500<br>Velocidade do projetil: 6<br>Numero de projeteis: 3";
                    text.innerHTML= str;
                    break;
                case "5":
                    str = "Dano: 60<br> Tempo de recarga: 1.5<br>Alcance: 120<br>Velocidade do projetil: 6.5<br>Numero de projeteis: 5";
                    text.innerHTML= str;
                    break;
                case "6":
                    str = "Dano: 40<br> Tempo de recarga: 1.7<br>Alcance: 620<br>Velocidade do projetil: 1.8<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
                case "7":
                    str = "Dano: 85<br> Tempo de recarga: 2<br>Alcance: 900<br>Velocidade do projetil: 4.5<br>Numero de projeteis: 1";
                    text.innerHTML= str;
                    break;
            }
        }
    }

    for(let i = 0; i<8; i++){
        btns[i].addEventListener("click", buttonClickHandler);
        btns[i].childNodes[1].style.opacity=1;
        btns[i].addEventListener("mouseover", hoverHandler);
    }

    Bbtn.addEventListener("click", buttonClickHandler);
    Bbtn.addEventListener("mouseover", hoverHandler);
    Pbtn.addEventListener("click", buttonClickHandler);
    Pbtn.addEventListener("mouseover", hoverHandler);
    Pbtn.disabled = true;
    Pbtn.style.pointerEvents = "none";
    Pbtn.style.opacity=0.3;
    Pbtn.style.cursor= "initial";

}
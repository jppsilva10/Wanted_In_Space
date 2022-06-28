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
    var level=0;
    function messageHandler(ev){
        source = ev.source;
        audio.volume = ev.data[1];
        level = ev.data[2];
        console.log(ev.data);
        console.log(level);
        for(let i = 0; i<btns.length-1; i++){
            btns[i].addEventListener("click", buttonClickHandler);
            btns[i].addEventListener("mouseover", hoverHandler);
            if(i>level){
                btns[i].style.opacity=0.3;
                btns[i].style.cursor= "initial";
                btns[i].disabled = true;
                btns[i].style.pointerEvents = "none";
            }
        }
    }
    window.addEventListener("message", messageHandler);

    var n_weapons =0;
    var btns = document.getElementsByTagName("button");
    var Bbtn = document.getElementById("voltar");

    function buttonClickHandler(ev){
        var btn = ev.currentTarget;
        switch (btn){
            case btns[0]:
                    source.postMessage('£0.6', '*');
                    source.postMessage('../html/MenuCustomizacao.html', '*');
                break;
            case btns[1]:
                    source.postMessage('£0.9', '*');
                    source.postMessage('../html/MenuCustomizacao.html', '*');
                break;
            case btns[2]:
                    source.postMessage('£1.2', '*');
                    source.postMessage('../html/MenuCustomizacao.html', '*');
                break;

            case Bbtn:
                window.history.back();
                break;
        }
    }

    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
    }

    Bbtn.addEventListener("click", buttonClickHandler);
    Bbtn.addEventListener("mouseover", hoverHandler);
}
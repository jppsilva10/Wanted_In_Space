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
    var Bbtn = document.getElementById("voltar");
    function buttonClickHandler(ev){

        source.postMessage('../html/MenuPrincipal.html', '*');
    }
    Bbtn.addEventListener("click", buttonClickHandler);

    function hoverHandler(ev){
        audio.currentTime = 0
        audio.play();
    }
    Bbtn.addEventListener("mouseover", hoverHandler);

    var r = new RankingList();
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        var entrie = new RankingList;
        entrie.user = c.substring(0, c.indexOf("="))
        entrie.score = c.substring(c.indexOf("=")+1, c.indexOf("/"));
        if(Math.trunc(entrie.score/1)>0)
            r.add(entrie);
    }
    var list = document.getElementById("list");
    r = r.next;
    var str = "";

    for(let i=0; i<10 && r!=null;i++) {
        str += (i+1)+". ";
        str += r.user + "  ";
        if(Math.trunc(r.score/60)<10)
            str += "0";
        str += Math.trunc(r.score/60) + ":"
        if(r.score%60<10)
            str += "0";
        str += r.score%60;
        str += "<br>";
        r = r.next;
    }
    list.innerHTML=str;
}
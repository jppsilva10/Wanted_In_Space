"use strict";

(function()
{
    window.addEventListener("load", main);
}());


function main()
{

    var btn = document.getElementById("jogar");
    function init(ev){
        var sWidth = window.screen.availWidth;
        var wWidth = 1920;
        var wHeight = 1080;
        var wLeft = (sWidth - wWidth)/2;	//center window on the screen
        var myWindow = window.open("html/WantedInSpace.html", "mainWindow", "width = " + wWidth + ", height = " + wHeight);

    }
    btn.addEventListener("click", init);
}
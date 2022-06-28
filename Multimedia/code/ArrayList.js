"use strict";

class ArrayList{
        
    constructor(){
        this.sp=null;
        this.next=null;
        this.ant=null;
    }
    add(sp){
        var aux = new ArrayList();
        aux.next = this.next;
        if(this.next!=null)
        	this.next.ant=aux;
        this.next = aux;
        aux.ant = this; 
        aux.sp = sp;
        sp.listPointer = aux;
    }
}

class RankingList{
    constructor(){
        this.user="";
        this.score= 0;
        this.next=null;
    }
    add(entrie){
        var aux = this;
        while(aux.next != null){
            if(aux.next.score < entrie.score)
                break;
            aux = aux.next;
        }
        entrie.next = aux.next;
        aux.next = entrie;
    }
}
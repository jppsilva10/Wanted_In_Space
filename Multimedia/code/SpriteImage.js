"use strict";

class SpriteImage
{
	constructor(img, w, h, x, y, direction, ctx){
		this.img = img;
		this.width = w;
		this.height = h;
		this.x = x;
		this.xc = this.x + Math.round(this.width / 2);
		this.y = y;
		this.yc = y + Math.round(this.height / 2);
		this.direction = direction;
		this.ctx = ctx;
		this.impact = -1;
		this.impactDirection=0;
		this.listPointer=null;
	}

	setLifeImg(img, Lw, Lh){
	}
	setLifeBarImg(img){
	}
	move(cw, ch){
	}
	rotate(){
	}
	react(){
	}
	draw(ctx){
		ctx.save();
		if(this.impact>0){
			ctx.globalAlpha = (121-3*this.impact/4)/121;
		}
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
	}

	getImageData(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.save();
		this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(this.direction);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.ctx.restore();
		return this.ctx.getImageData(0, 0, this.width, this.height);
	}

	static intersectsBoundingBox(sp1, sp2){
		if(sp1.x > sp2.x+ sp2.width || sp2.x > sp1.x+ sp1.width)
			return false;
		if(sp1.y > sp2.y+ sp2.height || sp2.y > sp1.y+ sp1.height)
			return false;
		return true;
	}

	intersectsPixelCheck(sp2){
		if(SpriteImage.intersectsBoundingBox(this, sp2)){
			var xMin = Math.max(this.x, sp2.x);
			var xMax = Math.min(this.x + this.width, sp2.x + sp2.width);
			var yMin = Math.max(this.y, sp2.y);
			var yMax = Math.min(this.y + this.height, sp2.y + sp2.height);

			for(let x = xMin; x <= xMax; x++){
				for(let y = yMin; y <= yMax; y++){
					// sprite 1
					var xLocal = Math.round(x - this.x);
					var yLocal = Math.round(y - this.y);
					var pixelIndex1 = yLocal * this.width + xLocal;
					pixelIndex1 = pixelIndex1 * 4 + 3;
					// sprite 2
					xLocal = Math.round(x - sp2.x);
					yLocal = Math.round(y - sp2.y);
					var pixelIndex2 = yLocal * sp2.width + xLocal;
					pixelIndex2 = pixelIndex2 * 4 + 3;

					if(this.imageData.data[pixelIndex1] && sp2.imageData.data[pixelIndex2]){
						return true;
					}
				}
			}
			return false;
		}
		else{
			return false;
		}
	}

	remove(){
		var ptr = this.listPointer;
		if(ptr.ant!=null)
			ptr.ant.next = ptr.next;
		if(ptr.next!=null)
			ptr.next.ant = ptr.ant;
	}
}





class Entidade extends SpriteImage
{
	constructor(img, w, h, x, y, direction, ctx, life, speed){
		super(img, w, h, x, y, direction, ctx);
		this.life = life;
		this.InitLife = life;
		this.speed = speed;
		this.lifeImg = null;
		this.lifeBarImg = null;
		this.Lw = 0;
		this.Lh = 0;
	}

	setLifeImg(img, Lw, Lh){
		this.lifeImg = img;
		this.Lw = Lw;
		this.Lh = Lh;
	}

	setLifeBarImg(img){
		this.lifeBarImg = img;
	}

	drawlife(ctx){
		var x = this.x + (this.width-this.Lw)/2;
		var y = this.y + this.height;
		ctx.drawImage(this.lifeBarImg, x, y, this.Lw, this.Lh);
		ctx.drawImage(this.lifeImg, x, y, this.Lw * this.life / this.InitLife, this.Lh);
	}

	impactMove(cw, ch){
		if(this.impact>0){
			var change1 = false;
			var change2 = false
			this.impact-= 5;
			this.x += (Math.cos(this.impactDirection) * (this.impact/10));
			if (cw < this.x + this.width){
				this.x = cw - this.width;
				change1 = true;
			}
			if (0 > this.x){
				this.x = 0;
				 change1 = true;
			}
			this.y += (Math.sin(this.impactDirection) * (this.impact/10));
			if (ch < this.y + this.height){
				this.y = ch - this.height;
				change2 = true;
			}
			if (0 > this.y){
				this.y = 0;
				change2 = true;
			}
			if(change1 && change2)
				this.impact =0;
		}
	}

}

class Nave extends Entidade
{
	constructor(img, w, h, x, y, direction, ctx, life, speed){
		super(img, w, h, x, y, direction, ctx, life, speed);
		this.up= false;
		this.down= false;
		this.left= false;
		this.right= false;
		this.Rleft= false;
		this.Rright= false;
		this.weapons =new Array(4);
	}

	move(cw, ch){

		if(this.right && !this.left){
			if (this.x + this.width < cw)
			{
				if (this.x + this.width + this.speed > cw)
					this.x = cw - this.width;
				else
					this.x += this.speed;		
			}
		}
		if(this.left && !this.right){
			if (this.x > 0)
			{
				if (this.x - this.speed < 0)
					this.x = 0;
				else
					this.x -= this.speed;		
			}
		}
		if(this.up && !this.down){
			if (this.y > 0)
			{
				if (this.y - this.speed < 0)
					this.y = 0;
				else
					this.y -= this.speed;		
			}
		}
		if(this.down && !this.up){
			if (this.y + this.height < ch)
			{
				if (this.y + this.height + this.speed > ch)
					this.y = ch - this.height;
				else	
					this.y += this.speed;		
			}
		}
		
		this.impactMove(cw, ch);

		this.xc=this.x + Math.round(this.width / 2);
		this.yc=this.y + Math.round(this.height / 2);
	}

	rotate(){
		var change = false;
		if(this.Rright && !this.Rleft){
			this.direction += this.speed*Math.PI/180;
			change = true;
		}
		if(this.Rleft && !this.Rright){
			this.direction -= this.speed*Math.PI/180;
			change = true;
		}
		if(change){
			this.imageData = this.getImageData();
		}
	}

	react(objeto){
		return true;
	}

	addWeapon(weapon){
		for(let i=0; i<this.weapons.length; i++){
			if(this.weapons[i]==null){
				this.weapons[i]= weapon;
				break;
			}
		}
		weapon.nave=this;
	}
	draw(ctx){	
		ctx.save();
		if(this.impact>0){
			ctx.globalAlpha = (121-3*this.impact/4)/121;
		}
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        for(let i=0; i<this.weapons.length; i++){
        	ctx.translate(this.width / 2, this.height / 2);
        	ctx.rotate(Math.PI*90/180);
        	ctx.translate(-this.width / 2, -this.height / 2);
        	ctx.drawImage(this.weapons[i].img, this.width/2 - this.weapons[i].width/2, 0, this.weapons[i].width, this.weapons[i].height);
        }
        ctx.restore();
        this.drawlife(ctx);
	}
	getImageData(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.save();
		this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(this.direction);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        for(let i=0; i<this.weapons.length; i++){
        	this.ctx.translate(this.width / 2,this.height / 2);
        	this.ctx.rotate(this.weapons[i].direction-this.direction);
        	this.ctx.translate(-this.width / 2, -this.height / 2);
        	this.ctx.drawImage(this.weapons[i].img, this.width/2-this.weapons[i].width/2, 0, this.weapons[i].width, this.weapons[i].height);
        }
        this.ctx.restore();
		return this.ctx.getImageData(0, 0, this.width, this.height);
	}
}





class Arma extends SpriteImage
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction, null);
		this.damage = 20;
		this.speed = 7;
		this.distance = 500;
		this.nave=null;
		this.timer = 1;
	}
	draw(ctx){
	}
	getImageData(){
		return null;
	}
	shoot(time){
		if(time%(10*this.timer)==0){
			this.audio.currentTime = 0;
			this.audio.play();
			var x = this.nave.xc-this.Bw/2 + (this.nave.height-50)*Math.cos(this.nave.direction+this.direction - Math.PI / 2);
			var y = this.nave.yc-this.Bh/2 + (this.nave.height-50)*Math.sin(this.nave.direction+this.direction - Math.PI / 2);
			var direction = this.nave.direction + this.direction -  Math.PI / 2;
			var bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
		}
	}
	addBullet(Img, w, h){
		this.Bimg = Img;
		this.Bw = w;
		this.Bh = h;
	}
}

class Arma1 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 10;
		this.speed = 8;
		this.distance = 250;
		this.nave=null;
		this.timer = 0.2;
	}
}

class Arma2 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 80;
		this.speed = 6;
		this.distance = 240;
		this.nave=null;
		this.timer = 2;
	}
}

class Arma3 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 1000;
		this.speed = 9;
		this.distance = 900;
		this.nave=null;
		this.timer = 2.7;
	}
}

class Arma4 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 45;
		this.speed = 6;
		this.distance = 500;
		this.nave=null;
		this.timer = 2;
	}
	shoot(time){
		if(time%(10*this.timer)==0) {
			this.audio.currentTime = 0;
			this.audio.play();
		}
		if(time%(10*this.timer)==0 || time%(10*this.timer)==2 || time%(10*this.timer)==4){
			var x = this.nave.xc-this.Bw/2 + (this.nave.height-50)*Math.cos(this.nave.direction+this.direction - Math.PI / 2);
			var y = this.nave.yc-this.Bh/2 + (this.nave.height-50)*Math.sin(this.nave.direction+this.direction - Math.PI / 2);
			var direction = this.nave.direction + this.direction -  Math.PI / 2;
			var bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
		}
	}
}

class Arma5 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 60;
		this.speed = 6.5;
		this.distance = 120;
		this.nave=null;
		this.timer = 1.5;
	}
	shoot(time){
		if(time%(10*this.timer)==0){
			this.audio.currentTime = 0;
			this.audio.play();
			var x = this.nave.xc-this.Bw/2 + (this.nave.height-50)*Math.cos(this.nave.direction+this.direction - Math.PI / 2);
			var y = this.nave.yc + (this.nave.height-50)*Math.sin(this.nave.direction+this.direction - Math.PI / 2);
			var direction = this.nave.direction + this.direction -  Math.PI / 2;
			var bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
			direction = this.nave.direction + this.direction -  Math.PI / 2 - Math.PI / 10;
			bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
			direction = this.nave.direction + this.direction -  Math.PI / 2 - Math.PI / 5;
			bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
			direction = this.nave.direction + this.direction -  Math.PI / 2 + Math.PI / 10;
			bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
			direction = this.nave.direction + this.direction -  Math.PI / 2 + Math.PI / 5;
			bullet = new Bullet(this.Bimg , this.Bw, this.Bh, x, y, direction, this);
			this.nave.listPointer.add(bullet);
		}
	}
}

class Arma6 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 40;
		this.speed = 1.8;
		this.distance = 620;
		this.nave=null;
		this.timer = 1.7;
	}
}

class Arma7 extends Arma
{
	constructor(img, w, h, x, y, direction){
		super(img, w, h, x, y, direction);
		this.damage = 85;
		this.speed = 4.5;
		this.distance = 900;
		this.nave=null;
		this.timer = 2.3;
	}
}

class Bullet extends SpriteImage
{
	constructor(img, w, h, x, y, direction, weapon){
		super(img, w, h, x, y, direction, null)
		this.weapon = weapon;
		this.damage = weapon.damage;
		this.speed = weapon.speed;
		this.distance = weapon.distance;
		this.imageData = this.getImageData();
	}

	move(cw, ch){
		this.x = this.x + (Math.cos(this.direction) * this.speed);
		this.y = this.y + (Math.sin(this.direction) * this.speed);
		this.distance-=this.speed;
		if(this.distance<0){
			this.remove();
		}
	}

	getImageData(){
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");

		ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.direction);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
		return ctx.getImageData(0, 0, this.width, this.height);
	}

	react(sp, ctx){
		if(sp!=this.weapon.nave){
			if(sp.ctx!=null){
				if(this.intersectsPixelCheck(sp)){
					sp.impact = 121;
					sp.life -= this.weapon.damage;
					sp.impactDirection = this.direction;
					if(sp.life<0) {
						sp.remove();
						ctx.Count++;
					}
					this.remove();
				}
			}
		}
		return false;
	}
}


class Inimigo extends Entidade
{
	constructor(img, w, h, x, y, life, speed, alvo, damage){
		var direction = Math.atan2(alvo.yc - (y + h/2), alvo.xc - (x + w/2));
		super(img, w, h, x, y, direction, null, life, speed);
		this.alvo = alvo;
		this.damage = damage;
		var canvas = document.createElement('canvas');
		canvas.width = Math.round(this.width);
		canvas.height = Math.round(this.height);
		this.ctx = canvas.getContext("2d");
	}

	move(cw, ch){
		this.x = this.x + (Math.cos(this.direction) * this.speed);
		this.y = this.y + (Math.sin(this.direction) * this.speed);
		
		this.impactMove(cw, ch);
		
		this.xc=this.x + this.width / 2;
		this.yc=this.y + this.height / 2;
	}

	rotate(){
		var alvo =  this.alvo;
		if( (alvo.up && !alvo.down) || (alvo.down && !alvo.up) || (alvo.left && !alvo.right) || (alvo.right && !alvo.left) || alvo.impact>=0){
			this.direction = Math.atan2(this.alvo.yc - this.yc, this.alvo.xc - this.xc);
			this.imageData = this.getImageData();
		}
	}

	react(objeto){
		if(objeto = this.alvo){
			if(this.intersectsPixelCheck(objeto)){
				objeto.impact = 121;
				objeto.impactDirection = this.direction;
				objeto.life-=10;
				if(objeto.life<0)
					objeto.life=0;
			}
			return false
		}
		// ao retornar true obejeto tem que usar react() sobre this
		return true
	}
	draw(ctx){
		super.draw(ctx);
		this.drawlife(ctx);
	}
}

class Inimigo0 extends Inimigo
{
	constructor(img, w, h, x, y, alvo){
		super(img, w, h, x, y, 110, 2.9, alvo, 5);
	}

}

class Inimigo1 extends Inimigo
{
	constructor(img, w, h, x, y, alvo){
		super(img, w/3, h/3, x, y, 25, 2.5, alvo, 2);
	}

}
class Inimigo2 extends Inimigo
{
	constructor(img, w, h, x, y, alvo){
		super(img, w, h, x, y, 60, 2.7, alvo, 2);
	}
	draw(ctx){
		super.draw(ctx);
		this.life+=0.3;
		if(this.life>this.InitLife){
			this.life=this.InitLife;
		}
	}
}

class Inimigo3 extends Inimigo
{
	constructor(img, w, h, x, y, alvo){
		super(img, w, h, x, y, 60, 4, alvo, 2);
	}

}

class Inimigo4 extends Inimigo
{
	constructor(img, w, h, x, y, alvo){
		super(img, w, h, x, y, 60, 2.7, alvo, 0);
	}
	react(objeto, ctx){
		if(objeto = this.alvo){
			if(this.intersectsPixelCheck(objeto)){
				this.remove();
				ctx.Count++;
			}
			return false
		}
		// ao retornar true obejeto tem que usar react() sobre this
		return true
	}

	remove(){
		var explosion = new Explosion(this.explosion, this.x, this.y, this.alvo);
		this.listPointer.ant.add(explosion);
		this.audio.currentTime = 0;
		this.audio.play();
		var ptr = this.listPointer;
		if(ptr.ant!=null)
			ptr.ant.next = ptr.next;
		if(ptr.next!=null)
			ptr.next.ant = ptr.ant;
	}
}

class Gerador
{
	constructor(spArray, dif){
		this.spArray = spArray;
		this.timer = 3;
		this.dif = dif;
		this.decrement = 1;
		if(dif==0) {
			this.dif = 1;
			this.decrement=0;
		}
	}

	setLifeImg(img, Lw, Lh){
		this.lifeImg = img;
		this.Lw = Lw;
		this.Lh = Lh;
	}

	setLifeBarImg(img){
		this.lifeBarImg = img;
	}

	generate(time, ctx){
		if(time % (14*this.timer)==0){
			// calcular posição
			var x = Math.random() * (ctx.canvas.width);
			var y = Math.random() * (ctx.canvas.height);

			var r = Math.random();
			if(r<0.5){
				y = Math.round(y/ctx.canvas.height)*ctx.canvas.height;
			}
			else{
				x = Math.round(x/ctx.canvas.width)*ctx.canvas.width;
			}
			var sp;
			var index = Math.trunc(Math.random()*5);
			while(index==5){
				index = Math.trunc(Math.random()*5);
			}
			var img = this.images[index];

			var nw = img.naturalWidth;
			var nh = img.naturalHeight;
			switch(index){
				case 0:
					sp = new Inimigo0(img, Math.round(nw/3), Math.round(nh/4), x, y, this.spArray.sp);
					break;
				case 1:
					for(let i=0; i<6; i++) {
						var X = x +  Math.round(Math.random()*100)-50;
						var	Y = y + Math.round(Math.random()*100)-50;
						sp = new Inimigo1(img, Math.round(nw / 3), Math.round(nh / 4), X, Y, this.spArray.sp);
						sp.speed+= Math.random()*0.3-0.15;
						sp.imageData = sp.getImageData();
						sp.setLifeImg(this.lifeImg, this.Lw, this.Lh);
						sp.setLifeBarImg(this.lifeBarImg);
						sp.life *= this.dif;
						sp.InitLife *= this.dif;
						sp.damage *= this.dif;
						this.spArray.add(sp);
						ctx.nInimigos-= this.decrement;
						if(ctx.nInimigos==0)
							break;
					}
					break;
				case 2:
					sp = new Inimigo2(img, Math.round(nw/3), Math.round(nh/4), x, y, this.spArray.sp);
					break;
				case 3:
					sp = new Inimigo3(img, Math.round(nw/3), Math.round(nh/4), x, y, this.spArray.sp);
					break;
				case 4:
					sp = new Inimigo4(img, Math.round(nw/3), Math.round(nh/4), x, y, this.spArray.sp);
					sp.explosion = this.explosion;
					sp.audio = this.audio;
					break;
			}
			if(index!=1) {
				ctx.nInimigos-= this.decrement;
				sp.imageData = sp.getImageData();
				sp.setLifeImg(this.lifeImg, this.Lw, this.Lh);
				sp.setLifeBarImg(this.lifeBarImg);
				sp.life *= this.dif;
				sp.InitLife *= this.dif;
				sp.damage *= this.dif;
				this.spArray.add(sp);
			}
		}
	}
}

class Explosion extends SpriteImage
{
	constructor(images,x, y, nave){
		super(null, 10, 10, x, y, 0, null);
		this.images = images;
		this.img = images[0]
		//this.imageData = this.getImageData();
		this.index = 0
		this.alvo = nave
		this.opacity = 100;
	}
	react(objeto){
		if(objeto = this.alvo){
			if(this.intersectsPixelCheck(objeto)){
				objeto.impact = 200;
				objeto.impactDirection = Math.atan2(this.alvo.yc - this.yc, this.alvo.xc - this.xc);
				objeto.life-=15;
				if(objeto.life<0)
					objeto.life=0;
			}
		}
		return false
	}
	draw(ctx){
		ctx.save();

		ctx.globalAlpha = (this.opacity/100);
		//this.imageData = this.getImageData();

		this.opacity -= 2;
		if((this.opacity)%20==0 && this.index<3) {
			this.index++;
			this.img = this.images[this.index];
		}

		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.direction);
		ctx.translate(-this.width / 2, -this.height / 2);
		ctx.drawImage(this.img, 0, 0, this.width, this.height);
		ctx.restore();
		if(this.opacity<=0){
			this.remove();
		}
		this.width += 10;
		this.height+= 10;
		this.x-=5;
		this.y-=5;
		this.xc=this.x + Math.round(this.width / 2);
		this.yc=this.y + Math.round(this.height / 2);
	}

	getImageData(){
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");

		ctx.drawImage(this.img, 0, 0, this.width, this.height);
		ctx.restore();
		return ctx.getImageData(0, 0, this.width, this.height);
	}

	static intersectsBoundingBox(sp1, sp2){
		if(sp1.x > sp2.x+ sp2.width || sp2.x > sp1.x+ sp1.width)
			return false;
		if(sp1.y > sp2.y+ sp2.height || sp2.y > sp1.y+ sp1.height)
			return false;
		return true;
	}
	intersectsPixelCheck(sp2){
		if(SpriteImage.intersectsBoundingBox(this, sp2)){
			var direction = Math.atan2(this.alvo.yc - this.yc, this.alvo.xc - this.xc);
			var X = this.xc + (Math.cos(direction) * this.width/2);
			var Y = this.yc + (Math.sin(direction) * this.width/2);

			var xLocal = Math.round(X-sp2.x );
			var yLocal = Math.round(Y - sp2.y);
			var pixelIndex = yLocal * sp2.width + xLocal;
			pixelIndex = pixelIndex * 4 + 3;
			if(sp2.imageData.data[pixelIndex]){
				return true;

			}
			return false;
		}
		else{
			return false;
		}
	}
}
function $(id){return document.getElementById(id);}
var tetris={//游戏主程序对象
	CSIZE:26,
	RN:20,
	CN:10,
	OFFSET:15,
	
	shape:null,
	nextShape:null,
	INTERVAL:1000,
	timer:null,
	
	wall:null, //保存停止下落的方块的二维数组
	
	score:0,
	lines:0,
	level:1,
	SCORES:[0,10,50,80,200],

	state:1,
	RUNNING:1,
	PAUSE:2,
	GAMEOVER:0,

	start:function(){
		this.state=this.RUNNING;
		this.score=0;
		this.lines=0;
		this.level=0;
		var me=this;
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();

		this.wall=[];
		for(var i=0;i<this.RN;i++){
			this.wall.push(new Array(this.CN));
		}
		document.onkeydown=function(e){
			var e=e||window.event;
			switch(e.keyCode){
				case 37:me.state==me.RUNNING&&me.moveLeft();break;  //L
				case 39:me.state==me.RUNNING&&me.moveRight();break; //R
				case 40:me.state==me.RUNNING&&me.moveDown();break; //Down
				case 38:me.state==me.RUNNING&&me.rotateR();break; //顺时针Up
				case 90:me.state==me.RUNNING&&me.rotateL();break; //逆时针Z
				case 83:me.state==me.GAMEOVER&&me.start();break; //S
				case 80:me.state==me.RUNNING&&me.pause();break; //P
				case 67:me.state==me.PAUSE&&me.myContinue();break;//C
				case 81:me.gameOver(); //Q
			}
		}
		this.timer=setInterval(this.moveDown.bind(this),this.INTERVAL);
		this.paint(); //重绘一切
	},
	gameOver:function(){
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	myContinue:function(){
		this.state=this.RUNNING;
	},
	pause:function(){
		this.state=this.PAUSE;
		this.paint();
	},
	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();
		}
	},
	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN){
				return false;
			}else if(cell.r<this.RN&&this.wall[cell.r][cell.c]){
					return false;
			}
		}
		return true;
	},
	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();
		}
	},
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
		}
	},
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if((cell.c==this.CN-1)||this.wall[cell.r][cell.c+1]){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
		}
	},
	
	randomShape:function(){
		
		var r=Math.floor(Math.random()*7);
		switch(r){
			case 0: return new O();break;
			case 1: return new I();break;
			case 2: return new T();break;
			case 3: return new S();break;
			case 4: return new Z();break;
			case 5: return new L();break;
			case 6: return new J();break;

		}
		/**/
		/*return new O();*/  //测试用
	},
	landIntoWall:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell; //
		}
	},
	moveDown:function(){

		if(this.canDown()){
			this.shape.moveDown();
		}else{  //否则(停止下落后)
			this.landIntoWall();
			var ls=this.deleteRows();  //判断并删除行
			this.lines+=ls;
			this.score+=this.SCORES[ls];
			if(!this.isGameOver()){
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}else{
				this.gameOver();
			}
		}
		this.paint(); //重绘一切
	},
	paintState:function(){ //根据游戏状态，添加对应图片
		if(this.state!=this.RUNNING){
			var img=new Image();
			img.src=this.state==this.PAUSE?"img/pause.png":"img/game-over.png";
			$("pg").appendChild(img);
		}
	},
	isGameOver:function(){ //判断游戏是否结束
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]){
				return true;
			}
		}
		return false;
	},
	deleteRows:function(){ //删除所有满格行
		for(var r=this.RN-1,ls=0;r>=0;r--){
			if(this.isFullRow(r)){
				this.deleteRow(r);
				ls++;
				r++;
				if(ls==4){break;}
			}
		}
		return ls;
	},
	
	isFullRow:function(r){ //检查当前行是否满格
		return String(this.wall[r]).search(/^,|,,|,$/)!=-1?false:true;
	},
	deleteRow:function(delr){ //删除指定行
		for(r=delr;r>0;r--){
			this.wall[r]=this.wall[r-1];
			for(var c=0;c<this.CN;c++){
				this.wall[r][c]&&this.wall[r][c].r++;
			}
			this.wall[r-1]=new Array(this.CN);
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	  
	canDown:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]){
				return false;
			}
		}
		return true;
	},
	paintNext:function(){ //绘制下一个图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=(cell.r+1)*this.CSIZE+this.OFFSET+"px";
			img.style.left=(cell.c+10)*this.CSIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		$("pg").appendChild(frag);
	},  
	paintWall:function(){
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0;r--){
			if(this.wall[r].join("")){
				for(var c=0;c<this.CN;c++){
					var cell=this.wall[r][c];
					if(cell){
						var img=new Image();
						img.src=cell.src;
						img.style.top=(cell.r)*this.CSIZE+this.OFFSET+"px";
						img.style.left=(cell.c)*this.CSIZE+this.OFFSET+"px";
						frag.appendChild(img);
					}
				}
			}else{
				break;
			}
		}
		$("pg").appendChild(frag);
	},
	paint:function(){ //重绘一切
		$("pg").innerHTML=$("pg").innerHTML.replace(/<img(.*?)>/ig,"");
		this.paintShape();
		this.paintNext();
		this.paintWall();
		this.paintScore();
		this.paintState(); //重绘游戏状态
	},
	paintScore:function(){
		$("score").innerHTML=this.score;
		$("lines").innerHTML=this.lines;
		$("level").innerHTML=this.level;
	},
	paintShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			frag.appendChild(img);
		}
		$("pg").appendChild(frag);
	},
};
window.onload=function(){tetris.start();}
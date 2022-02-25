//描述所有格子对象的构造函数
function Cell(r,c,src){
	this.r=r;
	this.c=c;
	this.src=src;
}
//描述旋转状态的构造函数
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
}
//描述所有图形的公共属性和方法的父对象
function Shape(cells,src,orgi,states){
	this.cells=cells;
	this.orgi=orgi;
	this.states=states;
	this.statei=0;
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;
	}
}
//在父类型原型对象中集中定义所有图形的图片路径
Shape.prototype.IMGS={//图片路径
	O:"img/O.png",
	I:"img/I.png",
	T:"img/T.png",
	S:"img/S.png",
	Z:"img/Z.png",
	L:"img/L.png",
	J:"img/J.png",
};
//在父类型的原型对象中，添加下移，左移，右移的方法
Shape.prototype.moveDown=function(){
	for(var i=0;i<this.cells.length;this.cells[i].r++,i++);
};
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;this.cells[i].c--,i++);
};
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;this.cells[i].c++,i++);
};
Shape.prototype.rotateR=function(){  //顺时针旋转1次
	this.statei++;
	if(this.statei>=this.states.length){this.statei=0;}
	this.rotate();
};
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	//console.log(state,orgCell);
	for(var i=0;i<this.cells.length;i++){
			this.cells[i].r=orgCell.r+state["r"+i];
			this.cells[i].c=orgCell.c+state["c"+i];
			console.log(this.cell);
	}
}; 
Shape.prototype.rotateL=function(){
	this.statei--;
	if(this.statei<0){this.statei=this.states.length-1;}
	this.rotate();
};
//创建T类型的构造函数，同时让T类型继承Shape
function T(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4),
		],	
		this.IMGS.T,
		1,
		[
			new State(0,-1,0,0,0,+1,+1,0),	
			new State(-1,0,0,0,+1,0,0,-1),	
			new State(0,+1,0,0,0,-1,-1,0),	
			new State(+1,0,0,0,-1,0,0,+1)
		]
	]);
};
Object.setPrototypeOf(T.prototype,Shape.prototype);
function O(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4),
			new Cell(1,5),
		],	
		this.IMGS.O,
		0,
		[
			new State(0,0,0,+1,+1,0,+1,+1)
		]
	]);
};
Object.setPrototypeOf(O.prototype,Shape.prototype);
function I(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(0,6),
		],	
		this.IMGS.I,
		1,
		[
			new State(0,-1,0,0,0,+1,0,+2),	
			new State(-1,0,0,0,+1,0,+2,0)
		]
	]);
};
Object.setPrototypeOf(I.prototype,Shape.prototype);
function S(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3),
			new Cell(1,4),
		],	
		this.IMGS.S,
		3,
		[
			new State(-1,0,-1,1,0,-1,0,0),	
			new State(0,+1,+1,+1,-1,0,0,0)
		]
	]);
};
Object.setPrototypeOf(S.prototype,Shape.prototype);
function Z(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(1,4),
			new Cell(1,5),
		],	
		this.IMGS.Z,
		2,
		[
			new State(-1,-1,-1,0,0,0,0,+1),	
			new State(-1,+1,0,+1,0,0,+1,0)
		]
	]);
};
Object.setPrototypeOf(Z.prototype,Shape.prototype);
function L(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,5),
		],	
		this.IMGS.L,
		1,
		[
			new State(-1,0,0,0,+1,0,+1,+1),	
			new State(0,+1,0,0,0,-1,+1,-1),	
			new State(+1,0,0,0,-1,0,-1,-1),	
			new State(0,-1,0,0,0,+1,-1,+1)
		]
	]);
};
Object.setPrototypeOf(L.prototype,Shape.prototype);
function J(){
	Shape.apply(this,[
		[//cells参数：保存4个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3)
		],	
		this.IMGS.J,
		1,
		[
			new State(-1,0,0,0,+1,0,+1,-1),	
			new State(0,+1,0,0,0,-1,-1,-1),	
			new State(+1,0,0,0,-1,0,-1,+1),	
			new State(0,-1,0,0,0,+1,+1,+1)
		]
	]);
};
Object.setPrototypeOf(J.prototype,Shape.prototype);
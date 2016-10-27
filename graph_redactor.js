


class GRAPH
{

	constructor(_obj)
	{
		if(_obj==undefined)
		{
			this.n=0;
			this.a=[];
			this.point=[];
			this.or=0;
		}
		else
		{
			this.n=_obj.n;
			this.a=[];
			this.point=[];

			for(var i=0;i<this.n;i++)
			{
				this.point[i]=_obj.point[i];
				this.a[i]=_obj.a[i];
				for(var r=0;r<this.n;r++)
				{
					this.a[i][r]=_obj.a[i][r];
				}
			}

			this.or=_obj.or;
		}
	};

	add_point(_pos)
	{
		for(var i=0;i<this.n;i++)
			this.a[i][this.n]=undefined;
		this.a[this.n]=[];
		for(var i=0;i<=this.n;i++)
			this.a[this.n][i]=undefined;

		this.point[this.n]=_pos;
		this.point[this.n].c=0;

		this.n++;

	}

	del_point(_i)
	{
		for(var i=0;i<this.n;i++)
			this.a[i][_i]=this.a[i][this.n-1];
		this.a[_i]=this.a[this.n-1];
		this.point[_i]=this.point[this.n-1];
		this.n--;

	}

	add_edge(_p1,_p2)
	{
		this.a[_p1][_p2]={c:0};
		if(this.or==0)
			this.a[_p2][_p1]={c:0};
	}

	del_edge(_p1,_p2)
	{
		this.a[_p1][_p2]=undefined;
		if(this.or==0)
			this.a[_p2][_p1]=undefined;
	}

}

var selected_tool=0;
var pressed_button=-1;
var selected_button=0;

var selected_point=-1;

var graph=new GRAPH();
   

var timer;
var cid;
var cursor={x:0,y:0,l_up:0,l_down:0,ch:0};

var img_buttons=[];

var razokx,razoky;

var main_settings=
{
	button:[0,2,1,0]
};



function on_move(e)
{
	var cv = document.getElementById(cid);
	var cx = document.getElementById(cid).getContext("2d");

	cursor.x=e.pageX-cv.offsetLeft;
	cursor.y=e.pageY-cv.offsetTop;

}

function on_m_down(e)
{
	var cv = document.getElementById(cid);
	var cx = document.getElementById(cid).getContext("2d");

	cursor.x=e.pageX-cv.offsetLeft;
	cursor.y=e.pageY-cv.offsetTop;
	cursor.l_down=1;
	cursor.ch=1;
	cx.beginPath();
	cx.arc(cursor.x, cursor.y, 2, 0, 2 * Math.PI);
	cx.stroke();

}

function on_m_up(e)
{
	var cv = document.getElementById(cid);
	var cx = document.getElementById(cid).getContext("2d");

	cursor.x=e.pageX-cv.offsetLeft;
	cursor.y=e.pageY-cv.offsetTop;
	cursor.l_up=1;
	cursor.ch=0;
	cx.beginPath();
	cx.arc(cursor.x, cursor.y, 2, 0, 2 * Math.PI);
	cx.stroke();

}

function add_point(_pos)
{
	graph.add_point(_pos);
}

function del_point(_pos)
{
	for(var i=graph.n-1;i>=0;i--)
	{
		if((_pos.x-graph.point[i].x)*(_pos.x-graph.point[i].x)+(_pos.y-graph.point[i].y)*(_pos.y-graph.point[i].y)<10*10)
		{
			graph.del_point(i);
		}
	}
}

function get_near_point(_pos)
{
	var res=-1;
	var ras=100*100;

	for(var i=0;i<graph.n;i++)
		if(ras>(_pos.x-graph.point[i].x)*(_pos.x-graph.point[i].x)+(_pos.y-graph.point[i].y)*(_pos.y-graph.point[i].y))
		{
			res=i;
			ras=(_pos.x-graph.point[i].x)*(_pos.x-graph.point[i].x)+(_pos.y-graph.point[i].y)*(_pos.y-graph.point[i].y);
		}

	return res;
}

function set_edge(_i1,_i2)
{
	if(graph.a[_i1][_i2]==1)
	{
		graph.del_edge(_i1,_i2);
	}
	else
	{
		graph.add_edge(_i1,_i2);
	}
}

function dd(c,d)
{
	var x,y;
	x=Math.cos(c/180.0*Math.PI)*d;
	y=Math.sin(c/180.0*Math.PI)*d;
	return {x:x,y:y};
}

function ss(x1,y1,x2,y2)
{
	var u;

	if (x1 -x2 == 0) { x1=x1+0.0003;};
	u=Math.atan((y1-y2)/(x1-x2))*180/Math.PI;
	if (x2-x1 > 0) { u=u+180;};

	return u;
}

function ras(x,y)
{
	return Math.sqrt(x*x+y*y);
}

function can_add_node(_pos)
{
	var can_place=1;
	for(var i=0+0;i<graph.n && can_place==1;i++)
	for(var r=i+1;r<graph.n && can_place==1;r++)
	if(graph.a[i][r]!=undefined)
	{
		var px;
		var py;
		px=graph.point[i].x;
		py=graph.point[i].y;

		var l=ras(px-graph.point[r].x,py-graph.point[r].y);

		var u=ss(px,py,graph.point[r].x,graph.point[r].y);

		var l1=ras(px-_pos.x,py-_pos.y);

		var u1=ss(px,py,_pos.x,_pos.y);
		//document.getElementById("logs").innerHTML ="";

		var new_pos=dd(u1-u,l1);

		if(new_pos.x>0)
		if(new_pos.y>-8)
		if(new_pos.x<l)
		if(new_pos.y<8)
		{
			can_place=0;
		}
 	}
 	return can_place;
}

function can_add_edge(_i1,_i2)
{
	var can_place=1;
	for(var i=0+0;i<graph.n && can_place==1;i++)
	if(i!=_i1 && i!=_i2)
	{
		var px;
		var py;
		var pos=graph.point[i];
		px=graph.point[_i1].x;
		py=graph.point[_i1].y;

		var l=ras(px-graph.point[_i2].x,py-graph.point[_i2].y);

		var u=ss(px,py,graph.point[_i2].x,graph.point[_i2].y);

		var l1=ras(px-pos.x,py-pos.y);

		var u1=ss(px,py,pos.x,pos.y);
		//document.getElementById("logs").innerHTML ="";
		//document.getElementById("logs").innerHTML = document.getElementById("logs").innerHTML+"<br>"+JSON.stringify({l:l,u:u,l1:l1,u1:u1});

		var new_pos=dd(u1-u,l1);

		//document.getElementById("logs").innerHTML = document.getElementById("logs").innerHTML+"<br>"+JSON.stringify(new_pos);

		if(new_pos.x>0)
		if(new_pos.y>-8)
		if(new_pos.x<l)
		if(new_pos.y<8)
		{
			can_place=0;
		}
 	}
 	return can_place;
}

function upd()
{
	var cx = document.getElementById(cid).getContext("2d");


	razokx=document.getElementById(cid).width;
	razoky=document.getElementById(cid).height;


	//PROC

	pressed_button=-1;

	if(cursor.y>=razoky-34)
	{
		//alert("you clicked gui");
		for(var i=0;i<main_settings.button.length;i++)
		if(cursor.x<=3+i*34+32)
		if(cursor.x>=3+i*34)
		if(cursor.y<=razoky-34+32)
		if(cursor.y>=razoky-34)
		{
			if(cursor.l_up==1)
			{
				selected_tool=main_settings.button[i];
				selected_button=i;
				selected_point=-1;
			}
			if(cursor.ch==1)
			{
				pressed_button=i;
			}
		}
	}
	else
		if(cursor.l_down==1)
		{
			if(selected_tool==0)
			{
				var n_p=get_near_point({x:cursor.x,y:cursor.y});
				var is_add=0;

				if(n_p!=-1)
				{
					if((graph.point[n_p].x-cursor.x)*(graph.point[n_p].x-cursor.x)+(graph.point[n_p].y-cursor.y)*(graph.point[n_p].y-cursor.y)>30*30)
						is_add=1;
				}
				else
				{
					is_add=1;
				}
				if(cursor.x<15)
					is_add=0;
				if(cursor.y<15)
					is_add=0;
				if(cursor.x>razokx-15)
					is_add=0;
				if(cursor.y>razoky-32-15)
					is_add=0;

				if(is_add==1)
				if(can_add_node({x:cursor.x,y:cursor.y}))
				{
					add_point({x:cursor.x,y:cursor.y});
				}
			}
			if(selected_tool==1)
			{
				del_point({x:cursor.x,y:cursor.y});
				get_gr();
			}
			if(selected_tool==2)
			{
				if(selected_point==-1)
				{
					selected_point=get_near_point({x:cursor.x,y:cursor.y});
				}
				else
				{
					var np=get_near_point({x:cursor.x,y:cursor.y});
					if(np!=-1)
					if(!can_add_edge(selected_point,np))
						np=-1;
					if(np!=-1)
					{
						set_edge(selected_point,np);
						selected_point=-1;
					}
				}
			}

		}
	







	cursor.l_down=0;
	cursor.l_up=0;




	//DRAWS

	cx.clearRect(0,0,razokx,razoky);

	if(selected_tool==2)
	if(selected_point!=-1)
	{
		cx.beginPath();
		cx.arc(graph.point[selected_point].x, graph.point[selected_point].y, 8, 0, 7);
		cx.stroke();

		cx.beginPath();
		cx.moveTo(graph.point[selected_point].x,graph.point[selected_point].y);
		cx.lineTo(cursor.x,cursor.y);
		cx.stroke();
	}

	cx.strokeRect(0,0,razokx,razoky);
	for(var i=0;i<main_settings.button.length;i++)
	{
		if(i==selected_button)
		{
		//cx.strokeRect(5+i*34,razoky-32,28,28);
		}
		//cx.strokeRect(3+i*34,razoky-34,32,32);
		cx.drawImage(img_buttons[main_settings.button[i]],0,0,32,32,3+i*34,razoky-34,32,32);

		if(i==selected_button)
		{
			cx.drawImage(img_buttons[main_settings.button[i]],64,0,32,32,3+i*34,razoky-34,32,32);	
		}
	
		if(pressed_button==i)
			cx.drawImage(img_buttons[main_settings.button[i]],32,0,32,32,3+i*34,razoky-34,32,32);

	}

	cx.beginPath();
	cx.moveTo(0, razoky-36);
	cx.lineTo(razokx, razoky-36);
	cx.stroke();


	for(var i=0;i<graph.n;i++)
	for(var r=0;r<graph.n;r++)
	if(graph.a[i][r]!=undefined)
	{
		cx.beginPath();
		cx.moveTo(graph.point[i].x, graph.point[i].y);
		cx.lineTo(graph.point[r].x, graph.point[r].y);
		cx.stroke();
		if(i==r)
		{
			cx.beginPath();
			cx.arc(graph.point[i].x+20, graph.point[i].y, 20, 0, 7);
			cx.stroke();
		}
	}

	for(var i=0;i<graph.n;i++)
	{
		cx.beginPath();
		cx.arc(graph.point[i].x, graph.point[i].y, 7, 0, 2 * Math.PI);
		cx.stroke();
	}
}

function guist(id,useless,j_args)
{
	var args=JSON.parse(j_args);

	if(args.is_orient== undefined)
		args.is_orient=0;
	if(args.is_orient== undefined)
		args.is_orient=0;
	if(args.gui_buttons== undefined)
		args.gui_buttons=[0,1,2];

	img_buttons[0] = new Image();  
	img_buttons[1] = new Image();  
	img_buttons[2] = new Image();  
	img_buttons[3] = new Image();  
	img_buttons[4] = new Image();  

	img_buttons[0].src = 'icon_node_add.png';
	img_buttons[1].src = 'icon_node_del.png';
	img_buttons[2].src = 'icon_edge_mod.png';
	img_buttons[3].src = 'icon_edge_add.png';
	img_buttons[4].src = 'icon_edge_del.png';

	cid='g85n73u86';


	selected_tool=0;
	pressed_button=-1;
	selected_button=0;

	selected_point=-1;

	graph=new GRAPH();			

	   
	cursor={x:0,y:0,l_up:0,l_down:0,ch:0};


	main_settings=
	{
		button:args.gui_buttons
	};


	document.getElementById(cid).onmousedown=on_m_down;
	document.getElementById(cid).onmouseup=on_m_up;
	document.getElementById(cid).onmousemove = on_move;

	var timer = setInterval(upd,1000/30);

}

function get_gr()
{
	var graph1=graph;
	for(let i=0;i<graph1.point.length;i++)
	{
		graph1.point[i].x/=razokx;
		graph1.point[i].y/=razoky;
	}
	return JSON.stringify(graph1);
}

function set_gr(_graph)
{
	graph=new GRAPH(JSON.parse(_graph));
	for(let i=0;i<graph.point.length;i++)
	{
		graph.point[i].x*=razokx;
		graph.point[i].y*=razoky;
	}
}

//guist('g85n73u86',JSON.stringify({is_orient:1, gui_buttons:[0,1,2,2,1,0]}));

define(function()
{return { 

	init: guist,
	get_gr:get_gr,
	set_gr:set_gr 
	
};});


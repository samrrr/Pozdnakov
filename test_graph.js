
/*

{"n":4,"a":[[null,{"c":0},{"c":0},{"c":0}],[{"c":0},null,{"c":0},{"c":0}],[{"c":0},{"c":0},null,{"c":0}],[{"c":0},{"c":0},{"c":0},null]],"point":[{"x":0.5979166666666667,"y":0.359375,"c":0},{"x":0.4354166666666667,"y":0.340625,"c":0},{"x":0.5083333333333333,"y":0.6625,"c":0},{"x":0.6729166666666667,"y":0.534375,"c":0}],"or":0}

is_full
is_tree

*/

function test_dvudolnost(_gr)//return true false
{
	let ma=[];
	let col=[];

	let ray_unch=0;

	let checked=0;
	let last_free=0;
	while(checked<_gr.n)
	{
		if(ma[checked]==undefined)
		{
			for(;ray_unch<_gr.n && ma[checked]==undefined;ray_unch++)
			if(col[ray_unch]==undefined)
			{
				ma[checked]=ray_unch;
				last_free=checked+1;
				col[ray_unch]=1;
					//_gr.point[ray_unch].c=4;
			}
		}

		let cur_col=col[ma[checked]];

		for(let i=0;i<_gr.n;i++)
			if(ma[checked]!=i)
			if(_gr.a[ma[checked]][i]!=null)
			{
				if(col[i]==undefined)
				{
					col[i]=(cur_col+1)%2;
						//_gr.point[i].c=col[i];
					ma[last_free]=i;
					last_free++;
				}
				if(cur_col==col[i])
					return false;
			}
		checked++;
	}
	return true;
}

function test_polnaia_dvudolnost(_gr)//return true false
{		
	if(!test_dvudolnost(_gr))
		return false;

	var m1,m2;
	
	m1=[0];
	
	var j=1;
	
	for(var i=1;i<_gr.n;i++){
		if(_gr.a[0][i]==null){
			m1[j]=i;
			j++;
		}
	}
	
	m2=[0];
	
	for(i=1;i<_gr.n && m2[0]==0;i++)
		if(_gr.a[0][i]!=null)
			m2[0]=i;
		
	if(m2[0]==0)
		return false;
		
	var j=1;
	
	for(var i=0;i<_gr.n;i++){
		if(m2[0]!=i && _gr.a[m2[0]][i]==null){
			m2[j]=i;
			j++;
		}
	}
		
	for(i=0;i<m1.length;i++)
		for(j=0;j<m2.length;j++)
			if(_gr.a[m1[i]][m2[j]]==null)
				return false;
			
	return true;
}

function test_gr_st(_gr,_st)
{
	let graph=JSON.parse(_gr);
	let res={};


	res.numv=[];
	for(let i=0;i<graph.n;i++)
	{
		let o;
		o=0;
		for(let r=0;r<graph.n;r++)
			if(graph.a[i][r]!=undefined)
			{
				o++;
			}
			
		res.numv[i]=o;
	}

	let j=res.numv[0];
	for(let i=0;i<graph.n;i++)
	{
		if(j!=res.numv[i])
			j=-1;
	}

	if(j != -1)
	{
		res.k_sv=j;
	}

}

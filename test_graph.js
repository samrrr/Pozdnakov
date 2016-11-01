
/*

{"n":4,"a":[[null,{"c":0},{"c":0},{"c":0}],[{"c":0},null,{"c":0},{"c":0}],[{"c":0},{"c":0},null,{"c":0}],[{"c":0},{"c":0},{"c":0},null]],"point":[{"x":0.5979166666666667,"y":0.359375,"c":0},{"x":0.4354166666666667,"y":0.340625,"c":0},{"x":0.5083333333333333,"y":0.6625,"c":0},{"x":0.6729166666666667,"y":0.534375,"c":0}],"or":0}

is_full
is_tree

*/

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
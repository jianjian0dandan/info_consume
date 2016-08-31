 function viewinformation() 
 {
	//this.ajax_method='GET';	// body...
 }
viewinformation.prototype=
{
	call_sync_ajax_request:function(url,callback) 
	{
		
		$.ajax({
		      url: url,
		      type: 'GET',
		      dataType: 'json',
		      async: true,
		      success:callback
    	});
	},

	in_domain:function(data)
	{
		var i;
		//将此人涉及领域从数据库取出，
		var domain = new Array();
		var num = new Array();
		var show_domain = new Array();
		for (i=0;i<data.in_domain.length;i++) 
		{
			domain[i]=data.in_domain[i][0];
			num[i]=data.in_domain[i][1];
			show_domain.push({text:domain[i],max:50});
		}
		//console.log(domain);
		console.log(num);
//console.log(show_domain);
		var myChart = echarts.init(document.getElementById('main'));
						option = {					    
					    tooltip : {
					        trigger: 'axis'
					    },
					     toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },					   
					    calculable : true,
					    polar : [
					        {
					            indicator : show_domain,
					           
					            radius : 130
					        }
					    ],
					    series : [
					        {
					            name: '完全实况球员数据',
					            type: 'radar',
					            itemStyle: {
					                normal: {
					                    areaStyle: {
					                        type: 'default'
					                    }
					                }
					            },
					            data : [
					               
					                {
					                    value : num,
					                    name : '罗纳尔多'
					                }
					            ]
					        }
					    ]
					};
						myChart.setOption(option);

		//限制打印20个hashtag
		//$('#hashone').append(hashtag[0][0]);				
			
	}	
} 	
	

var viewinformation=new viewinformation();

function show_in_domain()
{

	url = '/attribute/new_user_social/?uid=3293303045';
	viewinformation.call_sync_ajax_request(url,viewinformation.in_domain);
}

show_in_domain();

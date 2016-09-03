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


	identity:function(data)
	{
		var i;
		//将此人涉及领域从数据库取出，
		var identity = new Array();
		var num = new Array();
		var show_identity = new Array();
		
		for (i=0;i<data.in_domain.length;i++) 
		{
			identity[i]=data.in_domain[i][0];
			num[i]=data.in_domain[i][1];
			show_identity.push({text:identity[i],max:maxvalue});
		}
		//获取数量数组中的最大值；
		var maxvalue=Math.max.apply(null, num);
		//console.log(maxvalue);
		//console.log(num);
//console.log(show_domain);
		var myChart1 = echarts.init(document.getElementById('identity'));
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
					            indicator : show_identity,
					           
					            radius : 130
					        }
					    ],
					    series : [
					        {
					            // name: '完全实况球员数据',
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
					                	name:'他/她的身份',
					                    value : num,
					                    
					                }
					            ]
					        }
					    ]
					};
						myChart1.setOption(option);
						window.onresize = myChart1.resize;

		//限制打印20个hashtag
		//$('#hashone').append(hashtag[0][0]);				
			
	},

	domain:function(data)
	{

		var i;
		//将此人涉及领域从数据库取出，
		var domain = new Array();
		var num = new Array();
		var show_domain = new Array();
		
		for (i=0;i<data.in_topic.length;i++) 
		{
			domain[i]=data.in_topic[i][0];
			num[i]=data.in_topic[i][1];
			show_domain.push({text:domain[i],max:maxvalue});
		}
		//获取数量数组中的最大值；
		var maxvalue=Math.max.apply(null, num);
		//console.log(maxvalue);
		//console.log(num);
//console.log(show_domain);
		var myChart = echarts.init(document.getElementById('domain'));
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
					            // name: '完全实况球员数据',
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
					                	name:'他/她的领域',
					                    value : num,
					                    
					                }
					            ]
					        }
					    ]
					};
						myChart.setOption(option);
 						window.onresize = myChart.resize;
		//限制打印20个hashtag
		//$('#hashone').append(hashtag[0][0]);	
		} ,

		social:function(data)
		{
			console.log(data);
		}
		


}

var viewinformation=new viewinformation();

function show_identity()
{

	url = '/attribute/new_user_social/?uid=3293303045';
	viewinformation.call_sync_ajax_request(url,viewinformation.identity);
}

function show_domain()
{

	url = '/attribute/new_user_social/?uid=3293303045';
	viewinformation.call_sync_ajax_request(url,viewinformation.domain);
}

function show_social()
{

	url = '/attribute/new_user_social/?uid=3293303045';
	viewinformation.call_sync_ajax_request(url,viewinformation.social);
}


show_identity();
show_domain();
show_social();

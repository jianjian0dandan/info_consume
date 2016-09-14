
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
		      success:callback,
		     //  beforeSend: function () 
		     //  {  
		     //  	ShowMessage("正在努力地为您加载数据，请稍后哟~"); 
		  	  // },
		     //  // CloseWindow();
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

						//Echarts自适应网页窗口大小
						window.onresize = myChart1.resize;

		//限制打印20个hashtag
		//$('#hashone').append(hashtag[0][0]);				
		$('#p_so_onload').css('display','none').siblings().css('display','block');		
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

		//显示正在加载中的文字
		$('#p_so_onload1').css('display','none').siblings().css('display','block');		
		} ,

		social:function(data)
		{
			//console.log(data);
			Draw_out(data.top_retweet_comment,'retweet_out');
        	Draw_out(data.top_be_retweet_comment,'tweeted_out');
			Draw_out(data.top_interaction,'two_way_out');
			Draw_out(data.top_mention,'related_out');
			$('#p_so_onload1').css('display','none').siblings().css('display','block');	
		}
}


function Draw_out(data,div){
		console.log(data);
        $('#'+div).empty();
		if(data.length==0){
			var html='';
			html=html+'<p style="margin-left:40%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
		   $('#'+div).append(html);
		    //document.getElementById(div).innerHTML = "";
			// $('#more'+div).css('display','none');
		}else
		{
			var html = '';
			for(var i=0;i<data.length;i++){
			    if(data[i][2]=='unknown'){
				    data[i][2] = "http://tp2.sinaimg.cn/1878376757/50/0/1";
				}
				if(data[i][1]=='unknown'){
				    data[i][1] = "未知";
				    data[i][1] = data[i][0];
                }
			   // html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
			    html = html + '<a target="_blank" href="/index/viewinformation" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:20px;margin-top:10px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
			}
			// $('#more'+div).css('display','none');
			$('#'+div).append(html);
		}
			// var more_user = 'user'+div;
			// DrawMoreUser(data,more_user);
			// $('#'+div).append(html);
}




var viewinformation=new viewinformation();

function show_identity()
{

	url = '/attribute/new_user_social/?uid=2853982940';
	viewinformation.call_sync_ajax_request(url,viewinformation.identity);
}

function show_domain()
{

	url = '/attribute/new_user_social/?uid=2853982940';
	viewinformation.call_sync_ajax_request(url,viewinformation.domain);
}

function show_social()
{

	url = '/attribute/new_user_social/?uid=2853982940';
	viewinformation.call_sync_ajax_request(url,viewinformation.social);
}


show_identity();
show_domain();
show_social();

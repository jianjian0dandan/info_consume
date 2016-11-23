
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
		    
    	});
	},

	identity:function(data)
	{
		var i;
		//console.log(data);
		//将此人涉及领域从数据库取出，
		var identity = new Array();
		var num = new Array();
		var show_identity = new Array();
		// console.log(identity)
		
		for (i=0;i<data.in_domain.length;i++) 
			{
				identity[i]=data.in_domain[i][0];
				num[i]=data.in_domain[i][1];
				show_identity.push({text:identity[i],max:maxvalue});
			}
		var maxvalue=Math.max.apply(null, num);
		if(identity.length!=0)
		{
		
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
		}else
		{
			$('#p_so_onload').css('display','none').siblings().css('display','block');	
        	$('#identity').empty();

			var html='';
			html=html+'<p style="margin-left:30%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
        	 $('#identity').append(html);
		}
		
			
	},

	domain:function(data)
	{

		var i;
		//将此人涉及领域从数据库取出，
		var domain = new Array();
		var num = new Array();
		var show_domain = new Array();
		// var lenght;
		// lenght=data.lenght;
		// if(data.length!=undefined)
		
		// {
			for (i=0;i<data.in_topic.length;i++) 
		{
			domain[i]=data.in_topic[i][0];
			num[i]=data.in_topic[i][1];
			show_domain.push({text:domain[i],max:maxvalue});
		}
		var maxvalue=Math.max.apply(null, num);
		if(domain.length!=0)
		{
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
		}else
		{
			$('#p_so_onload1').css('display','none').siblings().css('display','block');	
        	$('#domain').empty();

			var html='';
			html=html+'<p style="margin-left:30%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
        	 $('#domain').append(html);

		}
	
		} ,

		//被转发
		follower:function(data)
		{
			console.log(data);
			// console.log(typeof data);
			Draw_out(data,'follower');
			// Draw_out(data,'be_comment');
			// $('#p_so_onload').css('display','none').siblings().css('display','block');	
		},
		attention:function(data)
		{
			console.log(data);
			
			Draw_out(data,'attention');
			// $('#p_so_onload').css('display','none').siblings().css('display','block');	
		},
		comment:function(data)
		{
			console.log(data);
			// console.log(typeof data);
			Draw_out(data,'comment');
			// $('#p_so_onload').css('display','none').siblings().css('display','block');	
		},
		be_comment:function(data)
		{
			console.log(data);
			// console.log(typeof data);
			Draw_out(data,'be_comment');
			// $('#p_so_onload').css('display','none').siblings().css('display','block');	
		}
}


function Draw_out(data,div){
		var count=0;
			for(var key in data)
			{
				count++;
			}
		if(count==0)
		{
			$('#'+div).empty();
			var html='';
			html=html+'<p style="margin-left:40%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
		   $('#'+div).append(html);
		}
		if(data.length==0){
			$('#'+div).empty();
			var html='';
			html=html+'<p style="margin-left:40%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
		   $('#'+div).append(html);
		    //document.getElementById(div).innerHTML = "";
			// $('#more'+div).css('display','none');
		}else
		{
			 // $('#p_so_onload').css('display','none').siblings().css('display','block'); 
			var html = '';
			for(var i=0;i<data.length;i++){
			    if(data[i]['photo_url']=='unknown'){
				    data[i]['photo_url'] = "http://tp2.sinaimg.cn/1878376757/50/0/1";
				}
			   // html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
			    html = html + '<a target="_blank" href="/index/viewinformation/?uid='+data[i]['uid']+'" class="img-photo" title="'+data[i]['uname']+'    频数：'+data[i]['count']+'" style="margin-left:20px;margin-top:10px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i]['photo_url'] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
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
	url = '/attribute/new_user_social/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.identity);
}

function show_domain()
{
	url = '/attribute/new_user_social/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.domain);
}

function show_follower()
{
	url = '/info_person_social/follower/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.follower);
}
function show_attention()
{
	url ='/info_person_social/attention/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.attention);
}
function show_comment()
{
	url ='/info_person_social/comment/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.comment);
}
function show_be_comment()
{
	url ='/info_person_social/be_comment/?uid='+uid;
	viewinformation.call_sync_ajax_request(url,viewinformation.be_comment);
}

show_identity();
show_domain();

//被转发
show_follower();
//转发
show_attention();
//评论
show_comment();
// //被评论
show_be_comment();

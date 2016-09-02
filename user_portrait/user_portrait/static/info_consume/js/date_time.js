// var topic = 'aoyunhui';
// var start_ts = 1468426500;
// var end_ts = 1468459800;
// var pointInterval = 3600;

var topic = 'aoyunhui';
var start_ts = 1468426500;
var end_ts = 1468442700;
var pointInterval = 3600;
var sort_item = 'timestamp';


// var topic = $('#topic_text').text();
// //var start_ts = set_timestamp().start_timestamp_return; 
// //var end_ts = set_timestamp().end_timestamp_return;
// var start_ts,end_ts,pointInterval;

// function set_timestamp(){
// 	var start_time_new = get_timestamp().start_return;
// 	var end_time_new = get_timestamp().end_return; 
// 	var start_timestamp = datetime_to_timestamp(start_time_new);
// 	var end_timestamp = datetime_to_timestamp(end_time_new);
	
// 	start_ts = start_timestamp;
// 	end_ts = end_timestamp;

// 	Draw_time_trend_line_result();
// }


// function get_timestamp(){
// 	var start_time = $('#datetimepicker1_input').val(); 
// 	var end_time = $('#datetimepicker2_input').val();
// 	return {
// 		start_return:start_time,
// 		end_return:end_time
// 	};
// }


// function datetime_to_timestamp(datetime) {
//  		var date_time_string = datetime;
//  		var date_time_array =date_time_string.split(/[/: ]/);
//  		var date_array_new = [date_time_array[2],date_time_array[0],date_time_array[1]];
//  		if (date_time_array[5] == 'PM'){
//  			date_time_array[3] = parseInt(date_time_array[3])+12;  //替换元素，小时数字加12
//  		}
//  		var time_array_new = [date_time_array[3],date_time_array[4],'00'];
//  		var timestamp_date_str = date_array_new.join('/');
//  		var timestamp_time_str = time_array_new.join(':');
//  		var timestamp_time_array = [timestamp_date_str,timestamp_time_str]
//  		var timestamp_str = timestamp_time_array.join(' ');
//  		var timestamp = (new Date(timestamp_str)).getTime()/1000;
//  		return timestamp;
// 	}


// function get_per_time(val) {
// 	pointInterval = val;
// 	set_timestamp();
// }


function set_order_type(type){
	if(type=='time'){
		sort_item = 'timestamp';
		Draw_blog_scan_area_order_result();

	}else if(type=='hot'){
		sort_item = 'retweeted';
		Draw_blog_scan_area_order_result();
	}
}

// function loading_more(){
// 	loading_more.innerHTML = '<div class="loading"></div>';
// }





function topic_analysis_time(){
 
}

topic_analysis_time.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },

// //设置ajax访问后台填充折线图

  Draw_time_trend_line: function(data){
 	
 	var x_item = [];
 	var y_item_origin = [];
	var y_item_forwarding = [];
	var y_item_comment = [];
 	for (var key in data){
 		//console.log(key);
		//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
		key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		//console.log(key_datetime);
		x_item.push(key_datetime);	
		y_item_origin.push(data[key][1]);
		y_item_forwarding.push(data[key][2]);
		y_item_comment.push(data[key][3]);
	}

 	var myChart = echarts.init(document.getElementById('main_time'));
	//Chart.showLoading({text: '正在努力的读取数据中...'  });
	var option = {
		tooltip : {
		    trigger: 'axis'
		},
		legend: {
		    data:['原创','评论','转发']
		},
		toolbox: {
			show : true,
			feature : {
			    mark : {show: true},
			    dataView : {show: true, readOnly: false},
			    magicType : {show: true, type: ['line', 'bar']},
			    restore : {show: true},
			    saveAsImage : {show: true}
		    }
		},
		calculable : true,
		xAxis : [
		    {
		    type : 'category',
		    boundaryGap : false,
		    data : x_item
		    //data: ['周一','周二','周三','周四','周五','周六','周日','周五','周六','周日']
		        }
		],
		yAxis : [
		    {
		    type : 'value',
		    axisLabel : {
		        formatter: '{value} 次'
		        }
		    }
		],
		series : [
		    {
		    name:'原创',
		    type:'line',
		    data:y_item_origin,
		    //data:[56,25,19,39,58,62,8,17,53,65],
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		    },
		    {
		    name:'评论',
		    type:'line',
		    data:y_item_comment,
		    //data:[21,0,3,20,30,36,4,8,31,11],
		    markPoint : {
		        data : [
		            {name : '最小值', value : -2, xAxis: 1, yAxis: -1.5}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name : '平均值'}
		        ]
		    }
		    },
		    {
		    name:'转发',
		    type:'line',
		    data:y_item_forwarding,
		    //data:[17,2,4,19,34,34,5,11,30,14],
		    markPoint : {
		    data : [
		        {type : 'max', name: '最大值'},
		        {type : 'min', name: '最小值'}
		    ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		    }
		]
    };
		myChart.setOption(option) ;   		
	
  },

  Draw_blog_scan_area: function(data){

  	//$('#blog_scan_area_time').empty();
    var item = data;
	var html = '';
		//var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
		//key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		//console.log(data.length);
		
		if (item.length == 0){
		html += '<div style="color:grey;">暂无数据</div>'
		}else{
			var num_page = parseInt(item.length/10)+1;  //num_page表示微博数据共有多少页
		
			for (i=0;i < Math.min(10,item.length);i++){
	
				if (item[i][1].photo_url=='unknown'){
					item[i][1].photo_url='../../static/info_consume/image/photo_unknown.png'
				}
				if (item[i][1].uname=='unknown'){
					item[i][1].uname='未知用户'
					//console.log(item[i][1].uname);
				}
				var item_timestamp_datetime = new Date(parseInt(item[i][1].timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
				html += '<div class="blog_time">';
				//html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
				html += '<div><img class="img-circle" src="'+item[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
				html +=	'<div>';
				//html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
				html += '<a target="_blank" href=" " class="user_name" style="float:left;">'+item[i][1].uname+'</a>';
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
				html += '</div>';
				html += '<div class="blog_text">'
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
				html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">'+item[i][1].text+'</font></p>';
				html += '<p style="float: left;width: 100%;position: relative;margin-top: 3%;margin-left: 3%;font-family: Microsoft YaHei;">';
				//html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
				//html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
				html += '<span style="float:left;margin-top: -3%;">'+item_timestamp_datetime+'</span>';
				//html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
				html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;|&nbsp;</span>';
				//html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >评论数('+item[i][1].comment+')</span>';
				html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
				//html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
				html += '</p>';
				html += '</div>';							 	
				html += '</div>';
			// }
			}

			html += '<div id="PageTurn" class="pager" style="margin-left:40%;">'
		    html += '<span >共<font id="P_RecordCount" style="color:#FF9900;">'+item.length+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		    html += '<span >第<font id="P_Index" style="color:#FF9900;"></font><font id="P_PageCount" style="color:#FF9900;">'+1+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		    html += '<span >每页<font id="P_PageSize" style="color:#FF9900;">'+10+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		    html += '<span id="S_First" class="disabled" >首页</span>'
		    html += '<span id="S_Prev"  class="disabled" >上一页</span>'
		    html += '<span id="S_navi"><!--页号导航--></span>'
		    html += '<span id="S_Next"  class="disabled" >下一页</span>'
		    html += '<span id="S_Last"  class="disabled" >末页</span>'
		    html += '<input id="Txt_GO" class="cssTxt" name="Txt_GO" type="text" size="1" style="width: 35px;height: 20px;"  /> '
		    html += '<span id="P_GO" >GO</span>'
			html += '</div>'
		
		}
		// html += '<ul class="pagination">'
		// html += '<li><a href="#">&laquo;</a></li>';
		// html += '<li class="active"><a href="#">1</a></li>';
		// html += '<li><a href="#">2</a></li>';
		// html += '<li><a href="#">3</a></li>';
		// html += '<li><a href="#">4</a></li>';
		// html += '<li><a href="#">5</a></li>';
		// html += '<li><a href="#">&raquo;</a></li>';
		// html += '</ul>';
		$('#blog_scan_area_time').append(html);
		
		
	
  },
				                    				
}


var topic_analysis_time = new topic_analysis_time();
 
function Draw_time_trend_line_result(){
    url = "/topic_time_analyze/mtype_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	console.log(url);
 	topic_analysis_time.call_sync_ajax_request(url,topic_analysis_time.Draw_time_trend_line);
}		

function Draw_blog_scan_area_order_result(){
    url_order = "/topic_time_analyze/time_order_weibos/?topic=" + topic + '&start_ts=' + start_ts + '&end_ts=' + end_ts + '&sort_item=' + sort_item;
 	//console.log('下面是微博排序url');
 	console.log(url_order);

 	topic_analysis_time.call_sync_ajax_request(url_order,topic_analysis_time.Draw_blog_scan_area);
}	


Draw_time_trend_line_result();
Draw_blog_scan_area_order_result();


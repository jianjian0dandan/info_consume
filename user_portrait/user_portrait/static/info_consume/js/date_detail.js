
var topic = $('#topic_text').text();
//var start_ts = set_timestamp().start_timestamp_return; 
//var end_ts = set_timestamp().end_timestamp_return;
var start_ts,end_ts,pointInterval;

function set_timestamp(){
	var start_time_new = get_timestamp().start_return;
	var end_time_new = get_timestamp().end_return; 
	var start_timestamp = datetime_to_timestamp(start_time_new);
	var end_timestamp = datetime_to_timestamp(end_time_new);
	
	start_ts = start_timestamp;
	end_ts = end_timestamp;

	Draw_time_trend_line_result();
}


function get_timestamp(){
	var start_time = $('#datetimepicker1_input').val(); 
	var end_time = $('#datetimepicker2_input').val();
	return {
		start_return:start_time,
		end_return:end_time
	};
}


function datetime_to_timestamp(datetime) {
 		var date_time_string = datetime;
 		var date_time_array =date_time_string.split(/[/: ]/);
 		var date_array_new = [date_time_array[2],date_time_array[0],date_time_array[1]];
 		if (date_time_array[5] == 'PM'){
 			date_time_array[3] = parseInt(date_time_array[3])+12;  //替换元素，小时数字加12
 		}
 		var time_array_new = [date_time_array[3],date_time_array[4],'00'];
 		var timestamp_date_str = date_array_new.join('/');
 		var timestamp_time_str = time_array_new.join(':');
 		var timestamp_time_array = [timestamp_date_str,timestamp_time_str]
 		var timestamp_str = timestamp_time_array.join(' ');
 		var timestamp = (new Date(timestamp_str)).getTime()/1000;
 		return timestamp;
	}


function get_per_time(val) {
	pointInterval = val;
	set_timestamp();
}
function topic_analysis(){
 
}

topic_analysis.prototype = {   //获取数据，重新画表
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
		key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		x_item.push(key_datetime);	
		y_item_origin.push(data[key][1]);
		y_item_forwarding.push(data[key][2]);
		y_item_comment.push(data[key][3]);
	}
 	var myChart = echarts.init(document.getElementById('main_time'));
	Chart.showLoading({text: '正在努力的读取数据中...'  });
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
				                    				
}


var topic_analysis = new topic_analysis();
 
function Draw_time_trend_line_result(){
    url = "/topic_analyze/mtype_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts'+end_ts+'&pointInterval'+pointInterval;
 	topic_analysis.call_sync_ajax_request(url,topic_analysis.Draw_time_trend_line);
}		




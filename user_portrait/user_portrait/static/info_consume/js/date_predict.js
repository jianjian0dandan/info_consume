

// var topic = 'aoyunhui';
// var start_ts = 1468426500;
// var end_ts = 1468459800;
var pointInterval = 3600;
var sort_item = 'timestamp';

// var topic = $('#topic_text').text();
//var start_ts = set_timestamp().start_timestamp_return; 
//var end_ts = set_timestamp().end_timestamp_return;
var start_ts,end_ts,pointInterval;

var no_page_time = 0;
var blog_num_max_global_time = 0;


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


function get_per_time_time(val) {
	pointInterval = val;
	//console.log(pointInterval);
	//set_timestamp();
	Draw_time_trend_line_result();
}


function set_order_type_time(type){
	if(type=='time'){
		sort_item = 'timestamp';
		Draw_blog_scan_area_order_result();

	}else if(type=='hot'){
		sort_item = 'retweeted';
		Draw_blog_scan_area_order_result();
	}
}



function topic_analysis_predict(){
 
}

topic_analysis_predict.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },

// //设置ajax访问后台填充折线图

  Draw_time_trend_line: function(data){
 	
 	var item = data;
 	var x_item = [];
 	var y_item_truth = [];
	var y_item_predict = [];
	
 	for (var key in item){
 		//console.log(key);
		//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
		key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		// key_datetime = format(parseInt(key).formate_data);
		//console.log(key_datetime);
		x_item.push(key_datetime);	
		y_item_truth.push(item[key]['1']);
		y_item_predict.push(item[key]['2']);
	}

	
 	var myChart = echarts.init(document.getElementById('main_predict'));
	//Chart.showLoading({text: '正在努力的读取数据中...'  });
	var option = {
		tooltip : {
		    trigger: 'axis'
		},
		legend: {
		    data:['真值','预测值']
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
		    name:'真值',
		    type:'line',
		    data:y_item_truth,
		   
		    },
		    {
		    name:'预测值',
		    type:'line',
		    data:y_item_predict,
		 
		    }
		]
    };
		myChart.setOption(option) ;   		
	
  },

				                    				
}


var topic_analysis_predict = new topic_analysis_predict();
 
function Draw_time_trend_line_result(){
	topic = topic_name_on_detail;
	start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
	end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());
	// var topic = 'aoyunhui';
	// var start_ts = 1468426500;
	// var end_ts = 1468459800;
	//console.log(end_ts);
	//console.log(pointInterval);
    url = "/topic_time_analyze/mtype_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	//console.log(url);
 	topic_analysis_predict.call_sync_ajax_request(url,topic_analysis_predict.Draw_time_trend_line);
}		

Draw_time_trend_line_result();








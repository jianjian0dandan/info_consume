var topic = 'aoyunhui';
var start_ts = 1468166400;
var end_ts = 1468949400;
var pointInterval=3600;
// var province = '陕西';


function topic_analysis_emotion(){
 
}

topic_analysis_emotion.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },

  Draw_emotion_trend_line:function(data){
  		var x_item = [];
	 	var y_item_pos = [];
		var y_item_neu = [];
		var y_item_neg = [];
	 	for (var key in data){
	 		//console.log(key);
			//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
			key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
			//console.log(key_datetime);
			x_item.push(key_datetime);	
			y_item_pos.push(data[key][1]);
			y_item_neu.push(data[key][2]);
			y_item_neg.push(data[key][3]);
		}
		console.log(y_item_pos);
		console.log(y_item_neu);
		console.log(y_item_neg);

  		var myChart = echarts.init(document.getElementById('main_emotion_1'));
 		var option = {
	    	tooltip : {
	        	trigger: 'axis'
	   		},
	    	legend: {
	        	data:['正向','中立','负向']
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
	            data : ['7月1日','7月2日','7月3日','7月4日','7月5日','7月6日','7月7日','7月8日','7月9日','7月10日']
	        }
	    	],
	    	yAxis : [
	        {
	            type : 'value',
	            axisLabel : {
	                formatter: '{value} °C'
	            }
	        }
	    	],
	    	series : [
	        {
	            name:'原创',
	            type:'line',
	            data:[11, 11, 15, 13, 12, 13, 10, 9, 6, 7],
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
	            data:[1, -2, 2, 5, 3, 2, 0, 4, 2, 1],
	            markPoint : {
	                data : [
	                    {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
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
	            data:[9, 10, 5, 10, 15, 11, 14, 10, 6, 8],
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


function Draw_emotion_trend_line_result(){
	url = "/topic_sen_analyze/sen_time_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_trend_line);
}

Draw_emotion_trend_line_result();

function topic_analysis(){
  this.ajax_method = 'GET';
}

topic_analysis.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url, method, callback){
    $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      async: false,
      success:callback
    });
  },

//设置ajax访问后台填充折线图
 Draw_time_trend_line: function(data){
 	var topic = $('#topic_text').text();
 	var start_ts = '';
 	var end_ts = '';
 	function getValue_time() {
		var start_ts = $('#datetimepicker1').val(); 
 		var end_ts = $('#datetimepicker2').val();
 		//console.log(start_ts.time());
	}
 	var pointInterval = $()
 	var num_origin = 0;
 	var num_forwarding = 0;
 	var num_comment = 0;
 	if (data[3]==-1){
 		num_origin +=1;
 	}else if (data[3]==-2){
 		num_forwarding +=1;
 	}else if (data[3]==-3){
 		num_comment +=1;
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
		    data : ['周一','周二','周三','周四','周五','周六','周日']
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
		    data:[11, 11, 15, 13, 12, 13, 10],
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
		    data:[1, -2, 2, 5, 3, 2, 0],
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
		    data:[9, 10, 5, 10, 15, 11, 14],
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
	
}


function Draw_time_trend_line_result(){
    url = "/topic_analyze/mtype_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts'+end_ts+'&pointInterval'+pointInterval;
 	topic_analysis.call_sync_ajax_request(url,topic_analysis.ajax_method,topic_analysis.Draw_time_trend_line);
}		

Draw_time_trend_line_result();




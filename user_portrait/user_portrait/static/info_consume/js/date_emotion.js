var topic = 'aoyunhui';
var start_ts = 1468166400;
// var start_ts = 1468944000;
var end_ts = 1468949400;
// var end_ts = 1471622400;
var pointInterval=3600;
var case_val = 1;
var province = '陕西';


function get_emotion_type(val) {
 	case_val = val;
 	$('#main_emotion_2').empty();
  	$('#top15_content_emotion').empty();
 	Draw_emotion_map_result();
 	//可以设置默认值（正向），随着页面加载。
 }


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
			y_item_neu.push(data[key][0]);
			y_item_neg.push(data[key][2]);
		}
		
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
	            name:'正向',
	            type:'line',
	            data:y_item_pos,
	            
	        },
	        {
	            name:'中立',
	            type:'line',
	            data:y_item_neu,
	            
	        },
	      	{
	            name:'负向',
	            type:'line',
	            data:y_item_neg,
	        
	        }
	    ]
	};
		myChart.setOption(option) ;     


  },

  Draw_emotion_map:function(data){
  		
		var item = data;
	 	var item_json = [];
	 	var item_province_json_pos = [];
	 	var item_province_json_neu = [];
	 	var item_province_json_neg = [];
	 	var item_city_json_pos = [];
	 	var item_city_json_neu = [];
	 	var item_city_json_neg = [];
	 	var item_city_json_pos_new=[];
	 	var item_city_json_neu_new=[];
	 	var item_city_json_neg_new=[];
	 	var item_json_pos = [];
	 	var item_json_neu = [];
	 	var item_json_neg = [];
	 	var html = '';


		console.log(item[0][1]);
		//正向情绪
		for(key in item[0]){
			for(i=0;i<item[0][key].length;i++){
				item_province_json_pos.push({name:item[0][key][i][0],value:item[0][key][i][1].total});

				for(key_val in item[0][key][i][1]){
		 			if(key_val=='total'){
		 				continue;
		 			}
		 			item_city_json_pos.push({name:key_val,value:item[0][key][i][1][key_val]});
		 			
		 		}
			}

		}
		for(k=0;k<item_city_json_pos.length;k++){
			if(item_city_json_pos[k].name=='unknown'){
			item_city_json_pos[k].name='未知';
			}
			item_city_json_pos_new.push({name:item_city_json_pos[k].name+'市',value:item_city_json_pos[k].value});
			// console.log(item_city_json[k].name);
			// console.log(item_city_json[k].value);
	 	}
	 			
		item_json_pos = item_province_json_pos.concat(item_city_json_pos_new);
		
		console.log(item_json_pos);


		//中立情绪
		for(key in item[1]){
			for(i=0;i<item[1][key].length;i++){
				item_province_json_neu.push({name:item[1][key][i][0],value:item[1][key][i][1].total});

				for(key_val in item[1][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_neu.push({name:key_val,value:item[1][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_neu.length;k++){
			if(item_city_json_neu[k].name=='unknown'){
			item_city_json_neu[k].name='未知';
			}
			item_city_json_neu_new.push({name:item_city_json_neu[k].name+'市',value:item_city_json_neu[k].value});
			// console.log(item_city_json[k].name);
			// console.log(item_city_json[k].value);
	 	}
	 			
		item_json_neu = item_province_json_neu.concat(item_city_json_neu_new);
		
		console.log(item_json_neu);

		//负向情绪
		for(key in item[2]){
			for(i=0;i<item[2][key].length;i++){
				item_province_json_neg.push({name:item[2][key][i][0],value:item[2][key][i][1].total});

				for(key_val in item[2][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_neg.push({name:key_val,value:item[2][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_neg.length;k++){
			if(item_city_json_neg[k].name=='unknown'){
			item_city_json_neg[k].name='未知';
			}
			item_city_json_neg_new.push({name:item_city_json_neg[k].name+'市',value:item_city_json_neg[k].value});
			// console.log(item_city_json[k].name);
			// console.log(item_city_json[k].value);
	 	}
	 			
		item_json_neg = item_province_json_neg.concat(item_city_json_neg_new);
		
		// console.log(item_json_neg);
		
		
		if(case_val == 1){
			item_legend = '正向';
			item_item = item_json_pos;
			item_item_rank = item_province_json_pos;

		}else if (case_val == 2){
			item_legend = '中立';
			item_item = item_json_neu;
			item_item_rank = item_province_json_neu;

		}else if(case_val == 3){
			item_legend = '负向';
			item_item = item_json_neg;
			item_item_rank = item_province_json_neg;

		}


	 	var myChart = echarts.init(document.getElementById('main_emotion_2'));

		require(
				[
					'echarts',
					'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					var ecConfig = require('echarts/config'); //放进require里的function{}里面
					var zrEvent = require('zrender/tool/event');
							
					// 基于准备好的dom，初始化echarts图表
					var myChart = echarts.init(document.getElementById('main_emotion_2'));
					var curIndx = 0;
					var mapType = [
						    'china',
						    // 23个省
						    '广东', '青海', '四川', '海南', '陕西', 
						    '甘肃', '云南', '湖南', '湖北', '黑龙江',
						    '贵州', '山东', '江西', '河南', '河北',
						    '山西', '安徽', '福建', '浙江', '江苏', 
						    '吉林', '辽宁', '台湾',
						    // 5个自治区
						    '新疆', '广西', '宁夏', '内蒙古', '西藏', 
						    // 4个直辖市
						    '北京', '天津', '上海', '重庆',
						    // 2个特别行政区
						    '香港', '澳门'
						];
					document.getElementById('main_emotion_2').onmousewheel = function (e){
					    var event = e || window.event;
					    curIndx += zrEvent.getDelta(event) > 0 ? (-1) : 1;
					    if (curIndx < 0) {
					        curIndx = mapType.length - 1;
					    }
					    var mt = mapType[curIndx % mapType.length];
					    if (mt == 'china') {
					        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
					    }
					    else{
					        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
					    }
					    option.series[0].mapType = mt;
					    option.title.subtext = mt + ' （滚轮或点击切换）';
					    myChart.setOption(option, true);
					    
					    zrEvent.stop(event);
					};
					myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
					    var len = mapType.length;
					    var mt = mapType[curIndx % len];
					    if (mt == 'china') {
					        // 全国选择时指定到选中的省份
					        var selected = param.selected;
					        for (var i in selected) {
					            if (selected[i]) {
					                mt = i;
					                while (len--) {
					                    if (mapType[len] == mt) {
					                        curIndx = len;
					                    }
					                }
					                break;
					            }
					        }
					        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
					    }
					    else {
					        curIndx = 0;
					        mt = 'china';
					        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
					    }
					    option.series[0].mapType = mt;
					    option.title.subtext = mt + ' （滚轮或点击切换）';
					    myChart.setOption(option, true);
					});
					var option = {
					    title: {
					        text : '全国34个省市自治区',
					        subtext : 'china （滚轮或点击切换）'
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: '滚轮切换或点击进入该省<br/>{b}'
					    },
					    dataRange: {
					        min: 0,
					        max: 1000,
					        color:['orange','yellow'],
					        text:['高','低'],           // 文本，默认为数值文本
					        calculable : true
					    },
					    series : [
					        {
					            name: '随机数据',
					            type: 'map',
					            mapType: 'china',
					            selectedMode : 'single',
					            itemStyle:{
					                normal:{label:{show:true}},
					                emphasis:{label:{show:true}}
					            },
					            data:item_item
					
					        }
					    ]
					};
			 		
			 		
			                myChart.setOption(option);     
						
		}
		)	

		// console.log(item_item);
		item_item_rank.sort(function(a,b){
            return b.value-a.value});
		var rank_html = '';
		rank_html += '<table id="table" style="table-layout:fixed">';
        for(var k=0;k<Math.min(15,item_item_rank.length);k++){
			
    //         if (item_item[k].name=='unknown'){
				// 	item_item[k].name='地域不详'
				// }
            
			rank_html += '<tr>';	
			rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
			rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_item_rank[k].name+'</td>';
			rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_item_rank[k].value+'</td>';			
			rank_html += '</tr>';		
			
			
            }
            $('#top15_content_emotion').append(rank_html);

  },

  Draw_blog_scan_area_emotion:function(data){
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
		
		$('#blog_scan_area_emotion').append(html);
		
  },
}

var topic_analysis_emotion = new topic_analysis_emotion();

function Draw_emotion_trend_line_result(){
	url = "/topic_sen_analyze/sen_time_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_trend_line);
}

function Draw_emotion_map_result(){

	var start_ts=1468944000;
	var end_ts=1471622400;

	console.log(start_ts);
	console.log(end_ts);

    url = "/topic_sen_analyze/sen_province_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_map);
}

function Draw_blog_scan_area_emotion_result(){
    url = "/topic_sen_analyze/sen_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval+'&province='+province;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_blog_scan_area_emotion);
}		



Draw_emotion_trend_line_result();
Draw_emotion_map_result();
Draw_blog_scan_area_emotion_result();

// var topic = 'aoyunhui';
// var start_ts = 1468166400;
// var end_ts = 1468949400;
var pointInterval=3600;
var case_val = 1;

var sort_item_emotion = 'timestamp';
var sen = 1;

var no_page_emotion = 0;
var blog_num_max_global_emotion = 0;

function get_emotion_type(val) {
 	case_val = val;
 	$('#main_emotion_2').empty();
  	$('#top15_content_emotion').empty();
 	Draw_emotion_map_result();
 	//可以设置默认值（正向），随着页面加载。
 }


function set_order_type_emotion(type){
	if(type=='time'){
		sort_item_emotion = 'timestamp';
		Draw_blog_scan_area_emotion_result();

	}else if(type=='hot'){
		sort_item_emotion = 'retweeted';
		Draw_blog_scan_area_emotion_result();
	}
}

function get_per_time_emotion(val) {
	pointInterval = val;
	// console.log(pointInterval);
	
	Draw_emotion_trend_line_result();
}


function set_emotion_type(type){
	if(type=='0'){
		sen=0;
		Draw_blog_scan_area_emotion_result();

	}else if(type=='1'){
		sen=1;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='2'){
		sen=2;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='3'){
		sen=3;
		Draw_blog_scan_area_emotion_result();

	}else if(type=='4'){
		sen=4;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='5'){
		sen=5;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='6'){
		sen=6;
		Draw_blog_scan_area_emotion_result();
	}
}


//上一页
function up_emotion(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_emotion==0){
         alert("当前已经是第一页!");
         return false;
     }else{
 		no_page_emotion--;
 		// console.log(no_page_emotion);
 		// console.log('执行了上一页操作');
 		Draw_blog_scan_area_emotion_result();
 		
     }
}
//下一页
function down_emotion(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_emotion==Math.min(9,Math.ceil(blog_num_max_global_emotion/10)-1)){
         alert("当前已经是最后一页!");
         // console.log(no_page_emotion);
         return false;
     }else{
 		no_page_emotion++;
 		// console.log(no_page_emotion);
 		// console.log('执行了下一页操作');
 		Draw_blog_scan_area_emotion_result();
 		
     }
}

function first_emotion(){
   
     no_page_emotion=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_emotion_result();
}
//下一页
function last_emotion(){
     
     no_page_emotion=(Math.ceil(blog_num_max_global_emotion/10)-1);
    
     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_emotion_result();
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
  		// $('#main_emotion_1').empty();
  		var x_item = [];
	 	var y_item_pos = [];
		var y_item_neu = [];
		var y_item_angry = [];
		var y_item_anxiety = [];
		var y_item_sad = [];
		var y_item_hate = [];
		var y_item_otherneg = [];
		// console.log(data);

	 	for (var key in data){
	 		
			//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
			key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
			//console.log(key_datetime);
			x_item.push(key_datetime);	
			y_item_pos.push(data[key][1]);
			y_item_neu.push(data[key][0]);
			y_item_angry.push(data[key][2]);
			y_item_anxiety.push(data[key][3]);
			y_item_sad.push(data[key][4]);
			y_item_hate.push(data[key][5]);
			y_item_otherneg.push(data[key][6]);
		}
		
  		var myChart = echarts.init(document.getElementById('main_emotion_1'));
 		var option = {
	    	tooltip : {
	        	trigger: 'axis'
	   		},
	    	legend: {
	        	data:['积极','中立','生气','焦虑','悲伤','厌恶','消极其他']
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
		            name:'积极',
		            type:'line',
		            data:y_item_pos,
		            
		        },
		        {
		            name:'中立',
		            type:'line',
		            data:y_item_neu,
		            
		        },
		        {
		            name:'生气',
		            type:'line',
		            data:y_item_angry,
		            
		        },
		        {
		            name:'焦虑',
		            type:'line',
		            data:y_item_anxiety,
		            
		        },
		      	{
		            name:'悲伤',
		            type:'line',
		            data:y_item_sad,
		        
		        },
		        {
		            name:'厌恶',
		            type:'line',
		            data:y_item_hate,
		        
		        },
		      	{
		            name:'消极其他',
		            type:'line',
		            data:y_item_otherneg,
		        
		        }
	        ]
	    };
		myChart.setOption(option);     

  },

  Draw_emotion_map:function(data){
  		$('#main_emotion_2').empty();
  		$('#top15_content_emotion').empty();
		var item = data;
	 	var item_json = [];
	 	var item_province_json_pos = [];
	 	var item_province_json_neu = [];
	 	var item_province_json_otherneg = [];
	 	var item_province_json_angry = [];
	 	var item_province_json_anxiety = [];
	 	var item_province_json_sad = [];
	 	var item_province_json_hate = [];

	 	var item_city_json_pos = [];
	 	var item_city_json_neu = [];
	 	var item_city_json_otherneg = [];
	 	var item_city_json_angry = [];
	 	var item_city_json_anxiety = [];
	 	var item_city_json_sad = [];
	 	var item_city_json_hate = [];

	 	var item_city_json_pos_new=[];
	 	var item_city_json_neu_new=[];
	 	var item_city_json_otherneg_new = [];
	 	var item_city_json_angry_new = [];
	 	var item_city_json_anxiety_new = [];
	 	var item_city_json_sad_new = [];
	 	var item_city_json_hate_new = [];

	 	var item_json_pos = [];
	 	var item_json_neu = [];
	 	var item_json_otherneg = [];
	 	var item_json_angry = [];
	 	var item_json_anxiety = [];
	 	var item_json_sad = [];
	 	var item_json_hate = [];
	 	var html = '';
	 	


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
			
	 	}
	 			
		item_json_pos = item_province_json_pos.concat(item_city_json_pos_new);
		

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
		
	 	}
	 			
		item_json_neu = item_province_json_neu.concat(item_city_json_neu_new);
		

		//焦虑情绪
		for(key in item[2]){
			for(i=0;i<item[2][key].length;i++){
				item_province_json_anxiety.push({name:item[2][key][i][0],value:item[2][key][i][1].total});

				for(key_val in item[2][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_anxiety.push({name:key_val,value:item[2][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_anxiety.length;k++){
			if(item_city_json_anxiety[k].name=='unknown'){
			item_city_json_anxiety[k].name='未知';
			}
			item_city_json_anxiety_new.push({name:item_city_json_anxiety[k].name+'市',value:item_city_json_anxiety[k].value});
			
	 	}
	 			
		item_json_anxiety = item_province_json_anxiety.concat(item_city_json_anxiety_new);
		

		//生气情绪
		for(key in item[3]){
			for(i=0;i<item[3][key].length;i++){
				item_province_json_angry.push({name:item[3][key][i][0],value:item[3][key][i][1].total});

				for(key_val in item[3][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_angry.push({name:key_val,value:item[3][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_angry.length;k++){
			if(item_city_json_angry[k].name=='unknown'){
			item_city_json_angry[k].name='未知';
			}
			item_city_json_angry_new.push({name:item_city_json_angry[k].name+'市',value:item_city_json_angry[k].value});
		
	 	}
	 			
		item_json_angry = item_province_json_angry.concat(item_city_json_angry_new);
		

		//厌恶情绪
		for(key in item[4]){
			for(i=0;i<item[4][key].length;i++){
				item_province_json_hate.push({name:item[4][key][i][0],value:item[4][key][i][1].total});

				for(key_val in item[4][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_hate.push({name:key_val,value:item[4][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_hate.length;k++){
			if(item_city_json_hate[k].name=='unknown'){
			item_city_json_hate[k].name='未知';
			}
			item_city_json_hate_new.push({name:item_city_json_hate[k].name+'市',value:item_city_json_hate[k].value});
			
	 	}
	 			
		item_json_hate = item_province_json_hate.concat(item_city_json_hate_new);
		
		//悲伤情绪
		for(key in item[5]){
			for(i=0;i<item[5][key].length;i++){
				item_province_json_sad.push({name:item[5][key][i][0],value:item[5][key][i][1].total});

				for(key_val in item[5][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_sad.push({name:key_val,value:item[5][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_sad.length;k++){
			if(item_city_json_sad[k].name=='unknown'){
			item_city_json_sad[k].name='未知';
			}
			item_city_json_sad_new.push({name:item_city_json_sad[k].name+'市',value:item_city_json_sad[k].value});
			
	 	}
	 			
		item_json_sad = item_province_json_sad.concat(item_city_json_sad_new);
		

		//消极其他情绪
		for(key in item[6]){
			for(i=0;i<item[6][key].length;i++){
				item_province_json_otherneg.push({name:item[6][key][i][0],value:item[6][key][i][1].total});

				for(key_val in item[6][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_otherneg.push({name:key_val,value:item[6][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_otherneg.length;k++){
			if(item_city_json_otherneg[k].name=='unknown'){
			item_city_json_otherneg[k].name='未知';
			}
			item_city_json_otherneg_new.push({name:item_city_json_otherneg[k].name+'市',value:item_city_json_otherneg[k].value});
			
	 	}
	 			
		item_json_otherneg = item_province_json_otherneg.concat(item_city_json_otherneg_new);
		


		//选择各种情绪
		if(case_val == 1){
			item_legend = '正向';
			item_item = item_json_pos;
			item_item_rank = item_province_json_pos;

		}else if (case_val == 0){
			item_legend = '中立';
			item_item = item_json_neu;
			item_item_rank = item_province_json_neu;

		}else if(case_val == 2){
			item_legend = '生气';
			item_item = item_json_angry;
			item_item_rank = item_province_json_angry;

		}else if (case_val == 3){
			item_legend = '焦虑';
			item_item = item_json_anxiety;
			item_item_rank = item_province_json_anxiety;

		}else if(case_val == 4){
			item_legend = '悲伤';
			item_item = item_json_sad;
			item_item_rank = item_province_json_sad;

		}else if (case_val == 5){
			item_legend = '厌恶';
			item_item = item_json_hate;
			item_item_rank = item_province_json_hate;

		}else if(case_val == 6){
			item_legend = '消极其他';
			item_item = item_json_otherneg;
			item_item_rank = item_province_json_otherneg;

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
			
			rank_html += '<tr>';	
			rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
			rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_item_rank[k].name+'</td>';
			rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_item_rank[k].value+'</td>';			
			rank_html += '</tr>';		
        }
        $('#top15_content_emotion').append(rank_html);

  },

  Draw_blog_scan_area_emotion:function(data){
  	$('#blog_scan_area_emotion').empty();
  	var item = data;
	var html = '';
		//var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
		//key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		//console.log(data.length);
		var blog_num_max_local_emotion = Math.min(100,item.length);
		
		blog_num_max_global_emotion = blog_num_max_local_emotion;

		if (item.length == 0){
			html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
		}else{
			var num_page = Math.ceil(blog_num_max_local_emotion/10);  //num_page表示微博数据共有多少页
			var item_i_emotion = no_page_emotion*10;
			
			var max_i_emotion = item_i_emotion+Math.min(10,blog_num_max_local_emotion-item_i_emotion);
			
			for (i=item_i_emotion; i<max_i_emotion; i++){

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
				html += '<a target="_blank" href="/index/viewinformation/?uid='+item[i][1].uid+'" class="user_name" style="float:left;">'+item[i][1].uname+'</a>';
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
				html += '</div>';
				html += '<div class="blog_text">'
				//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
				html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 6%;font-family: Microsoft YaHei;"><font color="black">'+item[i][1].text+'</font></p>';
				html += '<p style="float: left;width: 100%;position: relative;margin-top: 3%;margin-left: 3%;font-family: Microsoft YaHei;">';
				//html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
				//html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
				html += '<span style="float:left;margin-top: -3%;margin-left: 3%;">'+item_timestamp_datetime+'</span>';
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
			html += '<div id="PageTurn" class="pager" style="margin-left:46.5%;height: 40px;margin-bottom: -20px;z-index: 99;">'
	        html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
	        html += '</div>'
			// html += '<div id="PageTurn" class="pager" style="margin-left:40%;">'
		 //    html += '<span >共<font id="P_RecordCount" style="color:#FF9900;">'+item.length+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		 //    html += '<span >第<font id="P_Index" style="color:#FF9900;"></font><font id="P_PageCount" style="color:#FF9900;">'+1+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		 //    html += '<span >每页<font id="P_PageSize" style="color:#FF9900;">'+10+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		 //    html += '<span id="S_First" class="disabled" onmouseover="first()">首页</span>'
		 //    html += '<span id="S_Prev"  class="disabled" onmouseover="up()">上一页</span>'
		 //    html += '<span id="S_navi"><!--页号导航--></span>'
		 //    html += '<span id="S_Next"  class="disabled" onmouseover="down()">下一页</span>'
		 //    html += '<span id="S_Last"  class="disabled" onmouseover="last()">末页</span>'
		 //    html += '<input id="Txt_GO" class="cssTxt" name="Txt_GO" type="text" size="1" style="width: 35px;height: 20px;"  /> '
		 //    html += '<span id="P_GO" >GO</span>'
			// html += '</div>'
		
		}
		
		
		$('#blog_scan_area_emotion').append(html);
		
  },
}

var topic_analysis_emotion = new topic_analysis_emotion();

function Draw_emotion_trend_line_result(){
	// start_ts = 1468166400;
 // 	end_ts = 1468949400;

 	topic = topic_name_on_detail;
    start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
    end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

	url = "/topic_sen_analyze/sen_time_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_trend_line);
}

function Draw_emotion_map_result(){

	// start_ts=1468944000;
	// end_ts=1471622400;

	topic = topic_name_on_detail;
  	start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  	end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

    url = "/topic_sen_analyze/sen_province_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_map);
}

function Draw_blog_scan_area_emotion_result(){
	// start_ts = 1468166400;
 // 	end_ts = 1468949400;
    topic = topic_name_on_detail;
    start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
    end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

    url = "/topic_sen_analyze/sen_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&sort_item='+sort_item_emotion+'&sen='+sen;
 	console.log(url);
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_blog_scan_area_emotion);
}		

// function emotion_load(){
	Draw_emotion_trend_line_result();
	Draw_emotion_map_result();
	Draw_blog_scan_area_emotion_result();
// }



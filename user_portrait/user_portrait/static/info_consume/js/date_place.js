
var topic = 'aoyunhui';
//var start_ts = 1468166400;
var start_ts = 1468474200;
//var end_ts = 1468170900;
var end_ts = 1468495800;
var province = '北京';
var sort_item = 'timestamp';
var no_page_place = 0;
var blog_num_max_global_place = 0;


// var topic = $('#topic_text').text();
// var start_ts = set_timestamp().start_timestamp_return; 
// var end_ts = set_timestamp().end_timestamp_return;
// var start_ts,end_ts,pointInterval;


// function set_timestamp(){
// 	var start_time_new = get_timestamp().start_return;
// 	var end_time_new = get_timestamp().end_return; 
// 	var start_timestamp = datetime_to_timestamp(start_time_new);
// 	var end_timestamp = datetime_to_timestamp(end_time_new);
	
// 	start_ts = start_timestamp;
// 	end_ts = end_timestamp;

// 	Draw_geo_map_result();
// }


// function get_timestamp(){
// 	var start_time = $('#datetimepicker3_input').val(); 
// 	var end_time = $('#datetimepicker4_input').val();
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

//应该直接排序，然后再取前十名，不应该求最大值，然后将其删除再取最大值。



function set_order_type_place(type){
	if(type=='time'){
		sort_item = 'timestamp';
		Draw_blog_scan_area_place_result();

	}else if(type=='hot'){
		sort_item = 'retweeted';
		Draw_blog_scan_area_place_result();
	}
}


//上一页
function up_place(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_place==0){
         alert("当前已经是第一页!");
         return false;
     }else{
 		no_page_place--;
 		//console.log(no_page_place);
 		//console.log('执行了上一页操作');
 		Draw_blog_scan_area_place_result();
 		
     }
}
//下一页
function down_place(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_place==Math.min(9,Math.ceil(blog_num_max_global_place/10)-1)){
         alert("当前已经是最后一页!");
         //console.log(no_page_place);
         return false;
     }else{
 		no_page_place++;
 		//console.log(no_page_place);
 		//console.log('执行了下一页操作');
 		Draw_blog_scan_area_place_result();
 		
     }
}

function first_place(){
   
     no_page_place=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_place_result();
}
//下一页
function last_place(){
     
     no_page_place=(Math.ceil(blog_num_max_global_place/10)-1);
    
     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_place_result();
}




function set_place_type(type){
	if(type=='北京'){
		province = '北京';
		Draw_blog_scan_area_place_result();
	}else if(type=='天津'){
		province = '天津';
		Draw_blog_scan_area_place_result();
	}else if(type=='上海'){
		province = '上海';
		Draw_blog_scan_area_place_result();
	}else if(type=='重庆'){
		province = '重庆';
		Draw_blog_scan_area_place_result();
	}else if(type=='黑龙江'){
		province = '黑龙江';
		Draw_blog_scan_area_place_result();
	}else if(type=='吉林'){
		province = '吉林';
		Draw_blog_scan_area_place_result();
	}else if(type=='辽宁'){
		province = '辽宁';
		Draw_blog_scan_area_place_result();
	}else if(type=='四川'){
		province = '四川';
		Draw_blog_scan_area_place_result();
	}else if(type=='河北'){
		province = '河北';
		Draw_blog_scan_area_place_result();
	}else if(type=='新疆'){
		province = '新疆';
		Draw_blog_scan_area_place_result();
	}else if(type=='甘肃'){
		province = '甘肃';
		Draw_blog_scan_area_place_result();
	}else if(type=='青海'){
		province = '青海';
		Draw_blog_scan_area_place_result();
	}else if(type=='陕西'){
		province = '陕西';
		Draw_blog_scan_area_place_result();
	}else if(type=='宁夏'){
		province = '宁夏';
		Draw_blog_scan_area_place_result();
	}else if(type=='河南'){
		province = '河南';
		Draw_blog_scan_area_place_result();
	}else if(type=='山东'){
		province = '山东';
		Draw_blog_scan_area_place_result();
	}else if(type=='山西'){
		province = '山西';
		Draw_blog_scan_area_place_result();
	}else if(type=='安徽'){
		province = '安徽';
		Draw_blog_scan_area_place_result();
	}else if(type=='湖北'){
		province = '湖北';
		Draw_blog_scan_area_place_result();
	}else if(type=='湖南'){
		province = '湖南';
		Draw_blog_scan_area_place_result();
	}else if(type=='江苏'){
		province = '江苏';
		Draw_blog_scan_area_place_result();
	}else if(type=='内蒙古'){
		province = '内蒙古';
		Draw_blog_scan_area_place_result();
	}else if(type=='贵州'){
		province = '贵州';
		Draw_blog_scan_area_place_result();
	}else if(type=='云南'){
		province = '云南';
		Draw_blog_scan_area_place_result();
	}else if(type=='广西'){
		province = '广西';
		Draw_blog_scan_area_place_result();
	}else if(type=='西藏'){
		province = '西藏';
		Draw_blog_scan_area_place_result();
	}else if(type=='浙江'){
		province = '浙江';
		Draw_blog_scan_area_place_result();
	}else if(type=='江西'){
		province = '江西';
		Draw_blog_scan_area_place_result();
	}else if(type=='广东'){
		province = '广东';
		Draw_blog_scan_area_place_result();
	}else if(type=='福建'){
		province = '福建';
		Draw_blog_scan_area_place_result();
	}else if(type=='海南'){
		province = '海南';
		Draw_blog_scan_area_place_result();
	}else if(type=='香港'){
		province = '香港';
		Draw_blog_scan_area_place_result();
	}else if(type=='澳门'){
		province = '澳门';
		Draw_blog_scan_area_place_result();
	}else if(type=='台湾'){
		province = '台湾';
		Draw_blog_scan_area_place_result();
	}
}


function topic_analysis_place(){
 
}

topic_analysis_place.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },
	Draw_geo_map:function(data){
	 	$('#main_place').empty();
	 	$('#top15_content_place').empty();
	 	var item = data;
	 	var item_json = [];
	 	var item_province_json = [];
	 	var item_city_json = [];
	 	var item_city_json_new=[];
	 	var html = '';
	 	//console.log(item.length);
	 	for (i=0;i<item.length;i++){		
	 		item_province_json.push({name:item[i][0],value:item[i][1].total});
	 		for(key in item[i][1]){
	 			if(key=='total'){
	 				continue;
	 			}
	 			item_city_json.push({name:key,value:item[i][1][key]});
	 			
	 		}
		}
		for(k=0;k<item_city_json.length;k++){
			if(item_city_json[k].name=='unknown'){
			item_city_json[k].name='未知';
			}
			item_city_json_new.push({name:item_city_json[k].name+'市',value:item_city_json[k].value});
			// console.log(item_city_json[k].name);
			// console.log(item_city_json[k].value);
	 	}
	 			
		item_json = item_province_json.concat(item_city_json_new);
		// console.log(item_province_json);
		// console.log(item_city_json_new);
		// console.log(item_json);
        item_province_json.sort(function(a,b){
            return b.value-a.value});

	 	var myChart = echarts.init(document.getElementById('main_place'));

		require(
				[
					'echarts',
					'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					var ecConfig = require('echarts/config'); //放进require里的function{}里面
					var zrEvent = require('zrender/tool/event');
							
					// 基于准备好的dom，初始化echarts图表
					//var myChart = ec.init(document.getElementById('main')); 
					var myChart = echarts.init(document.getElementById('main_place'));
					// 过渡---------------------
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
					document.getElementById('main_place').onmousewheel = function (e){
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
					        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}:{c}';
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
					    legend: {
					        orient: 'vertical',
					        x:'right',
					        data:['微博数据']
					    },
					    dataRange: {
					        min: 0,
					        //max: 100,
					        max:item_province_json[0].value,
					        color:['orange','white'],
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
					            data:item_json
					
					        }
					    ]
					};
			 		
			 		
			                myChart.setOption(option);     
						
		}
		)	
		

		
		// console.log(item_json);
		var rank_html = '';
		rank_html += '<table id="table">';
        for(var k=0;k<Math.min(15,item_province_json.length);k++){
			
    //         if (item_province_json[k].name=='unknown'){
				// 	item_province_json[k].name='未知'
				// }
            		

			rank_html += '<tr>';	
			rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
			rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_province_json[k].name+'</td>';
			rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_province_json[k].value+'</td>';			
			rank_html += '</tr>';
			
            }
            $('#top15_content_place').append(rank_html);
	},

	// Draw_geo_map{}


	Draw_blog_scan_area_place: function(data){
		$('#blog_scan_area_place').empty();
  	//$('#blog_scan_area_time').empty();
     var item = data;
	 var html = '';
		//var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
		//key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		//console.log(data.length);
		var blog_num_max_local_place = Math.min(100,item.length);
		
		blog_num_max_global_place = blog_num_max_local_place;
		
		if (item.length == 0){
		html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
		}else{
			var num_page = Math.ceil(blog_num_max_local_place/10);  //num_page表示微博数据共有多少页
			var item_i_place = no_page_place*10;
			
			var max_i_place = item_i_place+Math.min(10,blog_num_max_local_place-item_i_place);
			
			for (i=item_i_place; i<max_i_place; i++){

				if (item[i][1].photo_url=='unknown'){
					item[i][1].photo_url='../../static/info_consume/image/photo_unknown.png'
				}
				if (item[i][1].uname=='unknown'){
					item[i][1].uname=item[i][1].uid
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
				html += '<span style="display: inline-block;margin-top: -3%;margin-left: 3%;">'+item_timestamp_datetime+'</span>';
				html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
				//html += '<span id="oule" style="margin-top: -3%;display: inline-block;margin-left: 54%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;&nbsp;&nbsp;&nbsp;|</span>';
				html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >评论数('+item[i][1].comment+')</span>';
				//html += '<span style="margin-top: -3%;display: inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
				//html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
				html += '</p>';
				html += '</div>';							 	
				html += '</div>';
			// }
			}
			   html += '<div id="PageTurn" class="pager" style="margin-left:46.5%;height: 40px;margin-bottom: -20px;z-index: 99;">'
		       html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
		       html += '</div>'

		
		}
		
		
		$('#blog_scan_area_place').append(html);
		
		
	
  	},

}



var topic_analysis_place = new topic_analysis_place();
 
function Draw_geo_map_result(){
	// var start_ts=1468944000;
	// var end_ts=1471622400;
	topic = topic_name_on_detail;
	start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
	end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());
    url = "/topic_geo_analyze/geo_weibo_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	//console.log(url);
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_geo_map);
}	

function Draw_blog_scan_area_place_result(){
	// start_ts = 1468474200;
	// end_ts = 1468495800;
	// console.log(province);
	topic = topic_name_on_detail;
	start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
	end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

    url = "/topic_geo_analyze/geo_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&province='+province+'&sort_item='+sort_item;
 	//console.log(url);
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_blog_scan_area_place);
}
function place_load(){
	Draw_geo_map_result();
	Draw_blog_scan_area_place_result();
}




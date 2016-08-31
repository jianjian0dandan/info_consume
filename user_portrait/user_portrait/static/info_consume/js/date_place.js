
var topic = 'aoyunhui';
var start_ts = 1468166400;
var end_ts = 1468170900;
var province = '陕西';
//var sort_item = 'timestamp';


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





function topic_analysis_place(){
 
}

topic_analysis_place.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },
	Draw_geo_map:function(data){

		// var topic = $('#topic_text').text();
		// var start_ts = (new Date($('#datetimepicker5').val())).getTime()/1000;
	 // 	var end_ts = $('#datetimepicker6').val();
	 // 	var pointInterval = $()
	 // 	var num_origin = 0; //原创
	 // 	var num_forwarding = 0;  //转发
	 // 	var num_comment = 0;  //评论
	 	var item = data;
	 	//console.log(item);
	 // 	var item = [];
	 // 	var y_item_origin = [];
		// var y_item_forwarding = [];
		// var y_item_comment = [];
	 	for (i=0;i<item.length;i++){
	 		console.log(item[i][1]);
			//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
			//key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
			//console.log(key_datetime);
			//x_item.push(key_datetime);

			// y_item_origin.push(data[key][1]);
			// y_item_forwarding.push(data[key][2]);
			// y_item_comment.push(data[key][3]);
		}


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
					    legend: {
					        orient: 'vertical',
					        x:'right',
					        data:['随机数据']
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
					            data:[
					                {name: '重庆市',value: Math.round(Math.random()*1000)},
					                {name: '北京市',value: Math.round(Math.random()*1000)},
					                {name: '天津市',value: Math.round(Math.random()*1000)},
					                {name: '上海市',value: Math.round(Math.random()*1000)},
					                {name: '香港',value: Math.round(Math.random()*1000)},
					                {name: '澳门',value: Math.round(Math.random()*1000)},
					                {name: '巴音郭楞蒙古自治州',value: Math.round(Math.random()*1000)},
					                {name: '和田地区',value: Math.round(Math.random()*1000)},
					                {name: '哈密地区',value: Math.round(Math.random()*1000)},
					                {name: '阿克苏地区',value: Math.round(Math.random()*1000)},
					                {name: '阿勒泰地区',value: Math.round(Math.random()*1000)},
					                {name: '喀什地区',value: Math.round(Math.random()*1000)},
					                {name: '塔城地区',value: Math.round(Math.random()*1000)},
					                {name: '昌吉回族自治州',value: Math.round(Math.random()*1000)},
					                {name: '克孜勒苏柯尔克孜自治州',value: Math.round(Math.random()*1000)},
					                {name: '吐鲁番地区',value: Math.round(Math.random()*1000)},
					                {name: '伊犁哈萨克自治州',value: Math.round(Math.random()*1000)},
					                {name: '博尔塔拉蒙古自治州',value: Math.round(Math.random()*1000)},
					                {name: '乌鲁木齐市',value: Math.round(Math.random()*1000)},
					                {name: '克拉玛依市',value: Math.round(Math.random()*1000)},
					                {name: '阿拉尔市',value: Math.round(Math.random()*1000)},
					                {name: '图木舒克市',value: Math.round(Math.random()*1000)},
					                {name: '五家渠市',value: Math.round(Math.random()*1000)},
					                {name: '石河子市',value: Math.round(Math.random()*1000)},
					                {name: '那曲地区',value: Math.round(Math.random()*1000)},
					                {name: '阿里地区',value: Math.round(Math.random()*1000)},
					                {name: '日喀则地区',value: Math.round(Math.random()*1000)},
					                {name: '林芝地区',value: Math.round(Math.random()*1000)},
					                {name: '昌都地区',value: Math.round(Math.random()*1000)},
					                {name: '山南地区',value: Math.round(Math.random()*1000)},
					                {name: '拉萨市',value: Math.round(Math.random()*1000)},
					                {name: '呼伦贝尔市',value: Math.round(Math.random()*1000)},
					                {name: '阿拉善盟',value: Math.round(Math.random()*1000)},
					                {name: '锡林郭勒盟',value: Math.round(Math.random()*1000)},
					                {name: '鄂尔多斯市',value: Math.round(Math.random()*1000)},
					                {name: '赤峰市',value: Math.round(Math.random()*1000)},
					                {name: '巴彦淖尔市',value: Math.round(Math.random()*1000)},
					                {name: '通辽市',value: Math.round(Math.random()*1000)},
					                {name: '乌兰察布市',value: Math.round(Math.random()*1000)},
					                {name: '兴安盟',value: Math.round(Math.random()*1000)},
					                {name: '包头市',value: Math.round(Math.random()*1000)},
					                {name: '呼和浩特市',value: Math.round(Math.random()*1000)},
					                {name: '乌海市',value: Math.round(Math.random()*1000)},
					                {name: '海西蒙古族藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '玉树藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '果洛藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '海南藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '海北藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '黄南藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '海东地区',value: Math.round(Math.random()*1000)},
					                {name: '西宁市',value: Math.round(Math.random()*1000)},
					                {name: '甘孜藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '阿坝藏族羌族自治州',value: Math.round(Math.random()*1000)},
					                {name: '凉山彝族自治州',value: Math.round(Math.random()*1000)},
					                {name: '绵阳市',value: Math.round(Math.random()*1000)},
					                {name: '达州市',value: Math.round(Math.random()*1000)},
					                {name: '广元市',value: Math.round(Math.random()*1000)},
					                {name: '雅安市',value: Math.round(Math.random()*1000)},
					                {name: '宜宾市',value: Math.round(Math.random()*1000)},
					                {name: '乐山市',value: Math.round(Math.random()*1000)},
					                {name: '南充市',value: Math.round(Math.random()*1000)},
					                {name: '巴中市',value: Math.round(Math.random()*1000)},
					                {name: '泸州市',value: Math.round(Math.random()*1000)},
					                {name: '成都市',value: Math.round(Math.random()*1000)},
					                {name: '资阳市',value: Math.round(Math.random()*1000)},
					                {name: '攀枝花市',value: Math.round(Math.random()*1000)},
					                {name: '眉山市',value: Math.round(Math.random()*1000)},
					                {name: '广安市',value: Math.round(Math.random()*1000)},
					                {name: '德阳市',value: Math.round(Math.random()*1000)},
					                {name: '内江市',value: Math.round(Math.random()*1000)},
					                {name: '遂宁市',value: Math.round(Math.random()*1000)},
					                {name: '自贡市',value: Math.round(Math.random()*1000)},
					                {name: '黑河市',value: Math.round(Math.random()*1000)},
					                {name: '大兴安岭地区',value: Math.round(Math.random()*1000)},
					                {name: '哈尔滨市',value: Math.round(Math.random()*1000)},
					                {name: '齐齐哈尔市',value: Math.round(Math.random()*1000)},
					                {name: '牡丹江市',value: Math.round(Math.random()*1000)},
					                {name: '绥化市',value: Math.round(Math.random()*1000)},
					                {name: '伊春市',value: Math.round(Math.random()*1000)},
					                {name: '佳木斯市',value: Math.round(Math.random()*1000)},
					                {name: '鸡西市',value: Math.round(Math.random()*1000)},
					                {name: '双鸭山市',value: Math.round(Math.random()*1000)},
					                {name: '大庆市',value: Math.round(Math.random()*1000)},
					                {name: '鹤岗市',value: Math.round(Math.random()*1000)},
					                {name: '七台河市',value: Math.round(Math.random()*1000)},
					                {name: '酒泉市',value: Math.round(Math.random()*1000)},
					                {name: '张掖市',value: Math.round(Math.random()*1000)},
					                {name: '甘南藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '武威市',value: Math.round(Math.random()*1000)},
					                {name: '陇南市',value: Math.round(Math.random()*1000)},
					                {name: '庆阳市',value: Math.round(Math.random()*1000)},
					                {name: '白银市',value: Math.round(Math.random()*1000)},
					                {name: '定西市',value: Math.round(Math.random()*1000)},
					                {name: '天水市',value: Math.round(Math.random()*1000)},
					                {name: '兰州市',value: Math.round(Math.random()*1000)},
					                {name: '平凉市',value: Math.round(Math.random()*1000)},
					                {name: '临夏回族自治州',value: Math.round(Math.random()*1000)},
					                {name: '金昌市',value: Math.round(Math.random()*1000)},
					                {name: '嘉峪关市',value: Math.round(Math.random()*1000)},
					                {name: '普洱市',value: Math.round(Math.random()*1000)},
					                {name: '红河哈尼族彝族自治州',value: Math.round(Math.random()*1000)},
					                {name: '文山壮族苗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '曲靖市',value: Math.round(Math.random()*1000)},
					                {name: '楚雄彝族自治州',value: Math.round(Math.random()*1000)},
					                {name: '大理白族自治州',value: Math.round(Math.random()*1000)},
					                {name: '临沧市',value: Math.round(Math.random()*1000)},
					                {name: '迪庆藏族自治州',value: Math.round(Math.random()*1000)},
					                {name: '昭通市',value: Math.round(Math.random()*1000)},
					                {name: '昆明市',value: Math.round(Math.random()*1000)},
					                {name: '丽江市',value: Math.round(Math.random()*1000)},
					                {name: '西双版纳傣族自治州',value: Math.round(Math.random()*1000)},
					                {name: '保山市',value: Math.round(Math.random()*1000)},
					                {name: '玉溪市',value: Math.round(Math.random()*1000)},
					                {name: '怒江傈僳族自治州',value: Math.round(Math.random()*1000)},
					                {name: '德宏傣族景颇族自治州',value: Math.round(Math.random()*1000)},
					                {name: '百色市',value: Math.round(Math.random()*1000)},
					                {name: '河池市',value: Math.round(Math.random()*1000)},
					                {name: '桂林市',value: Math.round(Math.random()*1000)},
					                {name: '南宁市',value: Math.round(Math.random()*1000)},
					                {name: '柳州市',value: Math.round(Math.random()*1000)},
					                {name: '崇左市',value: Math.round(Math.random()*1000)},
					                {name: '来宾市',value: Math.round(Math.random()*1000)},
					                {name: '玉林市',value: Math.round(Math.random()*1000)},
					                {name: '梧州市',value: Math.round(Math.random()*1000)},
					                {name: '贺州市',value: Math.round(Math.random()*1000)},
					                {name: '钦州市',value: Math.round(Math.random()*1000)},
					                {name: '贵港市',value: Math.round(Math.random()*1000)},
					                {name: '防城港市',value: Math.round(Math.random()*1000)},
					                {name: '北海市',value: Math.round(Math.random()*1000)},
					                {name: '怀化市',value: Math.round(Math.random()*1000)},
					                {name: '永州市',value: Math.round(Math.random()*1000)},
					                {name: '邵阳市',value: Math.round(Math.random()*1000)},
					                {name: '郴州市',value: Math.round(Math.random()*1000)},
					                {name: '常德市',value: Math.round(Math.random()*1000)},
					                {name: '湘西土家族苗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '衡阳市',value: Math.round(Math.random()*1000)},
					                {name: '岳阳市',value: Math.round(Math.random()*1000)},
					                {name: '益阳市',value: Math.round(Math.random()*1000)},
					                {name: '长沙市',value: Math.round(Math.random()*1000)},
					                {name: '株洲市',value: Math.round(Math.random()*1000)},
					                {name: '张家界市',value: Math.round(Math.random()*1000)},
					                {name: '娄底市',value: Math.round(Math.random()*1000)},
					                {name: '湘潭市',value: Math.round(Math.random()*1000)},
					                {name: '榆林市',value: Math.round(Math.random()*1000)},
					                {name: '延安市',value: Math.round(Math.random()*1000)},
					                {name: '汉中市',value: Math.round(Math.random()*1000)},
					                {name: '安康市',value: Math.round(Math.random()*1000)},
					                {name: '商洛市',value: Math.round(Math.random()*1000)},
					                {name: '宝鸡市',value: Math.round(Math.random()*1000)},
					                {name: '渭南市',value: Math.round(Math.random()*1000)},
					                {name: '咸阳市',value: Math.round(Math.random()*1000)},
					                {name: '西安市',value: Math.round(Math.random()*1000)},
					                {name: '铜川市',value: Math.round(Math.random()*1000)},
					                {name: '清远市',value: Math.round(Math.random()*1000)},
					                {name: '韶关市',value: Math.round(Math.random()*1000)},
					                {name: '湛江市',value: Math.round(Math.random()*1000)},
					                {name: '梅州市',value: Math.round(Math.random()*1000)},
					                {name: '河源市',value: Math.round(Math.random()*1000)},
					                {name: '肇庆市',value: Math.round(Math.random()*1000)},
					                {name: '惠州市',value: Math.round(Math.random()*1000)},
					                {name: '茂名市',value: Math.round(Math.random()*1000)},
					                {name: '江门市',value: Math.round(Math.random()*1000)},
					                {name: '阳江市',value: Math.round(Math.random()*1000)},
					                {name: '云浮市',value: Math.round(Math.random()*1000)},
					                {name: '广州市',value: Math.round(Math.random()*1000)},
					                {name: '汕尾市',value: Math.round(Math.random()*1000)},
					                {name: '揭阳市',value: Math.round(Math.random()*1000)},
					                {name: '珠海市',value: Math.round(Math.random()*1000)},
					                {name: '佛山市',value: Math.round(Math.random()*1000)},
					                {name: '潮州市',value: Math.round(Math.random()*1000)},
					                {name: '汕头市',value: Math.round(Math.random()*1000)},
					                {name: '深圳市',value: Math.round(Math.random()*1000)},
					                {name: '东莞市',value: Math.round(Math.random()*1000)},
					                {name: '中山市',value: Math.round(Math.random()*1000)},
					                {name: '延边朝鲜族自治州',value: Math.round(Math.random()*1000)},
					                {name: '吉林市',value: Math.round(Math.random()*1000)},
					                {name: '白城市',value: Math.round(Math.random()*1000)},
					                {name: '松原市',value: Math.round(Math.random()*1000)},
					                {name: '长春市',value: Math.round(Math.random()*1000)},
					                {name: '白山市',value: Math.round(Math.random()*1000)},
					                {name: '通化市',value: Math.round(Math.random()*1000)},
					                {name: '四平市',value: Math.round(Math.random()*1000)},
					                {name: '辽源市',value: Math.round(Math.random()*1000)},
					                {name: '承德市',value: Math.round(Math.random()*1000)},
					                {name: '张家口市',value: Math.round(Math.random()*1000)},
					                {name: '保定市',value: Math.round(Math.random()*1000)},
					                {name: '唐山市',value: Math.round(Math.random()*1000)},
					                {name: '沧州市',value: Math.round(Math.random()*1000)},
					                {name: '石家庄市',value: Math.round(Math.random()*1000)},
					                {name: '邢台市',value: Math.round(Math.random()*1000)},
					                {name: '邯郸市',value: Math.round(Math.random()*1000)},
					                {name: '秦皇岛市',value: Math.round(Math.random()*1000)},
					                {name: '衡水市',value: Math.round(Math.random()*1000)},
					                {name: '廊坊市',value: Math.round(Math.random()*1000)},
					                {name: '恩施土家族苗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '十堰市',value: Math.round(Math.random()*1000)},
					                {name: '宜昌市',value: Math.round(Math.random()*1000)},
					                {name: '襄樊市',value: Math.round(Math.random()*1000)},
					                {name: '黄冈市',value: Math.round(Math.random()*1000)},
					                {name: '荆州市',value: Math.round(Math.random()*1000)},
					                {name: '荆门市',value: Math.round(Math.random()*1000)},
					                {name: '咸宁市',value: Math.round(Math.random()*1000)},
					                {name: '随州市',value: Math.round(Math.random()*1000)},
					                {name: '孝感市',value: Math.round(Math.random()*1000)},
					                {name: '武汉市',value: Math.round(Math.random()*1000)},
					                {name: '黄石市',value: Math.round(Math.random()*1000)},
					                {name: '神农架林区',value: Math.round(Math.random()*1000)},
					                {name: '天门市',value: Math.round(Math.random()*1000)},
					                {name: '仙桃市',value: Math.round(Math.random()*1000)},
					                {name: '潜江市',value: Math.round(Math.random()*1000)},
					                {name: '鄂州市',value: Math.round(Math.random()*1000)},
					                {name: '遵义市',value: Math.round(Math.random()*1000)},
					                {name: '黔东南苗族侗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '毕节地区',value: Math.round(Math.random()*1000)},
					                {name: '黔南布依族苗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '铜仁地区',value: Math.round(Math.random()*1000)},
					                {name: '黔西南布依族苗族自治州',value: Math.round(Math.random()*1000)},
					                {name: '六盘水市',value: Math.round(Math.random()*1000)},
					                {name: '安顺市',value: Math.round(Math.random()*1000)},
					                {name: '贵阳市',value: Math.round(Math.random()*1000)},
					                {name: '烟台市',value: Math.round(Math.random()*1000)},
					                {name: '临沂市',value: Math.round(Math.random()*1000)},
					                {name: '潍坊市',value: Math.round(Math.random()*1000)},
					                {name: '青岛市',value: Math.round(Math.random()*1000)},
					                {name: '菏泽市',value: Math.round(Math.random()*1000)},
					                {name: '济宁市',value: Math.round(Math.random()*1000)},
					                {name: '德州市',value: Math.round(Math.random()*1000)},
					                {name: '滨州市',value: Math.round(Math.random()*1000)},
					                {name: '聊城市',value: Math.round(Math.random()*1000)},
					                {name: '东营市',value: Math.round(Math.random()*1000)},
					                {name: '济南市',value: Math.round(Math.random()*1000)},
					                {name: '泰安市',value: Math.round(Math.random()*1000)},
					                {name: '威海市',value: Math.round(Math.random()*1000)},
					                {name: '日照市',value: Math.round(Math.random()*1000)},
					                {name: '淄博市',value: Math.round(Math.random()*1000)},
					                {name: '枣庄市',value: Math.round(Math.random()*1000)},
					                {name: '莱芜市',value: Math.round(Math.random()*1000)},
					                {name: '赣州市',value: Math.round(Math.random()*1000)},
					                {name: '吉安市',value: Math.round(Math.random()*1000)},
					                {name: '上饶市',value: Math.round(Math.random()*1000)},
					                {name: '九江市',value: Math.round(Math.random()*1000)},
					                {name: '抚州市',value: Math.round(Math.random()*1000)},
					                {name: '宜春市',value: Math.round(Math.random()*1000)},
					                {name: '南昌市',value: Math.round(Math.random()*1000)},
					                {name: '景德镇市',value: Math.round(Math.random()*1000)},
					                {name: '萍乡市',value: Math.round(Math.random()*1000)},
					                {name: '鹰潭市',value: Math.round(Math.random()*1000)},
					                {name: '新余市',value: Math.round(Math.random()*1000)},
					                {name: '南阳市',value: Math.round(Math.random()*1000)},
					                {name: '信阳市',value: Math.round(Math.random()*1000)},
					                {name: '洛阳市',value: Math.round(Math.random()*1000)},
					                {name: '驻马店市',value: Math.round(Math.random()*1000)},
					                {name: '周口市',value: Math.round(Math.random()*1000)},
					                {name: '商丘市',value: Math.round(Math.random()*1000)},
					                {name: '三门峡市',value: Math.round(Math.random()*1000)},
					                {name: '新乡市',value: Math.round(Math.random()*1000)},
					                {name: '平顶山市',value: Math.round(Math.random()*1000)},
					                {name: '郑州市',value: Math.round(Math.random()*1000)},
					                {name: '安阳市',value: Math.round(Math.random()*1000)},
					                {name: '开封市',value: Math.round(Math.random()*1000)},
					                {name: '焦作市',value: Math.round(Math.random()*1000)},
					                {name: '许昌市',value: Math.round(Math.random()*1000)},
					                {name: '濮阳市',value: Math.round(Math.random()*1000)},
					                {name: '漯河市',value: Math.round(Math.random()*1000)},
					                {name: '鹤壁市',value: Math.round(Math.random()*1000)},
					                {name: '大连市',value: Math.round(Math.random()*1000)},
					                {name: '朝阳市',value: Math.round(Math.random()*1000)},
					                {name: '丹东市',value: Math.round(Math.random()*1000)},
					                {name: '铁岭市',value: Math.round(Math.random()*1000)},
					                {name: '沈阳市',value: Math.round(Math.random()*1000)},
					                {name: '抚顺市',value: Math.round(Math.random()*1000)},
					                {name: '葫芦岛市',value: Math.round(Math.random()*1000)},
					                {name: '阜新市',value: Math.round(Math.random()*1000)},
					                {name: '锦州市',value: Math.round(Math.random()*1000)},
					                {name: '鞍山市',value: Math.round(Math.random()*1000)},
					                {name: '本溪市',value: Math.round(Math.random()*1000)},
					                {name: '营口市',value: Math.round(Math.random()*1000)},
					                {name: '辽阳市',value: Math.round(Math.random()*1000)},
					                {name: '盘锦市',value: Math.round(Math.random()*1000)},
					                {name: '忻州市',value: Math.round(Math.random()*1000)},
					                {name: '吕梁市',value: Math.round(Math.random()*1000)},
					                {name: '临汾市',value: Math.round(Math.random()*1000)},
					                {name: '晋中市',value: Math.round(Math.random()*1000)},
					                {name: '运城市',value: Math.round(Math.random()*1000)},
					                {name: '大同市',value: Math.round(Math.random()*1000)},
					                {name: '长治市',value: Math.round(Math.random()*1000)},
					                {name: '朔州市',value: Math.round(Math.random()*1000)},
					                {name: '晋城市',value: Math.round(Math.random()*1000)},
					                {name: '太原市',value: Math.round(Math.random()*1000)},
					                {name: '阳泉市',value: Math.round(Math.random()*1000)},
					                {name: '六安市',value: Math.round(Math.random()*1000)},
					                {name: '安庆市',value: Math.round(Math.random()*1000)},
					                {name: '滁州市',value: Math.round(Math.random()*1000)},
					                {name: '宣城市',value: Math.round(Math.random()*1000)},
					                {name: '阜阳市',value: Math.round(Math.random()*1000)},
					                {name: '宿州市',value: Math.round(Math.random()*1000)},
					                {name: '黄山市',value: Math.round(Math.random()*1000)},
					                {name: '巢湖市',value: Math.round(Math.random()*1000)},
					                {name: '亳州市',value: Math.round(Math.random()*1000)},
					                {name: '池州市',value: Math.round(Math.random()*1000)},
					                {name: '合肥市',value: Math.round(Math.random()*1000)},
					                {name: '蚌埠市',value: Math.round(Math.random()*1000)},
					                {name: '芜湖市',value: Math.round(Math.random()*1000)},
					                {name: '淮北市',value: Math.round(Math.random()*1000)},
					                {name: '淮南市',value: Math.round(Math.random()*1000)},
					                {name: '马鞍山市',value: Math.round(Math.random()*1000)},
					                {name: '铜陵市',value: Math.round(Math.random()*1000)},
					                {name: '南平市',value: Math.round(Math.random()*1000)},
					                {name: '三明市',value: Math.round(Math.random()*1000)},
					                {name: '龙岩市',value: Math.round(Math.random()*1000)},
					                {name: '宁德市',value: Math.round(Math.random()*1000)},
					                {name: '福州市',value: Math.round(Math.random()*1000)},
					                {name: '漳州市',value: Math.round(Math.random()*1000)},
					                {name: '泉州市',value: Math.round(Math.random()*1000)},
					                {name: '莆田市',value: Math.round(Math.random()*1000)},
					                {name: '厦门市',value: Math.round(Math.random()*1000)},
					                {name: '丽水市',value: Math.round(Math.random()*1000)},
					                {name: '杭州市',value: Math.round(Math.random()*1000)},
					                {name: '温州市',value: Math.round(Math.random()*1000)},
					                {name: '宁波市',value: Math.round(Math.random()*1000)},
					                {name: '舟山市',value: Math.round(Math.random()*1000)},
					                {name: '台州市',value: Math.round(Math.random()*1000)},
					                {name: '金华市',value: Math.round(Math.random()*1000)},
					                {name: '衢州市',value: Math.round(Math.random()*1000)},
					                {name: '绍兴市',value: Math.round(Math.random()*1000)},
					                {name: '嘉兴市',value: Math.round(Math.random()*1000)},
					                {name: '湖州市',value: Math.round(Math.random()*1000)},
					                {name: '盐城市',value: Math.round(Math.random()*1000)},
					                {name: '徐州市',value: Math.round(Math.random()*1000)},
					                {name: '南通市',value: Math.round(Math.random()*1000)},
					                {name: '淮安市',value: Math.round(Math.random()*1000)},
					                {name: '苏州市',value: Math.round(Math.random()*1000)},
					                {name: '宿迁市',value: Math.round(Math.random()*1000)},
					                {name: '连云港市',value: Math.round(Math.random()*1000)},
					                {name: '扬州市',value: Math.round(Math.random()*1000)},
					                {name: '南京市',value: Math.round(Math.random()*1000)},
					                {name: '泰州市',value: Math.round(Math.random()*1000)},
					                {name: '无锡市',value: Math.round(Math.random()*1000)},
					                {name: '常州市',value: Math.round(Math.random()*1000)},
					                {name: '镇江市',value: Math.round(Math.random()*1000)},
					                {name: '吴忠市',value: Math.round(Math.random()*1000)},
					                {name: '中卫市',value: Math.round(Math.random()*1000)},
					                {name: '固原市',value: Math.round(Math.random()*1000)},
					                {name: '银川市',value: Math.round(Math.random()*1000)},
					                {name: '石嘴山市',value: Math.round(Math.random()*1000)},
					                {name: '儋州市',value: Math.round(Math.random()*1000)},
					                {name: '文昌市',value: Math.round(Math.random()*1000)},
					                {name: '乐东黎族自治县',value: Math.round(Math.random()*1000)},
					                {name: '三亚市',value: Math.round(Math.random()*1000)},
					                {name: '琼中黎族苗族自治县',value: Math.round(Math.random()*1000)},
					                {name: '东方市',value: Math.round(Math.random()*1000)},
					                {name: '海口市',value: Math.round(Math.random()*1000)},
					                {name: '万宁市',value: Math.round(Math.random()*1000)},
					                {name: '澄迈县',value: Math.round(Math.random()*1000)},
					                {name: '白沙黎族自治县',value: Math.round(Math.random()*1000)},
					                {name: '琼海市',value: Math.round(Math.random()*1000)},
					                {name: '昌江黎族自治县',value: Math.round(Math.random()*1000)},
					                {name: '临高县',value: Math.round(Math.random()*1000)},
					                {name: '陵水黎族自治县',value: Math.round(Math.random()*1000)},
					                {name: '屯昌县',value: Math.round(Math.random()*1000)},
					                {name: '定安县',value: Math.round(Math.random()*1000)},
					                {name: '保亭黎族苗族自治县',value: Math.round(Math.random()*1000)},
					                {name: '五指山市',value: Math.round(Math.random()*1000)}
					            ]
					        }
					    ]
					};
			 		// };
			 		
			                myChart.setOption(option);     
						
		}
		)	

	},

	Draw_blog_scan_area: function(data){

  	//$('#blog_scan_area_time').empty();
    var item = data;
	var html = '';
	//console.log("执行了微博浏览区函数！");
	// //console.log(item);
	// for(var key in data){
	// 	console.log(key);
	// 	console.log(data[0]);
		//var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
		//key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
		//console.log(data.length);
		
		if (item.length == 0){
		html += '<div style="color:grey;">暂无数据</div>'
		}else{
			var num_page = parseInt(item.length/10)+1;  //num_page表示微博数据共有多少页
			// for( k =  )	
		
			for (i=0;i < Math.min(10,item.length);i++){
			// 	// item[i][1]
			// 	for(j=0;j<item[].length;j++){

				// }
			
			//for(i=0;i<item.length;i++){
			// for(j=0;j<8;j++){	
				//var item_timestamp_datetime = new Date(item[i][1].timestamp*1000).format('yyyy/MM/dd hh:mm');
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
				html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
				html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >评论数('+item[i][1].comment+')</span>'
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



var topic_analysis_place = new topic_analysis_place();
 
function Draw_geo_map_result(){
    url = "/topic_geo_analyze/geo_weibo_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	console.log(url);
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_geo_map);
}	

function Draw_blog_scan_area_result(){
    url = "/topic_geo_analyze/geo_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval+'&province'+province;
 	console.log(url);
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_blog_scan_area);
}		



// function Draw_geo_map_result(){
//     url = "/topic_geo_analyzee/geo_weibo_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&province='+province;
//  	console.log(url);
//  	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_geo_map);
// }		


Draw_geo_map_result();
Draw_blog_scan_area_result();


function show_geo(){
  this.ajax_method='GET';
}

show_geo.prototype = {
  call_sync_ajax_request:function(url,method,callback) {
    $.ajax({
      url: url,
      type: method,
      dataType:'json',
      async:true,
      success:callback
  });
  },

  geoData: function(data){
  //	console.log(data);
  	var all_count = data.all_top;
  //	console.log(all_count.length);
    var loc_json = []; 
    var html = '';
    var placename;
    for (i=0;i<all_count.length;i++){
    	if (data.all_top[i][0] == '中国\t北京\t北京') {
     	  placename = '北京';
    	}
      loc_json.push({name:placename,value:data.all_top[i][1]});
    }
  //  console.log(loc_json);
    document.getElementById('des_loc').innerHTML=(data.description);
     
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
    				var myChart = echarts.init(document.getElementById('act_map'),'shine');
   var option = {
        title: {
            text: '',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data:['发布微博']
        },
        visualMap: {
            min: 0,
            max: 2500,
            x: 'left',
            y: 'center',
            top: 'bottom',
            text: ['高','低'],           // 文本，默认为数值文本
            calculable: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        roamController: {  
            show: true,  
            x: 'right',  
            mapTypeControl: {  
                'china': true  
            }  
        },  
        series: [
            {
                name: 'weibo',
                type: 'map',
                mapType: 'china',
                roam:false,
                itemStyle:{  
                  normal:{label:{show:true}},  
                  emphasis:{label:{show:true}}  
                },  
                data:loc_json
            }
        ]
    };
    myChart.setOption(option); 
}
);
    loc_json.sort(function(a,b){
            return b.value-a.value});
		// console.log(item_json);
  },

}

var show_geo = new show_geo();
var uid = 1640601392;
geo_load();
//加载
function geo_load(){
    click_action_geo();
    var geo_url = ' /attribute/location/?uid='+uid+'&time_type=month';
    show_geo.call_sync_ajax_request(geo_url, show_geo.ajax_method, show_geo.geoData);
}

//模式选择
function click_action_geo(){
    $('#mychoice_geo').on('click','input[name="choose_module_geo"]', function(){             
      var index = $('input[name="choose_module_geo"]:checked').val();
      //console.log(index);
      if(index == 1){
        console.log('1');
        var geo_url = '/attribute/location/?uid='+uid+'&time_type=month';
        show_geo.call_sync_ajax_request(geo_url, show_geo.ajax_method, show_geo.geoData);
      }
      else if(index == 2){
        console.log('2');
        var geo_url = '/attribute/location/?uid='+uid+'&time_type=week';
        show_geo.call_sync_ajax_request(geo_url, show_geo.ajax_method, show_geo.geoData);    
      }else{
      	console.log('3');
        var geo_url = '/attribute/location/?uid='+uid+'&time_type=day';
        show_geo.call_sync_ajax_request(geo_url, show_geo.ajax_method, show_geo.geoData); 
      }
    });
}

console.log("加载地图");
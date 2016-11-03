      //近一个月群体活跃度走势;id=activi-line
      
      function Draw_activity_line(data){
    if(data.length==0){
     $('#activi-line').empty();
     var html = '<div style="margin-left:300px;margin-top:180px;font-size:20px;">暂无数据</div>'; 
     $('#activi-line').append(html);
    }else{
    //活跃非活跃用户
    var main_active = data.main_max;
    var main_unactive = data.main_min;
    Draw_active_table(main_active, 'activi-users');
    Draw_active_table(main_unactive, 'unactivi-users');
  
    //折线图
    //var legend_data = []
    var xAxis_data = data.time_list;
    var yAxis_ave = data.ave_list;

    var max_list = data.max_list;
    var yAxis_max = [];
    for(var i=0; i<max_list.length;i++){
        yAxis_max.push(max_list[i][1]);

    };

    var min_list = data.min_list;
    var yAxis_min = [];
    for(var i=0; i<min_list.length;i++){
        yAxis_min.push(min_list[i][1])
    };


   var mychart = echarts.init(document.getElementById('activi-line'),'macarons');
   var option = {
    tooltip : {
        trigger: 'axis',
        formatter: function (params) {
        var max_user_name = [];
        var min_user_name = [];
        for(var i=0; i<max_list.length;i++){
            if(max_list[i][2]=='unknown'||max_list[i][2]==''){
                max_list[i][2] = max_list[i][0];
            }
            if(min_list[i][2]=='unknown'||min_list[i][2]==''){
                min_list[i][2] = min_list[i][0];
            }
            max_user_name.push(max_list[i][2]);
            min_user_name.push(min_list[i][2]);

        };
            var res = '' + params[0].name;
            var index = params[0].dataIndex;
            if(max_user_name[index]==''){
                max_user_name[index]='无';
            }
             if(min_user_name[index]==''){
                 min_user_name[index]='无' 
             }
            res +=  ': <br/>最高值用户: ' + max_user_name[index];
            res +=  ' <br/>最低值用户: ' + min_user_name[index];
            return res
        }
    },
    legend: {
        data:['最高值','最低值','平均值']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : xAxis_data
        }
    ],
    yAxis : [
        {
            type : 'value',
            name : '活跃度'

        }
    ],
    series : [
        {
            name:'最高值',
            type:'line',
            data:yAxis_max
        },
        {
            name:'最低值',
            type:'line',
            data:yAxis_min
        },
        {
            name:'平均值',
            type:'line',
            data:yAxis_ave
        }
        
    ]
};
  mychart.setOption(option);
}
}
 
 function Draw_active_table(data, div_name){
if(data.length==0){
     $(div_name).empty();
     var html = '<div style="margin-left:150px;margin-top:90px;font-size:20px;">暂无数据</div>'; 
     $(div_name).append(html);
    }else{
   if(data.length<5){
        var show_count = data.length;
    } else{
        show_count = 5
    };
    $('#' + div_name).empty();
    var html = '';
    html += '<table class="table table-striped table-hover">';
    html += '<thead><tr><th style="text-align:center">排名</th><th style="text-align:center">昵称</th><th style="text-align:center">天数</th></tr></thead><tbody>';
    for (var i = 0; i < show_count; i++) {
        var name_list = data[i]['0'].split('&');
        var name = name_list[1];
        var s = i.toString();
        var m = i + 1;
        if(name=='unknown'||name==''){
            name = name_list[0];
        }
        html += '<tr><td style="text-align:center">' + m + '</td><td style="text-align:center"><a href="/index/viewinformation/?uid='+name_list[0]+'" target="_blank">' + name + '</a></td><td style="text-align:center">'+data[i][1] + '</td></tr>';
        // /index/viewinformation/?uid=
        //console.log(name_list[0])
        
    };
     html += '</tbody></table>'; 
    $('#'+div_name).append(html);
 }
}
function Draw_geo_graph(data){
    if(data.length==0){
     $('#geo-distri').empty();
     var html = '<div style="margin-left:300px;margin-top:180px;font-size:20px;">暂无数据</div>'; 
     $('#geo-distri').append(html);
    }else{
     var geo_data=[];
    for (var key in data){
     var province_data ={};
     province_data['name']=key;
     province_data['value']=data[key]['total'];
    // console.log(province_data);
     geo_data.push(province_data);
     for(var d_key in data[key]){
       if(d_key!='total'&&d_key!='未知'){
        var city_data ={};
        city_data['value']=data[key][d_key];
        city_data['name']=d_key+'市';
        geo_data.push(city_data);
        console.log(geo_data);
        }
     }
     }


     require(
     [  
            'echarts',
            'zrender'
        ],  
    function(ec){ 
    var myChart = echarts.init(document.getElementById('geo-distri'),'shine');
    var ecConfig = require('echarts/config');
    var zrEvent = require('zrender/tool/event');
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
  var option = {
    title :{
       subtext:"地理活跃度"
    },
    tooltip : {
        trigger: 'item',
        formatter: '滚轮切换或点击进入该省<br/>{b}:{c}'
    },
    legend: {
        orient: 'vertical',
        x:'right',
        data:['活跃值']
    },
    dataRange: {
        min: 0,
        max: 500,
        color:['orange', 'yellow'],    //'#E0022B', '#E09107'
        text:['高','中','低'],           // 文本，默认为数值文本
        calculable : true
    },
    series : [
        {
            name: '活跃值',
            type: 'map',
            mapType: 'china',
            selectedMode : 'single',
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
            data:geo_data
        }
    ]
};         
document.getElementById('geo-distri').onmousewheel = function (e){
    var event = e || window.event;
    curIndx += zrEvent.getDelta(event) > 0 ? (-1) : 1;
    if (curIndx < 0) {
        curIndx = mapType.length - 1;
    }
    var mt = mapType[curIndx % mapType.length];
    if (mt == 'china') {
        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}:{c}';
    }
    else{
        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}:{c}';
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
        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}:{c}';
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

         
      myChart.setOption(option);
})
 }
}
 
function Draw_active_page(data){
       Draw_activity_line(data.activeness_trend);
       Draw_geo_graph(data.new_geo);

}

 
function g_act_load(g_name,s_user){
 var activity_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=activity';

 call_sync_ajax_request(activity_url,'GET',Draw_active_page);
 console.log('g_act_load url:'+activity_url);
}

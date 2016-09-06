      //近一个月群体活跃度走势;id=activi-line
      function Draw_activity_line(data){
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
 
 function Draw_active_table(data, div_name){
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
        var name_list = data[i][0].split('&');
        var name = name_list[1];
        var s = i.toString();
        var m = i + 1;
        if(name=='unknown'||name==''){
            name = name_list[0];
        }
        html += '<tr><td style="text-align:center">' + m + '</td><td style="text-align:center">' + name + '</td><td style="text-align:center">'+data[i][1] + '</td></tr>';
    };
     html += '</tbody></table>'; 
    $('#'+div_name).append(html);
 }
function Draw_geo_graph(data){
    
 }
function Draw_active_page(data){
       Draw_activity_line(data.activeness_trend);
       Draw_active_table(data);
       Draw_geo_graph(data)

}

 var activity_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=activity';
 

 call_sync_ajax_request(activity_url,'GET',Draw_active_page);

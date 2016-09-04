     //近一个月圈子影响力走势;id=influen-line
    function call_sync_ajax_request(url, method, callback){
              $.ajax({
                url: url,
                type: method,
                dataType: 'json',
                async: true,
                success:callback
              });
            }
     var influence_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user'+s_user+'&module=influence';     
     call_sync_ajax_request(influence_url,'GET',Draw_influence_line);
    function Draw_influence_line(data){
      var data = data['influence_trend'];
      var myChart = echarts.init(document.getElementById('influen-line'),'shine');
      var mind = []
       var maxd = []
       ave_data = data['ave_list'];
       max_data = data['max_list'];
       min_data = data['min_list'];
      // console.log(min_data);
       for(var i=0;i<min_data.length;i++){
          mind.push(min_data[i][1]);
       }
       // console.log('min',mind);
       for(var i=0;i<max_data.length;i++){
          
          maxd.push(max_data[i][1]);
       }
       // console.log('max',maxd);
       time_data = data['time_list'];
       var option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
            var max_user_name = [];
            var min_user_name = [];
            for(var i=0; i<max_data.length;i++){
                if(max_data[i][2]=='unknown'||max_data[i][2]==''){
                    max_data[i][2] = max_data[i][0];
                }
                if(min_data[i][2]=='unknown'||min_data[i][2]==''){
                    min_data[i][2] = min_data[i][0];
                }
                max_user_name.push(max_data[i][2]);
                min_user_name.push(min_data[i][2]);

            };
                var res = '' + params[0].name;
                var index = params[0].dataIndex;
                res +=  '<br/>最高值用户: ' + max_user_name[index] ;
                res +=  '<br/>最低值用户: ' + min_user_name[index] ;
                return res
            }
        },
        legend: {
            data:['最高值','平均值','最低值']
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
                data : time_data
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale: true,
                name : '影响力'
            }
        ],
        series : [
            {
                name:'最高值',
                type:'line',
                data:maxd
            },
            {
                name:'平均值',
                type:'line',
                data:ave_data
            },
            {
                name:'最低值',
                type:'line',
                data:mind
            }
            
        ]
    };
       myChart.setOption(option);
}
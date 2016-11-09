     //近一个月圈子影响力走势;id=influen-line
   
    function Draw_influence_line(data){
      var data = data['influence_trend'];
      var myChart = echarts.init(document.getElementById('influen-line'),'shine');
      var mind = []
       var maxd = []
       var eved = []
       ave_data = data['ave_list'];
       max_data = data['max_list'];
       min_data = data['min_list'];
      // console.log(min_data);
       for(var i=0;i<min_data.length;i++){
          mind.push(min_data[i][1].toFixed(2));
       }
       // console.log('min',mind);
       for(var i=0;i<max_data.length;i++){
          
          maxd.push(max_data[i][1].toFixed(2));
       }
       for(var i=0;i<ave_data.length;i++){
          eved.push(ave_data[i].toFixed(2));
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
            data:eved
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

 function Draw_identi_distri(data){
   
 var myChart = echarts.init(document.getElementById('identi-distri'),'shine');
      var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal',
        x : '5px',
        y : '35px',
        data:['草根','活跃人士','媒体','媒体人士','境内机构']
    },
    toolbox: {
        show : true,
        x : 'right',
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'用户身份',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:data['domain'][0][1], name:'草根'},
                {value:data['domain'][1][1], name:'活跃人士'},
                {value:data['domain'][2][1], name:'媒体'},
                {value:data['domain'][3][1], name:'媒体人士'},
                {value:data['domain'][4][1], name:'境内机构'},
            ]
        }
    ]
};
                    
                        
       myChart.setOption(option);

 }


 function Draw_area_distri(data){
      var myChart = echarts.init(document.getElementById('area-distri'),'infographic');
      var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal',
        x : '5px',
        y : '35px',
        data:['体育类','娱乐类','科技类','经济类','教育类','政治类','民生类','其他类']
    },
    toolbox: {
        show : true,
        x : 'right',
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'用户领域',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:data['topic'][1][1], name:'体育类'},
                {value:data['topic'][2][1], name:'娱乐类'},
                {value:data['topic'][3][1], name:'科技类'},
                {value:data['topic'][4][1], name:'经济类'},
                {value:data['topic'][5][1], name:'教育类'},
                {value:data['topic'][6][1], name:'政治类'},
                {value:data['topic'][7][1], name:'民生类'},
                {value:data['topic'][0][1], name:'其他类'}
            ]
        }
    ]
};
       myChart.setOption(option);
 }


  function Draw_basic_page(data){
        Draw_area_distri(data);
        Draw_identi_distri(data);
    }

 
function g_bas_load(g_name,s_user){
 var influence_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=influence';
 var basic_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=basic';

 call_sync_ajax_request(influence_url,'GET',Draw_influence_line);
 call_sync_ajax_request(basic_url,'GET',Draw_basic_page);
 console.log('influence_url:'+influence_url);
}
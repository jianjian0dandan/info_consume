function Draw_sentiment_trend(data){
    var times = [];
    var time_name = [];
    times = data['sentiment_trend']['time_list'];
    time_name = data['sentiment_trend']['time_list'];
    //console.log(times);
    var names = ['中性','积极','消极']; 
    var data0 = data['sentiment_trend']['0'];
    var data1 = data['sentiment_trend']['1'];
    var data2 = data['sentiment_trend']['2'];
    var datas = [data0,data1,data2];
    var nods = {};
    var nodcontent = [];
    for(i=0;i<3;i++){
        nods = {};
        nods['name'] = names[i];
        nods['type'] = 'line';
        nods['data'] = datas[i];
        nodcontent.push(nods);
    }

    var myChart1 = echarts.init(document.getElementById('senti-trend'));
    var option = {
    tooltip : {
        trigger: 'axis'
    },
    grid:{
        width:'75%'
    },
    legend: {
        data:names
    },
    toolbox: {
        show : false,
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
            data : times
        }
    ],
    yAxis : [
        {
            type : 'value',
        }
    ],
    series : nodcontent
    };
    myChart1.setOption(option); 
    require([
            'echarts'
        ],
        function(ec){
                //$('#group_emotion_loading').css('display', 'block');
            var ecConfig = require('echarts/config');
            function focus(param) {
                $('#group_weibo_text').css('display', 'none');
                $('#group_emotion_loading').css('display', 'block');
                $('#group_weibo_text').css('display', 'none');
                //$('#')
                var sentiment = param.seriesIndex;
                var date = new Date(time_name[param.dataIndex]);
                var starts_ts = date.getTime().toString().substr(0,10);
                var start_ts = parseInt(starts_ts)-28800;    
                //console.log(start_ts);             
                var ajax_url = '/info_group/group_sentiment_weibo/?task_name='+g_name+'&sentiment='+sentiment+'&start_ts='+start_ts+'&submit_user='+s_user;
              //  var ajax_url = '/info_group/group_sentiment_weibo/?task_name=冯绍峰&sentiment=0&start_ts=1377964800&submit_user=admin@qq.com';
                $.ajax({
                      url: ajax_url,
                      type: 'GET',
                      dataType: 'json',
                      async: true,
                      success:group_draw_content
                    });
                var html0 = '';
                $('#group_select_time').empty();  
                html0 += "<div style='float:left'>当前选择时间段：</div><div style='color:brown;'>"+time_name[param.dataIndex]+"</div><div style='float:left'>当前选择情绪：</div><div style='color:brown;'>"+names[sentiment]+'</div>';
                $('#group_select_time').append(html0);
                }
            $('#group_emotion_loading').css('display', 'block');
            $('#group_weibo_text').css('display', 'none');
            myChart1.on(ecConfig.EVENT.CLICK, focus);
            }
            
    )
}

function group_draw_content(data){
    //console.log('asdfadf');
    var html_c = '';
    $('#group_weibo_text').empty();
    //$('#group_select_time').empty();
    if(data==''){
        html_c += "<div style='width:100%;'><span style='margin-left:20px;'>该时段群组用户未发布任何微博</span></div>";
    }else{
        for(i=0;i<data.length;i++){
            html_c += "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'>"+data[i]['text']+"</span></div>";
        }
    }
    $('#group_weibo_text').append(html_c);
    $('#group_emotion_loading').css('display', 'none');
    $('#group_weibo_text').css('display', 'block');
}


function Draw_group_trend(data){
    var items = data;
    if(items==null){
        var say = document.getElementById('senti-weibo');
        say.innerHTML = '该用户暂无此数据';
    }else{
       Draw_sentiment_trend(items);
        var time_init = new Date(items['sentiment_trend']['time_list'][0]);
        var times_init = time_init.getTime().toString().substr(0,10);
        var html0 = '';
        var url_content = '/info_group/group_sentiment_weibo/?task_name='+g_name+'&sentiment=0&start_ts='+times_init+'&submit_user='+s_user;
        //var url_content ='/info_group/group_sentiment_weibo/?task_name=冯绍峰&sentiment=0&start_ts=1377964800&submit_user=admin@qq.com';
       console.log(url_content)
        $('#group_weibo_text').empty();
        $('#group_weibo_text').css('display', 'none');
        $('#group_emotion_loading').css('display', 'block');
        //$('#group_weibo_text_1').append('数据正在加载中，请稍后...');
        call_sync_ajax_request(url_content,'GET',group_draw_content);
        $('#group_select_time').empty();  
        html0 += "<div style='float:left'>当前选择日期：</div><div style='color:brown;'>"+items['sentiment_trend']['time_list'][0]+"</div><div style='float:left' >当前选择情绪：</div><div style='color:brown;'>中性</div>";
        $('#group_select_time').append(html0);
    }   
}


function  Draw_sentiment_pie(data){   
var senti_total = data[0]+data[1]+data[2]+data[3]+data[4]+data[5]+data[6];
var positive = data['1'];
var neutral = data['0'];
var negative = senti_total-positive-neutral;
var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false},
        tooltip: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    }
};
  require(
     [  
            'echarts'
        ],
function(ec){
var myChart = echarts.init(document.getElementById('senti-pie'),'shine');
var ecConfig = require('echarts/config');
var option = {
    title: {
        text: '你快乐吗？',
        subtext: 'From SinaWeibo',
        sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle : {
            color : 'rgba(30,144,255,0.8)',
            fontFamily : '微软雅黑',
            fontSize : 27,
            fontWeight : 'bolder'
        }
    },
    tooltip : {
        show: true,
        formatter: "{b} : {d}%"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        y : 'top',
        itemGap:12,
        data:['我很快乐','我很难过','感觉还行']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            type:'pie',
            clockWise:false,
            radius : [125, 150],
            itemStyle : dataStyle,
            data:[
                {
                    value:negative, 
                    name:'我很难过'
                },
                {
                    value:senti_total-negative,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        },
        {
            type:'pie',
            clockWise:false,
            radius : [100, 125],
            itemStyle : dataStyle,
            data:[
                {
                    value:neutral, 
                    name:'感觉还行'
                },
                {
                    value:senti_total-neutral,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        },
        {
            type:'pie',
            clockWise:false,
            radius : [75, 100],
            itemStyle : dataStyle,
            data:[
                {
                    value:positive,
                    name:'我很快乐'
                },
                {
                    value:senti_total-positive,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        }
    ]
};

myChart.on(ecConfig.EVENT.CLICK, function (param){
  // var date = new Date('2013-09-01');
  // var starts_ts = date.getTime().toString().substr(0,10);
  // var start_ts = parseInt(starts_ts)-28800; 
  // console.log(start_ts);
  
  //window.open('./viewinformation');

 })
 myChart.setOption(option);
})
}

function Draw_psy_page(data){
       Draw_sentiment_pie(data.sentiment_pie);
       Draw_group_trend(data)
} 

 var psy_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=think';
 function g_tho_load(){
 call_sync_ajax_request(psy_url,'GET',Draw_psy_page);
 }
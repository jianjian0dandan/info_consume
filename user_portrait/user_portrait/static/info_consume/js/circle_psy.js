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
  
  window.open('./viewinformation');

 })
 myChart.setOption(option);
})
}

function Draw_psy_page(data){
       Draw_sentiment_pie(data.sentiment_pie);
} 

 var psy_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=think';
 function g_tho_load(){
 call_sync_ajax_request(psy_url,'GET',Draw_psy_page);
 }
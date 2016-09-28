function Draw_retwwie_out(data){
var nodes_total = [];
var links_total = [];
if(data.length==0){
 $('#out-retwwie').empty();
 var html = '<div style="margin-left:300px;margin-top:180px;font-size:20px;">暂无数据</div>'; 
 $('#out-retwwie').append(html);
}else{
  for (var i=0;i<data.length;i++){
  var s = i.toString();
  var nodes_from = {};
  nodes_from['category'] = '0';
  if(data[s]['4']=='unknown'||data[s]['4']==''){
     nodes_from['name'] = data[s]['0'];
 }else{
     nodes_from['name'] = data[s]['4'];
  };
   nodes_from['draggable'] = true;
   nodes_total.push(nodes_from);

  var nodes_to = {};
  nodes_to['category'] ='1';
  if(data[s]['5']=='unknown'||data[s]['5']==''){
     nodes_to['name'] = data[s]['1'];
 }else{
     nodes_to['name'] = data[s]['5'];
  };
   nodes_to['draggable'] = true;
   nodes_to['value'] = data[s]['3']/10;
   nodes_total.push(nodes_to);
 
   var links_single = {};
   links_single['source'] = nodes_from['name'];
   links_single['target'] = nodes_to['name'];
   links_single['weight'] = data[s]['2'];
   links_single['value'] = data[s]['2'];
   links_total.push(links_single);
  }
  require(
     [  
            'echarts'
        ],
function(ec){
var myChart = echarts.init(document.getElementById('out-retwwie'),'shine');
var ecConfig = require('echarts/config');
var option = {
    title:{
      subtext:'节点数值代表用户影响力大小，边数值代表用户交互次数'
    },
    tooltip : {
        trigger: 'item',
        formatter: '{b} : {c}'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            magicType: {show: true, type: ['force', 'chord']},
            saveAsImage : {show: true}
        }
    },
    legend: {
        x: 'left',
        data:['群组内部用户','群组外部用户']
    },
    series : [
        {
            type:'force',
            ribbonType: false,
            categories : [
                {
                    name: '群组内部用户'
                },
                {
                    name: '群组外部用户'
                },
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#333'
                        }
                    },
                    nodeStyle : {
                        brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.4)',
                        borderWidth : 1
                    },
                    linkStyle: {
                        type: 'curve'
                    }
                },
                emphasis: {
                    label: {
                        show: false
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle : {
                        //r: 30
                    },
                    linkStyle : {}
                }
            },
            useWorker: false,
            size:'80%',
            minRadius : 15,
            maxRadius : 25,
            gravity: 1.5,
            scaling: 1.1,
            roam: 'move',
            nodes: nodes_total,
            links: links_total,
        }
    ]
};
   myChart.on(ecConfig.EVENT.CLICK, function (param){
   console.log(param);
  // window.open('/index/viewinformation/?uid='+param.name);
 })
myChart.setOption(option); 
})
}}


function Draw_retwwie_in(data){
var nodes_total = [];
var links_total = [];
if(data.length==0){
 $('#in-retwwie').empty();
 var html = '<div style="margin-left:300px;margin-top:180px;font-size:20px;">暂无数据</div>'; 
 $('#in-retwwie').append(html);
}else{
  for (var i=0;i<data.length;i++){
  var s = i.toString();
  var nodes_from = {};
  nodes_from['category'] = 0;
  if(data[s]['4']=='unknown'||data[s]['4']==''){
     nodes_from['name'] = data[s]['1'];
 }else{
     nodes_from['name'] = data[s]['4'];
  };
   nodes_from['value'] = 10;
   nodes_from['draggable'] = true;
   nodes_total.push(nodes_from);

  var nodes_to = {};
  nodes_to['category'] = 1;
  if(data[s]['3']=='unknown'||data[s]['3']==''){
     nodes_to['name'] = data[s]['0'];
 }else{
     nodes_to['name'] = data[s]['3'];
  };
   nodes_to['value'] = 10;
   nodes_to['draggable'] = true;
   nodes_total.push(nodes_to);

   var links_single = {};
   links_single['source'] = nodes_from['name'];
   links_single['target'] = nodes_to['name'];
   links_single['weight'] = data[s]['2'];
   links_single['value'] = data[s]['2'];
   links_total.push(links_single);
  }
  // console.log(nodes_total);
  // console.log(links_total);
    require(
     [  
            'echarts'
        ],
function(ec){
var myChart = echarts.init(document.getElementById('in-retwwie'),'shine');
var ecConfig = require('echarts/config');
var option = {

    tooltip : {
        trigger: 'item',
        formatter: '{b} : {c}'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            magicType: {show: true, type: ['force', 'chord']},
            saveAsImage : {show: true}
        }
    },
    legend: {
        x: 'left',
        data:['转发用户','被转发用户']
    },
    series : [
        {
            type:'force',
            name : "群组内部转发关系",
            size:'80%',
            center: ['50%','50%'],
            ribbonType: false,
            categories : [
                {
                    name: '转发用户'
                },
                {
                    name: '被转发用户'
                }
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#333'
                        }
                    },
                    nodeStyle : {
                        brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.4)',
                        borderWidth : 1
                    },
                    linkStyle: {
                        type: 'curve'
                    }
                },
                emphasis: {
                    label: {
                        show: false
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle : {
                        //r: 30
                    },
                    linkStyle : {}
                }
            },
            useWorker: false,
            minRadius : 15,
            maxRadius : 25,
            gravity: 1.5,
            scaling: 1.2,
            steps: 10,
            coolDown: 0.9,
            linkSymbol: 'arrow',
            roam: 'move',
            nodes: nodes_total,
            links: links_total,
            symbolSize: 15
        }
    ]
};
myChart.on(ecConfig.EVENT.CLICK, function (param){
  // console.log(param);
   window.open('./viewinformation');
 })
 myChart.setOption(option);
})
}}


function Draw_retwwie_weibo(data){


} 
function Draw_social_page(data){
       Draw_retwwie_in(data.social_in_record);
       Draw_retwwie_out(data.social_out_record);
       Draw_retwwie_weibo(data);
} 

 var social_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=social';
 
function g_soc_load(){
 call_sync_ajax_request(social_url,'GET',Draw_social_page);
 console.log(social_url);
}
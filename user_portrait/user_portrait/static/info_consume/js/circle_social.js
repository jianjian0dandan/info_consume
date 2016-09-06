function Draw_retwwie_in(data){
var nodes_from = {};
var nodes_to = {};
var links_single = {};
var nodes_total = [];
var links_total = [];
if(data.length==0){
 $('#in-retwwie').empty();
 var html = '<span style="margin-left:300px;font-size:20px;">暂无数据</span>'; 
 $('#in-retwwie').append(html);
}else{
  for (var i=0;i<data.length;i++){
  var s = i.toString();
  nodes_from['category'] = 0;
  if(data[s]['4']=='unknown'||data[s]['4']==''){
     nodes_from['name'] = data[s]['1'];
 }else{
     nodes_from['name'] = data[s]['4'];
  };
   nodes_from['value'] = 10;
   nodes_total.push(nodes_from);

  nodes_to['category'] = 1;
  if(data[s]['3']=='unknown'||data[s]['3']==''){
     nodes_to['name'] = data[s]['0'];
 }else{
     nodes_to['name'] = data[s]['3'];
  };
   nodes_to['value'] = 10;
   nodes_total.push(nodes_to);

   links_single['source'] = nodes_from['name'];
   links_single['target'] = nodes_to['name'];
   links_single['weight'] = data[s]['2'];
   links_total.push(links_single);
  }
var myChart = echarts.init(document.getElementById('in-retwwie'),'shine');
option = {

    tooltip : {
        trigger: 'item',
        formatter: '{a} : {b}'
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
            ribbonType: false,
            categories : [
                {
                    name: '群组用户'
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
            gravity: 1.1,
            scaling: 1.1,
            linkSymbol: 'arrow',
            roam: 'move',
            nodes: nodes_total,
            links: links_total
        }
    ]
};
 myChart.setOption(option);
}
} 

function Draw_retwwie_out(data,div_name){
var nodes_from = {};
var nodes_to = {};
var links_single = {};
var nodes_total = [];
var links_total = [];
if(data.length==0){
 $('#out-retwwie').empty();
 var html = '<span style="margin-left:300px;font-size:20px;">暂无数据</span>'; 
 $('#out-retwwie').append(html);
}else{
  for (var i=0;i<data.length;i++){
  var s = i.toString();
  nodes_from['category'] = 0;
  if(data[s]['4']=='unknown'||data[s]['4']==''){
     nodes_from['name'] = data[s]['1'];
 }else{
     nodes_from['name'] = data[s]['4'];
  };
   nodes_from['value'] = 10;
   nodes_total.push(nodes_from);

  nodes_to['category'] = 1;
  if(data[s]['3']=='unknown'||data[s]['3']==''){
     nodes_to['name'] = data[s]['0'];
 }else{
     nodes_to['name'] = data[s]['3'];
  };
   nodes_to['value'] = 10;
   nodes_total.push(nodes_to);

   links_single['source'] = nodes_from['name'];
   links_single['target'] = nodes_to['name'];
   links_single['weight'] = data[s]['2'];
   links_total.push(links_single);
  }
var myChart = echarts.init(document.getElementById('out-retwwie'),'shine');
option = {

    tooltip : {
        trigger: 'item',
        formatter: '{a} : {b}'
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
            name : "群组外部转发关系",
            ribbonType: false,
            categories : [
                {
                    name: '微博用户'
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
            gravity: 1.1,
            scaling: 1.1,
            linkSymbol: 'arrow',
            roam: 'move',
            nodes: nodes_total,
            links: links_total
        }
    ]
};
 myChart.setOption(option);
}
} 

function Draw_retwwie_weibo(data){


} 
function Draw_social_page(data){
       Draw_retwwie_in(data.social_in_record);
       Draw_retwwie_out(data.social_out_record);
       Draw_retwwie_weibo(data);
} 

 var social_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=social';
 call_sync_ajax_request(social_url,'GET',Draw_social_page);
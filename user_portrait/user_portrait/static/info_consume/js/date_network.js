var topic = 'aoyunhui';
var start_ts = 1467648000;
var end_ts = 1470844800;
var sort_item_network = 'timestamp';
var blog_type_network = 'maker';

var no_page_network = 0;
var blog_num_max_global_network = 0;

// //显示资料卡 
// var beforeId; //定义全局变量 
// function showInfoCard(id){ 
// this.hidden(beforeId); //立刻隐藏前一个选中弹出来的div 
// beforeId = id; 

// var objDiv = $("#"+id); 
 
// $(objDiv).css("display","block"); 
 
// $(objDiv).css("left", event.clientX-280); //弹出框的位置X值 
 
// $(objDiv).css("top", event.clientY-10); //弹出框位置Y值 
// } 
// function hideInfoCard(id){ //隐藏div 
// //延时3秒 
// setTimeout('hidden('+id+')',3000); 
// } 
 
// function hidden(id){ 
// $("#"+id).hide(); 
// }


function set_trend_type(val) {
  case_val = val;
  $('#right_col_title_2_network').empty();

  if(case_val == 'maker'){
    Draw_trend_maker_result();
  }

  if(case_val == 'pusher'){
    Draw_trend_pusher_result();
  }
  
  //可以设置默认值（正向），随着页面加载。
 }


function set_order_type_network(type){
  if(type=='time'){
    sort_item_network = 'timestamp';
    Draw_blog_scan_area_network_result();

  }else if(type=='hot'){
    sort_item_network = 'retweeted';
    Draw_blog_scan_area_network_result();
  }
}


function set_blog_type_network(type){
  
    blog_type_network = type;
    Draw_blog_scan_area_network_result();

  
}


//上一页
function up_network(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_network==0){
         alert("当前已经是第一页!");
         return false;
     }else{
    no_page_network--;
    
    Draw_blog_scan_area_network_result();
    
     }
}
//下一页
function down_network(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_network==Math.min(9,Math.ceil(blog_num_max_global_network/10)-1)){
         alert("当前已经是最后一页!");
         
         return false;
     }else{
    no_page_network++;
    
    Draw_blog_scan_area_network_result();
    
     }
}

function first_network(){
   
     no_page_network=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_network_result();
}
//下一页
function last_network(){
     
     no_page_network=(Math.ceil(blog_num_max_global_network/10)-1);
    
     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_network_result();
}


function topic_analysis_network(){
 
}

topic_analysis_network.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },

  Draw_network_pic:function(data){
    var item = data;

    var nodes_new = [];
    var nodes_label = [];
    for(i=0;i<item['nodes'].length;i++){
      nodes_new.push({name:item['nodes'][i]['label'],symbolSize:item['nodes'][i]['symbolSize'],label:''});
      nodes_label.push({name:item['nodes'][i]['label']});
    }
    console.log(item);
    console.log(nodes_new);
    console.log(nodes_label);
         require(  
                [  
                    'echarts',  
                    'echarts/chart/force'  
                ],  
    function (ec) {  
        // 基于准备好的dom，初始化echarts图表  
        // myScatter = ec.init(document.getElementById('mainScatter'));   
    
      var myChart = echarts.init(document.getElementById('main_network'));
      var ecConfig = require('echarts/config'); //放进require里的function{}里面
      var zrEvent = require('zrender/tool/event');
      var option = {
          title : {
              // text: '人物关系：乔布斯',
              // subtext: '数据来自人立方',
              x:'right',
              y:'bottom'
          },
          tooltip : {
              trigger: 'item',
              formatter: 
              function (nodes_label,ticket,callback) {
                  console.log(nodes_label)
                  var res = '用户昵称: ' + nodes_label[0].name;
                  console.log(res);
                  for (var i = 0, l = nodes_label.length; i < l; i++) {
                    for(key in nodes_label)
                      res += key + ' : ' + nodes_label[i][key];
                  }
                  // setTimeout(function (){
                  //     // 仅为了模拟异步回调
                  //     callback(ticket, res);
                  // }, 0)
                  // return 'loading';
              }
          },
          toolbox: {
              show : true,
              feature : {
                  restore : {show: true},
                  magicType: {show: true, type: ['force', 'chord']},
                  saveAsImage : {show: true}
              }
          },
          // legend: {
          //     x: 'left',
          //     data:['家人','朋友']
          // },
          series : [
              {
                  type:'force',
                  name : "人物关系",
                  ribbonType: false,
                  // categories : [
                  //     {
                  //         name: '人物'
                  //     },
                  //     {
                  //         name: '家人'
                  //     },
                  //     {
                  //         name:'朋友'
                  //     }
                  // ],
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
                
                  gravity: 1.1,
                  scaling: 1.1,
                  roam: 'move',
                  //nodes:item['nodes'],
                  nodes:nodes_new,
		              links:item['links']
                  
              }
          ]
      };
      var ecConfig = require('echarts/config');
      function focus(param) {
          var data = param.data;
          var links = option.series[0].links;
          var nodes = option.series[0].nodes;
          if (
              data.source !== undefined
              && data.target !== undefined
          ) { //点击的是边
              var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
              var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
              console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
          } else { // 点击的是点
              console.log("选中了" + data.name + '(' + data.value + ')');
          }
      }
      myChart.on(ecConfig.EVENT.CLICK, focus)

      // myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
      //     console.log(myChart.chart.force.getPosition());
      // });
           
       myChart.setOption(option);           
          
    }  
);  
  },

  Draw_trend_maker:function(data){
    var item = data;
    var html = '';
    // console.log(item.length);
    html += '<table id="table_photo">';
    for(i=0;i<Math.min(30,item.length);i=i+5){
      console.log('mmm')
      html += '<tr>';
      for(j=0;j<5;j++){
        var k=i+j;
        if (item[k].photo=='no'){
          item[k].photo='../../static/info_consume/image/photo_unknown.png';
        }
        var item_timestamp_datetime = new Date(parseInt(item[k].timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        // html += '<td><img title=用户昵称：' +item[k].name+'<br/>粉丝数：'+item[k].fans+'<br/>发布时间：'+item[k].+'style="width:40px;height:40px" class="photo_user" src='+item[k].photo+'/><td>';
        
        html += '<td><img style="width:40px;height:40px;margin-top: 10px;" class="photo_user" title=发布时间：'+item_timestamp_datetime+' src='+item[k].photo+'/><td>';
        // html += '<td><img id="photo_user" style="width:40px;height:40px" onmouseover="showInfoCard('${id}')" class="photo_user" src='+item[k].photo+'/><td>';
        // html += '<td><img style="width:40px;height:40px" '+item[k].name+' class="photo_user" src='+item[k].photo+'/><td>';
        // html += '<div id="divInfo" style="visibility:hidden;">';
        // html += '<p>用户昵称：'+item[k].name+'</p><br/>';
        // html += '<p>粉丝数：'+item[k].fans+'</p><br/>';
        // html += '<p>发布时间：'+item[k].timestamp+'</p><br/>';
        // html += '</div>';

      }
      
      html += '</tr>'; 
      // html += ''
    }
    html += '</table>';
    
    
    $("table td").mouseover(function(){
            $("#divInfo").css("z-index",999999);//让层浮动

            $("#divInfo").css("top",this.top+行高);//设置提示div的位置

            $("#divInfo").css("left",11);

            $("#divInfo").css("visibility","visible");        
    })

    $('#right_col_title_2_network').append(html);
   
  },

  Draw_trend_pusher:function(data){
    var item = data;
    var html = '';

    // console.log(item.length);
    html += '<table id="table_photo">';
    for(i=0;i<Math.min(65,item.length);i=i+5){
  
    
      
      html += '<tr>';
      for(j=0;j<5;j++){
        var k=i+j;

        if (item[k].photo=='no'){
          item[k].photo='../../static/info_consume/image/photo_unknown.png';
        }
        
        html += '<td><img style="width:40px;height:40px;margin-top: 10px;" class="photo_user" title=粉丝数：'+item[k].fans+' src='+item[k].photo+'/><td>';
        

      }
      
      html += '</tr>'; 
      // html += '<div id="id" style="display:none; width:250px; height:150px; background-color:#D1EEEE;position:absolute;"></div>'
    }
    html += '</table>';
    
    $('#right_col_title_2_network').append(html);
  },

  Draw_blog_scan_area_network:function(data){
    $('#blog_scan_area_network').empty();
    var item = data;
    var html = '';
    var blog_num_max_local_network = Math.min(100,item.length);
    
    blog_num_max_global_network = blog_num_max_local_network;

    if (item.length == 0){
    html += '<div style="color:grey;">暂无数据</div>'
    }else{
      var num_page = Math.ceil(blog_num_max_local_network/10);  //num_page表示微博数据共有多少页
      var item_i_network = no_page_network*10;
      
      var max_i_network = item_i_network+Math.min(10,blog_num_max_local_network-item_i_network);
      
      for (i=item_i_network; i<max_i_network; i++){

  
        if (item[i]._source.photo_url=='no'){
          item[i]._source.photo_url='../../static/info_consume/image/photo_unknown.png'
        }
        if (item[i]._source.uname=='未知'){
          item[i]._source.uname='未知用户'
          //console.log(item[i][1].uname);
        }
        var item_timestamp_datetime = new Date(parseInt(item[i]._source.timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        html += '<div class="blog_time">';
        //html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div><img class="img-circle" src="'+item[i]._source.photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div>';
        //html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
        html += '<a target="_blank" href=" " class="user_name" style="float:left;">'+item[i]._source.uname+'</a>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        html += '</div>';
        html += '<div class="blog_text">'
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
        html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">'+item[i]._source.text+'</font></p>';
        html += '<p style="float: left;width: 100%;position: relative;margin-top: 3%;margin-left: 3%;font-family: Microsoft YaHei;">';
        //html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
        //html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
        html += '<span style="float:left;margin-top: -3%;">'+item_timestamp_datetime+'</span>';
        //html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+item[i]._source.retweeted+')&nbsp;|&nbsp;</span>';
        html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;|&nbsp;</span>';
        //html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >评论数('+item[i]._source.comment+')</span>';
        html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
        //html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        html += '</p>';
        html += '</div>';               
        html += '</div>';
      // }
      }
       html += '<div id="PageTurn" class="pager" style="margin-left:46.5%;height: 40px;margin-bottom: -20px;z-index: 99;">'
       html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
       html += '</div>'
      // html += '<div id="PageTurn" class="pager" style="margin-left:40%;">'
      //   html += '<span >共<font id="P_RecordCount" style="color:#FF9900;">'+item.length+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
      //   html += '<span >第<font id="P_Index" style="color:#FF9900;"></font><font id="P_PageCount" style="color:#FF9900;">'+1+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</span>'
      //   html += '<span >每页<font id="P_PageSize" style="color:#FF9900;">'+10+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
      //   html += '<span id="S_First" class="disabled" >首页</span>'
      //   html += '<span id="S_Prev"  class="disabled" >上一页</span>'
      //   html += '<span id="S_navi"><!--页号导航--></span>'
      //   html += '<span id="S_Next"  class="disabled" >下一页</span>'
      //   html += '<span id="S_Last"  class="disabled" >末页</span>'
      //   html += '<input id="Txt_GO" class="cssTxt" name="Txt_GO" type="text" size="1" style="width: 35px;height: 20px;"  /> '
      //   html += '<span id="P_GO" >GO</span>'
      // html += '</div>'
    
    }
    
    
    $('#blog_scan_area_network').append(html);
    
  },

}

topic_analysis_network = new topic_analysis_network();

function Draw_network_pic_result(){
  url = "/topic_network_analyze/get_gexf/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_network_pic);

}

function Draw_trend_maker_result(){
  start_ts = 1467648000;
  end_ts = 1470844800;
  url = "/topic_network_analyze/get_trend_maker/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_maker);
}

function Draw_trend_pusher_result(){
  start_ts = 1467648000;
  end_ts = 1470844800;
  url = "/topic_network_analyze/get_trend_pusher/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_pusher);
}
 
function Draw_blog_scan_area_network_result(){
  start_ts = 1467648000;
  end_ts = 1470844800;
  if(sort_item_network=='timestamp' && blog_type_network == 'maker'){

    url = "/topic_network_analyze/maker_weibos_byts/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts; 

  }else if(sort_item_network=='timestamp' && blog_type_network == 'pusher'){

    url = "/topic_network_analyze/pusher_weibos_byts/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;

  }else if(sort_item_network=='retweeted' && blog_type_network == 'maker'){

    url = "/topic_network_analyze/maker_weibos_byhot/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;

  }else if(sort_item_network=='retweeted' && blog_type_network == 'pusher'){

    url = "/topic_network_analyze/pusher_weibos_byhot/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;

  }
  
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_blog_scan_area_network);
}   





Draw_network_pic_result();


Draw_trend_maker_result();
// Draw_trend_pusher_result();
Draw_blog_scan_area_network_result();


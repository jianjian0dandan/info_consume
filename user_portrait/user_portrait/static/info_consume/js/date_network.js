var topic = 'aoyunhui';
var start_ts = 1467648000;
var end_ts = 1470844800;

//显示资料卡 
var beforeId; //定义全局变量 
function showInfoCard(thisObj,id){ 
this.hidden(beforeId); //立刻隐藏前一个选中弹出来的div 
beforeId = id; 
// alert(id); 
// var d = $(thisObj); 
// var pos = d.offset(); 
// var t = pos.top + d.height() - 5; // 弹出框的上边位置 
// var l = pos.left - d.width() - 600; // 弹出框的左边位置 
// $("#"+id).css({ "top": t, "left": l }).show(); 
// 
 
var objDiv = $("#"+id); 
 
$(objDiv).css("display","block"); 
 
$(objDiv).css("left", event.clientX-280); //弹出框的位置X值 
 
$(objDiv).css("top", event.clientY-10); //弹出框位置Y值 
} 
function hideInfoCard(id){ //隐藏div 
//延时3秒 
setTimeout('hidden('+id+')',3000); 
} 
 
function hidden(id){ 
$("#"+id).hide(); 
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
     // console.log(data);
  },

  Draw_trend_maker:function(data){
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
        // html += '<td><img title=用户昵称：' +item[k].name+'<br/>粉丝数：'+item[k].fans+'<br/>发布时间：'+item[k].timestamp+'style="width:40px;height:40px" class="photo_user" src='+item[k].photo+'/><td>';
        // html += '<td><img style="width:40px;height:40px" class="photo_user" src='+item[k].photo+'title="用户昵称"/><td>';
        // html += '<td><img style="width:40px;height:40px" onmouseover="showInfoCard(this,'${friend.friendId}')" class="photo_user" src='+item[k].photo+'/><td>';
        // html += '<td><img style="width:40px;height:40px" '+item[k].name+' class="photo_user" src='+item[k].photo+'/><td>';
        // html += '<div id="divInfo" style="visibility:hidden;">';
        // html += '<p>用户昵称：'+item[k].name+'</p><br/>';
        // html += '<p>粉丝数：'+item[k].fans+'</p><br/>';
        // html += '<p>发布时间：'+item[k].timestamp+'</p><br/>';
        // html += '</div>';

      }
      
      html += '</tr>'; 
      
    }
    html += '</table>';
    
    
    $("table td").mouseover(function(){
            $("#divInfo").css("z-index",999999);//让层浮动

            $("#divInfo").css("top",this.top+行高);//设置提示div的位置

            $("#divInfo").css("left",11);

            $("#divInfo").css("visibility","visible");        
    })

    $('#right_col_title_2_network').append(html);
    console.log('aaa');
  },

  Draw_trend_pusher:function(data){
    console.log(data);
  },



}

topic_analysis_network = new topic_analysis_network();

function Draw_network_pic_result(){
  url = "/topic_network_analyze/get_gexf/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_network_pic);

}

function Draw_trend_maker_result(){
  url = "/topic_network_analyze/get_trend_maker/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_maker);
}

function Draw_trend_pusher_result(){
  url = "/topic_network_analyze/get_trend_pusher/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_pusher);
}

Draw_network_pic_result();
Draw_trend_maker_result();
Draw_trend_pusher_result();


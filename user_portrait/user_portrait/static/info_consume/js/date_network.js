var topic = 'aoyunhui';
var start_ts = 1467648000;
var end_ts = 1470844800;



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
  	console.log(data);
  },

}

function Draw_network_pic_result(){
	url = "/topic_network_analyze/get_gexf/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	console.log(url);
 	topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_network_pic);

}

Draw_network_pic_result();


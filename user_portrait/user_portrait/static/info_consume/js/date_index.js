var topics = [];
var starts_time = [];
var ends_time = [];


function topic_analysis_index(){
 
}

topic_analysis_index.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },

  
  Draw_topic_name: function(data){
  	var item = data;
  	console.log(item);
  	var html = '';
  	for(key in item){
  		topics.push(item[key][0]);
  		starts_time.push(item[key][1]);
  		ends_time.push(item[key][2]);
  	}
  	console.log(topics);

  	html += '<table id="table">';
  	for(i=0;i<4;i++){
  		html += '<tr class="height">';
  		for(j=0;j<3;j++){
  			html += '<td><img class="topic_tag" id="topic_tag" src="../../static/info_consume/image/topic_tag.png"></td>';
  			html += '<td><p id="topic" class="topic_font"><a href="/topic_time_analyze/time">#'+topics[i]+'#</a></p></td>';
  		}
  		html += '</tr>';
  	}
	html += '</table>';
	$('#index_bottom').append(html);
  },

}

var topic_analysis_index = new topic_analysis_index();
 
function Draw_topic_name_result(){
	
    url = "/topic_language_analyze/topics/";
 	console.log(url);
 	topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_topic_name);
}	

Draw_topic_name_result();
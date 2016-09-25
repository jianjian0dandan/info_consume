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
    console.log(topics.length);
    var num_row = 0;
    html += '<center>';
  	html += '<table id="table" align="center" style = "margin-bottom:150px;margin-right: auto;margin-left: auto;">';
  	for(i=0;i<Math.min(4,Math.ceil(topics.length/3));i++){
  		html += '<tr class="height">';
  		for(j=num_row;j<(num_row+3);j++){
        if(topics[j]){
          html += '<td><img class="topic_tag" id="topic_tag" src="../../static/info_consume/image/topic_tag.png"></td>';
          html += '<td><p id="topic" class="topic_font"><a href="/topic_time_analyze/time">#'+topics[j]+'#</a></p></td>';
        }
  		}
      if(num_row<Math.min(4,Math.ceil(topics.length/3))){
        num_row = num_row+3;
      }
  		html += '</tr>';
  	}
	html += '</table>';
  html += '</center>';
	$('#index_bottom').append(html);
  var win_width=window.screen.availWidth;
  var table_width=table.width; 
  var table_left=(win_width-table_width)/2; 
  // $('#table').style("left",table_left);
  },

}

var topic_analysis_index = new topic_analysis_index();
 
function Draw_topic_name_result(){
	
    url = "/topic_language_analyze/topics/";
 	console.log(url);
 	topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_topic_name);
}	

Draw_topic_name_result();
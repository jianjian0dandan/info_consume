var topics = [];
var starts_time = [];
var ends_time = [];

var topic_name='';
var date_from='';
var date_to='';

function go_to_datail(){

    window.open('/topic_time_analyze/time/?topic_name='+topic_name+'&date_from='+date_from+'&date_to='+date_to);
}


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

          topic_name=topics[j];
          date_from = new Date(parseInt(starts_time[j]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          date_to = new Date(parseInt(ends_time[j]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          // date_from = starts_time[j];
          // date_to = ends_time[j];
          html += '<td><img class="topic_tag" id="topic_tag" src="../../static/info_consume/image/topic_tag.png"></td>';
          // html += '<td><p id="topic" class="topic_font"><a href="/topic_time_analyze/time/" onclick="go_to_datail('+topic_name+','+date_from+','+date_to+')">#'+topics[j]+'#</a></p></td>';
          html += '<td><p id="topic" class="topic_font" onclick="go_to_datail()"><a style="color: #00CC66;">#'+topics[j]+'#<a></p></td>';
          
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
  
  },

}

var topic_analysis_index = new topic_analysis_index();
 
function Draw_topic_name_result(){
  url = "/topic_language_analyze/topics/";
 	console.log(url);
 	topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_topic_name);
}	

Draw_topic_name_result();
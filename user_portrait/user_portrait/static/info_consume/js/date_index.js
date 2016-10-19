var topics = [];
var starts_time = [];
var ends_time = [];

var topic_name='';
var date_from='';
var date_to='';



// function set_timestamp(){
//  var start_time_new = get_timestamp().start_return;
//  var end_time_new = get_timestamp().end_return; 
//  var start_timestamp = datetime_to_timestamp(start_time_new);
//  var end_timestamp = datetime_to_timestamp(end_time_new);
  
//  start_ts = start_timestamp;
//  end_ts = end_timestamp;

// }


// function get_timestamp(){
//  var start_time = $('#input_date_from_create').val(); 
//  var end_time = $('#input_date_to_create').val();
//  return {
//    start_return:start_time,
//    end_return:end_time
//  };
// }


function datetime_to_timestamp(datetime) {
     var date_time_string = datetime;
     var date_time_array =date_time_string.split(/[/: ]/);
     var date_array_new = [date_time_array[2],date_time_array[0],date_time_array[1]];
     if (date_time_array[5] == 'PM'){
       date_time_array[3] = parseInt(date_time_array[3])+12;  //替换元素，小时数字加12
     }
     var time_array_new = [date_time_array[3],date_time_array[4],'00'];
     var timestamp_date_str = date_array_new.join('/');
     var timestamp_time_str = time_array_new.join(':');
     var timestamp_time_array = [timestamp_date_str,timestamp_time_str]
     var timestamp_str = timestamp_time_array.join(' ');
     var timestamp = (new Date(timestamp_str)).getTime()/1000;
     return timestamp;
 }

function check_status(){

}


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

  Submit_task:function(data){
      // var item = data;
      console.log('99999');
      console.log(data);

  },

  Draw_hot_topic:function(data){
    
    var html='';
    html += '<center>';
    html += '<table class="table table-bordered" style="width:60%;margin-top:4%">';
    html += '<caption style="color: #00CC66;font-size: 28px;font-family: Microsoft YaHei;text-align:center;">热门话题推荐</caption>';
    html += '<thead><tr><th>话题名称</th><th>开始时间</th><th>终止时间</th><th>计算状态</th><th>操作</th></tr></thead>';
    html += '<tbody>';
    for(key in data['recommend']){

      html += '<tr>';
      html += '<td>'+data['recommend'][key][0][0]+'</td>';
      var start_time = new Date(parseInt(data['recommend'][key][0][1]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
      var end_time = new Date(parseInt(data['recommend'][key][0][2]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
      var compute_status='';
      if(data['recommend'][key][0][3]== -1){
        compute_status = '尚未计算'
      }else if(data['recommend'][key][0][3]== 0){
        compute_status = '正在计算'
      }else if(data['recommend'][key][0][3]== 1){
        compute_status = '计算完成'
      }
      html += '<td>'+start_time+'</td>';
      html += '<td>'+end_time+'</td>';
      html += '<td>'+compute_status+'</td>';
      html += '<td><a href="" onclick="go_to_datail()">'+'查看详情'+'</a></td>';
      html += '<tr>';
    }
    html += '</tbody></table></center>';
    html += '<button type="button" class="btn btn-success" style="margin-left: 70%;" onclick="">创建我的话题任务</button>';
    $('#index_bottom').append(html);

  },

  Draw_similar_topic:function(data){
    $('#index_bottom').empty();
    var html='';
    html += '<center>';
    html += '<table class="table table-bordered" style="width:60%;margin-top:4%">';
    html += '<caption style="color: #00CC66;font-size: 28px;font-family: Microsoft YaHei;text-align:center;">相似话题推荐</caption>';
    html += '<thead><tr><th>话题名称</th><th>开始时间</th><th>终止时间</th><th>计算状态</th><th>操作</th></tr></thead>';
    html += '<tbody>';
    for(key in data[key]){
      for(i=0;i<data[key].length;i++){
          html += '<tr>';
          html += '<td>'+data[key][i][0]+'</td>';
          var start_time = new Date(parseInt(data[key][i][1]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          var end_time = new Date(parseInt(data[key][i][2]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          var compute_status='';
          if(data[key][i][3]== -1){
            compute_status = '尚未计算'
          }else if(data[key][i][3]== 0){
            compute_status = '正在计算'
          }else if(data[key][i][3]== 1){
            compute_status = '计算完成'
          }
          html += '<td>'+start_time+'</td>';
          html += '<td>'+end_time+'</td>';
          html += '<td>'+compute_status+'</td>';
          html += '<td><a href="" onclick="go_to_datail()">'+'查看详情'+'</a></td>';
          html += '<tr>';
      }
    
    }
    html += '</tbody></table></center>';

    $('#index_bottom').append(html);
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


function Draw_hot_topic_result(){
  var user = '奥运';
  url = "/topic_language_analyze/topics/?user"+user;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_hot_topic);
} 

function Draw_similar_topic_result(){
  var keyword = '奥运';
  url = "/topic_language_analyze/key_topics/?keywords"+keyword;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_similar_topic);
} 
 

function Draw_topic_name_result(){
  url = "/topic_language_analyze/topics/";
 	console.log(url);
 	topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_topic_name);
}	

function Submit_task_result(){
  var topic = '试';
  var start_ts=1468080000;
  var end_ts=1468944000;
  var en_name = 'try';
  var submit_user = 'admin@qq.com';
  url = "/topic_language_analyze/submit_task/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&en_name='+en_name+'&submit_user='+submit_user;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Submit_task);
  console.log('888');
} 
Draw_hot_topic_result();
// Draw_topic_name_result();
// Submit_task_result();
// var compute_status_glo='';

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

// function submit_topic(){
//   Draw_similar_topic_result();
//   Submit_task_result();
// }

function go_to_datail(topic_name,en_name,date_from,date_to,compute_status){

     // alert('zhixingle1111');
    if(compute_status=='尚未计算'){
      alert('尚未计算，请稍后查看。');
    }else if(compute_status=='正在计算'){
      alert('正在计算，请稍后查看。');
    }else if(compute_status=='计算完成'){
      window.open('/topic_time_analyze/time/?topic_name='+topic_name+'&en_name='+en_name+'&date_from='+date_from+'&date_to='+date_to);
    }
    
}

function commit_delete(en_name,start_ts,end_ts,submit_user){
  // console('确定要删除吗！！！！');
  // var a = confirm('确定要删除吗？');
  // console.log(en_name);
  if(confirm("确定要删除吗？")){
    console.log('确定要删除！！！！');
    Delete_task_result(en_name,start_ts,end_ts,submit_user);
    
  }
}

function topic_analysis_index(){
 
}

topic_analysis_index.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },

  Submit_task:function(data){
      // var item = data;
      // console.log('99999');
      
      console.log(data);
      if(data=='success'){
        alert('任务提交成功！');
      }else if(data=='already_have'){
        alert('当前任务已经存在！');
      }
      window.location.reload();
      // Draw_all_topic_result();
  },

  Delete_task:function(data){
      // var item = data;
      // console.log('99999');
      // data='true';
      console.log(data);
      if(data=='-1'){
        alert('删除失败！');
      }else if(data=='true'){
        alert('删除成功！');
      }
      // window.location.reload();
      // Draw_all_topic_result();
  },


  Draw_similar_topic:function(data){

    // var create_topic_name=$("#create_topic").val();
    // var create_date_from=$("#input_date_from_create").val();
    // var create_date_to=$("#input_date_to_create").val();
    // var data=''; 
    $('#index_bottom').empty();
    var html='';
    
    if(!data){
      html += '<div style="margin-top: 8%;margin-left: 38%;font-size: 18px;font-family: Microsoft YaHei;color: #00CC66;">当前话题任务在库里找不到，快来自己创建吧~ </div>';
    }else{
      
      html += '<center>';
      html += '<table class="table table-bordered" style="width:60%;margin-top:4%">';
      html += '<caption style="color: #00CC66;font-size: 28px;font-family: Microsoft YaHei;text-align:center;">相似话题推荐</caption>';
      html += '<thead><tr><th>话题名称</th><th>开始时间</th><th>终止时间</th><th>计算状态</th><th>操作</th></tr></thead>';
      html += '<tbody>';

      for(key in data){
        console.log(key);
        console.log(data[key]);
        for(i=0;i<data[key].length;i++){
            html += '<tr>';
            html += '<td>'+data[key][i][0]+'</td>';
            var start_time = new Date(parseInt(data[key][i][1]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            var end_time = new Date(parseInt(data[key][i][2]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            var compute_status='';

            if(data[key][i][3]== 0){
              compute_status = '尚未计算';
            }else if(data[key][i][3]== -1){
              compute_status = '正在计算';
            }else if(data[key][i][3]== 1){
              compute_status = '计算完成';
            }
            html += '<td>'+start_time+'</td>';
            html += '<td>'+end_time+'</td>';
            html += '<td>'+compute_status+'</td>';
            var topic_name=data[key][i][0];
            var en_name=key;
            var date_from = data[key][i][1];
            var date_to=data[key][i][2];
            html += '<td><a href="" onclick="go_to_datail(\''+ topic_name +'\',\''+ en_name +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ compute_status +'\')">'+'查看'+'</a> <a href="" onclick="commit_delete(\''+ en_name +'\',\''+ start_time +'\',\''+ end_time +'\',\''+ user_glo +'\')">'+'删除'+'</a> <a href="" onclick="window.location.reload()">'+'刷新'+'</a></td>';
            html += '<tr>';

        }
      
      }
      html += '</tbody></table></center>';
      // html += '<button type="button" class="btn btn-success" style="margin-left: 60%;" onclick="window.location.reload();">计算状态刷新</button>';

    }

    
    html += '<button type="button" class="btn btn-success" style="margin-left: 70%;margin-top: 0%;" data-toggle="modal" data-target="#create_task">创建我的话题任务</button>';
    $('#index_bottom').append(html);
  },

  Draw_all_topic:function(data){
    console.log(data);
    $('#index_bottom').empty();
    var html='';
    html += '<center>';
    html += '<table class="table table-bordered" style="width:60%;margin-top:4%">';
    html += '<caption style="color: #00CC66;font-size: 28px;font-family: Microsoft YaHei;text-align:center;">我的话题&热门推荐</caption>';
    html += '<thead><tr><th>任务类型</th><th>话题名称</th><th>开始时间</th><th>终止时间</th><th>计算状态</th><th>操作</th></tr></thead>';
    html += '<tbody>';

    for(key in data['own']){
      console.log(data['own'][key].length);
      console.log(key);

      for(i=0;i<data['own'][key].length;i++){

        html += '<tr>';
        html += '<td>'+'我的创建'+'</td>';
        html += '<td>'+data['own'][key][i][0]+'</td>';
        var start_time = new Date(parseInt(data['own'][key][i][1]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        var end_time = new Date(parseInt(data['own'][key][i][2]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        var compute_status='';
        
        if(data['own'][key][i][3]== 0){
          compute_status = '尚未计算'
        }else if(data['own'][key][i][3]== -1){
          compute_status = '正在计算'
        }else if(data['own'][key][i][3]== 1){
          compute_status = '计算完成'
        }
        html += '<td>'+start_time+'</td>';
        html += '<td>'+end_time+'</td>';
        html += '<td>'+compute_status+'</td>';
        var topic_name=data['own'][key][i][0];
        var en_name=key;
        var date_from = data['own'][key][i][1];
        var date_to=data['own'][key][i][2];
        html += '<td><a href="" onclick="go_to_datail(\''+ topic_name +'\',\''+ en_name +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ compute_status +'\')" target="_blank">'+'查看'+'</a> <a href="" onclick="commit_delete(\''+ en_name +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ user_glo +'\')">'+'删除'+'</a> <a href="" onclick="window.location.reload()">'+'刷新'+'</a></td>';
        html += '<tr>';
      }
      
    }
    for(key in data['recommend']){
       for(i=0;i<data['recommend'][key].length;i++){
          html += '<tr>';
          html += '<td>'+'热门推荐'+'</td>';
          html += '<td>'+data['recommend'][key][i][0]+'</td>';
          var start_time = new Date(parseInt(data['recommend'][key][i][1]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          var end_time = new Date(parseInt(data['recommend'][key][i][2]) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
          var compute_status='';
          if(data['recommend'][key][i][3]== 0){
            compute_status = '尚未计算'
          }else if(data['recommend'][key][i][3]== -1){
            compute_status = '正在计算'
          }else if(data['recommend'][key][i][3]== 1){
            compute_status = '计算完成'
          }
          html += '<td>'+start_time+'</td>';
          html += '<td>'+end_time+'</td>';
          html += '<td>'+compute_status+'</td>';
          var topic_name=data['recommend'][key][i][0];
          var en_name=key;
          var date_from=data['recommend'][key][i][1];
          var date_to=data['recommend'][key][i][2];
          // html += '<td><a href="/topic_time_analyze/time/?topic_name='+topic_name+'&date_from='+date_from+'&date_to='+date_to+'" target="_blank">'+'查看'+'</a> <a href="" onclick="commit_delete(\''+ key +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ user_glo +'\')">'+'删除'+'</a> <a href="" onclick="window.location.reload()">'+'刷新'+'</a></td>';
          html += '<td><a href="" onclick="go_to_datail(\''+ topic_name +'\',\''+ en_name +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ compute_status +'\')" target="_blank">'+'查看'+'</a> <a href="" onclick="commit_delete(\''+ en_name +'\',\''+ date_from +'\',\''+ date_to +'\',\''+ user_glo +'\')">'+'删除'+'</a> <a href="" onclick="window.location.reload()">'+'刷新'+'</a></td>';
          html += '<tr>';
          // console.log(key);

       }
      
    }
    html += '</tbody></table></center>';
    // html += '<button type="button" class="btn btn-success" style="margin-left: 70%;" data-toggle="modal" data-target="#create_task">创建我的话题任务</button>';
    // html += '<button type="button" class="btn btn-success" style="margin-left: 60%;" onclick="window.location.reload();">计算状态刷新</button>';
    // html += '<button type="button" class="btn btn-success" style="margin-left: 70%;margin-top: -4.1%;" data-toggle="modal" data-target="#create_task">创建我的话题任务</button>';
    $('#index_bottom').append(html);
  },


}

var topic_analysis_index = new topic_analysis_index();


function Draw_similar_topic_result(){
  var keyword = $('#input').val();
  console.log(keyword);
  url = "/topic_language_analyze/key_topics/?keyword="+keyword;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_similar_topic);
} 
 
function Draw_all_topic_result(){
 
  var user = user_glo;
  url = "/topic_language_analyze/topics/?user="+user;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Draw_all_topic);
} 

function Submit_task_result(){
  var topic = $("#create_topic").val();
  var start_ts=datetime_to_timestamp($("#input_date_from_create").val());
  var end_ts=datetime_to_timestamp($("#input_date_to_create").val());
  var submit_user = user_glo;
  url = "/topic_language_analyze/submit_task/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&submit_user='+submit_user;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Submit_task);
  
} 

function Delete_task_result(en_name,start_ts,end_ts,submit_user){
  // var topic = $("#create_topic").val();
  // var start_ts=datetime_to_timestamp($("#input_date_from_create").val());
  // var end_ts=datetime_to_timestamp($("#input_date_to_create").val());
  // var submit_user = user_glo;
  console.log('4444');
  url = "/topic_language_analyze/delete_task/?en_name=" + en_name+'&start_ts='+start_ts+'&end_ts='+end_ts+'&submit_user='+submit_user;
  console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Delete_task);
} 

Draw_all_topic_result();
// Draw_hot_topic_result();
// Draw_topic_name_result();
// Submit_task_result();
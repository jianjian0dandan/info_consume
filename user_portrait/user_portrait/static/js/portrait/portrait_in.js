// Date format
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)){
        format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
function Search_weibo_recommend(url, div){
  that = this;
  this.ajax_method = 'GET';
  this.url = url;
  this.div = div;
}

Search_weibo_recommend.prototype = {
  call_sync_ajax_request:function(url, method, callback){
    $.ajax({
      url: url,
      type: method,
      dataType: 'json',
      async: true,
      success:callback
    });
  },
  Re_Draw_table: function(data,type){
    //console.log(data);
    //var type = $('#input_choose option:selected').text(); 
    //var type = $('input[name="recommend_type"]:checked').val();
    var div = that.div;
    $(div).empty();
    var user_url;
    html = '';
    html += '<table id="recommend_table_new" style="word-wrap: break-word;word-break: break-all;table-layout:fixed;" class="table table-striped table-bordered bootstrap-datatable datatable responsive">';
    html += '<thead><tr><th width="75">用户ID</th>';
    html += '<th width="80">昵称</th>';
    html += '<th width="80">注册地</th>';
    html += '<th width="50">粉丝数</th>';
    html += '<th width="50">微博数</th>';
    html += '<th width="50">影响力</th>';
    if (type == 'sensitive'){
        html += '<th width="60">言论敏感度</th>';
        html += '<th width="100" >敏感词</th>';
    }
    html += '<th width="55">网民详情</th>';
    html += '<th width="20">' + '<input name="page_all" id="page_all" type="checkbox" value="" onclick="recommend_all()" />' + '</th></tr></thead>';
    var item = data;
    html += '<tbody>';
    for(var i in item){
      item[i] = replace_space(item[i]);
      if (item[i][1] == '未知'){
          item[i][1] = item[i][0];
      } 
      if(item[i][5]!='未知'){
        item[i][5] = item[i][5].toFixed(2);
      }
      else{
          item[i][5] = '';
      }
      if (item[i][3] == '未知'){
          item[i][3] = '';
      }
      if (item[i][4] == '未知'){
          item[i][4] = '';
      }
      user_url = '/index/personal_out/?uid=';
      user_url = user_url + item[i][0];
      html += '<tr>';
      html += '<td class="center"><a href='+ user_url+ ' target="_blank">'+ item[i][0] +'</td>';
      html += '<td class="center">'+ item[i][1] +'</td>';
      html += '<td class="center">'+ item[i][2] +'</td>';
      html += '<td class="center">'+ item[i][3] +'</td>';
      html += '<td class="center">'+ item[i][4] +'</td>';
      html += '<td class="center">'+ item[i][5] +'</td>';
      if (type == 'sensitive'){
          html += '<td class="center">'+item[i][7].toFixed(2)+'</td><td class="center">'+ item[i][6] +'</td>';
      }
      html += '<td class="center"><a style="cursor:pointer;" name="details" id="'+ item[i][0] +'" title="'+ item[i][1] +'">网民详情</a></td>';
      html += '<td class="center"><input name="in_status" class="in_status" type="checkbox" value="' + item[i][0] + '" /></td>';
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    $(div).append(html);

    $('#in_onload').css('display','none');
    $('#recommend').css('display','block');
    $('#choose_in').css('display','block');
    //console.log(data)
    $('[name="details"]').click(function(){
      var detail_uid = $(this).attr('id');
      var detail_uname = $(this).attr('title');
      var detail_url = '/recommentation/show_in_more/?uid=' + detail_uid;
      $.ajax({
        url: detail_url,
        type: 'GET',
        dataType: 'json',
        async: false,
        success:show_details
      });
      function show_details(data){
        if(data['time_trend'].length==0){
          $('#line_chart').empty();
          $('#line_chart').append('<div style="text-align:center">暂无数据！</div>');
        }
        else{
          //$('#line_chart').empty();
          var line_chart_xaxis = [];
          for(var k in data['time_trend'][0])
            line_chart_xaxis.push(new Date(parseInt(data['time_trend'][0][k])*1000).format("MM-dd hh:mm"));
          var line_chart_yaxis = data['time_trend'][1];
          draw_line_chart(line_chart_xaxis.reverse(), line_chart_yaxis.reverse(), 'line_chart', detail_uname);
        }
        $('#place').empty();
        if(data['activity_geo'].length==0){
          $('#in_detail').css('height','70px');
          $('#place').append('<h4 style="text-align:center">活跃地点</h4><div style="text-align:center">暂无数据！</div>');
        }
        else{
          $('#in_detail').css('height','300px');
          var place_html = '';
          place_html += '<h4 style="text-align:center">活跃地点</h4>';
          place_html += '<table class="table table-striped table-bordered bootstrap-datatable datatable responsive">';
          place_html += '<thead><tr><th style="text-align:center;vertical-align:middle;width:80px">排名</th><th style="text-align:center;vertical-align:middle;width:200px">地点</th><th style="text-align:center;vertical-align:middle;width:80px">微博数</th></tr></thead>';
          place_html += '<tbody>';
          for(var m in data['activity_geo']){
            if(parseInt(m)<5){
              place_html += '<tr>';
              place_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ (parseInt(m)+1) +'</td>';
              place_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ data['activity_geo'][m][0] +'</td>';
              place_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ data['activity_geo'][m][1] +'</td>';
              place_html += '</tr>';
            }
          }
          place_html += '</tbody>';
          place_html += '</table>';

          $('#place').append(place_html);
        }

        $('#hashtag').empty();
        if(data['hashtag'].length==0){
          $('#hashtag').append('<h4 style="text-align:center">微话题</h4><div style="text-align:center">暂无数据！</div>');
        }
        else{
          $('#in_detail').css('height','300px');
          var hashtag_html = '';
          hashtag_html += '<h4 style="text-align:center">微话题</h4>';
          hashtag_html += '<table class="table table-striped table-bordered bootstrap-datatable datatable responsive">';
          hashtag_html += '<thead><tr><th style="text-align:center;vertical-align:middle;width:80px">排名</th><th style="text-align:center;vertical-align:middle;width:200px">微话题</th><th style="text-align:center;vertical-align:middle;width:80px">微博数</th></tr></thead>';
          hashtag_html += '<tbody>';
          for(var n in data['hashtag']){
            if(parseInt(n)<5){
              hashtag_html += '<tr>';
              hashtag_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ (parseInt(n)+1) +'</td>';
              hashtag_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ data['hashtag'][n][0] +'</td>';
              hashtag_html += '<td class="center" style="text-align:center;vertical-align:middle">'+ data['hashtag'][n][1] +'</td>';
              hashtag_html += '</tr>';
            }
          }
          hashtag_html += '</tbody>';
          hashtag_html += '</table>';
          $('#hashtag').append(hashtag_html);
        }

        $('#details_modal').modal();
      }
    });

    if (type == 'sensitive'){
    $('#recommend_table_new').dataTable({
        "sDom": "<'row'<'col-md-6'l ><'col-md-6'f>r>t<'row'<'col-md-12'i><'col-md-12 center-block'p>>",
        "sPaginationType": "custom_bootstrap",
        "aaSorting":[[6,"desc"]],
        "aoColumnDefs":[ {"bSortable": false, "aTargets":[8]}, {"bSortable": false, "aTargets":[9]},{"sWidth": "4em" ,"aTargets":[0]},{"sWidth": "4em" ,"aTargets":[1]}, {"sWidth": "4em" ,"aTargets":[2]},{"sWidth": "3em" ,"aTargets":[3]},{"sWidth": "4em" ,"aTargets":[4]},{"sWidth": "4em" ,"aTargets":[5]},{"sWidth": "4em" ,"aTargets":[6]},{"sWidth": "5em" ,"aTargets":[7]},{"sWidth": "5em" ,"aTargets":[8]}, {"sWidth": "4em" ,"aTargets":[9]}],
        "oLanguage": {
            "sLengthMenu": "每页_MENU_条",
        }
    });
    //$('#recommend_out_table_new thead th').removeAttr("style");
    $('#recommend_table_new thead th').removeAttr('style');
    }else{
    $('#recommend_table_new').dataTable({
        "sDom": "<'row'<'col-md-6'l ><'col-md-6'f>r>t<'row'<'col-md-12'i><'col-md-12 center-block'p>>",
        "sPaginationType": "custom_bootstrap",
        "aoColumnDefs":[ {"bSortable": false, "aTargets":[6]}, {"bSortable": false, "aTargets":[7]}],
        "aaSorting":[[5,"desc"]],
        "oLanguage": {
            "sLengthMenu": "每页_MENU_ 条",
        }
    });
    }
    // page control start
    global_pre_page = 1;
    global_choose_uids = new Array();
    // page control end
  }
}

function confirm_ok(data){
  if(data)
    alert('操作成功！');
}

function bindOption(){
      $('#recommend_button').click(function(){
//          if ($('#input_choose option:selected').val() == 'upload'){
//              if (seed_user_files == undefined){
//                  alert('请选择文件上传！');
//                  return false;
//              }
//              var upload_job = {};
//              var admin = $('#useremail').text();
//              upload_job['user'] = admin;
//              upload_job['type'] = $('#file_type').val();
//              upload_job['date'] = new Date().format('yyyy-MM-dd');
//              upload_job['opration_type']='show';
//              //upload_job['date'] = '2013-09-06';
//              handleFileSelect(upload_job);
//          }
//          else{
		  var cur_uids = [];
		  $('input[name="in_status"]:checked').each(function(){
		    cur_uids.push($(this).attr('value'));
		  })
		  global_choose_uids[global_pre_page] = cur_uids;
		  var recommend_uids = [];
		  for (var key in global_choose_uids){
		      var temp_list = global_choose_uids[key];
		      for (var i = 0;i < temp_list.length;i++){
			  recommend_uids.push(temp_list[i]);
		      }
		  }
		  //var recommend_date = $("#recommend_date_select").val()
		 var recommend_date = $("#recommend_date_select option:selected").val();
		 var uids_trans = '';
		  for(var i in recommend_uids){
		      uids_trans += recommend_uids[i];
		      if(i<(recommend_uids.length-1))
			uids_trans += ',';
		  }
		  if(recommend_uids.length == 0){
		    alert("请选择至少一个用户！");
		  }
		  else{
		      $('#recommend').empty();
		      //var waiting_html = '<div style="text-align:center;vertical-align:middle;height:40px">数据正在加载中，请稍后...</div>';
		      //$('#recommend').append(waiting_html);
		      $('#in_onload').css('display','block');
              var admin =$('#useremail').text();
		      var recommend_confirm_url = '/recommentation/identify_in/?submit_user='+admin+'&date=' + recommend_date + '&uid_list=' + uids_trans;
		      draw_table_recommend.call_sync_ajax_request(recommend_confirm_url, draw_table_recommend.ajax_method, confirm_ok);
		      
              //var recommend_type = $('input[name="recommend_type"]:checked').val();
              var recommend_type = $('#input_choose option:selected').val();
		      if (recommend_type == 'auto'){
                  var url_recommend_new = '/recommentation/show_auto_in/?submit_user='+admin+'&date=' + $("#recommend_date_select").val();
              }
              else{
                  var url_recommend_new = '/recommentation/show_in/?submit_user='+admin+'&date=' + $("#recommend_date_select").val() + '&type=' + recommend_type;
              }
              draw_table_recommend_new = new Search_weibo_recommend(url_recommend_new, '#recommend');
		      draw_table_recommend_new.call_sync_ajax_request(url_recommend_new, draw_table_recommend_new.ajax_method, function(data){draw_table_recommend_new.Re_Draw_table(data,recommend_type)});
		  }
//          }
      });
      
      $('#recommend_date_button').click(function(){
          //$('#in_onload').css('display','block');
          $('#recommend').css('display','none');
          $('#choose_in').css('display','none');
          $('#recommend').empty();
          //var recommend_type = $('input[name="recommend_type"]:checked').val();
          if ($('#input_choose option:selected').val() == 'upload'){
              if (seed_user_files == undefined){
                  alert('请选择文件上传！');
                  return false;
              }
              var upload_job = {};
              var admin = $('#useremail').text();
              upload_job['user'] = admin;
              upload_job['type'] = $('#file_type').val();
              upload_job['date'] = new Date().format('yyyy-MM-dd');
              upload_job['operation_type']='show';
              //upload_job['date'] = '2013-09-06';
              handleFileSelect(upload_job);
          }else{
          $('#in_onload').css('display','block');
          var recommend_type = $('#input_choose option:selected').val();
          var admin =$('#useremail').text();
          var date = $('#recommend_date_select option:selected').val();
          // $("#recommend_date_select").val();
          if (recommend_type == 'auto'){
              var url_recommend_new = '/recommentation/show_auto_in/?submit_user='+admin+'&date=' + date;
          }
          else{
              var url_recommend_new = '/recommentation/show_in/?submit_user='+admin+'&date=' + date + '&type=' + recommend_type;
          }
          console.log(url_recommend_new);
          draw_table_recommend_new = new Search_weibo_recommend(url_recommend_new, '#recommend');
          draw_table_recommend_new.call_sync_ajax_request(url_recommend_new, draw_table_recommend_new.ajax_method,function(data){draw_table_recommend_new.Re_Draw_table(data,recommend_type)});
      }
      });

      // $('input[name="recommend_type"]').change(function(){
      //     if ($(this).val() == 'upload'){
      //         $('#upload_panel').css('display', 'block');
      //         $('#recommend_panel').css('display', 'none');
      //     }
      //     else{
      //         $('#upload_panel').css('display', 'none');
      //         $('#recommend_panel').css('display', 'block');
      //     }
      // });
        
        $('#delete_file').click(function(){
            seed_user_files = undefined;
            $('#file_status').css('display', 'none');
        });
        $('#uploadbtn').click(function(){
            var fileInput = document.getElementById('seed_file_upload');
            // 检查文件是否选择:
            if (!fileInput.value) {
                alert('没有选择文件。');
                return;
            }
            // 获取File引用:
            var file = fileInput.value;
            //alert(file);
            if ((file.endsWith('.csv')) || (file.endsWith('.txt'))) {
                seed_user_files = fileInput.files;
                $('#add_file').html(file);
                $('#file_status').css('display', 'block');
                return false;
            }else{
                alert('只能上传csv或txt文件。');
                return;
            }
        });
}

// page control start
var global_pre_page = 1;
var global_choose_uids = new Array();
// page control end
var seed_user_files = undefined;

var now_date = choose_time_for_mode();
//var last_date = new Date(now_date - 24*60*60*1000)
var last_date = new Date(now_date)
var last = last_date.format('yyyy-MM-dd');
var recommend_type = $('#input_choose option:selected').val();
//var recommend_type = $('input[name="recommend_type"]:checked').val();
var admin =$('#useremail').text();
var url_recommend = '/recommentation/show_in/?submit_user='+admin+'&date=' + last + '&type=' + recommend_type ;
date_initial();
bindOption();
console.log('who',url_recommend);
draw_table_recommend = new Search_weibo_recommend(url_recommend, '#recommend')
;
$('#in_onload').css('display','block');
$('#choose_in').css('display','none');
draw_table_recommend.call_sync_ajax_request(url_recommend, draw_table_recommend.ajax_method,function(data){draw_table_recommend.Re_Draw_table(data,recommend_type)});

function handleFileSelect(upload_job){
    var files = seed_user_files;
    for(var i=0,f;f=files[i];i++){
        var reader = new FileReader();
        reader.onload = function (oFREvent) {
            var a = oFREvent.target.result;
            upload_job['upload_data'] = a;
            console.log(JSON.stringify(upload_job));
            $.ajax({   
                type:"POST",  
                url:"/recommentation/submit_identify_in/",
                contentType:"application/json",
                data:JSON.stringify(upload_job),
                dataType: "json",
                success: file_callback,
            });
        };            
        reader.readAsText(f,'GB2312');                                                        
    }
}
function file_callback(data){
    console.log(data);
    var data0 = data;
    if(data[0]==true){
        if(data[2].length==0){
        alert('上传成功！');
        }else{
        alert('上传成功！提交文件中已经有'+data[2].length+'人入库');
        }  draw_table_recommend_new = new Search_weibo_recommend('', '#recommend');
        draw_table_recommend.Re_Draw_table(data0[3],'upload');
    }else{
        if(data[1]=='all user in'){
            alert('所有用户已入库');
        }
        if(data[1]=='invalid user info'){
            var invalid_seeds = [];
            for(var i=0;i<data[2].length;i++){
                invalid_seeds.push(data[2][i]);
            }
            var invald_str = invalid_seeds.join(',');
            alert('无效用户信息：'+invald_str);
        }
    }
    /*
    if (data == 'uname list all in'){
        alert('用户已入库！');
    }
    else if(data == 'uname list valid'){
        alert('用户名不合法！');
    }
    else if(data == 'no valid input url'){
        alert('URL不合法！');
    }
    else{
        alert('入库成功！');
    }
    */
}
$('#input_choose').change(function(){
    var second=$('#second_level');
    if($('#input_choose').val()=='upload'){
        $('#second_level').text('选择文件');
        $('#upload_panel').css('display','block');
        $('#recommend_date_select').css('display','none');
        //$('#choose_in').css('display','none');
        //$('#choose_in').css('margin-right','70px');
        //$('#recommend').css('display','none');
        //$('#recommend_date_button').css('display','block');
    }else{
        $('#second_level').text('推荐日期');
        $('#upload_panel').css('display','none');
        $('#recommend_date_select').css('display','block');
        //$('#choose_in').css('display','block');
        //$('#choose_in').css('margin-right','0px');
        //$('#recommend').css('display','block');
        //$('#recommend_date_button').css('display','block');
    }
});


function date_initial(){
  var recommend_date = [];
  for(var i=0;i<7;i++){
    var today = new Date(last_date-24*60*60*1000*(6-i));
    recommend_date[i] = today.format('yyyy-MM-dd');
  }
  $("#recommend_date_select").empty();
  var recommend_date_html = '';
  recommend_date_html += '<option value="' + recommend_date[0] + '">' + recommend_date[0] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[1] + '">' + recommend_date[1] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[2] + '">' + recommend_date[2] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[3] + '">' + recommend_date[3] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[4] + '">' + recommend_date[4] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[5] + '">' + recommend_date[5] + '</option>';
  recommend_date_html += '<option value="' + recommend_date[6] + '" selected="selected">' + recommend_date[6] + '</option>';
  $("#recommend_date_select").append(recommend_date_html);
}


function recommend_all(){
  $('input[name="in_status"]:not(:disabled)').prop('checked', $("#page_all").prop('checked'));
}

function replace_space(data){
  for(var i in data){
    if(data[i]===""||data[i]==="unknown"){
      data[i] = "未知";
    }
  }
  return data;
}

function draw_line_chart(xaxis, yaxis, div, uname){
  var uname_text = '"' + uname + '"的微博数';
  var line_chart_option = {
    title : {
        text: '用户微博走势图',
        subtext: '',
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:[uname_text]
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLabel:{
              interval:5,
            },
            data : xaxis,
        }
    ],
    yAxis : [
        {
            type : 'value',
        }
    ],
    series : [
        {
            name:uname_text,
            type:'line',
            data:yaxis,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        },
    ]
  };
  var draw_init2 = echarts.init(document.getElementById(div));
  draw_init2.setOption(line_chart_option);
}


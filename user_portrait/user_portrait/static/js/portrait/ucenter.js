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
function date_init(){
    var date = choose_time_for_mode();
    //console.log(date);
    date.setHours(0,0,0,0);
    var max_date = date.format('yyyy/MM/dd');
    var current_date = date.format('yyyy/MM/dd');
    var from_date_time = Math.floor(date.getTime()/1000);
    var min_date_ms = new Date()
    min_date_ms.setTime(from_date_time*1000);
    var from_date = min_date_ms.format('yyyy/MM/dd');
    if(global_test_mode==0){
         $('#work_weibo_from_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
         $('#work_weibo_to_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
    }else{
         $('#work_weibo_from_modal').datetimepicker({value:from_date,step:1440,minDate:'-1970/01/30',maxDate:'+1970/01/01',format:'Y/m/d',timepicker:false});
         $('#work_weibo_to_modal').datetimepicker({value:from_date,step:1440,minDate:'-1970/01/30',maxDate:'+1970/01/01',format:'Y/m/d',timepicker:false});

    }
}
date_init();
$('#work_time_checkbox').click(function(){
    if($(this).is(':checked')){
        $('#work_weibo_from_modal').attr('disabled',false);
        $('#work_weibo_to_modal').attr('disabled',false);
    }else{
        $('#work_weibo_from_modal').attr('disabled', true);
        $('#work_weibo_to_modal').attr('disabled', true);
    }
});

function call_sync_ajax_request(url, callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
}
function search_work(){
    var search_url = '/ucenter/show_user_operation_index/';
    var start_date = $('#work_weibo_from_modal').val().split('/').join('-');
    var end_date = $('#work_weibo_to_modal').val().split('/').join('-');
    var submit_key = $('#workuser_name').val();
    if(submit_key != '' || $('#work_time_checkbox').is(':checked'))
    {
        search_url += '?';
    }
    search_url+='admin_user=';
    var keywords_string= submit_key.split(' ').join(',');
    search_url +=  keywords_string;
/*
    if(submit_key != ''){
        var keywords_string= submit_key.split(' ').join(',');
        search_url += '&admin_user='+ keywords_string;
    }*/
    if($('#work_time_checkbox').is(':checked')){
        search_url += '&start_date='+start_date+'&end_date='+end_date;
    };
    console.log(search_url);
    call_sync_ajax_request(search_url, all_work_table);
}


function all_work_table(data){
    $('#all_work_table').empty();
    //console.log(data);
    if(data.length == 0){
        
    $('#all_work_table').append('暂无数据');
    }else{
    var html = '';
	html += ' <table id="work_table_all" class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	html += '<th>用户名</th>';
    html += '<th>用户排行</th>';
    html += '<th>情绪监测</th>';
    html += '<th>网络分析</th>';
    html += '<th>推荐入库</th>';
    html += '<th>实际入库</th>';
    html += '<th>群体发现</th>';
    html += '<th>群体分析</th>';
    html += '<th>社会感知</th>';
    html += '<th>添加标签</th>';
    html += '<th>时间</th>';
	html += '</tr>';
        var ii = data.length-1
        html += '<tr>';
        html += '<td>'+'工作汇总'+'</td>';
        html += '<td>'+data[ii].rank_count+'</td>';
        html += '<td>'+data[ii].sentiment_count+'</td>';
        html += '<td>'+data[ii].network_count+'</td>';
        html += '<td>'+data[ii].recomment_count+'</td>';
        html += '<td>'+data[ii].compute_count+'</td>';
        html += '<td>'+data[ii].detect_count+'</td>';
        html += '<td>'+data[ii].analysis_count+'</td>';
        html += '<td>'+data[ii].sensing_count+'</td>';
        html += '<td>'+data[ii].tag_count+'</td>';
        html += '<td>'+'-'+'</td>';
        html += '</tr>';
    html += '</thead>';
	html += '<tbody>';
    
    
    for(var i=0;i<(data.length-1); i++){
        var time = new Date(parseInt(data[i].timestamp)*1000);
        time = time.format('yyyy/MM/dd');
        html += '<tr>';
        html += '<td>'+data[i].admin_user+'</td>';
        html += '<td>'+data[i].rank_count+'</td>';
        html += '<td>'+data[i].sentiment_count+'</td>';
        html += '<td>'+data[i].network_count+'</td>';
        html += '<td>'+data[i].recomment_count+'</td>';
        html += '<td>'+data[i].compute_count+'</td>';
        html += '<td>'+data[i].detect_count+'</td>';
        html += '<td>'+data[i].analysis_count+'</td>';
        html += '<td>'+data[i].sensing_count+'</td>';
        html += '<td>'+data[i].tag_count+'</td>';
        html += '<td>'+time+'</td>';

    };
    html += '</tbody>';
    html += '</table>';
    $('#all_work_table').append(html);
    $('#work_table_all').dataTable({
        "sDom": "<'row'<'col-md-6'l ><'col-md-6'f>r>t<'row'<'col-md-12'i><'col-md-12 center-block'p>>",
        "aaSorting":[[10,"desc"]],
        //aaSort
        //"sPaginationType": "bootstrap",
        //"aoColumnDefs":[ {"bSortable": false, "aTargets":[8]}],
        "oLanguage": {
            "sLengthMenu": "每页_MENU_ 条"
        }
    });
}
}

function modal_work(){
	$('#Worktable').empty();
	var date = new Date();
	var to_date = new Date();
	to_date.setTime(date.getTime() - 60*60*24*7*1000);
	//console.log(to_date);
	var from_date = date.format('yyyy/MM/dd');
	to_date = to_date.format('yyyy/MM/dd');
	// var work_name = ['用户排行', '情绪监测', '网络分析', '入库推荐', '群体发现', '群体分析', '社会感知' ]
	var dict_name = {'用户排行':'rank_task', '情绪监测':'sentiment_task', '网络分析':'network_task', '入库推荐':'recomment', '群体发现':'group_detect', '群体分析':'group_analysis', '社会感知':'sensing_task'};
	var html = '';
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	html += '<th>任务ID</th><th>任务内容</th><th>提交时间</th><th>处理状态</th>';
	html += '</tr></thead>';
	html += '<tbody>';
        var i=0
	for(key in dict_name){
		html += '<tr>'
		html += '<td>'+'09XPX'+i+'</td>';
		html += '<td>'+key+'</td>';
		html += '<td>'+from_date+' - '+to_date+'</td>';
		html += '<td><span hidden>'+dict_name[key]+'</span><u style="cursor:pointer;" class="detail_button" type="button" data-toggle="modal" data-target="#'+dict_name[key]+'_detail">查看详情</u></td>';
		// }
		html += '</tr>';
        i = i+1;
	}
	// for(var i=0;i<work_name.length;i++){
	// 	html += '<tr>'
	// 	html += ' <td>'+'09XPX78'+'</td>';
	// 	html += ' <td>'+work_name[i]+'</td>';
	// 	html += ' <td>'+from_date+'-'+to_date+'</td>';
	// 	html += '<td style="cursor:pointer;" id="detail_button" type="button" data-toggle="modal" data-target="#detail_in_portrait"><u>查看详情</u></td>';
	// 	// }
	// 	html += '</tr>';
	// }
	html += '</tbody></table>';
	$('#Worktable').append(html);
}

function Draw_recomment_modal(data){
    //console.log(data);
	$('#recomment_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	// for(var i=0; i<title_list; i++){
	// 	html += '<th>' + title_list[i] +'</th>';
	// }
	html += '<th>日期</th><th>uid</th><th>昵称</th><th>地理位置</th><th>粉丝数</th><th>微博数</th><th>影响力</th><th>是否入库</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][0]+'</td>';
		html += '<td style="text-align;">'+data[i][1]+'</td>';
        if(data[i][2]==''){
            data[i][2]='未知';
        }
		html += '<td style="text-align;">'+data[i][2]+'</td>';
        if(data[i][3]==''){
            data[i][3]='未知';
        }
		html += '<td style="text-align;">'+data[i][3]+'</td>';
        if(data[i][4]==''){
            data[i][4]='未知';
        }
		html += '<td style="text-align;">'+data[i][4]+'</td>';
        if(data[i][5]==''){
           data[i][5]='未知';
        }
		html += '<td style="text-align;">'+data[i][5]+'</td>';
        if(data[i][6]==''){
            data[i][6]='未知';
        }else if(data[i][6]==0){
            data[i][6]=0;
        }else{
            data[i][6]=data[i][6].toFixed(2);
        }
		html += '<td style="text-align;">'+data[i][6]+'</td>';
		//html += '<td style="text-align;">'+data[i][6]+'</td>';
        if(data[i][7] == '1'){
			html += '<td style="text-align;">'+'是'+'</td>';
		}else{
			html += '<td style="text-align;">'+'否'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#recomment_detail_modal').append(html);
}

function Draw_rank_task_modal(data){
	 //console.log(data);
	$('#rank_task_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	// for(var i=0; i<title_list; i++){
	// 	html += '<th>' + title_list[i] +'</th>';
	// }
	html += '<th>关键词</th><th>排序范围</th><th>排序指标</th><th>提交时间</th><th>计算状态</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		//html += '<td style="text-align;">'+data[i][0].split('&').join(' ')+'</td>'
		html += '<td style="text-align;">'+data[i][0]+'</td>';
        html += '<td style="text-align;">'+scope_dict[data[i][4]]+'</td>';
		html += '<td style="text-align;">'+norm_dict[data[i][1]]+'</td>';
		html += '<td style="text-align;">'+data[i][2]+'</td>';
		if(data[i][3] == '1'){
			html += '<td style="text-align;">'+'<a href="/index/user_rank/"  target="_blank">计算完成'+'</a></td>';
		}else{
			html += '<td style="text-align;">'+'正在计算'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#rank_task_detail_modal').append(html);
}

function Draw_sentiment_task_modal(data){

	$('#sentiment_task_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	// for(var i=0; i<title_list; i++){
	// 	html += '<th>' + title_list[i] +'</th>';
	// }
	html += '<th>关键词</th><th>时间范围</th><th>提交时间</th><th>计算状态</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][1].split('&').join(' ')+'</td>'
		html += '<td style="text-align;">'+data[i][2]+' 至 '+data[i][3]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// html += '<td style="text-align;">'+data[i][3]+'</td>'
		html += '<td style="text-align;">'+data[i][4]+'</td>'
		if(data[i][5] == '1'){
			html += '<td style="text-align;">'+'<a href="/index/mood_detect/"  target="_blank">计算完成'+'</a></td>';
		}else{
			html += '<td style="text-align;">'+'正在计算'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#sentiment_task_detail_modal').append(html);
}

function Draw_network_task_modal(data){
    //console.log(data);
	$('#network_task_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	// for(var i=0; i<title_list; i++){
	// 	html += '<th>' + title_list[i] +'</th>';
	// }
	html += '<th>关键词</th><th>时间范围</th><th>提交时间</th><th>计算状态</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][1].split('&').join(' ')+'</td>'
		html += '<td style="text-align;">'+data[i][3]+' 至 '+data[i][4]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// html += '<td style="text-align;">'+data[i][3]+'</td>'
		html += '<td style="text-align;">'+data[i][2]+'</td>'
		if(data[i][5] == '1'){
			html += '<td style="text-align;">'+'<a href="/index/network/"  target="_blank">计算完成'+'</a></td>';
		}else{
			html += '<td style="text-align;">'+'正在计算'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#network_task_detail_modal').append(html);
}

function Draw_group_detect_modal(data){
	var task_dict = {'single':'由用户发现群体','multy':'由用户发现群体','attribute':'由特征发现群体','pattern': '由模式发现群体','event':'由事件发现群体'}
	$('#group_detect_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }
    else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	// for(var i=0; i<title_list; i++){
	// 	html += '<th>' + title_list[i] +'</th>';
	// }
	html += '<th>任务名称</th><th>任务类型</th><th>备注</th><th>提交时间</th><th>任务进度</th><th>查看详情</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][0]+'</td>'
		html += '<td style="text-align;">'+task_dict[data[i][3]]+'</td>'
		html += '<td style="text-align;">'+data[i][2]+'</td>'
		html += '<td style="text-align;">'+data[i][1]+'</td>'
		html += '<td style="text-align;"><progress value="'+data[i][4]+'" max="100"></progress>&nbsp;&nbsp;'+data[i][4]+'%</td>'
		if(data[i][4] == 100){
			html += '<td style="text-align;"><a href="/index/group/"  target="_blank">查看详情</a></td>';
		}else{
			html += '<td> -- </td>'
		}
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// html += '<td style="text-align;">'+data[i][3]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// if(data[i][5] == '1'){
		// 	html += '<td style="text-align;">'+'计算完成'+'</td>';
		// }else{
		// 	html += '<td style="text-align;">'+'正在计算'+'</td>';
		// }
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#group_detect_detail_modal').append(html);
}

function Draw_group_analysis_modal(data){
	var task_dict = {'single':'由用户发现群体','multy':'由用户发现群体','attribute':'由特征发现群体','pattern': '由模式发现群体','event':'由事件发现群体'}
	$('#group_analysis_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	html += ' <th>任务名称</th><th>备注</th><th>提交时间</th><th>任务状态</th>';
	html += ' </tr></thead>';
	html += ' <tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][0]+'</td>'
		html += '<td style="text-align;">'+data[i][2]+'</td>'
		html += '<td style="text-align;">'+data[i][1]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// html += '<td style="text-align;">'+data[i][3]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		if(data[i][3] == '1'){
			html += '<td style="text-align;">'+'<a href="/index/group_analysis/?name='+data[i][0]+'"  target="_blank">计算完成'+'</a></td>';
		}else{
			html += '<td style="text-align;">'+'正在计算'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#group_analysis_detail_modal').append(html);
}

function Draw_sensing_task_modal(data){
	$('#sensing_task_detail_modal').empty();
	var html = '';
    if(data.length==0){
        html += '暂无数据';
    }else{
	html += ' <table class="table table-bordered table-striped table-condensed datatable" >';
	html += ' <thead><tr style="text-align:center;">';
	html += ' <th>任务名称</th><th>备注</th><th>提交时间</th><th>任务状态</th>';
	html += ' </tr></thead>';
	html += ' <tbody>';
	for(var i=0;i<data.length;i++){
		html += '<tr>';
		html += '<td style="text-align;">'+data[i][0]+'</td>'
		html += '<td style="text-align;">'+data[i][2]+'</td>'
		html += '<td style="text-align;">'+data[i][1]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		// html += '<td style="text-align;">'+data[i][3]+'</td>'
		// html += '<td style="text-align;">'+data[i][2]+'</td>'
		if(data[i][3] == '1'){
			html += '<td style="text-align;">'+'<a href="/index/social_sensing/"  target="_blank">计算完成'+'</a></td>';
		}else{
			html += '<td style="text-align;">'+'正在计算'+'</td>';
		}
		html += '</tr>'
	}
	html += '</tbody></table>';
    }
	$('#sensing_task_detail_modal').append(html);
}


function modal_data(data){
	Draw_rank_task_modal(data.rank_task);
	Draw_sentiment_task_modal(data.sentiment_task);
	Draw_network_task_modal(data.network_task);
	Draw_group_detect_modal(data.group_detect);
	Draw_group_analysis_modal(data.group_analysis);
	Draw_sensing_task_modal(data.sensing_task);

	return data;
}

function modal_data_re(data){
	//console.log(data)
	//console.log(data.recomment)
	Draw_recomment_modal(data.recomment);

	return data;
}

var scope_dict ={'all_limit_keyword':'全网-按关键词','in_limit_keyword':'库内-按关键词','in_limit_hashtag':'库内-按微话题'}
var norm_dict ={'weibo_num': '微博数','fans': '粉丝数','bci': '影响力','bci_change':'突发影响力变动','ses':'言论敏感度','ses_change':'突发敏感度变动','imp':'身份敏感度','imp_change':'突发重要度变动','act':'活跃度','act_change':'突发活跃度变动'}
var dict_name = {'rank_task':'用户排行', 'sentiment_task':'情绪监测', 'network_task':'网络分析', 'recomment':'入库推荐','group_detect' :'群体发现', 'group_analysis':'群体分析', 'sensing_task':'社会感知'};
modal_work();
var admin=$('#tag_user').text();
var url_recomment = '/ucenter/user_operation/?submit_user='+ centerUser;
//console.log(url_recomment)
call_sync_ajax_request(url_recomment, modal_data_re);
var url_else = '/ucenter/user_operation/?submit_user='+centerUser;
call_sync_ajax_request(url_else, modal_data);

var all_url = '/ucenter/show_user_operation_index/';
call_sync_ajax_request(all_url, all_work_table);
$('#terun_all').click(function(){
var all_url = '/ucenter/show_user_operation_index/';
call_sync_ajax_request(all_url, all_work_table);

})



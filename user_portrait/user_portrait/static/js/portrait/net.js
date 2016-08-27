function call_sync_ajax_request(url, callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
}

var myDate = new Date();
var month = myDate.getMonth()+1;
var day = myDate.getDate();
var show_day = month.toString() +'月'+ day.toString() +'日';
var hh = myDate.getHours();
var mm =myDate.getMinutes();
var count_hh = Math.floor(hh/3);
var show_hh = [];
var now_num = 0;
for(var i=0;i<=count_hh;i++){
	show_hh.push(show_day+' '+(i*3).toString()+':00');
}
var change_period = count_hh;
var tab = 'time';
date_init();
var task_id = '';
var choose_uid = '';
var choose_uname = '';

$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
   //console.log(state);
   if(state){
     hidden_keywords();
     tab = 'time';
   }else{
     hidden_time();
     tab = 'keyword';
     }
});
function hidden_keywords(){
    $('#show_keywords').addClass('hidden');
	$('#by_keywords').css('background-color','#6699FF');
	$('#framecontent').removeClass('hidden');
	$('#title_chart').removeClass('hidden');
	$('#show_tab').css('margin-top', '-40px');
	$('#show_tab').css('margin-bottom', '0px');
	$('#by_time').css('background-color','#3351B7');
	$('#pr_diff').removeClass('hidden');
	$('#dg_diff').removeClass('hidden');
	$('#result_analysis').removeClass('hidden');
    $('#detect_range').empty();
    $('#detect_detail').empty();
    $('#detect_time_range').empty();
    $('#keyDescrip').empty();
    $('#keyDescrip').append('网民数');
    $('#detect_range').append(now_num);
    if(change_period==0){
        $('#detect_time_range').append('昨天21:00-昨天24:00');
    }else{
    $('#detect_time_range').append((change_period-1)*3+':00-'+change_period*3+':00');
	}
    tab = 'time';
	$("input[name='mode_choose']").eq(0).attr("checked","checked");
	var url = '/network/show_daily_rank/?period='+change_period;
    call_sync_ajax_request(url, temporal_rank_table);
}
function hidden_time(){
    
	$('#show_tab').css('margin-top', '0px');
	$('#show_tab').css('margin-bottom', '-40px');
    $('#title_chart').addClass('hidden');
    $('#framecontent').addClass('hidden');
	$('#pr_diff').addClass('hidden');
	$('#dg_diff').addClass('hidden');
	$('#by_time').css('background-color','#6699FF');
    $('#show_keywords').removeClass('hidden');
	$('#by_keywords').css('background-color','#3351B7');
	$('#result_analysis').addClass('hidden');
	tab = 'keyword';
	$("input[name='mode_choose']").eq(0).attr("checked","checked");
	var url = '/network/show_daily_rank/?period='+change_period;
    call_sync_ajax_request(url, temporal_rank_table);
	
}
function date_init(){
    var date = choose_time_for_mode();
    date.setHours(0,0,0,0);
    var max_date = date.format('yyyy/MM/dd');
    var current_date = date.format('yyyy/MM/dd');//获取当前日期，改格式
    var from_date_time = Math.floor(date.getTime()/1000) - 60*60*24;
    var min_date_ms = new Date()
    min_date_ms.setTime(from_date_time*1000);
    var from_date = min_date_ms.format('yyyy/MM/dd');
    if(global_test_mode==0){
        $('#detect_time_choose #weibo_from').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#detect_time_choose #weibo_to').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#detect_time_choose_modal #weibo_from_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#detect_time_choose_modal #weibo_to_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#search_date #weibo_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
    }else{
        $('#detect_time_choose #weibo_from').datetimepicker({value:from_date,step:1440,minDate:'-1970/01/30',format:'Y/m/d',timepicker:false,maxDate:'+1970/01/01'});
        $('#detect_time_choose #weibo_to').datetimepicker({value:from_date,step:1440,minDate:'-1970/01/30',format:'Y/m/d',timepicker:false,maxDate:'+1970/01/01'});
        $('#detect_time_choose_modal #weibo_from_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#detect_time_choose_modal #weibo_to_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});
        $('#search_date #weibo_modal').datetimepicker({value:from_date,step:1440,format:'Y/m/d',timepicker:false});

    }
    var real_date = new Date();
    real_date = real_date.format('yyyy/MM/dd');
    $('#search_date #weibo_modal').datetimepicker({value:real_date,step:1440,format:'Y/m/d',timepicker:false});

}

//任务状态
var url = '/network/search_all_keywords/';
call_sync_ajax_request(url, detect_task_status);
function detect_task_status(data) {
    //console.log(data);
    //console.log('wqwedwew');
    var html = '';
    /*
    html += '<span style="float:right;margin-right:0px;margin-bottom: 10px;cursor:pointer;" type="button" data-toggle="modal" data-target="#detect_search_modal" ><u>任务搜索</u></span>';
    html += '<span id="show_all_task" style="float:right;margin-right: 20px;margin-bottom: 10px;cursor:pointer;"><u>显示全部任务</u></span>';
    */
    if (data != ''){
         html += '<span id="show_all_task" style="float:right;margin-bottom: 10px;cursor:pointer;"><u>显示全部任务</u></span>';
         html += '<span style="margin-right: 20px;float:right;margin-bottom: 10px;cursor:pointer;" type="button" data-toggle="modal" data-target="#detect_search_modal" ><u>任务搜索</u></span>';
        var sort_scope = data.sort_scope;
        $('#detect_net_task_status').empty();
        html += '<br><table id="task_table" class="table table-bordered table-striped table-condensed datatable" style="margin-left:30px;width:900px;">';
        html += '<thead>';
        html += '<th style="width:100px;text-align:center;">关键词</th>';
        html += '<th style="width:150px;text-align:center;">监控时间</th>';
        html += '<th style="width:200px;text-align:center;">提交时间</th>';
        html += '<th style="width:100px;text-align:center;">任务状态</th>';
        html += '<th style="width:60px;text-align:center;">操作</th>';
        html += '</thead>';
        for(var i=0;i<data.length;i++){
            var delete_this = '<span style="display:none;">'+data[i][0]+'</span><span class="de_delete_this"><b><u class="" style="cursor:pointer;">删除</u></b></span>';
            if(data[i][5] == 0){
                var status = '正在计算';
            }else{
                var status = '<span class="show_detect_key_result" ><b><u style="cursor:pointer;">计算完成</u></b></span>';
            }
            html += '<tr>';
            html += '<td style="text-align:center;">'+data[i][3].split('&').join(',')+'</td>';
            html += '<td style="text-align:center;">'+data[i][1]+' 至 '+data[i][2]+'</td>';
            html += '<td style="text-align:center;">'+data[i][4]+'</td>';
            html += '<td style="text-align:center;"><span style="display:none;">'+data[i][0]+'</span>'+status+'</td>';
            html += '<td style="text-align:center;">'+delete_this+'</td>';
            html += '</tr>';
        }
        html += '</table>';
        $('#detect_net_task_status').append(html);
    }else{
        $('#task_table').css('display', 'none');
        var html = '<div style="text-align: center;background-color: #cccccc;width: 900px;margin-left: 30px">暂无相关任务</div>'
        $('#detect_net_task_status').append(html);
    }
}
//显示全部任务
$('#show_all_task').live('click', function(){
    var task_url_all = '/network/search_all_keywords/';
    call_sync_ajax_request(task_url_all, detect_task_status);
});
//搜索任务提交
function search_task(){
    var submit_date = $('#weibo_modal').val().split('/').join('-');
    var start_date = $('#weibo_from_modal').val().split('/').join('-');
    var end_date = $('#weibo_to_modal').val().split('/').join('-');
    var submit_key = $('#search_key').val();
    var search_url = '/network/search_all_keywords/';
	var count = 0
    if(submit_key != ''){
        if(count ==0){
			search_url += '?keywords='+submit_key;
			count += 1;
		}
		else{
			search_url += '&keywords='+submit_key;
		}
    }
    var status = $('#search_status').val();
    if(status != "2"){
		if(count ==0){
			search_url += '?status=' +status;
		}else{
			search_url += '&status=' +status;
			count += 1;
		}
        
    };
    var status= $('')
    if($('#time_checkbox').is(':checked')){
		if(count ==0){
			search_url += '?start_date='+start_date+'&end_date='+end_date;
		}else{
			search_url += '&start_date='+start_date+'&end_date='+end_date;
			count += 1;
		}
    };
    if($(' #time_checkbox_submit').is(':checked')){
		if(count ==0){
			search_url += '?submit_date='+submit_date;
		}else{
			search_url += '&submit_date='+submit_date;
			count += 1;
		}
    }
    call_sync_ajax_request(search_url, detect_task_status);
}
//提交监测
$('#detect_submit').click(function(){
    var s = [];
    var keyword = $('#keyword_detect').val();
    var time_from =$('#detect_time_choose #weibo_from').val().split('/').join('-');
    var time_to =$('#detect_time_choose #weibo_to').val().split('/').join('-');
    var from_stamp = new Date($('#detect_time_choose #weibo_from').val());
    var end_stamp = new Date($('#detect_time_choose #weibo_to').val());
    if(from_stamp > end_stamp){
        alert('起始时间不得大于终止时间！');
        return false;
    }
    if(keyword == ''){  //检查输入词是否为空
        alert('请输入关键词！');
    }else{
		var submit_url = '/network/submit_network_keywords/?keywords='+keyword+'&start_date='+time_from+'&end_date='+time_to+'&submit_user='+netuser;
        //console.log(submit_url);
		call_sync_ajax_request(submit_url,add_task_success);
        document.getElementById('keyword_detect').value='';
       // var show_url = '/network/search_all_keywords/';
       // call_sync_ajax_request(show_url, detect_task_status);
        $('#detect_net_task_status').css('display', 'block');
        $('#open').css('display', 'none');
        $('#close_c').css('display', 'block');
       
    }
})

function add_task_success(data){
    if(data==true){
        alert('提交成功！');
        var show_url = '/network/search_all_keywords/';
        call_sync_ajax_request(show_url, detect_task_status);
    }
}
$(' #time_checkbox').click(function(){
	if($(this).is(':checked')){
		$('#detect_time_choose_modal #weibo_from_modal').attr('disabled',false);
		$('#detect_time_choose_modal #weibo_to_modal').attr('disabled',false);
	}
	else{
		$('#detect_time_choose_modal #weibo_from_modal').attr('disabled',true);
		$('#detect_time_choose_modal #weibo_to_modal').attr('disabled',true);
	}
});
$('#time_checkbox_submit').click(function(){
	if($(this).is(':checked')){
		$('#search_date #weibo_modal').attr('disabled',false);
	}
	else{
		$('#search_date #weibo_modal').attr('disabled', true);
		}
});

$(function(){
    $('#detect_range').empty();
    $('#detect_detail').empty();
    $('#detect_time_range').empty();
    $('#keyDescrip').empty();
    $('#keyDescrip').append('网民数');
    $('#detect_range').append(now_num);
    if(change_period==0){
       $('#detect_time_range').append('前天21:-前天24:00'); 
    }else{
        $('#detect_time_range').append((change_period-1)*3+':00-'+change_period*3+':00');
    }
    var url = '/network/show_daily_rank/?period='+change_period;
    call_sync_ajax_request(url, temporal_rank_table);
});
$("[name='my-checkbox']").bootstrapSwitch();
//画表
function temporal_rank_table(data){
    var box = document.getElementsByName('mode_choose');
	for(var i=0;i<box.length;i++){
		if(box[i].checked){
			sort_type = box[i].value;
		}
	}
	if(sort_type=='pr'){
		var show_title = 'PR影响力';
	}
	if(sort_type=='pr_diff'){
		var show_title = 'PR影响力变动';
	}
	if(sort_type=='dg'){
		var show_title = '交互网民人数';
	}
	if(sort_type=='dg_diff'){
		var show_title = '交互网民人数变动';
	}
	$('#result_rank_table').empty();
	var html = '';
	html += '<table id="rank_table" class="table table-striped table-bordered bootstrap-datatable datatable responsive" style="margin-left:30px;width:900px;">';
	html += '<thead><th style="text-align:center;min-width:40px;">排名</th>';
	html += '<th style="text-align:center;">用户ID</th>';
	html += '<th style="text-align:center;">昵称</th>';
	html += '<th style="text-align:center;min-width:50px;">是否入库</th>';
	html += '<th style="text-align:center;">注册地</th>';
	html += '<th style="text-align:center;">粉丝数</th>';
	html += '<th style="text-align:center;">微博数</th>';
	html += '<th style="text-align:center;">'+show_title+'</th>';
	html += '<th style="text-align:center;">网络详情</th></thead>';
	//console.log(data)
    for(var i=0;i<data.length;i++){
		var uid = data[i][0];
		var uname = data[i][1];
		if(uname == ''){
			uname = uid;
		}
		var sign_loca = data[i][2];
		if(sign_loca == ''){
			sign_loca = '未知'
		}
		if(data[i][6]==1){ //是否入库
			var ifin = '是';
            var user_link = '/index/personal/?uid='+uid;
		}else{
			var ifin = '否';
            var user_link = '/index/personal_out/?uid='+uid;
		}
		if(data[i][4]==''){//fans
			data[i][4]= '';
		}
        /*
		if(data[i][5]==''){//pagerank
			data[i][5]= '未知';
		}
        */
		if(data[i][5]==''){//weibo
			data[i][5]= '';
		}
		
		html += '<tr>';
		html += '<td style="text-align:center;">'+(i+1)+'</td>';
        if(data[i][6]==1){
		html += '<td style="text-align:center;"><a href="/index/personal/?uid='+uid+'" target="_blank">'+uid+'</a></td>';}
        else{
        html += '<td style="text-align:center;"><a href='+ user_link +' target="_blank">'+uid+'</a></td>';
        }
		html += '<td style="text-align:center;">'+uname+'</td>';
		html += '<td style="text-align:center;">'+ifin+'</td>';
		html += '<td style="text-align:center;">'+sign_loca+'</td>';
		html += '<td style="text-align:center;">'+data[i][4]+'</td>';
		html += '<td style="text-align:center;">'+data[i][5]+'</td>';
		html += '<td style="text-align:center;">'+data[i][3].toFixed(0)+'</td>';
		html += '<td style="text-align:center;cursor:pointer"><a data-toggle="modal" data-target="#detail_network" id="show_net" >查看网络详情</a></td>';
		html += '</tr>';
	}
	html += '</table>';
	$('#result_rank_table').append(html);
	$('#rank_table').dataTable({
    "aoColumnDefs": [  {"asSorting":["desc"],"aTargets": [7]}, {"sWidth": "5em", "aTargets":[0]}, {"sWidth": "7em", "aTargets":[2]},{"bSortable": false, "aTargets":[8]}],
    "sDom": "<'row'<'col-md-6'l ><'col-md-6'f>r>t<'row'<'col-md-12'i><'col-md-12 center-block'p>>",
		"sPaginationType": "bootstrap",
		//"aoColumnDefs":[ {"bSortable": false, "aTargets":[1]}],
		"oLanguage": {
			"sLengthMenu": "每页 _MENU_ 条 ",
		}
	});
};

var url = '/network/show_daily_trend';
call_sync_ajax_request(url, show_trend);
//节点趋势图
function show_trend(data){
	var daily_data = [];
	for(var j=0;j<=count_hh;j++){
        var period = 'period_'+j;
        if(data[period]){
			daily_data.push(data[period]);
		}else{
			daily_data.push(0);
		}
		
	}
    //console.log(change_period)
    //console.log(daily_data[period]);
    now_num = daily_data[change_period];
	$(function () {
		$('#Activezh').highcharts({
			title: {
				text: '',
				x: -20 //center
			},
            
			xAxis: {
				categories: show_hh
			},
            
			yAxis: {
				title: {
					text: '活跃网民数'
				},
                min:0,
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			plotOptions:{
				series:{
					cursor:'pointer',
					events:{
						click:function(event){
							//point2weibo(event.point.x, trend[event.point.x]);
							change_period = event.point.x;
                            //console.log(change_period);
							var table_url = '/network/show_daily_rank/?period='+event.point.x;
                            if(change_period==0){
                                 var rang_date = '昨天21:00-昨天24:00';
                            }else{
							var rang_date = ((event.point.x-1)*3).toString()+':00-'+ ((event.point.x)*3).toString() + ':00';}
							$('#result_analysis').removeClass('hidden');
							$('#detect_range').empty();
							$('#detect_detail').empty();
							$('#detect_time_range').empty();
							$('#keyDescrip').empty();
							$('#keyDescrip').append('网民数');
							$('#detect_range').append(event.point.y);
							$('#detect_time_range').append(rang_date);
							call_sync_ajax_request(table_url,temporal_rank_table);
							$("input[name='mode_choose']").eq(0).attr("checked","checked");
						}
					}
				}
			},
			legend: {
				enabled: false,
                layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: [{
				name:'网民数量',
				data: daily_data
			}]
		});
	});
}



//离线任务删除
$('.de_delete_this').live('click',function(){
    var a = confirm('确定要删除吗？');
    if (a == true){
        var id= $(this).prev().text();
        var del_url = '/network/delete_network_keywords/?task_id='+id;
        call_sync_ajax_request(del_url,de_del);
    }
});


function de_del(data){
    if(data == true){
        alert('删除成功！');
        var task_url = '/network/search_all_keywords/';
        call_sync_ajax_request(task_url, detect_task_status);
    }else{
        alert('删除失败，请再试一次！');
    }
}


$(function(){
	$('#modechoose').click(function(){
	var box = document.getElementsByName('mode_choose');
	for(var i=0;i<box.length;i++){
		if(box[i].checked){
			sort_type = box[i].value;
		}
	}
	if(tab=='time'){
        var url = '/network/show_daily_rank/?order='+sort_type+'&period='+change_period;
	}
	if(tab=='keyword'){
		var url = "/network/show_keywords_rank/?order="+sort_type+"&task_id="+task_id;
	}
    call_sync_ajax_request(url,temporal_rank_table);
	});
});



//完成计算
$('.show_detect_key_result').live('click', function(){
    task_id= $(this).prev().text();
    var keywords = $(this).parent().prev().prev().prev().text();
	var keyword_date = $(this).parent().prev().prev().text();
    var show_url = '/network/show_keywords_rank/?task_id=' + task_id;
    call_sync_ajax_request(show_url, temporal_rank_table);
	$('#result_analysis').removeClass('hidden');
	$('#detect_range').empty();
    $('#detect_detail').empty();
    $('#detect_time_range').empty();
	$('#keyDescrip').empty();
	$('#keyDescrip').append('关键词');
    $('#detect_range').append(keywords);
    $('#detect_time_range').append(keyword_date);  
});

var global_net_detail;

function get_net_detail(data){
    global_net_detail = data;
}
//网络详情
$('a[id^=show_net]').live('click', function(){
	$("input[name='tweet_choose']").eq(0).attr("checked","checked");
	$('#networkDetail').empty();
	if(tab=='time'){
		choose_uid = $(this).parent().prev().prev().prev().prev().prev().prev().prev().text();
		choose_uname = $(this).parent().prev().prev().prev().prev().prev().prev().text();
		var url_show_net = '/network/search_retweet_network/?uid='+choose_uid;
		call_sync_ajax_request(url_show_net, get_net_detail);
        net_detail(global_net_detail, choose_uid,choose_uname,'retweet');
	}
	if(tab=='keyword'){
		choose_uid = $(this).parent().prev().prev().prev().prev().prev().prev().prev().text();
		choose_uname = $(this).parent().prev().prev().prev().prev().prev().prev().text();
		var url_show_net = '/network/search_retweet_network/?uid='+choose_uid+'&task_id='+task_id;
		call_sync_ajax_request(url_show_net, get_net_detail);
        net_detail(global_net_detail, choose_uid,choose_uname,'retweet');
	}
});
$(function(){
	$('#netchoose').click(function(){
	var box = document.getElementsByName('tweet_choose');
	for(var i=0;i<box.length;i++){
		if(box[i].checked){
			var tweet_type = box[i].value;
		}
	}
	if(tab=='time'){
		net_detail(global_net_detail, choose_uid,choose_uname,tweet_type);
	}
	if(tab=='keyword'){
		net_detail(global_net_detail, choose_uid,choose_uname,tweet_type);
	}
	});
});
function net_detail(data,uid,uname,tweet_type){
	if(tweet_type =='retweet'){
		var net_data = data.retweet;
	}else{
		var net_data = data.be_retweet;
	}
	var Related_Node = [];
	var Related_Link = [];
	var names = [];
	var uids = [];
    var sums = [];
	var links = [];
    var all_num = Math.min(net_data.length, 50)
    var sum_min=10000;
    var sum_max=0;
    var link_min=10000;
    var link_max=0;
	for (var i=0;i<all_num;i++){
        if(net_data[i][1]==''){
			names.push(net_data[i][0]);
		}else{
			names.push(net_data[i][1]);
		}
		uids.push(net_data[i][0]);
        var sum = net_data[i][2];
        if (sum > sum_max){
            sum_max = sum;
        }
        if (sum < sum_min){
            sum_min = sum;
        }
        sums.push(sum);
        var link = net_data[i][3];
        if (link > link_max){
            link_max = link;
        }
        if (link < link_min){
            link_min = link;
        }
		links.push(link);
	}
    var SUM_LEVEL = 20;
    var LINK_LEVEL = 2;
    var sum_delta = (sum_max - sum_min) / SUM_LEVEL;
    var link_delta = (link_max = link_min) / LINK_LEVEL;
	Related_Node.push({'name':uname,'value':20,'category':0,'symbolSize':20,'itemStyle':{'normal':{'color':'rgba(255,215,0,0.4)'}}});
	for(var i=0;i<all_num;i++ ){
		Related_Node.push({'name':names[i], 'value':sums[i], 'category':1,'symbolSize':1+(sums[i]-sum_min)/sum_delta});
        Related_Link.push({'source':uname, 'target':names[i], 'value':links[i], 'weight':links[i],'itemStyle':{'normal':{'width':1+(links[i]-link_min)/link_delta}}});
	}
    var myChart = echarts.init(document.getElementById('networkDetail')); 
            
    var option = {
        title : {
            subtext : '节点上的次数代表用户微博的转发量和评论量加总\n连线上的次数代表用户之间的交互次数'
        },
        tooltip : {
            trigger: 'item',
            formatter: '{b}({c}次)'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        series : [
        {
            type:'force',
            name : "网络关系",
            ribbonType: false,
            categories : [
                {
                    name:'',
                    symbol:'circle',
                },
                {
                    name:'',
                    symbol:'circle',
                },
            ],
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
            minRadius : 15,
            maxRadius : 25,
            gravity: 1.1,
            scaling: 1.1,
            roam: 'move',
            nodes: Related_Node,
            links : Related_Link
        }]
    };

    // 为echarts对象加载数据 
    myChart.setOption(option); 
}

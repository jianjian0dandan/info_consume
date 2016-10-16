//data:{ username:$("#username").val(), content:$("#content").val() }         
//data-ajax="ajaxRequest"
              //var username = $('#username').text();
             
              var username = 'admin@qq.com';
              $('#chase').tooltip();
                     //定义ajax回调函数
            function call_sync_ajax_request(url, callback){
                    $.ajax({
                      url: url,
                      type: 'GET',
                      dataType: 'json',
                      async: true,
                      success:callback
                    });
                   }
              // popover
              // function init_pop(){

              // $('[data-toggle="popover"]').each(function () {


              //     var element = $(this);
              //     var txt = element.html();
              //     element.popover({
              //       trigger: 'manual',
              //       placement: 'right', //top, bottom, left or right
              //       title: txt,
              //       html: 'true',
              //       content:ContentMethod(txt),

              //   }).on("mouseover", function () {
              //       var _this = this;
              //       $(this).popover("show");
              //       //  $(this).siblings(".popover").on("mouseleave", function () {
              //       //     $(_this).popover('hide');
              //       // });
              //   }).on("mouseleave", function () {
              //      var _this = this;
              //      $(this).popover("hide");
              //   })
              //   })
              //    function ContentMethod(txt) {
	             // var data = $("<form><ul  style='padding-left:15px;padding-right:15px;'><li><span aria-hidden='true'></span>&nbsp;<font>粉丝数:</font>7389223</li>" +  
	             // "<li><span aria-hidden='true'></span>&nbsp;<font>关注:</font>265</li>" +  
	             // "<li><span aria-hidden='true'></span>&nbsp;<font>微博:</font>645</li>" +  
	             // "<li><span aria-hidden='true'></span>&nbsp;<font>所在地:</font>台湾</li>" +  
	             // "<input id='btn' type='button' value='关注' onclick='test()'/></form>");  
	      
              //   return data;  
              //   }
              //  }


             $(function(){
                 var influ_scope = 'all_nolimit'; 
                 var influ_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+influ_scope+'&all=True';
                 console.log(influ_url);               
               function init_table(data){
                $('#table-user').bootstrapTable({
                  //url: influ_url,
                  data:data,
                  search: true,//是否搜索
                  pagination: true,//是否分页
                  pageSize: 20,//单页记录数
                  pageList: [5, 10, 20, 50],//分页步进值
                  sidePagination: "client",//服务端分页
                  searchAlign: "left",
                  searchOnEnterKey: false,//回车搜索
                  showRefresh: true,//刷新按钮
                  showColumns: true,//列选择按钮
                  buttonsAlign: "left",//按钮对齐方式
                  locale: "zh-CN",//中文支持
                  detailView: false,
                  showToggle:true,
                  sortName:'bci',
                  sortOrder:"desc",
                  columns: [  
                    {
                        title: "全选",
                        field: "select",
                        checkbox: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "排名",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { 
                          return index+1;
                        }
                    },
                    {
                        title: "昵称",
                        field: "uname",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value,row) { 
                          if(value=="unknown"||value==""){
                            value = "未知";
                          }
                          var e = '<a class="user_view" data-toggle="tooltip" title="看看TA是谁？" data-placement="right" href="/index/viewinformation/?uid='+row.uid+'" target="_blank">'+value+'</a>';   ///index/viewinformation/?uid=\''+row.uid+'\'
                            return e;
       
                        }
                    },
                    {
                        title: "用户ID",
                        field: "uid",
                        align: "center",//水平
                        valign: "middle",//垂直
                        visible:false
                    },
                    {
                        title: "注册地",
                        field: "location",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                           if(value=="unknown"||value==""){
                            value = "未知";
                          }
                           return value;
                        }
                    },
                    {
                        title: "影响力",
                        field: "bci",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                           var e = new Number(value);
                           e = e.toFixed(2);
                          return e;
                        }
                    },
                    {
                        title: "权威值",
                        field: "imp",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          var e = new Number(value);
                           e = e.toFixed(2);
                          return e;
                        },
                         visible: false
                    },
                    {
                        title: "粉丝数",
                        field: "fans",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "微博数",                        
                        field: "weibo_count",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "活跃度",
                        field: "act",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          var e = new Number(value);
                           e = e.toFixed(2);
                          return e;
                        },
                        visible: false
                    }]

             });
            $('#table-user-user-contain').css("display","none");
            $('#table-user-contain').css("display","block");
            $('.user_view').tooltip();
          } 
           call_sync_ajax_request(influ_url, init_table);
         })
        
        

        //定义展示任务
        function get_result(data)
             { 
              var data = data['result'];
              $('#table-user').bootstrapTable('refresh', {data: data});
             }
        //定义删除任务
        function delete_result(data)
             { 
              console.log(data);
              if(data.flag == true){
                alert('删除成功！');
                var task_url = '/influence_sort/search_task/?username='+username;
                console.log(task_url);
                $('#topic-task').bootstrapTable('refresh',{url:task_url})
              }else{
                alert('删除失败！');
              }
             }
        //定义刷新相似用户列表
      function similar_user(data){
            $('#table-user-user').bootstrapTable({
                 // url: data,
                  data:data,
                  search: true,//是否搜索
                  pagination: true,//是否分页
                  pageSize: 20,//单页记录数
                  pageList: [5, 10, 20, 50],//分页步进值
                  sidePagination: "client",//服务端分页
                  searchAlign: "left",
                  searchOnEnterKey: false,//回车搜索
                  showRefresh: true,//刷新按钮
                  showColumns: true,//列选择按钮
                  buttonsAlign: "left",//按钮对齐方式
                  locale: "zh-CN",//中文支持
                  detailView: false,
                  showToggle:true,
                  sortName:'similiar',
                  sortOrder:"desc",
                  columns: [  
                    {
                        title: "全选",
                        field: "",
                        checkbox: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "序号",//标题
                        field: "",//键名
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { return index+1;}
                    },
                    {
                        title: "昵称",
                        field: "uname",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value,row) { 
                          if(value=="unknown"||value==""){
                            value = "未知";
                          }
                          var e = '<a class="user_view" data-toggle="tooltip" title="看看TA是谁？" href="/index/viewinformation/?uid='+row.uid+'" data-toggle="popover" target="_blank">'+value+'</a>'; 
                           return e;
                        }
                    },
                    {
                        title: "用户ID",//标题
                        field: "uid",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        visible:false
                    },
                    {
                        title: "相关度",                        
                        field: "similiar",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          var e = value;
                           e = e.toFixed(2);
                          return e;
                        }
                    },
                    {
                        title: "影响力",
                        field: "influence",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          var e = value;
                           e = e.toFixed(2);
                          return e;
                        }
                    },
                    {
                        title: "活跃度",
                        field: "activeness",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          var e = value;
                           e = e.toFixed(2);
                          return e;
                        }
                    }]
             });
            $('.user_view').tooltip();
         };
      function dele_analysis(data){
             var a = confirm('确定要删除吗？');
                if (a == true){
                 var results_url = '/influence_sort/delete_task/?search_id='+data;
                  console.log(results_url);
                  call_sync_ajax_request(results_url, delete_result);
                }
             }; 
     function view_analysis(data){
       var results_url = '/influence_sort/get_result/?search_id='+data;
       console.log(results_url);
       call_sync_ajax_request(results_url, get_result);
     };
      function draw_topic_tasks(data){
       
         var data = data.data;
         $('#topic-task').bootstrapTable({
                  data: data,
                  search: true,//是否搜索
                  pagination: true,//是否分页
                  pageSize: 5,//单页记录数
                  pageList: [5, 10, 20, 50],//分页步进值
                  sidePagination: "client",//服务端分页
                  searchAlign: "left",
                  searchOnEnterKey: false,//回车搜索
                  showRefresh: true,//刷新按钮
                  showColumns: true,//列选择按钮
                  buttonsAlign: "left",//按钮对齐方式
                  locale: "zh-CN",//中文支持
                  detailView: false,
                  sortName:'create_time',
                  sortOrder:"desc",
                  columns: [
                    {
                        title: "序号",//标题
                        field: "",//键名
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { return index+1;}
                    },
                     {
                        field: "search_id",
                        title: "任务ID",
                        align: "center",//水平
                        valign: "middle",//垂直
                        visible: false
                    },
                    {
                        field: "keyword",
                        title: "兴趣圈",
                        align: "center",//水平
                        sortable: true,
                        valign: "middle"//垂直
                    },
                    {
                        field: "create_time",
                        title: "发现时间",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        sortOrder: "desc"//默认排序方式
                    },
                    {
                        field: "status",
                        title: "进度显示",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value){ 
                        if(value == -1){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:50%;font-valign:middle;font-size:12px;">50%</div></div>';
                        }else if(value == 1){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:100%;font-valign:middle;font-size:12px;">100%</div></div>';
                        }else if(value == 0){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:0%;font-valign:middle;font-size:12px;">0%</div></div>';
                          }
                          return e;
                      }
                    },
                    {
                        title: "圈子查看",
                        field: "status",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row){  
                        if(value == -1){
                          var e = '<span>正在计算</span>';
                        }else if(value == 1){
                          var e = '<span style="cursor:pointer;" onclick="view_analysis(\''+ row.search_id +'\')">点击查看</span>';
                        }else if(value == 0){
                          var e = '<span>尚未计算</span>';
                          }
                          return e;
                     }
                    },
                    {
                      title: '操作',
                      field: 'operator',
                      align: 'center',
                      valign: "middle",//垂直
                      formatter:function(value,row,index){  
                      var d = '<span style="cursor:pointer;" onclick="dele_analysis(\''+ row.search_id +'\')">删除</span>';  
                        return d;  
                      }
                    }],
                     rowStyle:function rowStyle(row, index){
                      return {
                        classes: 'text-nowrap another-class',
                        css: {"padding-top": "1px","padding-bottom": "1px"}
                      }
                    }
             }); 
                 
           }

         $(function(){
           var user_tasks_url = '/influence_sort/search_task/?username='+username;
           console.log(user_tasks_url);
           call_sync_ajax_request(user_tasks_url, draw_topic_tasks);
         })
        //定义提交离线话题搜索任务
             function submit_offline(data){
              console.log(data);
              if(data.flag == true){
                alert('恭喜！您成功创建了一个兴趣圈！但这需要一点时间才能查看结果哦~');
                var task_url = '/influence_sort/search_task/?username='+username;
                console.log(task_url);
               $('#topic-task').bootstrapTable('refresh',{url:task_url});
               $('#topic-manage').collapse('show');
              //  call_sync_ajax_request(task_url, draw_topic_tasks);
              }else if(data == 'more than limit'){
                    alert('您当前提交的任务超过数量咯，请稍后继续提交！');
                }else{
                alert('抱歉！进入圈子失败，请重试！');
              }
              document.getElementById('keyword_hashtag').value ="";

            }

              $('#keyword_hashtag').focus(function () { 
                if($('#search_norm option:selected').text()=='朋友圈'){
                  $('#keyword_hashtag').attr("placeholder","输入TA的昵称或ID，看看和TA相似的朋友都有谁？");
                 }else{
                  $('#keyword_hashtag').attr("placeholder","输入您感兴趣的圈子名，看看您的兴趣圈都有谁？");
                 }
             })
            //搜索按钮的click事件
              $(function () { 
                 $('#search-btn').click(function () {
                    var keyword = $('#keyword_hashtag').val();
                    if(keyword == ''){  //检查输入词是否为空
                    alert('您还没有输入任何内容哦~');
                    }else{
                    var keyword_string = keyword.split(/\s+/g);                  
                   if($('#search_norm option:selected').text()=='朋友圈'){
                    $('#table-user-contain').css("display","none");
                    $('#table-user-user-contain').css("display","block");
                    var user_id = keyword;//'2722498861';
                    var user_url = '/influence_sort/imagine/?uid='+user_id+'&keywords=topic_string&weight=1';
                   // console.log(user_url);
                    call_sync_ajax_request(user_url, similar_user);
                    document.getElementById('keyword_hashtag').value ="";
                    //similar_user(user_url);
                     }else{ 
                    var sort_scope = 'all_limit_keyword';
                    var topic_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword_string+'&all=True';
                    console.log(topic_url);
                    //var url = '/user_rank/user_sort/?time=-1&username='+username+'&st='+time_from +'&et='+time_to+'&sort_norm='+sort_norm+'&sort_scope='+sort_scope+'&arg='+keyword_string+'&task_number='+task_num+'&number='+number_sort;
                    //var task_num = "{{g.user.usernum}}";
                    call_sync_ajax_request(topic_url, submit_offline);
                     };
                   };
                 });
              })

            //实现“近一周各领域影响力用户排行”
              
              $(function () { 
              function refresh_area_table(area_url){
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
                  
              }
              var sort_scope = 'in_limit_topic';  
              $('#week-influ').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var influ_scope = 'all_nolimit'; 
                  var influ_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+influ_scope+'&all=True';
                  console.log(influ_url);
                  $('#table-user').bootstrapTable('refresh', {url: influ_url});
                  $('#table-user').bootstrapTable('hideColumn', 'imp');
                  $('#table-user').bootstrapTable('hideColumn', 'act');
                  $('#table-user').bootstrapTable('showColumn', 'fans');
                  $('#table-user').bootstrapTable('showColumn', 'weibo_count');                   
              });
              $('#education').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '教育类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#military').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '军事类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#tech').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '科技类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#sports').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '文体类_体育';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#amusement').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '文体类_娱乐';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#livehood').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  //var keyword = ['environment','medicine','traffic','employment','house','law','social-security'];
                  var keyword ='民生类_社会保障';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#politics').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  //var keyword = ['politics','anti-corruption','fear-of-violence','peace','religion'];
                  var keyword ='政治类_外交';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });
              $('#business').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '经济类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              }); 
              $('#others').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '其他类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  refresh_area_table(area_url);
              });  

          })


         function addgroup(){
             var arg = $('#table-user-contain').css("display");
             var artt = $('#table-user-user-contain').css("display");
             if(arg == "block" && artt == "none"){
              var $table = $('#table-user');
             }else if(arg == "none" && artt == "block"){
              var $table = $('#table-user-user');
             }else{
              console.log('表格display冲突！');
             }
            selected_list = $table.bootstrapTable('getSelections');
           // console.log(selected_list);
            if( selected_list.length == 0){
              alert('您还没有选择用户哦！');
            }else{
              $('#addModal').modal('show');
              display_grouplist();
         }
        }

         //将成员添加到已有的群组里面
  function modify_group(obj){
     var task = $(obj).attr("value");
     var r=confirm("您确定要将所选用户添加到“"+task+'”群组内吗？');
    if(r==true){
          	
          	//console.log(task);
		  function re_call(data){
            console.log(data);
             var group_uid_list = new Array();
             for(var i=0;i<data.length;i++){
              group_uid_list[i]=data[i]['ID'];
             }
              console.log('增加前人数：'+group_uid_list.length); //打印不出来，url无数据
	           var k =group_uid_list.length;
	           var dupli_uid_list = group_uid_list;
	           var h = [];
	           var e = 0;
	          for(var i=0;i<selected_list.length;i++){
	          	for(var j=0;j<dupli_uid_list.length;j++){
	          	  if(selected_list[i].uid==dupli_uid_list[j]){
	          	    h[e] = i;
	          	    e =e+1;
	          		}
	            }
	           }  
	           console.log(h.length);
              if(h.length==0){
              	for(var i=0;i<selected_list.length;i++){
                  group_uid_list[k]=selected_list[i].uid;
	              k = k+1;
              	}
              	console.log('增加后人数：'+group_uid_list.length);
	            var group_ajax_url = '/influence_sort/submit_task/';
	            var submit_name =  username;//获取$('#useremail').text();
	            var group_analysis_count = 10;//获取
	            var job = {"submit_user":submit_name,"task_name":task, "uid_list":group_uid_list, "task_max_count":group_analysis_count};
	            console.log(job);
	             function callback(data){
                  if (data == 1){
                      alert('用户已添加到群组！请前往圈子追踪中查看分析进度！');
                      $('#addModal').modal('hide');
                      window.location.reload();
                  }
                  if(data == 0){
                      alert('用户添加失败，请重试！'); 
                       $('#addModal').modal('hide');
                      window.location.reload();
                  }
                  if(data == 'more than limit'){
                      alert('抱歉！您目前提交任务超出规定数量，请稍后重试！');
                       $('#addModal').modal('hide');
                      window.location.reload();
                  }
              }
              //删除原来组  
            var url = '/info_group/delete_group_task/?';
            url = url + 'task_name=' + task +'&submit_user=' + username;//$('#useremail').text();
            call_sync_ajax_request(url,del);
             function del(data){
              //console.log(data);
               if(data==true){

                $.ajax({
                  type:'POST',
                  url: group_ajax_url,
                  contentType:"application/json",
                  data: JSON.stringify(job),
                  dataType: "json",
                  success: callback
              }); 
               }else{
                 console.log('已有群组删除失败');
               }
              }
           //删除原来组结束
              
           }else{        //选择的用户不重复
              	  var s ='您选择的用户(';
              	  for(var i=0;i<h.length;i++){
              	  	s+=('微博ID：'+selected_list[h[i]].uid+'，微博昵称：'+selected_list[i].uname+'；');
              	  }
              	  s+=')已存在该组！\n请重新选择！';
	                 alert(s);
	               

	             }
          	}//re_call结束
          	 var re_url='/info_group/group_member/?task_name='+task+'&submit_user='+username;
          	call_sync_ajax_request(re_url, re_call);
         }else{
             //
         }

        }

    function display_grouplist(){
           var group_list_url='/info_group/show_task/?submit_user='+username ;
           $.ajax({
                  type:'GET',
                  url: group_list_url,
	                dataType: 'json',
	                async: true,
                  success: draw_group_list
              }); 
            function draw_group_list(data){
            var length = data.length;
             $('#group_list').empty();
            for(var i=0;i<length;i++){
             var htm = '<li style="cursor:pointer;margin-top:10px;margin-left:5px;" onclick="modify_group(this)" value="'+data[i]['task_name']+'">'+data[i]['task_name']+'<span class="badge" style="margin-left:5px;">'+data[i]['group_count']+'</span></li>';
             $('#group_list').append(htm);
             }
           }
          }



          function new_group_build(){
              var group_name = $('#cicle_name').val();
              if(group_name==''){
               alert('Ops！起个名儿呗');
              }else{
              console.log(group_name);

              var list_length = selected_list.length;
	            var group_uid_list = new Array();
	            for(var i=0;i<list_length;i++){
	            group_uid_list[i]=selected_list[i].uid;
	            }          
	            var group_ajax_url = '/influence_sort/submit_task/';
	            var admin = username;//获取$('#useremail').text();
	            var group_analysis_count = 10;//获取
	            var job = {"submit_user":admin,"task_name":group_name, "uid_list":group_uid_list, "task_max_count":group_analysis_count};
	            console.log(job);
	             function callback(data){
                  console.log(data);
                  if (data == '1'){
                      alert('追踪任务已提交！请前往圈子追踪中查看分析进度！');
                       $('#addModal').modal('hide');
                      window.location.reload();
                  }
                  if(data == '0'){
                      alert('任务提交失败，请重试！');
                  }
                  if(data == 'more than limit'){
                      alert('抱歉！您目前提交任务超出规定数量，请稍后重试！');
                  }
              }

              $.ajax({
                  type:'POST',
                  url: group_ajax_url,
                  contentType:"application/json",
                  data: JSON.stringify(job),
                  dataType: "json",
                  success: callback
              }); 
	         }
          }


    


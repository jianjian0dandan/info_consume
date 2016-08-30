//data:{ username:$("#username").val(), content:$("#content").val() }         
//data-ajax="ajaxRequest"
              //var username = $('#username').text();
              var username = 'admin@qq.com';
              //#table-user 表格默认显示“近一周全网影响力用户排行”
             $(function(){ 
                 var influ_scope = 'all_nolimit'; 
                 var influ_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+influ_scope+'&all=True';
                 console.log(influ_url);
                $('#table-user').bootstrapTable({
                  url: influ_url,
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
                        title: "用户ID",
                        field: "uid",
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "注册地",
                        field: "location",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          if(value == "unknown"||value ==""){
                             value = "未知";
                          }
                          return value;
                        }
                    },
                    {
                        title: "昵称",
                        field: "uname",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          if(value == "unknown"||value == ""){
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
                           value = value.toFixed(2);
                          return value;
                        }
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
                        title: "重要度",
                        field: "imp",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        visible: false,
                        formatter: function (value) { 
                          value = value.toFixed(2);
                          return value;
                        }
                    },
                    {
                        title: "活跃度",
                        field: "act",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        visible: false,
                        formatter: function (value) { 
                          value =value.toFixed(2);
                          return value;
                        }
                    }]
             });
            
           })
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
        //定义展示任务
        function get_result(data)
             { 
             // var data = data['result'];
              $('#topic-task').bootstrapTable('refresh', {url: data});
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
                  columns: [  
                    {
                        title: "全选",
                        field: "",
                        checkbox: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "用户ID",//标题
                        field: "uid",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "昵称",
                        field: "uname",
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
                        title: "相关度",                        
                        field: "similiar",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          value = value.toFixed(2);
                          return value;
                        }
                    },
                    {
                        title: "影响力",
                        field: "influence",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          value = value.toFixed(2);
                          return value;
                        }
                    },
                    {
                        title: "活跃度",
                        field: "activeness",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value) { 
                          value = value.toFixed(2);
                          return value;
                        }
                    }]
             });
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
                  columns: [
                    {
                        title: "序号",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { return index+1;}
                    },
                    {
                        field: "keyword",
                        title: "话题关键词",
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "create_time",
                        title: "提交时间",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
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
                        title: "任务查看",
                        field: "status",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row){  
                        if(value == -1){
                          var e = '<span>正在计算</span>';
                        }else if(value == 1){
                          var e = '<span style="display:none;">'+row.search_id+'</span><span class="view-analysis" style="cursor:pointer;">点击查看</span>';
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
                      var d = '<span style="display:none;">'+row.search_id+'</span>'+'<span class="dele-analysis" style="cursor:pointer;">删除</span>';  
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
            bootstraptable('click-cell.bs.table',function( e, field, value, row, $element){}）
             $('.view-analysis').click(function () {
                  var results_url = '/influence_sort/get_result/?search_id='+$(this).prev().text();
                  console.log(results_url);
                  call_sync_ajax_request(results_url, get_result);
              }); 
                $('.dele-analysis').click(function(){
                  var delete_url = '/influence_sort/delete_task/?search_id='+$(this).prev().text();
                  console.log(delete_url);
                  call_sync_ajax_request(delete_url, delete_result);
                  $('.dele-analysis').unbind("click");
               });
            }


         $(function(){
           var user_tasks_url = '/influence_sort/search_task/?username='+username;
           console.log(user_tasks_url)
           call_sync_ajax_request(user_tasks_url, draw_topic_tasks);
         })
        //定义提交离线话题搜索任务
             function submit_offline(data){
              console.log(data);
              if(data.flag == true){
                alert('提交成功！已添加至离线任务');
                var task_url = '/influence_sort/search_task/?username='+username;
                console.log(task_url);
                $('#topic-task').bootstrapTable('refresh',{url:task_url});
              //  call_sync_ajax_request(task_url, draw_topic_tasks);
              }else if(data == 'more than limit'){
                    alert('提交任务数超过用户限制，请等待结果计算完成后提交新任务！');
                }else{
                alert('提交失败，请重试！')
              }
            }
            //搜索按钮的click事件
              $(function () { 
                 $('#search-btn').click(function () {
                    var keyword = $('#keyword_hashtag').val();
                    if(keyword == ''){  //检查输入词是否为空
                    alert('请输入关键词！');
                    }else{
                    var keyword_string = keyword.split(/\s+/g);                  
                   if($('#search_norm option:selected').text()=='用户'){
                    $('#table-user-contain').css("display","none");
                    $('#table-user-user-contain').css("display","block");
                    var user_id = '2722498861';
                    var user_url = '/influence_sort/imagine/?uid='+user_id+'&keywords=topic_string&weight=1';
                   // console.log(user_url);
                    call_sync_ajax_request(user_url, similar_user);
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
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
                  
              });
              $('#military').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '军事类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#tech').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '科技类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#sports').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '文体类_体育';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#amusement').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '文体类_娱乐';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#livehood').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  //var keyword = ['environment','medicine','traffic','employment','house','law','social-security'];
                  var keyword ='民生类_社会保障';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#politics').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  //var keyword = ['politics','anti-corruption','fear-of-violence','peace','religion'];
                  var keyword ='政治类_外交';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });
              $('#business').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '经济类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              }); 
              $('#others').click(function () {
                  $('#table-user-user-contain').css("display","none");
                  $('#table-user-contain').css("display","block");
                  var keyword = '其他类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
                  $('#table-user').bootstrapTable('hideColumn', 'fans');
                  $('#table-user').bootstrapTable('hideColumn', 'weibo_count');
                  $('#table-user').bootstrapTable('showColumn', 'imp');
                  $('#table-user').bootstrapTable('showColumn', 'act');
              });  
          })


   //选择用户提交群组分析
   function group_analyze_confirm_button(){

   }
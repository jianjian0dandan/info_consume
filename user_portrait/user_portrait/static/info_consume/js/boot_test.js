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
                        formatter: function (value, row, index) { return index+1;}
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
                        valign: "middle"//垂直
                    },
                    {
                        title: "昵称",
                        field: "uname",
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        title: "影响力",
                        field: "bci",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
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
              data = data['result'];
              $('#table-user').bootstrapTable('refresh', {url: data});
             }
        //定义删除任务
        function delete_result(data)
             { 
              data = data['result'];
              $('#table-user').bootstrapTable('refresh', {url: data});
             }
        //定义刷新相似用户列表
         function similar_user(data){
          $('#table-user').parent().parent().parent().css("display","none");
          $('#table-user').parent().parent().parent().next().css("display","none");
            data_len = data.length;
            data = data.slice(1,len-2);
            $('#table-user-user').bootstrapTable({
                  url: data,
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
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){    
                        for(var i=0;i<data.length;i++){ 
                          var e ='<span>'+data[i][0]+'</span>'
                          return e;
                         } 
                      }
                    },
                    {
                        title: "昵称",
                        field: "",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){    
                        for(var i=0;i<data.length;i++){ 
                          var e ='<span>'+data[i][1]+'</span>'
                          return e;
                         } 
                      }
                    },
                    {
                        title: "相关度",                        
                        field: "",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){    
                        for(var i=0;i<data.length;i++){ 
                          var e ='<span>'+data[i][5]+'</span>'
                          return e;
                         } 
                      }
                    },
                    {
                        title: "影响力",
                        field: "",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){    
                        for(var i=0;i<data.length;i++){ 
                          var e ='<span>'+data[i][4]+'</span>'
                          return e;
                         } 
                      }
                    },
                    {
                        title: "活跃度",
                        field: "",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){    
                        for(var i=0;i<data.length;i++){ 
                          var e ='<span>'+data[i][2]+'</span>'
                          return e;
                         } 
                      }
                    }]
             });
                
            for(var i=0;i<data.length;i++){

            }
         }
        //定义展示离线任务表格
        function task_status (data) {
            var data = data.data;
              //console.log(data);
            $('#topic-task').bootstrapTable({
                  url: data,
                  search: true,//是否搜索
                  pagination: true,//是否分页
                  pageSize: 10,//单页记录数
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
                        formatter:function(value,row,index){  
                        for(var i=0;i<data.length;i++){ 
                        if(data[i].status == -1){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:50%;font-valign:middle;font-size:12px;">50%</div></div>';
                        }else if(data[i].status == 1){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:100%;font-valign:middle;font-size:12px;">100%</div></div>';
                        }else if(data[i].status == 0){
                          var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:0%;font-valign:middle;font-size:12px;">0%</div></div>';
                          }
                          return e;
                         } 
                      }
                    },
                    {
                        field: "analysis",
                        title: "任务查看",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){  
                        for(var i=0;i<data.length;i++){ 
                        if(data[i].status == -1){
                          var e = '<span style="display:none;">'+data[i].search_id+'</span>'+'<span>正在计算</span>';
                        }else if(data[i].status == 1){
                          var e = '<span style="display:none;">'+data[i].search_id+'</span>'+'<a class="view-analysis" href="">点击查看</a>';
                        }else if(data[i].status == 0){
                          var e = '<span style="display:none;">'+data[i].search_id+'</span>'+'<span>尚未计算</span>';
                          }
                          return e;
                      }  
                     }
                    },
                    {
                      title: '操作',
                      field: 'operator',
                      align: 'center',
                      valign: "middle",//垂直
                      formatter:function(value,row,index){  
                      var d = '<span style="display:none;">'+data[i].search_id+'</span>'+'<a class="dele-analysis" href="#">删除</a>';  
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
              $('#view-analysis').click(function () {
                  var results_url = '/influence_sort/get_result/?search_id='+$(this).prev().text();
                  console.log(results_url);
                  call_sync_ajax_request(results_url, get_result);
              }); 
              $('#dele-analysis').click(function () {
                  var delete_url = '/influence_sort/delete_task/?search_id='+$(this).prev().text();
                  console.log(delete_url);
                  call_sync_ajax_request(delete_url, delete_result);
              });
          }
             
        //定义提交离线话题搜索任务
             function submit_offline(data){
              if(data.flag == true){
                alert('提交成功！已添加至离线任务');
                var task_url = '/influence_sort/search_task/?username='+username;
                console.log(task_url)
                    call_sync_ajax_request(task_url, task_status);
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
                    var user_id = '1618051664';
                    var user_url = '/influence_sort/imagine/?uid='+user_id+'&keywords=topic_string&weight=1';
                    console.log(user_url);
                    call_sync_ajax_request(user_url, similar_user);
                    //manage 相似用户搜索
                     }else{ 
                    var sort_scope = 'all_limit_keyword';
                    var topic_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword_string;
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
             
              $('#education').click(function () {
                  $('#table-user-user').css("display","none");
                  $('#table-user-user').next().css("display","none");
                  $('#table-user').parent().parent().parent().css("display","block");
                  $('#table-user').parent().parent().parent().next().css("display","block"); 
                  var keyword = '教育类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#military').click(function () {
                  var keyword = '军事类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#tech').click(function () {
                  var keyword = '科技类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#sports').click(function () {
                  var keyword = '文体类_体育';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#amusement').click(function () {
                  var keyword = '文体类_娱乐';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#livehood').click(function () {
                  //var keyword = ['environment','medicine','traffic','employment','house','law','social-security'];
                  var keyword ='民生类_社会保障';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#politics').click(function () {
                  //var keyword = ['politics','anti-corruption','fear-of-violence','peace','religion'];
                  var keyword ='政治类_外交';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });
              $('#business').click(function () {
                  var keyword = '经济类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              }); 
              $('#others').click(function () {
                  var keyword = '其他类';
                  var area_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
                  console.log(area_url);
                  $('#table-user').bootstrapTable('refresh', {url: area_url});
              });  
          })



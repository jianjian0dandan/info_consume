         function call_sync_ajax_request(url, method, callback){
              $.ajax({
                url: url,
                type: method,
                dataType: 'json',
                async: true,
                success:callback
              });
            }
         $(function(){
              var current_user = 'admin@qq.com'; //获取
              var task_url = '/group/show_task/?submit_user='+current_user;
              console.log(task_url);
            $('#cicle-task').bootstrapTable({
                  url: task_url,
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
                        field: "order",//键名
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { 
                          return index+1;
                        }
                    },
                    {
                        field: "",
                        title: "群组名称",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "",
                        title: "提交时间",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "process",
                        title: "进度显示",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){  
                        var e = '<div class="progress" style="margin-top:10px;margin-bottom:10px;height:15px;"><div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:50%;font-valign:middle;font-size:12px;">50%</div></div> ';  
                        return e;
                    }
                    },
                    {
                        field: "analysis",
                        title: "群体分析",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){  
                        var e = '<span class="view-analysis" href="#circle-manage">点击查看</a> ';   
                        return e;  
                    }
                    },
                    {
                      title: '操作',
                      field: 'operator',
                      align: 'center',
                      valign: "middle",//垂直
                      formatter:function(value,row,index){   
                      var d = '<span style="cursor:pointer;" onclick="del()">删除</a> ';  
                        return d;  
                    } 
                  }],
                    rowStyle:function rowStyle(row, index) {
                      return {
                        classes: 'text-nowrap another-class',
                        css: {"padding-top": "1px","padding-bottom": "1px"}
                      };
                    }
             });
                   $(document).ready(function(){
                     $(".view-analysis").click(function(){
                          $("#circle-analysis").slideDown();
                      });
                     $("#close-circle").click(function(){
                          $("#circle-analysis").slideUp();
                      });
            });
         


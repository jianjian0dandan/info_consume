//data:{ username:$("#username").val(), content:$("#content").val() }         
//data-ajax="ajaxRequest"
              $('#table-user').bootstrapTable({
                  url: '',
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
                        title: "序号",//标题
                        field: "order",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "nick_name",
                        title: "昵称",
                        sortable: true,
                        titleTooltip: "this is name",
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "pagerank",
                        title: "影响力",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "fansnum",
                        title: "粉丝数",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "statusnum",
                        title: "微博数",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "retwwie",
                        title: "转发数",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "comments",
                        title: "评论数",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    }                
                ]
             });
              //提交群组分析

               $("#addRecord").click(function(){
                


                });
              //下拉菜单框
                  window.onload=function(){
                  $('.selectpicker').selectpicker(); 
                  };

               $('#topic-task').bootstrapTable({
                  url: '#',
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
                        field: "topic_name",
                        title: "话题关键词",
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "handtime",
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
                        title: "任务查看",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row,index){  
                        var e = '<a class="view-analysis" href="#">点击查看</a> ';   
                        return e;  
                    }
                    },
                    {
                      title: '操作',
                      field: 'operator',
                      align: 'center',
                      valign: "middle",//垂直
                      formatter:function(value,row,index){  
                      var e = '<a href="#" onclick="edit(\''+ row.id + '\')">编辑</a> ';  
                      var d = '<a href="#" onclick="del(\''+ row.id +'\')">删除</a> ';  
                        return e+d;  
                    } 
                  }],
                    rowStyle:function rowStyle(row, index) {
                      return {
                        classes: 'text-nowrap another-class',
                        css: {"padding-top": "1px","padding-bottom": "1px"}
                      };
                    }
             });


//搜索一周影响力排行、领域排行
   var $table = $('#table-user');  
    $(function () {    
        $('#total-influ').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#education').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#military').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#tech').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#sports').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#livehood').click(function () {
            $table.bootstrapTable('refresh', {url: ''});
        });
        $('#politics').click(function () {
            $table.bootstrapTable('refresh', {url: 'data2.json'});
        });
        $('#business').click(function () {
            $table.bootstrapTable('refresh', {url: 'data2.json'});
        }); 
        $('#others').click(function () {
            $table.bootstrapTable('refresh', {url: 'data2.json'});
        });  
    }); 
   
    

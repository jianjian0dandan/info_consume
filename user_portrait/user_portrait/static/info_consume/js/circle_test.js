        //当前用户名
        s_user = 'admin@qq.com';
        g_name = '冯绍峰'; 
         $('#num_btn').tooltip();
         function call_sync_ajax_request(url, method, callback){
              $.ajax({
                url: url,
                type: method,
                dataType: 'json',
                async: true,
                success:callback
              });
            }
          function del(data){
		//console.log(data);
		     if(data==true){
		   	alert('操作成功！');
			   location.reload();
		      }
        }

      function dele_analysis(data){
              var a = confirm('确定要删除整个群组吗？');
                if (a == true){
                  var url = '/info_group/delete_group_task/?';
                url = url + 'task_name=' + data +'&submit_user=' + 'admin@qq.com';//$('#useremail').text();
                console.log(url);
                call_sync_ajax_request(url,'GET',del);
              }
            } 
 //获取群组名称
     function view_analysis(data){
       g_name = data;
       $("#circle-analysis").slideDown();
       console.log(g_name);
     }  

    function open_detail(task){
      $('#detail_Modal').modal('show');
	      function con_call(data){
		      var num_data = [];
		   for(var key in data){
		      var num = {};
		      num["ID"]=key;
		      num["name"]=data[key];
		      num_data.push(num);
              }
         $('#consitute').bootstrapTable({
                  data: num_data,
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
                  sortName:'submit_date',
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
                        title: "序号",//标题
                        field: "order",//键名
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { 
                          return index+1;
                        }
                    },
                    {
                        field: "ID",
                        title: "ID",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value,row) {
                          var e = '<a class="user_view" href="/index/viewinformation/?uid='+row.ID+'">'+value+'</a>';   ///index/viewinformation/?uid=\''+row.uid+'\'
                            return e;
       
                        }
                    },
                    {
                        field: "name",
                        title: "昵称",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value,row) { 
                          if(value=="unknown"||value==""||value=="unkown"){
                            value = "未知";
                          }
                          var e = '<a class="user_view" href="/index/viewinformation/?uid='+row.ID+'">'+value+'</a>';   ///index/viewinformation/?uid=\''+row.uid+'\'
                            return e;
       
                        }
                    }],
                    rowStyle:function rowStyle(row, index) {
                      return {
                        classes: 'text-nowrap another-class',
                        css: {"padding-top": "1px","padding-bottom": "1px"}
                      };
                    }
             });
      
      //删除成员
        $('#num_btn').click(function(){
        	var url = '/info_group/delete_group_task/?';
            url = url + 'task_name=' + task +'&submit_user=' + s_user;//$('#useremail').text();
            call_sync_ajax_request(url,'GET',del);
             function del(data){
      		    //console.log(data);
      		     if(data==true){
      		     }else{
                 console.log('已有群组删除失败');
               }
      		}

           var num_selected = $('#consitute').bootstrapTable('getSelections');
           var del_list = [];
           for(var i=0;i<num_selected.length;i++){
	         del_list.push(num_selected[i].ID);
	       } 
	        console.log(del_list.length);
	        console.log(num_data.length);
	         var new_num_id = [];
	         var k =0;
           	for(var j=0;j<num_data.length;j++){
           		for(var i=0;i<del_list.length;i++){
              if(num_data[j]['ID']!=del_list[i]){
                new_num_id[k] =num_data[j];
                k+=1;
              }
             }
            }
            console.log(new_num_id.length);
	      	    var group_ajax_url = '/influence_sort/submit_task/';
	            var submit_name =  s_user;//获取$('#useremail').text();
	            var group_analysis_count = 10;//获取
	            var job = {"submit_user":submit_name,"task_name":task, "uid_list":new_num_id, "task_max_count":group_analysis_count};
	            console.log(job);
	             function callback(data){
                  if (data == '1'){
                     // alert('追踪任务已提交！请前往圈子spy中查看分析进度！');
                     $('#detail_Modal').modal('hide');
                     location.reload();
                  }
                  if(data == '0'){
                     // alert('任务提交失败，请重试！');
                  }
                  if(data == 'more than limit'){
                     // alert('抱歉！您目前提交任务超出规定数量，请稍后重试！');
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
        });//删除成员结束
      }//con_call 结束
      var con_url='/info_group/group_member/?task_name='+task+'&submit_user='+s_user;
      console.log(con_url);
      call_sync_ajax_request(con_url,'GET',con_call);
     }//open_detail结束

         $(function(){
              var current_user = 'admin@qq.com'; //获取
              var task_url = '/info_group/show_task/?submit_user='+current_user;
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
                  sortName:'submit_date',
                  sortOrder:"desc",
                  columns: [
                    {
                        title: "序号",//标题
                        field: "order",//键名
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) { 
                          return index+1;
                        }
                    },
                    {
                        field: "task_name",
                        title: "圈子名称",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "submit_date",
                        title: "提交时间",
                        sortable: true,
                        align: "center",//水平
                        valign: "middle"//垂直
                    },
                    {
                        field: "group_count",
                        title: "圈子人数",
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
                        field: "status",
                        title: "圈子细查",
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter:function(value,row){  
                        if(value == 1){
                          var e = '<span">正在计算</span>';
                        }else if(value == 0){
                         var e = '<span style="cursor:pointer;" onclick="view_analysis(\''+ row.task_name +'\')">点击查看</span> ';
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
                      var d = '<span style="cursor:pointer;" onclick="dele_analysis(\''+ row.task_name +'\')">删除</span> ';  
                      d+= '<span style="cursor:pointer;" onclick="open_detail(\''+ row.task_name +'\')">编辑</span> ';
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
                     $("#close-circle").click(function(){
                          $("#circle-analysis").slideUp();
                      });
                 
            });

        

                
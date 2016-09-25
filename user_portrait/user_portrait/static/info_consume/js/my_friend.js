function my_friend() {
	this.ajax_method = 'GET';
}

my_friend.prototype = 
 {
	call_sync_ajax_request:function(url,method,callback) 
	{
	  $.ajax({
		url: url,
		type: method,
		dataType:'json',
		async:true,
		success:callback
	   });
    },
    personData:function(data){
	  personalData = data ;	
	  //console.log(personalData);	  
	  var img = document.getElementById('portraitImg');
	  if(personalData.photo_url == "unknown"){
	      img.src =  "http://tp2.sinaimg.cn/1878376757/50/0/1";
	  }else{
	  	  //console.log('here is pic');
	      img.src = personalData.photo_url;
	  }
	  var nickName = document.getElementById('username');
	  if(personalData.nick_name){
	      if (personalData.nick_name == 'unknown') {
	          nickName.innerHTML = '未知';
	      }
	      else{
	          nickName.innerHTML = personalData.nick_name;
	      }
	  }else{
	      nickName.innerHTML = "无此数据";
	  }
},

//好友排行
   my_friend_rank:function(data)
   {
       //console.log(data); 
      // console.log(data.length);
      // console.log(data[0]['influence']);
      //对返回的字典按照影响力进行排序
      data.sort(function(a,b){
            return b.influence-a.influence});
      //根据后台数据画表
      $('#friend_rank').empty();
      if(data.length==0)
      {
         document.getElementById('friend_rank').innerHTML = "暂无数据";
      }else
          {
            var lengh_final;
            //默认显示前10个好友（按照影响力排行）
            if(data.length<10)
            {
              lengh_final=data.length;            
            }else
            {
              lengh_final=10;
            }  
            for(var i=0;i<lengh_final;i++)
              {  
                var html ='<tr style="background-color:#ECFFCE;">';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+'<a href="/index/viewinformation/?uid='+data[i]['uid']+'">'+data[i]['uname']+'</a>'+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['influence']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['influence']+'</td>';
                 }
                 html+="</tr>";
                $('#friend_rank').append(html);
              }    
          }
   
   },
   //模态框（显示所有的好友排行信息）
   friend_rank_detail:function(data)
   {
      // console.log(data); 
      // console.log(data.length);
      // console.log(data[0]['influence']);
      //对返回的字典按照影响力进行排序
      data.sort(function(a,b){
            return b.influence-a.influence});
      //根据后台数据画表
      $('#friend_rank_detail').empty();
      if(data.length==0)
      {
         document.getElementById('friend_rank_detail').innerHTML = "暂无数据";
      }else
          {
           
            for(var i=0;i<data.length;i++)
              {  
                var html ='<tr>';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  // html+='<td>'+data[i]['uname']+'</td>';
                  html+='<td>'+'<a href="/index/viewinformation/?uid='+data[i]['uid']+'">'+data[i]['uname']+'</a>'+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['influence']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['influence']+'</td>';
                 }
                 html+="</tr>";
                $('#friend_rank_detail').append(html);
              }    
          }
   
   },

      //亲密度排行
      intimacy_rank:function(data)

      {
        
        data.sort(function(a,b){
            return b.count-a.count});
        console.log(data);

         //根据后台数据画表
      $('#intimacy_rank').empty();
      if(data.length==0)
      {
         document.getElementById('intimacy_rank').innerHTML = "暂无数据";
      }else
          {
            var lengh_final;
            //默认显示10条亲密度排行信息
            if(data.length<10)
            {
              lengh_final=data.length;            
            }else
            {
              lengh_final=10;
            }  
            for(var i=0;i<lengh_final;i++)
              {  
                var html ='<tr style="background-color:#ECFFCE;">';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  // html+='<td>'+'<a href="/index/viewinformation">'+data[i]['uname']+'</a>'+'</td>';
                  html+='<td>'+'<a href="/index/viewinformation/?uid='+data[i]['uid']+'">'+data[i]['uname']+'</a>'+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['count']+'</td>';
                 }
                 html+="</tr>";
                $('#intimacy_rank').append(html);
              }    
          }
      },
      //模态框显示所有亲密度排行信息
      intimacy_rank_detail:function(data)
      {
        
        data.sort(function(a,b){
            return b.count-a.count});
            //console.log(data);

         //根据后台数据画表
      $('#intimacy_rank_detail').empty();
      if(data.length==0)
      {
         document.getElementById('intimacy_rank_detail').innerHTML = "暂无数据";
      }else
          { 
            for(var i=0;i<data.length;i++)
              {  
                var html ='<tr>';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  // html+='<td>'+data[i]['uname']+'</td>';
                  html+='<td>'+'<a href="/index/viewinformation/?uid='+data[i]['uid']+'">'+data[i]['uname']+'</a>'+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['count']+'</td>';
                 }
                 html+="</tr>";
                $('#intimacy_rank_detail').append(html);
              }    
          }
      },
      transmit_relationship:function(data)
      {
        console.log(data);
        //获取主用户的名称
        var user_name;
        user_name=$("#username").html();
       
       //获取分节点名称
       var name=new Array();
       for(var i=0;i<data.length;i++)
       {
       	if(data[i]['uname']=='未知')
       	{
       		name[i]=data[i]['uid'];
       	}else
       	{
       		name[i]=data[i]['uname'];
       	}
       	
       }
       //console.log(name);
       //获取转发量数据
       var transmit_num=new Array();
       for(var i=0;i<data.length;i++)
       {
         
	       	if(data[i]['count']=='')
	       	{
	       		data[i]['count']=0;
	       		transmit_num[i]=data[i]['count'];
	       	}else
	       	{
	       		transmit_num[i]=data[i]['count'];
	       	}   
       }
       //console.log(transmit_num);
       //获取转发用户的id
       var user_id=new Array();
        for(var i=0;i<data.length;i++)
        {
        	user_id[i]=data[i]['uid'];
        }
      
        //定义node的值；
        var node_value=new Array();
        node_value.push({category:0,name:'核心用户'+' : '+user_name,value:10,label:user_name});
        for(var i=0;i<data.length;i++)
        {
        	node_value.push({category:1,name:'uid'+' : '+user_id[i],value:transmit_num[i],label:name[i]});
        }
        //console.log(node_value);

        //定义线的值
        var line_value=new Array();   
        for(var i=0;i<data.length;i++)
        {
        	line_value.push({source:'uid'+' : '+user_id[i],target:'核心用户'+' : '+user_name,weight:transmit_num[i],name:'转发次数'+' : '+transmit_num[i]});
        }
       // {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
        var myChart = echarts.init(document.getElementById('transmit'));
        option = {
        title : {
        text: '转发关系网络',
        // subtext: '圈圈的大小表示转发的次数哟',
        x:'right',
        y:'bottom'
   	  	},
        tooltip : {
            trigger: 'item',
            formatter: '{b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        legend: {
            x: 'left',
            data:['核心用户','好友']
        },
        series : [
            {
                type:'force',
                // name :'转发',

                ribbonType: false,
                categories : [
                    {
                        name: '核心用户'
                    },
                    {
                        name: '好友'
                    },
                    {
                        name: '转发次数'
                    }
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
                nodes:node_value,
                links:line_value,
            }
        ]
    };
	   myChart.setOption(option);  
	   window.onresize = myChart.resize;

     require([
            'echarts'
        ],
        function(ec){
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data;
                var links = option.series[0].links;
                var nodes = option.series[0].nodes;

                if (
                    data.source != null
                    && data.target != null
                ) { //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    console.log(data.sourceNode);
                    } else {
                       // // for(var i=0;i<data.length;i++)
                       // // {
                       // //  console.log(user_id[i]);
                       // // }
                       // console.log(data.uid)
                    //编辑点击节点事件的部分
                    var node_url='/index/viewinformation/?uid='+data.uid;
                    //要实现动态传参可参考attention.js文件，获取节点的uid数据传给url即可
                    window.open(node_url);          
                }
            }
                myChart.on(ecConfig.EVENT.CLICK, focus)
                myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                });
            }
    )   

    $('#p_so_onload').css('display','none').siblings().css('display','block');  
},

	mention_relationship:function(data)
	{
		//console.log(data);
    var user_name=$("#username").html();
    //获取节点名称
    var name=new Array();
    for(var i=0;i<data.length;i++)
       {
          if(data[i]['uname']=="")
          {
            name[i]='暂无数据';
          }else
          {
            name[i]=data[i]['uname'];
          } 
       }
    //console.log(name);
    //获取节点uid
    var user_id=new Array();
    for(var i=0;i<data.length;i++)
       {
          if(data[i]['uid']=="")
          {
            user_id[i]='暂无数据';
          }else
          {
            user_id[i]=data[i]['uid'];
          } 
       }
    //console.log(user_id);
    //获取@的数据量
    var mention_num=new Array();
    for(var i=0;i<data.length;i++)
       {
         
          if(data[i]['count']=='')
          {
            mention_num[i]='暂无数据';
          }else
          {
            mention_num[i]=data[i]['count'];
          }   
       }
   // console.log(mention_num);

    //定义node的值
     var node_value=new Array();
     node_value.push({category:0,name:'核心用户'+' : '+user_name,value:10,label:user_name});
     for(var i=0;i<data.length;i++)
        {
          node_value.push({category:1,name:name[i],value:mention_num[i],label:name[i]});
        }
    //console.log(node_value);

    //定义线
     var line_value=new Array();   
        for(var i=0;i<data.length;i++)
        {
          line_value.push({source:name[i],target:'核心用户'+' : '+user_name,weight:mention_num[i],name:'提及次数'+' : '+mention_num[i]});
        }
        var myChart = echarts.init(document.getElementById('mention'));
        option = {
        title : {
        text: '提及关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        legend: {
            x: 'left',
            data:['核心用户','好友']
        },
        series : [
            {
                type:'force',
                // name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '核心用户'
                    },
                    {
                        name: '好友'
                    },
                    {
                        name: '提及次数'
                    }
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
                nodes:node_value,
                links:line_value,
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
     require([
            'echarts'
        ],
        function(ec){
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data;
                var links = option.series[0].links;
                var nodes = option.series[0].nodes;
                if (
                    data.source != null
                    && data.target != null
                ) { //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    } else {
                    //编辑点击节点事件的部分
                    var node_url='/index/viewinformation';
                    //要实现动态传参可参考attention.js文件，获取节点的uid数据传给url即可
                    window.open(node_url);          
                }
            }
                myChart.on(ecConfig.EVENT.CLICK, focus)
                myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                });
            }
    )   

       $('#p_so_onload').css('display','none').siblings().css('display','block'); 
	},


	comment_relationship:function(data)
	{
		    //console.log(data);
        var user_name=$("#username").html();
       
       //获取分节点名称
       var name=new Array();
       for(var i=0;i<data.length;i++)
       {
        if(data[i]['uname']=='未知')
        {
          name[i]=data[i]['uid'];
        }else
        {
          name[i]=data[i]['uname'];
        }
        
       }
       //console.log(name);
       //获取评论量数据
       var comment_num=new Array();
       for(var i=0;i<data.length;i++)
       {
         
          if(data[i]['count']=='')
          {
            comment_num[i]=0;
          }else
          {
            comment_num[i]=data[i]['count'];
          }   
       }
       //console.log(comment_num);
       //获取转发用户的id
       var user_id=new Array();
        for(var i=0;i<data.length;i++)
        {
          if(data[i]['uid']=="")
          {
            user_id[i]='暂无数据'
          }else
          {
            user_id[i]=data[i]['uid'];
          }
          
        }
      //console.log(user_id);
        //定义node的值；
        var node_value=new Array();
        node_value.push({category:0,name:'核心用户'+' : '+user_name,value:10,label:user_name});
        for(var i=0;i<data.length;i++)
        {
          node_value.push({category:1,name:'uid'+' : '+user_id[i],value:comment_num[i],label:name[i]});
        }
        //console.log(node_value);

        //定义线的值
        var line_value=new Array();   
        for(var i=0;i<data.length;i++)
        {
          line_value.push({source:'uid'+' : '+user_id[i],target:'核心用户'+' : '+user_name,weight:comment_num[i],name:'评论次数'+' : '+comment_num[i]});
        }
        var myChart = echarts.init(document.getElementById('comment'));
        option = {
        title : {
        text: '评论关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: ' {b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        legend: {
            x: 'left',
            data:['核心用户','好友']
        },
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '核心用户'
                    },
                    {
                        name: '好友'
                    },
                    {
                        name: '转发次数'
                    }
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
                nodes:node_value,
                links:line_value,
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
     require([
            'echarts'
        ],
        function(ec){
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data;
                var links = option.series[0].links;
                var nodes = option.series[0].nodes;
                if (
                    data.source != null
                    && data.target != null
                ) { //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    } else {
                    //编辑点击节点事件的部分
                    var node_url='/index/viewinformation';
                    //要实现动态传参可参考attention.js文件，获取节点的uid数据传给url即可
                    window.open(node_url);          
                }
            }
                myChart.on(ecConfig.EVENT.CLICK, focus)
                myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                });
            }
    )   

       $('#p_so_onload').css('display','none').siblings().css('display','block'); 
	},


	interaction_relationship:function(data)
	{
		    //console.log(data);
        var user_name=$("#username").html();
        //获取分节点名称
         var name=new Array();
         for(var i=0;i<data.length;i++)
         {
            if(data[i]['uname']=='未知')
            {
              name[i]=data[i]['uid'];
            }else
            {
              name[i]=data[i]['uname'];
            }
         }
         //console.log(name);

       var interaction_num=new Array();
       for(var i=0;i<data.length;i++)
       {
         
          if(data[i]['count']=='')
          {
           
            interaction_num[i]=0;
          }else
          {
            interaction_num[i]=data[i]['count'];
          }   
       }
        var user_id=new Array();
        for(var i=0;i<data.length;i++)
        {
          user_id[i]=data[i]['uid'];
        }

        //定义node的值；
        var node_value=new Array();
        node_value.push({category:0,name:'核心用户'+' : '+user_name,value:10,label:user_name});
        for(var i=0;i<data.length;i++)
        {
          node_value.push({category:1,name:'uid'+' : '+user_id[i],value:interaction_num[i],label:name[i]});
        }
        //console.log(node_value);

        //定义线的值
        var line_value=new Array();   
        for(var i=0;i<data.length;i++)
        {
          line_value.push({source:'uid'+' : '+user_id[i],target:'核心用户'+' : '+user_name,weight:interaction_num[i],name:'交互次数'+' : '+interaction_num[i]});
        }

        var myChart = echarts.init(document.getElementById('interaction'));
        option = {
        title : {
        text: '交互关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        legend: {
            x: 'left',
            data:['核心用户','好友']
        },
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '核心用户'
                    },
                    {
                        name: '好友'
                    },
                    {
                        name: '转发次数'
                    }
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
                nodes:node_value,
                links:line_value,
                
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
      require([
            'echarts'
        ],
        function(ec){
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data;
                var links = option.series[0].links;
                var nodes = option.series[0].nodes;
                if (
                    data.source != null
                    && data.target != null
                ) { //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    } else {
                    //编辑点击节点事件的部分
                    var node_url='/index/viewinformation';
                    //要实现动态传参可参考attention.js文件，获取节点的uid数据传给url即可
                    window.open(node_url);          
                }
            }
                myChart.on(ecConfig.EVENT.CLICK, focus)
                myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                });
            }
    )   
       $('#p_so_onload').css('display','none').siblings().css('display','block'); 
	}
}

var my_friend=new my_friend();
//好友排行
var uid = 1640601392;
var url = "/attribute/new_user_profile/?uid=" + uid;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.personData);
var uid_rank=2029036025;
var url ="/info_person_social/follower/?uid="+uid_rank;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.my_friend_rank);
//好友排行详细信息
var url ="/info_person_social/follower/?uid="+uid_rank;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.friend_rank_detail);
//亲密度排行
var uid_close=2298571767;
var url ="/info_person_social/be_comment/?uid="+uid_close;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.intimacy_rank);
//亲密度排行详细信息
var url ="/info_person_social/be_comment/?uid="+uid_close;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.intimacy_rank_detail);
//转发关系网络
var uid_transmit=2029036025;
var url ='/info_person_social/follower/?uid='+uid_transmit;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.transmit_relationship);
//@的用户关系网络
var uid_mention=1831090244;  //attention
var url ='/info_person_social/mention/?uid='+uid_mention;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.mention_relationship);
//评论关系网络图
var uid_comment=2298571767;
var url ='/info_person_social/be_comment/?uid='+uid_comment;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.comment_relationship);
//交互关系网络图
var uid_interaction=2298571767;  //be_comment
var url ='/info_person_social/bidirect_interaction/?uid='+uid_interaction;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.interaction_relationship);
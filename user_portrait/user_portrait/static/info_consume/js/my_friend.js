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
	  console.log(personalData);	  
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
      // console.log(data); 
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
                  html+='<td>'+data[i]['uname']+'</td>';
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
                  html+='<td>'+data[i]['uname']+'</td>';
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
        //console.log(data);

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
                  html+='<td>'+data[i]['uname']+'</td>';
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
                  html+='<td>'+data[i]['uname']+'</td>';
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
        //获取用户的名称
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
       console.log(name);
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
       var user_id=new Array();
        for(var i=0;i<data.length;i++)
        {
        	user_id[i]=data[i]['uid'];
        }
         //定义label
         var label=new Array();
        for(var i=0;i<data.length;i++)
        {
        	if(data[i]['name']=='未知')
        	{
        		label[i]=data[i]['uid'];
        	}else
        	{
        		label[i]=data[i]['uname']+':'+data[i]['uid'];
        	}
        	
        }
      
        //定义node的值；
        var node_value=new Array();
        node_value.push({category:0,name:user_name,value:10,label:user_name});
        for(var i=0;i<data.length;i++)
        {
        	node_value.push({category:1,name:name[i],value:transmit_num[i],label:label[i]});
        }
        console.log(node_value);
       
       

        //定义线的值
        var line_value=new Array();   
        for(var i=0;i<data.length;i++)
        {
        	line_value.push({source:name[i],target:user_name,value:transmit_num[i],label:transmit_num[i]});
        }
       // {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
        var myChart = echarts.init(document.getElementById('transmit'));
        option = {
        title : {
        text: '转发关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
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
            data:['好友']
        },
        series : [
            {
                type:'force',
                name : "转发次数",
                ribbonType: false,
                categories : [
                    {
                        name: '用户'
                    },
                    {
                        name: '转发的用户'
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
                nodes:node_value,
                links : line_value,
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
       $('#p_so_onload').css('display','none').siblings().css('display','block');  
},

	mention_relationship:function(data)
	{
		//console.log(data);
        var myChart = echarts.init(document.getElementById('mention'));
        option = {
        title : {
        text: '提及关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
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
            data:['家人','朋友']
        },
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '人物'
                    },
                    {
                        name: '家人'
                    },
                    {
                        name:'朋友'
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
                nodes:[
                    {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
                    {category:1, name: '丽萨-乔布斯',value : 2},
                    {category:1, name: '保罗-乔布斯',value : 3},
                    {category:1, name: '克拉拉-乔布斯',value : 3},
                    {category:1, name: '劳伦-鲍威尔',value : 7},
                    {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
                    {category:2, name: '奥巴马',value : 8},
                    {category:2, name: '比尔-盖茨',value : 9},
                    {category:2, name: '乔纳森-艾夫',value : 4},
                    {category:2, name: '蒂姆-库克',value : 4},
                    {category:2, name: '龙-韦恩',value : 1},
                ],
                links : [
                    {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
                    {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
                    {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
                    {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
                    {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
                    {source : '奥巴马', target : '乔布斯', weight : 1},
                    {source : '比尔-盖茨', target : '乔布斯', weight : 6, name: '竞争对手'},
                    {source : '乔纳森-艾夫', target : '乔布斯', weight : 1, name: '爱将'},
                    {source : '蒂姆-库克', target : '乔布斯', weight : 1},
                    {source : '龙-韦恩', target : '乔布斯', weight : 1},
                    {source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
                    {source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
                    {source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
                    {source : '比尔-盖茨', target : '奥巴马', weight : 6},
                    {source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
                    {source : '蒂姆-库克', target : '奥巴马', weight : 1}
                ]
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
       $('#p_so_onload').css('display','none').siblings().css('display','block'); 
	},


	comment_relationship:function(data)
	{
		//console.log(data);
        var myChart = echarts.init(document.getElementById('comment'));
        option = {
        title : {
        text: '评论关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
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
            data:['家人','朋友']
        },
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '人物'
                    },
                    {
                        name: '家人'
                    },
                    {
                        name:'朋友'
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
                nodes:[
                    {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
                    {category:1, name: '丽萨-乔布斯',value : 2},
                    {category:1, name: '保罗-乔布斯',value : 3},
                    {category:1, name: '克拉拉-乔布斯',value : 3},
                    {category:1, name: '劳伦-鲍威尔',value : 7},
                    {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
                    {category:2, name: '奥巴马',value : 8},
                    {category:2, name: '比尔-盖茨',value : 9},
                    {category:2, name: '乔纳森-艾夫',value : 4},
                    {category:2, name: '蒂姆-库克',value : 4},
                    {category:2, name: '龙-韦恩',value : 1},
                ],
                links : [
                    {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
                    {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
                    {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
                    {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
                    {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
                    {source : '奥巴马', target : '乔布斯', weight : 1},
                    {source : '比尔-盖茨', target : '乔布斯', weight : 6, name: '竞争对手'},
                    {source : '乔纳森-艾夫', target : '乔布斯', weight : 1, name: '爱将'},
                    {source : '蒂姆-库克', target : '乔布斯', weight : 1},
                    {source : '龙-韦恩', target : '乔布斯', weight : 1},
                    {source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
                    {source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
                    {source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
                    {source : '比尔-盖茨', target : '奥巴马', weight : 6},
                    {source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
                    {source : '蒂姆-库克', target : '奥巴马', weight : 1}
                ]
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
       $('#p_so_onload').css('display','none').siblings().css('display','block'); 
	},


	interaction_relationship:function(data)
	{
		//console.log(data);
        var myChart = echarts.init(document.getElementById('interaction'));
        option = {
        title : {
        text: '交互关系网络',
        x:'right',
        y:'bottom'
   		},
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
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
            data:['家人','朋友']
        },
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '人物'
                    },
                    {
                        name: '家人'
                    },
                    {
                        name:'朋友'
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
                nodes:[
                    {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
                    {category:1, name: '丽萨-乔布斯',value : 2},
                    {category:1, name: '保罗-乔布斯',value : 3},
                    {category:1, name: '克拉拉-乔布斯',value : 3},
                    {category:1, name: '劳伦-鲍威尔',value : 7},
                    {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
                    {category:2, name: '奥巴马',value : 8},
                    {category:2, name: '比尔-盖茨',value : 9},
                    {category:2, name: '乔纳森-艾夫',value : 4},
                    {category:2, name: '蒂姆-库克',value : 4},
                    {category:2, name: '龙-韦恩',value : 1},
                ],
                links : [
                    {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
                    {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
                    {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
                    {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
                    {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
                    {source : '奥巴马', target : '乔布斯', weight : 1},
                    {source : '比尔-盖茨', target : '乔布斯', weight : 6, name: '竞争对手'},
                    {source : '乔纳森-艾夫', target : '乔布斯', weight : 1, name: '爱将'},
                    {source : '蒂姆-库克', target : '乔布斯', weight : 1},
                    {source : '龙-韦恩', target : '乔布斯', weight : 1},
                    {source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
                    {source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
                    {source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
                    {source : '比尔-盖茨', target : '奥巴马', weight : 6},
                    {source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
                    {source : '蒂姆-库克', target : '奥巴马', weight : 1}
                ]
            }
        ]
    };
	   myChart.setOption(option);
	   window.onresize = myChart.resize;
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
var uid_close=1831090244;
var url ="/info_person_social/mention/?uid="+uid_close;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.intimacy_rank);
//亲密度排行详细信息
var url ="/info_person_social/mention/?uid="+uid_close;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.intimacy_rank_detail);
//转发关系网络
var uid_transmit=2029036025;
var url ='/info_person_social/follower/?uid='+uid_transmit;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.transmit_relationship);
//@的用户关系网络
var uid_mention=1831090244;
var url ='/info_person_social/mention/?uid='+uid_mention;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.mention_relationship);
//评论关系网络图
var uid_comment=1831090244;
var url ='/info_person_social/be_comment/?uid='+uid_comment;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.comment_relationship);
//交互关系网络图
var uid_interaction=1831090244;
var url ='/info_person_social/bidirect_interaction/?uid='+uid_interaction;
my_friend.call_sync_ajax_request(url, my_friend.ajax_method, my_friend.interaction_relationship);
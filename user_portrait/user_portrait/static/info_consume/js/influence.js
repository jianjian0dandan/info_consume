var domain_rank = 0;
var allfield_rank = 0;
var domain_influence_score;
var allfield_influence_socre;

function Influence(){
  this.ajax_method = 'GET';
}

function getDate_in(tm){
  var tt = new Date(parseInt(tm)*1000).format("MM-dd");
  return tt;
}

Influence.prototype = {  
  call_ajax_request:function(url, method, callback){
      $.ajax({
          url:url,
          type:"GET",
          dataType:'json',
          async:true,
          success:callback,
      });
  },
  
  
  Draw_influence:function(data){
 // console.log(data);
  var item_x = [];
  for (var t=0;t<data.timeline.length;t++){
    item_x.push(getDate_in(data.timeline[t]));
  }
  //var item_y = data.influence;
  var item_y = data.evaluate_index;
  // var conclusion = data.description;
  if(data.evaluate_index){
  var dataFixed = [];
  for(i=0;i<item_y.length;i++){
    dataFixed.push(parseFloat(item_y[i].toFixed(2)));
  }
    var myChart = echarts.init(document.getElementById('influence_chart')); 
    var option = {
      formatter: '{a}:{b}:{c}',
      tooltip : {
          trigger: 'axis'
      },
      
      toolbox: {
          show : true,
          feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
          }
      },
      calculable : false,
      xAxis : [
          {
              type : 'category',
              boundaryGap : true,
              data : item_x
          }
      ],
      yAxis : [
          {
              type : 'value',
              scale:true,
              axisLabel : {
                  formatter: '{value} '
              }
          }
      ],
      series : [
          {
              type:'line',
              data:dataFixed,
              markPoint : {
                  data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                  ]
              },
              markLine : {
                  data : [
                      {type : 'average', name: '平均值'}
                  ]
              }
          }
          
      ]
    };
        // 为echarts对象加载数据 
        myChart.setOption(option); 
  }
  else{
  $('#influence_chart').append('<h4 style="text-align:center;margin-top:50%;">暂无数据</h4>')
  }
 },

rank_data:function(data){
	//领域排行
   	if (data.in_top == '' || data.in_top == 'unknown'){
   		domain_rank = '未知';
   	}else{
   		domain_rank = data.in_top;
   	};
   	//全网排行
   	if (data.all_top == ''){
     	allfield_rank = '未知';
   	}else{
   		allfield_rank = data.all_top;
   	};
   	//领域影响力
   	if (data.in_score == ''){
   	 	domain_influence_score = '未知';
   	}else{
   		domain_influence_score = data.in_score.toFixed(2);
   	};

   	//全网影响力
   	if (data.all_score == ''){
     	allfield_influence_socre = '未知';
   	}else{
   		allfield_influence_socre = data.all_score.toFixed(2);
   	}
   	console.log("all_rank"+allfield_rank);
   	console.log("all_influence_socre"+allfield_influence_socre);
 },

  influence_Table_all:function(data){
  	console.log("all_rank"+allfield_rank);
  	console.log("all_influence_socre"+allfield_influence_socre);
    var html_table = "<thead><tr><th style='text-align: center'>序号</th><th>头像</th><th style='text-align: center'>昵称</th><th style='text-align: center'>影响力</th></tr></thead>";

    html_table += "<tr style='background-color:#76eec6;'><td>"+allfield_rank+"</td><td><img src="+userImg_src+"width=30px height=30px style=''></td><td><a target='_blank' href='/index/viewinformation/?uid=" + uid + "'>"+uName+"</a></td><td>"+allfield_influence_socre+"</td></tr>";

    for(var j=0;j<10;j++){
      var bci_data;
      if (data[j].bci=="") 
      {
      	data[j].bci="未知";
      }
      if (data[j].photo_url=="" || data[j].photo_url=="unknown") 
      {
      	data[j].photo_url="http://tp2.sinaimg.cn/1878376757/50/0/1";
      }
      bci_data = data[j].bci;
      bci_data = bci_data.toFixed(2);
      html_table += "<tr><td>"+(j+1)+"</td><td><img src='"+data[j].photo_url+"' width=30px height=30px style='border-radius:20px;'></td><td><a target='_blank' href='/index/viewinformation/?uid=" + data[j].uid + "'>"+data[j].uname+"</a></td><td>"+bci_data+"</td></tr>";
    }
    $('#influ_all').append(html_table);
  },

  influence_Table_domain:function(data){
  	console.log("all_rank"+allfield_rank);
  	console.log("all_influence_socre"+allfield_influence_socre);
    var i = 0;
    var html_table = "<thead><tr><th style='text-align: center'>序号</th><th>头像</th><th style='text-align: center'>昵称</th><th style='text-align: center'>影响力</th></tr></thead>";

    html_table += "<tr style='background-color:#76eec6;'><td>"+domain_rank+"</td><td><img src="+userImg_src+"width=30px height=30px style=''></td><td><a target='_blank' href='/index/viewinformation/?uid=" + uid + "'>"+uName+"</a></td><td>"+domain_influence_score+"</td></tr>";
  
    for(var j=0;j<10;j++){
      if (data[j].bci=="") 
      {
      	data[j].bci="未知";
      }
      if (data[j].photo_url=="") 
      {
      	data[j].photo_url="http://tp2.sinaimg.cn/1878376757/50/0/1";
      }
      bci_data = data[j].bci.toFixed(2);
      html_table += "<tr><td>"+(j+1)+"</td><td><img src="+data[j].photo_url+"width=30px height=30px style='border-radius:20px;'></td><td><a target='_blank' href='/index/viewinformation/?uid=" + data[j].uid + "'>"+data[j].uname+"</a></td><td>"+bci_data+"</td></tr>";
    }
    $('#influ_domain').append(html_table);

  },



  influ_skill:function(data){
    // console.log(data[1]);
    var re_re_speed = data[1].re_re_speed; 
    var comment_speed = data[1].comment_speed;
    var retweet_speed = data[1].retweet_speed;
    var retweet_retweet = data[1].retweet_retweet;
    var influence = data[1].influence;
    var be_retweet = data[1].be_retweet; 
    var be_comment = data[1].be_comment;
    var retweet_comment = data[1].retweet_comment;
    var re_co_speed = data[1].re_co_speed;

    var stage=0;
    var influ_des;
    var badPart =':';

    $('#locatSun').css("display","none");

    if (be_retweet==1 && be_comment == 1 && retweet_speed == 1 && comment_speed == 1) {
      stage=1;
      $('#locatSun').css("display","block");
      $('#locatSun').css("margin-top","-33%");
      $('#locatSun').css("margin-left","62%");
      // console.log('111');
    }else{
      if(be_retweet==0) badPart+='原创微博被转发数 ';
      if (be_comment==0) badPart+='原创微博被评论数 ';
      if (retweet_speed==0) badPart+='转发次数 ';
      if (comment_speed==0) badPart+='评论次数 ';
    };

    if (retweet_retweet==1 && re_re_speed == 1) {
      stage=2;
      $('#locatSun').css("display","block");
      $('#locatSun').css("margin-top","-29%");
      $('#locatSun').css("margin-left","62%");
    }else{
      if(retweet_retweet==0) badPart+='转发微博被转发数 ';
      if (re_re_speed==0) badPart+='转发速度 ';
    };
    
    if (retweet_comment==1 && re_co_speed==1){
      stage=3;
      $('#locatSun').css("display","block");
      $('#locatSun').css("margin-top","-24%");
      $('#locatSun').css("margin-left","62%");
    }else {
      if(retweet_comment==0) badPart+='转发微博评论数 ';
      if (re_co_speed==0) badPart+='评论速度 ';
      $('#locatSun').css("display","block");
      $('#locatSun').css("margin-top","-19%");
      $('#locatSun').css("margin-left","69%");
    };
    $('#badPart').append(badPart);

    //原来递增式的判断模型
    // if (be_retweet==1 && be_comment == 1 && retweet_speed == 1 && comment_speed == 1) {
    //   stage=1;
    //   if (retweet_retweet==1 && re_re_speed == 1) {
    //     stage=2;
    //     if (retweet_comment==1 && re_co_speed==1){stage=3;}
    //     else {
    //       if(retweet_comment==0) badPart+='转发微博评论数 ';
    //       if (re_co_speed==0) badPart+='评论速度 ';
    //     }
    //   }else{
    //     if(retweet_retweet==0) badPart+='转发微博被转发数 ';
    //     if (re_re_speed==0) badPart+='转发速度 ';
    //   }
    // }else{
    //   stage=0;
    //   if(be_retweet==0) badPart+='原创微博被转发数 ';
    //   if (be_comment==0) badPart+='原创微博被评论数 ';
    //   if (retweet_speed==0) badPart+='转发次数 ';
    //   if (comment_speed==0) badPart+='评论次数 ';
    // }
  }

}
function click_action(){
    $('#mychoice').on('click','input[name="choose_module"]', function(){             
      var index = $('input[name="choose_module"]:checked').val();

      if(index == 1){
        var influence_url = '/attribute/influence_trend/?uid='+uid + '&time_segment=7';
        Influence.call_ajax_request(influence_url, Influence.ajax_method, Influence.Draw_influence);
      }
      else{
        var influence_url = '/attribute/influence_trend/?uid='+uid + '&time_segment=30';
        Influence.call_ajax_request(influence_url, Influence.call_ajax_requestmethod, Influence.Draw_influence);    
      }
    });

}
function influence_load(){
    click_action();
    var influence_url = '/attribute/influence_trend/?uid='+uid + '&time_segment=7';
    Influence.call_ajax_request(influence_url, Influence.ajax_method, Influence.Draw_influence);


}
//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}



var uid = 1640601392;
var username = 'admin@qq.com';
//var username = admin@qq.com;
var Influence = new Influence();
var currentdate;
var influence_date = choose_time_for_mode();
var pre_influence_date = new Date(influence_date - 24*60*60*1000);
var date_str = pre_influence_date.format('yyyy-MM-dd');
getNowFormatDate();
influence_load();
//var influ_all_table_url= '/influence_sort/user_sort/?username='+username+'&sort_scope=all_nolimit&all=True';


function transfer1(kind) {
    y_kind2=kind;
    var domain_rank_url = '/influence_sort/user_topic_sort/?uid='+uid+'&field='+y_kind2;
    console.log(domain_rank_url);
    Influence.call_ajax_request(domain_rank_url, Influence.ajax_method, Influence.rank_data);
}

function all_load(){
	var influ_all_table_url= '/influence_sort/user_sort/?username=admin@qq.com&sort_scope=all_nolimit&all=True';
  	Influence.call_ajax_request(influ_all_table_url, Influence.ajax_method, Influence.influence_Table_all);
}

function transfer2(kind) {
    y_kind1=kind;
    var sort_scope = 'in_limit_topic';
    var domain_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+y_kind1+'&all=False';
    Influence.call_ajax_request(domain_url, Influence.ajax_method, Influence.influence_Table_domain);
    console.log(domain_url+"=domain_url");
}



// var influSkill_url = '/influence_application/specified_user_active/?date='+currentdate+'&uid='+uid;
//   Influence.call_ajax_request(influSkill_url, Influence.ajax_method, Influence.influ_skill);
var influSkill_url = '/influence_application/specified_user_active/?date=2016-05-21&uid=1065618283';
  Influence.call_ajax_request(influSkill_url, Influence.ajax_method, Influence.influ_skill);




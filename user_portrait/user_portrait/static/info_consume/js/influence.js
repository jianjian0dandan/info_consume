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

  influence_Table_all:function(data){
    var i = 0;
    var rank = '未知';
    while(i<200){
      if(data[i].uid == uid){
        rank = i;
        break;
      }
      i++;
    };

    var allInflu_data = [];
    for(var j=0;j<10;j++){
      allInflu_data[j] = data[j];  
    };

    var html_table = "<thead><tr><th>序号</th><th>头像</th><th>昵称</th><th>影响力</th></tr></thead>"

    html_table += "<tr style='background-color:#76eec6;'><td>"+(rank+1)+"</td><td><img src="+data[rank].photo_url+"width=30px height=30px style=''></td><td>"+data[rank].uname+"</td><td>"+data[rank].bci.toFixed(2)+"</td></tr>";
    //全局变量赋值
    userImg_src = data[rank].photo_url;
    uName = data[rank].uname;
    userBci = data[rank].bci.toFixed(2);

    for(var j=0;j<10;j++){
      var bci_data;
      bci_data = allInflu_data[j].bci;
      bci_data = bci_data.toFixed(2);
      html_table += "<tr><td>"+(j+1)+"</td><td><img src="+allInflu_data[j].photo_url+"width=30px height=30px style='border-radius:20px;'></td><td>"+allInflu_data[j].uname+"</td><td>"+bci_data+"</td></tr>";
    }
    $('#influ_all').append(html_table);
  },

  influence_Table_domain:function(data){
    var i = 0;
    var rank = '>200';
    while(i<200){
      if(data[i].uid == uid){
        rank = i;
        break;
      }
      i++;
    };
    console.log('rank of domain is'+rank);
    // if(domainInflu_data[rank].photo_url == 'unknown'){s
    //   domainInflu_data[rank].photo_url = 'http://tp2.sinaimg.cn/1878376757/50/0/1'
    // };'rank of domain is'+

    var domainInflu_data = [];
    for(var j=0;j<10;j++){
      domainInflu_data[j] = data[j];  
      if(domainInflu_data[j].photo_url == 'unknown'){
        domainInflu_data[j].photo_url = 'http://tp2.sinaimg.cn/1878376757/50/0/1';   
      };
      if(domainInflu_data[j].uname == 'unknown'){
        domainInflu_data[j].uname = '未知';   
      };
    };

    var html_table = "<thead><tr><th>序号</th><th>头像</th><th>昵称</th><th>影响力</th></tr></thead>";

    console.log('dr'+domain_rank);
    html_table += "<tr style='background-color:#76eec6;'><td>"+domain_rank+"</td><td><img src="+userImg_src+"width=30px height=30px style=''></td><td>"+uName+"</td><td>"+userBci+"</td></tr>";
  
    for(var j=0;j<10;j++){
      var bci_data;
      bci_data = domainInflu_data[j].bci;
      bci_data = bci_data.toFixed(2);
      html_table += "<tr><td>"+(j+1)+"</td><td><img src="+domainInflu_data[j].photo_url+"width=30px height=30px style='border-radius:20px;'></td><td>"+domainInflu_data[j].uname+"</td><td>"+bci_data+"</td></tr>";
    }
    $('#influ_domain').append(html_table);

  },

  domain_rank_data:function(data){
    if (data == ''){
      domain_rank = '未知';
    };
    domain_rank = data;
    console.log('domainrank='+domain_rank);
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
      $('#locatSun').css("margin-top","-340px");
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
      $('#locatSun').css("margin-top","-285px");
    }else{
      if(retweet_retweet==0) badPart+='转发微博被转发数 ';
      if (re_re_speed==0) badPart+='转发速度 ';
    };
    
    if (retweet_comment==1 && re_co_speed==1){
      stage=3;
      $('#locatSun').css("display","block");
      $('#locatSun').css("margin-top","-235px");
    }else {
      if(retweet_comment==0) badPart+='转发微博评论数 ';
      if (re_co_speed==0) badPart+='评论速度 ';
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
var domain_rank = 0;
var userImg_src;
var uName;
var userBci;
var currentdate;
var influence_date = choose_time_for_mode();
var pre_influence_date = new Date(influence_date - 24*60*60*1000);
var date_str = pre_influence_date.format('yyyy-MM-dd');
getNowFormatDate();
influence_load();
//var influ_all_table_url= '/influence_sort/user_sort/?username='+username+'&sort_scope=all_nolimit&all=True';
var influ_all_table_url= '/influence_sort/user_sort/?username=admin@qq.com&sort_scope=all_nolimit&all=True';
  Influence.call_ajax_request(influ_all_table_url, Influence.ajax_method, Influence.influence_Table_all);

var keyword = '教育类';
var sort_scope = 'in_limit_topic';
var domain_url = '/influence_sort/user_sort/?username='+username+'&sort_scope='+sort_scope+'&arg='+keyword+'&all=False';
  Influence.call_ajax_request(domain_url, Influence.ajax_method, Influence.influence_Table_domain);
var domain_rank_url = '/influence_sort/user_topic_sort/?uid='+uid;
  Influence.call_ajax_request(domain_rank_url, Influence.ajax_method, Influence.domain_rank_data);


// var influSkill_url = '/influence_application/specified_user_active/?date='+currentdate+'&uid='+uid;
//   Influence.call_ajax_request(influSkill_url, Influence.ajax_method, Influence.influ_skill);
var influSkill_url = '/influence_application/specified_user_active/?date=2016-05-21&uid=1065618283';
  Influence.call_ajax_request(influSkill_url, Influence.ajax_method, Influence.influ_skill);





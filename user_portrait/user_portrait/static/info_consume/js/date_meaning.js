var topic='aoyunhui';
var start_ts=1468944000;
var end_ts=1471622400;
var opinion=["姐姐", "综艺节目", "网络"];

function topic_analysis_meaning(){
 
}

topic_analysis_meaning.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },


Draw_keywords_cloud:function(data){

    var item = data;
    // var item_data = [];
    var item_json = [];
    var html = '';
    for (i=0;i<item.length;i++){    
      // item_data.push(item[i][0].replace('\\"',''))
      item_json.push({name:item[i][0],value:item[i][1],itemStyle: createRandomItemStyle()});
    }
  
  function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
var myChart = echarts.init(document.getElementById('main_meaning_1'));

var option = {
   
    tooltip: {
        show: true
    },
    series: [{
        name: 'Google Trends',
        type: 'wordCloud',
        size: ['80%', '80%'],
        textRotation : [0, 45, 90, -45],
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 14
        },
        data: item_json
    }]
};
          myChart.setOption(option);        
  },

Draw_event_river:function(data){

    var item = data;
    // var item_data = [];
    var item_json = [];
    var evolution_json = [];
    var topic_name = [];
    var html = '';
    var length = item.length;
    console.log('111');
    console.log(length);
    for (i=0;i<item.length;i++){    
      // item_data.push(item[i][0].replace('\\"',''))
      for (key in item[i]){
        topic_name.push(key);
        console.log(key);
      }
      evolution_json.push({time:item[i][0],value:item[i][1],});
      
    }
    console.log(topic_name);
    console.log(evolution_json);
    // for (j=0;j<item.length;j++){    
    //   // item_data.push(item[i][0].replace('\\"',''))
    //   item_json.push({name:item[i][0],evolution:item[i][1],itemStyle: createRandomItemStyle()});
    // }

    var myChart = echarts.init(document.getElementById('main_meaning_2'));
    var option = {
        tooltip : {
            trigger: 'item',
            enterable: true
        },
        // legend: {
        //     data:['新闻观点', '微博观点']
        // },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'time',
                boundaryGap: [0.05,0.1]
            }
        ],
        series : [
            {
                "name": "微博观点", 
                "type": "eventRiver", 
                "weight": 123, 
                // [{name:,weight:}]
                "data": [
                    {
                        "name": "Apec峰会", 
                        "evolution": [
                            {
                                "time": "2014-05-06", 
                                "value": 14, 
                            }, 
                            {
                                "time": "2014-05-07", 
                                "value": 34, 
                            }, 
                            {
                                "time": "2014-05-08", 
                                "value": 60, 
                            }, 
                            {
                                "time": "2014-05-09", 
                                "value": 40, 
                            }, 
                            {
                                "time": "2014-05-10", 
                                "value": 20, 
                            }
                        ]
                    }, 
                    {
                        "name": "运城官帮透视", 
                        // "weight": 123, 
                        "evolution": [
                            {
                                "time": "2014-05-08", 
                                "value": 4, 
                            }, 
                            {
                                "time": "2014-05-09", 
                                "value": 14, 
                            }, 
                            {
                                "time": "2014-05-10", 
                                "value": 30, 
                            }, 
                            {
                                "time": "2014-05-11", 
                                "value": 20, 
                            }, 
                            {
                                "time": "2014-05-12", 
                                "value": 10, 
                            }
                        ]
                    }, 
                    {
                        "name": "底层公务员收入超过副部长", 
                        // "weight": 123, 
                        "evolution": [
                            {
                                "time": "2014-05-11", 
                                "value": 4, 
                            }, 
                            {
                                "time": "2014-05-12", 
                                "value": 24, 
                            }, 
                            {
                                "time": "2014-05-13", 
                                "value": 40, 
                            }, 
                            {
                                "time": "2014-05-14", 
                                "value": 20, 
                            }, 
                            {
                                "time": "2014-05-15", 
                                "value": 15, 
                            }, 
                            {
                                "time": "2014-05-16", 
                                "value": 10, 
                            }
                        ]
                    }
                ]
            }
        ]
};
    myChart.setOption(option);     

},

Draw_time_line:function(){


},


Draw_blog_opinion:function(data){
    var item = data;
    var opinion = [];
    var html = '';
    
    if (item.length == 0){
    html += '<div style="color:grey;">暂无数据</div>'
    }else{
      
      for (i=0;i < item.length;i++){
        // console.log('qqqqqq');
        // var opinion = item[i].join("+");
        html += '<span class="label place_label" style="color: #868686;">'+item[i].join("+")+'</span>';
        // console.log(item[i].join("+"));
      }

    }
    // console.log(opinion);
    
    $('#opinions').append(html);
},


Draw_blog_scan_area_meaning:function(data){
    var item = data;
    var html = '';
    //var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
    //key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    //console.log(data.length);
    
    if (item.length == 0){
    html += '<div style="color:grey;">暂无数据</div>'
    }else{
      var num_page = parseInt(item.length/10)+1;  //num_page表示微博数据共有多少页
    
      for (i=0;i < Math.min(10,item.length);i++){
  
        if (item[i][1].photo_url=='unknown'){
          item[i][1].photo_url='../../static/info_consume/image/photo_unknown.png'
        }
        if (item[i][1].uname=='unknown'){
          item[i][1].uname='未知用户'
          //console.log(item[i][1].uname);
        }
        var item_timestamp_datetime = new Date(parseInt(item[i][1].timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        html += '<div class="blog_time">';
        //html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div><img class="img-circle" src="'+item[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div>';
        //html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
        html += '<a target="_blank" href=" " class="user_name" style="float:left;">'+item[i][1].uname+'</a>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        html += '</div>';
        html += '<div class="blog_text">'
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
        html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">'+item[i][1].text+'</font></p>';
        html += '<p style="float: left;width: 100%;position: relative;margin-top: 3%;margin-left: 3%;font-family: Microsoft YaHei;">';
        //html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
        //html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
        html += '<span style="float:left;margin-top: -3%;">'+item_timestamp_datetime+'</span>';
        //html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
        html += '<span style="margin-top: -3%;float: left;margin-left: 50%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;|&nbsp;</span>';
        //html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >评论数('+item[i][1].comment+')</span>';
        html += '<span style="margin-top: -3%;float: left;margin-left: 59.5%;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
        //html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        html += '</p>';
        html += '</div>';               
        html += '</div>';
      // }
      }

      html += '<div id="PageTurn" class="pager" style="margin-left:40%;">'
        html += '<span >共<font id="P_RecordCount" style="color:#FF9900;">'+item.length+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        html += '<span >第<font id="P_Index" style="color:#FF9900;"></font><font id="P_PageCount" style="color:#FF9900;">'+1+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        html += '<span >每页<font id="P_PageSize" style="color:#FF9900;">'+10+'</font>条记录&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        html += '<span id="S_First" class="disabled" >首页</span>'
        html += '<span id="S_Prev"  class="disabled" >上一页</span>'
        html += '<span id="S_navi"><!--页号导航--></span>'
        html += '<span id="S_Next"  class="disabled" >下一页</span>'
        html += '<span id="S_Last"  class="disabled" >末页</span>'
        html += '<input id="Txt_GO" class="cssTxt" name="Txt_GO" type="text" size="1" style="width: 35px;height: 20px;"  /> '
        html += '<span id="P_GO" >GO</span>'
      html += '</div>'
    
    }
    
    $('#blog_scan_area_meaning').append(html);
    
  },


}

var topic_analysis_meaning = new topic_analysis_meaning();

function Draw_keywords_cloud_result(){
    url = "/topic_language_analyze/during_keywords/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
    console.log(url);
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_keywords_cloud);
}

function Draw_event_river_result(){
  url = "/topic_language_analyze/topics_river/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_event_river);
}

function Draw_blog_opinion_result(){
  url = "/topic_language_analyze/subopinion/?topic="+topic;
  console.log(url);
  topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning. Draw_blog_opinion);
}

function Draw_blog_scan_area_meaning_result(){
  url = "/topic_language_analyze/weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval+'&opinion='+opinion;
  console.log(url);
  topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_blog_scan_area_meaning);
}   


Draw_keywords_cloud_result();
Draw_event_river_result();
Draw_blog_opinion_result();
Draw_blog_scan_area_meaning_result();
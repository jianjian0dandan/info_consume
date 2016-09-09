var topic='aoyunhui';
var start_ts=1468944000;
var end_ts=1471622400;
var opinion=["圣保罗", "班底", "巴西", "康熙"];


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

    var item_data = data;
    var data_json = [];
    var html = '';
    
    // // console.log('111');
    
    for (var key in item_data){

        console.log(key);
        console.log(item_data[key]);
        // console.log(item[key].length);
        var evolution_json = [];

        for (i=0;i<item_data[key].length;i++){    
          evolution_json.push({"time":item_data[key][i][0],"value":item_data[key][i][1],});
          
        }
        console.log(evolution_json);
        data_json.push({"name":key,"evolution":evolution_json});
      }

    console.log(data_json);

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
                "name": "子事件名称", 
                "type": "eventRiver", 
                "weight": 123, 
                // [{name:,weight:}]
                "data":data_json
                
            }
        ]
};
    myChart.setOption(option);     

},

// Draw_time_line:function(data){
//     var item = data;
//     var html = '';
//     if (item.length == 0){
//         html += '<div style="color:grey;">暂无数据</div>'
//         }else{

//         html += '<div class="row">';
//         html += '<div class="col-md-12" style="width:58%;">';
//         html += '<div class="VivaTimeline">';
//         html += '<dl style="margin-left:-18%;">';
//         html += '<dt>'+Aug2016+'</dt>';
        
//         for(i=0;i<3;i++){
//             html += '<dd class="pos-left clearfix">';
//             html += '<div class="circ"></div>';
//             html += '<div class="time">'+Aug12+'</div>';
//             html += '<div class="events">';
//             html += '<div class="events-header">'+奥运网红身价涨多少傅园慧主播身价至少涨20倍+'</div>';
//             html += '<div class="events-body">';
//             for(i=0;i<3;i++){  //循环输入三条代表性微博
//                 html += '<div class="row">';
//                 html += '<div class="events-desc">'中国新闻网&nbsp;&nbsp;&nbsp;&nbsp;2016-08-12 11:03:00;                               
//                 html += '</br>'据了解，目前傅园慧的广告身价约为800万以上，按照单条代言的价格，已经可以比肩游泳队的两名“网红”孙杨、宁泽涛，这一价格比她赛前的身价至少翻了4到5倍。而其接受直播等商业活动的价格也在60万到100万之间，这一价格是此前的近20倍。'</div>';
//                 html += '</div>';
                
//             }
//             // html += '<div class="row">';
//             // html += ' <div class="events-desc">'北京青年报&nbsp;&nbsp;&nbsp;&nbsp;2016-08-12 10:03:00;
//             // html += ' </br>'本届奥运会上，国家游泳队运动员傅园慧凭借赛后采访时真实率性的回答和夸张的表情动作意外走红，
//             //                     被网友称为“行走的表情包”。她的微博4天增加了400万粉丝，平均每条微博下都有数万条留言、几十万个点赞。
//             //                     10日，傅园慧在微博上发布了其走红以来的第一条广告，随后又在某直播平台上进行了长达一个小时的直播首秀。虽然她极力澄清自己没有商业化，这些都是服从队里的安排、早就接下的活动，但依然无法避免外界对她身价的猜测。
//             //                                     '</div>';
//             // html += '</div>';
//             // html += '<div class="row">';
//             // html += '<div class="events-desc">'中青在线&nbsp;&nbsp;&nbsp;&nbsp;;2016-08-12 12:03:00;
//             // html += '</br>'两天时间微博圈粉300万，奥运“网红”傅园慧有多少商业价值？今天，傅园慧微博已经发布了一条广告内容，
//             //                网友留言表示好评，“什么！你打广告的方式竟然这么简单！果然和外面的那些妖艳贱货不一样！” 　　
//             //                傅园慧彻底火了。这两天爆出另一股“洪荒之力”的傅园慧，两天时间微博圈粉300万，成为本届奥运会的最大亮点。
//             //                                 '</div>';
//             // html += '</div>';
//             html += '</div>';
//             html += '<div class="events-footer">'123'</div>';                    
//             html += '</div>';
//             html += '</dd>';


//             html += '<dt>'Aug 2016'</dt>';
//             html += '<dd class="pos-right clearfix">';
//             html += '<div class="circ"></div>';
//             html += '<div class="time">'Aug 10'</div>';
//             html += '<div class="events">';
//             html += ' <div class="events-header">'傅园慧：快被霍顿气死，拥抱孙杨感觉很奇妙'</div>';
//             html += '<div class="events-body">';
//             for(i=0;i<3;i++){
//                 html += '<div class="row">';
//                 html += '<div class="events-desc">'中青在线&nbsp;&nbsp;&nbsp;&nbsp;;2016-08-10 12:03:00;
//                 html += '</br>'关于澳大利亚选手霍顿“嘲讽”孙杨一事，傅园慧表示：“我当时看到差点气死，我觉得这是污蔑，
//                                 怎么能那么说杨哥。不过我在这儿说也没用，因为我也不能说什么，再说回去不就跟他们一样了吗？”
//                                                 '</div>';
//                 html += '</div>';
//             }
            
//             // html += '<div class="row">';
//             // html += '<div class="events-desc">'中青在线&nbsp;&nbsp;&nbsp;&nbsp;;2016-08-10 12:03:00;
//             // html += '</br>'“我当时还想，如果我能战胜澳大利亚队的人的话，可能还蛮开心的吧，
//             //                 不过，跟我仰泳的那些其实没什么关系，我们不能迁怒于别人。我还是觉得很过分啊，
//             //                 怎么乱讲啊，杨哥是很努力的人，是很优秀的运动员，根本就没有做过作弊的事情，不是所有的运动员都会吃兴奋剂的。很多人以为出成绩必须吃药，但其实不是这样子的。”
//             //                                 '</div>';
//             // html += '</div>';
//             // html += '<div class="row">';
//             // html += '<div class="events-desc">'中青在线&nbsp;&nbsp;&nbsp;&nbsp;;2016-08-10 12:03:00;
//             // html += '</br>'有网友问被孙杨抱的感受，傅园慧说：“他就是祝贺我一下，不过直接摸到肉的感觉还是很奇妙的。”
//             //                 对于宁泽涛，傅园慧说：“宁泽涛也很棒啊，我跟你们讲这都是中国好男人。”
//             //                                 '</div>';
//             // html += '</div>';
//             html += '</div>';
//             html += '<div class="events-footer">';
//             html += '</div>';
//             html += '</div>';
//             html += '</dd>';



//         }

        
//         html += '<dt>'Jan 2016'</dt>';
//         html += '<dt>'Dec 2015'</dt>';
//         html += '<dt>'Oct 2015'</dt>';
//         html += '<dt>'Sep 2015'</dt>';
//         html += '<dt>'Aug 2015'</dt>';
//         html += '</dl>';
//         html += '</div>';
//         html += '</div>';
//         html += '</div>';

 
    
//         // window.jQuery || document.write('<script src="../../static/info_consume/js/jquery.min.js"><\/script>')
       
//         // $(document).ready(function () {
//         //     $('.VivaTimeline').vivaTimeline({
//         //             carousel: true,
//         //             carouselTime: 3000
//         //     });
//         // });
 
//         }
    
     
//         $('container').append(html);
// },


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

function Draw_time_line_result(){
  url = "/topic_language_analyze/subopinion/?topic="+topic;
  console.log(url);
  topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning. Draw_blog_opinion);
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
//Draw_time_line_result();
Draw_blog_opinion_result();
Draw_blog_scan_area_meaning_result();
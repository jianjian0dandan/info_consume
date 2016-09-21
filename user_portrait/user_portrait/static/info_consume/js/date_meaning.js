var topic='aoyunhui';
var start_ts=1468944000;
var end_ts=1471622400;
var opinion=["圣保罗", "班底", "巴西", "康熙"];

var now = new Date();
var year = now.getFullYear();
var month_num = now.getMonth()+1;
var month = '';
switch (month_num)
{
case 1:
  month="Jan";
  break;
case 2:
  month="Feb";
  break;
case 3:
  month="Mar";
  break;
case 4:
  month="Apr";
  break;
case 5:
  month="May";
  break;
case 6:
  month="Jun";
  break;
case 7:
  month="Jul";
  break;
case 8:
  month="Aug";
  break;
case 9:
  month="Sep";
  break;
case 10:
  month="Oct";
  break;
case 11:
  month="Nov";
  break;
case 12:
  month="Dec";
  break;
}
var date = month+' '+year


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

        var evolution_json = [];

        for (i=0;i<item_data[key].length;i++){    
          evolution_json.push({"time":item_data[key][i][0],"value":item_data[key][i][1],});
          
        }
        
        data_json.push({"name":key,"evolution":evolution_json});
      }

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

Draw_time_line:function(data){
    var item = data;
    var html = '';
    if (item.length == 0){
        html += '<div style="color:grey;">暂无数据</div>'
        }else{

              html += '<div class="row">';
              html += '<div class="col-md-12" style="width:58%;">';
              html += '<div class="VivaTimeline">';
              html += '<dl style="margin-left:-18%;">';
              html += '<dt>'+date+'</dt>';
              var k=0;
              for(var key in item){
                  k++;
                 
                  if(k%2 == 1){
                      //左侧栏
                      
                      html += '<dd class="pos-left clearfix">';
                      html += '<div class="circ"></div>';
                        // html += '<div class="time">'+item[key][i].datetime+'</div>';
                      html += '<div class="events">';
                      html += '<div class="events-header">'+key+'</div>';
                      html += '<div class="events-body">';
                      for(i=0;i<Math.min(3,item[key].length);i++){
                        html += '<div class="row">';
                        html += '<div class="events-desc">'+item[key][i].text+'<br>'+item[key][i].datetime+'</div>';                               
                        html += '</div>';
                      }
                      html += '</div>';
                      html += '<div class="events-footer">'; 
                      html += '<ol>';
                      html += '<li data-target="0" class="active"></li>';
                      html += '<li data-target="1" class=""></li>';
                      html += '<li data-target="2" class=""></li>';
                      html += '</ol>'; 
                      html += '</div>';                             
                      html += '</div>';
                      html += '</dd>';
                  }
                  if(k%2 == 0){
                      //右侧栏
                      html += '<dd class="pos-right clearfix">';
                      html += '<div class="circ"></div>';
                        // html += '<div class="time">'+item[key][i].datetime+'</div>';
                      html += '<div class="events">';
                      html += '<div class="events-header">'+key+'</div>';
                      html += '<div class="events-body">';
                      for(i=0;i<Math.min(3,item[key].length);i++){
                        html += '<div class="row">';
                        html += '<div class="events-desc">'+item[key][i].text+'<br>'+item[key][i].datetime+'</div>';                               
                        html += '</div>';
                      }
                      html += '</div>';
                      html += '<div class="events-footer">'; 
                      html += '<ol>';
                      html += '<li data-target="0" class=""></li>';
                      html += '<li data-target="1" class=""></li>';
                      html += '<li data-target="2" class="active"></li>';
                      html += '</ol>'; 
                      html += '</div>';                  
                      html += '</div>';
                      html += '</dd>';
                      
                  }

              }
              
              
              html += '<dt>'+'Aug2016'+'</dt>';
              html += '<dt>'+'Jul2016'+'</dt>';
              html += '<dt>'+'Jun2016'+'</dt>';
              html += '<dt>'+'May2016'+'</dt>';
              html += '</dl>';
              html += '</div>';
              html += '</div>';
              html += '</div>';

        }
        window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
        $(document).ready(function () {
            $('.VivaTimeline').vivaTimeline({
                carousel: true,
                carouselTime: 3000
            });
        });

        $('#container').append(html);
      
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

function Draw_time_line_result(){
  url = "/topic_language_analyze/symbol_weibos/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  console.log(url);
  topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_time_line);
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
Draw_time_line_result();
Draw_blog_opinion_result();
Draw_blog_scan_area_meaning_result();
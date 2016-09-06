 function preference() 
 {
  //this.ajax_method='GET'; // body...
 }

preference.prototype=
{
  call_sync_ajax_request:function(url,callback) 
  {
    
    $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          async: true,
          success:callback,
         //  beforeSend: function () 
         //  {  
         //   ShowMessage("正在努力地为您加载数据，请稍后哟~"); 
          // },
         //  // CloseWindow();
      });
  },

  domain:function(data)
  {

    var i;
    //将此人涉及领域从数据库取出，
    var domain = new Array();
    var num = new Array();
    var show_domain = new Array();
    
    for (i=0;i<data.in_topic.length;i++) 
    {
      domain[i]=data.in_topic[i][0];
      num[i]=data.in_topic[i][1];
      show_domain.push({text:domain[i],max:maxvalue});
    }
    console.log(domain[0]);
    var topdomain = domain[0];
    document.getElementById('topdomain').innerHTML = topdomain + "达人";
    //获取数量数组中的最大值；
    var maxvalue=Math.max.apply(null, num);
    //console.log(maxvalue);
    //console.log(num);
//console.log(show_domain);
    var myChart = echarts.init(document.getElementById('domain'));
            option = {              
              tooltip : {
                  trigger: 'axis'
              },
               toolbox: {
                  show : true,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      restore : {show: true},
                      saveAsImage : {show: true}
                  }
              },             
              calculable : true,
              polar : [
                  {
                      indicator : show_domain,
                     
                      radius : 130
                  }
              ],
              series : [
                  {
                      // name: '完全实况球员数据',
                      type: 'radar',
                      itemStyle: {
                          normal: {
                              areaStyle: {
                                  type: 'default'
                              }
                          }
                      },
                      data : [
                         
                          {
                            name:'他/她的领域',
                              value : num,
                              
                          }
                      ]
                  }
              ]
          };
            myChart.setOption(option);
            window.onresize = myChart.resize;

    //显示正在加载中的文字
    $('#p_so_onload1').css('display','none').siblings().css('display','block');   
    } ,

    social:function(data)
    {
      //console.log(data);
      Draw_out(data.top_retweet_comment,'retweet_out');
          Draw_out(data.top_be_retweet_comment,'tweeted_out');
      Draw_out(data.top_interaction,'two_way_out');
      Draw_out(data.top_mention,'related_out');
      $('#p_so_onload1').css('display','none').siblings().css('display','block'); 
    }
}


function Draw_out(data,div){
   // console.log(data[1][1]);
        $('#'+div).empty();
    if(data.length==0){
        document.getElementById('domain').innerHTML = "暂无数据";
      // $('#more'+div).css('display','none');
    }else
    {
      var html = '';
      for(var i=0;i<data.length;i++){
          if(data[i][2]=='unknown'){
            data[i][2] = "http://tp2.sinaimg.cn/1878376757/50/0/1";
        }
        if(data[i][1]=='unknown'){
            data[i][1] = "未知";
            data[i][1] = data[i][0];
                }
          html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
      }
      // $('#more'+div).css('display','none');
      $('#'+div).append(html);
    }
      // var more_user = 'user'+div;
      // DrawMoreUser(data,more_user);
      // $('#'+div).append(html);
}


var uid = 2853982940;

var preference=new preference();


function show_domain()
{
  url = '/attribute/new_user_social/?uid=' + uid;
  console.log(url);
  preference.call_sync_ajax_request(url,preference.domain);
}

function show_social()
{
  url = '/attribute/new_user_social/?uid='+ uid;
  preference.call_sync_ajax_request(url,preference.social);
}

show_domain();
show_social();

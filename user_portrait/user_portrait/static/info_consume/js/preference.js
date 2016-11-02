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
    // console.log(domain[0]);
    // console.log(domain[1]);
   // console.log(domain[0]);
   // console.log(domain[1]);
    var topdomain = domain[0];
    
    var othernum;
    for (var j = 0; j < data.in_topic.length; j++) {
      if (domain[j] == "其他类") {
        othernum = j;
        break;
      }
    }
    if(othernum == 0){
      topdomain = domain[1];
    }

    $('#domainSort').append(topdomain);
    
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
    }

}


var uid = 1640601392;

var preference=new preference();


function show_domain()
{
  url = '/attribute/new_user_social/?uid='+uid;
 // console.log(url);
  preference.call_sync_ajax_request(url,preference.domain);
}


show_domain();

console.log("加载偏好");

//出
console.log("【情绪特征】start load:"+getSystemTime());
function Draw_weibo_table(data){
              $('#group_emotion_loading').css('display', 'none');
              $('#input-table').css('display', 'block');
              var dataArray =data;
              var PageNo=document.getElementById('PageNo');                   //设置每页显示行数
              var InTb=document.getElementById('input-table');               //表格
              var Fp=document.getElementById('F-page');                      //首页
              var Nep=document.getElementById('Nex-page');                  //下一页
              var Prp=document.getElementById('Pre-page');                  //上一页
              var Lp=document.getElementById('L-page');                     //尾页
              var S1=document.getElementById('s1');                         //总页数
              var S2=document.getElementById('s2');                         //当前页数
              var currentPage;                                              //定义变量表示当前页数
              var SumPage;     

                  if(PageNo.value!="")                                       //判断每页显示是否为空
                  {
                      InTb.innerHTML='';                                     //每次进来都清空表格
                      S2.innerHTML='';                                        //每次进来清空当前页数
                      currentPage=1;                                          //首页为1
                      S2.appendChild(document.createTextNode(currentPage));
                      S1.innerHTML='';                                        //每次进来清空总页数
                      if(dataArray.length%PageNo.value==0)                    //判断总的页数
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value);
                      }
                      else
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value)+1
                      }
                      S1.appendChild(document.createTextNode(SumPage));
                      var oTBody=document.createElement('tbody');               //创建tbody
                      oTBody.setAttribute('class','In-table');                   //定义class
                      InTb.appendChild(oTBody);
                      //将创建的tbody添加入table
                      var html_c = '';
                      if(dataArray==''){
                        html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'>该时段群组用户未发布任何微博</span></div>";
                          oTBody.innerHTML = html_c;
                    }else{
                
                      for(i=0;i<parseInt(PageNo.value);i++)
                      {                                                          //循环打印数组值
                          oTBody.insertRow(i);

                          html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'>"+dataArray[i]['text']+"</span></div>";
                             oTBody.rows[i].insertCell(0);
                             oTBody.rows[i].cells[0].innerHTML = html_c;                    
                      }
                  }
              }
               Fp.onclick=function()
              {

                  if(PageNo.value!="")                                       //判断每页显示是否为空
                  {
                      InTb.innerHTML='';                                     //每次进来都清空表格
                      S2.innerHTML='';                                        //每次进来清空当前页数
                      currentPage=1;                                          //首页为1
                      S2.appendChild(document.createTextNode(currentPage));
                      S1.innerHTML='';                                        //每次进来清空总页数
                      if(dataArray.length%PageNo.value==0)                    //判断总的页数
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value);
                      }
                      else
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value)+1
                      }
                      S1.appendChild(document.createTextNode(SumPage));
                      var oTBody=document.createElement('tbody');               //创建tbody
                      oTBody.setAttribute('class','In-table');                   //定义class
                      InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
                      var html_c = '';

                      if(dataArray==''){
                        html_c = "<div style='width:100%;'><span style='margin-left:20px;'>该时段群组用户未发布任何微博</span></div>";
                          oTBody.rows[0].cells[0].innerHTML = html_c;
                    }else{
                
                      for(i=0;i<parseInt(PageNo.value);i++)
                      {                                                          //循环打印数组值
                          oTBody.insertRow(i);

                          html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'><a href='./viewinformation'>"+dataArray[i]['text']+"</a></span></div>";
                             oTBody.rows[i].insertCell(0);
                             oTBody.rows[i].cells[0].innerHTML = html_c;                    
                      }
                  }
              }
              }
              Nep.onclick=function()
              {
                  if(currentPage<SumPage)                                 //判断当前页数小于总页数
                  {
                      InTb.innerHTML='';
                      S1.innerHTML='';
                      if(dataArray.length%PageNo.value==0)
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value);
                      }
                      else
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value)+1
                      }
                      S1.appendChild(document.createTextNode(SumPage));
                      S2.innerHTML='';
                      currentPage=currentPage+1;
                      S2.appendChild(document.createTextNode(currentPage));
                      var oTBody=document.createElement('tbody');
                      oTBody.setAttribute('class','In-table');
                      InTb.appendChild(oTBody);
                      var a;                                                 //定义变量a
                      a=PageNo.value*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
                      var c;                                                  //定义变量c
                      if(dataArray.length-a>=PageNo.value)                  //判断下一页数组数据是否小于每页显示行数
                      {
                          c=PageNo.value;
                      }
                      else
                      {
                          c=dataArray.length-a;
                      }
                      for(i=0;i<c;i++)
                      {
                             oTBody.insertRow(i);
                              oTBody.rows[i].insertCell(0);
                            html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'><a href='./viewinformation'>"+dataArray[i+a]['text']+"</a></span></div>";
                            oTBody.rows[i].cells[0].innerHTML = html_c;
                          
                                                                             //数组从第i+a开始取值
                      }
                  }
              }

              Prp.onclick=function()
              {
                  if(currentPage>1)                        //判断当前是否在第一页
                  {
                      InTb.innerHTML='';
                      S1.innerHTML='';
                      if(dataArray.length%PageNo.value==0)
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value);
                      }
                      else
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value)+1
                      }
                      S1.appendChild(document.createTextNode(SumPage));
                      S2.innerHTML='';
                      currentPage=currentPage-1;
                      S2.appendChild(document.createTextNode(currentPage));
                      var oTBody=document.createElement('tbody');
                      oTBody.setAttribute('class','In-table');
                      InTb.appendChild(oTBody);
                      var a;
                      a=PageNo.value*(currentPage-1);
                      for(i=0;i<parseInt(PageNo.value);i++)
                      {
                          oTBody.insertRow(i);
                          oTBody.rows[i].insertCell(0);
                          html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'><a href='./viewinformation'>"+dataArray[i+a]['text']+"</a></span></div>";
                            oTBody.rows[i].cells[0].innerHTML = html_c;
                      }
                  }
              }

               Lp.onclick=function()
              {
                      InTb.innerHTML='';
                      S1.innerHTML='';
                      if(dataArray.length%PageNo.value==0)
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value);
                      }
                      else
                      {
                          SumPage=parseInt(dataArray.length/PageNo.value)+1
                      }
                      S1.appendChild(document.createTextNode(SumPage));
                      S2.innerHTML='';
                      currentPage=SumPage;
                      S2.appendChild(document.createTextNode(currentPage));
                      var oTBody=document.createElement('tbody');
                      oTBody.setAttribute('class','In-table');
                      InTb.appendChild(oTBody);
                      var a;
                      a=PageNo.value*(currentPage-1);
                      var c;
                      if(dataArray.length-a>=PageNo.value)
                      {
                          c=PageNo.value;
                      }
                      else
                      {
                          c=dataArray.length-a;
                      }
                      for(i=0;i<c;i++)
                      {
                          oTBody.insertRow(i);
                            oTBody.rows[i].insertCell(0);
                          html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'><a href='./viewinformation'>"+dataArray[i+a]['text']+"</a></span></div>";
                            oTBody.rows[i].cells[0].innerHTML = html_c;
                      }
              }

}




function Draw_sentiment_trend(data){
    console.log(data)
    var times = [];
    var time_name = [];
    times = data['sentiment_trend']['time_list'];
    time_name = data['sentiment_trend']['time_list'];
    //console.log(time_name);
    var names = ['中性','积极','消极']; 
    var data0 = data['sentiment_trend']['0'];
    var data1 = data['sentiment_trend']['1'];
    var data2 = data['sentiment_trend']['2'];
    var datas = [data0,data1,data2];
    var nods = {};
    var nodcontent = [];
    for(i=0;i<3;i++){
        nods = {};
        nods['name'] = names[i];
        nods['type'] = 'line';
        nods['data'] = datas[i];
        nodcontent.push(nods);
    }

    var myChart1 = echarts.init(document.getElementById('senti-trend'));
    var option = {
    tooltip : {
        trigger: 'axis'
    },
    grid:{
        width:'75%'
    },
    legend: {
        data:names
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : times
        }
    ],
    yAxis : [
        {
            type : 'value',
        }
    ],
    series : nodcontent
    };
    myChart1.setOption(option); 
    require([
            'echarts'
        ],
        function(ec){
                //$('#group_emotion_loading').css('display', 'block');
            var ecConfig = require('echarts/config');
            function focus(param) {
                $('#input-table').css('display', 'none');
                $('#group_emotion_loading').css('display', 'block');
                //$('#')
                var sentiment = param.seriesIndex;
                var date = new Date(time_name[param.dataIndex]);
                var starts_ts = date.getTime().toString().substr(0,10);
                var start_ts = parseInt(starts_ts)-28800;    
                //console.log(date);
                var ajax_url = '/info_group/group_sentiment_weibo/?task_name='+g_name+'&sentiment='+sentiment+'&start_ts='+start_ts+'&submit_user='+s_user;
              //  var ajax_url = '/info_group/group_sentiment_weibo/?task_name=冯绍峰&sentiment=0&start_ts=1377964800&submit_user=admin@qq.com';
                $.ajax({
                      url: ajax_url,
                      type: 'GET',
                      dataType: 'json',
                      async: true,
                      success:Draw_weibo_table    
                    });

                var html0 = '';
                $('#group_select_time').empty();  
                html0 += "<div style='float:left'>当前选择时间段：</div><div style='color:brown;'>"+time_name[param.dataIndex]+"</div><div style='float:left'>当前选择情绪：</div><div style='color:brown;'>"+names[sentiment]+'</div>';
                $('#group_select_time').append(html0);
                }
           
            myChart1.on(ecConfig.EVENT.CLICK, focus);
            
            }
            
    )
}

function Draw_group_trend(data){
    var items = data;
    if(items==null){
        var say = document.getElementById('senti-weibo');
        say.innerHTML = '该用户暂无此数据';
    }else{
       Draw_sentiment_trend(items);
        var time_init = new Date(items['sentiment_trend']['time_list'][items['sentiment_trend']['time_list'].length-1]);
        var times_init = time_init.getTime().toString().substr(0,10);
        var html0 = '';
        var url_content = '/info_group/group_sentiment_weibo/?task_name='+g_name+'&sentiment=0&start_ts='+times_init+'&submit_user='+s_user;
        //var url_content ='/info_group/group_sentiment_weibo/?task_name=冯绍峰&sentiment=0&start_ts=1377964800&submit_user=admin@qq.com';
       //console.log(url_content)
        $('#input-table').empty();
        $('#input-table').css('display', 'none');
        $('#group_emotion_loading').css('display', 'block');
        //$('#group_weibo_text_1').append('数据正在加载中，请稍后...');
        call_sync_ajax_request(url_content,'GET',Draw_weibo_table);
        $('#group_select_time').empty();  
        html0 += "<div style='float:left'>当前选择日期：</div><div style='color:brown;'>"+items['sentiment_trend']['time_list'][items['sentiment_trend']['time_list'].length-1]+"</div><div style='float:left' >当前选择情绪：</div><div style='color:brown;'>中性</div>";
        $('#group_select_time').append(html0);
    }   
}


function  Draw_sentiment_pie(data){   
var senti_total = data[0]+data[1]+data[2]+data[3]+data[4]+data[5]+data[6];
var positive = data['1'];
var neutral = data['0'];
var negative = senti_total-positive-neutral;
var dataStyle = {
    normal: {
        label: {show:false},
        labelLine: {show:false},
        tooltip: {show:false}
    }
};
var placeHolderStyle = {
    normal : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    },
    emphasis : {
        color: 'rgba(0,0,0,0)',
        label: {show:false},
        labelLine: {show:false}
    }
};
  require(
     [  
            'echarts'
        ],
function(ec){
var myChart = echarts.init(document.getElementById('senti-pie'),'shine');
var ecConfig = require('echarts/config');
var option = {
    title: {
        text: '你快乐吗？',
        subtext: 'From SinaWeibo',
        sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle : {
            color : 'rgba(30,144,255,0.8)',
            fontFamily : '微软雅黑',
            fontSize : 27,
            fontWeight : 'bolder'
        }
    },
    tooltip : {
        show: true,
        formatter: "{b} : {d}%"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        y : 'top',
        itemGap:12,
        data:['我很快乐','我很难过','感觉还行']
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
    series : [
        {
            type:'pie',
            clockWise:false,
            radius : [125, 150],
            itemStyle : dataStyle,
            data:[
                {
                    value:negative, 
                    name:'我很难过'
                },
                {
                    value:senti_total-negative,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        },
        {
            type:'pie',
            clockWise:false,
            radius : [100, 125],
            itemStyle : dataStyle,
            data:[
                {
                    value:neutral, 
                    name:'感觉还行'
                },
                {
                    value:senti_total-neutral,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        },
        {
            type:'pie',
            clockWise:false,
            radius : [75, 100],
            itemStyle : dataStyle,
            data:[
                {
                    value:positive,
                    name:'我很快乐'
                },
                {
                    value:senti_total-positive,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                }
            ]
        }
    ]
};

myChart.on(ecConfig.EVENT.CLICK, function (param){
  // var date = new Date('2013-09-01');
  // var starts_ts = date.getTime().toString().substr(0,10);
  // var start_ts = parseInt(starts_ts)-28800; 
  // console.log(start_ts);
  
  //window.open('./viewinformation');

 })
 myChart.setOption(option);
})
}

function Draw_psy_page(data){
       Draw_sentiment_pie(data.sentiment_pie);
       Draw_group_trend(data);
} 

 function g_tho_load(g_name,s_user){
 var psy_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=think';
 call_sync_ajax_request(psy_url,'GET',Draw_psy_page);
 //console.log("psy_url:"+psy_url);
 }
 console.log("【情绪特征】end load:"+getSystemTime());
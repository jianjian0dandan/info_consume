function Influence(){
  this.ajax_method = 'GET';
}
  //console.log('yoyo');
 // console.log('yoyo');

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
      //console.log('hah');
  },
  
  Draw_influence:function(data){
  //console.log(data);
    //  console.log('hah');
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
    };console.log(rank);

    var allInflu_data = [];
    for(var j=0;j<10;j++){
      allInflu_data[j] = data[j];  
    };console.log(allInflu_data[0].uname);

    var html_table;
    for(var j=0;j<10;j++)
      html_table += "<table><tr><td><img src="+allInflu_data[j].photo_url+"width=40px height=40px style='border-radius:20px;'></td><td>"+allInflu_data[j].uname+"</td><td>"+allInflu_data[j].bci+"</td></tr></table>"
    $('#influ_all').append(html_table);
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

var uid = 1640601392;
//var username = admin@qq.com;
var Influence = new Influence();
var influence_date = choose_time_for_mode();
var pre_influence_date = new Date(influence_date - 24*60*60*1000);
var date_str = pre_influence_date.format('yyyy-MM-dd');
influence_load();
//var influ_all_table_url= '/influence_sort/user_sort/?username='+username+'&sort_scope=all_nolimit&all=True';
var influ_all_table_url= '/influence_sort/user_sort/?username=admin@qq.com&sort_scope=all_nolimit&all=True';
  Influence.call_ajax_request(influ_all_table_url, Influence.ajax_method, Influence.influence_Table_all);


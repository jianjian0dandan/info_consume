console.log("【好友展示】start load:"+getSystemTime());
 function viewinformation()
 {
  //this.ajax_method='GET'; // body...
 }
viewinformation.prototype=
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

  social_be:function(data){
      //console.log("follow_data:"+data);
      Draw_out(data,'tweeted_out'); 
    },
    
  social_me:function(data){
      //console.log(data);
      Draw_out(data,'retweet_out');
      //console.log('运行转发函数');
  }

}

function Draw_out(data,div){
    //console.log(div);
        $('#'+div).empty();
    //console.log(data);
    if(data.length==0){
      var html='';
      html=html+'<p style="margin-left:4%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
       $('#'+div).append(html);
        //document.getElementById(div).innerHTML = "";
      // $('#more'+div).css('display','none');
    }else{
      //console.log('else here');
      var html = '';
      for(var i=0;i<data.length;i++){
        if(data[i].photo_url==""){
          data[i].photo_url = "http://tp2.sinaimg.cn/1878376757/50/0/1";
        }
        if(data[i].uname==""){
            data[i].uname = data[i].uid;
        }
        var uname_show = data[i].uname;
        if (data[i].uname.length>4) {
          uname_show = data[i].uname.substr(0,4)+'..';
        }

         // html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
          html = html + "<a target='_blank' href='/index/viewinformation/?uid=" + data[i].uid + "' class='img-photo' title='"+data[i].uname+": "+data[i].count+"' style='margin-left:20px;margin-top:10px;display:block;float:left;'><img id='portraitImg' style='height:50px;width:50px;' src='"+ data[i].photo_url + "'alt='"+uname_show+"'' width='30' height='30'><span style='height:10px;width:30px;font-size:12px;'>"+uname_show+"</span></a>";
          if(i == 10)
            break;
        }
  
      html += "<div style='width:50px;height:50px;display:block;margin-left:120px;font-size:12px;'><a target='_blank' href='/index/my_friend'>查看更多</a></div>"
      //console.log(html);
      // $('#more'+div).css('display','none');
      $('#'+div).append(html);
  }
}
function valueme(data) {
    //console.log(data);
    if (!isNaN(data)){
        //console.log(data.toFixed(2))
        $('#money').text(data.toFixed(2)+" 万元");
    }else {
        $('#money').text('暂无估值');
    }
}

$('#retweet_out').click(function(){
viewinformation.social_me.show();//显示
viewinformation.social_be.hide();//隐藏
});

// $(function(){
//   $('#myTab').click(function(){
//     viewinformation.social_me;
//     console.log('运行');
//   })
// });

var viewinformation=new viewinformation();
// var uid = 1640601392;
function show_social(){
  var url_be = '/info_person_social/follower/?uid='+uid;
  viewinformation.call_sync_ajax_request(url_be,viewinformation.social_be);
  var url_me = '/info_person_social/attention/?uid='+uid;
  viewinformation.call_sync_ajax_request(url_me,viewinformation.social_me);
};

function money() {
    var url='/topic_language_analyze/evaluate_person/?uid='+uid;
    viewinformation.call_sync_ajax_request(url,valueme);
}
money();

// function show_follower()
// {
//   url = '/info_person_social/follower/?uid='+uid;
//   viewinformation.call_sync_ajax_request(url,viewinformation.follower);
// }
// function show_attention()
// {
//   url ='/info_person_social/attention/?uid='+uid;
//   viewinformation.call_sync_ajax_request(url,viewinformation.attention);
// }

show_social();
// //被转发
// show_follower();
// //转发
// show_attention();
console.log("【好友展示】end load:"+getSystemTime());
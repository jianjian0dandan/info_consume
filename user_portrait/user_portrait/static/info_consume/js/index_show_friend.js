
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
      //console.log(data);
      Draw_out(data,'tweeted_out');
      $('#p_so_onload1').css('display','none').siblings().css('display','block'); 
    },
    
  social_me:function(data){
      //console.log(data);
      Draw_out(data,'retweet_out');
      $('#p_so_onload1').css('display','none').siblings().css('display','block'); 
      console('attem');
  }
}


function Draw_out(data,div){
    console.log(data);
        $('#'+div).empty();
    console.log(data.length);
    if(data.length==0){
      var html='';
      html=html+'<p style="margin-left:4%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
       $('#'+div).append(html);
        //document.getElementById(div).innerHTML = "";
      // $('#more'+div).css('display','none');
    }else
    {
      console.log('else here');
      var html = '';
      for(var i=0;i<data.length;i++){
        if(data[i].photo_url=='unknown'){
          data[i].photo_url = "http://tp2.sinaimg.cn/1878376757/50/0/1";
        }
        if(data[i].uname=='unknown'){
            data[i].uname = "未知";
        }
        var uname_show = data[i].uname;
        if (data[i].uname.length>4) {
          uname_show = data[i].uname.substr(0,4)+'..';
        }

         // html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
          html = html + "<a target='_blank' href='/index/viewinformation' class='img-photo' title='"+data[i].uname+": "+data[i].count+"' style='margin-left:20px;margin-top:10px;display:block;float:left;'><img id='portraitImg' style='height:50px;width:50px;' src='"+ data[i].photo_url + "'alt='"+uname_show+"'' width='30' height='30'><span style='height:10px;width:30px;font-size:12px;'>"+uname_show+"</span></a>";
          if(i == 10)
            break;
      }
      html += "<div style='width:50px;height:50px;font-size:12px;'><a target='_blank' herf='/index/my_friend'>查看更多</a></div>"
      console.log(html);
      // $('#more'+div).css('display','none');
      $('#'+div).append(html);
    }
}


var viewinformation=new viewinformation();
var uid = 2029036025;
function show_social(){
  var url_be = '/info_person_social/follower/?uid='+uid;
  viewinformation.call_sync_ajax_request(url_be,viewinformation.social_be);
  var url_me = '/info_person_social/attention/?uid='+uid;
  viewinformation.call_sync_ajax_request(url_me,viewinformation.social_me);
}


show_social();

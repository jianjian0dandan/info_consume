
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
    console.log(data);
        $('#'+div).empty();
    if(data.length==0){
      var html='';
      html=html+'<p style="margin-left:4%;margin-top:20px;"> 暂时还没有你想要的数据耶~~~</p>'
       $('#'+div).append(html);
        //document.getElementById(div).innerHTML = "";
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
         // html = html + '<a target="_blank" href="/index/personal/?uid='+data[i][0]+'" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:5px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
          html = html + '<a target="_blank" href="/index/viewinformation" class="img-photo" title="'+data[i][1]+'    频数：'+data[i][3]+'" style="margin-left:20px;margin-top:10px;display:block;float:left;"><img id="portraitImg" style="height:50px;width:50px;" src="'+ data[i][2] + '"alt="'+data[i][1]+'" width="30" height="30"></a>';
      }
      // $('#more'+div).css('display','none');
      $('#'+div).append(html);
    }
      // var more_user = 'user'+div;
      // DrawMoreUser(data,more_user);
      // $('#'+div).append(html);
}




var viewinformation=new viewinformation();
var uid = 1640601392;
function show_social()
{

  url = '/attribute/new_user_social/?uid='+uid;
  viewinformation.call_sync_ajax_request(url,viewinformation.social);
  console.log('socialdata='+url);
}


show_social();

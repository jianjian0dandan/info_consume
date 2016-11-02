function personZone() {
	this.ajax_method = 'GET';
}
personZone.prototype = {
  call_sync_ajax_request:function(url,method,callback) {
	  $.ajax({
		url: url,
		type: method,
		dataType:'json',
		async:true,
		success:callback
	});
  },
  //这里有修改
  personData:function(data){
  //console.log(data);
  personalData = data ;
  // var uid_div = document.getElementById('uid');
  // if(personalData.uid){
  //     //console.log(personalData.uid)
  //     uid_div.innerHTML = personalData.uid;
  // }else{
  //     uid_div.innerHTML = "无此数据";
  // }
  var img = document.getElementById('portraitImg');
  if(personalData.photo_url == "unknown"){
      img.src =  "http://tp2.sinaimg.cn/1878376757/50/0/1";
  }else{
  	  //console.log('here is pic');
      img.src = personalData.photo_url;
  }

  var nickName = document.getElementById('username');
  if(personalData.nick_name){
      if (personalData.nick_name == 'unknown') {
          nickName.innerHTML = '未知';
      }
      else{
          nickName.innerHTML = personalData.nick_name;
      }

  }else{
      nickName.innerHTML = "无此数据";
  }
   
   },

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uname']+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['influence']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['influence']+'</td>';
                 }
                 html+="</tr>";
                $('#friend_rank').append(html);
              }    
          }
   
   },
   //模态框（显示所有的好友排行信息）
   friend_rank_detail:function(data)
   {
      // console.log(data); 
      // console.log(data.length);
      // console.log(data[0]['influence']);
      //对返回的字典按照影响力进行排序
      data.sort(function(a,b){
            return b.influence-a.influence});
      //根据后台数据画表
      $('#friend_rank_detail').empty();
      if(data.length==0)
      {
         document.getElementById('friend_rank_detail').innerHTML = "暂无数据";
      }else
          {
           
            for(var i=0;i<data.length;i++)
              {  
                var html ='<tr>';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uname']+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['influence']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['influence']+'</td>';
                 }
                 html+="</tr>";
                $('#friend_rank_detail').append(html);
              }    
          }
   
   },

      //亲密度排行
      intimacy_rank:function(data)
      {
        
        data.sort(function(a,b){
            return b.count-a.count});
        //console.log(data);

         //根据后台数据画表
      $('#intimacy_rank').empty();
      if(data.length==0)
      {
         document.getElementById('intimacy_rank').innerHTML = "暂无数据";
      }else
          {
            var lengh_final;
            //默认显示10条亲密度排行信息
            if(data.length<10)
            {
              lengh_final=data.length;            
            }else
            {
              lengh_final=10;
            }  
            for(var i=0;i<lengh_final;i++)
              {  
                var html ='<tr style="background-color:#ECFFCE;">';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uname']+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['count']+'</td>';
                 }
                 html+="</tr>";
                $('#intimacy_rank').append(html);
              }    
          }
      },
      //模态框显示所有亲密度排行信息
      intimacy_rank_detail:function(data)
      {
        
        data.sort(function(a,b){
            return b.count-a.count});
            //console.log(data);

         //根据后台数据画表
      $('#intimacy_rank_detail').empty();
      if(data.length==0)
      {
         document.getElementById('intimacy_rank_detail').innerHTML = "暂无数据";
      }else
          { 
            for(var i=0;i<data.length;i++)
              {  
                var html ='<tr>';
                if(data[i]['uid']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uid']+'</td>';
                }

                if(data[i]['uname']=="")
                {
                  html+='<td >--</td>';
                }else{
                  html+='<td>'+data[i]['uname']+'</td>';
                }
                 
                 if(data[i]['friendsnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['friendsnum']+'</td>';
                 }

                 if(data[i]['fansnum']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['fansnum']+'</td>';
                 }

                if(data[i]['weibo_count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['weibo_count']+'</td>';
                 }

                 if(data[i]['count']=="")
                 {
                  html+='<td >--</td>';
                 }else
                 {
                  html+='<td>'+data[i]['count']+'</td>';
                 }
                 html+="</tr>";
                $('#intimacy_rank_detail').append(html);
              }    
          }
      },
      transmit_relationship:function(data)
      {
       // console.log(data);
      },


var Personal = new personZone();
var personalData; // global data
var overallData;
var weiboData;
var uid = 1640601392;

function openurl(){
  var ourl = $('#openurl').text();
  window.open(ourl);
 }


var url = "/attribute/new_user_profile/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.personData);
var url = "/attribute/new_user_evaluate/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.overallData);
var url = "/attribute/new_user_weibo/?uid="+uid+"&sort_type=timestamp";
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.weiboData);

//最新update

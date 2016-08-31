function homepageinfo() {
	this.ajax_method = 'GET';
}
homepageinfo.prototype = {
  call_sync_ajax_request:function(url,method,callback) {
	  $.ajax({
		url: url,
		type: method,
		dataType:'json',
		async:false,
		success:callback
	})
  },
  personData:function(data){
  console.log(data);
  personalData = data ;
  var uid_div = document.getElementById('uid');
  if(personalData.uid){
      //console.log(personalData.uid)
      uid_div.innerHTML = personalData.uid;
  }else{
      uid_div.innerHTML = "无此数据";
  }
  var img = document.getElementById('portraitImg');
  if(personalData.photo_url == "unknown"){
      img.src =  "http://tp2.sinaimg.cn/1878376757/50/0/1";
  }else{
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
   
   var nickName_greet = document.getElementById('username_greet');
     nickName_greet.innerHTML = personalData.nick_name;
        
   var Verfi = document.getElementById('verified');
   if( personalData.verified_type==""){
       personalData.verified_type = "暂无数据";
   }
       var verf = personalData.verified_type;
       var Verf_type = document.getElementById('verfType');
       if(verf != 0 && verf != 1 && verf != 2 && verf != 3 && verf != 4 && verf != 5 && verf != 6 && verf != 7 && verf != 8 && verf != 200 && verf != 220 && verf != 400 ){
       Verfi.innerHTML = "否";
       if(verf == -1){
         Verf_type.innerHTML = personalData.verified_type_ch;
       }else{
         Verf_type.innerHTML = "无";
       }
   }else{
       Verfi.innerHTML = "是";
     Verf_type.innerHTML = personalData.verified_type_ch;
   }
       var Fansum = document.getElementById('fansum');
   if( personalData.fansnum==""){
       personalData.fansnum = "暂无数据";
   }
       Fansum.innerHTML = personalData.fansnum;
   var Attentionsum = document.getElementById('attentionsum');
   if( personalData.friendsnum==""){
       personalData.friendsnum = "暂无数据";
   }
       Attentionsum.innerHTML = personalData.friendsnum;
   var Weibosum = document.getElementById('weibosum');
   if( personalData.statusnum==""){
       personalData.statusnum = "暂无数据";
   }
       Weibosum.innerHTML = personalData.statusnum;
   var Loca = document.getElementById('userLocation');
   if( personalData.user_location==""){
       personalData.user_location = "暂无数据";
   }
   Loca.innerHTML = personalData.user_location;
   var Descrip = document.getElementById('userdes');
   if( personalData.description==""){
       personalData.description = "暂无数据";
       }else if (personalData.description.length>50){
       Descrip.innerHTML = personalData.description.substr(0,50)+'...';
           Descrip.title = personalData.description;
      }else{
       Descrip.innerHTML = personalData.description;}
           var homepage = document.getElementById('uhome');
           if(!personalData.uid ){
               homepage.innerHTML = "无此数据";
           }else{
               homepage.innerHTML = '<a id="openurl" style="cursor:pointer" onclick="openurl();">http://weibo.com/u/'+personalData.uid;
           }  
    var userImg = document.getElementById('body_board')
      console.log(userImg);
      if (personalData.sex == ""){
  	    personalData.sex = '暂无数据';
  	    console.log(none);	
      } else if (personalData.sex == 1) {
        userImg.src = "/static/info_consume/image/bodymodel_man.png";
        console.log(1);
      }else if (personalData.sex == 2) {
        userImg.src = "/static/info_consume/image/bodymodel_woman.png";
        userImg.style = "width: 350px;margin-left: -77px;float: none;margin-top: 60px;display: block;opacity:0.8;";
        console.log(2);
      } 
   },
   //影响力和活跃度数据
    overallData:function(data){
    console.log(data);
    //影响力
     var FP = document.getElementById('influencePower');
       if(data.influence[0] !=""){
           FP.innerHTML = data.influence[0].toFixed(2);
       }else{
           FP.innerHTML = '0';
       }
      var perofinf = data.influence[0];
      perofinf = perofinf/100*440;
      $("#percentBar").css("width",perofinf);
    //活跃度
     var AP = document.getElementById('activePower');
       if(data.activeness[0] !=""){
          AP.innerHTML = data.activeness[0].toFixed(2);
       }else{
          AP.innerHTML = '0';
       }
     var actScore = document.getElementById('act_text');
     	if (data.activeness[0]<80) {
        actScore.innerHTML = '最近活跃度有所下降哦，宝宝不开心了￣へ￣';
      }else if (data.activeness[0]>=80){
        actScore.innerHTML = '最近很活跃，么么哒(づ￣ 3￣)づ';
      }
     
    }
  //微博数据处理
    weiboData:function(data){;
    	DrawWeibo(data,'group_influ_weibo', 'group_influ_weibo_result');
        $('#per_onload').css('display','none');
        $('#group_influ_weibo').css('display', 'block')
    }  

  }



var uid = 2625203751;
var Personal = new homepageinfo();
var personalData; // global data

var url = "/attribute/new_user_profile/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.personData);
var url = "/attribute/new_user_evaluate/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.overallData);

function openurl(){
  var ourl = $('#openurl').text();
  window.open(ourl);
 }

$(function(){
	$('#modechoose').click(function(){
	var box = document.getElementsByName('mode_choose');
	for(var i=0;i<box.length;i++){
		if(box[i].checked){
			sort_type = box[i].value;
		}
    }
$('#per_onload').css('display', 'block');
$('#group_influ_weibo').css('display', 'none')
	var url = "/attribute/new_user_weibo/?uid="+uid+"&sort_type="+sort_type;
	//console.log('ddd',url);
        Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.weiboData);
	});
});

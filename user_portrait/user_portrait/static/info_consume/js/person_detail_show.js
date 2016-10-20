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
      userImg_src = "http://tp2.sinaimg.cn/1878376757/50/0/1";
  }else{
      //console.log('here is pic');
      img.src = personalData.photo_url;
      userImg_src = personalData.photo_url;
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
}
}

var Personal = new personZone();
var personalData; // global data
var overallData;
var weiboData;
var uid = 1640601392;

function openurl(){
  var ourl = $('#openurl').text();
  window.open(ourl);
 }

var userImg_src;

var url = "/attribute/new_user_profile/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.personData);
var url = "/attribute/new_user_evaluate/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.overallData);
var url = "/attribute/new_user_weibo/?uid="+uid+"&sort_type=timestamp";
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.weiboData);

console.log("加载微博数据");
console.log("个人信息");

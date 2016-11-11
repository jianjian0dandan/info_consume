function viewinfo_weibo() {
	this.ajax_method = 'GET';
}
viewinfo_weibo.prototype = {
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
          console.log(personalData.nick_name);
      }
  }else{
      nickName.innerHTML = "无此数据";
  }
   
   // var nickName_greet = document.getElementById('username_greet');
   //   nickName_greet.innerHTML = personalData.nick_name;
        
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
       var Fansum = document.getElementById('fansumview');
   if( personalData.fansnum==""){
       personalData.fansnum = "暂无数据";
   }
       Fansum.innerHTML = personalData.fansnum;

   var Attentionsum = document.getElementById('attentionsumview');
   if( personalData.friendsnum==""){
       personalData.friendsnum = "暂无数据";
   }
       Attentionsum.innerHTML = personalData.friendsnum;

  var Focusum = document.getElementById('focusum');
  if( personalData.favoritesnum==""){
      personalData.favoritesnum = "暂无数据";
  }
      Focusum.innerHTML = personalData.favoritesnum;

   var Weibosum = document.getElementById('weibosumview');
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
       }else if (personalData.description.length>20){
         console.log("+personalData.description="+personalData.description.length);
       Descrip.innerHTML = personalData.description.substr(0,9)+'...';
           Descrip.title = personalData.description;
      }else{
        console.log("+personalData.description="+personalData.description.length);
       Descrip.innerHTML = personalData.description;}
           // var homepage = document.getElementById('uhome');
           // if(!personalData.uid ){
           //     homepage.innerHTML = "无此数据";
           // }else{
           //     homepage.innerHTML = '<a id="openurl" style="cursor:pointer" onclick="openurl();">http://weibo.com/u/'+personalData.uid;
           // }  

   },
   
   weiboData:function(data){
     weiboData = data;
   	DrawWeibo(data,'group_influ_weibo', 'group_influ_weibo_result');
       $('#per_onload').css('display','none');
       $('#group_influ_weibo').css('display', 'block');
   }
}

var Personal = new viewinfo_weibo();
var personalData; // global data
var weiboData;
// console.log("weibo"+uid);
function openurl(){
  var ourl = $('#openurl').text();
  window.open(ourl);
 }

$(function(){
	$('#modechoose').click(function(){
	var box = document.getElementsByName('mode_choose');
  //console.log(box);
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
  //console.log(weiboData);
	});
});

function DrawWeibo(data, div_name, sub_div_name){
    page_num = 5;
    if (data.length < page_num) {
       // console.log('data_length', data.length);
        $('#'+ div_name + ' #pageGro .pageUp').css('display', 'none');
        $('#'+ div_name + ' #pageGro .pageList').css('display', 'none'); 
        $('#'+ div_name + ' #pageGro .pageDown').css('display', 'none'); 
        if (data.length == 0) {
            $('#' + sub_div_name).empty();
            $('#' + sub_div_name).append('暂无数据');
            $('#' + sub_div_name).css('height','300px');
        }else{
            $('#'+ div_name + ' #pageGro').css('display', 'block');
            page_num = data.length
            page_group_influ_weibo( 0, page_num, data, sub_div_name);
        }
    }else {
          $('#'+ div_name + ' #pageGro').css('display', 'block');
          page_group_influ_weibo( 0, page_num, data, sub_div_name);
          var total_pages = 0;
          if (data.length % page_num == 0) {
              total_pages = data.length / page_num;
          }
          else {
              total_pages = Math.round(data.length / page_num) + 1;
          }
        }
    var pageCount = total_pages;
    
    if(pageCount>5){
        page_icon(1,5,0, div_name);
    }else{
        page_icon(1,pageCount,0, div_name);
    }
    
    $("#"+div_name+" #pageGro").on("click","li", function(){
        if(pageCount > 5){
            var pageNum = parseInt($(this).html());
            pageGroup(pageNum,pageCount);
        }else{
            $(this).addClass("on");
            $(this).siblings("li").removeClass("on");
        }

      page = parseInt($("#"+div_name+" #pageGro li.on").html())  
      //console.log('page', page);         
      start_row = (page - 1)* page_num;
      end_row = start_row + page_num;
      if (end_row > data.length)
          end_row = data.length;
        // console.log('start', start_row);
        // console.log('end', end_row);
        // console.log('data',data);
        page_group_influ_weibo(start_row,end_row,data, sub_div_name);
    });

    $("#"+div_name+" #pageGro .pageUp").off('click').click(function(){
        if(pageCount > 5){
            var pageNum = parseInt($("#"+div_name+" #pageGro li.on").html());
            pageUp(pageNum,pageCount);
        }else{
            var index = $("#"+div_name+" #pageGro ul li.on").index();
            if(index > 0){
                $("#"+div_name+" #pageGro li").removeClass("on");
                $("#"+div_name+" #pageGro ul li").eq(index-1).addClass("on");
            }
        }
      page = parseInt($("#"+div_name+" #pageGro li.on").html())  
      //console.log(page);
      start_row = (page-1)* page_num;
      end_row = start_row + page_num;
      if (end_row > data.length){
          end_row = data.length;
      }
        page_group_influ_weibo(start_row,end_row,data, sub_div_name);
    });
	
	$("#" + div_name + " #pageGro .pageDown").off('click').click(function(){
        if(pageCount > 5){
            var pageNum = parseInt($("#"+div_name+" #pageGro li.on").html());
            pageDown(pageNum,pageCount);
        }else{
            var index = $("#"+div_name+" #pageGro ul li.on").index();
            if(index+1 < pageCount){
                $("#"+div_name+" #pageGro li").removeClass("on");
                $("#"+div_name+" #pageGro ul li").eq(index+1).addClass("on");
            }
        }
      page = parseInt($("#"+div_name+" #pageGro li.on").html()) 
      //console.log(page);
      start_row = (page-1)* page_num;
      end_row = start_row + page_num;
      if (end_row > data.length){
          end_row = data.length;
      }
        page_group_influ_weibo(start_row,end_row,data, sub_div_name);
    });

}

function pageGroup(pageNum,pageCount){
  switch(pageNum){
    case 1:
      page_icon(1,5,0);
    break;
    case 2:
      page_icon(1,5,1);
    break;
    case pageCount-1:
      page_icon(pageCount-4,pageCount,3);
    break;
    case pageCount:
      page_icon(pageCount-4,pageCount,4);
    break;
    default:
      page_icon(pageNum-2,pageNum+2,2);
    break;
  }
}

function pageUp(pageNum,pageCount){
  switch(pageNum){
    case 1:
    break;
    case 2:
      page_icon(1,5,0);
    break;
    case pageCount-1:
      page_icon(pageCount-4,pageCount,2);
    break;
    case pageCount:
      page_icon(pageCount-4,pageCount,3);
    break;
    default:
      page_icon(pageNum-2,pageNum+2,1);
    break;
  }
}


function pageDown(pageNum,pageCount){
  switch(pageNum){
    case 1:
      page_icon(1,5,1);
    break;
    case 2:
      page_icon(1,5,2);
    break;
    case pageCount-1:
      page_icon(pageCount-4,pageCount,4);
    break;
    case pageCount:
    break;
    default:
      page_icon(pageNum-2,pageNum+2,3);
    break;
  }
}

function page_icon(page,count,eq){
	var ul_html = "";
	for(var i=page; i<=count; i++){
		ul_html += "<li>"+i+"</li>";
	}
	$("#pageGro ul").html(ul_html);
	$("#pageGro ul li").eq(eq).addClass("on");
}

function page_group_influ_weibo(start_row,end_row,data, sub_div_name){
    weibo_num = end_row - start_row;
    $('#'+ sub_div_name).empty();
    //console.log(data);
    var html = "";
    html += '<div class="group_weibo_font" style="margin-right:5px;margin-top:15px;">';
    for (var i = start_row; i < end_row; i += 1){
        s=(i+1).toString();
		var mid = data[i][0];
		var uid = data[i][1];
        var geo = data[i][4];
        var text = data[i][2];
		var retweet_count = data[i][7];
		var comment_count = data[i][8];
    //console.log(retweet_count);
   // console.log(comment_count);
    // var mingan_count = data[i][9];
        //var location = data[i][2];
        var date = data[i][6];
        var tweet_ulr = data[i][10];
        //date = new Date(parseInt(timestamp)*1000).format("yyyy-MM-dd hh:mm:ss");
        if (i%2 ==0){
            html += '<div style="float:left;padding:5px;width: 95%;background:whitesmoke;">';
    }
        else{
            html += '<div style="float:left;padding:5px;width: 95%;">';
    }
    if(geo==null){
        geo='未知';
    }
            html += '</a>('+geo+')&nbsp;&nbsp;微博:<font color=black>' + text + '</font></p>';    
            //html += '<p style="margin-left:10px;">'+s+'、昵称：<a target="_blank" href="/index/personal/?uid=' + uid + '">' + Pname + '</a>&nbsp;&nbsp;发布:<font color=black>' + text + '</font></p>';    
            html += '<p style="float:left;width:100%;margin-top:-5px;margin-left:10px;">';
            html += '<span style="float:right;padding-right: 10px;color:#858585"><span>转发数('+ retweet_count +')&nbsp;&nbsp;|&nbsp;&nbsp;</span><span>评论数('+ comment_count +')</span></span>';
            html += '<span style="float:left"><u>'+date+'</u> - <a color:#e0e0e0 target="_blank"  href="'+tweet_ulr+'">' + '微博' + '</a>-<a target="_blank" href="/index/personal_detail/?uid=' + uid + '">用户详情</a></span>';
            html += '</p>';
			html += '</div>';
        
    }
    html += '</div>'; 
    $('#'+sub_div_name).append(html);
}

var url_pro = "/attribute/new_user_profile/?uid=" + uid;
Personal.call_sync_ajax_request(url_pro, Personal.ajax_method, Personal.personData);

var url_weibo = "/attribute/new_user_weibo/?uid="+uid+"&sort_type=timestamp";
Personal.call_sync_ajax_request(url_weibo, Personal.ajax_method, Personal.weiboData);



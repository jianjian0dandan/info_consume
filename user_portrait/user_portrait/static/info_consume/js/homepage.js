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
	});
   }

  function LoadFunction()
  {
	$("#accoun").html('正在努力的加载中....');
  }

  function error()
  { 
	alert("error");
  }
  function callback(data)
  { 


  }
}
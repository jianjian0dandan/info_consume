 function weiborecommend() 
 {
	//this.ajax_method='GET';	// body...
}

weiborecommend.prototype=
{
	call_sync_ajax_request:function(url,callback) 
	{
		
		$.ajax({
			url:url,
			type:'GET',
			dataType:'json',
			async:true,
			success:callback
		});
	}

} 

	function callback(data)
	{
		console.log(data);

		document.getElementById("hot_text_one")
		// if(data.length>0)
		// {
		// 	alert('操作成功！');
	 //    //刷新
		// 	window.location.href=window.location.href;
		// }
			//window.location.href=window.location.href;	
	}

var weiborecommend=new weiborecommend();

function get_hot_text(){
	url = '/social_sensing/get_text_detail/'
	weiborecommend.call_sync_ajax_request(url,callback);
}
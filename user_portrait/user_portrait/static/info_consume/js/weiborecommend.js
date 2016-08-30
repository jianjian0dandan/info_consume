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
			success:callback,
			beforeSend:LoadFunction,
			error:erryFunction
		});
	},

	weibo_hashtag:function(data)
	{

	}

} 
	function LoadFunction()
	{
		$("#hot_one").html('正在努力的加载中....');
	}

	function erryFunction()
	{
		alert("error");

	}

	//0:uid  1:media  2:photo_url  3:text 4:情绪 5:time  6:gro  
	//7：文本类型（1为原创微博）8:转发  9:评论 10：情绪 
	//11：时间戳  12：敏感度 13：mid
	function callback(data)
	{		
		var value=eval(data);		
		console.log(value[1]);
		var i;
		for (i=0;i<5;i++) 
		{
			switch(i)
			{	//写第一个热门事件的信息
				case 0:				
					$('#hot_one_text').append(value[i][0][3]);
					$('#hot_one_media').append(value[i][0][1]);	
					$('#hot_one_time').append(value[i][0][5]);					
					break;
				//写第二个热门事件
				case 1:
					$('#hot_two_text').append(value[i][0][3]);
					$('#hot_two_media').append(value[i][0][1]);	
					$('#hot_two_time').append(value[i][0][5]);						
					break;
				//写第三个热门事件
				case 2:
					$('#hot_three_text').append(value[i][0][3]);
					$('#hot_three_media').append(value[i][0][1]);	
					$('#hot_three_time').append(value[i][0][5]);							
					break;
				//写第四个热门事件
				case 3:
					$('#hot_four_text').append(value[i][0][3]);
					$('#hot_four_media').append(value[i][0][1]);	
					$('#hot_four_time').append(value[i][0][5]);			
					break;
				//写第五个热门事件
				case 4:
					$('#hot_five_text').append(value[i][0][3]);
					$('#hot_five_media').append(value[i][0][1]);	
					$('#hot_five_time').append(value[i][0][5]);	
					break;
			}
		}

	}

var weiborecommend=new weiborecommend();

function get_hot_text(){

	url = '/social_sensing/get_text_detail/';
	weiborecommend.call_sync_ajax_request(url,callback);
}

function get_weibo_hashtag(){

	url = '/weibo_hashtag/get_weibo_hashtag/';
	weiborecommend.call_sync_ajax_request(url,weiborecommend.weibo_hashtag);
}



get_hot_text();
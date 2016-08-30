 function weiborecommend() 
 {
	//this.ajax_method='GET';	// body...
 }
weiborecommend.prototype=
{
	call_sync_ajax_request:function(url,callback) 
	{
		
		$.ajax({
		      url: url,
		      type: 'GET',
		      dataType: 'json',
		      async: true,
		      success:callback
    	});
	},

	weibo_hashtag:function(data)
	{
		var hashtag=eval(data);
		console.log(hashtag[0][0]);
		console.log(hashtag[1][0]);
		console.log(hashtag[2][0]);
		console.log(hashtag[3][0]);
		console.log(hashtag[4][0]);
		console.log(hashtag[5][0]);
		console.log(hashtag[6][0]);
		console.log(hashtag[7][0]);
		console.log(hashtag[8][0]);
		console.log(hashtag[9][0]);
		console.log(hashtag[10][0]);
		console.log(hashtag[11][0]);
		console.log(hashtag[12][0]);
		console.log(hashtag[13][0]);
		console.log(hashtag[14][0]);
		console.log(hashtag[15][0]);
		console.log(hashtag[16][0]);
		console.log(hashtag[17][0]);
		console.log(hashtag[18][0]);
		console.log(hashtag[19][0]);

		//限制打印20个hashtag
		$('#hashone').append(hashtag[0][0]);				
		$('#hashtwo').append(hashtag[1][0]);
		$('#hashthree').append(hashtag[2][0]);			
		$('#hashfour').append(hashtag[3][0]);
		$('#hashfive').append(hashtag[4][0]);
		$('#hashsix').append(hashtag[5][0]);
		$('#hashseven').append(hashtag[6][0]);
		$('#hasheight').append(hashtag[7][0]);
		$('#hashnine').append(hashtag[8][0]);
		$('#hashten').append(hashtag[9][0]);
		$('#hasheleven').append(hashtag[10][0]);
		$('#hashtwlve').append(hashtag[11][0]);
		$('#hashthirteen').append(hashtag[12][0]);
		$('#hashfourteen').append(hashtag[13][0]);
		$('#hashfifteen').append(hashtag[14][0]);
		$('#hashsixteen').append(hashtag[15][0]);
		$('#hashseventeen').append(hashtag[16][0]);
		$('#hasheighteen').append(hashtag[17][0]);
		$('#hashnineteen').append(hashtag[18][0]);
		$('#hashtwenty').append(hashtag[19][0]);		
		}

// '<span style="margin-left:10px;margin-right:20px;">'+item[i]+'</span> ';
	
} 
  //   function randomColor( )
  //   {  
  //   	var rand = Math.floor(Math.random( ) * 0xFFFFFF).toString(16);  
  //   	if(rand.length == 6)
	 //    {  
	 //        return rand;  
		// }
		// else
		// {  
  //       	return randomColor();
  //       }  
  //   }
	
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
get_weibo_hashtag();
function weiborecommend() {
	//this.ajax_method='GET';	// body...
}
weiborecommend.prototype= {
	call_sync_ajax_request:function(url,callback) {
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			async: true,
			success:callback
		});
	},

	weibo_hashtag:function(data) {
		var hashtag=eval(data);
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
		},
	key_recommend:function(data)
	{
		var value=eval(data);
		//将推荐的内容拆分成单个词语
		//console.log(value)
		// for(var i=0;i<5;i++)
		// {
		// console.log(value[0][0][8])
		var keyword1=value[0][0][8];
		//第一条热门微博的关键词推荐
		// }
		for(var i=0;i<keyword1.length;i++)
		{
			var html ='';
			var key1=keyword1[i][0];
			// 	 window.open("/index/date_index/?topic_name="+topic_name);
			// '<a href="/index/viewinformation/?uid='+data[i]['uid']+'">'

			html+='<a href="/index/date_index/?topic_name='+key1+'">'+keyword1[i][0]+'</a>                 ';
			$('#keyword_recommend1').append(html);
		}

		var keyword2=value[1][0][8];
		// console.log(keyword2)
		// }
		for(var i=0;i<keyword2.length;i++)
		{
			var html ='';
			var key2=keyword2[i][0];
			html+='<a href="/index/date_index/?topic_name='+key2+'">'+keyword2[i][0]+'</a>                 ';
			$('#keyword_recommend2').append(html);
		}

		var keyword3=value[2][0][8];
		// console.log(keyword3)
		// }
		for(var i=0;i<keyword3.length;i++)
		{
			var html ='';
			var key3=keyword3[i][0];
			html+='<a href="/index/date_index/?topic_name='+key3+'">'+keyword3[i][0]+'</a>                 ';
			$('#keyword_recommend3').append(html);
		}

		var keyword4=value[3][0][8];
		// console.log(keyword4)
		// }
		for(var i=0;i<keyword4.length;i++)
		{
			var html ='';
			var key4=keyword4[i][0];
			html+='<a href="/index/date_index/?topic_name='+key4+'">'+keyword4[i][0]+'</a>                 ';
			$('#keyword_recommend4').append(html);
		}

		var keyword5=value[4][0][8];
		// console.log(keyword5)
		// }
		for(var i=0;i<keyword5.length;i++)
		{
			var html ='';
			var key5=keyword5[i][0];
			html+='<a href="/index/date_index/?topic_name='+key5+'">'+keyword5[i][0]+'</a>                 ';
			$('#keyword_recommend5').append(html);
		}
	}
}
	//0:uid  1:media  2:photo_url  3:text 4:情绪 5:time  6:gro
	//7：文本类型（1为原创微博）8:转发  9:评论 10：情绪
	//11：时间戳  12：敏感度 13：mid
	function callback(data)
	{


		var value=eval(data);


		// console.log(value);
		var i;
		for (i=0;i<5;i++)
		{
			switch(i)
			{	//写第一个热门事件的信息
				case 0:
					//媒体头像
					var imgone=document.getElementById('hot_one_img');
					if (value[i][0][2]=="")
					{
						imgone.src="/static/info_consume/image/media_img.png";
					}
					else
					{
						imgone.src=value[i][0][2];
					}

					//微博内容
					$('#hot_one_text').append(value[i][0][3]);
					//标题里面的媒体名称和时间
					$('#hot_one_media').append(value[i][0][1]);
					$('#hot_one_time').append(value[i][0][5]);
					//转发数和评论数
					$('#hot_one_zhuanfa').append(value[i][0][9]);
					$('#hot_one_pinglun').append(value[i][0][10]);
					// $('#keyword_recommend').append(value[i][0][8]);

					break;
				//写第二个热门事件
				case 1:
					var imgone=document.getElementById('hot_two_img');
					if (value[i][0][2]=="")
					{
						imgone.src="/static/info_consume/image/media_img.png";
					}
					else
					{
						imgone.src=value[i][0][2];
					}
					//将推荐的内容拆分成单个词语
					// var keyword=value[i][0][8].split('&');
					// for(var i=0;i<keyword.length;i++)
					// {
					// 	var html ='';
					// 	html+='<a href="/index/date_index">'+keyword[i]+'</a>                 ';
					// 	// html+='<span class="label label-success"><a>'+keyword[i]+'</a></span>            ';
					// 	// html+='+&amp;nbsp'
					// 	// console.log(keyword[i])
					// 	$('#keyword_recommend2').append(html);
					// }
					//微博内容
					$('#hot_two_text').append(value[i][0][3]);
					//标题里面的媒体名称和时间
					$('#hot_two_media').append(value[i][0][1]);
					$('#hot_two_time').append(value[i][0][5]);
					//转发数和评论数
					$('#hot_two_zhuanfa').append(value[i][0][9]);
					$('#hot_two_pinglun').append(value[i][0][10]);
					// var imgtwo=document.getElementById('hot_two_img');
					// if (value[i][0][2]=="")
					// {
					// 	imgtwo.src="/static/info_consume/image/media_img.png";
					// }
					// else
					// {
					// 	imgtwo.src=value[i][0][2];
					// }
					// $('#hot_two_text').append(value[i][0][3]);
					// $('#hot_two_media').append(value[i][0][1]);
					// $('#hot_two_time').append(value[i][0][5]);
					// $('#hot_two_zhuanfa').append(value[i][0][9]);
					// $('#hot_two_pinglun').append(value[i][0][10]);
					break;
				//写第三个热门事件
				case 2:
					var imgthree=document.getElementById('hot_three_img');
					if (value[i][0][2]=="")
					{
						imgthree.src="/static/info_consume/image/media_img.png";
					}
					else
					{
						imgthree.src=value[i][0][2];
					}
					$('#hot_three_text').append(value[i][0][3]);
					$('#hot_three_media').append(value[i][0][1]);
					$('#hot_three_time').append(value[i][0][5]);
					$('#hot_three_zhuanfa').append(value[i][0][9]);
					$('#hot_three_pinglun').append(value[i][0][10]);
					break;
				//写第四个热门事件
				case 3:
					var imgfour=document.getElementById('hot_four_img');
					if (value[i][0][2]=="")
					{
						imgfour.src="/static/info_consume/image/media_img.png";
					}
					else
					{
						imgfour.src=value[i][0][2];
					}
					$('#hot_four_text').append(value[i][0][3]);
					$('#hot_four_media').append(value[i][0][1]);
					$('#hot_four_time').append(value[i][0][5]);
					$('#hot_four_zhuanfa').append(value[i][0][9]);
					$('#hot_four_pinglun').append(value[i][0][10]);
					break;
				//写第五个热门事件
				case 4:
					var imgfive=document.getElementById('hot_five_img');
					if (value[i][0][2]=="")
					{
						imgfive.src="/static/info_consume/image/media_img.png";
					}
					else
					{
						imgfive.src=value[i][0][2];
					}
					$('#hot_five_text').append(value[i][0][3]);
					$('#hot_five_media').append(value[i][0][1]);
					$('#hot_five_time').append(value[i][0][5]);
					$('#hot_five_zhuanfa').append(value[i][0][9]);
					$('#hot_five_pinglun').append(value[i][0][10]);
					break;
			}

		}

		var keyword3=value[2][0][8];
		// console.log(keyword3)
		// }
		for(var i=0;i<keyword3.length;i++) {
			var html ='';
			var key3=keyword3[i][0];
			html+='<a href="/index/date_index/?topic_name='+key3+'">'+keyword3[i][0]+'</a>';
			$('#keyword_recommend3').append(html);
		}

		var keyword4=value[3][0][8];
		// console.log(keyword4)
		// }
		for(var i=0;i<keyword4.length;i++) {
			var html ='';
			var key4=keyword4[i][0];
			html+='<a href="/index/date_index/?topic_name='+key4+'">'+keyword4[i][0]+'</a>';
			$('#keyword_recommend4').append(html);
		}
		var keyword5=value[4][0][8];
		// console.log(keyword5)
		// }
		for(var i=0;i<keyword5.length;i++) {
			var html ='';
			var key5=keyword5[i][0];
			html+='<a href="/index/date_index/?topic_name='+key5+'">'+keyword5[i][0]+'</a>';
			$('#keyword_recommend5').append(html);
		}
	}

//0:uid  1:media  2:photo_url  3:text 4:情绪 5:time  6:gro
//7：文本类型（1为原创微博）8:转发  9:评论 10：情绪
//11：时间戳  12：敏感度 13：mid
function callback(data) {
	var value=eval(data);
	// console.log(value);
	var i;
	for (i=0;i<5;i++) {
		switch(i) {	//写第一个热门事件的信息
			case 0:
				//媒体头像
				var imgone=document.getElementById('hot_one_img');
				if (value[i][0][2]=="") {
					imgone.src="/static/info_consume/image/media_img.png";
				} else {
					imgone.src=value[i][0][2];
				}
				//微博内容
				$('#hot_one_text').append(value[i][0][3]);
				//标题里面的媒体名称和时间
				$('#hot_one_media').append(value[i][0][1]);
				$('#hot_one_time').append(value[i][0][5]);
				//转发数和评论数
				$('#hot_one_zhuanfa').append(value[i][0][9]);
				$('#hot_one_pinglun').append(value[i][0][10]);
				// $('#keyword_recommend').append(value[i][0][8]);
				break;
			//写第二个热门事件
			case 1:
				var imgone=document.getElementById('hot_two_img');
				if (value[i][0][2]=="") {
					imgone.src="/static/info_consume/image/media_img.png";
				} else {
					imgone.src=value[i][0][2];
				}
				//将推荐的内容拆分成单个词语
				// var keyword=value[i][0][8].split('&');
				// for(var i=0;i<keyword.length;i++)
				// {
				// 	var html ='';
				// 	html+='<a href="/index/date_index">'+keyword[i]+'</a>                 ';
				// 	// html+='<span class="label label-success"><a>'+keyword[i]+'</a></span>            ';
				// 	// html+='+&amp;nbsp'
				// 	// console.log(keyword[i])
				// 	$('#keyword_recommend2').append(html);
				// }
				//微博内容
				$('#hot_two_text').append(value[i][0][3]);
				//标题里面的媒体名称和时间
				$('#hot_two_media').append(value[i][0][1]);
				$('#hot_two_time').append(value[i][0][5]);
				//转发数和评论数
				$('#hot_two_zhuanfa').append(value[i][0][9]);
				$('#hot_two_pinglun').append(value[i][0][10]);
				// var imgtwo=document.getElementById('hot_two_img');
				// if (value[i][0][2]=="")
				// {
				// 	imgtwo.src="/static/info_consume/image/media_img.png";
				// }
				// else
				// {
				// 	imgtwo.src=value[i][0][2];
				// }
				// $('#hot_two_text').append(value[i][0][3]);
				// $('#hot_two_media').append(value[i][0][1]);
				// $('#hot_two_time').append(value[i][0][5]);
				// $('#hot_two_zhuanfa').append(value[i][0][9]);
				// $('#hot_two_pinglun').append(value[i][0][10]);
				break;
			//写第三个热门事件
			case 2:
				var imgthree=document.getElementById('hot_three_img');
				if (value[i][0][2]=="") {
					imgthree.src="/static/info_consume/image/media_img.png";
				} else {
					imgthree.src=value[i][0][2];
				}
				$('#hot_three_text').append(value[i][0][3]);
				$('#hot_three_media').append(value[i][0][1]);
				$('#hot_three_time').append(value[i][0][5]);
				$('#hot_three_zhuanfa').append(value[i][0][9]);
				$('#hot_three_pinglun').append(value[i][0][10]);
				break;
			//写第四个热门事件
			case 3:
				var imgfour=document.getElementById('hot_four_img');
				if (value[i][0][2]=="") {
					imgfour.src="/static/info_consume/image/media_img.png";
				} else {
					imgfour.src=value[i][0][2];
				}
				$('#hot_four_text').append(value[i][0][3]);
				$('#hot_four_media').append(value[i][0][1]);
				$('#hot_four_time').append(value[i][0][5]);
				$('#hot_four_zhuanfa').append(value[i][0][9]);
				$('#hot_four_pinglun').append(value[i][0][10]);
				break;
			//写第五个热门事件
			case 4:
				var imgfive=document.getElementById('hot_five_img');
				if (value[i][0][2]=="") {
					imgfive.src="/static/info_consume/image/media_img.png";
				} else {
					imgfive.src=value[i][0][2];
				}
				$('#hot_five_text').append(value[i][0][3]);
				$('#hot_five_media').append(value[i][0][1]);
				$('#hot_five_time').append(value[i][0][5]);
				$('#hot_five_zhuanfa').append(value[i][0][9]);
				$('#hot_five_pinglun').append(value[i][0][10]);
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

function get_keyword_recommend() {
	url = '/social_sensing/get_text_detail/';
	weiborecommend.call_sync_ajax_request(url,weiborecommend.key_recommend);
}

get_hot_text();
get_weibo_hashtag();
get_keyword_recommend();
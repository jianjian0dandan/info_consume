//关键词词云;id=keyword-cloud
function Draw_keyword_cloud(data,div_name){
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
var keyword = [];
var html = '';
if(data.length == 0){
        html = '<h4 style="text-align:center;height:300px;">暂无数据</h4>';
        $('#'+ div_name).append(html);
}else{
var word_num = Math.min(20, data.length);

        for (i=0;i<word_num;i++){
            var word = {};
            word['name'] = data[i][0];
            word['value'] =data[i][1]*100;
            word['itemStyle'] = createRandomItemStyle();
            keyword.push(word);
        }

        var myChart = echarts.init(document.getElementById(div_name)); 
        var option = {
            tooltip: {
                show: true,
                formatter:  function (params,ticket,callback){
                    var res  = '';
                    var value_after = params.value/100;
                    res += '关键词：'+params.name+'<br/>'+'词频：'+value_after.toFixed(2);
                    return res;
                }
            },
            series: [{
                type: 'wordCloud',
                size: ['100%', '100%'],
                textRotation : [0, 45, 90, -45],
                textPadding: 0,
                autoSize: {
                    enable: true,
                    minSize: 14
                },
                data: keyword
            }]
        };
        myChart.setOption(option);  
}
}   

function Draw_preference_weibo(data){


} 
function Draw_preference_page(data){
       Draw_keyword_cloud(data.keywords,'keyword-cloud');
       Draw_keyword_cloud(data.hashtag,'topic-cloud');
       Draw_preference_weibo(data)
} 

 var preference_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=preference';
 call_sync_ajax_request(preference_url,'GET',Draw_preference_page);

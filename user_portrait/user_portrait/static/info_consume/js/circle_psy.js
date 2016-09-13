function  Draw_sentiment_pie(data){
var myChart = echarts.init(document.getElementById('senti-pie'),'shine');
// var dataStyle = {
//     normal: {
//         label: {show:false},
//         labelLine: {show:false},
//         tooltip: {show:false}
//     }
// };
// var placeHolderStyle = {
//     normal : {
//         color: 'rgba(0,0,0,0)',
//         label: {show:false},
//         labelLine: {show:false}
//     },
//     emphasis : {
//         color: 'rgba(0,0,0,0)'
//     }
// };
// option = {
//     title: {
//         text: '你快乐吗？',
//         subtext: 'From ExcelHome',
//         sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
//         x: 'center',
//         y: 'center',
//         itemGap: 20,
//         textStyle : {
//             color : 'rgba(30,144,255,0.8)',
//             fontFamily : '微软雅黑',
//             fontSize : 35,
//             fontWeight : 'bolder'
//         }
//     },
//     tooltip : {
//         show: true,
//         formatter: "{a} <br/>{b} : {c} ({d}%)"
//     },
//     legend: {
//         orient : 'vertical',
//         x : document.getElementById('senti-pie').offsetWidth / 2,
//         y : 45,
//         itemGap:12,
//         data:['68%的人表示过的不错','29%的人表示生活压力很大','3%的人表示“我姓曾”']
//     },
//     toolbox: {
//         show : true,
//         feature : {
//             mark : {show: true},
//             dataView : {show: true, readOnly: false},
//             restore : {show: true},
//             saveAsImage : {show: true}
//         }
//     },
//     series : [
//         {
//             name:'1',
//             type:'pie',
//             clockWise:false,
//             radius : [125, 150],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:68,
//                     name:'68%的人表示过的不错'
//                 },
//                 {
//                     value:32,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
//         },
//         {
//             name:'2',
//             type:'pie',
//             clockWise:false,
//             radius : [100, 125],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:29, 
//                     name:'29%的人表示生活压力很大'
//                 },
//                 {
//                     value:71,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
//         },
//         {
//             name:'3',
//             type:'pie',
//             clockWise:false,
//             radius : [75, 100],
//             itemStyle : dataStyle,
//             data:[
//                 {
//                     value:3, 
//                     name:'3%的人表示“我姓曾”'
//                 },
//                 {
//                     value:97,
//                     name:'invisible',
//                     itemStyle : placeHolderStyle
//                 }
//             ]
//         }
//     ]
// };

 myChart.setOption(option);
}

function Draw_psy_page(data){
       Draw_sentiment_pie(data.social_in_record);
} 

 var social_url = '/info_group/show_group_result/?task_name='+g_name+'&submit_user='+s_user+'&module=think';
 call_sync_ajax_request(social_url,'GET',Draw_psy_page);
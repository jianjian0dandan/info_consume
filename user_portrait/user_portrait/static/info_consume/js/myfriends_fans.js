/**
 * Created by Administrator on 2016/12/5.
 */
function fans() {
    //this.ajax_method='GET'; // body...
}
fans.prototype= {
    call_request:function(url,callback) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:callback,
        });
    },
}
function friendfans(data) {
    //console.log(data);
    $('#tb_departments').bootstrapTable({
        //url: influ_url,
        data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 10,//单页记录数
        pageList: [5, 10, 20, 50],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "right",
        searchOnEnterKey: false,//回车搜索
        showRefresh: true,//刷新按钮
        showColumns: true,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:true,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "全选",
                field: "select",
                checkbox: true,
                align: "center",//水平
                valign: "middle"//垂直
            },
            {
                title: "粉丝排名",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return index+1;
                }
            },
            {
                title: "粉丝头像",//标题
                field: "photo_url",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value,row) {
                    if (value==''||value=='unknown'){
                        return '<img style="margin: 0 auto" src="../../static/info_consume/image/haha.png">';
                    }else {
                        return '<img style="margin: 0 auto" src="'+value+'">';
                    }
                }
            },
            {
                title: "粉丝ID",//标题
                field: "uid",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "粉丝昵称",
                field: "uname",
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value,row) {
                    if (value==' '||value=='未知'){
                        value=row.uid;
                    }
                    return value;
                }
            },
            {
                title: "好友数",
                field: "friendsnum",
                sortable: true,
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value) {
                    if (value==''){
                        value='-';
                    }
                    return value;
                }
            },
            {
                title: "粉丝数",
                field: "fansnum",
                sortable: true,
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value) {
                    if (value==''){
                        value='-';
                    }
                    return value;
                }
            },
            {
                title: "微博数",
                field: "weibo_count",
                sortable: true,
                align: "center",//水平
                valign: "middle",//垂直
                visible: false
            },
            {
                title: "交互次数",
                field: "count",
                sortable: true,
                align: "center",//水平
                valign: "middle",//垂直

            },]
    });

}

var uid = 2029036025;

var fans=new fans();
function nums() {
    var url = '/info_person_social/get_fans/?uid='+uid;
    fans.call_request(url,friendfans);
}
nums();
// console.log(data);
// for (var i=0;i<data.length;i++){
//     console.log(data[i].count);
//     var content ='<tr>';
//     //头像
//     if (data[i].photo_url==''||data[i].photo_url=='unknown'){
//         content+='<td style="text-align: center">'+data[i].uid+'</td><td style="text-align: center"><img ' +
//             'style="width:20px;height: 20px;display: inline-block;margin-right: 10px;" src="../../static/info_consume/image/haha.png">';
//     }else {
//         content+='<td style="text-align: center">'+data[i].uid+'</td><td style="text-align: center"><img ' +
//             'style="width:20px;height: 20px;display: inline-block;margin-right: 10px;" src="'+data[i].photo_url+'">';
//     }
//     //用户名昵称
//     if (data[i].uname==''||data[i].uname=='未知'){
//         content+=data[i].uid+'</td>';
//     }else {
//         content+=data[i].uname+'</td>';
//     }
//     //好友数
//     if (data[i].friendsnum==''){
//         content+='<td style="text-align: center">-</td>';
//     }else {
//         content+='<td style="text-align: center">'+data[i].friendsnum+'</td>';
//     }
//     //粉丝数
//     if (data[i].fansnum==''){
//         content+='<td style="text-align: center">-</td>';
//     }else {
//         content+='<td style="text-align: center">'+data[i].fansnum+'</td>';
//     }
//     //微博数
//     if (data[i].weibo_count==''){
//         content+='<td style="text-align: center">-</td>';
//     }else {
//         content+='<td style="text-align: center">'+data[i].weibo_count+'</td>';
//     }
//     //互动次数
//     if (data[i].count==''){
//         content+='<td style="text-align: center">-</td>';
//     }else {
//         content+='<td style="text-align: center">'+data[i].count+'</td>';
//     }
//     content+='</tr>';
//
//     $('#fansnum').append(content);
//
// }


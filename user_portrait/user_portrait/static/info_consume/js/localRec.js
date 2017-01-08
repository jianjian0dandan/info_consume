

function homepageinfo() {
    this.ajax_method = 'GET';
}

homepageinfo.prototype = {
    call_sync_ajax_request: function (url, method, callback) {
        $.ajax({
            url: url,
            type: method,
            dataType: 'json',
            async: true,
            success: callback
        });
    },
    // 微博数据
    localWeiBoData: function (data) {
        localWeiBoData = data;
        DrowLocalWeiBo(data, 'local_rec', 'local_rec_result');
        $('#per_onload2').css('display', 'none');
        $('#local_rec').css('display', 'block');
    }
}

var Personal = new homepageinfo();
var localWeiBoData;
var uid = 1640601392;


var url = "/attribute/localRec/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.localWeiBoData);
//console.log("运行微博数据");
function DrowLocalWeiBo(data, div_name, sub_div_name) {
    page_num = 5;
    if (data.length < page_num) {
        console.log('data_length', data.length);
        $('#' + div_name + ' #pageGro2 .pageUp').css('display', 'none');
        $('#' + div_name + ' #pageGro2 .pageList').css('display', 'none');
        $('#' + div_name + ' #pageGro2 .pageDown').css('display', 'none');
        if (data.length == 0) {
            $('#' + sub_div_name).empty();
            $('#' + sub_div_name).append('暂无数据');
            $('#' + sub_div_name).css('height', '300px');
        } else {
            $('#' + div_name + ' #pageGro2_local').css('display', 'block');
            page_num = data.length
            page_ads_weibo(0, page_num, data, sub_div_name);
        }
    } else {
        $('#' + div_name + ' #pageGro2').css('display', 'block');
        page_ads_weibo(0, page_num, data, sub_div_name);
        var total_pages = 0;
        if (data.length % page_num == 0) {
            total_pages = data.length / page_num;
        }
        else {
            total_pages = Math.round(data.length / page_num) + 1;
        }
    }
    var pageCount = total_pages;

    if (pageCount > 5) {
        page_icon(1, 5, 0, div_name);
    } else {
        page_icon(1, pageCount, 0, div_name);
    }

    $("#" + div_name + " #pageGro2").on("click", "li", function () {
        if (pageCount > 5) {
            var pageNum = parseInt($(this).html());
            pageGro2up(pageNum, pageCount);
        } else {
            $(this).addClass("on");
            $(this).siblings("li").removeClass("on");
        }
        page = parseInt($("#" + div_name + " #pageGro2 li.on").html())
        //console.log('page', page);
        start_row = (page - 1) * page_num;
        end_row = start_row + page_num;
        if (end_row > data.length)
            end_row = data.length;
        // console.log('start', start_row);
        // console.log('end', end_row);
        // console.log('data',data);
        page_ads_weibo(start_row, end_row, data, sub_div_name);
    });

    $("#" + div_name + " #pageGro2 .pageUp").off('click').click(function () {
        if (pageCount > 5) {
            var pageNum = parseInt($("#" + div_name + " #pageGro2 li.on").html());
            pageUp(pageNum, pageCount);
        } else {
            var index = $("#" + div_name + " #pageGro2 ul li.on").index();
            if (index > 0) {
                $("#" + div_name + " #pageGro2 li").removeClass("on");
                $("#" + div_name + " #pageGro2 ul li").eq(index - 1).addClass("on");
            }
        }
        page = parseInt($("#" + div_name + " #pageGro2 li.on").html())
        //console.log(page);
        start_row = (page - 1) * page_num;
        end_row = start_row + page_num;
        if (end_row > data.length) {
            end_row = data.length;
        }
        page_ads_weibo(start_row, end_row, data, sub_div_name);
    });

    $("#" + div_name + " #pageGro2 .pageDown").off('click').click(function () {
        if (pageCount > 5) {
            var pageNum = parseInt($("#" + div_name + " #pageGro2 li.on").html());
            pageDown(pageNum, pageCount);
        } else {
            var index = $("#" + div_name + " #pageGro2 ul li.on").index();
            if (index + 1 < pageCount) {
                $("#" + div_name + " #pageGro2 li").removeClass("on");
                $("#" + div_name + " #pageGro2 ul li").eq(index + 1).addClass("on");
            }
        }
        page = parseInt($("#" + div_name + " #pageGro2 li.on").html())
        //console.log(page);
        start_row = (page - 1) * page_num;
        end_row = start_row + page_num;
        if (end_row > data.length) {
            end_row = data.length;
        }
        page_ads_weibo(start_row, end_row, data, sub_div_name);
    });

}

function pageGro2up(pageNum, pageCount) {
    switch (pageNum) {
        case 1:
            page_icon(1, 5, 0);
            break;
        case 2:
            page_icon(1, 5, 1);
            break;
        case pageCount - 1:
            page_icon(pageCount - 4, pageCount, 3);
            break;
        case pageCount:
            page_icon(pageCount - 4, pageCount, 4);
            break;
        default:
            page_icon(pageNum - 2, pageNum + 2, 2);
            break;
    }
}

function pageUp(pageNum, pageCount) {
    switch (pageNum) {
        case 1:
            break;
        case 2:
            page_icon(1, 5, 0);
            break;
        case pageCount - 1:
            page_icon(pageCount - 4, pageCount, 2);
            break;
        case pageCount:
            page_icon(pageCount - 4, pageCount, 3);
            break;
        default:
            page_icon(pageNum - 2, pageNum + 2, 1);
            break;
    }
}


function pageDown(pageNum, pageCount) {
    switch (pageNum) {
        case 1:
            page_icon(1, 5, 1);
            break;
        case 2:
            page_icon(1, 5, 2);
            break;
        case pageCount - 1:
            page_icon(pageCount - 4, pageCount, 4);
            break;
        case pageCount:
            break;
        default:
            page_icon(pageNum - 2, pageNum + 2, 3);
            break;
    }
}

function page_icon(page, count, eq) {
    var ul_html = "";
    for (var i = page; i <= count; i++) {
        ul_html += "<li>" + i + "</li>";
    }
    $("#pageGro2 ul").html(ul_html);
    $("#pageGro2 ul li").eq(eq).addClass("on");
}

function page_ads_weibo(start_row, end_row, data, sub_div_name) {
    weibo_num = end_row - start_row;
    $('#' + sub_div_name).empty();
    //console.log(data);
    var html = "";
    html += '<div class="group_weibo_font" style="margin-right:5px;margin-top:15px;">';
    for (var i = start_row; i < end_row; i += 1) {
        s = (i + 1).toString();
        var mid = data[i]["mid"];
        var uid = data[i]["uid"];
        var geo = data[i]["geo"];
        var text = data[i]["text"];
        //var retweet_count = data[i][7];
        //var comment_count = data[i][8];
        // var mingan_count = data[i][9];
        //var location = data[i][2];
        var newDate = new Date(data[i]["timestamp"]*1000);
        var date = newDate.toLocaleString();
        var weibo_url = data[i]["weibo_url"];
        //date = new Date(parseInt(timestamp)*1000).format("yyyy-MM-dd hh:mm:ss");
        if (i % 2 == 0) {
            html += '<div style="float:left;padding:15px;width: 100%;background:whitesmoke;">';
        }
        else {
            html += '<div style="float:left;padding:15px;width: 100%;">';
        }
        if (geo == null) {
            geo = '未知';
        }
        //if (text.length > 50) {
        //    text = text.substr(0, 50) + '...';
        //}
        html += '<a href =' + weibo_url +'><font color=black>' + text + '</font></a>';
        //html += '<p style="margin-left:10px;">'+s+'、昵称：<a target="_blank" href="/index/personal/?uid=' + uid + '">' + Pname + '</a>&nbsp;&nbsp;发布:<font color=black>' + text + '</font></p>';
        html += '<p style="text-align:right;width:95%;margin:10px;">';
        html += '<span"><u>' + date + '</u>';
        html += '</p>';
        html += '</div>';

    }
    html += '</div>';
    $('#' + sub_div_name).append(html);
}

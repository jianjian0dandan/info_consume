

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
    adsWeiBoData: function (data) {
        adsWeiBoData = data;
        // var testtext ="hello";
        // console.log(testtext);
        DrawWeibo(data, 'ads_recommendation', 'ads_recommendation_result');
        $('#per_onload').css('display', 'none');
        $('#ads_recommendation').css('display', 'block');
    }
}

var Personal = new homepageinfo();
var adsWeiBoData;
var uid = 1640601392;


var url = "/attribute/adsRec/?uid=" + uid;
Personal.call_sync_ajax_request(url, Personal.ajax_method, Personal.adsWeiBoData);
console.log("运行微博数据");
function DrawWeibo(data, div_name, sub_div_name) {
    page_num = 6;
    if (data.length < page_num) {
        console.log('data_length', data.length);
        $('#' + div_name + ' #pageGro .pageUp').css('display', 'none');
        $('#' + div_name + ' #pageGro .pageList').css('display', 'none');
        $('#' + div_name + ' #pageGro .pageDown').css('display', 'none');
        if (data.length == 0) {
            $('#' + sub_div_name).empty();
            $('#' + sub_div_name).append('暂无数据');
            $('#' + sub_div_name).css('height', '300px');
        } else {
            $('#' + div_name + ' #pageGro').css('display', 'block');
            page_num = data.length
            page_ads_weibo(0, page_num, data, sub_div_name);
        }
    } else {
        $('#' + div_name + ' #pageGro').css('display', 'block');
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

    $("#" + div_name + " #pageGro").on("click", "li", function () {
        if (pageCount > 5) {
            var pageNum = parseInt($(this).html());
            pageGroup(pageNum, pageCount);
        } else {
            $(this).addClass("on");
            $(this).siblings("li").removeClass("on");
        }
        page = parseInt($("#" + div_name + " #pageGro li.on").html())
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

    $("#" + div_name + " #pageGro .pageUp").off('click').click(function () {
        if (pageCount > 5) {
            var pageNum = parseInt($("#" + div_name + " #pageGro li.on").html());
            pageUp(pageNum, pageCount);
        } else {
            var index = $("#" + div_name + " #pageGro ul li.on").index();
            if (index > 0) {
                $("#" + div_name + " #pageGro li").removeClass("on");
                $("#" + div_name + " #pageGro ul li").eq(index - 1).addClass("on");
            }
        }
        page = parseInt($("#" + div_name + " #pageGro li.on").html())
        //console.log(page);
        start_row = (page - 1) * page_num;
        end_row = start_row + page_num;
        if (end_row > data.length) {
            end_row = data.length;
        }
        page_ads_weibo(start_row, end_row, data, sub_div_name);
    });

    $("#" + div_name + " #pageGro .pageDown").off('click').click(function () {
        if (pageCount > 5) {
            var pageNum = parseInt($("#" + div_name + " #pageGro li.on").html());
            pageDown(pageNum, pageCount);
        } else {
            var index = $("#" + div_name + " #pageGro ul li.on").index();
            if (index + 1 < pageCount) {
                $("#" + div_name + " #pageGro li").removeClass("on");
                $("#" + div_name + " #pageGro ul li").eq(index + 1).addClass("on");
            }
        }
        page = parseInt($("#" + div_name + " #pageGro li.on").html())
        //console.log(page);
        start_row = (page - 1) * page_num;
        end_row = start_row + page_num;
        if (end_row > data.length) {
            end_row = data.length;
        }
        page_ads_weibo(start_row, end_row, data, sub_div_name);
    });

}

function pageGroup(pageNum, pageCount) {
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
    $("#pageGro ul").html(ul_html);
    $("#pageGro ul li").eq(eq).addClass("on");
}

function page_ads_weibo(start_row, end_row, data, sub_div_name) {
    weibo_num = end_row - start_row;
    $('#' + sub_div_name).empty();
    //console.log(data);
    var html = "";
    html += '<div class="group_weibo_font" style="margin-right:5px;margin-top:15px;">';
    for (var i = start_row; i < end_row; i += 1) {
        s = (i + 1).toString();
        var mid = data[i][0];
        var uid = data[i][1];
        var geo = data[i][4];
        var text = data[i][2];

        var retweet_count = data[i][7];
        var comment_count = data[i][8];
        // var mingan_count = data[i][9];
        //var location = data[i][2];
        var date = data[i][6];
        var tweet_ulr = data[i][10];
        //date = new Date(parseInt(timestamp)*1000).format("yyyy-MM-dd hh:mm:ss");
        if (i % 2 == 0) {
            html += '<div style="float:left;padding:5px;width: 100%;background:whitesmoke;">';
        }
        else {
            html += '<div style="float:left;padding:5px;width: 100%;">';
        }
        if (geo == null) {
            geo = '未知';
        }
        if (text.length > 50) {
            text = text.substr(0, 50) + '...';
        }
        html += '<a target="_blank" href="/index/personal/?uid=' + uid + '"><font color=black>' + text + '</font></a>';
        //html += '<p style="margin-left:10px;">'+s+'、昵称：<a target="_blank" href="/index/personal/?uid=' + uid + '">' + Pname + '</a>&nbsp;&nbsp;发布:<font color=black>' + text + '</font></p>';
        html += '<p style="float:left;width:100%;margin-top:-5px;margin-left:10px;">';
        html += '<span style="float:left;margin-left: 60%;"><u>' + date + '</u>';
        html += '</p>';
        html += '</div>';

    }
    html += '</div>';
    $('#' + sub_div_name).append(html);
}

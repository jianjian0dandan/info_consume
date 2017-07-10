//换成跟人物推荐一样的选项卡模式

// var ads = new homepageinfo();
var adsData;
// var uid=uid;
var url = "/attribute/adsRec/?uid=" + uid;
// 每次展示三个
var num_show = 3;
// 图片目录的地址
var pic_dir = "/static/img/ads_img/";

$.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success: getAdsInfo
});


//   绑定换广告按钮
$("#switch-other-ads").on("click", function () {
    drawAds(adsData, num_show)
})

function getAdsInfo(data) {
    adsData = data;
    // if(data.length < num_show){
    //     $("#person-loading").html("<center>暂无数据</center>");
    // }
//    显示
    $('#ads-loading').css('display', 'none');
    $('#adsInfo').css('display', 'block');
    drawAds(adsData, num_show)
}

function drawAds(adsChoose) {
    adsChoose = randomChoose_ad(adsData, num_show)
    for (var i = 0; i < num_show;) {
        var ad = adsChoose[i];
        i = i + 1;
        pic_url = pic_dir + ad["ads_topic"] + ".jpg"
        document.getElementById("ads_pic" + i).src = pic_url;
        document.getElementById("ads_text" + i).innerHTML = ad["text"];
        document.getElementById("ads_from" + i).innerHTML = ad["nick_name"];
        document.getElementById("ads_topic" + i).innerHTML = ad["ads_topic"];
        document.getElementById("ads_home" + i).href = ad["weibo_url"];
    }
}

function randomChoose_ad(adsData, k) {
    var array_choose = new Array()
    var nowIndex = 0
    var currentIndex = adsData.length - 1
    while (nowIndex < k) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        array_choose[nowIndex] = adsData[randomIndex]

        temporaryValue = adsData[currentIndex];
        adsData[currentIndex] = adsData[randomIndex];
        adsData[randomIndex] = temporaryValue;

        currentIndex -= 1;
        nowIndex += 1;
    }
    return array_choose
}
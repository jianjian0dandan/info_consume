var Personal = new homepageinfo();
var personInfoData;
// var uid=uid;
var url = "/attribute/personRec/?uid=" + uid;
//每次展示三个人
var num_show = 3;

$.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:getPersonInfo
            });


//   绑定换人按钮
$("#switch-others").on("click", function(){drawPerson(personInfoData, num_show)})

function getPersonInfo(data) {
    personInfoData = data
    if(data.length < num_show){
        $("#person-loading").html("<center>暂无数据</center>");
    }
//    显示
    $('#person-loading').css('display', 'none');
    $('#person-panel-body').css('display', 'block');
    drawPerson(personInfoData, num_show)
}

function drawPerson(personChoose){
    personChoose = randomChoose(personInfoData,num_show)
    for (var i = 0; i <= num_show;) {
        var person = personChoose[i]
        i = i+1;
        document.getElementById("userphoto"+i).src=person["photo_url"]
        document.getElementById("username"+i).innerHTML = person["nick_name"]
        document.getElementById("userdesc"+i).innerHTML = person["description"]
        document.getElementById("usertopic"+i).innerHTML = person["topic"]
        document.getElementById("userhome"+i).href= "http://weibo.com/u/"+person["id"]
    }
    //console.log(personChoose)
}

function randomChoose(personInfoData, k){
    var array_choose = new Array()
    var nowIndex = 0
    var currentIndex = personInfoData.length - 1
    while(nowIndex < k){
        randomIndex = Math.floor(Math.random() * currentIndex)
        array_choose[nowIndex] = personInfoData[randomIndex]

        temporaryValue = personInfoData[currentIndex];
        personInfoData[currentIndex] = personInfoData[randomIndex];
        personInfoData[randomIndex] = temporaryValue;

        currentIndex -= 1;
        nowIndex += 1;
    }
    return array_choose
}
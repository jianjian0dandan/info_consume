function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,21)
};
function homepageinfo() {
    //this.ajax_method='GET'; // body...
}
homepageinfo.prototype= {
    call_request:function(url,callback) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:callback
        });
    },
};
function territory2(data) {
    var data=eval(data);
    Draw_weibo_table2(data);
};
var place=new homepageinfo();
function nums() {
    var url = "/attribute/adsRec/?uid=" + uid;
    console.log(uid);
    place.call_request(url,territory2);
}
nums();
function Draw_weibo_table2(data){
    $('#group_emotion_loading').css('display', 'none');
    $('#input-table').css('display', 'block');
    var dataArray = data;
    var PageNo=document.getElementById('PageNo');                   //设置每页显示行数
    var InTb=document.getElementById('input-table');               //表格
    var Fp=document.getElementById('F-page');                      //首页
    var Nep=document.getElementById('Nex-page');                  //下一页
    var Prp=document.getElementById('Pre-page');                  //上一页
    var Lp=document.getElementById('L-page');                     //尾页
    var S1=document.getElementById('s1');                         //总页数
    var S2=document.getElementById('s2');                         //当前页数
    var currentPage;                                              //定义变量表示当前页数
    var SumPage;

    if(PageNo.value!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray.length%PageNo.value==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray.length/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.value)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        var oTBody=document.createElement('tbody');               //创建tbody
        oTBody.setAttribute('class','In-table');                   //定义class
        InTb.appendChild(oTBody);
        //将创建的tbody添加入table
        var html_c = '';
        if(dataArray==''){
            html_c = "<div style='width:100%;'><span><img src='/static/img/pencil-icon.png' style='height:12px;width:12px;margin:0px;margin-right:8px;float:left;'>用户未发布任何微博</span></div>";
            oTBody.innerHTML = html_c;
        }else{

            for(i=0;i<parseInt(PageNo.value);i++)
            {                                                          //循环打印数组值
                oTBody.insertRow(i);
                html_c = '<div class="twr1">'+
                    ' <p class="master22"><a href="'+dataArray[i].weibo_url+'">'+ dataArray[i].text+ '</a></p>'+
                    ' <p class="time22">'+getLocalTime(dataArray[i].timestamp)+'</p>'+
                    '</div>';
                oTBody.rows[i].insertCell(0);
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }
    Fp.onclick=function()
    {

        if(PageNo.value!="")                                       //判断每页显示是否为空
        {
            InTb.innerHTML='';                                     //每次进来都清空表格
            S2.innerHTML='';                                        //每次进来清空当前页数
            currentPage=1;                                          //首页为1
            S2.appendChild(document.createTextNode(currentPage));
            S1.innerHTML='';                                        //每次进来清空总页数
            if(dataArray.length%PageNo.value==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            var oTBody=document.createElement('tbody');               //创建tbody
            oTBody.setAttribute('class','In-table');                   //定义class
            InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
            var html_c = '';

            if(dataArray==''){
                html_c = "<div style='width:100%;'><span style='margin-left:20px;'>用户未发布任何微博</span></div>";
                oTBody.rows[0].cells[0].innerHTML = html_c;
            }else{

                for(i=0;i<parseInt(PageNo.value);i++)
                {                                                          //循环打印数组值
                    oTBody.insertRow(i);
                    var name;
                    if (dataArray[i].uname==''||dataArray[i].uname=='unknown') {
                        name=dataArray[i].uid;
                    }else {
                        name=dataArray[i].uname;
                    };
                    html_c = '<div class="twr1">'+
                        ' <p class="master22"><a href="'+dataArray[i].weibo_url+'">'+ dataArray[i].text+ '</a></p>'+
                        ' <p class="time22">'+getLocalTime(dataArray[i].timestamp)+'</p>'+
                        '</div>';
                    oTBody.rows[i].insertCell(0);
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                }
            }
        }
    };
    Nep.onclick=function()
    {
        if(currentPage<SumPage)                                 //判断当前页数小于总页数
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.value==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage+1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;                                                 //定义变量a
            a=PageNo.value*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
            var c;                                                  //定义变量c
            if(dataArray.length-a>=PageNo.value)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.value;
            }
            else
            {
                c=dataArray.length-a;
            }
            for(i=0;i<c;i++)
            {
                oTBody.insertRow(i);
                var name;
                if (dataArray[i+a].uname==''||dataArray[i+a].uname=='unknown') {
                    name=dataArray[i+a].uid;
                }else {
                    name=dataArray[i+a].uname;
                };
                oTBody.rows[i].insertCell(0);
                html_c = '<div class="twr1">'+
                    ' <p class="master22"><a href="'+dataArray[i+a].weibo_url+'">'+ dataArray[i+a].text+ '</a></p>'+
                    ' <p class="time22">'+getLocalTime(dataArray[i+a].timestamp)+'</p>'+
                    '</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                //数组从第i+a开始取值
            }
        }
    }

    Prp.onclick=function()
    {
        if(currentPage>1)                        //判断当前是否在第一页
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.value==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage-1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;
            a=PageNo.value*(currentPage-1);
            for(i=0;i<parseInt(PageNo.value);i++)
            {
                oTBody.insertRow(i);
                var name;
                if (dataArray[i+a].uname==''||dataArray[i].uname=='unknown') {
                    name=dataArray[i+a].uid;
                }else {
                    name=dataArray[i+a].uname;
                };
                oTBody.rows[i].insertCell(0);
                html_c = '<div class="twr1">'+
                    ' <p class="master22"><a href="'+dataArray[i+a].weibo_url+'">'+ dataArray[i+a].text+ '</a></p>'+
                    ' <p class="time22">'+getLocalTime(dataArray[i+a].timestamp)+'</p>'+
                    '</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray.length%PageNo.value==0)
        {
            SumPage=parseInt(dataArray.length/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.value)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        S2.innerHTML='';
        currentPage=SumPage;
        S2.appendChild(document.createTextNode(currentPage));
        var oTBody=document.createElement('tbody');
        oTBody.setAttribute('class','In-table');
        InTb.appendChild(oTBody);
        var a;
        a=PageNo.value*(currentPage-1);
        var c;
        if(dataArray.length-a>=PageNo.value)
        {
            c=PageNo.value;
        }
        else
        {
            c=dataArray.length-a;
        }
        for(i=0;i<c;i++)
        {
            oTBody.insertRow(i);
            var name;
            if (dataArray[i+a].uname==''||dataArray[i+a].uname=='unknown') {
                name=dataArray[i+a].uid;
            }else {
                name=dataArray[i+a].uname;
            };
            oTBody.rows[i].insertCell(0);
            html_c = '<div class="twr1">'+
                ' <p class="master22"><a href="'+dataArray[i+a].weibo_url+'">'+ dataArray[i+a].text+ '</a></p>'+
                ' <p class="time22">'+getLocalTime(dataArray[i+a].timestamp)+'</p>'+
                '</div>';
            oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }

};
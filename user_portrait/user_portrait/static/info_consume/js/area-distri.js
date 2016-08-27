//圈子用户身份分布;id=identi-distri
// a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
      var myChart = echarts.init(document.getElementById('area-distri'),'shine');
      var option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'horizontal',
        x : '5px',
        y : '35px',
        data:['媒体人士','政府人士','商业人士','民间组织','法律机构']
    },
    toolbox: {
        show : true,
        x : 'right',
        feature : {
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'用户身份',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:30, name:'媒体人士'},
                {value:10, name:'政府人士'},
                {value:20, name:'商业人士'},
                {value:13, name:'民间组织'},
                {value:17, name:'法律机构'}
            ]
        }
    ]
};
      

       myChart.setOption(option);
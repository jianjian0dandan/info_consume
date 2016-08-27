//关键词词云;id=keyword-cloud
var myChart = echarts.init(document.getElementById('keyword-cloud'),'macarons');
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

var option = {
    tooltip: {
        show: true
    },
    series: [{
        name: '关键词词云',
        type: 'wordCloud',
        size: ['80%', '80%'],
        textRotation : [0, 45, 90, -45],
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 14
        },
        data: [
            {
                name: "奥运",
                value: 10000,
                itemStyle: {
                    normal: {
                        color: 'black'
                    }
                }
            },
            {
                name: "傅园慧",
                value: 6181,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "里约",
                value: 4386,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "洪荒之力",
                value: 4055,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "科科",
                value: 2467,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "大魔王",
                value: 2244,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "林李大战",
                value: 1898,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "金牌",
                value: 1484,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "兴奋剂",
                value: 1112,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "宋喆",
                value: 282,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "王宝强",
                value: 273,
                itemStyle: createRandomItemStyle()
            },
            {
                name: "霍顿",
                value: 265,
                itemStyle: createRandomItemStyle()
            }

        ]
    }]
};

  myChart.setOption(option);
                    
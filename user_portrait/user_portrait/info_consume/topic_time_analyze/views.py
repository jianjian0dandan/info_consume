# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import all_weibo_count, get_weibo_content, get_weibo_by_time, get_weibo_by_hot

mod = Blueprint('topic_time_analyze',__name__,url_prefix='/topic_time_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

@mod.route('/mtype_count/')
def MtypeCount():      #每类微博的数量
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval', Fifteenminutes)   #默认查询时间粒度为900秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    ts_arr = []
    #results = mtype_count(topic,start_ts,end_ts)
    results = mtype_count('aoyunhui',1468944000,1471622400,1) 
    #mtype_count(topic,start_ts,end_ts,mtype,unit=MinInterval):
    return json.dumps(results)
@mod.route('/time_order_weibos/')
def TimeOrderWeibos():
    topic =results.args.get('topic', '')
    during = request.args.get('pointInterval', Fifteenminutes)   #默认查询时间粒度为900秒
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    ts_arr = []
    weibos = get_weibo_by_time(topic,start_ts,end_ts)
    return json.dumps(weibos)

@mod.route('/hot_order_weibos/')
def HotOrderWeibos():
    topic =results.args.get('topic', '')
    during = request.args.get('pointInterval', Fifteenminutes)   #默认查询时间粒度为900秒
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    ts_arr = []
    weibos = get_weibo_by_hot(topic,start_ts,end_ts)

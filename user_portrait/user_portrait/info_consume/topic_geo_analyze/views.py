# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import province_weibo_count,city_weibo_count,get_weibo_content

mod = Blueprint('topic_geo_analyze',__name__,url_prefix='/topic_geo_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes


@mod.route('/geo_weibo_count')
def weibo_count():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    ts_arr = []
    results = []
    #weibo_count = province_weibo_count(topic,start_ts,end_ts)
    weibo_count = province_weibo_count('aoyunhui',1468944000,1471622400)
    return json.dumps(weibo_count)


@mod.route('/geo_province_count')
def province_count():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    province = request.args.get('province','')
    ts_arr = []
    results = []
    #weibo_count = all_weibo_count(topic,start_ts,end_ts)
    province_count = city_weibo_count('aoyunhui',1468944000,1471622400,province)
    return json.dumps(province_count)

@mod.route('/geo_weibo_content')
def weibo_content():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    province = request.args.get('province','')
    weibo_content = get_weibo_content(topic,start_ts,end_ts,province)
    return json.dumps(weibo_count)


# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import get_sen_time_count,get_weibo_content,get_sen_province_count
import json

mod = Blueprint('topic_sen_analyze',__name__,url_prefix='/topic_sen_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes


@mod.route('/sen_time_count/')
def sen_time_count():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    ts_arr = []
    results = []
    #weibo_count = all_weibo_count(topic,start_ts,end_ts)
    time_count = get_sen_time_count(topic,start_ts,end_ts,during)
    print type(time_count)
    return json.dumps(time_count)

@mod.route('/sen_weibo_content/')
def sen_weibo_content():
    topic = request.args.get('topic','')
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    sort_item = request.args.get('sort_item','timestamp')
    #weibo_count = all_weibo_count(topic,start_ts,end_ts)
    results = get_weibo_content(topic,start_ts,end_ts,sort_item)
    print results
    return json.dumps(results)

@mod.route('/sen_province_count/')
def sen_province_count():   
    topic = request.args.get('topic','')
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    #weibo_count = all_weibo_count(topic,start_ts,end_ts)
    results = get_sen_province_count(topic,start_ts,end_ts)
    #print results
    return json.dumps(results)
    
# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import get_during_keywords,get_topics_river,get_weibo_content
import json

mod = Blueprint('topic_language_analyze',__name__,url_prefix='/topic_language_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes


@mod.route('/during_keywords/')
def during_keywords():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    keywords = get_during_keywords(topic,start_ts,end_ts,during)
    #keywords = get_during_keywords('aoyunhui',1468944000,1471622400,during)
    return json.dumps(keywords)


@mod.route('/topics_river/')
def topics_river():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    #weibo_count = all_weibo_count(topic,start_ts,end_ts)
    topic_count = get_topics_river(topic,start_ts,end_ts,during)
    return json.dumps(topic_count)

@mod.route('/symbol_weibos/')
def symbol_weibos():
    topic = request.args.get('topic','')
    during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    weibo_content = get_symbol_weibo(topic,start_ts,end_ts,during)
    return json.dumps(weibo_count)


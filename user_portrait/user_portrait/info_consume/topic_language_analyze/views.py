# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import get_during_keywords,get_topics_river,get_weibo_content,get_subopinion,get_symbol_weibo,get_topics
from utils import submit,get_key_topics,delete,get_sen_ratio
import json
from user_portrait.info_consume.topic_sen_analyze.views import sen_time_count

mod = Blueprint('topic_language_analyze',__name__,url_prefix='/topic_language_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes


@mod.route('/topics/')
def topics():
    user = request.args.get('user','')
    topics = get_topics(user)
    return topics

@mod.route('/key_topics/')
def key_topics():
    keyword = request.args.get('keyword','')
    topics = get_key_topics(keyword)
    return topics

@mod.route('/submit_task/')
def submit_task():
    start_ts = request.args.get('start_ts','')
    end_ts = request.args.get('end_ts','')
    submit_user = request.args.get('submit_user','')
    topic = request.args.get('topic','')
    status = submit(topic,start_ts,end_ts,submit_user)

    print status

    return json.dumps(status)


@mod.route('/delete_task/')
def delete_task():
    start_ts = request.args.get('start_ts','')
    end_ts = request.args.get('end_ts','')
    submit_user = request.args.get('submit_user','')
    en_name = request.args.get('en_name','')
    print '???'
    status = delete(en_name,start_ts,end_ts,submit_user)
    return json.dumps(status)

@mod.route('/during_keywords/')
def during_keywords():
    topic = request.args.get('topic','')
    # during = request.args.get('pointInterval',60*60) # 默认查询时间粒度为3600秒
    # during = int(during)
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    keywords = json.loads(get_during_keywords(topic,start_ts,end_ts))
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
    return json.dumps(weibo_content)


@mod.route('/subopinion/')
def subopinion():
    topic = request.args.get('topic','')
    results = get_subopinion(topic)
    return json.dumps(results)

@mod.route('/weibo_content/')
def weibo_content():
    topic = request.args.get('topic','')
    opinion0 = request.args.get('opinion','') # 默认查询时间粒度为3600秒
    opinion = '_'.join(opinion0.split(','))
    # print opinion,type(opinion[0]),
    # opinion1=["看客", "纹身", "高度", "人生", "健力宝"]
    # print opinion1,type(opinion1[0])
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    sort_item = request.args.get('sort_item','timestamp')
    weibo_content = get_weibo_content(topic,start_ts,end_ts,opinion,sort_item)
    return json.dumps(weibo_content)


@mod.route('/sen_ratio/')
def sen_ratio():
    topic = request.args.get('topic','')
    end_ts = request.args.get('end_ts', '')
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    time_count = get_sen_ratio(topic,start_ts,end_ts)
    return json.dumps(time_count)


@mod.route('/test/')
def test():
    key_topics_data = key_topics() 
    sen_time_count()
    return key_topics_data

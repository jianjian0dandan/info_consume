# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import get_sen_time_count

mod = Blueprint('topic_sen_analyze',__name__,url_prefix='/topic_sen_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes


@mod.route('/sen_time_count')
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
    time_count = get_sen_time_count('aoyunhui',1468944000,1471622400,during)
    return json.dumps(weibo_count)

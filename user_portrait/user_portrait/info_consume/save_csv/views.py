# -*- coding: utf-8 -*-

import json
from user_portrait.parameter import MYSQL_TOPIC_LEN
from flask import Blueprint,render_template,request
from utils import export_to_csv

mod = Blueprint('save_csv',__name__,url_prefix='/save_csv')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes
label_list = ["topic_id", "topic_status", "topic_name", "propagate_keywords", "start_ts", "end_ts", "topic_area", "topic_subject", "first_label", "second_label", "identify_firstuser", "identify_trendpusher", "identify_pagerank", "moodlens_sentiment", "topic_abstract", "propagate_peak", "propagate_peak_news"]
@mod.route('/save_to_csv')
def save_to_csv():
    topic_id = request.args.get('topic_id', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = int(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = int(start_ts)
    result = export_to_csv(topic_id, start_ts, end_ts)
    with open("case.csv", "w") as fw:
        for key in label_list:
            fw.write(json.dumps(key,ensure_ascii=False))
            fw.write(",")
            fw.write(json.dumps(result[key],ensure_ascii=False))
            fw.write("\n")
    return json.dumps(result)


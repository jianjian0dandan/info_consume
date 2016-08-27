#-*- coding:utf-8 -*-

import os
import time
import math
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from utils import get_text_detail


mod = Blueprint('social_sensing', __name__, url_prefix='/social_sensing')


# 前台设置好的参数传入次函数，创建感知任务,放入es, 从es中读取所有任务信息放入redis:sensing_task 任务队列中
# parameters: task_name, create_by, stop_time, remark, social_sensors, keywords
# other parameters: create_at, warning_status,
# warning_status: 0-no, 1-burst, 2-tracking, 3-ever_brusing, now no
# task_type：任务类型：{"0": no keywords and no sensors, "1": no keywords and some sensors, "2": "some keywords and no sensors", "3": "some keywords and some sensors"}


# 返回某个时间段特定的文本，按照热度排序
@mod.route('/get_text_detail/')
def ajax_get_text_detail():
    print "texttttttttttttttttttttt"
    task_name = request.args.get('task_name','media') # task_name
    user = request.args.get('user', '')
    order = request.args.get('order', 'total') # total, retweeted, comment
    ts = int(request.args.get('ts', '1378008000')) # timestamp: 123456789
    text_type = request.args.get('text_type', 0) # which line

    results = get_text_detail(task_name, ts, text_type, user, order)

    return json.dumps(results)


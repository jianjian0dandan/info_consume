#-*- coding:utf-8 -*-

import os
import time
import math
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from utils import get_text_detail

mod = Blueprint('social_sensing', __name__, url_prefix='/social_sensing')

# 返回某个时间段特定的文本，按照热度排序
@mod.route('/get_text_detail/')
def ajax_get_text_detail():
    print "texttttttttttttttttttttt"
    task_name = request.args.get('task_name','') # task_name
    user = request.args.get('user', '')
    order = request.args.get('order', 'total') # total, retweeted, comment
    ts = int(request.args.get('ts', '')) # timestamp: 123456789 时间戳：字符序列，唯一标识某一刻的时间
    text_type = request.args.get('text_type', 0) # which line

    results = get_text_detail(task_name, ts, text_type, user, order)
    return json.dumps(results)#返回参数

  

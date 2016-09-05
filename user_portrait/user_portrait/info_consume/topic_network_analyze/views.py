# -*- coding: utf-8 -*-
from user_portrait.global_config import adb, es_user_profile
from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import  get_weibo_by_time, get_weibo_by_hot,get_time_count
import json

mod = Blueprint('topic_network_analyze',__name__,url_prefix='/topic_network_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

@mod.route('/get_gexf/')
def GetGexf():
	results = get_gexf()
	return json.dumps(results)


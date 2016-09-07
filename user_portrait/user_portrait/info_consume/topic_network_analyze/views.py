# -*- coding: utf-8 -*-
from user_portrait.global_config import adb, es_user_profile
from flask import Blueprint,render_template,request
from user_portrait.global_config import db
from utils import get_gexf ,get_trend_pusher, get_trend_maker,\
get_maker_weibos_byts, get_pusher_weibos_byts, get_pusher_weibos_byhot,get_maker_weibos_byhot
import json
from time_utils import ts2datetime, datetime2ts

mod = Blueprint('topic_network_analyze',__name__,url_prefix='/topic_network_analyze')

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

@mod.route('/get_gexf/')
def GetGexf():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_gexf(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/get_trend_pusher/')
def GetPusher():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_trend_pusher(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/get_trend_maker/')
def GetMaker():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_trend_maker(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/pusher_weibos_byts/')
def GetPusherWeibosByts():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_pusher_weibos_byts(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/maker_weibos_byts/')
def GetMakerWeibosByts():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_maker_weibos_byts(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/maker_weibos_byhot/')
def GetMakerWeibosByts():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_maker_weibos_byhot(topic, date, windowsize)
	return json.dumps(results)

@mod.route('/pusher_weibos_byhot/')
def GetPusherWeibosByts():
	topic =request.args.get('topic', '')
    end_ts = request.args.get('end_ts', '')     #''代表默认值为空
    end_ts = long(end_ts)
    start_ts = request.args.get('start_ts', '')
    start_ts = long(start_ts)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
	results = get_pusher_weibos_byhot(topic, date, windowsize)
	return json.dumps(results)
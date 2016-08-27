#-*- coding:utf-8 -*-

import os
import json
from flask import Blueprint, url_for, render_template, request,\
                    abort, flash, session, redirect
from utils import submit_network_keywords, search_all_keywords, show_daily_rank,\
        show_daily_trend, search_retweet_network, delete_network_keywords,\
        show_keywords_rank, search_retweet_network_keywords

mod = Blueprint('network', __name__, url_prefix='/network')

#use to show daily trend
@mod.route('/show_daily_trend/')
def ajax_show_daily_trend():
    results = show_daily_trend()
    if not results:
        results = ''
    return json.dumps(results)

#use to show daily rank 
@mod.route('/show_daily_rank/')
def ajax_show_daily_rank():
    period = request.args.get('period', '')
    sort_type = request.args.get('order', 'pr')
    count = request.args.get('count', 100)

    results = show_daily_rank(period, sort_type, count)
    if not results:
        results = ''
    return json.dumps(results)

#use to show keywords rank 
@mod.route('/show_keywords_rank/')
def ajax_show_keywords_rank():
    task_id = request.args.get('task_id', '')
    sort_type = request.args.get('order', 'pr')
    count = request.args.get('count', 100)

    results = show_keywords_rank(task_id, sort_type, count)
    if not results:
        results = ''
    return json.dumps(results)
#use to delete keywords network task compute status
@mod.route('/delete_network_keywords/')
def ajax_delete_network_keywords():
    task_id = request.args.get('task_id', '')
    status = delete_network_keywords(task_id)
    return json.dumps(status)

#use to submit keywords network compute task to redis and es
@mod.route('/submit_network_keywords/')
def ajax_submit_network_keywords():
    start_date = request.args.get('start_date', '2013-09-01')
    end_date = request.args.get('end_date', '2013-09-07')
    keywords_string = request.args.get('keywords', 'test') #keywords_string=word1,word2
    submit_user = request.args.get('submit_user', 'admin')
    results = submit_network_keywords(keywords_string, start_date, end_date, submit_user)
    if not results:
        results = ''
    return json.dumps(results)

#use to search all keywords network task
@mod.route('/search_all_keywords/')
def ajax_search_all_keywords():
    submit_date = request.args.get('submit_date', '')  #2016-03-29
    keywords_string = request.args.get('keywords', '') # word1,word2
    submit_user = request.args.get('submit_user', '') # admin@qq.com
    start_date = request.args.get('start_date', '') # 2013-09-07
    end_date = request.args.get('end_date', '') # 2013-09-08
    status = request.args.get('status', '') # '0'/'1'
    results = search_all_keywords(submit_date, keywords_string, submit_user, start_date, end_date, status)
    if not results:
        results = ''
    return json.dumps(results)

#use to search retweet network for temporal
@mod.route('/search_retweet_network/')
def ajax_search_retweet_network():
    uid = request.args.get('uid', '')
    results = search_retweet_network(uid)
    if not results:
        results = ''
    return json.dumps(results)

#use to search retweet network for keywords
@mod.route('/search_retweet_network_keywords/')
def ajax_search_retweet_network_keywords():
    task_id = request.args.get('task_id', '')
    uid = request.args.get('uid', '')
    results = search_retweet_network_keywords(task_id, uid)
    if not results:
        results = ''
    return json.dumps(results)

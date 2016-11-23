#-*- coding:utf-8 -*-

import os
import json
from flask import Blueprint, url_for, render_template, request,\
                    abort, flash, session, redirect
from utils import search_sentiment_all,\
                  search_sentiment_domain, search_sentiment_topic,\
                  search_sentiment_weibo_keywords, search_sentiment_all_portrait ,\
                  submit_sentiment_all_keywords, show_sentiment_all_keywords_results, \
                  delete_sentiment_all_keywords_task, search_sentiment_all_keywords_task
from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, \
                flow_text_index_type, es_user_portrait, portrait_index_name ,\
                portrait_index_type


mod = Blueprint('sentiment', __name__, url_prefix='/sentiment')

#use to get all sentiment trend
@mod.route('/sentiment_all/')
def ajax_sentiment_all():
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '') # limited by latest month
    time_segment = request.args.get('segment', 'fifteen') # fifteen/hour/day
    results = search_sentiment_all(start_date, end_date, time_segment)
    if not results:
        results = ''
    return json.dumps(results)

#use to get all portrait sentiment trend
@mod.route('/sentiment_all_portrait/')
def ajax_sentiment_all_portrait():
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    time_segment = request.args.get('segment', 'fifteen') # fifteen/hour/day
    results = search_sentiment_all_portrait(start_date, end_date, time_segment)
    if not results:
        results = ''
    return json.dumps(results)

#use to submit all keywords sentiment trend compute task to redis and es
@mod.route('/submit_sentiment_all_keywords/')
def ajax_submit_sentiment_all_keywords():
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    keywords_string = request.args.get('keywords', '') #keywords_string=word1,word2
    submit_user = request.args.get('submit_user', '')
    segment = request.args.get('segment', 'fifteen') # fifteen/hour/day
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)
    print 'task_max_count:', task_max_count
    results = submit_sentiment_all_keywords(keywords_string, start_date, end_date, submit_user, segment, task_max_count)
    if not results:
        results = ''
    return json.dumps(results)


#use to delete all keywords sentiment task compute status
@mod.route('/delete_sentiment_all_keywords_task/')
def ajax_delete_sentiment_all_keywords_task():
    #task_id = request.args.get('task_id', '')
    submit_ts = request.args.get('submit_ts', '')
    submit_user = request.args.get('submit_user', '')
    keywords = request.args.get('keywords', '') # keywords=words1,words2
    keywords_string = '&'.join(keywords.split(','))
    task_id = '_'.join([submit_ts, submit_user, keywords_string])
    status = delete_sentiment_all_keywords_task(task_id)
    return json.dumps(status)

#use to search all keywords sentiment task
@mod.route('/search_sentiment_all_keywords_task/')
def ajax_search_sentiment_all_keywords_task():
    submit_date = request.args.get('submit_date', '')  #2016-03-29
    keywords_string = request.args.get('keywords', '') # word1,word2
    submit_user = request.args.get('submit_user', '') # admin@qq.com
    start_date = request.args.get('start_date', '') # 2013-09-07
    end_date = request.args.get('end_date', '') # 2013-09-08
    status = request.args.get('status', '') # '0'/'1'
    results = search_sentiment_all_keywords_task(submit_date, keywords_string, submit_user, start_date, end_date, status)
    if not results:
        results = ''
    return json.dumps(results)


#use to get all keywords sentiment trend
@mod.route('/show_sentiment_all_keywords_results/')
def ajax_senitment_all_keywords():
    task_keyword = request.args.get('task_keyword', '') # word1,word2
    submit_ts = request.args.get('submit_ts', '') # ts
    submit_user = request.args.get('submit_user', '') # submit_user
    task_keyword_string = '&'.join(task_keyword.split(','))
    task_id = submit_ts + '_' + submit_user + '_' + task_keyword_string
    # task_id = ts_admin_keywords
    time_segment = request.args.get('segment', 'fifteen') #fifteen/hour/day
    results = show_sentiment_all_keywords_results(task_id, time_segment)
    if not results:
        results = ''
    return json.dumps(results)

#use to get domain sentiment trend for user in user_portrait
@mod.route('/sentiment_domain/')
def ajax_sentiment_domain():
    domain = request.args.get('domain', '')
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '') #limited by lastest month
    time_segment = request.args.get('segment', 'fifteen') #fifteen/hour/day
    results = search_sentiment_domain(domain, start_date, end_date, time_segment)
    if not results:
        results = ''
    return json.dumps(results)

#use to get topic sentiment trend for user in user_portrait
@mod.route('/sentiment_topic/')
def ajax_senitment_topic():
    topic = request.args.get('topic', '')
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '') #limited by latest month
    time_segment = request.args.get('segment', 'fifteen') #fifteen/hour/day
    results = search_sentiment_topic(topic, start_date, end_date, time_segment)
    if not results:
        results = ''
    return json.dumps(results)

#use to get sentiment trend point weibo and keywords and user
@mod.route('/sentiment_weibo_keywords_user/')
def ajax_sentiment_weibo_keywords():
    start_ts = request.args.get('start_ts', '')
    task_type = request.args.get('task_type', '') # task_type=all/all-keywords/in-all/in-domain/in-topic
    task_detail = request.args.get('task_detail', '')  # domain/topic detail type
    time_segment = request.args.get('segment', '') # fifteen/hour/day
    sentiment = request.args.get('sentiment', '0') # 0/1/7
    sort_type = request.args.get('sort_type', 'timestamp') #timestamp/retweet/comment/sensitive
    #test
    #sort_type = 'timestamp'
    results = search_sentiment_weibo_keywords(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)
    if not results:
        results = ''
    return json.dumps(results)

#use to get topic model
@mod.route('/sentiment_weibo_topic/')
def ajax_sentiment_weibo_topic():
    start_ts = request.args.get('start_ts', '')
    task_type = request.args.get('task_type', '') #task_type=all/all-keywords/in-all/in-domain/in-topic
    task_detail = request.args.get('task_detail', '') # fifteen/hour/day
    time_segment = request.args.get('segment', '') #fifteen/hour/day
    sentiment = request.args.get('sentiment', '0') #0/1/7
    results = {}
    return json.dumps(results)

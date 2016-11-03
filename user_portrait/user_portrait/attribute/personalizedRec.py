# -*- coding:utf-8 -*-
'''
用户个性化推荐的后台相关计算模块
'''
__author__ = 'zxy'
import time

from user_portrait.time_utils import ts2datetime, datetime2ts, ts2date
from user_portrait.parameter import RUN_TYPE, RUN_TEST_TIME
from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, flow_text_index_type, \
    es_user_profile, profile_index_name, profile_index_type
from user_portrait.parameter import DAY, MAX_VALUE
from influence_appendix import weiboinfo2url
from new_search import ip2city


def adsRec(uid):
    results = []
    weibo_list = []
    now_date = ts2datetime(time.time())

    # run_type
    if RUN_TYPE == 0:
        now_date = RUN_TEST_TIME

    # step1:get user name
    print '708'
    try:
        user_profile_result = es_user_profile.get(index=profile_index_name, doc_type=profile_index_type, \
                                                  id=uid, _source=False, fields=['nick_name'])
    except:
        user_profile_result = {}
    print '714', len(user_profile_result)
    if user_profile_result:
        uname = user_profile_result['fields']['nick_name'][0]
    else:
        uname = ''
    #step2:get user weibo
    index_list = []
    for i in range(7, 0, -1):
        if RUN_TYPE == 1:
            iter_date = ts2datetime(datetime2ts(now_date) - i * DAY)
        else:
            iter_date = '2013-09-01'
        index_list.append(flow_text_index_name_pre + iter_date)
    print '726'
    try:
        sort_type = 'timestamp'
        weibo_result = es_flow_text.search(index=index_list, doc_type=flow_text_index_type, \
                                           body={
                                                    'query': {
                                                        'filtered': {
                                                            'filter': {
                                                                'term': {
                                                                    'uid': uid
                                                                }
                                                            }
                                                        }
                                                    },
                                                    'size': MAX_VALUE,
                                                    'sort': {
                                                        sort_type: {
                                                            'order': 'desc'
                                                        }
                                                    }
                                                })['hits']['hits']
        #print weibo_result
    except:
        weibo_result = []
    print '732', len(weibo_result)
    if weibo_result:
        weibo_list.extend(weibo_result)

    #sort_weibo_list = sorted(weibo_list, key=lambda x:x['_source'][sort_type], reverse=True)[:100]
    mid_set = set()
    for weibo_item in weibo_list:
        source = weibo_item['_source']
        mid = source['mid']
        uid = source['uid']
        text = source['text']
        ip = source['ip']
        timestamp = source['timestamp']
        date = ts2date(timestamp)
        sentiment = source['sentiment']
        weibo_url = weiboinfo2url(uid, mid)
        #run_type
        if RUN_TYPE == 1:
            try:
                retweet_count = source['retweeted']
            except:
                retweet_count = 0
            try:
                comment_count = source['comment']
            except:
                comment_count = 0
            try:
                sensitive_score = source['sensitive']
            except:
                sensitive_score = 0
        else:
            retweet_count = 0
            comment_count = 0
            sensitive_score = 0
        city = ip2city(ip)
        if mid not in mid_set:
            results.append(
                [mid, uid, text, ip, city, timestamp, date, retweet_count, comment_count, sensitive_score, weibo_url])
            mid_set.add(mid)
    if sort_type == 'timestamp':
        sort_results = sorted(results, key=lambda x: x[5], reverse=True)
    elif sort_type == 'retweet_count':
        sort_results = sorted(results, key=lambda x: x[7], reverse=True)
    elif sort_type == 'comment_count':
        sort_results = sorted(results, key=lambda x: x[8], reverse=True)
    elif sort_type == 'sensitive':
        sort_results = sorted(results, key=lambda x: x[9], reverse=True)
    print '778'
    return sort_results

    return None
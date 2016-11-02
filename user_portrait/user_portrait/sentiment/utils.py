#-*- coding:utf-8 -*-
import sys
import json
import time
import math
from influence_appendix import weiboinfo2url

from user_portrait.global_utils import es_user_portrait, portrait_index_name,\
                                     portrait_index_type, es_flow_text, flow_text_index_name_pre ,\
                                     flow_text_index_type, es_user_profile, profile_index_name, \
                                     profile_index_type
from user_portrait.global_utils import es_sentiment_task, sentiment_keywords_index_name, \
                                     sentiment_keywords_index_type
from user_portrait.global_utils import R_SENTIMENT_KEYWORDS, r_sentiment_keywords_name
from user_portrait.global_utils import R_DOMAIN_SENTIMENT, r_domain_sentiment_pre,\
        R_TOPIC_SENTIMENT, r_topic_sentiment_pre, R_SENTIMENT_ALL, es_flow_text,\
        flow_text_index_name_pre, flow_text_index_type, R_DOMAIN, r_domain_name, R_TOPIC, r_topic_name, es_bci_history, bci_history_index_name, bci_history_index_type
from user_portrait.time_utils import ts2datetime, datetime2ts, ts2date
from user_portrait.parameter import DAY, domain_en2ch_dict, SENTIMENT_MAX_TEXT,\
        SENTIMENT_TEXT_SORT, SENTIMENT_MAX_KEYWORDS, SENTIMENT_SECOND,\
        SENTIMENT_ITER_USER_COUNT, MAX_VALUE, RUN_TYPE, SENTIMENT_MAX_USER,\
        SENTIMENT_ITER_TEXT_COUNT, SENTIMENT_SORT_EVALUATE_MAX, str2segment, sentiment_type_list
from user_portrait.keyword_filter import keyword_filter

def get_new_ts_count_dict(ts_count_result, time_segment, date_item):
    result = {}
    now_date_ts = datetime2ts(date_item)
    segment = str2segment[time_segment]
    for ts in ts_count_result:
        new_ts = int((int(ts) - now_date_ts) / segment) * segment + now_date_ts
        try:
            result[new_ts] += int(ts_count_result[ts])
        except:
            result[new_ts] = int(ts_count_result[ts])
    now_time_ts = time.time()
    for ts in range(0, DAY, segment):
        iter_ts = now_date_ts + ts
        if iter_ts not in result and iter_ts < now_time_ts - segment:
            result[iter_ts] = 0
    return result

#use to get all sentiment trend by date
def search_sentiment_all(start_date, end_date, time_segment):
    results = {}
    start_ts = datetime2ts(start_date)
    end_ts = datetime2ts(end_date)
    search_date_list = []
    for i in range(start_ts, end_ts + DAY, DAY):
        iter_date = ts2datetime(i)
        search_date_list.append(iter_date)
    sentiment_ts_count_dict = {}
    for sentiment in sentiment_type_list:
        sentiment_ts_count_dict[sentiment] = []
        for date_item in search_date_list:
            iter_r_name = date_item + '_' + sentiment + '_all'
            #get ts_count_dict in one day
            ts_count_result = R_SENTIMENT_ALL.hgetall(iter_r_name)
            #get x and y list by timesegment
            new_ts_count_dict = get_new_ts_count_dict(ts_count_result, time_segment, date_item)
            sort_new_ts_count = sorted(new_ts_count_dict.items(), key=lambda x:x[0])
            sentiment_ts_count_dict[sentiment].extend(sort_new_ts_count)

    return sentiment_ts_count_dict

def union_dict(objs):
    _keys = set(sum([obj.keys() for obj in objs], []))
    _total = {}
    for _key in _keys:
        _total[_key] = sum([int(obj.get(_key, 0)) for obj in objs])
    return _total


#use to get all portrait sentiment trend by date
def search_sentiment_all_portrait(start_date, end_date, time_segment):
    sentiment_ts_count_dict = {}
    start_ts = datetime2ts(start_date)
    end_ts = datetime2ts(end_date)
    search_date_list = []
    domain_list = domain_en2ch_dict.keys()
    for i in range(start_ts, end_ts + DAY, DAY):
        iter_date = ts2datetime(i)
        search_date_list.append(iter_date)
    for sentiment in sentiment_type_list:
        sentiment_ts_count_dict[sentiment] = []
        for date_item in search_date_list:
            ts_count_result_list = []
            for domain in domain_list:
                iter_r_name = r_domain_sentiment_pre + date_item + '_' + sentiment + '_' + domain
                #get ts_count_dict in one day
                ts_count_result = R_DOMAIN_SENTIMENT.hgetall(iter_r_name)
                ts_count_result_list.append(ts_count_result)
            #union all domain to get all portrait
            all_ts_count_result = union_dict(ts_count_result_list)
            #get x and y list by timesegment
            new_ts_count_dict = get_new_ts_count_dict(all_ts_count_result, time_segment, date_item)
            sort_new_ts_count = sorted(new_ts_count_dict.items(), key=lambda x:x[0])
            sentiment_ts_count_dict[sentiment].extend(sort_new_ts_count)
    return sentiment_ts_count_dict

def identify_exist_task_count(submit_user):
    query_body = {
    'query':{
        'filtered':{
            'filter':{
                'bool':{
                    'must':[
                        {'term':{'submit_user': submit_user}},
                        {'term':{'status': '0'}}
                        ]
                    }
                }
            }
        }
    }
    try:
        task_exist = es_sentiment_task.search(index=sentiment_keywords_index_name, doc_type=sentiment_keywords_index_type, body=query_body)['hits']['hits']
    except:
        task_exist = []
    task_exist_count = len(task_exist)
    return task_exist_count

#use to submit keywords sentiment trend task to date
def submit_sentiment_all_keywords(keywords_string, start_date, end_date, submit_user, segment, task_max_count):
    task_information = {}
    #step0: identify the exist task count is not more than task_max_count
    task_count = identify_exist_task_count(submit_user)
    if task_count >= task_max_count:
        return 'more than limit'
    #step1: add task to sentiment_keywords es
    #step2: add task to redis queue
    add_keywords_string = '&'.join(keywords_string.split(','))
    task_information['query_keywords'] = add_keywords_string
    task_information['query_range'] = 'all_keywords'
    task_information['submit_user'] = submit_user
    task_information['segment'] = segment
    submit_ts = int(time.time())
    task_information['submit_ts'] = submit_ts
    task_information['start_date'] = start_date
    task_information['end_date'] = end_date
    task_id = str(submit_ts) + '_' + submit_user + '_' + add_keywords_string
    task_information['task_id'] = task_id
    task_information['status'] = '0'
    task_information['results'] = ''
    #add to sentiment task information
    try:
        es_sentiment_task.index(index=sentiment_keywords_index_name, \
            doc_type=sentiment_keywords_index_type, id=task_id, \
            body=task_information)
    except:
        return 'es error'
    #add to sentiment task queue
    try:
        R_SENTIMENT_KEYWORDS.lpush(r_sentiment_keywords_name, json.dumps(task_information))
    except:
        return 'redis error'

    return True

#use to delete sentiment all keywords task
def delete_sentiment_all_keywords_task(task_id):
    status = False
    print 'task_id:', task_id
    es_sentiment_task.delete(index=sentiment_keywords_index_name, \
                doc_type=sentiment_keywords_index_type, id=task_id)
    status = True
    return status

#use to search all keywords sentiment task
def search_sentiment_all_keywords_task(submit_date, keywords_string, submit_user, start_date, end_date, status):
    results = []
    query_list = []
    if submit_date:
        submit_ts_start = datetime2ts(submit_date)
        submit_ts_end = submit_ts_start + DAY
        query_list.append({'range': {'submit_ts': {'gte': submit_ts_start, 'lt':submit_ts_end}}})
    if keywords_string:
        keywords_list = keywords_string.split(',')
        query_list.append({'terms':{'query_keywords': keywords_list}})
    if submit_user:
        query_list.append({'term': {'submit_user': submit_user}})
    if start_date:
        start_s_ts = datetime2ts(start_date)
        if end_date:
            start_e_ts = datetime2ts(end_date)
        else:
            start_e_ts = start_s_ts + DAY * 30
        start_date_nest_body_list = [ts2datetime(ts) for ts in range(start_s_ts, start_e_ts + DAY, DAY)]
        query_list.append({'terms':{'start_date': start_date_nest_body_list}})
    if end_date:
        end_e_ts = datetime2ts(end_date)
        if start_date:
            end_s_ts = datetime2ts(start_date)
        else:
            end_s_ts = end_e_ts - DAY * 30
        end_date_nest_body_list = [ts2datetime(ts) for ts in range(end_s_ts, end_e_ts + DAY, DAY)]
        query_list.append({'terms': {'end_date': end_date_nest_body_list}})
    if status:
        query_list.append({'term': {'status': status}})
    try:
        task_results = es_sentiment_task.search(index=sentiment_keywords_index_name, \
                doc_type=sentiment_keywords_index_type, body={'query':{'bool':{'must':query_list}}})['hits']['hits']
    except:
        task_results = []
    for task_item in task_results:
        task_source = task_item['_source']
        task_id = task_source['task_id']
        start_date = task_source['start_date']
        end_date = task_source['end_date']
        keywords = task_source['query_keywords']
        submit_ts = ts2date(task_source['submit_ts'])
        status = task_source['status']
        segment = task_source['segment']
        results.append([task_id, start_date, end_date, keywords, submit_ts, status, segment])

    return results

def show_sentiment_all_keywords_results(task_id, time_segment):
    results = []
    try:
        task_results = es_sentiment_task.get(index=sentiment_keywords_index_name,\
            doc_type=sentiment_keywords_index_type, id=task_id)['_source']
    except:
        task_results = {}
    if not task_results:
        return results
    results = json.loads(task_results['results'])
    return results

#use to get domain sentiment trend by date for user in user_portrait
def search_sentiment_domain(domain, start_date, end_date, time_segment):
    results = {}
    #print 'start_date:', start_date
    start_ts = datetime2ts(start_date)
    end_ts = datetime2ts(end_date)
    search_date_list = []
    for i in range(start_ts, end_ts+DAY, DAY):
        iter_date = ts2datetime(i)
        search_date_list.append(iter_date)
    sentiment_ts_count_dict = {}
    for sentiment in sentiment_type_list:
        sentiment_ts_count_dict[sentiment] = []
        for date_item in search_date_list:
            iter_r_name = r_domain_sentiment_pre + date_item + '_' + sentiment + '_' + domain
            #get ts_count_dict in one day
            ts_count_result = R_DOMAIN_SENTIMENT.hgetall(iter_r_name)
            #get x and y list by timesegment
            new_ts_count_dict = get_new_ts_count_dict(ts_count_result, time_segment, date_item)
            sort_new_ts_count = sorted(new_ts_count_dict.items(), key=lambda x:x[0])
            sentiment_ts_count_dict[sentiment].extend(sort_new_ts_count)

    return sentiment_ts_count_dict

#use to get topic sentiment trend by date for user in user_portrait
def search_sentiment_topic(topic, start_date, end_date, time_segment):
    results = {}
    start_ts = datetime2ts(start_date)
    end_ts = datetime2ts(end_date)
    search_date_list = []
    for i in range(start_ts, end_ts+DAY, DAY):
        iter_date = ts2datetime(i)
        search_date_list.append(iter_date)
    sentiment_ts_count_dict = {}
    for sentiment in sentiment_type_list:
        sentiment_ts_count_dict[sentiment] = []
        for date_item in search_date_list:
            iter_r_name = r_topic_sentiment_pre + date_item + '_' + sentiment + '_' + topic
            #get ts_count_dict in one day
            ts_count_result = R_TOPIC_SENTIMENT.hgetall(iter_r_name)
            #get x and y list by timesegment
            new_ts_count_dict = get_new_ts_count_dict(ts_count_result, time_segment, date_item)
            sort_new_ts_count = sorted(new_ts_count_dict.items(), key=lambda x:x[0])
            sentiment_ts_count_dict[sentiment].extend(sort_new_ts_count)

    return sentiment_ts_count_dict


def deal_show_weibo_list(flow_text_result):
    show_weibo_list = []
    user_set = set()
    for weibo_item in flow_text_result:
        source = weibo_item['_source']
        mid = source['mid']
        uid = source['uid']
        text = source['text']
        geo = source['geo']
        timestamp = source['timestamp']
        date = ts2date(timestamp)
        weibo_url = weiboinfo2url(uid, mid)
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
        show_weibo_list.append([mid, uid, text, geo, timestamp, date, retweet_count, comment_count, sensitive_score, weibo_url])
        user_set.add(uid)
    return show_weibo_list, user_set

def get_evaluate_max():
    max_result = {}
    evaluate_index = ['influence', 'activeness', 'importance', 'sensitive']
    for evaluate in evaluate_index:
        query_body={
            'query':{
                'match_all':{}
                },
            'sort':[{evaluate: {'order':'desc'}}],
            'size': 1
            }
        try:
            result = es_user_portrait.search(index=portrait_index_name, doc_type=portrait_index_type,\
                    body=query_body)['hits']['hits']
        except:
            result = {}
        try:
            max_evaluate = result[0]['_source'][evaluate]
        except:
            max_evaluate = MAX_VALUE

        max_result[evaluate] = max_evaluate
    
    return max_result


def identify_user_portrait(user_set, filter_type):
    in_portrait_result = []
    out_portrait_result = []
    user_list = list(user_set)
    #identify the user_portrait
    iter_count = 0
    all_user_count = len(user_list)
    all_in_portrait_user = dict()
    all_out_portrait_user_list = []
    max_result = get_evaluate_max()
    while iter_count <= all_user_count:
        iter_user_list = user_list[iter_count: iter_count + SENTIMENT_ITER_USER_COUNT]
        #search  user in user_portrait
        try:
            in_portrait_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type,\
                    body={'ids': iter_user_list}, _source=False, \
                    fields=['uname', 'influence', 'activeness', 'importance', 'sensitive'])['docs']
        except:
            in_portrait_result = []
        #add all hit user
        for in_portrait_item in in_portrait_result:
            if in_portrait_item['found'] == True:
                uname = in_portrait_item['fields']['uname'][0]
                if uname == '' or uname == 'unknown':
                    uname = in_portrait_item['_id']
                influence = in_portrait_item['fields']['influence'][0]
                normal_influence = math.log(influence / max_result['influence'] * 9 + 1 , 10) * 100
                activeness = in_portrait_item['fields']['activeness'][0]
                normal_activeness = math.log(activeness / max_result['activeness'] * 9 + 1 , 10) * 100
                importance = in_portrait_item['fields']['importance'][0]
                normal_importance = math.log(importance / max_result['importance'] * 9 + 1 , 10) * 100
                try:
                    sensitive = in_portrait_item['fields']['sensitive'][0]
                    normal_sensitive = math.log(sensitive / max_result['sensitive'] * 9 + 1 , 10) * 100
                except:
                    normal_sensitive = 0
                all_in_portrait_user[in_portrait_item['_id']] = [uname, normal_influence, normal_activeness, \
                    normal_importance, normal_sensitive]
            else:
                all_out_portrait_user_list.append(int(in_portrait_item['_id']))
        iter_count += SENTIMENT_ITER_USER_COUNT
    if filter_type == 'in':
        return all_in_portrait_user
    #get out portrait user info
    iter_count = 0
    all_out_portrait_user = dict()
    all_out_user_count = len(all_out_portrait_user_list)
    while iter_count <= all_out_user_count:
        iter_uid_list = all_out_portrait_user_list[iter_count: iter_count+SENTIMENT_ITER_USER_COUNT]
        bci_iter_uid_list = [str(item) for item in iter_uid_list]
        try:
            profile_result = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type,\
                    body={'ids':iter_uid_list}, _source=False, fields=['nick_name'])['docs']
        except:
            profile_result = []
        #bci_history
        try:
            bci_history_result = es_bci_history.mget(index=bci_history_index_name, doc_type=bci_history_index_type, body={'ids': bci_iter_uid_list}, _source=False, fields=['user_fansnum', 'weibo_month_sum', 'user_friendsnum'])['docs']
        except:
            bci_history_result = []
        bci_iter_count = 0
        for uid in iter_uid_list:
            try:
                profile_item = profile_result[bci_iter_count]
            except:
                profile_item = {'found': False}
            if profile_item['found'] == True:
                uname = profile_item['fields']['nick_name'][0]
            else:
                uname= profile_item['_id']
            try:
                bci_history_item = bci_history_result[bci_iter_count]
            except:
                bci_history_item = {'found': False}
            if bci_history_item['found'] == True:
                statusnum = bci_history_item['fields']['weibo_month_sum'][0]
                fansnum = bci_history_item['fields']['user_fansnum'][0]
                friendsnum = bci_history_item['fields']['user_friendsnum'][0]
            else:
                statusnum = 0
                fansnum = 0
                friendsnum = 0
            all_out_portrait_user[str(uid)] = [uname, statusnum, friendsnum, fansnum]
            bci_iter_count += 1
        iter_count += SENTIMENT_ITER_USER_COUNT
    return all_in_portrait_user, all_out_portrait_user

def identify_user_portrait_domain_topic(user_set, filter_type, task_detail):
    #step1:get user domain/topic info from redis
    user_list = list(user_set)
    iter_count = 0
    in_count = 0
    in_user_list = []
    all_user_count = len(user_list)
    while iter_count < all_user_count:
        iter_user_list = user_list[iter_count: iter_count + SENTIMENT_ITER_USER_COUNT]
        if filter_type == 'domain':
            r_result = R_DOMAIN.hmget(r_domain_name, iter_user_list)
        elif filter_type == 'topic':
            r_result = R_TOPIC.hmget(r_topic_name, iter_user_list)
        #step2:filter user domain/topic meet task_detail
        if filter_type == 'domain':
            iter_in_count = 0
            for r_item in r_result:
                if r_item == task_detail:
                    in_user_list.append(iter_user_list[iter_in_count])
                iter_in_count += 1
            iter_count += SENTIMENT_ITER_USER_COUNT
        elif filter_type == 'topic':
            iter_in_count = 0
            for r_item in r_result:
                if r_item:
                    r_item_list = json.loads(r_item)
                    if task_detail in r_item_list:
                        in_user_list.append(iter_user_list[iter_in_count])
                iter_in_count += 1
            iter_count += SENTIMENT_ITER_USER_COUNT
    #step2:get in_portrait_user
    iter_count = 0
    all_in_user_count = len(in_user_list)
    max_result = get_evaluate_max()
    all_in_portrait_user = dict()
    while iter_count < all_in_user_count:
        iter_user_list = in_user_list[iter_count: iter_count + SENTIMENT_ITER_USER_COUNT]
        #search user in user_portrait
        try:
            in_portrait_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type,\
                    body={'ids': iter_user_list}, _source=False ,\
                    fields=['uname', 'influence', 'activeness', 'importance', 'sensitive'])['docs']
        except:
            in_portrait_result = []
        #add all hit user
        for in_portrait_item in in_portrait_result:
            if in_portrait_item['found'] == True:
                uname = in_portrait_item['fields']['uname'][0]
                influence = in_portrait_item['fields']['influence'][0]
                normal_influence = math.log(influence / max_result['influence'] * 9 + 1 ,10) * 100
                activeness = in_portrait_item['fields']['activeness'][0]
                normal_activeness = math.log(activeness / max_result['activeness'] * 9 + 1 , 10) * 100
                importance = in_portrait_item['fields']['importance'][0]
                normal_importance = math.log(importance / max_result['importance'] * 9 + 1, 10) * 100
                try:
                    sensitive = in_portrait_item['fields']['sensitive'][0]
                    normal_sensitive = math.log(sensitive / max_result['sensitive'] * 9 + 1 , 10) * 100
                except:
                    normal_sensitive = 0
                all_in_portrait_user[in_portrait_item['_id']] = [uname, normal_influence, normal_activeness,\
                        normal_importance, normal_sensitive]

        iter_count += SENTIMENT_ITER_USER_COUNT
    return all_in_portrait_user

def add_uname2weibo(weibo_list, in_portrait_dict, out_portrait_dict):
    new_weibo_list = []
    for weibo_item in weibo_list:
        uid = weibo_item[1]
        try:
            uname = in_portrait_dict[uid][0]
        except:
            uname= out_portrait_dict[uid][0]
        weibo_item.append(uname)
        new_weibo_list.append(weibo_item)
    return new_weibo_list



def search_sentiment_detail_all(start_ts, task_type, task_detail, time_segment, sentiment, sort_type):
    results = {}
    #step1:get weibo from flow_text
    start_ts = int(start_ts)
    start_date = ts2datetime(start_ts)
    end_ts = start_ts + str2segment[time_segment]
    if sentiment == '7':
        query_sentiment_list = SENTIMENT_SECOND
    else:
        query_sentiment_list = [sentiment]
    if sort_type == 'retweet':
        sort_type = 'retweeted'
    now_date = ts2datetime(time.time())
    if now_date == start_date:
        sort_type = 'timestamp'
    sort_evaluate_max = SENTIMENT_SORT_EVALUATE_MAX
    in_user_result = {}
    out_user_result = {}
    all_filter_weibo_list = []
    while len(in_user_result) < SENTIMENT_MAX_USER:
        query_body = {
            'query':{
                'filtered':{
                    'filter':{
                        'bool':{
                            'must':[
                                {'range':{
                            'timestamp':{
                                'gte': start_ts,
                                'lt': end_ts
                                }
                            }},
                            {'terms':{
                            'sentiment': query_sentiment_list
                            }},
                            {'range': {sort_type: {'lt': sort_evaluate_max}}}
                            ]
                        }
                        }
                    }
                },
            'size': SENTIMENT_ITER_TEXT_COUNT,
            'sort': [{sort_type: {'order': 'desc'}}]
            }
        flow_text_index_name = flow_text_index_name_pre + start_date
        #print 'flow_text_index_name:', flow_text_index_name
        try:
            flow_text_result = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
                body=query_body)['hits']['hits']
        except:
            flow_text_result = []
        #print 'show weibo list'
        if not flow_text_result:
            break
        show_weibo_list, user_set = deal_show_weibo_list(flow_text_result)
        print 'show_weibo_list:', len(show_weibo_list)
        #print 'get keywords'
        filter_type = 'in-out'
        in_portrait_result, out_portrait_result = identify_user_portrait(user_set, filter_type)
        print 'in_portrait_result:', len(in_portrait_result)
        print 'out_portrait_result:', len(out_portrait_result)
        if len(all_filter_weibo_list) <= SENTIMENT_MAX_TEXT and show_weibo_list:
            all_filter_weibo_list.extend(show_weibo_list)
        if in_portrait_result:
            in_user_result = dict(in_user_result, **in_portrait_result)
        if out_portrait_result:
            out_user_result = dict(out_user_result, **out_portrait_result)
        sort_evaluate_max = flow_text_result[-1]['_source'][sort_type]
    
    #step2:get keywords from flow_text
    keyword_query_dict = {
            'query':{
                'filtered':{
                    'filter':{
                        'range':{
                            'timestamp':{
                                'gte': start_ts,
                                'lt': end_ts
                                }
                            }
                        }
                    }
                },
            'aggs':{
                'all_interests':{
                    'terms':{
                        'field':'keywords_string',
                        'size': SENTIMENT_MAX_KEYWORDS
                        }
                    }
                }
            }
    show_keywords_dict = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
            body=keyword_query_dict)['aggregations']['all_interests']['buckets']
    before_keyword_dict = dict()
    for item in show_keywords_dict:
        before_keyword_dict[item['key']] = item['doc_count']
    after_keyword_dict = keyword_filter(before_keyword_dict)
    keywords_list = sorted(after_keyword_dict.items(), key=lambda x:x[1], reverse=True)
    #step3:get user information
    #print 'get user'
    #filter_type = 'in-out'
    #in_portrait_result, out_portrait_result = identify_user_portrait(user_set, filter_type)
    in_portrait_result = in_user_result
    out_portrait_result = out_user_result
    #step4: add uname to show weibo list
    show_weibo_list = add_uname2weibo(all_filter_weibo_list, in_portrait_result, out_portrait_result)
    #step4: results
    results['weibo'] = show_weibo_list
    results['in_portrait_result'] = sorted(in_portrait_result.items(), key=lambda x:x[1][1], reverse=True)[:SENTIMENT_MAX_USER]
    results['out_portrait_result'] = sorted(out_portrait_result.items(), key=lambda x:x[1][3], reverse=True)[:SENTIMENT_MAX_USER]
    results['keywords'] = keywords_list
    return results

def search_sentiment_detail_all_keywords(start_ts, task_type, task_detail, time_segment, sentiment, sort_type):
    results = {}
    must_query_list = []
    if sort_type=='retweet':
        sort_type = 'retweeted'
    start_ts_date = ts2datetime(int(start_ts))
    now_date = ts2datetime(time.time())
    if start_ts_date == now_date:
        sort_type = 'timestamp'
    #step0: get query keywords list
    keyword_nest_body_list = []
    keywords_list = task_detail.split(',')
    #print 'keywords_list:', keywords_list
    for keywords_item in keywords_list:
        #print 'keywords_item:', keywords_item
        keyword_nest_body_list.append({'wildcard':{'text': '*' + keywords_item + '*'}})
    must_query_list.append({'bool':{'should': keyword_nest_body_list}})
    #step1: get weibo from flow_text
    start_ts = int(start_ts)
    start_date = ts2datetime(start_ts)
    end_ts = start_ts + str2segment[time_segment]
    if sentiment == '7':
        query_sentiment_list = SENTIMENT_SECOND
    else:
        query_sentiment_list = [sentiment]
    must_query_list.append({'range': {'timestamp': {'gte': start_ts, 'lt':end_ts}}})
    must_query_list.append({'terms': {'sentiment': query_sentiment_list}})
    in_user_result = {}
    out_user_result = {}
    all_filter_weibo_list = []
    sort_evaluate_max = SENTIMENT_SORT_EVALUATE_MAX
    while len(in_user_result) < SENTIMENT_MAX_USER:
        query_body = {
            'query':{
                'bool':{
                    'must': [
                        {'range':{sort_type: {'lt': sort_evaluate_max}}},
                        {'range':{'timestamp':{'gte': start_ts, 'lt': end_ts}}},
                        {'terms':{'sentiment': query_sentiment_list}},
                        {'bool':{'should': keyword_nest_body_list}}
                    ]
                }
            },
        'size': SENTIMENT_ITER_TEXT_COUNT,
        'sort': [{sort_type: {'order': 'desc'}}]
        }
        flow_text_index_name = flow_text_index_name_pre + start_date
        #print 'flow_text_index_name:', flow_text_index_name
        try:
            flow_text_result = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
                body=query_body)['hits']['hits']
        except:
            flow_text_result = []
        #print 'flow_text_result:', len(flow_text_result)
        #print 'show weibo list'
        if not flow_text_result:
            break
        show_weibo_list, user_set = deal_show_weibo_list(flow_text_result)
        filter_type = 'in-out'
        in_portrait_result, out_portrait_result = identify_user_portrait(user_set, filter_type)
        if len(all_filter_weibo_list) <= SENTIMENT_MAX_TEXT and show_weibo_list:
            all_filter_weibo_list.extend(show_weibo_list)
        if in_portrait_result:
            in_user_result = dict(in_user_result, **in_portrait_result)
        if out_portrait_result:
            out_user_result = dict(out_user_result, **out_portrait_result)
        sort_evaluate_max = flow_text_result[-1]['_source'][sort_type]

    #print 'get keyword'
    #step2: get keywords from flow_text
    keyword_query_dict = {
        'query':{
            'bool':{
                'must':must_query_list
                }
            },
        'aggs':{
            'all_interests': {
                'terms': {
                    'field': 'keywords_string',
                    'size': SENTIMENT_MAX_KEYWORDS
                    }
                }
            }
        }
    show_keywords_dict = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
            body=keyword_query_dict)['aggregations']['all_interests']['buckets']
    keywords_list = [[item['key'], item['doc_count']] for item in show_keywords_dict]
    #step3: get user information
    #filter_type = 'in-out'
    #in_portrait_result, out_portrait_result = identify_user_portrait(user_set, filter_type)
    in_portrait_result = in_user_result
    out_portrait_result = out_user_result
    #step4: add uname to show weibo list
    show_weibo_list = add_uname2weibo(all_filter_weibo_list, in_portrait_result, out_portrait_result)
    #step5: results
    results['weibo'] = show_weibo_list
    results['in_portrait_result'] = sorted(in_portrait_result.items(), key=lambda x:x[1][1], reverse=True)[:SENTIMENT_MAX_USER]
    results['out_portrait_result'] = sorted(out_portrait_result.items(), key=lambda x:x[1][3], reverse=True)[:SENTIMENT_MAX_USER]
    results['keywords'] = keywords_list
    return results

def filter_weibo_in(weibo_list, in_portrait_dict):
    filter_weibo_list = []
    for weibo_item in weibo_list:
        uid = weibo_item[1]
        try:
            uname = in_portrait_dict[uid][0]
        except:
            uname = ''
        if uname:
            new_weibo_item = weibo_item
            new_weibo_item.append(uname)
            filter_weibo_list.append(new_weibo_item)

    return filter_weibo_list




def search_sentiment_detail_in_all(start_ts, task_type, task_detail, time_segment, sentiment, sort_type):
    results = {}
    start_ts = int(start_ts)
    start_date = ts2datetime(start_ts)
    end_ts = start_ts + str2segment[time_segment]
    if sort_type == 'retweet':
        sort_type = 'retweeted'
    now_date = ts2datetime(time.time())
    if now_date == start_date:
        sort_type = 'timestamp'
    #print 'start_ts:', start_ts
    #print 'end_ts:', end_ts
    if sentiment == '7':
        query_sentiment_list = SENTIMENT_SECOND
    else:
        query_sentiment_list = [sentiment]
    #step1: iter get weibo and user in portrait
    in_user_count = 0
    in_user_result = {}
    all_filter_weibo_list = []
    sort_evaluate_max = SENTIMENT_SORT_EVALUATE_MAX
    flow_text_index_name = flow_text_index_name_pre + start_date
    print 'flow_text_index_name:', flow_text_index_name
    print 'sort_type:', sort_type
    while len(in_user_result)< SENTIMENT_MAX_USER:
        #print 'in_user_count:', len(in_user_result)
        #print 'sort_evaluate_max:', sort_evaluate_max
        query_body = {
            'query':{
                'filtered':{
                    'filter':{
                        'bool':{
                            'must':[
                                {'range':{sort_type: {'lt': sort_evaluate_max}}},
                                {'terms':{'sentiment': query_sentiment_list}},
                                {'range': {'timestamp': {'gte': start_ts, 'lt': end_ts}}}
                                ]
                            }
                        }
                    }
                },
            'sort': [{sort_type: {'order': 'desc'}}],
            'size': SENTIMENT_ITER_TEXT_COUNT
            }
        #print 'query_body:', query_body
        try:
            flow_text_result = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
                body=query_body)['hits']['hits']
        except:
            flow_text_result = []
        #print 'flow_text_result:', len(flow_text_result)
        if not flow_text_result:
            break
        weibo_list, user_set = deal_show_weibo_list(flow_text_result)
        filter_type = 'in'
        in_portrait_result = identify_user_portrait(user_set, filter_type)
        filter_weibo_list = filter_weibo_in(weibo_list, in_portrait_result)
        if filter_weibo_list:
            all_filter_weibo_list.extend(filter_weibo_list)
        if in_portrait_result:
            in_user_result = dict(in_user_result, **in_portrait_result)
        sort_evaluate_max = flow_text_result[-1]['_source'][sort_type]
    query_uid_list = in_user_result.keys()
    #step2: get keywords from flow_text
    #print 'get keyword'
    keyword_query_dict = {
            'query':{
                'filtered':{
                    'filter':{
                        'bool':{
                            'must':[
                                {'range': {'timestamp':{'gte': start_ts, 'lt': end_ts}}},
                                {'terms': {'uid': query_uid_list}}
                            ]
                        }
                    }
                }
            },
            'aggs':{
                'all_interests':{
                    'terms':{
                        'field': 'keywords_string',
                        'size': SENTIMENT_MAX_KEYWORDS
                    }
                    }
            }
        }
    show_keywords_dict = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
            body=keyword_query_dict)['aggregations']['all_interests']['buckets']
    keywords_list = [[item['key'], item['doc_count']] for item in show_keywords_dict]
    #step3: get results
    results['weibo'] = all_filter_weibo_list
    results['in_portrait_result'] = sorted(in_user_result.items(), key=lambda x:x[1][1], reverse=True)
    results['keywords'] = keywords_list
    return results

def search_sentiment_detail_in_domain(start_ts, task_type, task_detail, time_segment, sentiment, sort_type):
    results = {}
    start_ts=  int(start_ts)
    start_date = ts2datetime(start_ts)
    end_ts = start_ts + str2segment[time_segment]
    if sort_type == 'retweet':
        sort_type = 'retweeted'
    now_date = ts2datetime(time.time())
    if now_date == start_date:
        sort_type = 'timestamp'
    #print 'start_ts:', ts2date(start_ts)
    #print 'end_ts:', ts2date(end_ts)
    if sentiment == '7':
        query_sentiment_list = SENTIMENT_SECOND
    else:
        query_sentiment_list = [sentiment]
    user_domain = task_detail
    #step1: iter get weibo and user in domain
    iter_user_count = 0
    in_user_result = {}
    all_filter_weibo_list = []
    sort_evaluate_max= SENTIMENT_SORT_EVALUATE_MAX
    flow_text_index_name = flow_text_index_name_pre + start_date
    #print 'flow_text_index_name:', flow_text_index_name
    while len(in_user_result) < SENTIMENT_MAX_USER:
        #print 'in_user_result:', len(in_user_result)
        #print 'sort_evaluate_max:', sort_evaluate_max
        query_body ={
            'query':{
                'filtered':{
                    'filter':{
                        'bool':{
                            'must':[
                                {'range':{sort_type: {'lt': sort_evaluate_max}}},
                                {'terms':{'sentiment': query_sentiment_list}},
                                {'range':{'timestamp': {'gte': start_ts, 'lt': end_ts}}}
                            ]
                        }
                    }
                }
            },
            'sort': [{sort_type: {'order': 'desc'}}],
            'size': SENTIMENT_ITER_TEXT_COUNT
        }
        try:
            flow_text_result = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
                    body=query_body)['hits']['hits']
        except:
            flow_text_result = []
        #print 'len flow_text_result:', len(flow_text_result)
        if not flow_text_result:
            break
        weibo_list, user_set = deal_show_weibo_list(flow_text_result)
        #filter domain user
        filter_type = 'domain'
        #print 'identify user portrait domain topic'
        in_portrait_result = identify_user_portrait_domain_topic(user_set, filter_type, user_domain)
        filter_weibo_list = filter_weibo_in(weibo_list, in_portrait_result)
        if filter_weibo_list:
            all_filter_weibo_list.extend(filter_weibo_list)
        if in_portrait_result:
            in_user_result = dict(in_user_result, **in_portrait_result)
        sort_evaluate_max = flow_text_result[-1]['_source'][sort_type]
    query_uid_list = in_user_result.keys()
    #step2: get keywords from flow_text
    #print 'get keyword'
    keyword_query_dict = {
        'query':{
            'filtered':{
                'filter':{
                    'bool':{
                        'must':[
                            {'range':{'timestamp': {'gte': start_ts, 'lt': end_ts}}},
                            {'terms': {'uid': query_uid_list}}
                            ]
                        }
                    }
                }
            },
        'aggs':{
            'all_interests':{
                'terms':{
                    'field': 'keywords_string',
                    'size': SENTIMENT_MAX_KEYWORDS
                    }
                }
            }
        }
    show_keywords_dict = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
            body=keyword_query_dict)['aggregations']['all_interests']['buckets']
    keywords_list = [[item['key'], item['doc_count']] for item in show_keywords_dict]
    #step3: get results
    results['weibo'] = all_filter_weibo_list
    results['in_portrait_result'] = sorted(in_user_result.items(), key=lambda x:x[1][1], reverse=True)
    results['keywords'] = keywords_list
    return results

def search_sentiment_detail_in_topic(start_ts, task_type, task_detail, time_segment, sentiment, sort_type):
    results = {}
    start_ts = int(start_ts)
    start_date = ts2datetime(start_ts)
    end_ts = start_ts + str2segment[time_segment]
    if sort_type == 'retweet':
        sort_type = 'retweeted'
    now_date = ts2datetime(time.time())
    if start_date == now_date:
        sort_type = 'timestamp'
    #print 'start_ts:', ts2datetime(start_ts)
    #print 'end_ts:', ts2datetime(end_ts)
    if sentiment == '7':
        query_sentiment_list = SENTIMENT_SECOND
    else:
        query_sentiment_list = [sentiment]
    user_topic = task_detail
    #step1: iter get weibo and user in topic
    iter_user_count = 0
    in_user_result = {}
    all_filter_weibo_list = []
    sort_evaluate_max = SENTIMENT_SORT_EVALUATE_MAX
    flow_text_index_name = flow_text_index_name_pre + start_date
    #print 'flow_text_index_name:', flow_text_index_name
    while len(in_user_result) < SENTIMENT_MAX_USER:
        #print 'in_user_result:', len(in_user_result)
        #print 'sort_evaluate_max:', sort_evaluate_max
        query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'bool':{
                        'must':[
                            {'range': {sort_type: {'lt': sort_evaluate_max}}},
                            {'terms': {'sentiment': query_sentiment_list}},
                            {'range': {'timestamp':{'gte': start_ts, 'lt': end_ts}}}
                            ]
                        }
                    }
                }
            },
        'sort': [{sort_type: {'order': 'desc'}}],
        'size': SENTIMENT_ITER_TEXT_COUNT
        }
        try:
            flow_text_result = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
                    body=query_body)['hits']['hits']
        except:
            flow_text_result = []
        #print 'len flow_text_result:', len(flow_text_result)
        if not flow_text_result:
            break
        weibo_list, user_set = deal_show_weibo_list(flow_text_result)
        #filter topic user
        filter_type = 'topic'
        #print 'identify user portrait topic'
        in_portrait_result = identify_user_portrait_domain_topic(user_set, filter_type, user_topic)
        filter_weibo_list = filter_weibo_in(weibo_list, in_portrait_result)
        if filter_weibo_list:
            all_filter_weibo_list.extend(filter_weibo_list)
        if in_portrait_result:
            in_user_result = dict(in_user_result, **in_portrait_result)
        sort_evaluate_max = flow_text_result[-1]['_source'][sort_type]
    query_uid_list = in_user_result.keys()
    #step2: get keywords from flow_text
    #print 'get keyword'
    keyword_query_dict = {
            'query':{
                'filtered':{
                    'filter':{
                        'bool':{
                            'must':[
                                {'range': {'timestamp': {'gte': start_ts, 'lt': end_ts}}},
                                {'terms': {'uid': query_uid_list}}
                            ]
                        }
                    }
                }
            },
            'aggs':{
                'all_interests':{
                    'terms':{
                        'field': 'keywords_string',
                        'size': SENTIMENT_MAX_KEYWORDS
                    }
                }
            }
        }
    show_keywords_dict = es_flow_text.search(index=flow_text_index_name, doc_type=flow_text_index_type,\
            body=keyword_query_dict)['aggregations']['all_interests']['buckets']
    keywords_list = [[item['key'], item['doc_count']] for item in show_keywords_dict]
    #step3: get results
    results['weibo'] = all_filter_weibo_list
    results['in_portrait_result'] = sorted(in_user_result.items(), key=lambda x:x[1][1], reverse=True)
    results['keywords'] = keywords_list
    return results

#use to get sentiment trend point weibo and keywords and user
def search_sentiment_weibo_keywords(start_ts, task_type, task_detail, time_segment, sentiment,sort_type):
    results = {}
    #step1: identify the task type
    #step2: get weibo
    #step3: get keywords
    #step4: get user who in user_portrait or not
    if task_type=='all':
        results = search_sentiment_detail_all(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)
    elif task_type=='all-keywords':
        results = search_sentiment_detail_all_keywords(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)
    elif task_type=='in-all':
        results = search_sentiment_detail_in_all(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)
    elif task_type=='in-domain':
        results = search_sentiment_detail_in_domain(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)
    elif task_type=='in-topic':
        results = search_sentiment_detail_in_topic(start_ts, task_type, task_detail, time_segment, sentiment, sort_type)

    return results

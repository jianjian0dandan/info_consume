#-*- coding:utf-8 -*-

import sys
import time
import json
import math
from user_portrait.global_utils import R_RECOMMENTATION as r
from user_portrait.parameter import DAY, WEEK, RUN_TYPE, RUN_TEST_TIME, MAX_VALUE
from user_portrait.time_utils import ts2datetime, datetime2ts, ts2date, date2ts
from user_portrait.global_utils import es_user_profile, portrait_index_name, portrait_index_type
from user_portrait.global_utils import ES_CLUSTER_FLOW1 as es_cluster
from user_portrait.global_utils import es_group_result, group_index_name, group_index_type,\
        es_social_sensing, sensing_index_name, sensing_doc_type,\
        es_sentiment_task, sentiment_keywords_index_name, sentiment_keywords_index_type,\
        es_network_task, network_keywords_index_name, network_keywords_index_type, \
        es_rank_task, rank_keywords_index_name, rank_keywords_index_type, \
        admin_note_redis, admin_note_key, r_sensitive_words_key, R_ADMIN, \
        es_operation, operation_index_name, operation_index_type

def get_user_operation(submit_user):
    result = {}
    #step1: get user recommentation in operation
    result_recommentation = get_recommentation(submit_user)
    #result.append(result_recommentation)
    result['recomment'] = result_recommentation # result_recommentation = []
    #step2: get user group detect task
    result_group_detect = get_group_detect(submit_user)
    result['group_detect'] = result_group_detect # result_group_detect = []
    #step3: get user group analysis task
    result_group_analysis = get_group_analysis(submit_user)
    result['group_analysis'] = result_group_analysis # result_group_analysis = []
    #step4: get user sentiment trend task
    result_sentiment_task = get_sentiment_task(submit_user)
    result['sentiment_task'] = result_sentiment_task # result_sentiment_task = []
    #step5: get user user rank task
    result_rank_task = get_rank_task(submit_user)
    result['rank_task'] = result_rank_task # result_rank_task = []
    #step6: get user network task
    result_network_task = get_network_task(submit_user)
    result['network_task'] = result_network_task # result_network_task = []
    #step7: get user social sensing task
    result_sensing_task = get_sensing_task(submit_user)
    result['sensing_task'] = result_sensing_task # result_sensing_task = []
    return result

# use to get user rank keywords task
def get_rank_task(submit_user):
    results = []
    #run type
    if RUN_TYPE == 0:
        submit_user = 'admin@qq.com'
    #step1: query body
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'term':{'submit_user': submit_user}
                    }
                }
            },
        'size': MAX_VALUE
        }
    #step2: search
    try:
        rank_task_result = es_rank_task.search(index=rank_keywords_index_name,\
                doc_type=rank_keywords_index_type, body=query_body)['hits']['hits']
    except:
        rank_task_result = []
    #step3: get results
    for task_item in rank_task_result:
        source = task_item['_source']
        submit_date = source['submit_time']
        keyword = source['keyword']
        try:
            keyword = json.loads(keyword)
        except:
            keyword = []
        sort_scope = source['sort_scope']
        sort_index = source['sort_norm']
        status = source['status']
        submit_ts = datetime2ts(submit_date)
        results.append([keyword, sort_index, submit_date, status, sort_scope,submit_ts])
    #step4: sort results
    sort_results = sorted(results, key=lambda x:x[4], reverse=True)
    return results


# use to get network task
def get_network_task(submit_user):
    results = []
    #step1: query body
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'term':{'submit_user': submit_user}
                    }
                }
            },
        'sort': [{'submit_ts': {'order': 'desc'}}],
        'size': MAX_VALUE
        }
    #step2: search
    #try:
    network_task_result = es_network_task.search(index=network_keywords_index_name, \
                doc_type=network_keywords_index_type, body=query_body)['hits']['hits']
    #except:
    #    network_task_result = []
    #step3: get results
    for task_item in network_task_result:
        source = task_item['_source']
        task_id = source['task_id']
        submit_ts = source['submit_ts']
        submit_date = ts2date(submit_ts)
        keywords = source['query_keywords']
        start_date = source['start_date']
        end_date = source['end_date']
        status = source['status']
        results.append([task_id, keywords, submit_date, start_date, end_date, status])
    return results


# use to get group detect task from es--group_manage_v2
def get_group_detect(submit_user):
    results = []
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'bool':{
                        'must':[
                            {'term': {'submit_user': submit_user}},
                            {'term': {'task_type': 'detect'}}
                            ]
                        }
                    }
                }
            },
        'sort':[{'submit_date': {'order': 'desc'}}],
        'size': MAX_VALUE
        }
    #search group task
    try:
        group_task_result = es_group_result.search(index=group_index_name, doc_type=group_index_type,\
                body=query_body)['hits']['hits']
    except:
        group_task_result = []
    #group task results
    for group_item in group_task_result:
        source = group_item['_source']
        task_name = source['task_name']
        task_process = source['detect_process']
        submit_ts = source['submit_date']
        submit_date = ts2date(submit_ts)
        state = source['state']
        task_type = source['detect_type']
        results.append([task_name, submit_date, state, task_type, task_process])
    return results

#use to get group analysis task
def get_group_analysis(submit_user):
    results = []
    #step1: get query body
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'bool':{
                        'must':[
                            {'term': {'submit_user': submit_user}},
                            {'term': {'task_type': 'analysis'}}
                            ]
                        }
                    }
                }
            },
        'sort': [{'submit_date': {'order': 'desc'}}],
        'size': MAX_VALUE
        }
    #step2: search
    try:
        group_task_result = es_group_result.search(index=group_index_name, doc_type=group_index_type,\
                body=query_body)['hits']['hits']
    except:
        group_task_result = []
    #step3: task results
    for group_item in group_task_result:
        source = group_item['_source']
        task_name = source['task_name']
        if not task_name:
            continue
        task_status = source['status']
        submit_ts = source['submit_date']
        submit_date = ts2date(submit_ts)
        try:
            state = source['state']
        except:
            state = ''
        results.append([task_name, submit_date, state, task_status])

    return results

# use to get sentiment task
def get_sentiment_task(submit_user):
    results = []
    #run type
    if RUN_TYPE == 0:
        submit_user = 'admin@qq.com'
    #step1:query_body
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                     'term': {'submit_user': submit_user}
                    }
                }
            },
        'size': MAX_VALUE
        }
    #step2:search
    try:
        sentiment_task_result = es_sentiment_task.search(index=sentiment_keywords_index_name,\
                doc_type=sentiment_keywords_index_type, body=query_body)['hits']['hits']
    except:
        sentiment_task_result = []
    #step3:query results
    for task_item in sentiment_task_result:
        source = task_item['_source']
        task_id = source['task_id']
        query_keywords = source['query_keywords']
        submit_ts = source['submit_ts']
        submit_date = ts2date(submit_ts)
        start_date = source['start_date']
        end_date = source['end_date']
        status = source['status']
        results.append([task_id, query_keywords, start_date, end_date, \
                submit_date, status, submit_ts])
    #step4:sort by query_ts
    sort_results = sorted(results, key=lambda x:x[6],reverse=True)
    return sort_results

def get_sensing_task(submit_user):
    results = []
    #step1: query_body
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'term': {'create_by': submit_user}
                    }
                }
            },
        'size': MAX_VALUE,
        'sort': [{'create_at': {'order': 'desc'}}]
        }
    #step2: search
    try:
        sensing_task_result = es_social_sensing.search(index=sensing_index_name, doc_type=sensing_doc_type,\
                body=query_body)['hits']['hits']
    except:
        sensing_task_result = []
    #step3: task results
    for task_item in sensing_task_result:
        source = task_item['_source']
        task_name = source['task_name']
        status = source['processing_status']
        remark = source['remark']
        submit_ts = source['create_at']
        if submit_ts:
            submit_date = ts2date(int(submit_ts))
            results.append([task_name, submit_date, remark, status])

    return results


def get_recommentation(submit_user):
    if RUN_TYPE:
        now_ts = time.time()
    else:
        now_ts = datetime2ts(RUN_TEST_TIME)

    in_portrait_set = set(r.hkeys("compute"))
    result = []
    for i in range(7):
        iter_ts = now_ts - i*DAY
        iter_date = ts2datetime(iter_ts)
        submit_user_recomment = "recomment_" + submit_user + "_" + str(iter_date)
        bci_date = ts2datetime(iter_ts - DAY)
        submit_user_recomment = r.hkeys(submit_user_recomment)
        bci_index_name = "bci_" + bci_date.replace('-', '')
        exist_bool = es_cluster.indices.exists(index=bci_index_name)
        if not exist_bool:
            continue
        if submit_user_recomment:
            user_bci_result = es_cluster.mget(index=bci_index_name, doc_type="bci", body={'ids':submit_user_recomment}, _source=True)['docs']
            user_profile_result = es_user_profile.mget(index='weibo_user', doc_type='user', body={'ids':submit_user_recomment}, _source=True)['docs']
            max_evaluate_influ = get_evaluate_max(bci_index_name)
            for i in range(len(submit_user_recomment)):
                uid = submit_user_recomment[i]
                bci_dict = user_bci_result[i]
                profile_dict = user_profile_result[i]
                try:
                    bci_source = bci_dict['_source']
                except:
                    bci_source = None
                if bci_source:
                    influence = bci_source['user_index']
                    influence = math.log(influence/max_evaluate_influ['user_index'] * 9 + 1 ,10)
                    influence = influence * 100
                else:
                    influence = ''
                try:
                    profile_source = profile_dict['_source']
                except:
                    profile_source = None
                if profile_source:
                    uname = profile_source['nick_name']
                    location = profile_source['user_location']
                    fansnum = profile_source['fansnum']
                    statusnum = profile_source['statusnum']
                else:
                    uname = ''
                    location = ''
                    fansnum = ''
                    statusnum = ''
                if uid in in_portrait_set:
                    in_portrait = "1"
                else:
                    in_portrait = "0"
                recomment_day = iter_date
                result.append([iter_date, uid, uname, location, fansnum, statusnum, influence, in_portrait])

    return result    
   

def get_evaluate_max(index_name):
    max_result = {}
    index_type = 'bci'
    evaluate_index = ['user_index']
    for evaluate in evaluate_index:
        query_body = {
            'query':{
                'match_all':{}
                },
            'size':1,
            'sort':[{evaluate: {'order': 'desc'}}]
            }
        try:
            result = es_cluster.search(index=index_name, doc_type=index_type, body=query_body)['hits']['hits']
        except Exception, e:
            raise e
        max_evaluate = result[0]['_source'][evaluate]
        max_result[evaluate] = max_evaluate
    return max_result

 
def submit_admin_note(submit_info_dict):
     status = False
     submit_info = submit_info_dict['submit_info']
     #add submit_info to redis
     try:
         admin_note_redis.sadd(admin_note_key, submit_info)
         status = True
     except:
         return status
     return status

def delete_admin_note():
    status = False
    try:
        admin_note_redis.spop(admin_note_key)
        status = True
    except:
        return status
    return status

def show_admin_note():
    admin_note_string = ''
    try:
        admin_note_set = admin_note_redis.smembers(admin_note_key)
        admin_note_string = list(admin_note_set)[0]
    except:
        return admin_note_string
    return admin_note_string

def modify_admin_note(modify_info_dict):
    status = False
    modify_note_info = modify_info_dict['submit_info']
    try:
        admin_note_redis.spop(admin_note_key)
        admin_note_redis.sadd(admin_note_key ,modify_note_info)
        status = True
    except:
        return status
    return status

def show_sensitive_words():
    results = {}
    try:
        results = R_ADMIN.hgetall(r_sensitive_words_key)
    except:
        results = {}
    return results

def add_sensitive_words(add_words_dict):
    status = False
    add_words_list = add_words_dict.keys()
    #step1: identify the words is not exist
    print 'add_words_list:', add_words_list
    exist_word_set = set()
    for add_word in add_words_list:
        if add_word:
            try:
                exist_mark = R_ADMIN.hexists(r_sensitive_words_key, add_word)
            except:
                exist_mark = 0
            if exist_mark == 1:
                exist_word = add_word
                add_words_dict.pop(exist_word)
                exist_word_set.add(exist_word)
    #step2: add words(not have been exist) to redis
    if add_words_dict:
        try:
            R_ADMIN.hmset(r_sensitive_words_key, add_words_dict)
            status = True
        except:
            status = False
    #step3: return have been exist words dict
    if exist_word_set:
        exist_word_list = list(exist_word_set)
    else:
        exist_word_list = []

    return status, exist_word_list

def modify_sensitive_words(modify_words_dict):
    status = False
    not_exist_word_list = []
    #step1: identify the word exist
    for modify_word in modify_words_dict:
        exist_mark = R_ADMIN.hexists(r_sensitive_words_key, modify_word)
        if exist_mark == 0:
            modify_words_dict.pop(modify_word)
            not_exist_word_list.append(modify_word)
    #step2: modify sensitive word rank
    if modify_words_dict:
        #try:
        R_ADMIN.hmset(r_sensitive_words_key, modify_words_dict)
        status = True
        #except:
        #    status = False
    #test
    print 'modify result:', modify_words_dict
    return status, not_exist_word_list

def delete_sensitive_words(delete_words_list):
    status = False
    #step1: identify the word exist
    #step2: delete th word
    no_exist_word_list = []
    for word in delete_words_list:
        exist_mark = R_ADMIN.hexists(r_sensitive_words_key, word)
        if exist_mark == 1:
            R_ADMIN.hdel(r_sensitive_words_key, word)
            status = True
        else:
            no_exist_word_list.append(word)

    return status, no_exist_word_list


def show_user_operation_index(admin_user, start_ts, end_ts):
    results = {}
    if admin_user == '' and start_ts == '' and end_ts == '':
        query_body = {
        'query': {
            'match_all':{}
            },
        'size': MAX_VALUE
        }
    elif admin_user and start_ts and end_ts:
        start = datetime2ts(start_ts) - 1
        end = datetime2ts(end_ts) + DAY
        query_body = {
        'query':{
            'bool':{
                'must':[
                    {'term': {'admin_user': admin_user}},
                    {'range':{'timestamp': {'gte': start, 'lt': end}}}
                    ]
                }
            },
         'size': MAX_VALUE
        }
    elif admin_user and (start_ts == '' or end_ts == ''):
        query_body = {
        'query':{
            'term':{'admin_user': admin_user}
            },
        'size': MAX_VALUE
        }
    elif admin_user == '' and start_ts != '' and end_ts != '':
        start = datetime2ts(start_ts) - 1
        end = datetime2ts(end_ts) + DAY
        query_body = {
        'query':{
            'range':{'timestamp':{'gte': start, 'lt': end}}
            },
        'size': MAX_VALUE
        }
    try:
        results = es_operation.search(index=operation_index_name, doc_type=operation_index_type, body=query_body)['hits']['hits']
    except:
        results = []
    return_results = []
    all_operation_dict = {}
    stat_operation_list = ['rank_count', 'compute_count', 'sentiment_count',\
    'recomment_count', 'detect_count', 'analysis_count', 'tag_count', 'network_count', 'sensing_count']
    for item in results:
        source = item['_source']
        return_results.append(source)
        for stat_item in stat_operation_list:
            try:
                all_operation_dict[stat_item] += source[stat_item]
            except:
                all_operation_dict[stat_item] = source[stat_item]
    sort_return_results = sorted(return_results, key=lambda x:x['timestamp'], reverse=False)
    if sort_return_results:
        sort_return_results.append(all_operation_dict)
    return sort_return_results
    

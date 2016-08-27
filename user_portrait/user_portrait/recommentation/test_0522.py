# -*- coding: UTF-8 -*-

import csv
import IP
import sys
import csv
import time
import datetime
import math
import json
import redis
from elasticsearch import Elasticsearch
from update_activeness_record import update_record_index
sys.path.append('../')
from global_utils import R_RECOMMENTATION as r
from global_utils import R_RECOMMENTATION_OUT as r_out
from global_utils import R_CLUSTER_FLOW3 as r_cluster
from global_utils import R_CLUSTER_FLOW2 as r_cluster2
from global_utils import es_user_portrait as es
from global_utils import es_user_portrait
from global_utils import es_user_profile, portrait_index_name, portrait_index_type, profile_index_name, profile_index_type
from global_utils import ES_CLUSTER_FLOW1 as es_cluster
from global_utils import es_bci_history, bci_history_index_name, bci_history_index_type, ES_SENSITIVE_INDEX, DOCTYPE_SENSITIVE_INDEX
from filter_uid import all_delete_uid
from time_utils import ts2datetime, datetime2ts
from global_utils import portrait_index_name, portrait_index_type, profile_index_name, profile_index_type
from parameter import DAY, WEEK, RUN_TYPE, RUN_TEST_TIME,MAX_VALUE,sensitive_score_dict


def get_user_detail(date, input_result, status, user_type="influence", auth=""):
    bci_date = ts2datetime(datetime2ts(date) - DAY)
    results = []
    if status=='show_in':
        uid_list = input_result
    if status=='show_compute':
        uid_list = input_result.keys()
    if status=='show_in_history':
        uid_list = input_result.keys()
    if date!='all':
        index_name = 'bci_' + ''.join(bci_date.split('-'))
    else:
        now_ts = time.time()
        now_date = ts2datetime(now_ts)
        index_name = 'bci_' + ''.join(now_date.split('-'))
    tmp_ts = str(datetime2ts(date) - DAY)
    sensitive_string = "sensitive_score_" + tmp_ts
    query_sensitive_body = {
    "query":{
        "match_all":{}
        },
        "size":1,
        "sort":{sensitive_string:{"order":"desc"}}
        }
    try:
        top_sensitive_result = es_bci_history.search(index=ES_SENSITIVE_INDEX, doc_type=DOCTYPE_SENSITIVE_INDEX, body=query_sensitive_body, _source=False, fields=[sensitive_string])['hits']['hits']
        top_sensitive = top_sensitive_result[0]['fields'][sensitive_string][0]
    except Exception, reason:
        print Exception, reason
        top_sensitive = 400
    index_type = 'bci'
    user_bci_result = es_cluster.mget(index=index_name, doc_type=index_type, body={'ids':uid_list}, _source=True)['docs']
    user_profile_result = es_user_profile.mget(index='weibo_user', doc_type='user', body={'ids':uid_list}, _source=True)['docs']
    bci_history_result = es_bci_history.mget(index=bci_history_index_name, doc_type=bci_history_index_type, body={"ids":uid_list}, fields=['user_fansnum', 'weibo_month_sum'])['docs']
    sensitive_history_result = es_bci_history.mget(index=ES_SENSITIVE_INDEX, doc_type=DOCTYPE_SENSITIVE_INDEX, body={'ids':uid_list}, fields=[sensitive_string], _source=False)['docs']
    max_evaluate_influ = get_evaluate_max(index_name)
    for i in range(0, len(uid_list)):
        uid = uid_list[i]
        bci_dict = user_bci_result[i]
        profile_dict = user_profile_result[i]
        bci_history_dict = bci_history_result[i]
        sensitive_history_dict = sensitive_history_result[i]
        #print sensitive_history_dict
        try:
            bci_source = bci_dict['_source']
        except:
            bci_source = None
        if bci_source:
            influence = bci_source['user_index']
            influence = math.log(influence/float(max_evaluate_influ['user_index']) * 9 + 1 ,10)
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
            try:
                fansnum = bci_history_dict['fields']['user_fansnum'][0]
            except:
                fansnum = 0
            try:
                statusnum = bci_history_dict['fields']['weibo_month_sum'][0]
            except:
                statusnum = 0
        else:
            uname = uid
            location = ''
            try:
                fansnum = bci_history_dict['fields']['user_fansnum'][0]
            except:
                fansnum = 0
            try:
                statusnum = bci_history_dict['fields']['weibo_month_sum'][0]
            except:
                statusnum = 0
        if status == 'show_in':
            if user_type == "sensitive":
                tmp_ts = datetime2ts(date) - DAY
                tmp_data = r_cluster.hget("sensitive_"+str(tmp_ts), uid)
                if tmp_data:
                    sensitive_dict = json.loads(tmp_data)
                    sensitive_words = sensitive_dict.keys()
                else:
                    sensitive_words = []
                if sensitive_history_dict.get('fields',0):
                    #print sensitive_history_dict['fields'][sensitive_string][0]
                    #print top_sensitive
                    sensitive_value = math.log(sensitive_history_dict['fields'][sensitive_string][0]/float(top_sensitive)*9+1, 10)*100
                    #print "sensitive_value", sensitive_value
                else:
                    sensitive_value = 0
                results.append([uid, uname, location, fansnum, statusnum, influence, sensitive_words, sensitive_value])
            else:
                results.append([uid, uname, location, fansnum, statusnum, influence])
                if auth:
                    hashname_submit = "submit_recomment_" + date
                    tmp_data = json.loads(r.hget(hashname_submit, uid))
                    recommend_list = (tmp_data['operation']).split('&')
                    admin_list = []
                    admin_list.append(tmp_data['system'])
                    admin_list.append(list(set(recommend_list)))
                    admin_list.append(len(recommend_list))
    return results

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


def recommentation_in(input_ts, recomment_type, submit_user):
    date = ts2datetime(input_ts)
    recomment_results = []
    # read from redis
    results = []
    hash_name = 'recomment_'+str(date) + "_" + recomment_type
    identify_in_hashname = "identify_in_" + str(date)
    submit_user_recomment = "recomment_" + submit_user + "_" + str(date) # 用户自推荐名单
    results = r.hgetall(hash_name)
    if not results:
        return []
    # search from user_profile to rich the show information
    recommend_list = set(r.hkeys(hash_name))
    identify_in_list = set(r.hkeys("compute"))
    submit_user_recomment = set(r.hkeys(submit_user_recomment))
    recomment_results = list(recommend_list - identify_in_list)
    recomment_results = list(set(recomment_results) - submit_user_recomment)
    if recomment_results:
        results = get_user_detail(date, recomment_results, 'show_in', recomment_type)
    else:
        results = []
    return results

def recommentation():
    f = open('/home/user_portrait_0320/revised_user_portrait/user_portrait/user_portrait/recommentation/sensitive_recomment.txt', 'w')
    input_ts = datetime2ts('2016-05-20')
    recomment_type = 'sensitive'
    submit_user = 'admin@qq.com'
    results = recommentation_in(input_ts,recomment_type, submit_user)
    for item in results:
        f.write('%s\n' % json.dumps(item))
    f.close()

if __name__=='__main__':
    recommentation()

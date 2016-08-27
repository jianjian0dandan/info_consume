# -*- coding:utf-8 -*-

import sys
import time
import operator
import json
import numpy as np
#from text_classify.test_topic import topic_classfiy
from elasticsearch import Elasticsearch
from duplicate import duplicate
from socialconsume.global_utils import es_flow_text as es_text
from socialconsume.global_utils import es_user_profile as es_profile
from socialconsume.global_utils import es_user_portrait
from socialconsume.global_utils import R_SOCIAL_SENSING as r
from socialconsume.time_utils import ts2datetime, datetime2ts
from socialconsume.global_utils import flow_text_index_name_pre, flow_text_index_type, profile_index_name, profile_index_type, \
                         portrait_index_name, portrait_index_type
from socialconsume.parameter import SOCIAL_SENSOR_TIME_INTERVAL as time_interval
from socialconsume.parameter import SOCIAL_SENSOR_FORWARD_RANGE as time_segment
from socialconsume.parameter import DETAIL_SOCIAL_SENSING as index_sensing_task
from socialconsume.parameter import INDEX_MANAGE_SOCIAL_SENSING as index_manage_social_task
from socialconsume.parameter import DOC_TYPE_MANAGE_SOCIAL_SENSING as task_doc_type
from socialconsume.parameter import FORWARD_N as forward_n
from socialconsume.parameter import topic_value_dict
from socialconsume.parameter import INITIAL_EXIST_COUNT as initial_count
from socialconsume.parameter import IMPORTANT_USER_NUMBER, IMPORTANT_USER_THRESHOULD, signal_brust, signal_track, signal_count_varition, signal_sentiment_varition,signal_nothing, signal_nothing_variation, \
                      unfinish_signal, finish_signal, AGGRAGATION_KEYWORDS_NUMBER, PRE_AGGREGATION_NUMBER, DAY
from socialconsume.time_utils import ts2date, datetime2ts, ts2datetime
day_time = 24*3600

# 获得原创微博内容，按时间排序
def get_origin_weibo_detail(ts, user, task_name, size, order, message_type=1):
    _id = user + '-' + task_name
    #从es里面获取字典里面的内容，赋给task_detail
    task_detail = es_user_portrait.get(index=index_sensing_task, doc_type=_id, id=ts)['_source']
    #mid_topic_value代表task_detail里面的键值（属性）
    mid_value = json.loads(task_detail['mid_topic_value'])
    duplicate_dict = json.loads(task_detail['duplicate_dict'])

    #新建一个字典
    tmp_duplicate_dict = dict()

    for k,v in duplicate_dict.iteritems():
        try:
            tmp_duplicate_dict[v].append(k)
        except:
            tmp_duplicate_dict[v] = [k, v]
   # print tmp_duplicate_dict
        
   #判断文本类型是什么，再加载字典里面对应类型的微博内容
    if message_type == 1:
        weibo_detail = json.loads(task_detail['origin_weibo_detail'])
    elif message_type == 2:
        weibo_detail = json.loads(task_detail['retweeted_weibo_detail'])
    else:
        weibo_detail = json.loads(task_detail['sensitive_weibo_detail'])
    weibo_detail_list = []

    #入股weibo_detail里面有内容，把微博信息写到列表里
    if weibo_detail:
        for iter_mid, item in weibo_detail.iteritems():
            tmp = []
            tmp.append(iter_mid)
            tmp.append(item[iter_mid])
            tmp.append(item['retweeted'])
            tmp.append(item['comment'])
            weibo_detail_list.append(tmp)
    #把微博信息的键值存到列表里
    mid_list = weibo_detail.keys()

    results = []

    #按照mid查询微博信息
    query_body = {
        "query":{
            "filtered":{
                "filter":{
                    "terms":{"mid": mid_list}
                }
            }
        },
        "size": 1000,
        "sort": {"timestamp": {"order": "desc"}}
    }

    #定义index_list列表，存储索引信息
    index_list = []
    #datetime为传过来的时间戳
    datetime = ts2datetime(ts)
    #datetime_1为传过来时间戳减一天的时间
    datetime_1 = ts2datetime(ts-DAY)
    index_name = flow_text_index_name_pre + datetime
    #选择es，将索引信息存入index中
    exist_es = es_text.indices.exists(index_name)
    if exist_es:
        index_list.append(index_name)
    index_name_1 = flow_text_index_name_pre + datetime_1
    exist_es_1 = es_text.indices.exists(index_name_1)
    if exist_es_1:
        index_list.append(index_name_1)
    #按照index列表和前面定义的query进行查询
    if index_list and mid_list:
        search_results = es_text.search(index=index_list, doc_type=flow_text_index_type, body=query_body)["hits"]["hits"]
    else:
        #如果没有查到，列表为空
        search_results = []

    #把查询到的信息进行重新组织，按照_id组织成想要的字典形式
    uid_list = []
    text_dict = dict() # 文本信息
    portrait_dict = dict() # 背景信息
    sort_results = []
    if search_results:
        for item in search_results:
            uid_list.append(item["_source"]['uid'])
            text_dict[item['_id']] = item['_source'] # _id是mid
        if uid_list:
            portrait_result = es_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":uid_list}, fields=['nick_name', 'photo_url'])["docs"]
            for item in portrait_result:
                if item['found']:
                    #{}中的内容是键_id的值
                    portrait_dict[item['_id']] = {"nick_name": item["fields"]["nick_name"][0], "photo_url": item["fields"]["photo_url"][0]}
                else:
                    portrait_dict[item['_id']] = {"nick_name": item['_id'], "photo_url":""}

        #选择排序方式，total：按转发数加评论数排序；reverse=true表示逆序
        if order == "total":
            sorted_list = sorted(weibo_detail_list, key=lambda x:x[1], reverse=True)
        elif order == "retweeted":
            sorted_list = sorted(weibo_detail_list, key=lambda x:x[2], reverse=True)
        elif order == "comment":
            sorted_list = sorted(weibo_detail_list, key=lambda x:x[3], reverse=True)
        else:
            sorted_list = weibo_detail_list

        #将排序完的内容按照想要的信息整理成列表
        count_n = 0
        results_dict = dict()
        mid_index_dict = dict()
        for item in sorted_list: # size
            mid = item[0]
            iter_text = text_dict.get(mid, {})
            temp = []
            # uid, nick_name, photo_url, text, sentiment（情绪）, timestamp, geo（地理）, common_keywords（没用到）, message_type
            if iter_text:
                uid = iter_text['uid']
                temp.append(uid)
                iter_portrait = portrait_dict.get(uid, {})
                if iter_portrait:
                    temp.append(iter_portrait['nick_name'])
                    temp.append(iter_portrait['photo_url'])
                else:
                    temp.extend([uid,''])
                temp.append(iter_text["text"])
                temp.append(iter_text["sentiment"])
                temp.append(ts2date(iter_text['timestamp']))
                temp.append(iter_text['geo'])
                if message_type == 1:
                    temp.append(1)
                elif message_type == 2:
                    temp.append(3)
                else:
                    temp.append(iter_text['message_type'])
                temp.append(item[2])
                temp.append(item[3])
                temp.append(iter_text.get('sensitive', 0))
                temp.append(iter_text['timestamp'])
                temp.append(mid_value[mid])
                temp.append(mid)
                results.append(temp)
            count_n += 1

        #对整理出的结果高级排序，key=operator.itemgetter(-4, -2, -6),先按照倒数第四个键值排序，再按倒数第二个键值排序，最后按照倒数第六个键值排序
        results = sorted(results, key=operator.itemgetter(-4, -2, -6), reverse=True) # -4 -2 -3
        sort_results = []
        count = 0
        for item in results:
            sort_results.append([item])
            mid_index_dict[item[-1]] = count
            count += 1

        #去除列表的冗余
        if tmp_duplicate_dict:
            remove_list = []
            value_list = tmp_duplicate_dict.values() # [[mid, mid], ]
            for item in value_list:
                tmp = []
                for mid in item:
                    if mid_index_dict.get(mid, 0):
                        tmp.append(mid_index_dict[mid])
                if len(tmp) > 1:
                    tmp_min = min(tmp)
                else:
                    continue
                tmp.remove(tmp_min)
                for iter_count in tmp:
                    sort_results[tmp_min].extend(sort_results[iter_count])
                    remove_list.append(sort_results[iter_count])
            if remove_list:
                for item in remove_list:
                    sort_results.remove(item)
        

    return sort_results






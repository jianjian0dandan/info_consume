# -*- coding: utf-8 -*-
from cp_global_config import db,es_user_profile,profile_index_name,profile_index_type,\
                            topics_river_index_name,topics_river_index_type,\
                            subopinion_index_name,subopinion_index_type
from cp_global_config import weibo_es,weibo_index_name,weibo_index_type,MAX_FREQUENT_WORDS,MAX_LANGUAGE_WEIBO

from cp_time_utils import ts2HourlyTime,datetime2ts,full_datetime2ts

from cp_model import CityTopicCount,CityWeibos
import math
import json
#from socialconsume.global_config import db
#from socialconsume.model import CityTopicCount, CityWeibos
#from socialconsume.time_utils import ts2HourlyTime



Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

def _json_loads(weibos):
    try:
        return json.loads(weibos)
    except ValueError:
        if isinstance(weibos, unicode):
            return json.loads(json.dumps(weibos))
        else:
            return None

def get_during_keywords(topic,start_ts,end_ts,unit=MinInterval):  #关键词云
    keywords = []
    if (end_ts-start_ts)>unit:
        begin_ts = end_ts-unit
    else:
        begin_ts = start_ts
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'range':{
                        'timestamp':{'gte': begin_ts, 'lt':end_ts} 
                    }
                }
            }
        },
        'size':weibo_limit
    }
    keywords_dict = {}
    keyword_weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)['hits']['hits']   
    for key_weibo in keyword_weibo:
        keywords_dict_list = json.loads(key_weibo['_source']['keywords_dict'])  #
        #print keywords_dict_list,type(keywords_dict_list)
        for k,v in keywords_dict_list.iteritems():
            try:
                keywords_dict[k] += v
            except:
                keywords_dict[k] = v
    word_results = sorted(keywords_dict.iteritems(),key=lambda x:x[1],reverse=True)[:w_limit]   
    return json.dumps(word_results)      


#zhutihe_results = cul_key_weibo_time_count(news_topics,start_ts,over_ts,during)


def get_topics_river(topic,start_ts,end_ts,unit=MinInterval):#主题河
    query_body = {
        'query':{
            'bool':{
                'must':[
                    {'term':{'name':topic}},
                    {'range':{'start_ts':{'lte':start_ts}}},
                    {'range':{'end_ts':{'gte':end_ts}}}
                ]
            }
        }
    }
    news_topics = weibo_es.search(index=topics_river_index_name,doc_type=topics_river_index_type,body=query_body)['hits']['hits'][0]['_source']['features']
    zhutihe_results = cul_key_weibo_time_count(topic,json.loads(news_topics),start_ts,end_ts,unit)
    return zhutihe_results


def get_symbol_weibo(topic,start_ts,end_ts,unit=MinInterval):  #鱼骨图
    weibos = {}
    query_body = {
        'query':{
            'bool':{
                'must':[
                    {'term':{'name':topic}},
                    {'range':{'start_ts':{'lte':start_ts}}},
                    {'range':{'end_ts':{'gte':end_ts}}}
                ]
            }
        }
    }
    symbol_weibos = weibo_es.search(index=topics_river_index_name,doc_type=topics_river_index_type,body=query_body)['hits']['hits'][0]['_source']['cluster_dump_dict']
    symbol_weibos = json.loads(symbol_weibos)
    begin_ts = end_ts - unit
    for clusterid,contents in symbol_weibos.iteritems():
        print clusterid
        for i in contents:
            ts = full_datetime2ts(i['datetime'])
            if ts >= start_ts and ts <= end_ts:  #start_ts应该改成begin_ts，现在近15分钟没数据，所以用所有的
                weibos[clusterid] = i
    return weibos

def get_weibo_content(topic,start_ts,end_ts,opinion,sort_item='timestamp'): #微博内容
    weibo_dict = {}
    query_body = {
        'query':{
            'bool':{
                'must':[
                    {'term':{'keys':json.dumps(opinion)}},
                    {'term':{'name':topic}},
                    {'range':{'start_ts':{'lte':start_ts}}},
                    {'range':{'end_ts':{'gte':end_ts}}}
                ]
            }
        }
    }  #没有查到uid   每次的id不一样   
    weibos = weibo_es.search(index=subopinion_index_name,doc_type=subopinion_index_type,body=query_body)['hits']['hits']
    if weibos:
        weibos = json.loads(weibos[0]['_source']['cluster_dump_dict'])
        for weibo in weibos.values():#jln0825
            weibo = weibo[0]
            weibo_content = {}
            weibo_content['text'] = weibo['text'] 
            weibo_content['uid'] = weibo['uid']
            weibo_content['timestamp'] = full_datetime2ts(weibo['datetime'])
            weibo_content['comment'] = weibo['comment']
            weibo_content['retweeted'] = weibo['retweeted']
            weibo_content['mid'] = weibo['id']
            try:
                user = es_user_profile.get(index=profile_index_name,doc_type=profile_index_type,id=weibo_content['uid'])['_source']
                weibo_content['uname'] = user['nick_name']
                weibo_content['photo_url'] = user['photo_url']
            except:
                weibo_content['uname'] = 'unknown'
                weibo_content['photo_url'] = 'unknown'
            weibo_dict[weibo_content['mid']] = weibo_content
        results = sorted(weibo_dict.items(),key=lambda x:x[1][sort_item],reverse=True)
        print results
        return results
    else:
        return 'no results'


if __name__ == '__main__':
	#all_weibo_count('aoyunhui',1468166400,1468170900)
    #get_symbol_weibo('aoyunhui',1468944000,1471622400,Day)
    opinion=["姐姐", "综艺节目", "网络"]
    get_weibo_content('aoyunhui',1468944000,1471622400,opinion)
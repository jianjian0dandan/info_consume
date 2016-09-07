# -*- coding: utf-8 -*-
from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type,\
                            topics_river_index_name,topics_river_index_type,\
                            subopinion_index_name,subopinion_index_type,topic_index_name,topic_index_type
from user_portrait.global_config import weibo_es,weibo_index_name,weibo_index_type,MAX_FREQUENT_WORDS,MAX_LANGUAGE_WEIBO

from user_portrait.time_utils import ts2HourlyTime,datetime2ts,full_datetime2ts,ts2datetime

from user_portrait.info_consume.model import CityTopicCount,CityWeibos
import math
import json
# from cp_global_config import db,es_user_profile,profile_index_name,profile_index_type,\
#                             topics_river_index_name,topics_river_index_type,\
#                             subopinion_index_name,subopinion_index_type
# from cp_global_config import weibo_es,weibo_index_name,weibo_index_type,MAX_FREQUENT_WORDS,MAX_LANGUAGE_WEIBO

# from cp_time_utils import ts2HourlyTime,datetime2ts,full_datetime2ts

# from cp_model import CityTopicCount,CityWeibos


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


def get_topics():
    results = {}
    topics = weibo_es.search(index=topic_index_name,doc_type=topic_index_type)
    if topics:
        topics = topics['hits']['hits']
        for topic in topics:
            print topic
            results[topic['_source']['index_name']]=topic['_source']['name']
    return json.dumps(results)


def get_during_keywords(topic,start_ts,end_ts):  #关键词云,unit=MinInterval
    keywords = []
    # if (end_ts-start_ts)>unit:
    #     begin_ts = end_ts-unit
    # else:
    #     begin_ts = start_ts
    # print begin_ts,end_ts
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'range':{
                        'timestamp':{'gte': start_ts, 'lt':end_ts} 
                    }
                }
            }
        },
        'size':MAX_LANGUAGE_WEIBO
    }
    keywords_dict = {}
    keyword_weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)['hits']['hits']   
    print keyword_weibo
    for key_weibo in keyword_weibo:
        keywords_dict_list = json.loads(key_weibo['_source']['keywords_dict'])  #
        #print keywords_dict_list,type(keywords_dict_list)
        for k,v in keywords_dict_list.iteritems():
            try:
                keywords_dict[k] += v
            except:
                keywords_dict[k] = v
    word_results = sorted(keywords_dict.iteritems(),key=lambda x:x[1],reverse=True)[:MAX_FREQUENT_WORDS]   
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
    news_topics = json.loads(weibo_es.search(index=topics_river_index_name,doc_type=topics_river_index_type,body=query_body)['hits']['hits'][0]['_source']['features'])
    zhutihe_results = cul_key_weibo_time_count(topic,news_topics,start_ts,end_ts,unit)
    results = {}
    for k,v in news_topics.iteritems():
        if len(v)>0:
            results[v[0]] = zhutihe_results[k]
    return results


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
    symbol = weibo_es.search(index=topics_river_index_name,doc_type=topics_river_index_type,body=query_body)['hits']['hits'][0]['_source']
    features = json.loads(symbol['features'])
    symbol_weibos = json.loads(symbol['cluster_dump_dict'])
    #print symbol_weibos
    begin_ts = end_ts - unit
    for clusterid,contents in symbol_weibos.iteritems():
        j = 0
        for i in contents:
            ts = full_datetime2ts(i['datetime'])
            if ts >= start_ts and ts <= end_ts:  #start_ts应该改成begin_ts，现在近15分钟没数据，所以用所有的
                try:
                    weibos[features[clusterid][0]].append(i)
                except:
                    weibos[features[clusterid][0]] = [i]
                j += 1
            if j == 3:
                break
            print j
            print features[clusterid][0].encode('utf8'),len(weibos[features[clusterid][0]])
    #print weibos
    return weibos


def get_subopinion(topic):
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'term':{
                        'name':topic
                    }
                }
            }
        }
    }
    features = weibo_es.search(index=subopinion_index_name,doc_type=subopinion_index_type,body=query_body)['hits']['hits']
    if features:
        feature = json.loads(features[0]['_source']['features'])
        return feature.values()
    else:
        return 'no results'



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
    print opinion
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
        #print results
        return results
    else:
        return 'no results'


def cul_key_weibo_time_count(topic,news_topics,start_ts,over_ts,during):
    key_weibo_time_count = {}
    time_dict = {}
    during = Day
    for clusterid,keywords in news_topics.iteritems(): #{u'd2e97cf7-fc43-4982-8405-2d215b3e1fea': [u'\u77e5\u8bc6', u'\u5e7f\u5dde', u'\u9009\u624b']}
        if len(keywords)>0:
            start_ts = int(start_ts)
            over_ts = int(over_ts)

            over_ts = ts2HourlyTime(over_ts, during)
            interval = (over_ts - start_ts) / during


            for i in range(interval, 0, -1):    #时间段取每900秒的

                begin_ts = over_ts - during * i
                end_ts = begin_ts + during
                must_list=[]
                must_list.append({'range':{'timestamp':{'gte':begin_ts,'lt':end_ts}}})
                temp = []
                for word in keywords:
                    sentence =  {"wildcard":{"keywords_string":"*"+word+"*"}}
                    temp.append(sentence)
                must_list.append({'bool':{'should':temp}})

                query_body = {"query":{
                                "bool":{
                                    "must":must_list
                                }
                            }
                        }
                key_weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)
                key_weibo_count = key_weibo['hits']['total']  #分时间段的类的数量
                time_dict[ts2datetime(end_ts)] = key_weibo_count

            key_weibo_time_count[clusterid] = sorted(time_dict.items(),key=lambda x:x[0])
    return key_weibo_time_count


if __name__ == '__main__':
	#all_weibo_count('aoyunhui',1468166400,1468170900)
    #get_symbol_weibo('aoyunhui',1468944000,1471622400,Day)
    opinion=["姐姐", "综艺节目", "网络"]
    #get_weibo_content('aoyunhui',1468944000,1471622400,opinion)
    get_during_keywords('aoyunhui',1468944000,1469707652)
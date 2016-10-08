# -*- coding: utf-8 -*-

import sys
import json

from config import db,split_city
#from xapian_case.utils import top_keywords, gen_mset_iter

sys.path.append('../../../')
#from ad_filter import ad_classifier
from global_config import emotions_kv,weibo_es,weibo_index_name,weibo_index_type,SENTIMENT_TYPE_COUNT,\
                            SENTIMENT_FIRST,SENTIMENT_SECOND
from time_utils import datetime2ts, ts2HourlyTime
#jln
from global_utils import  getTopicByNameStEt,getWeiboByNameStEt
#from dynamic_xapian_weibo import getXapianWeiboByTopic
from model import SentimentCount, SentimentKeywords, SentimentWeibos, SentimentCountRatio,SentimentGeo

Minute = 60
Fifteenminutes = 15 * 60
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24

TOP_KEYWORDS_LIMIT = 50
TOP_WEIBOS_LIMIT = 50

RESP_ITER_KEYS = ['_id', 'user', 'retweeted_uid', 'retweeted_mid', 'text', 'timestamp', 'reposts_count', 'bmiddle_pic', 'geo', 'comments_count', 'sentiment', 'terms']
SORT_FIELD = 'reposts_count'


def top_weibos(get_results, top=TOP_WEIBOS_LIMIT):
    weibos = []
    for r in get_results():
        weibos.append(r)
        """
        try:
            weibo = getWeiboById(r['_id'])
            if weibo:
                r['attitudes_count'] = int(weibo['attitudes_count'])
                r['reposts_count'] = int(weibo['reposts_count'])
                r['comments_count'] = int(weibo['comments_count'])
            weibos.append(r)
        except:
            pass
        """
    sorted_weibos = sorted(weibos, key=lambda k: k[SORT_FIELD], reverse=False)
    sorted_weibos = sorted_weibos[len(sorted_weibos)-top:]
    sorted_weibos.reverse()

    return sorted_weibos


def save_rt_results(calc, query, results, during, klimit=TOP_KEYWORDS_LIMIT, wlimit=TOP_WEIBOS_LIMIT):
    if calc == 'count':    #{时间段：{情绪1：值1,情绪2，值2}}{时间段：{情绪1：值1,情绪2，值2}}
        #print results
        for time, sen_dict in results.iteritems():
            #sentiment = k
            #ts, count = v
            ts = time
            for k,v in sen_dict.iteritems():
                sentiment = k
                count = v
                item = SentimentCount(query, during, ts, sentiment, count)
                #print item
                item_exist = db.session.query(SentimentCount).filter(SentimentCount.query==query, \
                                                                         SentimentCount.range==during, \
                                                                         SentimentCount.end==ts, \
                                                                         SentimentCount.sentiment==sentiment).first()
                if item_exist:
                    db.session.delete(item_exist)
                db.session.add(item)
        
        db.session.commit()

    #{时间戳：{'情绪1'：{'词1'：1，'词2'：2}}}
    if calc == 'kcount':
        for time,sen_dict in results.iteritems():
            ts = time
            for k,v in sen_dict.iteritems():
                sentiment = k
                kcount = v
                item = SentimentKeywords(query, during, klimit, ts, sentiment, json.dumps(kcount))
                #print item
                item_exist = db.session.query(SentimentKeywords).filter(SentimentKeywords.query==query, \
                                                                            SentimentKeywords.range==during, \
                                                                            SentimentKeywords.end==ts, \
                                                                            SentimentKeywords.limit==klimit, \
                                                                            SentimentKeywords.sentiment==sentiment).first()
                if item_exist:
                    db.session.delete(item_exist)
                db.session.add(item)
        
        db.session.commit()

    if calc == 'weibos':    #{'时间戳'：{'情绪1'：[{微博字段},{微博字段}],'情绪2'：[]}}
        for time,sen_dict in results.iteritems():
            ts = time
            for k,v in sen_dict.iteritems():
                sentiment = k
                weibos = v
                item = SentimentWeibos(query, during, wlimit, ts, sentiment, json.dumps(weibos))
                item_exist = db.session.query(SentimentWeibos).filter(SentimentWeibos.query==query, 
                                                                                   SentimentWeibos.range==during, 
                                                                                   SentimentWeibos.end==ts, 
                                                                                   SentimentWeibos.limit==wlimit, 
                                                                                   SentimentWeibos.sentiment==sentiment).first()
                if item_exist:
                    db.session.delete(item_exist)
                db.session.add(item)
        
        db.session.commit()

    if calc == 'geo_count': # 地理位置 #{'sentiment':[shijian,{['province':('provice':cishu),()],'city':[(city:cishu)}]}
        #print results
        for sentiment, v in results.items():
            ts = v[0]
            geo_count = v[1]
            item = SentimentGeo(query, during, ts, sentiment, json.dumps(geo_count))
            item_exist = db.session.query(SentimentGeo).filter(SentimentGeo.topic==query, \
                                                                       SentimentGeo.range==during, \
                                                                       SentimentGeo.end==ts, \
                                                                       SentimentGeo.sentiment==sentiment).first()

            if item_exist:
                db.session.delete(item_exist)
            db.session.add(item)
        db.session.commit()
        #print '???????'


def sentimentTopic(topic,start_ts, over_ts, sort_field=SORT_FIELD, save_fields=RESP_ITER_KEYS, \
    during=Fifteenminutes, w_limit=TOP_WEIBOS_LIMIT, k_limit=TOP_KEYWORDS_LIMIT ):
    if topic and topic != '':
        start_ts = int(start_ts)
        over_ts = int(over_ts)

        over_ts = ts2HourlyTime(over_ts, during)
        interval = (over_ts - start_ts) / during

        for i in range(interval, 0, -1):    #时间段取每900秒的
            emotions_kcount = {}  #每类情感的TOPK关键词
            emotions_count = {}   #每类情感的数量
            emotions_weibo = {}   #每类情感的微博

            begin_ts = over_ts - during * i
            end_ts = begin_ts + during
            #test(topic,begin_ts,end_ts)

            #print begin_ts, end_ts, 'topic %s starts calculate' % topic.encode('utf-8')
            emotions_count = compute_sentiment_count(topic,begin_ts,end_ts,during)            
            emotions_kcount = compute_sentiment_keywords(topic,begin_ts,end_ts,k_limit,w_limit,during)
            emotions_weibo = compute_sentiment_weibo(topic,begin_ts,end_ts,k_limit,w_limit,during)
            # save_rt_results('count', topic, emotions_count, during)  #  '1':[end_ts,4],
            # save_rt_results('kcount', topic, emotions_kcount, during, k_limit, w_limit)
            # save_rt_results('weibos', topic, emotions_weibo, during, k_limit, w_limit)  


#情绪的数量
def compute_sentiment_count(topic,begin_ts,end_ts,during):
    all_sentiment_dict = {}
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
        'aggs':{
            'all_interests':{
                'terms':{
                    'field': 'sentiment',
                    'size': SENTIMENT_TYPE_COUNT
                }#,
                # 'aggs':{
                #     'geo':{
                #         'terms':{
                #         'field':'geo'
                #         }
                #     }
                # }
            }
        }
    }
    weibo_sentiment_count = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)\
                                ['aggregations']['all_interests']['buckets']
    #print 'wwwwwwwwwwwwwwwwwwwwww'
    #print weibo_sentiment_count
    iter_sentiment_dict = {}
    for sentiment_item in weibo_sentiment_count:
        sentiment = sentiment_item['key']
        sentiment_count = sentiment_item['doc_count']
        try:
            iter_sentiment_dict[sentiment] += sentiment_count     #'1':4
        except:
            iter_sentiment_dict[sentiment] = sentiment_count                
    #print '============================'
    all_sentiment_dict[end_ts] = iter_sentiment_dict   #按时间段存各个情绪的数量值
    #results = sorted(all_sentiment_dict.items(), key=lambda x:x[0])  #按时间段对情绪数量排序
    results = all_sentiment_dict
    #print type(results)
    #trend_results = {}
    #for sentiment in SENTIMENT_FIRST:
    #    trend_results[sentiment] = [[item[0], item[1][sentiment]] for item in sort_sentiment_dict]
    #results = trend_results

    #print results
    save_rt_results('count', topic, results, during)
    return results

def compute_sentiment_keywords(topic,begin_ts,end_ts,k_limit,w_limit,during):
    all_keyword_dict = {}
    #print 'kkkkkkkkkkkkkkkkkkkk'
    sen_with_keyword = {}
    sentiments = SENTIMENT_FIRST + SENTIMENT_SECOND
    for sentiment in sentiments:
        query_body = {
            'query':{
                'bool':{
                    'must':[
                        {'term':{'sentiment':sentiment}},  #一个话题，不同情绪下给定时间里按关键词聚合
                        {'range':{
                            'timestamp':{'gte': begin_ts, 'lt':end_ts} 
                        }
                    }]
                }
            },
            'aggs':{
                'all_interests':{
                    'terms':{
                        'field': 'keywords_string',
                        'size': k_limit #SENTIMENT_MAX_KEYWORDS
                    }
                }
            }
        }

        show_keywords_dict = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)\
                        ['aggregations']['all_interests']['buckets']
        #print show_keywords_dict
        #keywords_list = [[item['key'], item['doc_count']] for item in show_keywords_dict]
        #print '======================='
        #print keywords_list

        keyword_dict = {}
        for keyword in show_keywords_dict:
            key = keyword['key'] 
            count = keyword['doc_count']
            try:
                keyword_dict[key] += count
            except:
                keyword_dict[key] = count

        sen_with_keyword[sentiment] = sorted(keyword_dict.items(),key=lambda x:x[1], reverse=True)[:k_limit]
        #print sen_with_keyword
        #print sorted(sen_with_keyword.items(), key=lambda x:x[0], reverse=True)[:k_limit]
    all_keyword_dict[end_ts] = sen_with_keyword
  #还要加按15min切片，然后存

    #results = sorted(all_keyword_dict.items(), key=lambda x:x[1][3], reverse=True)[:k_limit]
    results = all_keyword_dict   #{时间戳：{'情绪1'：{'词1'：1，'词2'：2}}}
    save_rt_results('kcount', topic, results, during, k_limit, w_limit)
    #return results

def compute_sentiment_weibo(topic,begin_ts,end_ts,k_limit,w_limit,during):
    #print topic
    sentiments = SENTIMENT_FIRST + SENTIMENT_SECOND
    all_sen_weibo = {}
    results = {}
    geo_count = {} 
    for sentiment in sentiments:
        province_dict = {}
        query_body = {
            'query':{
                'bool':{
                    'must':[
                        {'term':{'sentiment':sentiment}},  #一个话题，不同情绪下给定时间里按关键词聚合
                        {'range':{
                            'timestamp':{'gte': begin_ts, 'lt':end_ts} 
                        }
                    }]
                }
            },
            'sort':{"retweeted":{"order":"desc"}},
            'size':w_limit
        }    
        sentiment_weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)['hits']['hits']   #字典
        if len(sentiment_weibo) > 0:
            all_sen_weibo[sentiment] = []
            for i in range(0,len(sentiment_weibo)):
                #print sentiment_weibo[i]['_source']['retweeted']
                all_sen_weibo[sentiment].append(sentiment_weibo[i]['_source'])

            for weibo in sentiment_weibo:  #对于每条微博
                geo = sentiment_weibo[i]['_source']['geo'].encode('utf8')
                province,city = split_city(geo)
                if province != 'unknown':
                    #print province,city
                    try:
                        province_dict[province]['total'] += 1
                    except:
                        province_dict[province] = {'total':1}
                    try:
                        province_dict[province][city] += 1  
                    except:
                        province_dict[province][city] = 1
            geo_count[sentiment] = [end_ts,province_dict]

        else:
        	continue

#原有的存微博的
    results[end_ts] = all_sen_weibo
    save_rt_results('weibos', topic, results, during, k_limit, w_limit)  
    save_rt_results('geo_count',topic,geo_count,during)
    #print geo_count
    return results   #{'时间戳'：{'情绪1'：[{微博字段},{微博字段}],'情绪2'：[]}}


def test(topic,start_ts,end_ts):
    print start_ts,end_ts
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'range':{
                        'timestamp':{'gte': start_ts, 'lt':end_ts} 
                    }
                }
            }
        }
    }   
    weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)['hits']['hits']   #字典
    print weibo

if __name__ == '__main__':
    #topic = sys.argv[1] # u'香港自由行' u'张灵甫遗骨疑似被埋羊圈' u'高校思想宣传' u'高校宣传思想工作' u'外滩踩踏' 'APEC' u'全军政治工作会议'
    #start_date = sys.argv[2] # '2015-02-23'
    #end_date = sys.argv[3] # '2015-03-02'

    topic = 'aoyunhui'
    start_date = '2016-07-20'
    end_date = '2016-08-20'

    #topic = topic.decode('utf-8')
    start_ts = datetime2ts(start_date)
    end_ts = datetime2ts(end_date)
    #jln
    #topic_id = getTopicByNameStEt(topic,start_ts,end_ts)['_id']

    duration = Fifteenminutes
    #xapian_search_weibo = getXapianWeiboByTopic(topic_id)
    #es_search_weibo = getWeiboByNameStEt(topic,start_ts,end_ts)
    #print es_search_weibo
    #print 'topic: ', topic.encode('utf8'), 'from %s to %s' % (start_ts, end_ts)
    print 'topic: ', topic, 'from %s to %s' % (start_ts, end_ts)    
    sentimentTopic(topic, start_ts=start_ts, over_ts=end_ts, during=duration)

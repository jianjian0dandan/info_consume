# -*- coding: utf-8 -*-

import sys
import json

#from config import db
from model import PropagateCount, PropagateKeywords, PropagateWeibos

sys.path.append('../../../')
from global_config import db
from time_utils import datetime2ts, ts2HourlyTime
from global_config import weibo_es, weibo_index_type, mtype_kv

Minute = 60
Fifteenminutes = 15 * 60
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24

N = 10 # top N设置---确定后放在配置文件中
TOP_KEYWORDS_LIMIT = 50
TOP_WEIBOS_LIMIT = 50
MTYPE_COUNT = 3

RESP_ITER_KEYS = ['_id', 'user', 'retweeted_uid', 'retweeted_mid', 'text', 'timestamp', 'reposts_count', 'bmiddle_pic', 'geo', 'comments_count', 'sentiment', 'terms']
SORT_FIELD = 'reposts_count'

def compute_mtype_weibo(topic,begin_ts,end_ts,w_limit):
	#print topic
	mtypes = ['1', '2', '3']
	all_mtype_weibo = {}
	results = {}

	for mtype in mtypes:
		query_body = {
			'query':{
				'bool':{
					'must':[
						{'term':{'message_type': mtype}},
						{'range':{
							'timestamp':{'gte': begin_ts, 'lt':end_ts}
						}
						}]
				}
			},
			'sort':{"retweeted":{"order":"desc"}},
			'size':w_limit
		}

		mtype_weibo = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)['hits']['hits']
		#print mtype_weibo
		if len(mtype_weibo) > 0:
			all_mtype_weibo[mtype] = []
			for i in range(0, len(mtype_weibo)):
				all_mtype_weibo[mtype].append(mtype_weibo[i]['_source'])
		else:
			all_mtype_weibo[mtype] = []

		results[end_ts] = all_mtype_weibo
		#print results
		return results

def compute_mtype_keywords(topic, begin_ts, end_ts ,k_limit):
	all_keyword_dict = {}
	mtype_with_keyword = {}	
	mtypes = ['1', '2', '3']	#三种微博类型：原创、转发、评论
	for mtype in mtypes:
		query_body = {
			'query':{
				'bool':{
					'must':[
						{'term':{'message_type':mtype}},
						{'range':{
							'timestamp':{'gte': begin_ts, 'lt': end_ts}
						}

					}]
				}
			},
			'aggs':{
				'all_interests':{
					'terms':{
						'field': 'keywords_string',
						'size': k_limit
					}
				}
			}
		}

		show_keywords_dict = weibo_es.search(index=topic,doc_type=weibo_index_type,body=query_body)\
						['aggregations']['all_interests']['buckets']
		#print show_keywords_dict

		keyword_dict = {}
		for keyword in show_keywords_dict:
			key = keyword['key']
			count = keyword['doc_count']
			try:
				keyword_dict[key] += count
			except:
				keyword_dict[key] = count
		mtype_with_keyword[mtype] = sorted(keyword_dict.items(), key=lambda x:x[1], reverse=True)[:k_limit]

	all_keyword_dict[end_ts] = mtype_with_keyword

	results = all_keyword_dict

	print results
	return results

def save_results(calc, topic, results, during, klimit=TOP_KEYWORDS_LIMIT, wlimit=TOP_WEIBOS_LIMIT):
	if calc == 'count':		#{时间段:{类型1:值1,类型2:值2,类型3:值3},时间段:{类型1:值1,类型2:值2,类型3:值3}}
		#print results
		for time, mtype_dict in results.iteritems():
			ts = time
			for k, v in mtype_dict.iteritems():
				mtype = k
				count = v
				item = PropagateCount(topic, during, ts, mtype,json.dumps({'other': count}))
				item_exist = db.session.query(PropagateCount).filter(PropagateCount.topic==topic, \
															PropagateCount.range==during, \
															PropagateCount.end==ts, \
															PropagateCount.mtype==mtype).first()
				if item_exist:
					db.session.delete(item_exist)
				db.session.add(item)
			db.session.commit()

	if calc == 'kcount':
		for time, mtype_dict in results.iteritems():
			ts = time
			for k, v in mtype_dict.iteritems():
				mtype = k
				kcount = v
				item = PropagateKeywords(topic, during, klimit, ts, mtype, json.dumps(kcount))
				#print item
				item_exist = db.session.query(PropagateKeywords).filter(PropagateKeywords.topic==topic, \
                                                                PropagateKeywords.range==during, \
                                                                PropagateKeywords.end==ts, \
                                                                PropagateKeywords.mtype==mtype, \
                                                                PropagateKeywords.limit==klimit).first()

				if item_exist:
					db.session.delete(item_exist)
				db.session.add(item)
			db.session.commit

	if calc == 'weibo':
		for time,mtype_dict in results.iteritems():
			ts = time
			for k,v in mtype_dict.iteritems():
				mtype = k
				weibo = v
				item = PropagateWeibos(topic, during, wlimit, ts, mtype, json.dumps(weibo))
				item_exist = db.session.query(PropagateWeibos).filter(PropagateWeibos.query==topic, 
                                                                                   PropagateWeibos.range==during, 
                                                                                   PropagateWeibos.end==ts, 
                                                                                   PropagateWeibos.limit==wlimit, 
                                                                                   PropagateWeibos.mtype==mtype).first()
				print item_exist
			
def propagateCronTopic(topic, start_ts, over_ts, sort_field=SORT_FIELD, \
    save_fields=RESP_ITER_KEYS, during=Fifteenminutes, w_limit=TOP_WEIBOS_LIMIT, k_limit=TOP_KEYWORDS_LIMIT):
	if topic and topic != '':
		start_ts = int(start_ts)
		over_ts = int(over_ts)

		over_ts = ts2HourlyTime(over_ts, during)
		interval = (over_ts - start_ts) / during

		for i in range(interval,0,-1):	#每15分钟计算一次
			mtype_count = {}	#每类微博的数量
			mtype_kcount = {}	#每类微博的TOPK关键词
			mtype_weibo = {}	#三种类型的微博

			begin_ts = over_ts - during * i
			end_ts = begin_ts + during
			#print begin_ts, end_ts, 'topic %s starts calculate' % topic.encode('utf-8')
			mtype_count = compute_mtype_count(topic, begin_ts, end_ts)
			mtype_kcount = compute_mtype_keywords(topic, begin_ts, end_ts ,k_limit)
			mtype_weibo = compute_mtype_weibo(topic,begin_ts,end_ts,w_limit)
			#print mtype_count
			save_results('count', topic, mtype_count, during)
			save_results('kcount', topic, mtype_kcount, during, k_limit, w_limit)
			save_results('weibo', topic, mtype_weibo, during, k_limit)


def compute_mtype_count(topic, begin_ts, end_ts):
		all_mtype_dict = {}
		print begin_ts,end_ts
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
			'aggs' :{
				'all_interests':{
					'terms':{
						'field': 'message_type',
						'size': MTYPE_COUNT
					}
				}
			}
		}
		weibo_mtype_count = weibo_es.search(index=topic, doc_type=weibo_index_type,body=query_body)\
							['aggregations']['all_interests']['buckets']
		#print weibo_mtype_count
		iter_mtype_dict = {}
		for mtype_item in weibo_mtype_count:
			mtype = mtype_item['key']
			mtype_count = mtype_item['doc_count']
			try:
				iter_mtype_dict[mtype] += mtype_count
			except:
				iter_mtype_dict[mtype] = mtype_count
		all_mtype_dict[end_ts] = iter_mtype_dict
		results = all_mtype_dict
		return results

def getEsIndexName(topic_name):
	#body={"query": {"match_all": {}}}
	query_body = {
		'query':{
			'match':{
				'name': topic_name
			}
		}
	}
	try:
		res = weibo_es.search(index = 'topics',body = query_body)['hits']['hits']
		return res[0]['_source']['index_name']
	except:
		return -1

def getEsWeiboByTopic(topic_index_name):
	'''
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
	'''
	#body={"query": {"match_all": {}}}
	res = weibo_es.search(index=topic_index_name, doc_type=weibo_index_type, body={"query": {"match_all": {}}},\
		size = 1000000)['hits']['hits']
	return res

def getTopicByName(topic):
	if topic == 'liyue':
		id = 0
	elif topic == 'laohu':
		id = 1
	else:
		id = -1
	return id

if __name__ == '__main__':
	'''
	#正式部分代码
	topic = sys.argv[1]
	start_date = sys.argv[2] # '2015-02-23'
	end_date = sys.argv[3] # '2015-03-02'
	'''

	#测试用代码
	topic = '奥运会'
	start_date = '2016-07-14'
	end_date = '2016-07-16'

	topic = topic.decode('utf-8')
	#topic_id = getTopicByName(topic)
	topic_index_name = getEsIndexName(topic)
	'''
	#话题id异常处理
	if topic_id == -1:
		print 'Topic Error'
		exit(-1)
	'''
	start_ts = datetime2ts(start_date)
	end_ts = datetime2ts(end_date)
	#得到es中相关微博
	#es_search_weibo = getEsWeiboByTopic(topic_index_name)

	print 'topic: ', topic.encode('utf-8'), 'from %s to %s' % (start_ts, end_ts)
	duration = Fifteenminutes
	propagateCronTopic(topic_index_name, start_ts, end_ts, during=duration)

	#print topic,start_date,end_date,start_ts,end_ts
	#print len(es_search_weibo)
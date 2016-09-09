# -*- coding: utf-8 -*-
#from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
#from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
import math
import json
from sqlalchemy import func
import sys
from user_portrait.info_consume.model import TrendMaker, TrendPusher
from user_portrait.global_config import db, es_user_profile
#sys.path.append('../../../')
from user_portrait.bulk_insert import read_long_gexf


Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

def get_gexf(topic, identifyDate, identifyWindow):
	#key = _utf8_unicode(topic) +'_' + str(identifyDate) + '_' + str(identifyWindow) + '_' + 'source_graph'
	#key = str(key)
   
    #gexf2es(key, value)
	result = read_long_gexf(topic, identifyDate, identifyWindow)
	#fh = open('gexf.txt','w+')
	#fh.write(json.dumps(result))
	#fh.close()
	return result

def get_trend_pusher(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	#for item in items:
		#print dir(item)
	#return items
	result = {}
	results = []
	for item in items:
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		results.append(result)
	return results


def get_trend_maker(topic, identifyDate, identifyWindow):

	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	result = {}
	results = []
	for item in items:
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		results.append(result)
	return results
    

def get_pusher_weibos_byts(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		weibos.append(json.loads(item.weibo_info)[0])
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['timestamp'])
	#for weibo in sorted_weibos:
		#print weibo['_source']['timestamp']
	return sorted_weibos
def get_pusher_weibos_byhot(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		weibos.append(json.loads(item.weibo_info)[0])
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['retweeted'], reverse=True)
	#for weibo in sorted_weibos:
		#print weibo['_source']['retweeted']
	return sorted_weibos

def get_maker_weibos_byts(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()

	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		weibos.append(json.loads(item.weibo_info)[0])
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['timestamp'])
	#for weibo in sorted_weibos:
		#print weibo['_source']['timestamp']
	return sorted_weibos

def get_maker_weibos_byhot(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		weibos.append(json.loads(item.weibo_info)[0])
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['retweeted'], reverse=True)
	#for weibo in sorted_weibos:
		#print weibo['_source']['retweeted']
	return sorted_weibos

if __name__ == '__main__':
	#get_gexf('aoyunhui', "2016-08-11", 37 )
	#get_trend_maker('aoyunhui', "2016-08-11", 37 )
	#get_trend_pusher('aoyunhui', "2016-08-11", 37 )
	#get_pusher_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_maker_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_pusher_weibos_byhot('aoyunhui', "2016-08-11", 37 )
	get_maker_weibos_byhot('aoyunhui', "2016-08-11", 37 )
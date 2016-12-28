# -*- coding: utf-8 -*-
#from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
#from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
import re
import math
import json
from sqlalchemy import func
import sys
from user_portrait.info_consume.model import TrendMaker, TrendPusher,TopicIdentification
from user_portrait.global_config import db, es_user_profile
#sys.path.append('../../../')
from user_portrait.bulk_insert import read_long_gexf


Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

def gexf_process(data):
	results = {}
	#print type(data)
	data = json.loads(data)
	#print type(data)
	comp = re.compile('<node id=\\\"(\d*)\\\"')
	id_list = comp.findall(data)
	comp = re.compile('<attvalue for=\\\"name\\\" value=\\\"(.*)\\\"/>')
	name_list = comp.findall(data)
	comp = re.compile('<viz:size value=\\\"(\d*)\\\"/>\\n')
	size = comp.findall(data)
	comp = re.compile('label=\\\"(\d*)\\\">')
	uid = comp.findall(data)
	comp = re.compile('source=\\\"(\d*)\\\"')
	source = comp.findall(data)
	comp = re.compile('target=\\\"(\d*)\\\"/>\\n')
	target = comp.findall(data)

	nodes = []
	for i in range(len(id_list)):
		iter_item = {}
		iter_item['name'] = id_list[i]
		iter_item['symbolSize'] = size[i]
		iter_item['label'] = name_list[i]
		iter_item['uid'] = uid[i]
		nodes.append(iter_item)
	links = []
	for i in range(len(source)):
		iter_item = {}
		source_id = source[i]
		target_id = target[i]
		for node in nodes:
			if node['name'] == source_id:
				iter_item['source'] = node['label']
			if node['name'] == target_id:
				iter_item['target'] = node['label']
		 
		links.append(iter_item)
	results = {}
	results['nodes'] = nodes
	results['links'] = links
	return results

def get_gexf(topic, identifyDate, identifyWindow):
	#key = _utf8_unicode(topic) +'_' + str(identifyDate) + '_' + str(identifyWindow) + '_' + 'source_graph'
	#key = str(key)
   
    #gexf2es(key, value)
	result = read_long_gexf(topic, identifyDate, identifyWindow)
	
	return result

def get_trend_pusher(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	#for item in items:
		#print dir(item)
	#return items
	
	results = []
	for item in items:
		result = {}
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		result['uid'] = item.uid
		result['mid'] = weibo_info[0]['_id']
		results.append(result)
	return results


def get_trend_maker(topic, identifyDate, identifyWindow):

	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	
	results = []
	for item in items:
		result = {}
		#print item.uid
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		result['uid'] = item.uid
		result['mid'] = weibo_info[0]['_id']
		results.append(result)
	return results
    

def get_pusher_weibos_byts(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
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
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
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
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
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
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['retweeted'], reverse=True)
	#for weibo in sorted_weibos:
		#print weibo['_source']['retweeted']
	return sorted_weibos


def get_top_pagerank(topic, identifyDate, identifyWindow):
	items = db.session.query(TopicIdentification).filter(TopicIdentification.topic==topic ,\
														TopicIdentification.identifyDate==identifyDate ,\
														TopicIdentification.identifyWindow==identifyWindow).limit(5000)
	uid_list = [item.userId for item in items]
	

	return uid_list

if __name__ == '__main__':
	#get_gexf('aoyunhui', "2016-08-11", 37 )
	#get_trend_maker('aoyunhui', "2016-08-11", 37 )
	#get_trend_pusher('aoyunhui', "2016-08-11", 37 )
	#get_pusher_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_maker_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_pusher_weibos_byhot('aoyunhui', "2016-08-11", 37 )
	get_maker_weibos_byhot('aoyunhui', "2016-08-11", 37 )
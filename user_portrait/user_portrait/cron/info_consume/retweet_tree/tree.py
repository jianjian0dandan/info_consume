#-*- coding:utf-8 -*-
import sys,json,datetime
sys.path.append('../../../')
from global_config import weibo_es,weibo_index_name,weibo_index_type

def test_weibo():
	query_body = {
		'query': {
            'match_all': {}
        },
        'size':1,
	    'sort':{'retweeted':{'order':'desc'}}
	}
	weibo = weibo_es.search(index='aoyunhui',doc_type=weibo_index_type,body=query_body)['hits']['hits'][0]['_source']
	mid = weibo['mid']
	ts = weibo['timestamp']
	print mid,ts
	find_tree(mid,ts)

def find_tree(mid,ts):
	query_body = {
		'query':{
		    'bool':{
		        'must':[
		            {'term':{'root_mid':mid}},  #一个话题，不同情绪下给定时间里按关键词聚合
		            {'range':{
		                'timestamp':{'gte': ts} 
		            }
		        }]
		    }
		},
        'size':1000,
        'sort':{'timestamp':{'order':'asc'}}
	}
	weibo = weibo_es.search(index='aoyunhui',doc_type=weibo_index_type,body=query_body)['hits']['hits']
	for content in weibo:
		if content['directed_uid']:
			字典？

if __name__ == '__main__':
	test_weibo()
# -*- coding: utf-8 -*-

from flask import Blueprint,render_template,request
from utils import weibo_get_uid_list,today_time
import json
from user_portrait.global_utils import R_CLUSTER_FLOW2 as r_cluster

mod = Blueprint('weibo_hashtag',__name__,url_prefix='/weibo_hashtag')


@mod.route('/get_weibo_hashtag/')
def weibo_count():
    uid_list = weibo_get_uid_list('uid.txt')
    today = today_time()
    hashtag_list = {}
    for uid in uid_list:
    	hashtag = r_cluster.hget('hashtag_'+'1378483200',uid)
    	print type(hashtag)
    	hashtag = json.loads(hashtag)
    	print type(hashtag)
    	if hashtag != None:
    		for k,v in hashtag.iteritems():
    			try:
	    			hashtag_list[k] += v
	    		except:
	    			hashtag_list[k] = v
    	#r_cluster.hget('hashtag_'+str(a))
    return json.dumps(hashtag_list)



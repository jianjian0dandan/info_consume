# -*- coding: utf-8 -*-
#from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
#from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
import math
import json
from sqlalchemy import func
import sys
from cp_model import TrendMaker, TrendPusher
from cp_global_config import db, es_user_profile
sys.path.append('../../')
from bulk_insert import read_long_gexf


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
	return result

def get_trend_pusher(topic, identifyDate, identifyWindow):
	items_exist = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
														TrendPusher.windowsize==identifyWindow).all()
	print items_exist


def get_trend_maker(topic, identifyDate, identifyWindow):

	items_exist = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	print items_exist
    

if __name__ == '__main__':
	#get_gexf('aoyunhui', "2016-08-11", 37 )
	#get_trend_maker('aoyunhui', "2016-08-11", 37 )
	get_trend_pusher('aoyunhui', "2016-08-11", 37 )
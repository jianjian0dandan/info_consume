# -*- coding: utf-8 -*-
from cp_global_config import db,es_user_profile,profile_index_name,profile_index_type
from cp_model import CityTopicCount,CityWeibos
import math
import json
#from socialconsume.global_config import db
#from socialconsume.model import CityTopicCount, CityWeibos



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


def province_weibo_count(topic,start_ts,end_ts,unit=MinInterval):
    province = {}
    if (end_ts - start_ts < unit):
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)
        items = db.session.query(CityTopicCount).filter(CityTopicCount.end==upbound, \
                                                       CityTopicCount.topic==topic).all()
        # if item:
        #     print item[0]
        #     geo = _json_loads(item[0].ccount)
        #     print geo
    else:
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)

        lowbound = long((start_ts / unit) * unit)
        items = db.session.query(CityTopicCount).filter(CityTopicCount.end>lowbound, \
                                                         CityTopicCount.end<=upbound, \
                                                         CityTopicCount.topic==topic).all()
    province_dict = {}
    for item in items:          
        geo = _json_loads(item.ccount)
        for k,v in geo.iteritems():
            try:
                province_dict[k] += v['total']
            except:
                province_dict[k] = v['total']
    print province_dict
    results = sorted(province_dict.iteritems(),key=lambda x:x[1],reverse=True)
    #print results
    return results

def city_weibo_count(topic,start_ts,end_ts,province,unit=MinInterval):
    city = {}
    if (end_ts - start_ts < unit):
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)
        items = db.session.query(CityTopicCount).filter(CityTopicCount.end==upbound, \
                                                       CityTopicCount.topic==topic).all()
    else:
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)

        lowbound = long((start_ts / unit) * unit)
        items = db.session.query(CityTopicCount).filter(CityTopicCount.end>lowbound, \
                                                         CityTopicCount.end<=upbound, \
                                                         CityTopicCount.topic==topic).all()
    city_dict = {}
    for item in items:          
        geo = _json_loads(item.ccount)
        try:
            citys = geo[province]
            for k,v in geo[province].iteritems():
                try:
                    city_dict[k] += v
                except:
                    city_dict[k] = v
        except:
            continue            

    print city_dict
    results = sorted(city_dict.iteritems(),key=lambda x:x[1],reverse=True)
    #print results
    return results

def get_weibo_content(topic,start_ts,end_ts,province,sort_item='timestamp',unit=MinInterval):
    print topic,start_ts,end_ts,type(province)
    city = {}
    if (end_ts - start_ts < unit):
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)
        items = db.session.query(CityWeibos).filter(CityWeibos.end==upbound, \
                                                       CityWeibos.topic==topic).all()
    else:
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)

        lowbound = long((start_ts / unit) * unit)
        items = db.session.query(CityWeibos).filter(CityWeibos.end>lowbound, \
                                                         CityWeibos.end<=upbound, \
                                                         CityWeibos.topic==topic).all()
    weibo_dict = {}
    for item in items:          
        weibos = _json_loads(item.weibos)
        for weibo in weibos:
            weibo_content = {}
            weibo_content['text'] = weibo['_source']['text'] 
            weibo_content['uid'] = weibo['_source']['uid']
            weibo_content['timestamp'] = weibo['_source']['timestamp']
            weibo_content['sentiment'] = weibo['_source']['sentiment'] 
            weibo_content['comment'] = weibo['_source']['comment']
            weibo_content['retweeted'] = weibo['_source']['retweeted']
            weibo_content['keywords'] = weibo['_source']['keywords_dict']
            weibo_content['mid'] = weibo['_source']['mid']
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


   
    #results = sorted(city_dict.iteritems(),key=lambda x:x[1],reverse=True)
    #print results
    #return results


if __name__ == '__main__':
	#all_weibo_count('aoyunhui',1468166400,1468170900)
    get_weibo_content('aoyunhui',1468167300,1468167300,u'陕西')

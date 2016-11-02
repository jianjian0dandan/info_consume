# -*- coding: utf-8 -*-
from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
from user_portrait.global_config import weibo_es,weibo_index_name,weibo_index_type
import math
import json
from sqlalchemy import func
#from socialconsume.global_config import db
#from socialconsume.model import CityTopicCount, CityWeibos



Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

'''
def get_weibo_by_time(topic,start_ts,end_ts,sort_item='timestamp'):

    items = db.session.query(PropagateTimeWeibos).filter(PropagateTimeWeibos.topic==topic,\
                                                    PropagateTimeWeibos.end <= end_ts,\
                                                     PropagateTimeWeibos.end >= start_ts
                                            ).limit(200).all()

    weibo_dict = {}
    #print items
    if items:
        for item in items:  
            #print item
            #mtype = item.mtype
            weibos = _json_loads(item.weibos)
            #print mtype
            weibo_dict = {}
            for weibo in weibos:
                weibo_content = {}
                if type(weibo)==dict:
                    weibo_content['text'] = weibo['text'] 
                    weibo_content['uid'] = weibo['uid']
                    weibo_content['timestamp'] = weibo['timestamp']
                    weibo_content['sentiment'] = weibo['sentiment'] 
                    weibo_content['comment'] = weibo['comment']
                    weibo_content['retweeted'] = weibo['retweeted']
                    weibo_content['keywords'] = weibo['keywords_dict']
                    weibo_content['mid'] = weibo['mid']
                    #print weibo_content
                    weibo_dict[weibo_content['mid']] = weibo_content
                    try:
                        user = es_user_profile.get(index=profile_index_name,doc_type=profile_index_type,id=weibo_content['uid'])['_source']
                        weibo_content['uname'] = user['nick_name']
                        weibo_content['photo_url'] = user['photo_url']
                    except:
                        weibo_content['uname'] = 'unknown'
                        weibo_content['photo_url'] = 'unknown'
                    weibo_dict[weibo_content['mid']] = weibo_content
                else:
                    pass
                
            results = sorted(weibo_dict.items(),key=lambda x:x[1][sort_item],reverse=True)
            #for result in results:
                #print result
    else:
         results = []
    return results
        
'''
        

def get_weibo_by_time(topic,start_ts,end_ts,sort_item='timestamp'):
    print topic,start_ts,end_ts,weibo_es
    query_body = {
        'query':{
            'bool':{
                'must':[
                    {'range':{'timestamp':{'lte':int(end_ts),'gte':int(start_ts)}}}
                ]
            }
        },
        'size':200,
        'sort':{sort_item:{'order':'desc'}}
    }
    items = weibo_es.search(index=topic,body=query_body)['hits']['hits']
    #items = db.session.query(PropagateWeibos).filter(PropagateWeibos.topic==topic).all()
    weibo_dict = {}
    if items:
        for item in items:  
            #print item,type(item)
            #mtype = item.mtype
            #weibos = _json_loads(item.weibos)
            weibo = item['_source']
            #print mtype
            weibo_content = {}
            weibo_content['text'] = weibo['text'] 
            weibo_content['uid'] = weibo['uid']
            weibo_content['timestamp'] = weibo['timestamp']
            #weibo_content['sentiment'] = weibo['sentiment'] 
            try:
                weibo_content['comment'] = weibo['comment']
            except:
                weibo_content['comment'] = 0
            try:
                weibo_content['retweeted'] = weibo['retweeted']
            except:
                weibo_content['retweeted'] = 0
            #weibo_content['keywords'] = weibo['keywords_dict']
            weibo_content['mid'] = weibo['mid']
            #print weibo_content
            weibo_dict[weibo_content['mid']] = weibo_content
        results = sorted(weibo_dict.items(),key=lambda x:x[1]['retweeted'],reverse=False)

    else:
        results = []   
        #results = sorted(weibo_dict.items(),key=lambda x:x[1]['retweeted'],reverse=False)
        #for result in results:
            #print result
    return results

def _json_loads(weibos):
    try:
        return json.loads(weibos)
    except ValueError:
        if isinstance(weibos, unicode):
            return json.loads(json.dumps(weibos))
        else:
            return None

def mtype_count(topic,start_ts,end_ts,mtype,unit=MinInterval):
    if end_ts - start_ts < unit:
        upbound = long(math.ceil(end_ts / (unit)*1.0)*unit)
        #items = db.session.query(PropagateCount).filter(PropagateCount.end==upbound,\
        #                                                PropagateCount.topic==topic,\
        #                                                PropagateCount.mtype==mtype).all()
        items = db.session.query(PropagateCount).filter(PropagateCount.topic==topic).all()
        #print 'I choose method 1'
    else:
        upbound = long((start_ts / unit) * unit)
        lowbound = long((start_ts / unit) * unit)
        # items = db.session.query(PropagateCount).filter(PropagateCount.end>lowbound,\
        #                                                 PropagateCount.end<=upbound,
        #                                                 PropagateCount.topic==topic,\
        #                                                 PropagateCount.mtype==mtype).all()
        items = db.session.query(PropagateCount).filter(PropagateCount.topic==topic).all()
        #print 'I choose method 2'
    #print items
    data = {}
    for item in items:
        mtype = item.mtype
        count = _json_loads(item.dcount)
        ts = item.end
        data[str(ts)] = {}
        try:
            data[str(ts)][str(mtype)] += count
        except:
            data[str(ts)][str(mtype)] = count
    #print data
    return data
          

def get_time_count(topic,start_ts,end_ts,unit=MinInterval):#按时间趋势的不同情绪的数量
    count = {}
    if (end_ts - start_ts < unit):
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)
        items = db.session.query(PropagateCount.mtype,func.sum(PropagateCount.dcount)).filter(PropagateCount.end==upbound, \
                                                       PropagateCount.topic==topic).group_by(PropagateCount.mtype).all()
        count[end_ts]={}
        for item in items:
            try:
                count[end_ts][item[0]] += item[1]
            except:
                count[end_ts][item[0]] = item[1]        
    else:
        upbound = long(math.ceil(end_ts / (unit * 1.0)) * unit)
        lowbound = long((start_ts / unit) * unit)
        interval = (upbound-lowbound)/unit
        for i in range(interval, 0, -1):    
            begin_ts = upbound - unit * i
            end_ts = begin_ts + unit
            items = db.session.query(PropagateCount.mtype,func.sum(PropagateCount.dcount)).filter(PropagateCount.end>begin_ts, \
                                                         PropagateCount.end<=end_ts, \
                                                         PropagateCount.topic==topic).group_by(PropagateCount.mtype).all()
            count[end_ts] = {}
            for item in items:
                try:
                    count[end_ts][item[0]] += item[1]
                except:
                    count[end_ts][item[0]] = item[1]
    return count

if __name__ == '__main__':
	#all_weibo_count('aoyunhui',1468166400,1468170900)
    #print get_weibo_content('aoyunhui',1468167300,1468167300,u'陕西')
    mtype_count('aoyunhui',1468166400,1468170900,1)
    print get_weibo_by_time('aoyunhui',1468166400,1468170900)
    print get_weibo_by_hot('aoyunhui',1468166400,1468170900)

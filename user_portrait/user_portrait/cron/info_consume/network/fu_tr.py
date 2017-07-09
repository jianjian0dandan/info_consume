#-*- coding:utf-8 -*-
import json
import redis
import operator
from peak_detection import detect_peaks
from bottom_detect import detect_bottom
from dynamic_xapian_weibo import getXapianWeiboByTopic
#from config import db, REDIS_HOST, REDIS_PORT, USER_DOMAIN, DOMAIN_LIST
#from config import xapian_search_user as user_search
from parameter import user_fields_list, field_list, TOPIC, START, END ,\
         domain_list, USER_DOMAIN, Minute, Fifteenminutes, Hour, Day ,\
         MinInterval , fu_tr_during, trend_maker_count, trend_pusher_count ,\
         fu_tr_unit, fu_tr_top_keyword, p_during,MYSQL_TOPIC_LEN
from parameter import weibo_topic2xapian, weibo_fields_list
from bottom_detect import detect_bottom
from get_first_user import get_user_info
import sys
sys.path.append('../../')
from model import PropagateCount, PropagateKeywords, TrendKeyUser, TrendMaker, TrendPusher
from time_utils import datetime2ts, ts2datetime, ts2date
from global_config import db, REDIS_HOST, REDIS_PORT,\
        weibo_es, weibo_index_type
#from parameter import MYSQL_TOPIC_LEN
#改动 这里不要啦
#from global_config import xapian_search_user as user_search

#jln
#during = fu_tr_during
during = fu_tr_during /2
unit = fu_tr_unit
'''
Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes
during = Day
domain_list = DOMAIN_LIST
field_list = ['_id', 'user', 'retweeted_uid', 'retweeted_mid', 'text', 'timestamp', \
                  'reposts_count','comments_count','terms']
weibo_fields_list = ['_id', 'user', 'retweeted_uid', 'retweeted_mid', 'text', 'timestamp', \
               'reposts_count', 'source', 'bmiddle_pic', 'geo', 'attitudes_count', \
               'comments_count', 'sentiment', 'topics', 'message_type']
user_fields_list = ['_id', 'name', 'gender', 'profile_image_url', 'friends_count', \
                    'followers_count', 'location', 'created_at','statuses_count']
REDIS_HOST = '219.224.135.48'
REDIS_PORT = 6379
USER_DOMAIN = 'user_domain' # user domain hash
DOMAIN_LIST = ['folk', 'media', 'opinion_leader', 'oversea', 'other']
'''
def _default_redis(host=REDIS_HOST, port=REDIS_PORT, db=0):
    return redis.StrictRedis(host, port, db)

r = _default_redis()

def uid2domain(user):
    #domain_str = r.hget(USER_DOMAIN, str(user))
    if not domain_str:
        return 'other'

    domain_dict = json.loads(domain_str)
    domain = domain_dict['v3']

    return domain


def Merge_propagate(items):
    result = 0
    
    for item in items:
        dcount = json.loads(item.dcount)
        
        try:
            result += dcount
        except KeyError:
            continue
    #print 'merge:', result
    return result


#获取区间发布的微博数，以天为单位， 并获取第一个拐点的时间区间
#def get_interval_count(topic, date, windowsize, topic_xapian_id):
def get_interval_count(topic, date, windowsize):
    results = []
    ts_list = []
    start_date = ts2datetime(datetime2ts(date) - windowsize * Day)
    unit = 900
    print 'start_date:', start_date
    start_ts = datetime2ts(start_date)
    ts_list = [start_ts]
    end_ts = datetime2ts(date)
    interval = (end_ts - start_ts) / during
    print 'interval:', interval
    print topic.encode('utf-8')
    if MYSQL_TOPIC_LEN == 0:
    	topic0 = topic[:20]
    else:
        topic0=topic
    for i in range(interval, 0, -1):
        #print 'i:', i
        begin_ts = end_ts - during * i
        over_ts = begin_ts + during
        #print 'begin_ts:', begin_ts#ts2date(begin_ts)
        #print 'over_ts:', over_ts#ts2date(over_ts)
        ts_list.append(over_ts)
        items = db.session.query(PropagateCount).filter(PropagateCount.topic==topic0 ,\
                                                        PropagateCount.end<=over_ts ,\
                                                        PropagateCount.end>begin_ts ,\
                                                        PropagateCount.range==unit).all()
                                                        #).all()

        if items:
            result = len(items)
        else:
            result = 0 
        results.append(float(result))
    print 'detect_peak_bottom_line::', results
    new_zeros = detect_peaks(results) # 返回峰值出现的时间区间的序号
    new_bottom  = detect_bottom(results)  # get the first bottom
    print 'new_peaks:', new_zeros
    print 'new_bottom:', new_bottom
    # 存趋势时间范围
    # save_peak_bottom(new_zeros, new_bottom)
    #trend_maker = get_makers(topic, new_zeros, new_bottom, ts_list, topic_xapian_id)
    trend_maker = get_makers(topic, new_zeros, new_bottom, ts_list)
    print 'trend_makers:', trend_maker
    trend_pusher = get_pushers(topic,new_zeros, new_bottom, ts_list)
    print 'trend_pushers:', trend_pusher
    save_trend_maker(topic, date, windowsize, trend_maker)
    save_trend_pusher(topic, date, windowsize, trend_pusher)
    
    return trend_maker, trend_pusher
'''
# save trend_user
def save_trend_keyuser(topic, date, windowsize, trend_maker, trend_pusher):
    item = TrendKeyUser(topic, date, windowisze, json.dumps(trend_maker), json.dumps(trend_pusher))
    item_exist = db.session.query(TrendKeyUser).filter(TrendKeyUser.topic==topic ,\
                                                       TrendKeyUser.date==date ,\
                                                       TrendKeyUser.windowsize==windowsize).first()
    if item_exist:
        db.session.delete(item_exist)
    db.session.add(item)
    db.session.commit()
    print 'save trend_keyuser'
'''
# save trend_maker
#def save_trend_maker(topic, date, windowsize, trend_maker,topic_xapian_id):
def save_trend_maker(topic, date, windowsize, trend_maker):
    #xapian_search_weibo = getXapianWeiboByTopic(topic_xapian_id) # topic id 要做一下处理
    makers = trend_maker
    rank = 0
    user_exist_list = []
    #db.session.execute("DROP TABLE trend_maker")
    #db.session.create(TrendMaker)
    '''
    items_exist = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
                                                      TrendMaker.date==date ,\
                                                      TrendMaker.windowsize==windowsize).all()
    
    for item_exist in items_exist:
        db.session.delete(item_exist)
    db.session.commit()
    ''' 
    for maker in makers:
        uid = maker[0]
        if uid in user_exist_list:
            continue
        user_exist_list.append(uid)
        if rank>=trend_maker_count:
            break
        rank += 1
        mid = maker[1]
        value = maker[2] #内容相关度---关键词命中个数
        key_item = maker[3] # 命中的关键词 
        user_info = get_user_info(uid)
        query_body = {
            'query': {
                'bool': {
                    'must':{'term':{'mid': mid}}
                        
                        }
                },
            
            'size': 1000000  # 返回条数限制 待删
        }
        weibo_info = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
        #print 'trend_maker weibo_info:', weibo_info
        #domain = uid2domain(uid)
        domain = 'Unknown'
        timestamp = int(weibo_info[0]['_source']['timestamp'])
        # 修改model
        item = TrendMaker(topic, date, windowsize, uid, timestamp, json.dumps(user_info), json.dumps(weibo_info), domain, rank,json.dumps(value), json.dumps(key_item))
        #print item
        db.session.add(item)
    db.session.commit()
    #print 'save_trend_maker success'


# save trend_pusher
#def save_trend_pusher(topic, date, windowsize, trend_pusher, topic_xapian_id):
def save_trend_pusher(topic, date, windowsize, trend_pusher):
    #xapian_search_weibo = getXapianWeiboByTopic(topic_xapian_id) # topic id 要做一下处理
    pushers = trend_pusher
    rank = 0
    user_exist_list = []
    items_exist = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
                                                       TrendPusher.date==date ,\
                                                       TrendPusher.windowsize==windowsize).all()
    for item_exist in items_exist:
        db.session.delete(item_exist)
    db.session.commit()
    for pusher in pushers:
        uid = pusher[0]
        if uid in user_exist_list:
            continue
        user_exist_list.append(uid)
        if rank>=trend_pusher_count:
            break
        rank += 1
        mid = pusher[1]
        user_info = get_user_info(uid)
        #weibo_info = xapian_search_weibo.search_by_id(wid, fields=weibo_fields_list)
        query_body = {
            'query': {
                'bool': {
                    'must':{'term':{'mid': mid}}
                        
                        }
                },
            
            'size': 1000000  # 返回条数限制 待删
        }
        weibo_info = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
        #domain = uid2domain(uid)
        timestamp = int(weibo_info[0]['_source']['timestamp'])
        item = TrendPusher(topic, date, windowsize, uid, timestamp, json.dumps(user_info), json.dumps(weibo_info), 'Unknown', rank)
        db.session.add(item)
    db.session.commit()
    print 'save_trend_pusher success'

    
#trend_maker
#def get_makers(topic, new_peaks, new_bottom, ts_list, topic_xapian_id):
def get_makers(topic, new_peaks, new_bottom, ts_list):
    begin_ts = ts_list[new_bottom[0]]
    end_ts = ts_list[new_peaks[0]]
    #print 'get_maker begin_ts:', begin_ts
    #print 'get_maker end_ts:', end_ts
    if begin_ts > end_ts:
        begin_ts = ts_list[0]

    keyword_data = get_keyword(topic, begin_ts, end_ts, top=fu_tr_top_keyword) # propagateKeywork
    print 'keyword_data:', keyword_data # 权重最大的前50个terms
    makers = sort_makers(keyword_data, begin_ts, end_ts, ts_list, topic)
    makers_list = []
    for maker in makers:
        print maker
        uid = maker[0]
        mid = maker[1][0]
        value = maker[1][1]
        key_term  = maker[1][2]
        makers_list.append((uid, mid, value, key_term))
    #print 'trend_makers:', makers
    return makers_list

def parseKcount(kcount):
    kcount_dict = {}
    kcount = json.loads(kcount)
    #print 'kcount::::::',kcount
    for k ,v in kcount:
        kcount_dict[k] = v
    #print 'kcount_dict::::::::',kcount_dict
    return kcount_dict 

def _top_keywords(kcount_dict, top=fu_tr_top_keyword):
    results_list = []

    if kcount_dict != {}:
        results = sorted(kcount_dict.iteritems(), key=operator.itemgetter(1), reverse=False)
        results = results[len(results) - top:]
        
        for k, v in results:
            results_list.append(k)
        
    return results_list

# get top 50 keywords
def get_keyword(topic, begin_ts, end_ts, top):
    kcounts_dict = {}
    #unit = 900 # PropagateKeywords unit=900
    #limit = 50
    limit = fu_tr_top_keyword
    if MYSQL_TOPIC_LEN == 0:
    	topic=topic[:20]
    #print 'get_keywords begin_ts:', begin_ts
    #print 'get_keywords end_ts:', end_ts
    print '298 topic:::',topic.encode('utf-8'),unit,limit
    items = db.session.query(PropagateKeywords).filter(PropagateKeywords.end>begin_ts ,\
                                                       PropagateKeywords.end<=end_ts ,\
                                                       PropagateKeywords.topic==topic ,\
                                                       PropagateKeywords.range==unit ,\
                                                       PropagateKeywords.limit==limit).all()
    #print 'items:::::',items
    if items:
        for item in items:
            kcount_dict = parseKcount(item.kcount)
            for k,v in kcount_dict.iteritems():
                try:
                    kcounts_dict[k] += v
                except KeyError:
                    kcounts_dict[k] = v
        keyword_data = _top_keywords(kcounts_dict, top)
    else:
        keyword_data = []
    
    return keyword_data


# sort makers
#def sort_makers(keyword_data, begin_ts, end_ts, ts_list, topic_xapian_id):
def sort_makers(keyword_data, begin_ts, end_ts, ts_list, topic):
    
    begin_ts = begin_ts - Hour
    #query_dict = {'timestamp':{'$gt': begin_ts, '$lt': end_ts}}
    print '323',begin_ts,end_ts,topic.encode('utf-8')
    query_body = {
            'query': {
                'bool': {
                    'should': [
                        {'term': {
                            'message_type': 1
                        }
                        }
                        ,
                        {'term': {
                            'message_type': 3       #不确定 待删
                        }
                        }],

                    'must':
                    # {'term':{'name': topic}},
                        {'range': {
                            'timestamp': {'gte': begin_ts, 'lt': end_ts}
                        }
                        }
                }
            },
            'size': 1000000,  # 返回条数限制 待删
            'sort': {"timestamp": {"order": "asc"}}
        }
    es_search_weibos = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
    num = 0
    print 'len(es_search_weibos):',len(es_search_weibos)
    if len(es_search_weibos) == 0:
        return []
    weibo_term = {}
    #print es_search_weibos
    for weibo in es_search_weibos:
        #print weibo
        num += 1
        if num > fu_tr_top_keyword:
            break
        uid = weibo['_source']['uid']
        wid = weibo['_source']['mid']
        #terms_list = weibo['_source']['terms']
        terms_dict = json.loads(weibo['_source']['keywords_dict'])
        #print '****************', type(terms_dict)
        key_term_count = []
        key_term = []
        for item in terms_dict:
            key_term.append(item)
            key_term_count.append(terms_dict[item])
        weibo_term[uid] = [wid, key_term_count, key_term]
    #print 'weibp_term:::::::::::::',weibo_term
    sort_weibo_term = sorted(weibo_term.items(), key=lambda x:x[1][1], reverse=True)

    return sort_weibo_term[:fu_tr_top_keyword]

#trend_pusher
#def get_pushers(topic, new_peaks, new_bottom, ts_list, topic_xapian_id):
def get_pushers(topic, new_peaks, new_bottom, ts_list):
    #unit = 900
    #p_during = Hour
    p_ts_list = []
    results = []
    end_ts = ts_list[new_peaks[0]]
    begin_ts = ts_list[new_bottom[0]]
    print 'pusher_start_ts:', ts2date(begin_ts)
    print 'pusher_end_ts:', ts2date(end_ts)   #有两个时间  起点和终点  波峰和波谷  现在搞反了  不知道为什么
    if begin_ts>end_ts:
        begin_ts = ts_list[0]
    interval = (end_ts - begin_ts) / p_during
    print end_ts - begin_ts
    print p_during
    print interval
    for i in range(interval, 0, -1):
        begin_ts = end_ts - p_during * i
        over_ts = begin_ts + p_during
        #print '383',begin_ts,over_ts
        p_ts_list.append(over_ts)
        items = db.session.query(PropagateCount).filter(PropagateCount.topic==topic ,\
                                                        PropagateCount.end<=over_ts ,\
                                                        PropagateCount.end>begin_ts ,\
                                                        PropagateCount.range==unit).all()

       
        if items:
            result = Merge_propagate(items)
        else:
            result = 0
        results.append(float(result))
    #print 'pusher_line:', results
    #try:
    print results
    print p_ts_list
    try:
        max_k_timestamp = get_max_k_timestamp(results, p_ts_list) # 获取增速最快的时间点
    except:
        max_k_timestamp = end_ts
    #save max_k_timestamp
    # save_mak_k(max_k_timestamp)
    end = max_k_timestamp
    start = max_k_timestamp - p_during
    query_body = {
            'query': {
                'bool': {
                    'must':
                    # {'term':{'name': topic}},
                        {'range': {
                            'timestamp': {'gte': end, 'lt': end+3600} #3600
                        }
                        }
                }
            },
            'size': 1000000,  # 返回条数限制 待删
            'sort': {"timestamp": {"order": "asc"}}
        }
    es_search_weibos = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
    #xapian_search_weibo = getXapianWeiboByTopic(topic_xapian_id)
    #query_dict = {
        #'timestamp':{'$gt':end, '$lt':end+3600}
        #}
    #以下是通过找到斜率最大的时间段内所有微博中转发数最大的用户
    #results = xapian_search_weibo.search(query=query_dict, sort_by=['reposts_count'], fields=['_id', 'user', 'reposts_count'])

    results = es_search_weibos
    print 'pusher_search_count:', len(results)
    #print 'pusher_query_dict:', query_dict
    pusher_list = []
    count = 0
    for result in results:
        count += 1
        if count>100:
            break
        wid = result['_source']['mid']
        uid = result['_source']['uid']
        value = result['_source']['retweeted']
        pusher_list.append((uid, wid, value))
    # sort by reposts_count
    # sort_by_rc(pusher_list)
    return pusher_list

def get_max_k_timestamp(results, p_ts_list):
    # 最大斜率 且增量要大于平均增量
    length = len(results)
    smooth_results = []
    incre_dict = {}
    k_dict = {}
    # 平滑处理--感觉会消耗信息！！！！！！
    for i in range(length):
        if i>1:
            smooth = sum(results[i-2:i+1]) / 3.0
            smooth_results.append(smooth)
            #print 'smooth_results:',i ,results[i-2:i+1], smooth_results
        l = len(smooth_results)
        if l>=2:
            '''
            if smooth_results[l-2]!=0:
                k = (smooth_results[l-1] - smooth_results[l-2]) / smooth_results[l-2]
                k_dict[l-1] = k
            else:
                k_dict[l-1] = 0
            '''
            k = (smooth_results[l-1] - smooth_results[l-2]) / Hour
            k_dict[l-1] = k

    #print 'smooth_results:', smooth_results
    sort_k_list = sorted(k_dict.items(), key=lambda c:c[1], reverse=True)
    #print 'sort_k_list:', sort_k_list
    smooth_length = len(smooth_results)
    all_average = 0
    for j in range(smooth_length):
        if j>0:
            incre = float(smooth_results[j] - smooth_results[j-1])
            all_average += incre
            incre_dict[j-1] = incre
    try:
        average_incre = all_average / len(incre_dict)    
    except:
        average_incre = all_average
    remove_list = []
    #print 'incre_dict:', incre_dict
    # 筛掉增量小于平均增量的
    for k in incre_dict:
        if incre_dict[k]<=average_incre:
            remove_list.append(k)
    after_remove_k_list = []
    for sort_k in sort_k_list:
        if not sort_k[0] in remove_list:
            index = sort_k[0]
            timestamp = p_ts_list[index+1]
            k_value = sort_k[1]
            after_remove_k_list.append((index+1, timestamp, k_value))
    
    max_k_timestamp = after_remove_k_list[0][1]
    #print 'after_remove_k_list:', after_remove_k_list
    print 'max_k_timestamp:', max_k_timestamp
    print 'max_k_timestamp:', ts2date(max_k_timestamp)
    return max_k_timestamp


#根据第一个拐点所在的峰值区间，获取微博，统计其top source user
def get_tsu(new_peaks, new_bottom, ts_list, topic_xapian_id):
    #print 'new_peaks:', new_peaks
    #print 'new_bottom:', new_bottom
    #print 'ts_list:', ts_list
    end_ts = ts_list[new_peaks[0]]
    begin_ts = ts_list[new_bottom[0]]
    if begin_ts>end_ts:
        begin_ts = ts_list[0]
    query_dict = {
        'timestamp':{'$gt':begin_ts, '$lt':end_ts},
        'message_type':3
        }
    print 'query_dict:', query_dict
    print 'begin_ts:', ts2date(begin_ts)
    print 'end_ts:', ts2date(end_ts)
    xapian_search_weibo = getXapianWeiboByTopic(topic_xapian_id)# 这里需要考虑话题id
    count, results = xapian_search_weibo.search(query=query_dict, fields=['retweeted_uid','retweeted_mid'])
    print 'count:', count
    ruid_count = {}
    ruid_mid = {}
    for result in results():
        r_uid = result['retweeted_uid']
        if (r_uid == 0) or (not r_uid):
            continue
        ruid_mid[r_uid] = result['retweeted_mid']
        try:
            ruid_count[r_uid] += 1
        except KeyError:
            ruid_count[r_uid] = 1
    sorted_result = sorted(ruid_count.items(), key=lambda d:d[1], reverse=True)
    print 'top_source_user:',sorted_result
    top_source_user = sorted_result[0][0]
    top_source_mid = ruid_mid[top_source_user]
    # 测试用于找到首发者的微博发布时间----注意这里可能会在xapian中找不到，可能需要从API获取
    '''
    count, top_weibo = xapian_search_weibo.search(query={'_id':top_source_mid}, fields=['timestamp'])
    print 'count:', count
    for i in top_weibo():
        timestamp = i['timestamp']
        print 'timestamp:', ts2date(int(timestamp))
    '''    
    return sorted_result



if __name__=='__main__':
    
    topic = u'高校思想宣传'
    date = '2015-02-01'
    windowsize = 9
    topic_xapian_id = '54ccbfab5a220134d9fc1b37'
    
    '''
    topic = TOPIC
    date = END
    start_ts = datetime2ts(START)
    end_ts = datetime2ts(END)
    #windowsize = (end_ts - start_ts) / Day
    windowsize = (end_ts - start_ts) / Day /2
    topic_xapian_id = weibo_topic2xapian(topic, start_ts, end_ts)
    '''
    get_interval_count(topic, date, windowsize)
    

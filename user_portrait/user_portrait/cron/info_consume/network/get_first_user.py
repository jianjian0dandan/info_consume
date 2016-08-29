# -*- coding: utf-8 -*-

import json
import sys
import os

reload(sys)
sys.setdefaultencoding('utf-8')
import redis
# from config import db, REDIS_HOST, REDIS_PORT
from parameter import USER_DOMAIN, DOMAIN_LIST
from parameter import fields_list, user_fields_list, TOPIC, START, END, first_user_count
from parameter import Day, domain_list
from global_utils_do import es_user_profile, profile_index_name, profile_index_type, load_scws, cut, cut_filter, re_cut
#print os.getcwd()
sys.path.append('domain')
from test_domain_v2 import domain_classfiy
#from domain.test_domain_v2 import domain_classfiy
sys.path.append('../')
from time_utils import ts2datetime, datetime2ts


from utils import acquire_user_by_id
from model import FirstUser, FirstDomainUser  # 时间在前20的user及其对应的微博信息
from global_config import db, REDIS_HOST, REDIS_PORT
from global_config import weibo_es, weibo_index_type

'''
Day = 3600 * 24
fields_list = ['_id', 'user', 'retweeted_uid', 'retweeted_mid', 'text', 'timestamp', \
               'reposts_count', 'source', 'bmiddle_pic', 'geo', 'attitudes_count', \
               'comments_count', 'sentiment', 'topics', 'message_type', 'terms']

user_fields_list = ['_id', 'name', 'gender', 'profile_image_url', 'friends_count', \
                    'followers_count', 'location', 'created_at','statuses_count']

REDIS_HOST = '219.224.135.48'
REDIS_PORT = 6379
USER_DOMAIN = 'user_domain' # user domain hash
DOMAIN_LIST = ['folk', 'media', 'opinion_leader', 'oversea', 'other']
'''

def get_topicweibo_byid(uid, topic):
    query_body = {
                     'query': {
                         'bool': {
                             'must':
                                 {'term': {'uid': uid}}

                         }
                     },
                     'size': 1000
                 }
    es_search_weibos = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
    return es_search_weibos

def separater(user_weibos):
    #print user_weibos
    s = load_scws()
    contents = []
    #all_words_dict = {}
    for user_weibo in user_weibos:
        content = user_weibo['_source']['text']
        print str(content)
        content = cut_filter(content)
        content = re_cut(content)
        separated_words = cut(s, content)
        words_dict = {}
        for word in separated_words:
            print str(word)
            try:
                words_dict[word] += 1
            except:
                words_dict[word] = 1

        #for item in words_dict:
            #print str(words_dict[item])

        #contents.append(content)


    #print contents

    return words_dict

def uid2domain(uid, topic):
    user_weibos = get_topicweibo_byid(uid, topic)
    separate_weibos = separater(user_weibos)

    user_package = []
    weibo_words_package = {}
    weibo_words_package = {str(uid):separate_weibos}
    print '****************',weibo_words_package
    #domain_results = domain_classfiy([1678907992],{uid:{'打球':500, '跑步':100, '比赛':200}})
    domain_results = domain_classfiy(uid,weibo_words_package)
    #uid_list:uid列表 [uid1,uid2,uid3,...]
    #uid_weibo:分词之后的词频字典  {uid1:{'key1':f1,'key2':f2...}...}
    #print domain_results
    '''
    domain_str = r.hget(USER_DOMAIN, str(user))
    if not domain_str:
        return 'other'

    domain_dict = json.loads(domain_str)
    domain = domain_dict['v3']
    '''
    #domain_results = -1
    return domain_results


# def get_first_node(topic, start_date, date, windowsize, topic_xapian_id):
def get_first_node(topic, start_ts, end_ts, windowsize, date):
    '''
    根据timestamp,获取top20的用户----微博可能就不只20条了
    根据微博获取对应的用户信息------可能会出现用户重复的情况，这里只取时间最早的那一个
    将其保存
    '''
    if topic and topic != '':
        # topic = topic.encode('utf-8')
        print topic
        # datestr = start_date.replace('-','')
        # xapian_search_weibo = getXapianWeiboByTopic(topic_id=topic_xapian_id)
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
                            'message_type': 3
                        }
                        }],

                    'must':
                    # {'term':{'name': topic}},
                        {'range': {
                            'timestamp': {'gte': start_ts, 'lt': end_ts}
                        }
                        }
                }
            },
            'size': 1000,  # 返回条数限制 待删
            'sort': {"timestamp": {"order": "asc"}}
        }
        es_search_weibos = weibo_es.search(index=topic, doc_type=weibo_index_type, body=query_body)['hits']['hits']
        user_list = []
        time_top_nodes = es_search_weibos
        if not time_top_nodes:
            print
            'search error'
        else:
            # print 'time_top_nodes:', time_top_nodes
            s = 0
            domain_count_list, domain_user_list = init_domain_list()
            print 'start_node:'
            # print time_top_nodes[1]

            uid_package = []
            for node in time_top_nodes:
                # print 'node:', node
                node = node['_source']
                uid = node['uid']
                #print uid
                #user_domain = uid2domain(uid, topic)    #传入topic用于获取用户关于某一话题的全部微博
                #print user_domain
                timestamp = node['timestamp']
                #print timestamp
                if not uid in uid_package:
                    uid_package.append(uid)
                else:
                    continue

                #print 'start geting user info'
                user_info = get_user_info(uid)  # 获取top_time微博对应的用户信息
                #print 'end geting user info'
                user_weibos = get_topicweibo_byid(uid, topic)
                save_first_nodes(topic, date, windowsize, uid, timestamp, user_info, user_weibos)
                #print user_info


'''
        begin_ts = datetime2ts(start_date)
        end_ts = datetime2ts(date)
        topics = topic.strip().split(',')
        
        query_dict = {
            'timestamp': {'$gte': begin_ts, '$lte': end_ts},
            '$or': [{'message_type':1},{'message_type':3}]
            }
        
        #query_dict = {'$or':[{'message_type':1}, {'message_type':3}]}
        print 'first_user_query:', query_dict
        # 这里只选取原创和转发微博进行计算
        
        #for c_topic in topics:
            #query_dict['$and'].append({'topics': c_topic})
        
        time_top_nodes = xapian_search_weibo.search(query=query_dict, sort_by=['-timestamp'], fields=fields_list)
        user_list = []
        if not time_top_nodes:
            print 'search error'
        else:
            #print 'time_top_nodes:', time_top_nodes
            s = 0
            
            #domain_count_list = {'folk':0, 'media':0, 'opinion_leader':0, 'oversea':0, 'other':0}
            #domain_user_list = {'folk':[], 'media':[], 'opinion_leader':[], 'oversea':[], 'other':[]}
            
            domain_count_list, domain_user_list = init_domain_list()

            print 'start_node:'
            for node in time_top_nodes[1]():
                #print 'node:', node
                uid = node['user']
                user_domain = uid2domain(uid)
                print user_domain
                timestamp = node['timestamp']
                user_info = get_user_info(uid) # 获取top_time微博对应的用户信息
                if s < first_user_count:
                #first_user_count = 20
                    if user_info and (not (uid in user_list)):
                        s += 1
                        weibo_info = node
                        user_list.append(uid)
                        save_first_nodes(topic, date, windowsize, uid, timestamp, user_info, weibo_info, user_domain)
                #if domain_count_list == {'folk':first_user_count, 'media':first_user_count, 'opinion_leader':first_user_count, 'oversea':first_user_count, 'other':first_user_count}:
                #    break
                stop_s = 0
                for domain in domain_list:
                    if domain_count_list[domain] == first_user_count:
                        stop_s += 1
                if stop_s == len(domain_list):
                    break

                for domain in domain_list:
                    if domain_count_list[domain] >= first_user_count:
                        continue
                    elif user_domain==domain:
                        if user_info and (not(uid in domain_user_list[domain])):
                            domain_user_list[domain].append(uid)
                            domain_count_list[domain] += 1
                            rank = domain_count_list[domain]
                            save_domain_nodes(topic, date, windowsize, uid, timestamp, user_info, weibo_info, user_domain, rank)
'''


def save_domain_nodes(topic, date, windowsize, uid, timestamp, user_info, weibo_info, user_domain='other', rank = -1):
    item = FirstDomainUser(topic, date, windowsize, uid, timestamp, json.dumps(user_info), json.dumps(weibo_info),
                           user_domain, rank)
    item_exist = db.session.query(FirstDomainUser).filter(FirstDomainUser.topic == topic, \
                                                          FirstDomainUser.date == date, \
                                                          FirstDomainUser.windowsize == windowsize, \
                                                          FirstDomainUser.uid == uid).first()
    if item_exist:
        db.session.delete(item_exist)
    db.session.add(item)
    db.session.commit()


def get_user_info(uid):
    user_info = {}
    query_body = {
                     'query': {
                         'bool': {
                             'must':
                                 {'term': {'uid': uid}}

                         }
                     }
                 }


    result = es_user_profile.search(index=profile_index_name, doc_type=profile_index_type, body=query_body)['hits']['hits']
    #result = result[0]['_source']
    #print result
    
    if len(result) > 1:
        user_info['name'] = result['nick_name']
        user_info['location'] = result['user_location']
        # user_info['gender'] = result['gender']
        user_info['friends_count'] = result['friendsnum']
        user_info['followers_count'] = result['fansnum']
        user_info['profile_image_url'] = result['photo_url']
        #user_info['friends_count'] = result['friends_count']
        #user_info['followers_count'] = result['followers_count']
        user_info['created_at'] = result['created_at']
        #user_info['statuses_count'] = result['statuses_count']

    else:
        user_info['name'] = u'未知'
        user_info['location'] = u'未知'
        user_info['friends_count'] = u'未知'
        user_info['followers_count'] = u'未知'
        user_info['profile_image_url'] = 'no'
        user_info['created_at'] = u'未知'
        #user_info['statuses_count'] = u'未知' 
                              
    return user_info
    
                              

def save_first_nodes(topic, date, windowsize, uid, timestamp, user_info, weibo_info, user_domain = 'other'):


    item = FirstUser(topic, date, windowsize, uid, timestamp, json.dumps(user_info), json.dumps(weibo_info),
                     user_domain)
    item_exist = db.session.query(FirstUser).filter(FirstUser.topic == topic, \
                                                FirstUser.date == date, \
                                                FirstUser.windowsize == windowsize, \
                                                FirstUser.uid == uid).first()
    if item_exist:
        db.session.delete(item_exist)
        db.session.add(item)
    db.session.commit()


def init_domain_list():
    domain_count_list = {}
    domain_user_list = {}
    for domain in domain_list:  # domain_list = ['folk', 'media', 'opinion_leader', 'oversea', 'other']
        domain_count_list[domain] = 0
        domain_user_list[domain] = []
    return domain_count_list, domain_user_list


if __name__ == '__main__':
    '''
    topic = u'全军政治工作会议'
    windowsize = 17
    end_ts = datetime2ts('2014-11-16')
    date = ts2datetime(end_ts)
    start_ts = datetime2ts('2014-10-30')
    start_date = ts2datetime(start_ts) # 确定topic的start_ts和end_ts是怎么得来的
    '''
    topic = TOPIC
    start_ts = datetime2ts(START)
    end_ts = datetime2ts(END)
    start_date = START
    date = END
    windowsize = (end_ts - start_ts) / Day

    get_first_node(topic, start_date, date, windowsize)  # 如果start_ts就是第一条微博出现的时间，不能只查询前15分钟的数据。要考虑极端情况，必须查询所有数据

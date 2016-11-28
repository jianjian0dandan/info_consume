# -*- coding:utf-8 -*-
'''
用户个性化推荐的后台相关计算模块
'''
__author__ = 'zxy'
import Queue
import codecs
import json
import os
import time

from user_portrait.global_config import R_BEGIN_TIME
from user_portrait.parameter import DAY, HOUR
from user_portrait.parameter import RUN_TYPE, RUN_TEST_TIME
from user_portrait.parameter import topic_en2ch_dict
from user_portrait.time_utils import ts2datetime, datetime2ts

from ads_classify import adsClassify
from user_portrait.attribute.influence_appendix import weiboinfo2url
from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, es_user_profile, profile_index_name, \
    profile_index_type, \
    es_user_portrait, portrait_index_name, ads_weibo_index_type, portrait_index_type
from user_portrait.global_utils import retweet_index_name_pre, retweet_index_type, es_retweet
from user_portrait.zxy_params import ADS_TOPIC_TFIDF_DIR


def adsRec(uid, queryInterval=HOUR * 4):
    '''
    从广告表中读取当前时间点前一段时间queryInterval内的广微博，得到其中的广告部分
    然后根据用户的key_word信息得到推荐的广告。
    :param uid: 用户ID
    :param queryInterval: 查询之前多久的广告
    :return: 广告微博列表，按照相关度（感兴趣程度）排序
    '''

    # 运行状态，
    # 0 ->  当前为2013-9-8 00:00:00
    # 1 ->  当前时间
    now_date = ts2datetime(time.time()) if RUN_TYPE == 1 else RUN_TEST_TIME

    # 获取用户的偏好
    user_portrait_result = es_user_portrait. \
        get_source(index=portrait_index_name, doc_type=profile_index_type, id=uid)

    user_key_words = set(user_portrait_result["keywords_string"].split("&"))
    # keywords_items = sorted(json.loads(user_portrait_result["keywords"]),
    # key=lambda kw: kw[1],
    # reverse=True)
    # topic_items = sorted(json.loads(user_portrait_result["topic"]).items(),
    # key=lambda kw: kw[1],
    # reverse=True)

    # test，目前使用的是从原始数据中读取一定时间段内的微博并实时计算的方式得到
    #
    ads_weibo_index_name = flow_text_index_name_pre + now_date
    ads_weibo_all = es_flow_text.search(index=ads_weibo_index_name,
                                        doc_type=ads_weibo_index_type,
                                        body={'query': {"filtered": {"filter": {
                                            "range": {"timestamp": {"gte": datetime2ts(now_date) - queryInterval}}}}},
                                              'size': 2000,
                                        }
    )['hits']['hits']

    # 根据权重得到不同类别上词语的权重TFIDF
    topic_word_weight_dic = construct_topic_word_weight_dic(ADS_TOPIC_TFIDF_DIR)

    # 根据用户发微博的keywords得到用户在广告的topic上的分布
    # 因为已有的topic不太适合广告的分类
    user_topic_dic = construct_topic_feature_dic(user_key_words, topic_word_weight_dic)

    ads_weibo_prefer = adsPreferred(user_topic_dic, ads_weibo_all, topic_word_weight_dic, 30)
    return ads_weibo_prefer


# 广告分类词的TF-IDF
def construct_topic_word_weight_dic(topic_word_weight_dir):
    topic_word_weight_dic = dict()
    # topic_word_weight_dir = topic_word_weight_dir.decode("ascii")
    for file_name in os.listdir(topic_word_weight_dir):
    	# file_name = file_name.decode("utf-8")
    	# print file_name
        weight_file = os.path.join(topic_word_weight_dir, file_name)
        # print weight_file
        if not os.path.isfile(weight_file):
            continue
        with codecs.open(weight_file, encoding="utf-8") as f:
            word_weight_dic = dict()
            for line in f.readlines():
                items = line.split(" ")
                word_weight_dic[items[0]] = float(items[1])
            # fuck py2!!
            # listdir出来的是str, 使用的是默认的gbk编码(在windows下),使用GBK解码成Unicode。再次fuck py2!
            # fix 2016.11.24 在上面将topic_word_weight_dir直接decode成Unicode
            # 使用Unicode路径listdir得到就直接为Unicode
            topic_word_weight_dic[file_name[:-4].decode("utf-8")] = word_weight_dic
    return topic_word_weight_dic


# user在广告topic上的preference
def construct_topic_feature_dic(words, topic_word_weight_dic):
    user_prefer_dic = dict()
    for (topic_name, word_weight_dic) in topic_word_weight_dic.items():
        user_prefer_dic[topic_name] = 0
        for word in words:
            if word in word_weight_dic:
                user_prefer_dic[topic_name] = user_prefer_dic[topic_name] + word_weight_dic[word]
    return user_prefer_dic


# 判断广告类别
def judge_ads_topic(words, topic_word_weight_dic):
    ads_feature_dic = construct_topic_feature_dic(words, topic_word_weight_dic)
    max_topic = None
    max_value = 0
    for (topic, value) in ads_feature_dic.items():
        if value > max_value:
            max_value = value
            max_topic = topic
    return max_topic


def adsPreferred(user_topic_dic, weibo_all, topic_word_weight_dic, k=30):
    '''
    :param user_topic: 用户的topic偏好
    :param weibo: weibo/ad_weibo列表
    :param topic_word_weight_dic: 不同类别下word的TFIDF权重值
    :return: 返回用户喜欢的k个广告微博
    '''
    adsPreferList = []
    weiboMap = dict()
    ads_midsPrefered = dict()
    # 微博用户的个人信息
    uids = set()
    user_info_dict = dict()
    for weibo in weibo_all:
        weiboSource = weibo["_source"]
        uids.add(weiboSource["uid"])
        #  加上retweet和recomment的字段，适配非线上环境
        if RUN_TYPE == 1:
            for keytobeadded in ['retweeted','comment']:
                if keytobeadded not in weiboSource.keys():
                    weiboSource[keytobeadded] = 0
        weiboMap[weibo["_source"]["mid"]] = weiboSource

    # 获取待选微博的用户信息
    weibo_user_profiles = search_user_profile_by_user_ids(uids)

    clf = adsClassify()
    ads_midWordsMap = clf.adsPredict(weibo_all)
    for (mid, words) in ads_midWordsMap.items():
        ads_topic = judge_ads_topic(words, topic_word_weight_dic)
        ads_midsPrefered[mid] = user_topic_dic[ads_topic]

    ads_midsPrefered = sorted(ads_midsPrefered.items(), key=lambda ads: ads[1], reverse=True)

    k = min(k, len(ads_midsPrefered))

    for midInfo in ads_midsPrefered[:k]:
        mid = midInfo[0]
        uid = weiboMap[mid]["uid"]
        weiboMap[mid]["weibo_url"] = weiboinfo2url(uid, mid)
        # 可能出现许多userprofile查不到的情况
        if uid in weibo_user_profiles:
            weiboMap[mid]["photo_url"] = weibo_user_profiles[uid]["photo_url"]
            weiboMap[mid]["nick_name"] = weibo_user_profiles[uid]["nick_name"]
        else:
            weiboMap[mid]["photo_url"] = "None"
            weiboMap[mid]["nick_name"] = "None"
        adsPreferList.append(weiboMap[midInfo[0]])
        # 输出相关度值和微博，测试用
        # print midInfo[1], weiboMap[mid]["text"]

    return adsPreferList


'''
下面是用户推荐的部分
'''


def personRec(uid, k=200):
    direct_attention_id_set = search_attention_id(uid, 1)
    user_used_set = direct_attention_id_set.copy()
    # 候选推荐
    candidate_attention_id_set = set()
    search_queue = Queue.Queue()
    for user_id in direct_attention_id_set:
        search_queue.put(user_id)

    while search_queue.not_empty and len(candidate_attention_id_set) < k:
        temp_uid = search_queue.get(block=False)
        user_attention = search_attention_id(temp_uid)
        for user_id in user_attention:
            if user_id not in candidate_attention_id_set and \
               user_id not in direct_attention_id_set:
                candidate_attention_id_set.add(user_id)
                search_queue.put(user_id)

    candidate_attention_id_set = candidate_attention_id_set - direct_attention_id_set
    candidate_attention_user_profile = search_user_profile_by_user_ids(candidate_attention_id_set)
    # dict: {topic: user_id_set}
    user_recommend_dic = sim_user(uid, candidate_attention_id_set)
    user_recommend_return_list = []
    for topic_prefered, user_ids in user_recommend_dic.items():
        user_ids = user_ids & set(candidate_attention_user_profile.keys())
        for user_id in user_ids:
            temp_user_profile = candidate_attention_user_profile[user_id]
            temp_user_profile["topic"] = topic_en2ch_dict[topic_prefered]
            user_recommend_return_list.append(temp_user_profile)

    return user_recommend_return_list

def sim_user(uid, candidate_attention_id_set):
    user_portrait = es_user_portrait. \
        get_source(index=portrait_index_name, doc_type=profile_index_type, id=uid)

    candidate_attention_user_portraits = search_user_portrait_by_user_ids(candidate_attention_id_set)

    # user_topic = sorted(json.loads(user_portrait["topic"]).items(), key=lambda x: x[1])
    user_prefer_topic_list = map(lambda x: x[0],
                                 sorted(json.loads(user_portrait["topic"]).items(),
                                        key=lambda x: x[1],
                                        reverse=True)[:4])
    user_prefer_dict = dict()
    for temp_topic in user_prefer_topic_list:
        user_prefer_dict[temp_topic] = set()
    # map(lambda x: user_prefer_dict.setdefault(set()), user_prefer_topic_list)

    for temp_uid, temp_portrait in candidate_attention_user_portraits.items():
        temp_topics = sorted(json.loads(temp_portrait["topic"]).items(), key=lambda x: x[1], reverse=True)
        for temp_topic in temp_topics:
            if temp_topic[0] in user_prefer_dict:
                user_prefer_dict[temp_topic[0]].add(temp_uid)
                break

    return user_prefer_dict



def search_attention_id(uid, k=30):
    now_ts = time.time()
    db_number = get_db_num(now_ts)
    index_name = retweet_index_name_pre + str(db_number)
    try:
        retweet_result = es_retweet.get(index=index_name, doc_type=retweet_index_type, id=uid)['_source']
    except:
        return set()
    if retweet_result:
        retweet_dict = json.loads(retweet_result['uid_retweet'])
        return set(retweet_dict.keys())


def get_db_num(timestamp):
    date = ts2datetime(timestamp)
    date_ts = datetime2ts(date)
    r_beigin_ts = datetime2ts(R_BEGIN_TIME)
    db_number = ((date_ts - r_beigin_ts) / (DAY * 7)) % 2 + 1
    # run_type
    if RUN_TYPE == 0:
        db_number = 1
    return db_number


def search_user_portrait_by_user_ids(users):
    users = list(users)
    user_portrait_return = dict()
    try:
        candidate_attention_user_portraits = es_retweet.mget(index=portrait_index_name,
                                                             doc_type=portrait_index_type,
                                                             body={'ids': list(users)})['docs']
    except:
        candidate_attention_user_portraits = []

    for out_user_item in candidate_attention_user_portraits:
        if out_user_item['found']:
            uid = out_user_item['_id']
            user_portrait_return[uid] = out_user_item['_source']
    return user_portrait_return


def search_user_profile_by_user_ids(users):
    users = list(users)
    user_profile_return = dict()
    try:
        user_result = es_user_profile.mget(index=profile_index_name,
                                           doc_type=profile_index_type,
                                           body={'ids': users})['docs']
    except:
        user_result = []

    for out_user_item in user_result:
        if out_user_item['found']:
            uid = out_user_item['_id']
            user_profile_return[uid] = out_user_item['_source']
    return user_profile_return


if __name__ == '__main__':
    uid = 1640601392
    result = adsRec(uid)
    for rr in result:
        print(rr)
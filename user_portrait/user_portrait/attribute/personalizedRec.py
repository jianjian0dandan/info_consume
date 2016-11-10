# -*- coding:utf-8 -*-
'''
用户个性化推荐的后台相关计算模块
'''
__author__ = 'zxy'
import time

from user_portrait.time_utils import ts2datetime, datetime2ts, ts2date
from user_portrait.parameter import RUN_TYPE, RUN_TEST_TIME
from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, flow_text_index_type, \
    es_user_profile, profile_index_name, profile_index_type, \
    es_user_portrait, portrait_index_name, portrait_index_type, \
    es_ads_weibo, ads_weibo_index_name, ads_weibo_index_type

from user_portrait.parameter import DAY, MAX_VALUE, HOUR

from ads_classify import adsClassify
from user_portrait.attribute.influence_appendix import weiboinfo2url


def adsRec(uid, queryInterval = HOUR*4):
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

    keywords_items = set(user_portrait_result["keywords_string"].split("&"))
    # keywords_items = sorted(json.loads(user_portrait_result["keywords"]),
    #                         key=lambda kw: kw[1],
    #                         reverse=True)
    # topic_items = sorted(json.loads(user_portrait_result["topic"]).items(),
    #                      key=lambda kw: kw[1],
    #                      reverse=True)

    # test
    ads_weibo_index_name = flow_text_index_name_pre + "2013-09-07"
    ads_weibo_all = es_flow_text.search(index=ads_weibo_index_name,
                                       doc_type=ads_weibo_index_type,
                                       body={'query': {"filtered": {"filter": {"range": {"timestamp": {"gte": datetime2ts(now_date) - queryInterval}}}}},
                                             'size': 2000,
                                       }
    )['hits']['hits']
    ads_weibo_prefer = adsPreferred(keywords_items, ads_weibo_all, 30)
    return ads_weibo_prefer

def adsPreferred(user_key_words, weibo_all, k):
    '''
    :param user_topic: 用户的topic偏好
    :param weibo: weibo/ad_weibo列表
    :return: 返回用户喜欢的k
    '''
    adsPreferList = []
    weiboMap = dict()
    ads_midsPrefered = dict()
    for weibo in weibo_all:
        weiboMap[weibo["_source"]["mid"]] = weibo["_source"]

    clf = adsClassify()
    ads_midWordsMap = clf.adsPredict(weibo_all)
    for (mid, words) in ads_midWordsMap.items():
        ads_midsPrefered[mid] = len(words & user_key_words)

    ads_midsPrefered = sorted(ads_midsPrefered.items(),key=lambda ads:ads[1], reverse = True)

    k = min(30,len(ads_midsPrefered))

    for midInfo in ads_midsPrefered[:k]:
        mid = midInfo[0]
        uid = weiboMap[mid]["uid"]
        weiboMap[mid]["weibo_url"] = weiboinfo2url(uid, mid)
        adsPreferList.append(weiboMap[midInfo[0]])

    return adsPreferList





if __name__ == '__main__':
    uid = 1640601392
    result = adsRec(uid)
    for rr in result:
        print(rr)
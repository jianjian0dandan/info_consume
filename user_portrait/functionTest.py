# -*- coding:utf-8 -*-
'''
函数测试
'''
__author__ = 'zxy'

from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, flow_text_index_type, \
    es_user_profile, profile_index_name, profile_index_type, \
    es_user_portrait, portrait_index_name, portrait_index_type
from user_portrait.attribute.influence_appendix import weiboinfo2url
from user_portrait.attribute.personalizedRec import adsRec
from user_portrait.attribute.ads_classify import adsClassify

import json
import pprint

uid = 1640601392

def esUserProfileTest():
    user_profile_result = es_user_profile.\
        get_source(index=profile_index_name, doc_type=profile_index_type,id=uid)

    print user_profile_result

def esUserPortraitTest():
    user_portrait_result = es_user_portrait.\
        get_source(index=portrait_index_name, doc_type=profile_index_type,id=uid)

    keywords_items = sorted(json.loads(user_portrait_result["keywords"]),
                            key = lambda kw: kw[1],
                            reverse = True)
    topic_items = sorted(json.loads(user_portrait_result["topic"]).items(),
                         key=lambda kw: kw[1],
                         reverse = True)

    for (k,v) in keywords_items:
        print k,v

    print "----------------------------"

    for (k,v) in topic_items:
        print k,v

def adsTest():
    result = adsRec(uid)
    for weibo in result:
        print weibo["text"]



if __name__ == '__main__':
    #esUserPortraitTest()
    adsTest()

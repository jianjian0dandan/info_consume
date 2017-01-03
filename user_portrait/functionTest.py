# -*- coding:utf-8 -*-
'''
函数测试
'''
__author__ = 'zxy'

from user_portrait.attribute.personalizedRec import adsRec, personRec, get_user_geo, localRec
from user_portrait.global_utils import es_user_profile, profile_index_name, profile_index_type, \
    es_user_portrait, portrait_index_name

import json
import os
import codecs

uid = 1268043470

def esUserProfileTest():
    user_profile_result = es_user_profile. \
        get_source(index=profile_index_name, doc_type=profile_index_type, id=uid)

    print user_profile_result


def esUserPortraitTest():
    user_portrait_result = es_user_portrait. \
        get_source(index=portrait_index_name, doc_type=profile_index_type, id=uid)

    keywords_items = sorted(json.loads(user_portrait_result["keywords"]),
                            key=lambda kw: kw[1],
                            reverse=True)
    topic_items = sorted(json.loads(user_portrait_result["topic"]).items(),
                         key=lambda kw: kw[1],
                         reverse=True)

    for (k, v) in keywords_items:
        print k, v

    print "----------------------------"

    for (k, v) in topic_items:
        print k, v


def adsTest():
    result = adsRec(uid)
    for weibo in result:
        print weibo["text"]


def construct_topic_word_weight_dic(topic_word_weight_dir):
    topic_word_weight_dic = dict()
    for file_name in os.listdir(topic_word_weight_dir):
        weight_file = os.path.join(topic_word_weight_dir, file_name)
        if not os.path.isfile(weight_file):
            continue
        with codecs.open(weight_file, encoding="utf-8") as f:
            word_weight_dic = dict()
            for line in f.readlines():
                items = line.split(" ")
                word_weight_dic[items[0]] = float(items[1])
            topic_word_weight_dic[file_name[:-4].decode("gbk")] = word_weight_dic
    return topic_word_weight_dic


def personRec_test():
    recPerson = personRec(uid, k=400)
    for (topic, users) in recPerson.items():
        print topic
        print "**" * 30
        for user in users:
            print user["description"]
            # for (k, v) in user.items():
            #     print k, v
            # print "*"*30


if __name__ == '__main__':
    # esUserPortraitTest()
    # construct_topic_word_weight_dic(ADS_TOPIC_TFIDF_DIR)
    # adsTest()
    for weibo in localRec(uid):
        print weibo["text"], weibo["ip"]

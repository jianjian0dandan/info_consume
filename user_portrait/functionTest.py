# -*- coding:utf-8 -*-
'''
函数测试
'''
__author__ = 'zxy'

from user_portrait.global_utils import es_flow_text, flow_text_index_name_pre, flow_text_index_type, \
    es_user_profile, profile_index_name, profile_index_type
from user_portrait.attribute.influence_appendix import weiboinfo2url


def esTest():
    uid = 1640601392
    user_profile_result = es_user_profile.get_source(index=profile_index_name, doc_type=profile_index_type, \
                                                  id=uid)


    print user_profile_result

if __name__ == '__main__':
    esTest()
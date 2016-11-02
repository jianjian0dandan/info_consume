#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from utils import compare_user_portrait, compare_user_activity, compare_user_profile
from utils import compare_user_portrait_new, compare_user_portrait_v3
from user_portrait.time_utils import datetime2ts
from user_portrait.global_utils import es_user_portrait
from user_portrait.global_utils import R_ADMIN
from imagine import imagine


mod = Blueprint('manage', __name__, url_prefix='/manage')

# compare the attr in the es_user_portrait
@mod.route('/compare_user_portrait/')
def ajax_compare_user_portrait():
    results = {}
    uid_string = request.args.get('uid_list', '') # uid_list = [uid1, uid2, uid3]
    uid_list = uid_string.split(',')
    if uid_list:
        results = compare_user_portrait_new(uid_list)
    if results:
        return json.dumps(results)
    else:
        return None


# compare the detail of activity attribute
# output data: {user:[weibo_count]}, {user:[(date, weibo)]}, ts_list
@mod.route('/compare_user_activity/')
def ajax_compare_user_activity():
    results = {}
    uid_string = request.args.get('uid_list', '') # uid_list = [uid1, uid2, uid3]
    uid_list = uid_string.split(',')
    if uid_list:
        results = compare_user_activity(uid_list)
    if results:
        return json.dumps(results)
    else:
        return None


# compare the detail of user profile
# output data: {user:{profile_information}}
@mod.route('/compare_user_profile/')
def ajax_user_profile():
    results = {}
    uid_string = request.args.get('uid_list', '')
    uid_list = uid_string.split(',')
    if uid_list:
        results = compare_user_profile(uid_list)
    if results:
        return json.dumps(results)
    else:
        return None

@mod.route('/all_user_portrait/')
def ajax_all_user_portrait():
    results = {}
    uid_string = request.args.get('uid_list', '')
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    uid_list = uid_string.split(',')
    if uid_list:
        results['user_portrait'] = compare_user_portrait_v3(uid_list, submit_user)
    if results:
        return json.dumps(results)
    else:
        return None



@mod.route('/imagine/')
def ajax_imagine():
    uid = request.args.get('uid', '') # uid
    query_keywords = request.args.get('keywords','') # 查询字段
    submit_user = request.args.get('submit_user', '')
    query_weight = request.args.get('weight','') # 权重
    size = request.args.get('size', 100)
    keywords_list = query_keywords.split(',')
    weight_list = query_weight.split(',')

    if len(keywords_list) != len(weight_list):
        return json.dumps([])

    query_fields_dict = {}
    for i in range(len(keywords_list)):
        query_fields_dict[keywords_list[i]] = int(weight_list[i])

    # 如果查询为空，获取上一次请求数据，再为空，默认领域搜索
    if not query_fields_dict:
        user_imagine_dict = {}
        imagine_setting = R_ADMIN.hget(submit_user, "imagine_setting")
        if not imagine_setting:
            user_info = es_user_portrait.get(index="user_portrait_1222", doc_type="user", id=uid, _source=False, fields=["domain"])['_source']
            user_domain = user_info['fields']['domain'][0]
            query_fields_dict[user_domain] = 1
        else:
            query_fields_dict = json.loads(imagine_setting)
    else:
        R_ADMIN.hset(submit_user, "imagine_setting", json.dumps(query_fields_dict))
        


    query_fields_dict['size'] = int(size)

    result = []
    if uid and query_fields_dict:
        result = imagine(submit_user, uid, query_fields_dict)
    if result:
        return json.dumps(result)

    return json.dumps([])

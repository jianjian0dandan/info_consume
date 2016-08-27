# -*- coding: UTF-8 -*-
'''
recommentation
save uid list should be in
'''
import IP
import sys
import csv
import time
import datetime
import math
import json
import redis
import math
from elasticsearch import Elasticsearch
from update_activeness_record import update_record_index
from user_portrait.global_utils import R_RECOMMENTATION as r
from user_portrait.global_utils import R_RECOMMENTATION_OUT as r_out
from user_portrait.global_utils import R_CLUSTER_FLOW3 as r_cluster
from user_portrait.global_utils import R_CLUSTER_FLOW2 as r_cluster2
from user_portrait.global_utils import es_user_portrait as es
from user_portrait.global_utils import es_user_portrait
from user_portrait.global_utils import es_user_profile, portrait_index_name, portrait_index_type, profile_index_name, profile_index_type
from user_portrait.global_utils import ES_CLUSTER_FLOW1 as es_cluster
from user_portrait.global_utils import es_bci_history, bci_history_index_name, bci_history_index_type, ES_SENSITIVE_INDEX, DOCTYPE_SENSITIVE_INDEX
from user_portrait.filter_uid import all_delete_uid
from user_portrait.time_utils import ts2datetime, datetime2ts
from user_portrait.global_utils import portrait_index_name, portrait_index_type, profile_index_name, profile_index_type
from user_portrait.parameter import DAY, WEEK, RUN_TYPE, RUN_TEST_TIME,MAX_VALUE,sensitive_score_dict

WEEK = 7

#get user detail
#output: uid, uname, location, fansnum, statusnum, influence
def get_user_detail(date, input_result, status, user_type="influence", auth=""):
    bci_date = ts2datetime(datetime2ts(date) - DAY)
    results = []
    if status=='show_in':
        uid_list = input_result
    if status=='show_compute':
        uid_list = input_result.keys()
    if status=='show_in_history':
        uid_list = input_result.keys()
    if date!='all':
        index_name = 'bci_' + ''.join(bci_date.split('-'))
    else:
        now_ts = time.time()
        now_date = ts2datetime(now_ts)
        index_name = 'bci_' + ''.join(now_date.split('-'))
    tmp_ts = str(datetime2ts(date) - DAY)
    sensitive_string = "sensitive_score_" + tmp_ts
    query_sensitive_body = {
        "query":{
            "match_all":{}
        },
        "size":1,
        "sort":{sensitive_string:{"order":"desc"}}
    }
    try:
        top_sensitive_result = es_bci_history.search(index=ES_SENSITIVE_INDEX, doc_type=DOCTYPE_SENSITIVE_INDEX, body=query_sensitive_body, _source=False, fields=[sensitive_string])['hits']['hits']
        top_sensitive = top_sensitive_result[0]['fields'][sensitive_string][0]
    except Exception, reason:
        print Exception, reason
        top_sensitive = 400
    index_type = 'bci'
    user_bci_result = es_cluster.mget(index=index_name, doc_type=index_type, body={'ids':uid_list}, _source=True)['docs']
    user_profile_result = es_user_profile.mget(index='weibo_user', doc_type='user', body={'ids':uid_list}, _source=True)['docs']
    bci_history_result = es_bci_history.mget(index=bci_history_index_name, doc_type=bci_history_index_type, body={"ids":uid_list}, fields=['user_fansnum', 'weibo_month_sum'])['docs']
    sensitive_history_result = es_bci_history.mget(index=ES_SENSITIVE_INDEX, doc_type=DOCTYPE_SENSITIVE_INDEX, body={'ids':uid_list}, fields=[sensitive_string], _source=False)['docs']
    max_evaluate_influ = get_evaluate_max(index_name)
    for i in range(0, len(uid_list)):
        uid = uid_list[i]
        bci_dict = user_bci_result[i]
        profile_dict = user_profile_result[i]
        bci_history_dict = bci_history_result[i]
        sensitive_history_dict = sensitive_history_result[i]
        #print sensitive_history_dict
        try:
            bci_source = bci_dict['_source']
        except:
            bci_source = None
        if bci_source:
            influence = bci_source['user_index']
            influence = math.log(influence/float(max_evaluate_influ['user_index']) * 9 + 1 ,10)
            influence = influence * 100
        else:
            influence = ''
        try:
            profile_source = profile_dict['_source']
        except:
            profile_source = None
        if profile_source:
            uname = profile_source['nick_name'] 
            location = profile_source['user_location']
            try:
                fansnum = bci_history_dict['fields']['user_fansnum'][0]
            except:
                fansnum = 0
            try:
                statusnum = bci_history_dict['fields']['weibo_month_sum'][0]
            except:
                statusnum = 0
        else:
            uname = uid
            location = ''
            try:
                fansnum = bci_history_dict['fields']['user_fansnum'][0]
            except:
                fansnum = 0
            try:
                statusnum = bci_history_dict['fields']['weibo_month_sum'][0]
            except:
                statusnum = 0
        if status == 'show_in':
            if user_type == "sensitive":
                tmp_ts = datetime2ts(date) - DAY
                tmp_data = r_cluster.hget("sensitive_"+str(tmp_ts), uid)
                if tmp_data:
                    sensitive_dict = json.loads(tmp_data)
                    sensitive_words = sensitive_dict.keys()
                else:
                    sensitive_words = []
                if sensitive_history_dict.get('fields',0):
                    #print sensitive_history_dict['fields'][sensitive_string][0]
                    #print top_sensitive
                    sensitive_value = math.log(sensitive_history_dict['fields'][sensitive_string][0]/float(top_sensitive)*9+1, 10)*100
                    #print "sensitive_value", sensitive_value
                else:
                    sensitive_value = 0
                results.append([uid, uname, location, fansnum, statusnum, influence, sensitive_words, sensitive_value])
            else:
                results.append([uid, uname, location, fansnum, statusnum, influence])
            if auth:
                hashname_submit = "submit_recomment_" + date
                tmp_data = json.loads(r.hget(hashname_submit, uid))
                recommend_list = (tmp_data['operation']).split('&')
                admin_list = []
                admin_list.append(tmp_data['system'])
                admin_list.append(list(set(recommend_list)))
                admin_list.append(len(recommend_list))
                results[-1].extend(admin_list)
        if status == 'show_compute':
            in_date = json.loads(input_result[uid])[0]
            compute_status = json.loads(input_result[uid])[1]
            if compute_status == '1':
                compute_status = '3'
            results.append([uid, uname, location, fansnum, statusnum, influence, in_date, compute_status])
        if status == 'show_in_history':
            in_status = input_result[uid]
            if user_type == "sensitive":
                tmp_ts = datetime2ts(date) - DAY
                tmp_data = r_cluster.hget("sensitive_"+str(tmp_ts), uid)
                if tmp_data:
                    sensitive_dict = json.loads(tmp_data)
                    sensitive_words = sensitive_dict.keys()
                if sensitive_history_dict.get('fields', 0):
                    sensitive_value = math.log(sensitive_history_dict['fields'][sensitive_string][0]/float(top_sensitive)*9+1, 10)*100
                else:
                    sensitive_value = 0
                results.append([uid, uname, location, fansnum, statusnum, influence, in_status, sensitive_words, sensitive_value])
            else:
                results.append([uid, uname, location, fansnum, statusnum, influence, in_status])

    return results


# show recommentation in uid
def recommentation_in(input_ts, recomment_type, submit_user):
    date = ts2datetime(input_ts)
    recomment_results = []
    # read from redis
    results = []
    hash_name = 'recomment_'+str(date) + "_" + recomment_type
    identify_in_hashname = "identify_in_" + str(date)
    submit_user_recomment = "recomment_" + submit_user + "_" + str(date) # 用户自推荐名单
    results = r.hgetall(hash_name)
    if not results:
        return []
    # search from user_profile to rich the show information
    recommend_list = set(r.hkeys(hash_name))
    identify_in_list = set(r.hkeys("compute"))
    submit_user_recomment = set(r.hkeys(submit_user_recomment))
    recomment_results = list(recommend_list - identify_in_list)
    recomment_results = list(set(recomment_results) - submit_user_recomment)

    if recomment_results:
        results = get_user_detail(date, recomment_results, 'show_in', recomment_type)
    else:
        results = []
    #test
    '''
    f = open('/home/user_portrait_0320/revised_user_portrait/user_portrait/user_portrait/recommentation/influence_recommend.csv', 'wb')
    writer = csv.writer(f)
    for item_result in results:
        writer.writerow(item_result)
    f.close()
    '''
    return results

# get auto recommentation result
def recommentation_in_auto(search_date, submit_user):
    results = []
    #run type
    if RUN_TYPE == 1:
        now_date = search_date
    else:
        now_date = ts2datetime(datetime2ts(RUN_TEST_TIME) - DAY)
    recomment_hash_name = 'recomment_' + now_date + '_auto'
    recomment_influence_hash_name = 'recomment_' + now_date + '_influence'
    recomment_sensitive_hash_name = 'recomment_' + now_date + '_sensitive'
    recomment_submit_hash_name = 'recomment_' + submit_user + '_' + now_date
    recomment_compute_hash_name = 'compute'
    #step1: get auto
    auto_result = r.hget(recomment_hash_name, 'auto')
    if auto_result:
        auto_user_list = json.loads(auto_result)
    else:
        auto_user_list = []
    #step2: get admin user result
    admin_result = r.hget(recomment_hash_name, submit_user)
    if admin_result:
        admin_user_list = json.loads(admin_result)
    else:
        admin_user_list = []
    #step3: get union user and filter compute/influence/sensitive
    union_user_auto_set = set(auto_user_list) | set(admin_user_list)
    influence_user = set(r.hkeys(recomment_influence_hash_name))
    sensitive_user = set(r.hkeys(recomment_sensitive_hash_name))
    compute_user = set(r.hkeys(recomment_compute_hash_name))
    been_submit_user = set(r.hkeys(recomment_submit_hash_name))
    filter_union_user = union_user_auto_set - (influence_user | sensitive_user | compute_user | been_submit_user)
    auto_user_list = list(filter_union_user)
    #step4: get user detail
    if auto_user_list == []:
        return auto_user_list
    results = get_user_detail(now_date, auto_user_list, 'show_in', 'auto')
    return results



# show recommentation in uid to admin
# 从submit_recomment中获取status为0的用户
def admin_recommentation_in(input_ts):
    date = ts2datetime(input_ts)
    recomment_results = []
    identify_in_hashname = "identify_in_" + str(date)
    # read from redis
    results = []
    hashname_submit = "submit_recomment_" + date
    results = r.hgetall(hashname_submit)
    if not results:
        return []
    # search from user_profile to rich the show information
    submit_set = set(r.hkeys(hashname_submit))
    idntify_in_set = set(r.hkeys("compute")) # 已入库用户名单
    recomment_results = list(submit_set - idntify_in_set) #过滤一下
    if recomment_results:
        results = get_user_detail(date, recomment_results, 'show_in', "sensitive", "admin")
        sorted_results = sorted(results, key=lambda x:x[-1], reverse=True)
        results = sorted_results
    else:
        results = []
    return results

# identify uid to in user_portrait
def new_identify_in(data, date, submit_user):
    in_status = 1
    compute_status = 0
    hashname_submit = "submit_recomment_" + date
    hashname_influence = "recomment_" + date + "_influence"
    hashname_sensitive = "recomment_" + date + "_sensitive"
    submit_user_recomment = "recomment_" + submit_user + "_" + str(date) # 用户自推荐名单
    auto_recomment_set = set(r.hkeys(hashname_influence)) | set(r.hkeys(hashname_sensitive)) # 系统自动推荐名单
    for item in data:
        date = item[0] # identify the date form '2013-09-01' with web
        uid = item[1]
        #status = item[2]
        if uid in auto_recomment_set:
            tmp = json.loads(r.hget(hashname_submit, uid))
            recommentor_list = (tmp['operation']).split('&')
            recommentor_list.append(str(submit_user))
            new_list = list(set(recommentor_list))
            tmp['operation'] = "&".join(new_list)
        else:
            tmp = {"system":"0", "operation":submit_user}
        r.hset(hashname_submit, uid, json.dumps(tmp))
        r.hset(submit_user_recomment, uid, "0")
    return True

def submit_identify_in(input_data):
    data_type = input_data['type']
    result_mark = False
    if data_type=='uid':
        result_mark = submit_identify_in_uid(input_data)
    elif data_type=='uname':
        result_mark = submit_identify_in_uname(input_data)
    elif data_type=='url':
        result_mark = submit_identify_in_url(input_data)
    if len(result_mark) == 4:
        final_submit_user_list = result_mark[-1]
        if final_submit_user_list:
            final_submit_user_info = get_final_submit_user_info(final_submit_user_list)
        else:
            final_submit_user_info = []
        result_mark = list(result_mark)[:3]
        result_mark.append(final_submit_user_info)
    return result_mark

def get_final_submit_user_info(uid_list):
    final_results = []
    try:
        profile_results = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={'ids': uid_list})['docs']
    except:
        profile_results = []
    try:
        bci_history_results =es_bci_history.mget(index=bci_history_index_name, doc_type=bci_history_index_type, body={'ids': uid_list})['docs']
    except:
        bci_history_results = []
    #get bci_history max value
    now_time_ts = time.time()
    search_date_ts = datetime2ts(ts2datetime(now_time_ts - DAY))
    bci_key = 'bci_' + str(search_date_ts)
    query_body = {
        'query':{
             'match_all':{}
        },
        'sort': [{bci_key:{'order': 'desc'}}],
        'size': 1
    }
    #try:
    bci_max_result = es_bci_history.search(index=bci_history_index_name, doc_type=bci_history_index_type, body=query_body, _source=False, fields=[bci_key])['hits']['hits']
    #except:
    #    bci_max_result = {}
    if bci_max_result:
        bci_max_value = bci_max_result[0]['fields'][bci_key][0]
    else:
        bci_max_value = MAX_VALUE
    iter_count = 0
    for uid in uid_list:
        try:
            profile_item = profile_results[iter_count]
        except:
            profile_item = {}
        try:
            bci_history_item = bci_history_results[iter_count]
        except:
            bci_history_item = {}
        if profile_item and profile_item['found'] == True:
            uname = profile_item['_source']['nick_name']
            location = profile_item['_source']['user_location']
        else:
            uname = ''
            location = ''
        if bci_history_item and bci_history_item['found'] == True:
            fansnum = bci_history_item['_source']['user_fansnum']
            statusnum = bci_history_item['_source']['weibo_month_sum']
            try:
                bci = bci_history_item['_source'][bci_key]
                normal_bci = math.log(bci / bci_max_value * 9 + 1, 10) * 100
            except:
                normal_bci = ''
        else:
            fansnum = ''
            statusnum = ''
            normal_bci = ''
        final_results.append([uid, uname, location, fansnum, statusnum, normal_bci])
        iter_count += 1

    return final_results




# identify in by upload file to admin user
# input_data = {'date':'2013-09-01', 'upload_data':[], 'user':submit_user}
def submit_identify_in_uid(input_data):
    date = input_data['date']
    submit_user = input_data['user']
    operation_type = input_data['operation_type']
    hashname_submit = 'submit_recomment_' + date
    hashname_influence = 'recomment_' + date + '_influence'
    hashname_sensitive = 'recomment_' + date + '_sensitive'
    submit_user_recomment = 'recomment_' + submit_user + '_' + str(date)
    auto_recomment_set = set(r.hkeys(hashname_influence)) | set(r.hkeys(hashname_sensitive))
    upload_data = input_data['upload_data']
    line_list = upload_data.split('\n')
    uid_list = []
    invalid_uid_list = []
    for line in line_list:
        uid = line.split('\r')[0]
        #if len(uid)==10:
        #    uid_list.append(uid)
        if uid != '':
            uid_list.append(uid)
    if len(invalid_uid_list)!=0:
        return False, 'invalid user info', invalid_uid_list
    #identify the uid is not exist in user_portrait and compute
    #step1: filter in user_portrait
    new_uid_list = []
    have_in_uid_list = []
    try:
        exist_portrait_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type, body={'ids':uid_list}, _source=False)['docs']
    except:
        exist_portrait_result = []
    if exist_portrait_result:
        for exist_item in exist_portrait_result:
            if exist_item['found'] == False:
                new_uid_list.append(exist_item['_id'])
            else:
                have_in_uid_list.append(exist_item['_id'])
    else:
        new_uid_list = uid_list
   
    #step2: filter in compute
    new_uid_set = set(new_uid_list)
    compute_set = set(r.hkeys('compute'))
    in_uid_set = list(new_uid_set - compute_set)
    print 'new_uid_set:', new_uid_set 
    print 'in_uid_set:', in_uid_set
    if len(in_uid_set)==0:
        return False, 'all user in'
    #identify the final add user
    final_submit_user_list = []
    for in_item in in_uid_set:
        if in_item in auto_recomment_set:
            tmp = json.loads(r.hget(hashname_submit, in_item))
            recommentor_list = tmp['operation'].split('&')
            recommentor_list.append(str(submit_user))
            new_list = list(set(recommentor_list))
            tmp['operation'] = '&'.join(new_list)
        else:
            tmp = {'system':'0', 'operation':submit_user}
        if operation_type == 'submit':
            r.hset(hashname_submit, in_item, json.dumps(tmp))
            r.hset(submit_user_recomment, in_item, '0')
        final_submit_user_list.append(in_item)
    return True, invalid_uid_list, have_in_uid_list, final_submit_user_list

def submit_identify_in_url(input_data):
    date = input_data['date']
    submit_user = input_data['user']
    operation_type = input_data['operation_type']
    upload_data = input_data['upload_data']
    #step1: get uid list from input_data url
    url_list_pre = upload_data.split('\n')
    url_list = [item.split('\r')[0] for item in url_list_pre]
    uid_list = []
    invalid_uid_list = []
    have_in_uid_list = []
    for url_item in url_list:
        try:
            #url_item = 'http://weibo.com/p/1002065727942146/album?.....'
            url_list = url_item.split('/')
            uid = url_list[4][-10:]
            uid_list.append(uid)
        except:
            invalid_uid_list.append(url_item)
    if len(invalid_uid_list)!=0:
        return False, 'invalid user info', invalid_uid_list
    #step2: identify uid list is not exist in user_portrait and compute
    #step2.1: identify in user_portrait
    new_uid_list = []
    exist_portrait_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type, body={'ids':uid_list}, _source=True)['docs']
    new_uid_list = [exist_item['_id'] for exist_item in exist_portrait_result if exist_item['found']==False]
    have_in_uid_list = [exist_item['_id'] for exist_item in exist_portrait_result if exist_item['found']==True]
    #step2.2: identify in compute
    new_uid_set = set(new_uid_list)
    compute_set = set(r.hkeys('compute'))
    in_uid_list = list(new_uid_set - compute_set)
    if len(in_uid_list)==0:
        return False, 'all user in'
    #step3: save
    hashname_submit = 'submit_recomment_' + date
    hashname_influence = 'recomment_' + date + '_influence'
    hashname_sensitive = 'recomment_' + date + '_sensitive'
    submit_user_recomment = 'recomment_' + submit_user + '_' + str(date)
    auto_recomment_set = set(r.hkeys(hashname_influence)) | set(r.hkeys(hashname_sensitive))
    #identify the final submit user
    final_submit_user_list = []
    for in_item in in_uid_list:
        if in_item in auto_recomment_set:
            tmp = json.loads(r.hget(hashname_submit, in_item))
            recommentor_list = tmp['operation'].split('&')
            recommentor_list.append(str(submit_user))
            new_list = list(set(recommentor_list))
            tmp['operation'] = '&'.join(new_list)
        else:
            tmp = {'system': '0', 'operation': submit_user}
        if operation_type == 'submit':
            r.hset(hashname_submit, in_item, json.dumps(tmp))
            r.hset(submit_user_recomment, in_item, '0')
        final_submit_user_list.append(in_item)
    return True, invalid_uid_list, have_in_uid_list, final_submit_user_list

# get uid by uname
def submit_identify_in_uname(input_data):
    date = input_data['date']
    submit_user = input_data['user']
    operation_type = input_data['operation_type']
    upload_data = input_data['upload_data']
    # get uname list from upload data
    uname_list_pre = upload_data.split('\n')
    uname_list = [item.split('\r')[0] for item in uname_list_pre]
    uid_list = []
    have_in_user_list = []
    invalid_user_list = []
    valid_uname_list = []
    #step1: get uid list from uname
    profile_exist_result = es_user_profile.search(index=profile_index_name, doc_type=profile_index_type, body={'query':{'terms':{'nick_name': uname_list}}}, _source=False, fields=['nick_name'])['hits']['hits']
    for profile_item in profile_exist_result:
        uid = profile_item['_id']
        uid_list.append(uid)
        uname = profile_item['fields']['nick_name'][0]
        valid_uname_list.append(uname)
    invalid_user_list = list(set(uname_list) - set(valid_uname_list))
    if len(invalid_user_list) != 0:
        return False, 'invalid user info', invalid_user_list
    #step2: filter user not in user_portrait and compute
    #step2.1: identify in user_portrait
    new_uid_list = []
    exist_portrait_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type, body={'ids': uid_list})['docs']
    new_uid_list = [exist_item['_id'] for exist_item in exist_portrait_result if exist_item['found']==False]
    have_in_user_list = [exist_item['_id'] for exist_item in exist_portrait_result if exist_item['found']==True]
    if not new_uid_list:
        return False, 'all user in'
    #step2.2: identify in compute
    new_uid_set = set(new_uid_list)
    compute_set = set(r.hkeys('compute'))
    in_uid_list = list(new_uid_set - compute_set)
    if not in_uid_list:
        return False, 'all user in'
    #step3: save submit
    hashname_submit = 'submit_recomment_' + date
    hashname_influence = 'recomment_' + date + '_influence'
    hashname_sensitive = 'recomment_' + date + '_sensitive'
    submit_user_recomment = 'recomment_' + submit_user + '_' + str(date)
    auto_recomment_set = set(r.hkeys(hashname_influence)) | set(r.hkeys(hashname_sensitive))
    #identify final submit user list
    final_submit_user_list = []
    for in_item in in_uid_list:
        if in_item in auto_recomment_set:
            tmp = json.loads(r.hget(hashname_submit, in_item))
            recommentor_list = tmp['operation'].split('&')
            recommentor_list.append(str(submit_user))
            new_list = list(set(recommentor_list))
            tmp['operation'] = '&'.join(new_list)
        else:
            tmp = {'system':'0', 'operation': submit_user}
        if operation_type == 'submit':
            r.hset(hashname_submit, in_item, json.dumps(tmp))
            r.hset(submit_user_recomment, in_item, '0')
        final_submit_user_list.append(in_item)
    return True, invalid_user_list, have_in_user_list, final_submit_user_list


# identify uid to in user_portrait for admin
# recomment_date是存推荐入库用户的
def identify_in(data):
    in_status = 1
    compute_status = 0
    compute_hash_name = 'compute'
    for item in data:
        date = item[0] # identify the date form '2013-09-01' with web
        uid = item[1]
        status = item[2]
        value_string = []
        identify_in_hashname = "identify_in_" + str(date)
        r.hset(identify_in_hashname, uid, in_status)
        if status == '1':
            in_date = date
            compute_status = '1'
        elif status == '2':
            in_date = date
            compute_status = '2'
        r.hset(compute_hash_name, uid, json.dumps([in_date, compute_status]))
    return True

def admin_delete_submit_in(date, uid_list):
    status = True
    identify_in_hashname = 'identify_in_' + str(date)
    for uid in uid_list:
        r.hdel(identify_in_hashname, uid)
    return status


#show in history
def show_in_history(date, user_type):
    results = []
    #hash_name = 'recomment_'+str(date)
    identify_in_hashname = "identify_in_" + str(date)
    r_results = r.hgetall(identify_in_hashname)
    if r_results:
        results = get_user_detail(date, r_results, 'show_in_history', user_type)
    return results

# show uid who have in but not compute
def show_compute(date):
    results = []
    hash_name = 'compute'
    r_results = r.hgetall(hash_name)
    input_data = {}
    #search user profile to inrich information
    if r_results and date!='all':
        for user in r_results:
            item = r_results[user]
            in_date = json.loads(item)[0]
            if in_date == date:
                input_data[user] = item
        if input_data:
            results = get_user_detail(date, input_data, 'show_compute')
        else:
            results = []
        return results
    elif r_results and date=='all':
        results = get_user_detail(date, r_results, 'show_compute')
        return results
    else:
        return results

# identify uid to start compute
def identify_compute(data):
    results = False
    compute_status = 1
    hash_name = 'compute'
    uid2compute = r.hgetall(hash_name)
    for item in data:
        uid = item[1]
        result = r.hget(hash_name, uid)
        in_date = json.loads(result)[0]
        r.hset(hash_name, uid, json.dumps([in_date, compute_status]))

    return True

########################################
########################################
def get_top_influence(key):
    query_body = {
        "query":{
            "match_all": {}
        },
        "sort":{key:{"order":"desc"}},
        "size": 1
    }
    result = 2000

    search_result = es.search(index=portrait_index_name, doc_type=portrait_index_type, body=query_body)["hits"]["hits"]
    if search_result:
        result = search_result[0]['_source'][key]

    return result



def show_out_uid():
    fields = ["uid", "uname", "location", "statusnum", "fansnum", "domain", "topic_string", "importance", "influence", "activeness", "sensitive"]
    out_list = []
    recommend_dict = r_out.hgetall("recommend_delete_list")
    recommend_keys = recommend_dict.keys()
    for iter_key in recommend_keys:
        out_list.extend(json.loads(r_out.hget("recommend_delete_list",iter_key)))
    if not out_list:
        return out_list # no one is recommended to out

    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")
    top_importance = get_top_influence("importance")
    top_sensitive = get_top_influence("sensitive")
    out_list = list(set(out_list))
    return_list = []
    #bci_history_result = es_bci_history.mget(index=bci_history_index_name, doc_type=bci_history_index_type, body={"ids":out_list}, fields=['user_fansnum', 'weibo_month_sum'])['docs']
    detail = es.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":out_list}, _source=True)['docs']
    # extract the return dict with the field '_source'
    filter_uid = all_delete_uid()
    if out_list:
        for i in range(len(out_list)):
            if detail[i]['_id'] in filter_uid:
                continue
            detail_info = []
            for item in fields:
                if item == "topic_string":
                    detail_info.append(','.join(detail[i]['_source']['topic_string'].split("&")))
                elif item == "influence":
                    detail_info.append(math.log(detail[i]["_source"][item]/float(top_influence) * 9 + 1, 10)*100)
                elif item == "importance":
                    detail_info.append(math.log(detail[i]["_source"][item]/float(top_importance)*9 + 1, 10)*100)
                elif item == "activeness":
                    detail_info.append(math.log(detail[i]["_source"][item]/float(top_activeness)*9 + 1, 10)*100)
                elif item == "sensitive":
                    detail_info.append(math.log(detail[i]["_source"][item]/float(top_sensitive)*9 + 1, 10)*100)
                else:
                    detail_info.append(detail[i]['_source'][item])
            return_list.append(detail_info)

    return return_list

def decide_out_uid(date, data): # 日期：2016-02-26；data：uid，uid
    uid_list = []
    now_date = date
    if data:
        uid_list = data.split(",") # decide to delete uids
        exist_data = r_out.hget("decide_delete_list", now_date)
        if exist_data:
            uid_list.extend(json.loads(exist_data))
            uid_list = list(set(uid_list))
        r_out.hset("decide_delete_list", now_date, json.dumps(uid_list))


    #从推荐出库的recommend_list中去除已经决定出库的人
    filter_uid = all_delete_uid()
    uid_list = data.split(",")
    current_date_list = json.loads(r_out.hget("recommend_delete_list", date))
    new_list =  list(set(current_date_list).difference(set(uid_list)))
    new_list = list(set(new_list).difference(filter_uid))
    r_out.hset("recommend_delete_list", date, json.dumps(new_list))

    return 1


def search_history_delete(date):
    return_list = []
    now_date = date

    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")
    top_importance = get_top_influence("importance")
    fields = ['uid','uname','domain','topic_string','influence','importance','activeness']
    temp = r_out.hget("decide_delete_list", now_date)
    if temp:
        history_uid_list = json.loads(r_out.hget("decide_delete_list", now_date))
        if history_uid_list != []:
            detail = es.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":history_uid_list}, _source=True)['docs']
            for i in range(len(history_uid_list)):
                detail_info = []
                for item in fields:
                    if item == "topic_string":
                        detail_info.append(','.join(detail[i]['_source'][item].split("&")))
                    elif item == "influence":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_influence)*100))
                    elif item == "importance":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_importance)*100))
                    elif item == "activeness":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_activeness)*100))
                    else:
                        detail_info.append(detail[i]['_source'][item])
                return_list.append(detail_info)

    return json.dumps(return_list)



def show_all_out():
    delete_dict = r_out.hgetall('decide_delete_list')
    delete_keys_list = delete_dict.keys()
    recommend_out_list = []
    for iter_key in delete_keys_list:
        try:
            temp = json.loads(r_out.hget('decide_delete_list', iter_key))
        except:
            temp = []
        recommend_out_list.extend(temp)
    recommend_out_list = list(set(recommend_out_list))
    #print recommend_out_list

    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")
    top_importance = get_top_influence("importance")
    return_list = []
    fields = ['uid','uname','domain','topic_string','influence','importance','activeness']
    if recommend_out_list:
        detail = es.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":recommend_out_list}, _source=True)['docs']
        for i in range(len(detail)):
            detail_info = []
            if detail[i]['found']:
                for item in fields:
                    if item == "topic_string":
                        detail_info.append(','.join(detail[i]['_source'][item].split('&')))
                    elif item == "influence":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_influence)*100))
                    elif item == "importance":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_importance)*100))
                    elif item == "activeness":
                        detail_info.append(math.ceil(detail[i]["_source"][item]/float(top_activeness)*100))
                    else:
                        detail_info.append(detail[i]['_source'][item])
            else:
                detail_info = [detail[i]['_id'],[],[],[],[],[],[]]

            return_list.append(detail_info)

    return json.dumps(return_list)



# get user time trend (7 day)
def get_user_trend(uid):
    activity_result = dict()
    now_ts = time.time()
    date = ts2datetime(now_ts)
    #run_type
    if RUN_TYPE == 1:
        ts = datetime2ts(date)
    else:
        ts = datetime2ts(RUN_TEST_TIME)
    timestamp = ts
    results = dict()
    for i in range(1, 8):
        ts = timestamp - 24*3600*i
        try:
            result_string = r_cluster2.hget('activity_'+str(ts), str(uid))
        except:
            result_string = ''
        if not result_string:
            continue
        result_dict = json.loads(result_string)
        for time_segment in result_dict:
            try:
                results[int(time_segment)/16*15*60*16+ts] += result_dict[time_segment]
            except:
                results[int(time_segment)/16*15*60*16+ts] = result_dict[time_segment]
    
    trend_list = []
    for i in range(1, 8):
        ts = timestamp - i*24*3600
        for j in range(0, 6):
            time_seg = ts + j*15*60*16
            if time_seg in results:
                trend_list.append((time_seg, results[time_seg]))
            else:
                trend_list.append((time_seg, 0))
    sort_trend_list = sorted(trend_list, key=lambda x:x[0], reverse=True)
    x_axis = [item[0] for item in sort_trend_list]
    y_axis = [item[1] for item in sort_trend_list]
    return [x_axis, y_axis]

# get user hashtag
def get_user_hashtag(uid):
    user_hashtag_result = {}
    now_ts = time.time()
    now_date = ts2datetime(now_ts)
    #run_type
    if RUN_TYPE == 1:
        ts = datetime2ts(now_date)
    else:
        ts = datetime2ts(RUN_TEST_TIME)
    for i in range(1, 8):
        ts = ts - 3600*24
        results = r_cluster.hget('hashtag_'+str(ts), uid)
        if results:
            hashtag_dict = json.loads(results)
            for hashtag in hashtag_dict:
                try:
                    user_hashtag_result[hashtag] += hashtag_dict[hashtag]
                except:
                    user_hashtag_result[hashtag] = hashtag_dict[hashtag]
    sort_hashtag_dict = sorted(user_hashtag_result.items(), key=lambda x:x[1], reverse=True)

    return sort_hashtag_dict

# get user geo
def get_user_geo(uid):
    result = []
    user_geo_result = {}
    user_ip_dict = {}
    user_ip_result = dict()
    now_ts = time.time()
    now_date = ts2datetime(now_ts)
    #run_type
    if RUN_TYPE == 1:
        ts = datetime2ts(now_date)
    else:
        ts = datetime2ts(RUN_TEST_TIME)
    for i in range(1, 8):
        ts = ts - 3600*24
        results = r_cluster2.hget('new_ip_'+str(ts), uid)
        if results:
            ip_dict = json.loads(results)
            for ip in ip_dict:
                ip_count = len(ip_dict[ip].split('&'))
                try:
                    user_ip_result[ip] += ip_count
                except:
                    user_ip_result[ip] = ip_count
    user_geo_dict = ip2geo(user_ip_result)
    user_geo_result = sorted(user_geo_dict.items(), key=lambda x:x[1], reverse=True)

    return user_geo_result

def ip2geo(ip_dict):
    city_set = set()
    geo_dict = dict()
    for ip in ip_dict:
        try:
            city = IP.find(str(ip))
            if city:
                city.encode('utf-8')
            else:
                city = ''
        except Exception, e:
            city = ''
        if city:
            len_city = len(city.split('\t'))
            if len_city==4:
                city = '\t'.join(city.split('\t')[:2])
            try:
                geo_dict[city] += ip_dict[ip]
            except:
                geo_dict[city] = ip_dict[ip]
    return geo_dict


# show more information in recommentation
def recommentation_more_information(uid):
    result = {}
    result['time_trend'] = get_user_trend(uid)
    result['hashtag'] = get_user_hashtag(uid)
    result['activity_geo'] = get_user_geo(uid)
    return result


def get_evaluate_max(index_name):
    max_result = {}
    index_type = 'bci'
    evaluate_index = ['user_index']
    for evaluate in evaluate_index:
        query_body = {
            'query':{
                'match_all':{}
                },
            'size':1,
            'sort':[{evaluate: {'order': 'desc'}}]
            }
        try:
            result = es_cluster.search(index=index_name, doc_type=index_type, body=query_body)['hits']['hits']
        except Exception, e:
            raise e
        max_evaluate = result[0]['_source'][evaluate]
        max_result[evaluate] = max_evaluate
    return max_result

if __name__=='__main__':
    #test
    test_uid_list = ['2101413011','1995786393','2132734472','2776631980','2128524603',\
                     '1792702427','2703153040','2787852095','1599102507','1726544024']


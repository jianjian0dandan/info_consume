#-*- coding:utf-8 -*-
import os
import time
import json
from flask import Blueprint, url_for, render_template, request,\
                  abort, flash, session, redirect, send_from_directory
from utils import save_detect_single_task, save_detect_multi_task ,\
                  save_detect_attribute_task, save_detect_event_task, \
                  show_detect_task, detect2analysis, delete_task, \
                  show_detect_result, search_detect_task, submit_sensing

from user_portrait.global_utils import es_user_profile, profile_index_name, profile_index_type
from user_portrait.global_config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from user_portrait.parameter import DETECT_QUERY_ATTRIBUTE, DETECT_QUERY_STRUCTURE,\
                                    DETECT_QUERY_FILTER, DETECT_DEFAULT_WEIGHT, \
                                    DETECT_DEFAULT_MARK, DETECT_DEFAULT_COUNT, \
                                    DETECT_FILTER_VALUE_FROM, DETECT_FILTER_VALUE_TO, \
                                    DETECT_TEXT_FUZZ_ITEM, DETECT_TEXT_RANGE_ITEM
from user_portrait.parameter import DETECT_ATTRIBUTE_FUZZ_ITEM, DETECT_ATTRIBUTE_MULTI_ITEM, \
                                    DETECT_ATTRIBUTE_SELECT_ITEM ,\
                                    DETECT_PATTERN_FUZZ_ITEM, DETECT_PATTERN_SELECT_ITEM ,\
                                    DETECT_PATTERN_RANGE_ITEM, DETECT_EVENT_ATTRIBUTE,\
                                    DETECT_EVENT_TEXT_FUZZ_ITEM, DETECT_EVENT_TEXT_RANGE_ITEM
from user_portrait.parameter import DAY
from user_portrait.time_utils import ts2datetime, datetime2ts
from social_sensing_utils import show_social_sensing_task, show_important_users

mod = Blueprint('detect', __name__, url_prefix='/detect')

#use to deal seed_user info string
def deal_seed_user_string(seed_info_string, seed_info_type):
    if seed_info_type == 'uid':
        uid_list = []
        invalid_user_list = []
        uid_list_pre = seed_info_string.split(' ')
        for uid in uid_list_pre:
            if len(uid)==10:
                uid_list.append(uid)
            else:
                invalid_user_list.append(uid)
    elif seed_info_type == 'uname':
        uid_list = []
        valid_uname_list = []
        invalid_user_list = []
        uname_list = seed_info_string.split(' ')
        profile_exist_result = es_user_profile.search(index=profile_index_name, doc_type=profile_index_type,\
            body={'query':{'terms':{'nick_name': uname_list}}}, _source=False, fields=['nick_name'])['hits']['hits']
        if profile_exist_result:
            for profile_item in profile_exist_result:
                uid_list.append(profile_item['_id'])
                uname = profile_item['fields']['nick_name'][0]
                valid_uname_list.append(uname)
            invalid_user_list = list(set(uname_list) - set(valid_uname_list))
    elif seed_info_type == 'url':
        uid_list = []
        url_list = seed_info_string.split(' ')
        for url_item in url_list:
            url_item_list = url_item.split('/')
            url_uid = url_item_list[4][-10:]
            uid_list.append(url_uid)
    return uid_list, invalid_user_list

#use to deal seed_user info file
def deal_seed_user_file(upload_data, seed_info_type):
    if seed_info_type == 'uid':
        uid_list = []
        invalid_user_list = []
        line_list = upload_data.split('\n')
        print 'line_list:', line_list
        for line in line_list:
            uid = line.split('\r')[0]
            if len(uid)==10:
                uid_list.append(uid)
            elif uid != '':
                invalid_user_list.append(uid)
    elif seed_info_type == 'uname':
        uid_list = []
        valid_uname_list = []
        invalid_user_list = []
        line_list = upload_data.split('\n')
        uname_list = [line_item.split('\r')[0] for line_item in line_list]
        #get uid by es_user_portrait
        profile_exist_result = es_user_profile.search(index=profile_index_name, doc_type=profile_index_type,\
                body={'query':{'terms':{'nick_name': uname_list}}}, _source=False, fields=['nick_name'])['hits']['hits']
        if profile_exist_result:
            for profile_exist_item in profile_exist_result:
                uid = profile_exist_item['_id']
                uid_list.append(uid)
                uname = profile_exist_item['fields']['nick_name'][0]
                valid_uname_list.append(uname)
        invalid_user_list = list(set(uname_list) - set(valid_uname_list))
    elif seed_info_type == 'url':
        uid_list = []
        invalid_user_list = []
        line_list = upload_data.split('\n')
        uid_list = [line_item.split('/')[4][-10:] for line_item in line_list]
    return uid_list, invalid_user_list

# use to submit user string for group detection
@mod.route('/user_string/')
def ajax_user_string():
    status = False
    task_information_dict = {}
    query_dict = {}
    input_dict = {}
    #identify the seed user info and user_string(split by '/')
    seed_info_type = request.args.get('seed_user_type', 'uid') # seed_user_type=uid/uname/url
    seed_info_string = request.args.get('seed_user_string', '') # split by '/'
    seed_uid_list, invalid_user_list = deal_seed_user_string(seed_info_string, seed_info_type)
    #print 'seed_uid_list:', seed_uid_list
    if seed_uid_list==[]:
        return json.dumps('invalid seed user')
    if len(invalid_user_list):
        return json.dumps(['invalid user info', invalid_user_list])
    #task max count
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)
    #get task information
    task_information_dict['task_name'] = request.args.get('task_name', '')
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['submit_user'] = request.args.get('submit_user', 'admin')
    task_information_dict['state'] = request.args.get('state', '')
    task_information_dict['task_id'] = task_information_dict['submit_user'] + '-' + task_information_dict['task_name']
    #identify whether to extend
    extend_mark = request.args.get('extend_mark', '0') #extend_mark=0/1 means analysis/detect
    #print 'extend_mark:', extend_mark
    if extend_mark == '0':
        task_information_dict['task_type'] = 'analysis'
        task_information_dict['status'] = 0
        if len(seed_uid_list) > 1:
            task_information_dict['uid_list'] = seed_uid_list
        else:
            print 'no enough user to analysis'
            return json.dumps('no enough user to analysis')
        input_dict['task_information'] = task_information_dict
        #print 'no extend save'
        results = save_detect_multi_task(input_dict, extend_mark, task_max_count)
    elif extend_mark == '1':
        task_information_dict['task_type'] = 'detect'
        #print 'extend save'
        #get query dict: attribute
        attribute_list = []
        attribute_condition_num = 0
        for attribute_item in DETECT_QUERY_ATTRIBUTE:
            attribute_mark = request.args.get(attribute_item, DETECT_DEFAULT_MARK) # '0':not select '1':select
            if attribute_mark == '1':
                attribute_list.append(attribute_item)
                attribute_condition_num += 1
        attribute_condition_num = len(attribute_list)
        attribute_weight = request.args.get('attribute_weight', DETECT_DEFAULT_WEIGHT)
        attribute_weight = float(attribute_weight)
        if attribute_condition_num==0:
            attribute_weight = 0
        query_dict['attribute'] = attribute_list
        query_dict['attribute_weight'] = attribute_weight
        #get query dict: structure
        structure_condition_num = 0
        structure_list = {}
        for structure_item in DETECT_QUERY_STRUCTURE:
            structure_mark =request.args.get(structure_item, DETECT_DEFAULT_MARK)
            structure_list[structure_item] = structure_mark
            print 'structure_item, structure_mark:', structure_item, structure_mark
            if structure_mark != '0':
                structure_condition_num += 1
        structure_weight = request.args.get('structure_weight', DETECT_DEFAULT_WEIGHT)
        structure_weight = float(structure_weight)
        if structure_condition_num == 0:
            structure_weight = 0
        query_dict['structure'] = structure_list
        query_dict['structure_weight'] = structure_weight
        #get query dict: text
        text_query_list = []
        for text_item in DETECT_TEXT_FUZZ_ITEM:
            item_value_string = request.args.get(text_item, '') # a string joint by ' '
            item_value_list = item_value_string.split(' ')
            if len(item_value_list) > 0 and item_value_string != '':
                nest_body_list = []
                for item_value in item_value_list:
                    nest_body_list.append({'wildcard': {text_item: '*' + item_value + '*'}})
                text_query_list.append({'bool':{'should': nest_body_list}})
        for text_item in DETECT_TEXT_RANGE_ITEM:
            item_value_from = request.args.get(text_item+'_from', '')
            item_value_to = request.args.get(text_item+'_to', '')
            if item_value_from != '' and item_value_to != '':
                if int(item_value_from) > int(item_value_to):
                    return json.dumps('invalid input for range')
                else:
                    text_query_list.append({'range':{text_item:{'gte':int(item_value_from), 'lt':int(item_value_to)}}})
        query_dict['text'] = text_query_list
        #identify the query condition num at least one
        if attribute_condition_num + structure_condition_num == 0:
            return json.dumps('no query condition')
        #get query dict: filter
        filter_dict = {} # filter_dict = {'count':100, 'influence':{'from':0, 'to':50}, 'importance':{'from':0, 'to':50}}
        for filter_item in DETECT_QUERY_FILTER:
            if filter_item == 'count':
                filter_item_value = request.args.get(filter_item, DETECT_DEFAULT_COUNT)
                filter_item_value = int(filter_item_value)
            else:
                filter_item_from = request.args.get(filter_item+'_from', DETECT_FILTER_VALUE_FROM)
                filter_item_to = request.args.get(filter_item+'_to', DETECT_FILTER_VALUE_TO)
                if filter_item_from == '':
                    filter_item_from = 0
                if filter_item_to == '':
                    filter_item_to = 100
                if int(filter_item_from) > int(filter_item_to):
                    return json.dumps('invalid input for filter')
                filter_item_value = {'gte':int(filter_item_from), 'lt':int(filter_item_to)}
            filter_dict[filter_item] = filter_item_value
        if filter_dict['count'] == 0:
            return json.dumps('invalid input for count')
        query_dict['filter'] = filter_dict
        #identify the task type---single/multi
        if len(seed_uid_list) == 1:
            query_dict['seed_user'] = {'uid': seed_uid_list[0]}
            task_information_dict['detect_type'] = 'single'
            task_information_dict['detect_process'] = 0
            input_dict['task_information'] = task_information_dict
            input_dict['query_condition'] = query_dict
            results = save_detect_single_task(input_dict, task_max_count)
        else:
            task_information_dict['uid_list'] = seed_uid_list
            task_information_dict['detect_type'] = 'multi'
            task_information_dict['detect_process'] = 0
            input_dict['task_information'] = task_information_dict
            input_dict['query_condition'] = query_dict
            results = save_detect_multi_task(input_dict, extend_mark, task_max_count)

    return json.dumps(results)

# use to submit user file for group detection
@mod.route('/user_file/', methods=['GET', 'POST'])
def ajax_user_file():
    status = False
    query_dict = {} #query_dict={'attribute':[], 'attribute_weight':0.5, 'structure':[], 'structure_weight':0.5, 'text':{}, 'filter':{}}
    task_information_dict = {} #task_information_dict={'uid_list':[], 'task_name':xx, 'state':xx, 'submit_user':xx}
    input_dict = {}
    #get json
    input_data = request.get_json() #input_data={'upload_data':[],'seed_user_type':xx} upload_type=uid/uname/url
    #get uid_list by upload_data
    upload_data = input_data['upload_data']
    seed_info_type = input_data['seed_user_type']
    seed_uid_list, invalid_user_list = deal_seed_user_file(upload_data, seed_info_type)
    print 'seed_uid_list:', seed_uid_list
    if not seed_uid_list:
        return json.dumps('invalid seed user')
    if len(invalid_user_list):
        return json.dumps(['invalid user info',invalid_user_list])
    #identify the exist task count is not more than task exist count
    try:
        task_max_count = int(input_data['task_max_count'])
    except:
        task_max_count = 0
    #task_information
    task_information_dict['task_name'] = input_data['task_name']
    task_information_dict['state'] = input_data['state']
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['submit_user'] = input_data['submit_user']
    task_information_dict['uid_list'] = seed_uid_list
    task_information_dict['task_id'] = input_data['submit_user'] + '-' + input_data['task_name']
    #identify whether to extend
    extend_mark = input_data['extend']
    if extend_mark == '0':
        task_information_dict['task_type'] = 'analysis'
        task_information_dict['status'] = 0
        input_dict['task_information'] = task_information_dict
        #print 'no extend save'
        if len(seed_uid_list) <= 1:
            print 'no enough user to analysis'
            return json.dumps('no enough user to analysis')
        results = save_detect_multi_task(input_dict, extend_mark, task_max_count)
    else:
        #print 'extend save'
        task_information_dict['task_type'] = 'detect'
        task_information_dict['detect_type'] = 'multi'
        task_information_dict['detect_process'] = 0
        #get query dict: attribute
        attribute_list = []
        for attribute_item in DETECT_QUERY_ATTRIBUTE:
            attribute_mark = input_data[attribute_item]
            if attribute_mark == '1':
                attribute_list.append(attribute_item)
        attribute_condition_num = len(attribute_list)
        if attribute_condition_num != 0:
            attribute_weight = input_data['attribute_weight']
        else:
            attribute_weight = 0
        query_dict['attribute_weight'] = float(attribute_weight)
        query_dict['attribute'] = attribute_list
        #get query dict:structure
        structure_list = {}
        structure_condition_num = 0
        print 'input_data:', input_data
        for structure_item in DETECT_QUERY_STRUCTURE:
            structure_mark = input_data[structure_item]
            print 'structure_item, structure_mark:', structure_item, structure_mark, type(structure_mark)
            structure_list[structure_item] = structure_mark
            if structure_mark != '0':
                structure_condition_num += 1
        #structure_condition_num = len(structure_list)

        if structure_condition_num != 0:
            structure_weight = input_data['structure_weight']
        else:
            structure_weight = 0
        query_dict['structure_weight'] = float(structure_weight)
        query_dict['structure'] = structure_list
        #get query_dict:text
        text_query_list = []
        for text_item in DETECT_TEXT_FUZZ_ITEM:
            item_value_string = input_data[text_item] # a string joint by ' '
            item_value_list = item_value_string.split(' ')
            nest_body_list = []
            if len(item_value_list) > 0 and item_value_string != '':
                for item_value in item_value_list:
                    nest_body_list.append({'wildcard': {text_item: '*' + item_value + '*'}})
                text_query_list.append({'bool':{'should': nest_body_list}})
        for text_item in DETECT_TEXT_RANGE_ITEM:
            try:
                item_value_from = input_data[text_item + '_from']
            except:
                item_value_from = ''
            try:
                item_value_to = input_data[text_item + '_to']
            except:
                ite_value_to = ''
            if item_value_from != '' and item_value_to != '':
                if int(item_value_from) > int(item_value_to):
                    return json.dumps('invalid input for range')
                else:
                    text_query_list.append({'range': {text_item: {'gte':int(item_value_from), 'lt':int(item_value_to)}}})
        query_dict['text'] = text_query_list
        #identify the condition num at least 1
        print 'structure_condition_num:', structure_condition_num
        print 'attribute_condition_num:', attribute_condition_num
        if attribute_condition_num + structure_condition_num == 0:
            return json.dumps('no query condition')
        #get query dict: filter
        filter_dict = {} #filter_dict = {'count':100, 'influence':{'from':0, 'to':50}, 'importance':{'from':0, 'to':50}}
        filter_condition_num = 0
        for filter_item in DETECT_QUERY_FILTER:
            if filter_item == 'count':
                filter_item_value = input_data[filter_item]
                filter_item_value = int(filter_item_value)
                if filter_item_value != '0':
                    filter_condition_num += 1
            else:
                filter_item_from = input_data[filter_item+'_from']
                filter_item_to = input_data[filter_item + '_to']
                if filter_item_from == '':
                    filter_item_from = 0
                if filter_item_to == '':
                    filter_item_to = 0
                if int(filter_item_from) > int(filter_item_to):
                    return json.dumps('invalid input for filter')
                if filter_item_to != '0':
                    filter_condition_num += 1
                filter_item_value = {'gte': int(filter_item_from), 'lt':int(filter_item_to)}
            filter_dict[filter_item] = filter_item_value
        if filter_condition_num == 0:
            return json.dumps('invalid input for filter')
        query_dict['filter'] = filter_dict
        #save task information
        input_dict['task_information'] = task_information_dict
        input_dict['query_condition'] = query_dict
        results = save_detect_multi_task(input_dict, extend_mark, task_max_count) 

    return json.dumps(results)

# use to submit parameter single-person group detection
@mod.route('/single_person/')
def ajax_single_person():
    results = {}
    query_dict = {}   #query_dict = {'seed_user':{},'attribute':[],'attribute_weight': 0.5,'struture':[], 'structure_weight': 0.5, 'TEXT':{},'filter':{}}
    condition_num = 0 #condition_num != 0
    attribute_condition_num = 0
    structure_condition_num = 0
    #get seed user uname or uid
    seed_user_dict = {}
    seed_uname = request.args.get('seed_uname', '')
    if seed_uname != '':
        seed_user_dict['uname'] = seed_uname
    seed_uid = request.args.get('seed_uid', '')
    if seed_uid != '':
        seed_user_dict['uid'] = seed_uid
    if seed_user_dict == {}:
        return json.dumps('no seed user') # if no seed user information return notice
    query_dict['seed_user'] = seed_user_dict
    #get query dict: attribute
    attribute_list = []
    for attribute_item in DETECT_QUERY_ATTRIBUTE:
        attribute_mark = request.args.get(attribute_item, DETECT_DEFAULT_MARK) # '0':not select--default  '1': select
        if attribute_mark == '1':
            attribute_list.append(attribute_item)
            attribute_condition_num += 1
    attribute_condition_num = len(attribute_list)
    attribute_weight = request.args.get('attribute_weight', DETECT_DEFAULT_WEIGHT) #default weight: 0.5
    attribute_weight = float(attribute_weight)
    if attribute_condition_num==0:
        attribute_weight = 0
    query_dict['attribute'] = attribute_list
    query_dict['attribute_weight'] = attribute_weight
    #get query_dict: strucure
    structure_list = {}
    for structure_item in DETECT_QUERY_STRUCTURE:
        structure_mark = request.args.get(structure_item, DETECT_DEFAULT_MARK)
        structure_list[structure_item] = structure_mark
        if structure_mark != '0':
            structure_condition_num += 1
    struture_condition_num = len(structure_list)
    structure_weight = request.args.get('structure_weight', DETECT_DEFAULT_WEIGHT) #default weight 0.5
    structure_weight = float(structure_weight)
    if struture_condition_num==0:
        attribute_weight = 0
    query_dict['structure'] = structure_list
    query_dict['structure_weight'] = structure_weight
    #get query_dict: text
    text_query_list = []
    for text_item in DETECT_TEXT_FUZZ_ITEM:
        item_value_string = request.args.get(text_item, '') # a string joint by ' '
        item_value_list = item_value_string.split(' ')
        if len(item_value_list) > 0 and item_value_string != '':
            nest_body_list = []
            for item_value in item_value_list:
                nest_body_list.append({'wildcard':{text_item: '*'+item_value+'*'}})
            text_query_list.append({'bool':{'should':nest_body_list}})
    for text_item in DETECT_TEXT_RANGE_ITEM:
        item_value_from = request.args.get(text_item+'_from', '')
        item_value_to = request.args.get(text_item+'_to', '')
        if item_value_from!='' and item_value_to != '':
            if int(item_value_from) > int(item_value_to):
                return json.dumps('invalid input for range')
            else:
                text_query_list.append({'range':{text_item:{'gte':int(item_value_from), 'lt':int(item_value_to)}}})

    query_dict['text'] = text_query_list
    #identify the query condition num at least one
    if attribute_condition_num + structure_condition_num == 0:
        return json.dumps('no query condition')
    #get query_dict: filter
    filter_dict = {} # filter_dict = {'count': 100, 'influence':{'from':0, 'to':50}, 'importance':{'from':0, 'to':50}}
    for filter_item in DETECT_QUERY_FILTER:
        if filter_item=='count':
            filter_item_value = request.args.get(filter_item, DETECT_DEFAULT_COUNT)
            filter_item_value = int(filter_item_value)
        else:
            filter_item_from = request.args.get(filter_item+'_from', DETECT_FILTER_VALUE_FROM)
            filter_item_to = request.args.get(filter_item+'_to', DETECT_FILTER_VALUE_TO)
            if int(filter_item_from) > int(filter_item_to):
                return json.dumps('invalid input for filter')
            filter_item_value = {'gte': int(filter_item_from), 'lt': int(filter_item_to)}
        filter_dict[filter_item] = filter_item_value
    if filter_dict['count'] == 0:
        return json.dumps('invalid input for count')
    query_dict['filter'] = filter_dict
    #get detect task information
    task_information_dict = {}
    task_information_dict['task_name'] = request.args.get('task_name', '')
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['state'] = request.args.get('state', '')
    task_information_dict['submit_user'] = request.args.get('submit_user', 'admin')
    task_information_dict['task_type'] = 'detect'   #type: detect/analysis
    task_information_dict['detect_type'] = 'single' #type: single/multi/attribute/event
    task_information_dict['detect_process'] = 0     #type: 0/20/50/70/100
    task_information_dict['task_id'] = task_information_dict['submit_user'] + '-' + task_information_dict['task_name']
    #save task information
    input_dict = {}
    input_dict['task_information'] = task_information_dict
    input_dict['query_condition'] = query_dict
    
    #task max count
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)
    
    status = save_detect_single_task(input_dict, task_max_count)
    #print 'single task success'
    return json.dumps(status)

# use to upload file to multi-person group detection
@mod.route('/multi_person/', methods=['GET', 'POST'])
def ajax_multi_person():
    results = {}
    query_dict = {} # query_dict = {'attribute':[], 'attribute_weight':0.5, 'structure':[], 'structure_weight':0.5, 'text':{} ,'filter':{}}
    task_information_dict = {} # task_information_dict = {'uid_list':[], 'task_name':xx, 'state':xx, 'submit_user':xx}
    input_dict = {}
    input_data = request.get_json()
    #upload user list
    upload_data = input_data['upload_data']
    line_list = upload_data.split('\n')
    uid_list = []
    for line in line_list:
        uid = line[:10]
        if len(uid)==10:
            uid_list.append(uid)
    task_information_dict['uid_list'] = uid_list
    if len(uid_list)==0:
        return json.dumps('no seed user')

    #task max count
    try:
        task_max_count = int(input_data['task_max_count'])
    except:
        task_max_count = 0
    #task information
    task_information_dict['task_name'] = input_data['task_name']
    task_information_dict['state'] = input_data['state']
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['submit_user'] = input_data['submit_user']
    task_information_dict['task_id'] =  input_data['submit_user'] + '-' + input_data['task_name']
    #identify whether to extend
    extend_mark = input_data['extend'] # extend_mark = 0/1
    if extend_mark == '0':
        task_information_dict['task_type'] = 'analysis'
        task_information_dict['status'] = 0
        input_dict['task_information'] = task_information_dict
        #print 'no extend save'
        results = save_detect_multi_task(input_dict, extend_mark, task_max_count)
    else:
        #print 'extend save'
        task_information_dict['task_type'] = 'detect'
        task_information_dict['detect_type'] = 'multi'
        task_information_dict['detect_process'] = 0
        #get query dict: attribute
        attribute_list = []
        for attribute_item in DETECT_QUERY_ATTRIBUTE:
            attribute_mark = input_data[attribute_item]
            if attribute_mark == '1':
                attribute_list.append(attribute_item)
        attribute_condition_num = len(attribute_list)
        if attribute_condition_num != 0:
            attribute_weight = input_data['attribute_weight']
        else:
            attribute_weight = 0
        query_dict['attribute_weight'] = float(attribute_weight)
        query_dict['attribute'] = attribute_list
        #get query dict: structure
        structure_list = {}
        for structure_item in DETECT_QUERY_STRUCTURE:
            structure_mark = input_data[attribute_item]
            structure_list[structure_item] = structure_mark
            if structure_mark != '0':
                structure_condition_num += 1
        
        structure_condition_num = len(structure_list)
        if structure_condition_num != 0:
            structure_weight = input_data['structure_weight']
        else:
            structure_weight = 0
        query_dict['structure_weight'] = float(structure_weight)
        query_dict['structure'] = structure_list
        #get query_dict: text
        text_query_list = []
        for text_item in DETECT_TEXT_FUZZ_ITEM:
            item_value_string = input_data[text_item] # a string joint by ' '
            item_value_list = item_value_string.split(' ')
            nest_body_list = []
            if len(item_value_list)>0 and item_value_string != '':
                for item_value in item_value_list:
                    nest_body_list.append({'wildcard':{text_item: '*'+item_value+'*'}})
                text_query_list.append({'bool':{'should':nest_body_list}})
        for text_item in DETECT_TEXT_RANGE_ITEM:
            try:
                item_value_from = input_data[text_item+'_from']
            except:
                item_value_from = ''
            try:
                item_value_to = input_data[text_item+'_to']
            except:
                iter_value_to = ''
            if item_value_from != '' and item_value_to != '':
                if int(item_value_from) > int(item_value_to):
                    return json.dumps('invalid input for range')
                else:
                    text_query_list.append({'range':{text_item:{'gte':int(item_value_from), 'lt':int(item_value_to)}}})
        query_dict['text'] = text_query_list
        #identify the comdition num at least 1
        if attribute_condition_num + structure_condition_num == 0:
            return json.dumps('no query condition')
        #get query dict: filter
        filter_dict = {} # filter_dict = {'count':100, 'influence':{'from':0, 'to':50}, 'importance':{'from':0, 'to':50}}
        filter_condition_num = 0
        for filter_item in DETECT_QUERY_FILTER:
            if filter_item == 'count':
                filter_item_value = input_data[filter_item]
                filter_item_value = int(filter_item_value)
                if filter_item_value != '0':
                    filter_condition_num += 1
            else:
                filter_item_from = input_data[filter_item+'_from']
                filter_item_to = input_data[filter_item+'_to']
                if int(filter_item_from) > int(filter_item_to):
                    return json.dumps('invalid input for filter')
                if filter_item_to != '0':
                    filter_condition_num += 1
                filter_item_value = {'gte':int(filter_item_from), 'lt':int(filter_item_to)}
            filter_dict[filter_item] = filter_item_value
        if filter_condition_num == 0:
            return json.dumps('invalid input for filter')
        query_dict['filter'] = filter_dict
        #save task information
        input_dict = {}
        input_dict['task_information'] = task_information_dict
        input_dict['query_condition'] = query_dict
        results = save_detect_multi_task(input_dict, extend_mark, task_max_count)
    results = json.dumps(results) # [True/False, out_user_list]
    return results

#use to group detect by attribute or pattern
@mod.route('/attribute_pattern/')
def ajax_attribute_pattern():
    results = {}
    input_dict = {} # input_dict = {'task_information':task_information_dict, 'query_dict': query_list}
    attribute_query_list = []
    pattern_query_list = [] 
    query_dict = {} # query_dict = {'attribute':attribute_query_list, 'pattern':pattern_query_list, 'filter':{}}
    condition_num = 0
    attribute_condition_num  = 0
    pattern_condition_num = 0
    #step0:get task information dict
    task_information_dict = {}
    #task max count
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)
    
    task_information_dict['task_name'] = request.args.get('task_name', '')
    task_information_dict['state'] = request.args.get('state', '')
    task_information_dict['submit_user'] = request.args.get('submit_user', 'admin')
    submit_user = task_information_dict['submit_user']
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['task_type'] = 'detect'
    task_information_dict['detect_type'] = 'attribute'
    task_information_dict['detect_process'] = 0
    task_information_dict['task_id'] = task_information_dict['submit_user'] + '-' + task_information_dict['task_name']
    #step1:get attribute query list
    #step1.1: fuzz item
    for item in DETECT_ATTRIBUTE_FUZZ_ITEM:
        item_value = request.args.get(item, '')
        if item_value:
            attribute_condition_num += 1
            item_value_list = item_value.split(',')
            nest_body_list = []
            for item_value in item_value_list:
                nest_body_list.append({'wildcard':{item: '*'+item_value+'*'}})
            attribute_query_list.append({'bool':{'should': nest_body_list}})
    #step1.2: multi select item
    for item in DETECT_ATTRIBUTE_MULTI_ITEM:
        nest_body_list = []
        item_value_string = request.args.get(item, '')
        if item_value_string != '':
            item_value_list = item_value_string.split(',')
            for item_value in item_value_list:
                nest_body_list.append({'term':{item: item_value}})
            attribute_query_list.append({'bool':{'should': nest_body_list}})
            attribute_condition_num += 1
    #step1.3: select item
    for item in DETECT_ATTRIBUTE_SELECT_ITEM:
        if item=='tag':
            tag_string = request.args.get(item, '')
            print 'tag_string:', tag_string
            if tag_string != '':
                tag_string_list = tag_string.split(',')
                for tag_item in tag_string_list:

                    tag_item_list = tag_item.split('-')
                    print 'tag_item_list:', tag_item_list
                    item_name = tag_item_list[0]
                    item_value = tag_item_list[1]
                if item_name and item_value:
                    attribute_condition_num += 1
                    tag_key = submit_user + '-tag'
                    tag_value = item_name + '-' + item_value
                    attribute_query_list.append({'term':{tag_key: tag_value}})
        else:
            item_value = request.args.get(item, '')
            if item_value:
                attribute_condition_num += 1
                attribute_query_list.append({'match':{item: item_value}})
    print 'attribute query list:', attribute_query_list
    query_dict['attribute'] = attribute_query_list
    #step2:get pattern query list
    #step2.1: fuzz item
    for item in DETECT_PATTERN_FUZZ_ITEM:
        item_value  = request.args.get(item, '')
        if item_value:
            pattern_condition_num += 1
            pattern_query_list.append({'wildcard':{item: '*'+item_value+'*'}})
    #step2.2: select item
    for item in DETECT_PATTERN_SELECT_ITEM:
        item_value_string = request.args.get(item, '')
        if item_value_string != '':
            item_value_list = item_value_string.split(',')
            nest_body_list = []
            for item_value in item_value_list:
                nest_body_list.append({'wildcard': {item: '*'+item_value+'*'}})
            pattern_condition_num += 1
            pattern_query_list.append({'bool':{'should': nest_body_list}})
    #step2.3: range item
    for item in DETECT_PATTERN_RANGE_ITEM:
        item_value_from = request.args.get(item+'_from', '')
        item_value_to = request.args.get(item+'_to', '')
        if item_value_from != '' and item_value_to != '':
            pattern_condition_num += 1
            if int(item_value_from) > int(item_value_to):
                return json.dumps('invalid input for condition')
            else:
                pattern_query_list.append({'range':{item:{'gte': int(item_value_from), 'lt':int(item_value_to)}}})
        
    #identify attribute and pattern condition num >= 1
    if attribute_condition_num + pattern_condition_num < 1:
        return json.dumps('invalid input for condition')
    query_dict['pattern'] = pattern_query_list
    #step3:get filter query dict
    filter_dict = {}
    for filter_item in DETECT_QUERY_FILTER:
        if filter_item=='count':
            filter_item_value = request.args.get(filter_item, DETECT_DEFAULT_COUNT)
            filter_item_value = int(filter_item_value)
        else:
            filter_item_from = request.args.get(filter_item+'_from', DETECT_FILTER_VALUE_FROM)
            filter_item_to = request.args.get(filter_item+'_to', DETECT_FILTER_VALUE_TO)
            if filter_item_from == '':
                filter_item_from = 0
            if filter_item_to == '':
                filter_item_to = 100
            if int(filter_item_from) > int(filter_item_to):
                return json.dumps('invalid input for filter')
            filter_item_value = {'gte': int(filter_item_from), 'lt':int(filter_item_to)}
        filter_dict[filter_item] = filter_item_value
    if filter_dict['count'] == 0:
        return json.dumps('invalid input for count')
    query_dict['filter'] = filter_dict
    #save task information
    input_dict = {}
    input_dict['task_information'] = task_information_dict
    input_dict['query_condition'] = query_dict
    status = save_detect_attribute_task(input_dict, task_max_count)
    return json.dumps(status)

#use to group detect by new pattern
@mod.route('/new_pattern/')
def ajax_new_pattern_detect():
    results = {}
    input_dict = {}
    pattern_query_list = []
    query_dict = {} # query_dict = {'pattern:pattern_query_list, 'attribute':attribute_query_list', filter:{}}
    condition_num = 0
    pattern_condition_num = 0
    #step1: get pattern query list
    #step1.1: fuzz item
    for item in DETECT_PATTERN_FUZZ_ITEM:
        item_value = request.args.get(item, '')
        if item_value:
            pattern_condition_num += 1
            item_value_list = item_value.split(',')
            nest_body_list = []
            for item_value in item_value_list:
                nest_body_list.append({'wildcard': {item: '*' + item_value + '*'}})
            pattern_query_list.append({'bool':{'should': nest_body_list}})
    #step1.2: select item
    for item in DETECT_PATTERN_SELECT_ITEM:
        item_value_string = request.args.get(item, '')
        if item_value_string != '':
            item_value_list = item_value_string.split(',')
            nest_body_list = []
            for item_value in item_value_list:
                if item == 'message_type':
                    item_value = int(item_value)
                nest_body_list.append({'term':{item: item_value}})
            pattern_condition_num += 1
            pattern_query_list.append({'bool':{'should': nest_body_list}})
    #step1.3: range item
    for item in DETECT_PATTERN_RANGE_ITEM:
        item_value_from = request.args.get(item+'_from', '')
        item_value_to = request.args.get(item+'_to', '')
        if item_value_from != '' and item_value_to != '':
            pattern_condition_num += 1
            if int(item_value_from) > int(item_value_to):
                return json.dumps('invalid input for condition')
            else:
                pattern_query_list.append({'range':{item:{'gte': int(item_value_from), 'lt':int(item_value_to)}}})
    #identify pattern condition num >= 1
    if pattern_condition_num < 1:
        return json.dumps('invalid input for condition')
    query_dict['pattern'] = pattern_query_list
    query_dict['attribute'] = []
    #step2: get filter query dict
    filter_dict = {}
    for filter_item in DETECT_QUERY_FILTER:
        if filter_item=='count':
            filter_item_value= request.args.get(filter_item, DETECT_DEFAULT_COUNT)
            filter_item_value = int(filter_item_value)
        else:
            filter_item_from = request.args.get(filter_item+'_from', DETECT_FILTER_VALUE_FROM)
            filter_item_to = request.args.get(filter_item+'_to', DETECT_FILTER_VALUE_TO)
            if filter_item_from=='':
                filter_item_from = 0
            if filter_item_to == '':
                filter_item_to = 100
            if int(filter_item_from) > int(filter_item_to):
                return json.dumps('invalid input for filter')
            filter_item_value = {'gte': int(filter_item_from), 'lt':int(filter_item_to)}
        filter_dict[filter_item] = filter_item_value
    if filter_dict['count'] == 0:
        return json.dumps('invalid input for count')
    query_dict['filter'] = filter_dict
    #step4: get task information dict
    task_information_dict = {}
    #task max count
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)

    task_information_dict['task_name'] = request.args.get('task_name', '')
    task_information_dict['state'] = request.args.get('state', '')
    task_information_dict['submit_user'] = request.args.get('submit_user', 'admin')
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['task_type'] = 'detect'
    task_information_dict['detect_type'] = 'pattern'
    task_information_dict['detect_process'] = 0
    task_information_dict['task_id'] = task_information_dict['submit_user'] + '-' + task_information_dict['task_name']
    #save task information
    input_dict = {}
    input_dict['task_information'] = task_information_dict
    input_dict['query_condition'] = query_dict

    status = save_detect_attribute_task(input_dict, task_max_count)
    return json.dumps(status)



#use to group detect by event
@mod.route('/event/')
def ajax_event_detect():
    results = {}
    query_dict = {} # {'attribute':attribute_query_list, 'event':event_query_list, 'filter':filter_dict}
    input_dict = {} # {'task_information':task_information_dict, 'query_dict': query_dict}
    attribute_query_list = []
    event_query_list = []
    query_condition_num = 0
    #step1: get attribtue query dict
    for item in DETECT_EVENT_ATTRIBUTE:
        item_value_string = request.args.get(item, '')
        if item_value_string != '':
            item_value_list = item_value_string.split(',')
            nest_body_list = []
            for item_value in item_value_list:
                nest_body_list.append({'wildcard':{item: '*'+item_value+'*'}})
            query_condition_num += 1
            attribute_query_list.append({'bool':{'should': nest_body_list}})

    query_dict['attribute']  = attribute_query_list
    #step2: get event query dict
    #step2.1: get event fuzz item
    for item in DETECT_TEXT_FUZZ_ITEM:
        item_value_string = request.args.get(item, '')
        item_value_list = item_value_string.split(' ')
        nest_body_list = []
        if item_value_string != '':
            for item_value in item_value_list:
                nest_body_list.append({'wildcard':{item: '*'+item_value+'*'}})
            event_query_list.append({'bool':{'should':nest_body_list}})
            query_condition_num += 1

    #step2.2: get event range item
    for item in DETECT_EVENT_TEXT_RANGE_ITEM:
        now_time = int(time.time())
        now_date_ts = datetime2ts(ts2datetime(now_time))
        item_value_from = request.args.get(item+'_from', now_date_ts - DAY)
        item_value_to = request.args.get(item+'_to', now_date_ts)
        if item_value_from != '' and item_value_to != '':
            if int(item_value_from) > int(item_value_to):
                return json.dumps('invalid input for range')
            else:
                query_condition_num += 1
                event_query_list.append({'range':{item: {'gte': int(item_value_from), 'lt':int(item_value_to)}}})
        else:
            return json.dumps('invalid input for range')
    query_dict['event'] =  event_query_list
    #identify the query condition at least 1
    if query_condition_num < 1:
        return json.dumps('invalid input for query')
    #step3: get filter dict
    filter_dict = {}
    for filter_item in DETECT_QUERY_FILTER:
        if filter_item == 'count':
            filter_item_value = request.args.get(filter_item, DETECT_DEFAULT_COUNT)
            filter_item_value = int(filter_item_value)
        else:
            filter_item_from = request.args.get(filter_item+'_from', DETECT_FILTER_VALUE_FROM)
            filter_item_to = request.args.get(filter_item+'_to', DETECT_FILTER_VALUE_TO)
            if filter_item_from == '':
                filter_item_from = 0
            if filter_item_to == '':
                filter_item_to = 100
            if int(filter_item_from) > int(filter_item_to):
                return json.dumps('invalid input for filter')
            filter_item_value = {'gte': int(filter_item_from), 'lt': int(filter_item_to)}
        filter_dict[filter_item] = filter_item_value
    if filter_dict['count'] == 0:
        return json.dumps('invalid input for count')
    query_dict['filter'] = filter_dict
    #step4: get task information dict
    task_information_dict = {}
    #task max count
    task_max_count = request.args.get('task_max_count', '3')
    task_max_count = int(task_max_count)

    task_information_dict['task_name'] = request.args.get('task_name', '')
    task_information_dict['submit_date'] = int(time.time())
    task_information_dict['state'] = request.args.get('state', '')
    task_information_dict['submit_user'] = request.args.get('submit_user', 'admin')
    task_information_dict['task_type'] = 'detect'
    task_information_dict['detect_type'] = 'event'
    task_information_dict['detect_process'] = 0
    task_information_dict['task_id'] = task_information_dict['submit_user'] + '-' + task_information_dict['task_name']
    #step5: save to es and redis
    input_dict['task_information'] = task_information_dict
    input_dict['query_condition'] = query_dict

    status = save_detect_event_task(input_dict, task_max_count)
    
    return json.dumps(status)

#use to show group detect task information
#output: group detect task information list
@mod.route('/show_detect_task/')
def ajax_show_detect_task():
    submit_user = request.args.get('submit_user', 'admin')
    results = show_detect_task(submit_user)
    return json.dumps(results)

#use to search group detect task
#input: search condition
#output: group detect task information list
@mod.route('/search_detect_task/')
def ajax_search_detect_task():
    task_name = request.args.get('task_name', '')
    submit_date = request.args.get('submit_date', '')
    state = request.args.get('state', '')
    process = request.args.get('process', '')
    detect_type = request.args.get('detect_type', '')
    submit_user = request.args.get('submit_user', 'admin')
    results = search_detect_task(task_name, submit_date, state, process, detect_type, submit_user)
    return json.dumps(results)

#use to show group detect task result
#input: task_name
#output: uid list
@mod.route('/show_detect_result/')
def ajax_show_detect_result():
    results = {}
    task_name = request.args.get('task_name', '')
    submit_user = request.args.get('submit_user', 'admin')
    results = show_detect_result(task_name, submit_user)
    return json.dumps(results)


#use to add detect task having been done to group analysis
#input: task_name, identify_uid_list
#output: results
@mod.route('/add_detect2analysis/',methods=['GET', 'POST'])
def ajax_add_detect2analysis():
    input_data = request.get_json() #input_data = {'uid_list':[], 'task_name':xx, 'submit_user':xx}
    #test
    results = detect2analysis(input_data)
    return json.dumps(results)

#use to delete detect task
@mod.route('/delete_task/')
def ajax_delete_task():
    status = True
    task_name = request.args.get('task_name', '')
    submit_user = request.args.get('submit_user', 'admin')
    status = delete_task(task_name, submit_user)
    return json.dumps(status)

#use to get social sensing group detect results
#input:
#output:
@mod.route('/show_sensing_task/') #获得所有的已经完成的社会感知任务列表
def ajax_socail_sensing():
    user = request.args.get("user", "")
    results = []
    results = show_social_sensing_task(user)
    return json.dumps(results)

@mod.route('/show_user_in_sensing_task/')
def ajax_show_user_in_sensing_task():
    task_name = request.args.get('task_name', '') # 获取某个任务名，返回相应重要的人
    user = request.args.get("user", "")
    _id = user + '-' + task_name
    results = show_important_users(_id)

    return json.dumps(results)

#use to submit social sensing group to analysis
#input: get_json
#output:
@mod.route('/submit_sensing/', methods=['GET', 'POST'])
def ajax_submit_sensing():
    status = False
    input_dict = request.get_json() # input_dict ={'task_information': {'task_name':xx, 'uid_list':[], 'state':[], submit_user:admin'}}
    status = submit_sensing(input_dict)
    return json.dumps(status)

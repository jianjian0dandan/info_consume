#*- coding:utf-8 -*-
import json
import time
from user_portrait.global_utils import es_user_portrait as es
from user_portrait.global_utils import portrait_index_name as user_index_name
from user_portrait.global_utils import portrait_index_type as user_index_type
from user_portrait.global_utils import es_group_result
from user_portrait.global_utils import group_index_name, group_index_type
from user_portrait.global_utils import es_tag
from user_portrait.global_utils import tag_index_name as attribute_index_name
from user_portrait.global_utils import tag_index_type as attribute_index_type
from user_portrait.time_utils import ts2datetime, datetime2ts
from user_portrait.parameter import IDENTIFY_ATTRIBUTE_LIST as identify_attribute_list


attribute_dict_key = ['attribute_value', 'attribute_user', 'date', 'user']


# use to submit attribute to es (custom_attribute, attribute)
def submit_attribute(attribute_name, attribute_value, submit_user, submit_date):
    status = False
    id_attribute = '-'.join([submit_user,attribute_name])
    print 'id_attribute:', id_attribute
    #maybe there have to identify the user admitted to submit attribute
    try:
        attribute_exist = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        attribute_exist = {}
    #identify the tag name not same with the identify_attribute_list
    if attribute_exist == {} and id_attribute not in identify_attribute_list:
        input_data = dict()
        now_ts = time.time()
        date = ts2datetime(now_ts)
        input_data['attribute_name'] = attribute_name
        input_data['attribute_value'] = '&'.join(attribute_value.split(','))
        input_data['user'] = submit_user
        input_data['date'] = submit_date
        es_tag.index(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute, body=input_data)
        status = True
        #put mappings to es_user_portrait
        submit_user_tag = str(submit_user) + "-tag"
        exist_field = es.indices.get_field_mapping(index=user_index_name, doc_type=user_index_type, field=submit_user_tag)
        if not exist_field:
            es.indices.put_mapping(index=user_index_name, doc_type=user_index_type, \
                body={'properties':{submit_user_tag:{'type':'string', 'analyzer':'my_analyzer'}}}, ignore=400)
    return status

# use to search attribute table
def search_attribute(query_body, condition_num):
    item_list = []
    default_size = 100000
    if condition_num==0:
        try:
            result = es_tag.search(index=attribute_index_name, doc_type=attribute_index_type, \
                    body={'query':{'match_all':{}}, 'size':default_size})['hits']['hits']
        except Exception, e:
            raise e
    else:
        try:
            result = es_tag.search(index=attribute_index_name, doc_type=attribute_index_type, \
                    body={'query':{'bool':{'must':query_body}}, 'size':default_size})['hits']['hits']
        except Exception, e:
            raise e
    if result:
        for item in result:
            source = item['_source']
            item_list.append(source)
    return item_list

# use to change attribtue
def change_attribute(attribute_name, value, submit_user, state):
    id_attribute = "-".join([submit_user, attribute_name])
    status = False
    # identify the attribute_name is in ES - custom attribute
    try:
        result =  es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        result = None
        return status
    value_list = '&'.join(value.split(','))
    result['attribute_name'] = attribute_name
    result['attribute_value'] = value_list
    result['user'] = submit_user
    now_ts = time.time()
    now_date = ts2datetime(now_ts)
    result['date'] = now_date
    es_tag.index(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute ,body=result)
    status = True
    return status

# use to delete attribute
def delete_attribute(attribute_name, submit_user):
    status = False
    id_attribute = "-".join([submit_user,attribute_name])
    submit_user_tag = submit_user+"-tag"
    print "id_attribute", id_attribute
    print "user_tag", submit_user_tag
    try:
        result = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except Exception, e:
        #raise e
        return status
    es_tag.delete(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)
    # delete attribute in user_portrait
    # user_portrait中，以attribute_name-attribute_value给用户赋值
    query = []
    portrait_attribute_field = []
    print "result", result
    attribute_value = result['attribute_value'].split('&')
    print "attribute_value", attribute_value
    for value in attribute_value:
        portrait_attribute_field.append(attribute_name +"-"+value)
    query.append({'terms':{submit_user_tag: portrait_attribute_field}})
    try:
        attribute_user_result = es.search(index=user_index_name, doc_type=user_index_type, \
                body={'query':{'bool':{'must':query}}, "size": 100000000})['hits']['hits']
    except:
        attribute_user_result = []
    if attribute_user_result==[]:
        status = True
        return status
    bulk_action = []
    count = 0
    for user_dict in attribute_user_result:
        try:
            user_item = user_dict['_source']
        except:
            next
        tmp = user_item[submit_user_tag]
        delete_set = set(tmp.split('&')) - set(portrait_attribute_field)
        print "delete_set", delete_set
        user_item[submit_user_tag] = "&".join(list(delete_set))
        user = user_item['uid']
        action = {'index':{'_id':str(user)}}
        bulk_action.extend([action, user_item])
        count += 1
        if count % 1000 == 0:
            es.bulk(bulk_action, index=user_index_name, doc_type=user_index_type)
            bulk_action = []
    if bulk_action:
        es.bulk(bulk_action, index=user_index_name, doc_type=user_index_type)

    status = True
    return status

# use to add attribute to user in es_user_portrait
def add_attribute_portrait(uid, attribute_name, attribute_value, submit_user):
    status = False
    submit_user_tag = submit_user + "-tag"
    id_attribute = submit_user + "-" + attribute_name
    add_attribute_value = attribute_name + "-" + attribute_value
    # identify the user exist
    # identify the attribute exist
    # identify the attribute exist in user_portrait
    # add attribute in user_portrait
    try:
        user_result = es.get(index=user_index_name, doc_type=user_index_type, id=uid)['_source']
    except:
        return 'no user'
    try:
        attribute_result = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        return 'no attribute'
    attribute_value_list = attribute_result['attribute_value'].split('&')
    if attribute_value not in attribute_value_list:
        return 'no attribute value'
    value_set = set()
    for value in attribute_value_list:
        value_set.add(attribute_name + '-' + value) #
    submit_user_attribute = user_result.get(submit_user_tag, '') # 个人是否存在该管理员打上的个人标签
    tmp_attribute_set = set(submit_user_attribute.split('&'))
    attribute_exist = tmp_attribute_set & value_set
    if attribute_exist:
        return 'attribute exist'
    if submit_user_attribute:
        user_result[submit_user_tag] = "&".join([submit_user_attribute, add_attribute_value])
    else:
        user_result[submit_user_tag] = add_attribute_value
    es.index(index=user_index_name, doc_type=user_index_type, id=uid, body=user_result)
    status = True
    return status

# use to change attribute of user in es_user_portrait
def change_attribute_portrait(uid, attribute_name, attribute_value, submit_user):
    status = False
    submit_user_tag = submit_user + "-tag"
    id_attribute = submit_user + "-" + attribute_name
    #identify the user exist
    #identify the attribute exist
    #identify the attribute value exist
    #identify the submit_user have been admitted----without 
    try:
        user_result = es.get(index=user_index_name, doc_type=user_index_type, id=uid)['_source']
    except:
        return 'no user'
    try:
        attribute_result = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        return 'no attribute'
    value_list = attribute_result['attribute_value'].split('&')
    if attribute_value not in value_list:
        return 'no attribute value'
    submit_user_attribute = user_result.get(submit_user_tag, '') # 个人是否存在该管理员打上的个人标签
    if attribute_name not in submit_user_attribute:
        return 'personal attribute no exist'
    tmp_attribute_list = submit_user_attribute.split("&")
    attribute_list = []
    for item in tmp_attribute_list:
        if attribute_name in item:
            attribute_list.append(attribute_name + '-' + attribute_value)
        else:
            attribute_list.append(item)
    user_result[submit_user_tag] = "&".join(attribute_list)
    es.index(index=user_index_name, doc_type=user_index_type, id=uid, body=user_result)
    status = True
    return status

# use to delete attribute of user in es_user_portrait
def delete_attribute_portrait(uid, attribute_name, submit_user):
    status = False
    submit_user_tag = submit_user + "-tag"
    id_attribute = submit_user + "-" + attribute_name
    #identify the user exist
    #identify the attribute value exist in es_user_portrait
    #identify the submit_user have been admitted---without
    try:
        user_result = es.get(index=user_index_name, doc_type=user_index_type, id=uid)['_source']
    except:
        return 'no user'
    submit_user_attribute = user_result.get(submit_user_tag, '')
    if attribute_name not in submit_user_attribute:
        return 'user have no attribtue'
    try:
        tmp_attribute = submit_user_attribute.split('&')
        for item in tmp_attribute:
            if attribute_name in item:
                tmp_attribute.remove(item)
        user_result[submit_user_tag] = "&".join(tmp_attribute)
        es.index(index=user_index_name, doc_type=user_index_type, id=uid, body=user_result)
        status = True
    except Exception, e:
        raise e

    return status

'''
identify_attribute_list = ['emoticon','domain', 'psycho_status_string', 'uid', 'hashtag_dict', \
                           'importance', 'online_pattern', 'influence', 'keywords_string', 'topic', \
                           'activity_geo', 'link', 'hashtag', 'keywords', 'fansnum', 'psycho_status', \
                           'text_len', 'photo_url', 'verified', 'uname', 'statusnum', 'gender', \
                           'topic_string', 'activeness', 'location', 'activity_geo_dict', \
                           'emotion_words', 'psycho_feature', 'friendsnum']
'''

# use to get user custom tag
# return {uid:['attribute_name1:attribute_value1', 'attribute_name2:attribtue_value2']}
def get_user_tag(uid_list, submit_user):
    result = {}
    user_result = es.mget(index=user_index_name, doc_type=user_index_type, body={'ids':uid_list})['docs']
    for user_item in user_result:
        uid = user_item['_id']
        result[uid] = []
        try:
            source = user_item['_source']
        except:
            source = {}
        submit_user_tag = submit_user + '-tag'
        submit_user_attribute = source.get(submit_user_tag, '')
        if submit_user_attribute:
            attribute_list = submit_user_attribute.split('&')
            for item in attribute_list:
                result[uid].append(item.replace('-',':'))

    return result

# use to add tag to group
def add_tag2group(uid_list, attribute_name, attribute_value, submit_user):
    id_attribute = submit_user + "-" + attribute_name
    add_attribute = attribute_name + "-" + attribute_value
    submit_user_tag = submit_user + "-tag"
    status = False
    #identify the attribute exist
    #for uid in uid_list
    #identify the attribute not in this user
    #add tag to this user
    try:
        attribute_exist = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        return 'no attribute'
    attribute_exist_value_list = attribute_exist['attribute_value'].split('&')
    if attribute_value not in attribute_exist_value_list:
        return 'no attribute value'
    for uid in uid_list:
        try:
            user_exist = es.get(index=user_index_name, doc_type=user_index_type, id=uid)['_source']
        except:
            user_exist = {}
            continue
        submit_user_attribute = user_exist.get(submit_user_tag, '')
        if user_exist and attribute_name not in submit_user_attribute:
            if submit_user_attribute:
                user_exist[submit_user_tag] = "&".join([submit_user_attribute, add_attribute])
            else:
                user_exist[submit_user_tag] = add_attribute
            es.index(index=user_index_name, doc_type=user_index_type, id=uid, body=user_exist)
    status = True
    return status

# use to show custom_attribute_name
def get_attribute_name(submit_user):
    attribute_name_list = []
    try:
        query_body = {
            "query":{
                 "wildcard":{
                    "user": '*' + submit_user + '*'
                        }
                    
            },
            "size": 100000
        }
        attribute_result = es_tag.search(index=attribute_index_name, doc_type=attribute_index_type, \
                                     body=query_body)['hits']['hits']
    except Exception, e:
        raise e
    if attribute_result:
        for item in attribute_result:
            source = item['_source']
            attribute_name_list.append(source['attribute_name'])
    return attribute_name_list

# use to show cutom_attribute_value
def get_attribute_value(attribute_name, submit_user):
    id_attribute = submit_user + "-" + attribute_name
    attribute_value_list = []
    try:
        attribute_result = es_tag.get(index=attribute_index_name, doc_type=attribute_index_type, id=id_attribute)['_source']
    except:
        return 'no attribute'
    attribute_value_string = attribute_result['attribute_value']
    attribute_value_list = attribute_value_string.split('&')
    return attribute_value_list

# use to show group tag statistic result
def get_group_tag(group_name, submit_user):
    result = {}
    order_result = []
    submit_user_tag = submit_user + "-tag"
    #get group task uid list
    #get user tag
    #statistic tag
    try:
        group_task_result = es_group_result.get(index=group_index_name, doc_type=group_index_type, id=group_name)
    except:
        return 'no group task'
    try:
        uid_list = group_task_result['_source']['uid_list']
    except:
        return 'no user'
    try:
        user_result = es.mget(index=user_index_name, doc_type=user_index_type, body={'ids': uid_list})['docs']
    except Exception, e:
        raise e
    for user_item in user_result:
        uid = user_item['_id']
        try:
            source = user_item['_source']
        except:
            source = {}
        submit_user_attribute = source.get(submit_user_tag, '')
        attribute_list = submit_user_attribute.split("&")
        for item in attribute_list:
            tag_string = item.replace("-", ":")
            try:
                result[tag_string] += 1
            except:
                result[tag_string] = 1
    order_result = sorted(result.items(), key=lambda x:x[1], reverse=True)
    return order_result


# use to get user attribute name for imagin
def get_user_attribute_name(uid, submit_user):
    result = []
    user_result = es.get(index=user_index_name, doc_type=user_index_type, \
                        id=uid)
    try:
        source = user_result['_source']
    except:
        source = {}
    submit_user_tag = submit_user + "-tag"
    submit_user_attribute = source.get(submit_user_tag, '')
    tag_list = submit_user_attribute.split('&')
    for item in tag_list:
        result.append(item.split('-')[0])
    return result

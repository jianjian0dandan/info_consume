from elasticsearch import Elasticsearch
import sys
import datetime
from time_utils import ts2datetime, datetime2ts

USER_INDEX_NAME = 'user_portrait_1222'
USER_INDEX_TYPE = 'user'

WEBUSER_INDEX_NAME = "weibo_user"
WEBUSER_INDEX_TYPE = "user"

BCIHISTORY_INDEX_NAME = 'bci_history'
BCIHISTORY_INDEX_TYPE = 'bci'

SESHISTORY_INDEX_NAME = 'sensitive_history'
SESHISTORY_INDEX_TYPE = 'sensitive'

es = Elasticsearch(['219.224.134.213', '219.224.134.214'], timeout = 6000)

def make_up_user_info(user_list = []):
    result_info = []

    today = str(datetime.date.today())
    today = '2013-09-07'
    timestamp = datetime2ts(today)
    print len(user_list)
    if user_list:
        for id in user_list:
            item = {}
            item['uid'] = id
            item['is_warehousing'] , item['uname'], item['weibo_num'] , item['location'] , item['fansnum'] = user_portrait_info(id)
            item['bci_day_last'] = history_info(BCIHISTORY_INDEX_NAME,BCIHISTORY_INDEX_TYPE,id,['bci_day_last'])
            item['sen_day_last'] = history_info(SESHISTORY_INDEX_NAME,BCIHISTORY_INDEX_TYPE,id,['sensitive_score_' + str(timestamp) ])
            result_info.append(item)
        return result_info
    else:
        return []



def user_portrait_info(uid):
    fields =  [
                    "nick_name",
                    "statusnum",
                    "user_location",
                    "fansnum",
                    
                ]
    query = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "user.uid": uid
                                }
                            }
                        ]
                    }
                },
                "fields": fields
            }
    try:
        result = es.search(index = WEBUSER_INDEX_NAME , doc_type = WEBUSER_INDEX_TYPE , body = query)
        if result['timed_out'] == False and result['hits']['total'] != 0 :
            item = result['hits']['hits'][0]['fields']
            return True, item[fields[0]][0] , item[fields[1]][0] , item[fields[2]][0]  ,item[fields[3]][0]
        else :
            fields = [ 'uname', 'statusnum', 'location', 'fansnum' ]
            query['fields'] = fields
            result = es.search(index = USER_INDEX_NAME , doc_type = USER_INDEX_TYPE , body = query)
            if result['timed_out'] == False and result['hits']['total'] != 0 :
                item = result['hits']['hits'][0]['fields']
                return True, item[fields[0]][0] , item[fields[1]][0] , item[fields[2]][0]  ,item[fields[3]][0]
            else :
                return False, None , None , None, None
    except Exception , e:
        print "Exception : " + str(e)
        return False ,"data_lost" , "data_lost" , "data_lost" , "data_lost"

def history_info(index_name , index_type , uid , fields = []):
    
    length = len(fields)
    
    query = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "bci.uid": uid
                                }
                            }
                        ]
                    }
                },
                "fields": fields
            }
    try:
        result = es.search(index = index_name , doc_type = index_type , body = query)
        if result['timed_out'] == False and result['hits']['total'] != 0 :
            item = result['hits']['hits'][0]['fields']
            return item[fields[0]][0]
        else :
            return None
    except Exception , e:
        print "Exception : " + str(e)
        return None
    
    
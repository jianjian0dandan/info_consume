from elasticsearch import Elasticsearch
import sys
import datetime
from time_utils import ts2datetime, datetime2ts
from parameter import DAY, LOW_INFLUENCE_THRESHOULD

USER_INDEX_NAME = 'user_portrait_1222'
USER_INDEX_TYPE = 'user'

es = Elasticsearch(['219.224.134.213:9206', '219.224.134.214:9206'], timeout = 6000)

MAX_ITEMS = 2**20

def key_words_search( pre , time , start_time , keyword , type  = 'in'  ):
    date = start_time 
    index_name = pre + start_time
    while not es.indices.exists(index= index_name) :
        time = datetime2ts(date) + DAY
        date = ts2datetime(time)
        index_name = pre + date
        time -= 1

    uid_set = set()
    for i in range(time):
        print index_name
        query = {"query":{"bool":{"must":[{"prefix":{"text.text":keyword}}],"must_not":[],"should":[]}},"size":MAX_ITEMS,"sort":[],"facets":{},"fields":['uid']}
        try :
            temp = es.search(index = index_name , doc_type = 'text' , body = query)
            result = temp['hits']['hits']
            print "Fetch " + str(len(result))
            for item in result :
                uid_set.add(item['fields']['uid'][0].encode("utf-8") )
        except Exception,e:
            print e
            raise  Exception('user_list failed!')        
        time = datetime2ts(date) + DAY
        date = ts2datetime(time)
        index_name = pre + date
        i += 1
    
    if type == 'in' :
        query = {"fields":[],"size":MAX_ITEMS}
        in_set = set()
        try :
            result = es.search(index = USER_INDEX_NAME , type = USER_INDEX_TYPE , body = query)['hits']['hits']
            
            for item in result :
                in_set.add(item['_id'].encode("utf-8") )
            return list(uid_set & in_set)
        except Exception,e:
            print e
            raise  Exception('user_list failed!')      

    else :
        return list(uid_set)


    
            
    
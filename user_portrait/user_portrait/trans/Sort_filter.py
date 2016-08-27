from elasticsearch import Elasticsearch
import sys
import datetime
from time_utils import ts2datetime, datetime2ts

BCI_INDEX_NAME = 'copy_user_portrait_influence'
BCI_INDEX_TYPE = 'bci'

ACT_INDEX_NAME = 'copy_user_portrait_activeness'
ACT_INDEX_TYPE = 'activeness'

IMP_INDEX_NAME = 'copy_user_portrait_importance'
IMP_INDEX_TYPE = 'importance'

SES_INDEX_NAME = 'copy_user_portrait_sensitive'
SES_INDEX_TYPE = 'sensitive'

BCIHIS_INDEX_NAME = 'bci_history'
BCIHIS_INDEX_TYPE = 'bci'

SESHIS_INDEX_NAME = 'sensitive_history'
SESHIS_INDEX_TYPE = 'sensitive'



TIME = '2013-09-01'

es = Elasticsearch(['219.224.134.213', '219.224.134.214'], timeout = 6000)

MAX_SIZE = 300

def in_sort_filter(time = 1 , sort_norm = 'bci' , sort_scope = 'in_nolimit' , arg = None):
    ischange = False
    scope = None
    norm = None
    sort_field = None
    time_field = None
    pre = None
    
    if sort_scope == 'in_nolimit':
        pass ;
    elif sort_scope == 'in_limit_domain':
        scope = 'domain';
    elif sort_scope == 'in_limit_topic':
        scope = 'topic';
    elif sort_scope == 'in_limt_keyword':
        pass;   #deal it outer 
    elif sort_scope == 'in_limit_hashtag':
        scope = 'hashtag';
    elif sort_scope == 'in_limit_geo':
        scope = 'activity_geo'
    '''
    if time == 1:
        time_field = 'day' 
    elif time == 7:
        time_field = 'week'
    else :
        time_field = 'month'
    '''
    if sort_norm == 'bci':
        pre = 'bci_'
        ischange = False
        index = BCI_INDEX_NAME
        type = BCI_INDEX_TYPE
    elif sort_norm == 'bci_change':
        pre = 'bci_'
        ischange = True
        index = BCI_INDEX_NAME
        type = BCI_INDEX_TYPE 
    elif sort_norm == 'imp':
        pre = 'importance_'
        ischange = False
        index = IMP_INDEX_NAME
        type = IMP_INDEX_TYPE
    elif sort_norm == 'imp_change':
        pre = 'importance_'
        ischange = True
        index = IMP_INDEX_NAME
        type = IMP_INDEX_TYPE
    elif sort_norm == 'act':
        pre = 'activeness_'
        ischange = False
        index = ACT_INDEX_NAME
        type = ACT_INDEX_TYPE
    elif sort_norm == 'act_change':
        pre = 'activeness_'
        ischange = True
        index = ACT_INDEX_NAME
        type = ACT_INDEX_TYPE 
    elif sort_norm == 'ses':
        pre = 'sensitive_'
        ischange = False
        index = SES_INDEX_NAME
        type = SES_INDEX_TYPE
    elif sort_norm == 'ses_change':
        pre = 'sensitive_'
        ischange = True
        index = SES_INDEX_NAME
        type = SES_INDEX_TYPE 
    
    return es_search(pre ,scope ,arg,index,type,time,ischange)

    
def all_sort_filter( time = 1 , sort_norm = 'bci' , sort_scope = 'all_nolimit' , arg = None):

    ischange = False
    pre = None
    if sort_norm == 'bci':
        ischange = False
        pre = 'bci_'
        index_name = BCIHIS_INDEX_NAME
        index_type = BCIHIS_INDEX_TYPE
    elif sort_norm == 'bci_change':
        pre = 'bci_'
        ischange = True
        index = BCIHIS_INDEX_NAME
        type = BCIHIS_INDEX_TYPE 
    elif sort_norm == 'ses':
        pre = 'sensitive_'
        ischange = False
        index = SESHIS_INDEX_NAME
        type = SESHIS_INDEX_TYPE
    elif sort_norm == 'ses_change':
        pre = 'sensitive_'
        ischange = True
        index = SESHIS_INDEX_NAME
        type = SESHIS_INDEX_TYPE 
    if sort_scope == 'all_nolimit':
        return es_search(pre ,None ,None,index,type,time,ischange)
    else:
        return []
        

def es_search( pre , scope , arg , index_name , type_name  , time , ischange = False):
    today = str(datetime.date.today())
    today = '2013-09-07'
    timestamp = datetime2ts(today)
   
    
    sort_field = []
    if time == 1:
        if ischange:
            sort_field = pre + 'day_' + 'change'
        else:
            if index_name == SESHIS_INDEX_NAME : 
                sort_field = pre + 'score_' + timestamp
            elif index_name == BCIHIS_INDEX_NAME :
                sort_field = pre + 'day_' + 'last'
            else :
                sort_field = pre + str(timestamp)
    elif time == 7 :
        if ischange :
            sort_field = pre + 'week_' + 'change'
        else :
            sort_field = pre + 'week_' + 'ave'
    elif time == 30 :
        if ischange :
            sort_field = pre + 'month_' + 'change'
        else :
            sort_field = pre + 'month_' + 'ave'

    must = []
    if arg :
        must = [{"prefix": {scope: arg }} ]

    if sort_field:
        sort = [{ sort_field : { "order": "desc" } }]
        

    query = {
            "query": {
                "bool": {
                    "must": must,
                    "must_not": [],
                    "should": []
                }
            },
            "sort": sort , 
            "facets": {},
            "fields": [
                "uid"
            ],
            "size" : MAX_SIZE
        }
    try:
        print index_name
        print type_name
        print str(query).replace("\'","\"")
        result = es.search(index = index_name , doc_type = type_name , body = query)['hits']['hits']
        uid_list = []
        for item in result :
            uid_list.append(item['_id'].encode("utf-8") )
        return list(set(uid_list))
    except Exception,e:
        print e
        raise  Exception('user_list failed!')
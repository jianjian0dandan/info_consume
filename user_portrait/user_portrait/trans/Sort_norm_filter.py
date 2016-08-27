from elasticsearch import Elasticsearch
import sys

BCI_HISTORY_INDEX = 'bci_history'
BCI_HISTORY_TYPE = 'bci'


es = Elasticsearch(['219.224.134.213', '219.224.134.214'], timeout = 6000)

def sort_norm_filter(uid_list = [] , sort_norm = 'imp' , time = 1):   
    uid = []
    if sort_norm == 'bci':
        uid = history_sort('bci_',BCI_HISTORY_INDEX,BCI_HISTORY_TYPE,uid_list,time,False)
    elif sort_norm == 'bci_change':
        uid = history_sort('bci_',BCI_HISTORY_INDEX,BCI_HISTORY_TYPE,uid_list,time,True )
    elif sirt_norm == 'ses':
        uid = history_sort('ses_',SES_HISTORY_INDEX,SES_HISTORY_TYPE,uid_list,time,False)
    elif sort_norm == 'ses_change':
        uid = history_sort('ses_',SES_HISTORY_INDEX,SES_HISTORY_TYPE,uid_list,time,True )
    elif sirt_norm == 'imp':
        uid = history_sort('imp_',IMP_HISTORY_INDEX,IMP_HISTORY_TYPE,uid_list,time,False)
    elif sort_norm == 'imp_change':
        uid = history_sort('imp_',IMP_HISTORY_INDEX,IMP_HISTORY_TYPE,uid_list,time,True )
    elif sirt_norm == 'act':
        uid = history_sort('act_',ACT_HISTORY_INDEX,ACT_HISTORY_TYPE,uid_list,time,False)
    elif sort_norm == 'act_change':
        uid = history_sort('act_',ACT_HISTORY_INDEX,ACT_HISTORY_TYPE,uid_list,time,True )
    return uid


def history_sort( prefix ,index_name , index_type , uid_list , time , ischange = False):
    sort_field = prefix
    if time == 1 :
        if ischange:
            sort_filed += "day_change"
        else:
            sort_field += "day_last"
    elif time == 7:
        if ischange:
            sort_filed += "week_change"
        else:
            sort_field += "week_ave"
    else:
        if ischange:
            sort_filed += "month_change"
        else:
            sort_field += "month_ave"

    query = {
                "query": {
                    "filtered": {
                        "filter": {
                            "terms": {
                                "uid": uid_list
                            }
                        }       
                    }           
                },
                "sort": [{ sort_field : { "order": "desc" } }],
                "fields" : []
            }
    try:
        result = es.search(index = index_name , doc_type = index_type , body = query)['hits']['hits']
        uid_list = []
        for item in result :
            uid_list.append(item['_id'].encode("utf-8") )
        return uid_list
    except Exception,e:
        print e
        raise  Exception('get history_sort user_list failed!')

    
    
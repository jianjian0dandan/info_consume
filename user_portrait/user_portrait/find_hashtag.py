#-*- coding:utf-8 -*-
from parameter import domain_en2ch_dict as domain
import sys
import time
import json
import os
from global_utils import es_user_profile as es_profile
from global_utils import R_SOCIAL_SENSING as r
from global_utils import es_user_portrait as es
from time_utils import ts2datetime, datetime2ts, ts2date


def find_domain():
    #domain = []
    #for item in domains:
    #    domain.append([domains[item]])
    #print domain

    index_name = 'user_portrait_1222'
    task_doc_type = 'user'
    uid = ''
    domain = ''
    uid_domain = []
    query_body = {
        "query":{
            "filtered":{
                "filter":{
                    "bool":{
                        "must":[
                            {"terms":{"domain":["媒体","高校","法律机构及人士","政府机构及人士"]}}
                        ]
                    }
                }
            }
        },
        "size":1000
    }
    search_results = es.search(index=index_name, doc_type=task_doc_type, body=query_body)['hits']['hits']
    print len(search_results)
    for i in range(0,len(search_results)):
        uid = search_results[i]['_source']['uid']
        domain = search_results[i]['_source']['domain']
        uid_domain.append([uid,domain])
    write_json(uid_domain)

def write_json(arr):
    with open('id_domain.json','w') as f:
        f.write(json.dumps(arr))

if __name__ == '__main__':
	find_domain()

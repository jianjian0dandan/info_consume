# -*-coding:utf-8-*-

import sys
import json
import redis
reload(sys)
sys.path.append('./../')
from global_utils import R_CLUSTER_FLOW1 as r
from global_utils import es_user_profile, es_user_portrait, es_flow_text
from global_utils import profile_index_name, profile_index_type, portrait_index_name, portrait_index_type, flow_text_index_name_pre, flow_text_index_type
from time_utils import datetime2ts, ts2datetime
from parameter import TIME_INTERVAL, SOCIAL_SENSOR_INFO

def get_queue_index(timestamp):
    time_struc = time.gmtime(float(timestamp))
    hour = time_struc.tm_hour
    minute = time_struc.tm_min
    index = hour*4+math.ceil(minute/15.0) #every 15 minutes
    return int(index)

def get_temporal_rank(timestamp):
    index = get_queue_index(timestamp)
    index_ts = "influence_timestamp_" + str(index)
    
    uid_list = r.zrange(index_ts, 0, 10000, desc=True)
    user_info = []
    in_portrait = [] # 入库
    if uid_list:
        search_result = es_user_portrait.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":uid_list}, field=SOCIAL_SENSOR_INFO)["docs"]
        for item in search_result:
            if item["found"]:
                temp = []
                in_portrait.append(item['_id'])
                for iter_key in SOCIAL_SENSOR_INFO:
                   
    """
    if in_portrait:
        date = ts2datetime(timestamp)
        flow_text_index = flow_text_index_name_pre + date
        query_body = {
            "query":{
                "filtered":{
                    "filter":{
                        "bool":{
                            "must":[
                                {"range":{
                                    "timestamp":{
                                        "lt": timestamp,
                                        "gte": timestamp - TIME_INTERVAL
                                    }
                                }},
                                {"terms":{"uid":in_portrait}}
                            ]
                        }
                    }
                }
            },
            "size":10000
        }

        es_flow_text.search(index=flow_text_index, doc_type=flow_text_index_type, body=query_body)
       """         
    

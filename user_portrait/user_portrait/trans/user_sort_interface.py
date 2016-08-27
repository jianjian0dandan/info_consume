# -*-coding:utf-8-*-


from elasticsearch import Elasticsearch
import datetime
from Sort_filter import in_sort_filter,all_sort_filter
from Make_up_user_info import make_up_user_info
from Key_words_search import key_words_search
from time_utils import ts2datetime, datetime2ts
from parameter import DAY, LOW_INFLUENCE_THRESHOULD
from Sort_norm_filter import sort_norm_filter


def user_sort_interface(time = 1 , sort_norm = 'imp' , sort_scope = 'in_nolimit' , arg = None , start_time = '2013-09-01' , end_time = '2013-09-07'):
    
    uid_list = []
    return_data = {}
    
    
    try:
        first_stage_time = datetime.datetime.now()
        #find the userid which in the scope
        if sort_scope == 'all_nolimit' :
            uid_list = all_sort_filter(time,sort_norm,sort_scope,arg)
        elif sort_scope == 'all_limit_keyword':
            during = ( datetime2ts(end_time) - datetime2ts(start_time) ) / DAY
            time = 1
            if during > 3:
                time = 7
            elif during > 16:
                time = 30
            uid_list = key_words_search('flow_text_2013_',during,start_time,arg,'all')
            uid_list = sort_norm_filter(uid_list,sort_norm ,time)

        elif sort_scope == "in_limit_keyword":
            during = ( datetime2ts(end_time) - datetime2ts(start_time) ) / DAY
            time = 1
            if during > 3:
                time = 7
            elif during > 16:
                time = 30
            uid_list = key_words_search('flow_text_',during,start_time,arg,'all')   
            uid_list = sort_norm_filter(uid_list,sort_norm ,time)         
        else :
            uid_list = in_sort_filter(time , sort_norm , sort_scope, arg)

        #make up the result with userid list
        user_info_list = make_up_user_info(uid_list)
        second_stage_time = datetime.datetime.now()
        print "info-makeup's mission complete,  Time-consuming: " + str(second_stage_time - first_stage_time)

        #make up the JSON return data
        return_data['flag'] = True 
        return_data['data'] = user_info_list
        third_stage_time = datetime.datetime.now()
        print "JSON-maker's mission complete,  Time-consuming: " + str(third_stage_time - second_stage_time)
        return return_data
    except RuntimeError , e1:
        print "RuntimeError : " + str(e1)
        return_data['flag'] = False
        return_data['error_msg'] = "time out" 
    except Exception,e2 :
        print "Exception : " + str(e2)
        return_data['flag'] = False
        return_data['error_msg'] = e2.message 

    return return_data

if __name__ == "__main__":
    start_time = datetime.datetime.now()
    import json
    print json.dumps( user_sort_interface(time=1,sort_norm="bci",sort_scope="in_limit_keyword",arg = "你好") )
    end_time = datetime.datetime.now()
    print "Total time-consuming: " + str(end_time - start_time)


        
    

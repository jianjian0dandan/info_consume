from elasticsearch import Elasticsearch
import datetime 
import sys 
import time
import math
import numpy as np
from time_utils import ts2datetime, datetime2ts
from parameter import DAY, LOW_INFLUENCE_THRESHOULD
from elasticsearch.helpers import scan

#default fetcher number
MAX_ITEMS = 1000

#update bci_index_name with time stamp
BCI_INDEX_NAME = 'bci_' + ts2datetime(time.time() - DAY)
BCI_INDEX_NAME = 'bci_20130902'
BCI_INDEX_TYPE = 'bci'

BCIHISTORY_INDEX_NAME = 'bci_history'
BCIHISTORY_INDEX_TYPE = 'bci'

#update config with global_util.py
es = Elasticsearch(['219.224.134.213', '219.224.134.214'], timeout = 6000)


def cal_num(his_item = {} , day = 1 , attr = 'bci_' , cycle =  7 , today_time = time.time() ):
    if day < cycle :
        cycle = day
       
    bci_data = []
    for i in range(1 , cycle + 1):
        bci_data.append(his_item[attr + ts2datetime(today_time - i * DAY )])
    bci_sum = np.sum(bci_data)
    bci_ave = np.average(bci_data)
    bci_var = np.var(bci_data)
    return bci_sum , bci_ave , bci_var        
    
def update_his_item(history_item , today_bci , today_date):
    last_day = ts2datetime(today_date - DAY)
    warehousing_time = history_item['_source']['warehousing_time'] #get the warehousing time  yyyy-mm-dd
    #get the days of warehousing
    day = int((today_date - datetime2ts(warehousing_time))/DAY + 1)
    item = history_item['_source']
    try:
        item['bci_day_change'] = today_bci - item['bci_' + ts2datetime(today_date - 2 * DAY)]
    except Exception, e:
        print history_item['_id'] + ":" + e.message
        
    item['bci_week_change'] = today_bci - item['bci_week_ave']
    item['bci_month_change'] = today_bci - item['bci_month_ave']
    item['update_time'] = ts2datetime(today_date)
    if day > 30:
        item.pop('bci_' + ts2datetime(today - 30 * DAY))  #del the old record 30 days ago
    item['bci_'+ last_day] = today_bci #add bci day's record   
    item['bci_day_last'] = today_bci   
    item['bci_week_sum'] , item['bci_week_ave'], item['bci_week_var'] = cal_num(item , day, 'bci_' , 7 , today_date )
    item['bci_month_sum'] , item['bci_month_ave'], item['bci_month_var'] = cal_num(item , day, 'bci_' , 30 , today_date )
    return item    


def del_test_date(es_scan):
    count = 1
    while True:
        try:
            print count
            count += 1
            item = es_scan.next()
            es.delete(index = BCIHISTORY_INDEX_NAME , doc_type = BCIHISTORY_INDEX_TYPE ,  body={})
        except StopIteration:
            break 

if __name__ == "__main__":
    
    
    print "Start update bci_history"
    print "------------------------"
    start_time = datetime.datetime.now()
    print '1:update  2:clear data'
    num = int(raw_input())
    count = 1
    list = []
    today_date = time.time() - 1 * DAY
    last_day = ts2datetime(today_date - DAY)
    #if update
    if num == 1:
        s_re = scan(es, query={"query":{"match_all":{}},"size":MAX_ITEMS}, index=BCI_INDEX_NAME, doc_type=BCI_INDEX_TYPE)
        while True:
            try:
                temp = s_re.next()
                uid = temp['_id']
                today_bci = temp['_source']['user_index']
                try:
                    item = es.get(index = BCIHISTORY_INDEX_NAME, doc_type= BCIHISTORY_INDEX_TYPE, id = uid)
                except Exception, r: 
                    item = {}
                list.append({'index' : {'_index' : BCIHISTORY_INDEX_NAME , '_type' : BCIHISTORY_INDEX_TYPE , '_id' : uid }})
                if item :
                    #this id exists in the history_bci
                    list.append(update_his_item(item,today_bci,today_date))
                else :
                    #this id donnot exists in the history_bci
                    item['warehousing_time'] = ts2datetime(today_date)
                    #init bci info            
                    item['bci_'+ last_day] = today_bci
                    item['bci_day_last'] = today_bci   
                    item['bci_day_change'] = today_bci
                    item['bci_week_sum'] = today_bci
                    item['bci_week_change'] = today_bci
                    item['bci_week_ave'] = today_bci
                    item['bci_week_var'] = 0
                    item['bci_month_sum'] = today_bci
                    item['bci_month_change'] = today_bci
                    item['bci_month_ave'] = today_bci
                    item['bci_month_var'] = 0
                    item['update_time'] = ts2datetime(today_date)
                    item['uid'] = uid
                    list.append(item)
                count += 1
                if count % MAX_ITEMS == 0:
                    es.bulk(body = list, index = BCIHISTORY_INDEX_NAME , doc_type = BCIHISTORY_INDEX_TYPE)
                    list = []
            except StopIteration: 
                print "all done" 
                es.bulk(body = list, index = BCIHISTORY_INDEX_NAME , doc_type = BCIHISTORY_INDEX_TYPE) 
                break 
            except Exception, r: 
                print Exception, r 
    
        count = 1 
        list = []
        scaner = scan(es, query={"query":{"bool":{"must":[],"must_not":[{"term":{"bci.update_time": ts2datetime(today_date) }}],"should":[]}},"size":MAX_ITEMS}, index=BCIHISTORY_INDEX_NAME, doc_type=BCIHISTORY_INDEX_TYPE)
        while True:
            try:
                item = scaner.next()
                uid = item['_id']
                list.append({'index' : {'_index' : BCIHISTORY_INDEX_NAME , '_type' : BCIHISTORY_INDEX_TYPE , '_id' : uid }})
                temp = update_his_item(item,0,today_date)
                list.append(temp)
                count += 1
                if count % 1000 == 0:
                    es.bulk(body = list, index = BCIHISTORY_INDEX_NAME , doc_type = BCIHISTORY_INDEX_TYPE) 
                    list = []

            except StopIteration: 
                print "all done" 
                if list:
                    es.bulk(body = list, index = BCIHISTORY_INDEX_NAME , doc_type = BCIHISTORY_INDEX_TYPE) 
                else :
                    pass 
                break
            except Exception, r: 
                print Exception, r

    #if clear
    if num == 2:
        s_re = scan(es, query={"query":{"match_all":{}},"size":MAX_ITEMS}, index= BCIHISTORY_INDEX_NAME, doc_type= BCIHISTORY_INDEX_TYPE)
        del_test_date(s_re)
    

    end_time = datetime.datetime.now()
    print "------------------------"
    print "Job time : " + str(end_time - start_time) 
    

    
    


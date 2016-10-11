# -*- coding: utf-8 -*-
'''
version:2016.8
author:hxq
modified by Chen Y.Z
'''
import sys
import json
import networkx as nx
from parameter import MODULE_T_S, TOPIC, START, END, MAX_SIZE, TOPK
from parameter import Minute, Fifteenminutes, Hour, sixHour, Day, gexf_type, ds_gexf_type
#from parameter import weibo_topic2xapian   #xiapian不要了改成es
from parameter import weibo_TopicNameTransfer
from area import pagerank_rank, make_network, make_network_graph 
from topicStatus import _topic_not_calc, _update_topic_status2Computing, \
        _update_topic_status2Completed
from utils import acquire_topic_name, acquire_topic_id, \
        save_rank_results, save_gexf_results, save_attribute_dict, \
        acquire_real_topic_id

reload(sys)
sys.setdefaultencoding('utf-8')
from time_utils import ts2datetime, datetime2ts
#from config import db, GRAPH_PATH #　用于测试期间，建立topicstatus这张表。待删
import time # 用于测试生成topicStatus入库时间，待删
#from model import TopicStatus, Topics # 用于测试，待删
from lxml import etree
from get_first_user import get_first_node
from area import _utf8_unicode
from fu_tr import get_interval_count

sys.path.append('../../../')
from global_config import db, GRAPH_PATH
from model import TopicStatus, Topics

'''
Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
gexf_type = 1
ds_gexf_type = 2
'''
#topic_xapian_id = '54ccbfab5a220134d9fc1b37' 

def compute_network(topic, start_ts, end_ts):
    '''
    topics = _topic_not_calc() # topics=[{id:x,module:x,status:x,topic:x,start:x,end:x,db_date:x}]
    '''
    '''
    topic_status_info = db.session.query(TopicStatus).filter(TopicStatus.topic==topic ,\
                                                             TopicStatus.start==start_ts ,\
                                                             TopicStatus.end==end_ts ,\
                                                             TopicStatus.module=='identify' ,\
                                                             TopicStatus.status==-1).first()
    if topic_status_info:
        #topic = topics[0] # 每次只计算一个----为了做一个缓冲，每个n时间才计算一个
        print 'topic_id', topic_status_info.id
        start_ts = topic_status_info.start
        end_ts = topic_status_info.end
        db_date = topic_status_info.db_date
        topicname = topic
        _update_topic_status2Computing(topicname, start_ts, end_ts, db_date)
        print 'update_status'
        topic_id = acquire_topic_id(topicname, start_ts, end_ts) # 重新获取id是因为TopicStatus中id是自增加的，进行更新后，id就不是原来的那一个了
        windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
        date = ts2datetime(end_ts)
        '''

        #改动的地方从es表中读取话题的拼音也就是表名

    if True:
        print end_ts,type(end_ts)
        #topicname = topic
        date = ts2datetime(end_ts)
        windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
        topic_pinyin_name = topic
        # print 'start topic_name_transfer'   #把汉字的时间名换成拼音 奥运会>aoyunhui
        # topic_pinyin_name = weibo_TopicNameTransfer(topicname, start_ts, end_ts)
        # print topic_pinyin_name
        print 'start compute first_nodes'
        #start_date = ts2datetime(start_ts) # used to compute the first user
        get_first_node(topic_pinyin_name, start_ts, end_ts, windowsize, date)
        print 'end compute first_nodes'

        
        print 'start make network'
        max_size = MAX_SIZE
        attribute_add = True
        g, gg, new_attribute_dict = make_network(topic_pinyin_name, date, windowsize, max_size, attribute_add)
        #print g,gg,new_attribute_dict

        print 'write gexf file'
        #real_topic_id = acquire_real_topic_id(topicname, start_ts, end_ts)
        real_topic_id = topic_pinyin_name
        if not real_topic_id:
            print 'the topic not exist'
            return None
        key = str(real_topic_id) + '_' + str(date) + '_' + str(windowsize) 
        print 'gexf_file:', str(GRAPH_PATH)+str(key)+'_g_graph.gexf'
        #fh = open(str(GRAPH_PATH) + str(key) + '_g_graph.gexf', 'w+')
        #fh.close()
        #fh = open(str(GRAPH_PATH) + str(key) + '_gg_graph.gexf', 'w+')
        #fh.close()
        nx.write_gexf(g, str(GRAPH_PATH) + str(key) + '_g_graph.gexf')
        nx.write_gexf(gg, str(GRAPH_PATH) + str(key) + '_gg_graph.gexf')
        #nx.write_gexf(ds_dg, str(GRAPH_PATH) + str(key) + '_ds_dg_graph.gexf')
        #nx.write_gexf(ds_udg, str(GRAPH_PATH) + str(key) + '_ds_udg_graph.gexf')
        #这里要改一下 不用SSDB了
        save_attribute_dict(new_attribute_dict, 'g')
        #save_attribute_dict(ds_new_attribute_dict, 'ds_g')
        print 'end make network'
        
        print 'start PageRank'
        all_uid_pr,data = pagerank_rank(TOPK, date, windowsize, topic_pinyin_name)
        print 'len(all_uid_pr):', len(all_uid_pr)
        print 'end PageRank'
        
        print 'start make network graph'
        #topic_id = int(topic_id)
        windowsize = int(windowsize)
        if not topic_pinyin_name: # 待删
            gexf = ''
        else:
            gexf= make_network_graph(date, topic_pinyin_name, windowsize, all_uid_pr, data)
            #gexf = json.dumps(gexf)
        print 'save gexf'
        #print '*************************'*10
        #print gexf
        #print '*************************'*10
        save_gexf_results(topic_pinyin_name, date, windowsize, gexf, gexf_type)
        print 'start fu_tr'
        get_interval_count(topic_pinyin_name, date, windowsize)
        print 'update_topic_end'
        db_date = date
        _update_topic_status2Completed(topic_pinyin_name, start_ts, end_ts, db_date)
        print 'all done!' 
        

if __name__ == '__main__':
    #module_t_s = 'identify'
    status = -1
    #topic = u'奥运会'
    topic = 'aoyunhui'
    start = datetime2ts('2016-7-10')
    end = datetime2ts('2016-7-14')
    #end = 1470900837   #es表里的时间戳
    #start = int(1468339100)
    #end = int(1468684700)
    #目前这个start和end没怎么用上 加上时间范围es搜索不到 待解决
    #print start,'    ',end
    
    #module_t_s = MODULE_T_S
    #topic = TOPIC
    #start = datetime2ts(START)
    #end = datetime2ts(END)
    
    '''
    save_topics = Topics(topic, start, end)
    save_topics_exist = db.session.query(Topics).filter(Topics.topic==topic ,\
                                                        Topics.start_ts==start ,\
                                                        Topics.end_ts==end).first()
    if save_topics_exist:
        db.session.delete(save_topics_exist)
    db.session.add(save_topics)
    db.session.commit()
    
    db_date = int(time.time())
    save_t_s = TopicStatus(module_t_s, status, topic, start, end, db_date)
    save_t_s_exist = db.session.query(TopicStatus).filter(TopicStatus.module==module_t_s, TopicStatus.topic==topic ,\
                                                  TopicStatus.start==start, TopicStatus.end==end).first()
    if save_t_s_exist:
        db.session.delete(save_t_s_exist)
    db.session.add(save_t_s)
    db.session.commit()
    '''
    compute_network(topic, start, end)

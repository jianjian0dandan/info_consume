# -*- coding: utf-8 -*-

import json
from detect_peak import detect_peaks
from elasticsearch import Elasticsearch
from user_portrait.parameter import MYSQL_TOPIC_LEN
from user_portrait.time_utils import ts2datetime, datetime2ts, ts2date
from user_portrait.info_consume.topic_network_analyze.utils import get_trend_maker, get_trend_pusher
from user_portrait.info_consume.topic_time_analyze.utils import get_time_count
from user_portrait.info_consume.topic_geo_analyze.utils import province_weibo_count
from user_portrait.info_consume.topic_sen_analyze.utils import get_sen_time_count
from user_portrait.info_consume.topic_language_analyze.utils import get_during_keywords




index_name = "topics"
index_type = "text"
es = Elasticsearch("219.224.134.216:9204", timeout=600)
Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes
label_list = ["topic_id", "topic_status", "topic_name", "propagate_keywords", "start_ts", "end_ts", "topic_area", "topic_subject", "first_label", "second_label", "identify_firstuser", "identify_trendpusher", "identify_pagerank", "moodlens_sentiment", "topic_abstract", "propagate_peak", "propagate_peak_news"]
results = dict.fromkeys(label_list, '')
emotions = {"0": "中立", "1": "正向", "2": "生气", "3": "焦虑", "4": "悲伤", "5": "厌恶", "6": "消极及其他"}

def search_es(topic_id):
    '''
    topic_status:计算状态 (compute_status)
    topic_name:事件名称 (name)
    propagate_keywords: 关键词 (keywords)
    start_ts：起始时间戳，需转成年月日(start_ts) 
    end_ts：截止时间戳，需转成年月日(end_ts) 
    '''
    query_body = {
        "query":{
            "bool":{
                "must":[{
                    "term": {"_id": topic_id}
                },
                {
                    "term": {"comput_status": 1}
                }
                ]
            }
        },
        "size": 1
    }
    try:
        res = es.search(index=index_name, doc_type=index_type, body=query_body)["hits"]["hits"][0]["_source"]
    except:
        res = []

    if res:
        topic_name = res["name"].encode("utf-8")
        topic_status = res["comput_status"]
        start_ts = int(res["start_ts"])
        end_ts = int(res["end_ts"])
        if "keywords" in res:
            propagate_keywords = ",".join(res["keywords"].split("&")).encode("utf-8")
        else:
            propagate_keywords = ''
        results["topic_status"] = topic_status
        results["topic_name"] = topic_name
        results["propagate_keywords"] = propagate_keywords
        results["start_ts"] = ts2datetime(start_ts) 
        results["end_ts"] = ts2datetime(end_ts)
        return 1
    else:
        return 0


def format_maker_pusher(user_list):
    res_list = []
    for item in user_list[:20]:
        res_list.append(",".join([str(item["uid"]), item["name"], " ", " "]))

    return "|".join(res_list).encode("utf-8")

def format_count(count_dict):
    count = {}
    for key in count_dict:
        count[key] = sum(count_dict[key].values())

    peak_index = detect_peaks(zip(*count.iteritems())[1])
    res = []
    for idx, (key, value) in enumerate(count.iteritems()):
        peak = "0"
        if idx in peak_index:
            peak = "1"
        res.append([str(count[key]), ts2date(key), peak])
    return res
 
def format_topprovince(provin_list):
    provin_count = {}
    for item in provin_list:
        provin_count[item[0]] = item[1]["total"]

    return zip(*sorted(provin_count.iteritems(), key=lambda s:s[1], reverse=True)[:15])[0]

def format_sen(sen_dict):
    sen_count = {}
    sen_ratio = {}
    for key in sen_dict:
        for sen_type in sen_dict[key]:
            try:
                sen_count[emotions[sen_type]] += int(sen_dict[key][sen_type])
            except KeyError:
                sen_count[emotions[sen_type]] = int(sen_dict[key][sen_type])

    total = sum(sen_count.values())
    for key in sen_count:
        sen_ratio[key] = str(round(sen_count[key]/float(total)*100, 2)) + "%"
    return sen_count, sen_ratio             


def format_keywords(keywords_list):
    return zip(*sorted(keywords_list, key=lambda s:s[1], reverse=True)[:15])[0]


def get_basic_info(topic_id):
    query_body = {
        "query":{"match_all":{}
        }
    }
    try:
        count = str(es.count(index=topic_id, doc_type="text", body=query_body)["count"])
    except:
        count = ''

    query_body = {
      "aggs": {
        "all_uid": {
          "cardinality": {
            "field": "uid"
          }
        }
      }
    }
    try:
        user = str(es.search(index=topic_id, doc_type="text", body=query_body)["aggregations"]["all_uid"]["value"])
    except:
        user = ''

    return [count, user]



def export_to_csv(topic_id, start_ts, end_ts):
    results["topic_id"] = topic_id
    search_es(topic_id)
    date = ts2datetime(end_ts)
    windowsize = (end_ts - start_ts) / Day # 确定时间跨度的大小
    makers = format_maker_pusher(get_trend_maker(topic_id[:20], date, windowsize))
    results["identify_firstuser"] = makers

    pushers = format_maker_pusher(get_trend_pusher(topic_id[:20], date, windowsize))
    results["identify_trendpusher"] = pushers

    time_count = format_count(get_time_count(topic_id[:20], start_ts, end_ts, 24*3600))
    results["propagate_peak"] = time_count

    top15_province = format_topprovince(province_weibo_count(topic_id[:20], start_ts, end_ts))
    results["top15_province"] = top15_province

    total_count, total_user = get_basic_info(topic_id)
    results["total_count"] = total_count
    results["total_user"] = total_user

    sen_count, sen_ratio = format_sen(get_sen_time_count(topic_id[:20], start_ts, end_ts, end_ts-start_ts))
    results["moodlens_sentiment"] = sen_count
    results["sen_ratio"] = sen_ratio

    keywords_count = format_keywords(json.loads(get_during_keywords(topic_id, start_ts, end_ts)))
    results["top15_keywords"] = keywords_count

    # print u"该事件的舆情信息起始于" + results["start_ts"] + u",终止于" +　results["end_ts"]
    results["topic_abstract"] = u" ".join(["该事件的舆情信息起始于", results["start_ts"], "，终止于", results["end_ts"], "，共", results["total_user"], " 人参与信息发布与传播，舆情信息累计", results["total_count"], " 条。参与人群集中于", "，".join(results["top15_province"]), "。 前15个关键词是：", "，".join(results["top15_keywords"]), "。网民的情绪分布情况为：", "，".join(["：".join(item) for item in results["sen_ratio"].iteritems()]), "。"])
                   

    return results


if __name__ == '__main__':
    export_to_csv(topic_id="ye-jian-ming-1482830875", start_ts=1480176000, end_ts=1482681600)



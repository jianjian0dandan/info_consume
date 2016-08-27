# -*- coding:utf-8 -*-
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import ES_CLUSTER_FLOW1 as es
from global_utils import es_network_task, network_keywords_index_name

index_info = {
    'settings':{
        'analysis':{
            'analyzer':{
                'my_analyzer':{
                    'type': 'pattern',
                    'pattern': '&'
                    }
                }
            }
        },
    'mappings':{
        'network':{
            'properties':{
                'submit_user':{
                    'type':'string',
                    'index':'not_analyzed'
                    },
                'submit_ts':{
                    'type':'long',
                    },
                'query_range':{
                    'type':'string',
                    'index':'not_analyzed'
                    },
                'query_keywords':{
                    'type':'string',
                    'analyzer':'my_analyzer'
                    },
                'results':{
                    'type': 'string',
                    'index': 'not_analyzed'
                    },
                'status':{
                    'type': 'string',
                    'index': 'not_analyzed'
                    },
                'start_date':{
                    'type': 'string',
                    'index': 'not_analyzed'
                    },
                'end_date':{
                    'type': 'string',
                    'index': 'not_analyzed'
                    },
                }
            }
        }
    }

exist_bool = es.indices.exists(index=network_keywords_index_name)
print exist_bool
if exist_bool:
    es.indices.delete(index=network_keywords_index_name)
es_network_task.indices.create(index=network_keywords_index_name, body=index_info, ignore=400)


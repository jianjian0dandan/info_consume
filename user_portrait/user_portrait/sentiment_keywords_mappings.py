# -*- coding:utf-8 -*-
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_sentiment_task, sentiment_keywords_index_name,\
                         sentiment_keywords_index_type

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
        'sentiment':{
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
                    }
                }
            }
        }
    }

es_sentiment_task.indices.create(index=sentiment_keywords_index_name, body=index_info, ignore=400)


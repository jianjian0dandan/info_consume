# -*- coding: UTF-8 -*-
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_operation, operation_index_name, operation_index_type

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
        'operation':{
           'properties':{
               'admin_user': {
                   'type': 'string', 
                   'index': 'not_analyzed'
               },
               'timestamp': {
                   'type': 'long'
               },
               'recomment_count': {
                   'type': 'long'
               },
               'compute_count': {
                   'type': 'long'
               },
               'rank_count': {
                   'type': 'long'
               },
               'sentiment_count': {
                   'type': 'long'
               },
               'network_count': {
                   'type': 'long'
               },
               'detect_count': {
                   'type': 'long'
               },
               'analysis_count':{
                   'type': 'long'
               },
               'sensing_count':{
                   'type': 'long'
               },
               'tag_count':{
                   'type': 'long'
               }
           }
        }
    }
}

es_operation.indices.create(index=operation_index_name, body=index_info, ignore=400)

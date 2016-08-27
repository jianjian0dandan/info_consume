#-*- coding:utf-8 -*-
import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from user_portrait.time_utils import ts2datetime
from User_sort_interface import user_sort_interface
from Offline_task import search_user_task , getResult , delOfflineTask
from temporal_rank import get_temporal_rank

mod = Blueprint('user_rank', __name__, url_prefix='/user_rank')

@mod.route('/user_sort/', methods=['GET', 'POST'])
def user_sort():
    username = request.args.get('username', '') 
    search_time = request.args.get('time', '')
    sort_norm = request.args.get('sort_norm', '')
    sort_scope = request.args.get('sort_scope', '')
    arg = request.args.get('arg', '')
    st = request.args.get('st', '')
    et = request.args.get('et', '')
    isall = request.args.get('all','')
    all = True
    if isall == 'True':
        all = True
    else :
        all = False
    if arg :
        pass
    else :
        arg = None
    results = user_sort_interface(username,int(search_time),sort_scope,sort_norm,arg,st,et,all)
    return json.dumps(results)

@mod.route('/search_task/', methods=['GET', 'POST'])
def search_task():
    username = request.args.get('username', '')
    results = search_user_task(username)
    return json.dumps(results)

@mod.route('/get_result/' , methods=['GET','POST'])
def get_result():
    search_id = request.args.get('search_id','')
    results = getResult(search_id)
    return json.dumps(results)

@mod.route('/delete_task/' , methods =['GET','POST'])
def delete_task():
    search_id = request.args.get('search_id','')
    result = {}
    result['flag'] = delOfflineTask(search_id)
    return json.dumps(result)


@mod.route('/temporal_rank/')
def temporal_rank():
    task_type = request.args.get("task_type", "0")
    sort = request.args.get("sort", "retweeted") # comment
    results = []
    task_type = int(task_type)
    results = get_temporal_rank(task_type, sort)

    return json.dumps(results)

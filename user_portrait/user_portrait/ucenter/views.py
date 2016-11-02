# -*- coding:utf-8 -*-
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from utils import get_user_operation, submit_admin_note, delete_admin_note, \
                  show_admin_note, modify_admin_note, show_sensitive_words, \
                  add_sensitive_words, modify_sensitive_words, \
                  delete_sensitive_words, show_user_operation_index

from user_portrait.global_utils import es_user_portrait

mod = Blueprint('ucenter', __name__, url_prefix='/ucenter')

@mod.route('/user_operation/')
def ajax_user_operation():
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    results = get_user_operation(submit_user)
    if not results:
        results = {}
    return json.dumps(results)

@mod.route('/show_user_operation_index/')
def ajax_show_user_operation_index():
    admin_user = request.args.get('admin_user', '')
    start_date = request.args.get('start_date', '') # 2016-04-24
    end_date = request.args.get('end_date', '') # 2016_04-24
    results = show_user_operation_index(admin_user, start_date, end_date)
    if not results:
        results = []
    return json.dumps(results)

@mod.route('/submit_admin_note/', methods=['GET', 'POST'])
def ajax_submit_admin_note():
    #submit_info_dict = {'submit_info': 'note something'}
    submit_info_dict = request.get_json()
    
    #submit_info_dict = {'submit_info': 'the system is in a trial phase'}
    status = submit_admin_note(submit_info_dict)
    return json.dumps(status)

@mod.route('/delete_admin_note/')
def ajax_delete_admin_note():
    status = delete_admin_note()
    return json.dumps(status)

@mod.route('/show_admin_note/')
def ajax_show_admin_note():
    all_note_list = show_admin_note()
    return json.dumps(all_note_list)

@mod.route('/modify_admin_note/', methods=['GET', 'POST'])
def ajax_modify_admin_note():
    modify_info_dict = request.get_json()
    #modify_info_dict = {'submit_info': 'the system is in a trial phrase-modify'}
    status = modify_admin_note(modify_info_dict)
    return json.dumps(status)


@mod.route('/show_sensitive_words/')
def ajax_show_sensitive_words():
    results = show_sensitive_words()
    return json.dumps(results)


@mod.route('/add_sensitive_words/', methods=['GET', 'POST'])
def ajax_add_sensitive_words():
    add_words_dict = request.get_json()
    #test
    #add_words_dict = {'毒地': 1}
    status = add_sensitive_words(add_words_dict)
    return json.dumps(status)

@mod.route('/modify_sensitive_words/', methods=['GET', 'POST'])
def ajax_modify_sensitive_words():
    modify_words_dict = request.get_json()
    #modify_words_dict = {'毒地': 1}
    status = modify_sensitive_words(modify_words_dict)
    return json.dumps(status)

@mod.route('/delete_sensitive_words/', methods=['GET', 'POST'])
def ajax_delete_sensitive_words():
    delete_words_list = request.get_json()
    #test
    #delete_words_list = ['毒地']
    status = delete_sensitive_words(delete_words_list)
    return json.dumps(status)


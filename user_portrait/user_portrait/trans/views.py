#-*- coding:utf-8 -*-
import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from user_portrait.time_utils import ts2datetime
from user_sort_interface import user_sort_interface


mod = Blueprint('user_rank', __name__, url_prefix='/user_rank')

@mod.route('/user_sort/', methods=['GET', 'POST'])
def user_sort():
	time = request.args.get('time', '')
	sort_norm = request.args.get('sort_norm', '')
	sort_scope = request.args.get('sort_scope', '')
	arg = request.args.get('arg', '')
	st = request.args.get('st', '')
        et = request.args.get('et', '')
	if arg :
		pass;
	else :
		arg = None
	results = user_sort_interface(time, sort_norm  , sort_scope , arg ,st,et)
	return json.dumps(results)



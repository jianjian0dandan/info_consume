#-*- coding:utf-8: -*-
from flask import Blueprint,render_template,request
from flask.ext.security import login_required

mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/home/')
@login_required
def home():
	return render_template('/info_consume/index.html')

@mod.route('/date_index/')
@login_required
def date_index():
    keyword = request.args.get('topic_name','')
    return render_template('/info_consume/date_index.html',topic_name=keyword)

@mod.route('/index/')
@login_required
def content():
    return render_template('/info_consume/index.html')

@mod.route('/my_friend/')
@login_required
def my_friend():
	return render_template('/info_consume/my_friend.html')

@mod.route('/weiborecommand/')
@login_required
def weiborecommand():
	return render_template('/info_consume/weiborecommand.html')

@mod.route('/viewinformation/')
@login_required
def viewinformation():
	uid = request.args.get('uid','')
	return render_template('/info_consume/viewinformation.html',uid=uid)

@mod.route('/daohang_public/')
@login_required
def daohang_public():
	return render_template('/info_consume/daohang_public.html')

@mod.route('/boot_test/')
@login_required
def boot_test():
	username='admin@qq.com'
	return render_template('/info_consume/boot_test.html',username=username)

@mod.route('/circle_test/')
@login_required
def circle_test():
	username = 'admin@qq.com'
	return render_template('/info_consume/circle_test.html',username=username)


@mod.route('/myzone/')
@login_required
def myzone():
    return render_template('/info_consume/myzone.html')


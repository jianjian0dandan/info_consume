#-*- coding:utf-8: -*-
from flask import Blueprint,render_template,request

mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
@mod.route('/date_index')
def date_index():
    keyword = request.args.get('topic_name','')
    return render_template('/info_consume/date_index.html',topic_name=keyword)

@mod.route('/index')
def content():
    return render_template('/info_consume/index.html')

@mod.route('/my_friend')
def my_friend():
	return render_template('/info_consume/my_friend.html')

@mod.route('/weiborecommand')
def weiborecommand():
	return render_template('/info_consume/weiborecommand.html')

@mod.route('/viewinformation')
def viewinformation():
	uid = request.args.get('uid','')
	return render_template('/info_consume/viewinformation.html',uid=uid)

@mod.route('/daohang_public')
def daohang_public():
	return render_template('/info_consume/daohang_public.html')

@mod.route('/boot_test')
def boot_test():
	username='admin@qq.com'
	return render_template('/info_consume/boot_test.html',username=username)

@mod.route('/circle_test')
def circle_test():
	username = 'admin@qq.com'
	return render_template('/info_consume/circle_test.html',username=username)


@mod.route('/myzone')
def myzone():
    return render_template('/info_consume/myzone.html')


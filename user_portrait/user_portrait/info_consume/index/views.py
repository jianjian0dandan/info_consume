#-*- coding:utf-8: -*-
from flask import Blueprint,render_template

mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
@mod.route('/date_index')
def date_index():
    return render_template('/info_consume/date_index.html')

@mod.route('/index')
def content():
    return render_template('/info_consume/index.html')

@mod.route('/next')
def next():
	return render_template('/info_consume/person.html')

@mod.route('/person')
def person():
	return render_template('/info_consume/person.html')


@mod.route('/my_friend')
def my_friend():
	return render_template('/info_consume/my_friend.html')

@mod.route('/weiborecommand')
def weiborecommand():
	return render_template('/info_consume/weiborecommand.html')

@mod.route('/viewinformation')
def viewinformation():
	return render_template('/info_consume/viewinformation.html')
@mod.route('/daohang_public')
def daohang_public():
	return render_template('/info_consume/daohang_public.html')

@mod.route('/others')
def others():
	return render_template('/info_consume/others.html')
@mod.route('/boot_test')
def boot_test():
	return render_template('/info_consume/boot_test.html')
@mod.route('/circle_test')
def circle_test():
	return render_template('/info_consume/circle_test.html')


@mod.route('/myzone')
def myzone():
    return render_template('/info_consume/myzone.html')

#-*- coding:utf-8: -*-
from flask import Blueprint,render_template

mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
@mod.route('/index')
def content():
    return render_template('/info_consume/index.html')

@mod.route('/next')
def next():
	return render_template('/info_consume/person.html')

@mod.route('/person')
def person():
	return render_template('/info_consume/person.html')

@mod.route('/weiborecommand')
def weiborecommand():
	return render_template('/info_consume/weiborecommand.html')

@mod.route('/viewinformation')
def viewinformation():
	return render_template('/info_consume/viewinformation.html')


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

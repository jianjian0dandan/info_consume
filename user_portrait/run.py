# -*- coding: utf-8 -*-

import flask_security
from flask_login import current_user
from flask import g, session, flash, redirect, request, render_template
from flask_security.utils import logout_user
from optparse import OptionParser
from user_portrait import create_app
from flask.ext.security import Security, SQLAlchemyUserDatastore, \
            UserMixin, RoleMixin, login_required
from user_portrait.extensions import db, user_datastore, mongo

optparser = OptionParser()
optparser.add_option('-p', '--port', dest='port', help='Server Http Port Number', default=9001, type='int')
(options, args) = optparser.parse_args()

# Create app
app = create_app()

# Create user role data to test with
@app.route('/create_user_role_test')
def create_user_roles():
    db.drop_all()
    try:
        db.create_all()
        role_1 = user_datastore.create_role(name='userrank',chname=u'用户排名' ,description=u'用户排行模块权限')
        role_2 = user_datastore.create_role(name='sentiment',chname=u'情绪监测' ,description=u'情绪监测模块权限')
        role_3 = user_datastore.create_role(name='group',chname=u'群体分析' ,description=u'群体分析模块权限')
        role_4 = user_datastore.create_role(name='profile',chname=u'网民画像' ,description=u'网民画像模块权限')
        role_5 = user_datastore.create_role(name='administration',chname=u'系统管理' ,description=u'系统管理模块权限')
        role_6 = user_datastore.create_role(name='socialsensing',chname=u'社会感知' ,description=u'社会感知模块权限')
        
        user_1 = user_datastore.create_user(email='admin@qq.com', password="Bh123456")
        user_2 = user_datastore.create_user(email='linhao.lh@qq.com', password="Bh123456")
        user_3 = user_datastore.create_user(email='test2@qq.com', password="Bh123456")
        user_4 = user_datastore.create_user(email='wangqing', password="cncert@2016", usernum=3, moodnum=3)
        user_5 = user_datastore.create_user(email='wangmeng', password="cncert@2016", usernum=3, moodnum=3)

        user_datastore.add_role_to_user(user_1, role_1)
        user_datastore.add_role_to_user(user_1, role_2)
        user_datastore.add_role_to_user(user_1, role_3)
        user_datastore.add_role_to_user(user_1, role_4)
        user_datastore.add_role_to_user(user_1, role_5)
        user_datastore.add_role_to_user(user_1, role_6)

        user_datastore.add_role_to_user(user_2, role_1)
        user_datastore.add_role_to_user(user_2, role_2)
        user_datastore.add_role_to_user(user_2, role_3)
        user_datastore.add_role_to_user(user_2, role_4)
        user_datastore.add_role_to_user(user_2, role_6)

        user_datastore.add_role_to_user(user_3, role_1)
        db.session.commit()
        return "success"
    except:
        db.session.rollback()
        return "failure"

@app.before_request
def before_request():
    g.user = current_user

@app.after_request
def after_request(response):
    return response

@app.route('/')
@login_required
def homepage():
    #return render_template('homepage.html')
    #jln for 863
    return render_template('info_consume/index.html')

# logout
@app.route('/logout/')
@login_required
def logout():
    logout_user()
    #flash(u'You have been signed out')
    flash(u'登出成功')

    return redirect("/login") #redirect(request.args.get('next', None))

import json
from bson import json_util

@app.route('/testmongo/')
def testmongo():
    result = mongo.db.mrq_jobs.find({"path": "tasks.SocialSensing", "params.task_name": "test1", "params.ts": 1459078200})
    rs = []
    for r in result:
        rs.append(r)

    return json.dumps(rs, default=json_util.default)

# app run
if __name__ == "__main__":
    # Create app
    app.run(host='0.0.0.0', port=options.port)


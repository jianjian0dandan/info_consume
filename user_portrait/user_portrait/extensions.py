# -*- coding: utf-8 -*-

import flask_admin as admin
from flask.ext.pymongo import PyMongo
from flask import request, redirect, url_for, flash
from flask_admin.contrib import sqla
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore, \
            UserMixin, RoleMixin, current_user
#from flask.ext.mongoengine import MongoEngine

#__all__ = ['mongo', 'db', 'admin', 'mongo_engine']

__all__ = ['admin']

#db = SQLAlchemy()
#mongo = PyMongo()
#mongo_engine = MongoEngine()
#admin = admin.Admin(name=u'系统 数据库管理')

# Create database connection object
db = SQLAlchemy()

# Define models
roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

'''
class Roleadmin(sqla.ModelView):
    """用户角色
    """
    id = db.Column(db.Integer(), primary_key=True)
    # 该用户角色名称
    name = db.Column(db.String(80), unique=True)
    ch_name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    column_lables = dict(title='权限名称')
    def __unicode__(self):
        return self.name

    def __name__(self):
        return u'角色管理'
    def __init__(self, session):
        super(PostAdmin, self).__init__(Post, session)
'''
class AdminAccessView(sqla.ModelView):
    def is_accessible(self):
        if not current_user.is_active or not current_user.is_authenticated:
            return False

        if current_user.has_role('administration'):
            return True

        return False

    def _handle_view(self, name, **kwargs):
        """
        Override builtin _handle_view in order to redirect users when a view is not accessible.
        """
        if not self.is_accessible():
            if current_user.is_authenticated:
                # permission denied
                flash(u"没有权限访问该模块")
                return redirect("/")
            else:
                # login
                return redirect(url_for('security.login', next=request.url))

class Role(db.Model, RoleMixin):
    """用户角色
    """
    id = db.Column(db.Integer(), primary_key=True)
    # 该用户角色名称
    name = db.Column(db.String(80), unique=True)
    chname = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    #column_exclude_list = ['name']

    def __unicode__(self):
        return self.name

    def __name__(self):
        return u'角色管理'

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmedat = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    usernum = db.Column(db.Integer)
    moodnum = db.Column(db.Integer)
    netnum = db.Column(db.Integer)
    findnum = db.Column(db.Integer)
    analysisnum = db.Column(db.Integer)
    sensingnum = db.Column(db.Integer)
    # Required for administrative interface. For python 3 please use __str__ instead.
    def __unicode__(self):
        return self.email

    def __name__(self):
        return u'用户管理'

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security()

# Create admin
admin = admin.Admin(name=u'权限管理', template_mode='role')
#admin = admin.Admin(name=u'权限管理', base_template='/portrait/role_manage.html')

# Create mongo
mongo = PyMongo()

# -*- coding: utf-8 -*-

from flask import Flask,render_template
from elasticsearch import Elasticsearch
from flask_debugtoolbar import DebugToolbarExtension
from user_portrait.extensions import admin
from user_portrait.jinja import gender, tsfmt, Int2string, gender_text, user_email, user_location, user_birth, user_vertify, weibo_source
from user_portrait.index.views import mod as indexModule
from user_portrait.attribute.views import mod as attributeModule
from user_portrait.manage.views import mod as manageModule
from user_portrait.recommentation.views import mod as recommentationModule
from user_portrait.profile.views import mod as profileModule
from user_portrait.overview.views import mod as overviewModule
from user_portrait.influence_application.views import mod as influenceModule
from user_portrait.login.views import mod as loginModule
from user_portrait.group.views import mod as groupModule
from user_portrait.detect.views import mod as detectModule
from user_portrait.tag.views import mod as tagModule
from user_portrait.ucenter.views import mod as ucenterModule
#from user_portrait.weibo.views import mod as weiboModule
from user_portrait.social_sensing.views import mod as sensingModule
from user_portrait.sentiment.views import mod as sentimentModule
from user_portrait.network.views import mod as networkModule
#jln先不要这个登录
from user_portrait.extensions import db, security, user_datastore, admin, User, Role, roles_users, AdminAccessView, mongo
from flask.ext.security import SQLAlchemyUserDatastore
from flask_admin.contrib import sqla
from user_portrait.user_rank.views import mod as userrankModule
#jln
from info_consume.topic_sen_analyze.views import mod as topicSenModule
from info_consume.topic_language_analyze.views import mod as topicLanModule
from info_consume.topic_geo_analyze.views import mod as topicGeoModule
from info_consume.topic_time_analyze.views import mod as topicTimeModule
from info_consume.index.views import mod as infoIndexModule
from info_consume.user_rank.views import mod as infoUserrankModule
from info_consume.weibo_hashtag.views import mod as weiboHashtagModule


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///flask-admin.db'

    register_blueprints(app)
    register_extensions(app)
    register_jinja_funcs(app)

    # Create modules
    app.register_blueprint(indexModule)
    app.register_blueprint(manageModule)
    app.register_blueprint(attributeModule)
    app.register_blueprint(recommentationModule)
    app.register_blueprint(overviewModule)
    app.register_blueprint(influenceModule)
    app.register_blueprint(loginModule)
    app.register_blueprint(groupModule)
    app.register_blueprint(detectModule)
    app.register_blueprint(tagModule)
    app.register_blueprint(ucenterModule)
 #   app.register_blueprint(weiboModule)
    app.register_blueprint(sensingModule)
    app.register_blueprint(sentimentModule)
    app.register_blueprint(networkModule)
    app.register_blueprint(userrankModule)
    #jln
    app.register_blueprint(topicSenModule)
    app.register_blueprint(topicLanModule)
    app.register_blueprint(topicGeoModule)    
    app.register_blueprint(topicTimeModule) 
    app.register_blueprint(infoIndexModule) 
    app.register_blueprint(infoUserrankModule)
    app.register_blueprint(weiboHashtagModule)
    # the debug toolbar is only enabled in debug mode
    app.config['DEBUG'] = True

    app.config['ADMINS'] = frozenset(['youremail@yourdomain.com'])
    app.config['SECRET_KEY'] = 'SecretKeyForSessionSigning'
    app.config["WTF_CSRF_ENABLED"] = False #2016-04-13

    
    '''
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://%s:@%s/%s?charset=utf8' % (MYSQL_USER, MYSQL_HOST, MYSQL_DB)
    app.config['SQLALCHEMY_ECHO'] = False
    '''
    app.config['DATABASE_CONNECT_OPTIONS'] = {}

    app.config['THREADS_PER_PAGE'] = 8

    app.config['CSRF_ENABLED'] = True
    app.config['CSRF_SESSION_KEY'] = 'somethingimpossibletoguess'

    # Enable the toolbar?
    app.config['DEBUG_TB_ENABLED'] = app.debug
    # Should intercept redirects?
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
    # Enable the profiler on all requests, default to false
    app.config['DEBUG_TB_PROFILER_ENABLED'] = True
    # Enable the template editor, default to false
    app.config['DEBUG_TB_TEMPLATE_EDITOR_ENABLED'] = True

    """
    app.config['MONGO_HOST'] = '10.128.55.83'    
    app.config['MONGO_PORT'] = 27017    
    app.config['MONGO_DBNAME'] = 'mrq'    
    """
    app.config['MONGO_HOST'] = '219.224.134.212'    
    app.config['MONGO_PORT'] = 27017    
    app.config['MONGO_DBNAME'] = 'mrq'    
    # debug toolbar
    # toolbar = DebugToolbarExtension(app)

    # init database
    db.init_app(app)
    with app.test_request_context():
        db.create_all()

    # init security
    security.init_app(app, datastore=user_datastore)

    # init admin
    admin.init_app(app)
    admin.add_view(AdminAccessView(User, db.session))
    admin.add_view(AdminAccessView(Role, db.session))
    #admin.add_view(sqla.ModelView(User, db.session))
    #admin.add_view(sqla.ModelView(Role, db.session))
    #admin.add_view(Roleadmin(db.session))

    # init mongo
    mongo.init_app(app)    

    '''
    app.config['MONGO_HOST'] = MONGODB_HOST
    app.config['MONGO_PORT'] = MONGODB_PORT

    app.config['MONGODB_SETTINGS'] = {
        'db': MASTER_TIMELINE_54API_WEIBO_DB,
        'host': MONGODB_HOST,
        'port': MONGODB_PORT
    }

    # Create mysql database
    db.init_app(app)
    with app.test_request_context():
        db.create_all()

    # Create mongo_engine
    mongo_engine.init_app(app)

    admin.init_app(app)
    """
    # Create mysql database admin, visit via url: http://HOST:PORT/admin/
    for m in model.__all__:
        m = getattr(model, m)
        n = m._name()
        admin.add_view(SQLModelView(m, db.session, name=n))

    for m in mongodb_model.__all__:
        admin.add_view(MongoDBView(m))
    """

    # init mongo
    mongo.init_app(app)
    '''

    @app.route('/')
    def index():
        return render_template('/info_consume/index.html')

    return app
   

def register_blueprints(app):
    app.register_blueprint(indexModule)
    app.register_blueprint(manageModule)
    app.register_blueprint(attributeModule)
    app.register_blueprint(profileModule)

def register_extensions(app):
    app.config.setdefault('ES_USER_PROFILE_URL', 'http://219.224.134.213:9200/')
    app.extensions['es_user_profile'] = Elasticsearch(app.config['ES_USER_PROFILE_URL'])
    app.config.setdefault('ES_USER_PORTRAIT_URL', 'http://219.224.134.213:9200/')
    app.extensions['es_user_portrait'] = Elasticsearch(app.config['ES_USER_PORTRAIT_URL'])

def register_jinja_funcs(app):
    funcs = dict(gender=gender,
                 tsfmt=tsfmt,
                 int2string=Int2string,
                 gender_text=gender_text,
                 user_email=user_email,
                 user_location=user_location,
                 user_birth=user_birth,
                 user_vertify=user_vertify,
                 weibo_source=weibo_source)
    app.jinja_env.globals.update(funcs)

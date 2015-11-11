from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from config import config

# initialize flask extensions
# note, extensions are initalized with no Flask application instance because
# application factory is being used
db = SQLAlchemy()
login_manager = LoginManager()
login_manager.session_protection = 'strong'  # use strong session protection
login_manager.login_view = 'auth.login'  # set the endpoint for login page


def create_app(config_name):
    """
    Flask Application Factory that takes configuration settings and returns
    a Flask application.
    """
    # initalize instance of Flask application
    api = Flask(__name__)

    # import configuration settings into Flask application instance
    api.config.from_object(config[config_name])
    config[config_name].init_app(api)

    # initialize Flask extensions
    db.init_app(api)
    login_manager.init_app(api)

    # redirect all http requests to https
    if not api.debug and not api.testing and not api.config['SSL_DISABLE']:
        from flask.ext.sslify import SSLify
        sslify = SSLify(api)

    # register 'auth' blueprint with Flask application
    from .auth import auth as auth_blueprint
    # the 'url_prefix' parameter means all routes defined in the blueprint will
    # be registered with the prefix '/auth' (e.g., '/auth/login')
    api.register_blueprint(auth_blueprint, url_prefix='/auth')

    # register 'league' blueprint with Flask application
    from .league import league as league_blueprint
    # the 'url_prefix' parameter means all routes defined in the blueprint will
    # be registered with the prefix '/league' (e.g., '/league/fantasy_players')
    api.register_blueprint(league_blueprint, url_prefix='/league')

    return api

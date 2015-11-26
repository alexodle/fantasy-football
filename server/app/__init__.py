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
    app = Flask(__name__)

    # import configuration settings into Flask application instance
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # initialize Flask extensions
    db.init_app(app)
    login_manager.init_app(app)

    # redirect all http requests to https
    if not app.debug and not app.testing and not app.config['SSL_DISABLE']:
        from flask.ext.sslify import SSLify
        sslify = SSLify(app)

    # register 'api' blueprint with Flask application
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    return app

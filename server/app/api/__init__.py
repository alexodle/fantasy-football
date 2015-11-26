from flask import Blueprint

api = Blueprint('api', __name__)

from . import errors, authentication, users, fantasy_leagues, \
    football_conferences

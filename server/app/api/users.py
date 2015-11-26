from flask import jsonify
from . import api
from ..models import User


@api.route('/users/<int:id>')
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_json())


@api.route('/users/<int:id>/fantasy_leagues/')
def get_user_fantasy_leagues(id):
    user = User.query.get_or_404(id)
    fantasy_leagues = user.fantasy_leagues.all()
    return jsonify({'fantasy_leagues': [l.to_json() for l in fantasy_leagues]})

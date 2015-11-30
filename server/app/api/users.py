from flask import jsonify
from . import api
from ..models import User


@api.route('/users/')
def get_users():
    users = User.query.all()
    return jsonify({'users': [u.to_json() for u in users]})


@api.route('/users/<int:id>')
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_json())


@api.route('/users/<int:id>/fantasy_leagues/')
def get_user_fantasy_leagues(id):
    user = User.query.get_or_404(id)
    fantasy_leagues = user.fantasy_leagues.all()
    return jsonify({'fantasy_leagues': [l.to_json() for l in fantasy_leagues]})


@api.route('/users/<int:id>/fantasy_teams/')
def get_user_fantasy_teams(id):
    user = User.query.get_or_404(id)
    fantasy_teams = user.fantasy_teams.all()
    return jsonify({'fantasy_teams': [t.to_json() for t in fantasy_teams]})


@api.route('/users/<int:id>/commissioned_leagues/')
def get_user_commissioned_leagues(id):
    user = User.query.get_or_404(id)
    commiss_leagues = user.commissioned_leagues.all()
    return jsonify({'commissioned_leagues':
                    [l.to_json() for l in commiss_leagues]})

from flask import jsonify, current_app
from . import api
from ..models import User


@api.route('/users/')
def get_users():
    users = User.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'users': [u.to_json() for u in users]
        }
    })


@api.route('/users/<int:id>')
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: user.to_json()
    })


@api.route('/users/<int:id>/fantasy_leagues/')
def get_user_fantasy_leagues(id):
    user = User.query.get_or_404(id)
    fantasy_leagues = user.fantasy_leagues.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']:
            [l.to_json() for l in fantasy_leagues]
    })


@api.route('/users/<int:user_id>/fantasy_leagues/<int:league_id>/draft_picks/')
def get_user_fantasy_league_draft_picks(user_id, league_id):
    user = User.query.get_or_404(user_id)
    draft_picks = user.draft_picks.filter_by(fantasy_league_id=league_id).all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'draft_picks': [p.to_json() for p in draft_picks]
        }
    })


@api.route('/users/<int:user_id>/fantasy_leagues/<int:league_id>/'
           'draft_orders/')
def get_user_fantasy_league_draft_orders(user_id, league_id):
    user = User.query.get_or_404(user_id)
    draft_orders = \
        user.draft_orders.filter_by(fantasy_league_id=league_id).all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'draft_orders': [o.to_json() for o in draft_orders]
        }
    })


@api.route('/users/<int:id>/fantasy_teams/')
def get_user_fantasy_teams(id):
    user = User.query.get_or_404(id)
    fantasy_teams = user.fantasy_teams.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'fantasy_teams': [t.to_json() for t in fantasy_teams]
        }
    })


@api.route('/users/<int:id>/commissioned_leagues/')
def get_user_commissioned_leagues(id):
    user = User.query.get_or_404(id)
    commiss_leagues = user.commissioned_leagues.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'commissioned_leagues': [l.to_json() for l in commiss_leagues]
        }
    })

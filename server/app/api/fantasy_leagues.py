from flask import jsonify, current_app
from ..models import FantasyLeague, FootballTeam, FootballConference
from . import api


@api.route('/fantasy_leagues/')
def get_fantasy_leagues():
    fantasy_leagues = FantasyLeague.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'fantasy_leagues': [l.to_json() for l in fantasy_leagues]
        }
    })


@api.route('/fantasy_leagues/<int:id>')
def get_fantasy_league(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: fantasy_league.to_json()
    })


@api.route('/fantasy_leagues/<int:id>/users/')
def get_fantasy_league_users(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    users = fantasy_league.users.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'users': [u.to_json() for u in users]
        }
    })


@api.route('/fantasy_leagues/<int:id>/fantasy_teams/')
def get_fantasy_league_fantasy_teams(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    fantasy_teams = fantasy_league.fantasy_teams.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'fantasy_teams': [t.to_json() for t in fantasy_teams]
        }
    })


@api.route('/fantasy_leagues/<int:id>/football_teams/')
def get_fantasy_league_football_teams(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    football_teams = FootballTeam.query\
        .filter(FootballTeam.conference_id == fantasy_league.conference_id)\
        .all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_teams': [t.to_json() for t in football_teams]
        }
    })


@api.route('/fantasy_leagues/<int:id>/football_conferences/')
def get_fantasy_league_football_conferences(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    football_conferences = FootballConference.query\
        .filter_by(id=fantasy_league.conference_id).all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_conferences': [c.to_json() for c in football_conferences]
        }
    })


@api.route('/fantasy_leagues/<int:id>/draft_picks/')
def get_fantasy_league_draft_picks(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    draft_picks = fantasy_league.draft_picks.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'draft_picks': [p.to_json() for p in draft_picks]
        }
    })


@api.route('/fantasy_leagues/<int:id>/draft_orders/')
def get_fantasy_league_draft_orders(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    draft_orders = fantasy_league.draft_orders.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'draft_orders': [o.to_json() for o in draft_orders]
        }
    })

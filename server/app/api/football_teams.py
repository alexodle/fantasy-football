from flask import jsonify, current_app
from ..models import FootballTeam
from . import api
from .decorators import block_anonymous


@api.route('/football_teams/')
@block_anonymous
def get_football_teams():
    football_teams = FootballTeam.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_teams': [f.to_json() for f in football_teams]
        }
    })


@api.route('/football_teams/<int:id>')
@block_anonymous
def get_football_team(id):
    football_team = FootballTeam.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: football_team.to_json()
    })


@api.route('/football_teams/<int:id>/football_players/')
@block_anonymous
def get_football_team_football_players(id):
    football_team = FootballTeam.query.get_or_404(id)
    players = football_team.players.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_players': [p.to_json() for p in players]
        }
    })

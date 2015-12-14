from flask import jsonify, current_app
from ..models import FantasyTeam
from . import api


@api.route('/fantasy_teams/')
def get_fantasy_teams():
    fantasy_teams = FantasyTeam.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'fantasy_teams': [l.to_json() for l in fantasy_teams]
        }
    })


@api.route('/fantasy_teams/<int:id>')
def get_fantasy_team(id):
    fantasy_team = FantasyTeam.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: fantasy_team.to_json()
    })

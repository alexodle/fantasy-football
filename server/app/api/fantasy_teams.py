from flask import jsonify
from ..models import FantasyTeam
from . import api


@api.route('/fantasy_teams/')
def get_fantasy_teams():
    fantasy_teams = FantasyTeam.query.all()
    return jsonify({'fantasy_teams': [l.to_json() for l in fantasy_teams]})


@api.route('/fantasy_teams/<int:id>')
def get_fantasy_team(id):
    fantasy_team = FantasyTeam.query.get_or_404(id)
    return jsonify(fantasy_team.to_json())

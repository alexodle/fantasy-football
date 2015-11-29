from flask import jsonify
from ..models import FootballTeam
from . import api


@api.route('/football_teams/')
def get_football_teams():
    football_teams = FootballTeam.query.all()
    return jsonify({'football_teams':
                    [f.to_json() for f in football_teams]})


@api.route('/football_teams/<int:id>')
def get_football_team(id):
    football_team = FootballTeam.query.get_or_404(id)
    return jsonify(football_team.to_json())


@api.route('/football_teams/<int:id>/football_players/')
def get_football_team_football_players(id):
    football_team = FootballTeam.query.get_or_404(id)
    players = football_team.players.all()
    return jsonify({'football_players': [p.to_json() for p in players]})

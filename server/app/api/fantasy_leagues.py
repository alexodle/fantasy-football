from flask import jsonify
from ..models import FantasyLeague
from . import api


@api.route('/fantasy_leagues/<int:id>')
def get_fantasy_league():
    fantasy_league = FantasyLeague.get_or_404(id)
    return jsonify(fantasy_league.to_json())


@api.route('/fantasy_leagues/')
def get_fantasy_leagues():
    fantasy_leagues = FantasyLeague.query.all()
    return jsonify({'fantasy_leagues': [l.to_json() for l in fantasy_leagues]})

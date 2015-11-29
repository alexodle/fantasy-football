from flask import jsonify
from ..models import FantasyLeague, DraftPick, DraftOrder
from . import api


@api.route('/fantasy_leagues/')
def get_fantasy_leagues():
    fantasy_leagues = FantasyLeague.query.all()
    return jsonify({'fantasy_leagues': [l.to_json() for l in fantasy_leagues]})


@api.route('/fantasy_leagues/<int:id>')
def get_fantasy_league(id):
    fantasy_league = FantasyLeague.query.get_or_404(id)
    return jsonify(fantasy_league.to_json())


@api.route('/fantasy_leagues/<int:id>/draft_picks/')
def get_fantasy_league_draft_picks(id):
    draft_picks = \
        DraftPick.query.filter_by(fantasy_league_id=id).all()
    return jsonify({'draft_picks': [p.to_json() for p in draft_picks]})


@api.route('/fantasy_leagues/<int:id>/draft_orders/')
def get_fantasy_league_draft_orders(id):
    draft_orders = \
        DraftOrder.query.filter_by(fantasy_league_id=id).all()
    return jsonify({'draft_orders': [o.to_json() for o in draft_orders]})

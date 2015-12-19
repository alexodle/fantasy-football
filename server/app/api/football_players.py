from flask import jsonify, current_app
from ..models import FootballPlayer
from . import api
from .decorators import block_anonymous


@api.route('/football_players/')
@block_anonymous
def get_football_players():
    football_players = FootballPlayer.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_players': [f.to_json() for f in football_players]
        }
    })


@api.route('/football_players/<int:id>')
@block_anonymous
def get_football_player(id):
    football_player = FootballPlayer.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: football_player.to_json()
    })

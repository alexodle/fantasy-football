from flask import jsonify, current_app
from ..models import FootballConference
from . import api
from .decorators import block_anonymous


@api.route('/football_conferences/')
@block_anonymous
def get_football_conferences():
    football_conferences = FootballConference.query.all()
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']: {
            'football_conferences': [c.to_json() for c in football_conferences]
        }
    })


@api.route('/football_conferences/<int:id>')
@block_anonymous
def get_football_conference(id):
    football_conference = FootballConference.query.get_or_404(id)
    return jsonify({
        current_app.config['RESPONSE_OBJECT_NAME']:
            football_conference.to_json()
    })

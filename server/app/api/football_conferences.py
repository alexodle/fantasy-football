from flask import jsonify
from ..models import FootballConference
from . import api


@api.route('/football_conferences/')
def get_football_conferences():
    football_conferences = FootballConference.query.all()
    return jsonify({'football_conferences':
                    [c.to_json() for c in football_conferences]})


@api.route('/football_conferences/<int:id>')
def get_football_conference(id):
    football_conference = FootballConference.query.get_or_404(id)
    return jsonify(football_conference.to_json())

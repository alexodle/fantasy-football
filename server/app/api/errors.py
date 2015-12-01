from flask import jsonify
from app.exceptions import ValidationError
from . import api


def resource_not_found(message):
    response = jsonify({'error': 'not found', 'message': message})
    response.status_code = 404
    return response


def bad_request(message):
    response = jsonify({'error': 'bad request', 'message': message})
    response.status_code = 400
    return response


def unauthorized(message):
    response = jsonify({'error': 'unauthorized', 'message': message})

    # HACK: should be 401, but this prevents the browser from showing the auth popup
    response.status_code = 403

    return response


def forbidden(message):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response


@api.errorhandler(ValidationError)
def validation_error(e):
    """
    Error handler that's called when views raise the custom 'ValidationError'
    exception.
    """
    return bad_request(e.args[0])

from flask import g, jsonify
from flask.ext.httpauth import HTTPBasicAuth
from ..models import User, AnonymousUser
from . import api
from .errors import unauthorized, forbidden

# initialize object for basic HTTP authentication
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(email_or_token, password):
    """
    Callback function used by HTTPAuth to verify a User password or token.

    This callback function supports both password-based and token-based
    verification. For password-based verification, the client must pass an
    email address and password. For token-based verification, the client must
    pass a token and an empty password.

    Arguments:
    email_or_token -- the email address of the User or the token for the User.
        If this argument is an empty string, the User is considered anonymous.
    password -- the password for the User. If this field is an empty string,
        the function assumes the client wants to use token-based verification.
    """
    # anonymous logins are supported
    # client must send a blank email field
    if email_or_token == '':
        g.current_user = AnonymousUser()
        return True
    # use token-based verification when the password is blank
    if password == '':
        g.current_user = User.verify_auth_token(email_or_token)
        g.token_used = True
        return g.current_user is not None
    # use password-based verification when a password is provided
    user = User.query.filter_by(email=email_or_token).first()
    if not user:
        return False
    g.current_user = user
    g.token_used = False
    return user.verify_password(password)


@auth.error_handler
def auth_error():
    """
    Customer error handler to make sure errors are consistent across the API.
    """
    return unauthorized('Invalid credentials')


@api.before_request
@auth.login_required
def before_request():
    """
    Protect all routes in the api Blueprint with login_required.
    """
    if not g.current_user.is_anonymous and \
            not g.current_user.confirmed:
        return forbidden('Unconfirmed account')


@api.route('/token')
def get_token():
    """
    Route that returns authentication tokens to the client.

    This route does not generate new tokens from anonymous Users. Additionally,
    the route requires that the User was verified using password-based
    verification. This ensures a client can't generate a new token using an
    expired token.
    """
    if g.current_user.is_anonymous or g.token_used:
        return unauthorized('Invalid credentials')
    return jsonify({'token': g.current_user.generate_auth_token(
        expiration=3600), 'expiration': 3600})

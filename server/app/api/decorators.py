from functools import wraps
from flask import g
from .errors import unauthorized


def block_anonymous(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.current_user.is_anonymous:
            return unauthorized('must provide username and password')
        return f(*args, **kwargs)
    return decorated_function

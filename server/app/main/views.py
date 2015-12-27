from flask import render_template
from . import main


# IMPORTANT: Keep in sync with routes.jsx
#
# TODO: Better way to handle trailing slashes?
#
@main.route('/', methods=['GET'])
@main.route('/login', methods=['GET'])
@main.route('/login/', methods=['GET'])
@main.route('/draft/<draftId>', methods=['GET'])
@main.route('/draft/<draftId>/', methods=['GET'])
def index(draftId=None):
    # Routes and route parameters are unused here. We rely on the client code to
    # parse and handle view routes.
    return render_template('index.html')

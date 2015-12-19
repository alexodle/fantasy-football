import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask import current_app
from flask.ext.login import UserMixin, AnonymousUserMixin
from app.exceptions import ValidationError
from . import db, login_manager


# TODO: Move to constants file?
POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'D/ST']


fantasy_league_memberships = db.Table(
    'fantasy_league_memberships',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('fantasy_league_id', db.Integer,
              db.ForeignKey('fantasy_leagues.id'))
)


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)

    # back references
    commissioned_leagues = db.relationship(
        'FantasyLeague',
        backref='commissioner',
        lazy='dynamic'
    )
    fantasy_teams = db.relationship('FantasyTeam', backref='owner',
                                    lazy='dynamic')
    draft_picks = db.relationship('DraftPick', backref='user',
                                  lazy='dynamic')
    draft_orders = db.relationship('DraftOrder', backref='user',
                                   lazy='dynamic')

    # many-to-many relationship with FantasyLeague model
    fantasy_leagues = db.relationship(
        'FantasyLeague',
        secondary=fantasy_league_memberships,
        backref=db.backref('users', lazy='dynamic'),
        lazy='dynamic'
    )

    @staticmethod
    def generate_fake(count=100):
        from sqlalchemy.exc import IntegrityError
        from random import seed
        import forgery_py

        seed()
        for i in range(count):
            u = User(email=forgery_py.internet.email_address(),
                     username=forgery_py.internet.user_name(True),
                     password=forgery_py.lorem_ipsum.word(),
                     confirmed=True)
            db.session.add(u)
            # user might not be random, in which case rollback
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self, expiration=3600):
        """
        Generate a JSON Web Signature token with an expiration.
        """
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id})

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)  # commited after end of request
        return True

    def generate_reset_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'reset': self.id})

    def reset_password(self, token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('reset') != self.id:
            return False
        self.password = new_password
        db.session.add(self)
        return True

    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'change_email': self.id, 'new_email': new_email})

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False
        if data.get('change_email') != self.id:
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        if self.query.filter_by(email=new_email).first() is not None:
            return False
        self.email = new_email
        self.avatar_hash = hashlib.md5(
            self.email.encode('utf-8')).hexdigest()
        db.session.add(self)
        return True

    def generate_auth_token(self, expiration):
        """
        Create an authorization token that's used to authenticate API requests.

        The token is generated using the current User's id.

        Arguments:
        expiration -- the expiration of the token, in seconds
        """
        s = Serializer(current_app.config['SECRET_KEY'],
                       expires_in=expiration)
        return s.dumps({'id': self.id}).decode('ascii')

    @staticmethod
    def verify_auth_token(token):
        """
        Verify an authorization token that's used to authenticate API requests.

        This method is implemented as a static method because the User will
        only be known after verification is complete.

        Arguments:
        token -- the token generated using the user's id
        """
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.query.get(data['id'])

    def to_json(self):
        json_user = {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
        return json_user

    def __repr__(self):
        return '<User %r>' % self.username


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False

# Register AnonymousUser as the class assigned to 'current_user' when the
# user is not logged in.  This will enable the app to call
# 'current_user.can()' without having to first check if the user is logged in
login_manager.anonymous_user = AnonymousUser


@login_manager.user_loader
def load_user(user_id):
    """
    Callback function required by Flask-Login that loads a User, given the
    User identifier.  Returns User object or None.
    """
    return User.query.get(int(user_id))


class FantasyLeague(db.Model):
    __tablename__ = 'fantasy_leagues'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True)
    draft_start_date = db.Column(db.DateTime)

    # foriegn keys
    commissioner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    conference_id = db.Column(db.Integer,
                              db.ForeignKey('football_conferences.id'))

    # backrefs
    fantasy_teams = db.relationship('FantasyTeam', backref='fantasy_league',
                                    lazy='dynamic')
    draft_picks = db.relationship('DraftPick', backref='fantasy_league',
                                  lazy='dynamic')
    draft_orders = db.relationship('DraftOrder', backref='fantasy_league',
                                   lazy='dynamic')

    def to_json(self):
        json_fantasy_league = {
            'id': self.id,
            'name': self.name,
            'draft_start_date': self.draft_start_date,
            'commissioner_id': self.commissioner_id,
            'conference_id': self.conference_id,
        }
        return json_fantasy_league

    @staticmethod
    def from_json(json_fantasy_league):
        body = json_fantasy_league.get('body')
        if body is None or body == '':
            raise ValidationError('fantasy league does not have a body')
        return FantasyLeague(body=body)

    @staticmethod
    def generate_fake(count=20):
        from random import seed, randint
        import forgery_py

        seed()
        conference_count = FootballConference.query.count()
        users_per_league = 16
        for i in range(count):
            users = User.query.offset(users_per_league * i).\
                limit(users_per_league).all()
            commiss = User.query.offset(users_per_league * i).first()
            con = FootballConference.query.\
                offset(randint(0, conference_count - 1)).first()
            fl = FantasyLeague(
                name=forgery_py.name.company_name(),
                draft_start_date=forgery_py.date.date(past=False),
                commissioner=commiss,
                conference=con,
                users=users,
            )
            db.session.add(fl)


class FantasyTeam(db.Model):
    __tablename__ = 'fantasy_teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    short_name = db.Column(db.String(10))

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_json(self):
        json_fantasy_team = {
            'id': self.id,
            'name': self.name,
            'short_name': self.short_name,
            'fantasy_league_id': self.fantasy_league_id,
            'owner_id': self.owner_id,
        }
        return json_fantasy_team

    @staticmethod
    def generate_fake():
        from random import seed
        import forgery_py

        seed()
        for u in User.query.all():
            for fl in u.fantasy_leagues:
                ft = FantasyTeam(
                    name=forgery_py.name.company_name(),
                    short_name=forgery_py.internet.user_name(),
                    fantasy_league=fl,
                    owner=u
                )
                db.session.add(ft)


class FootballPlayer(db.Model):
    __tablename__ = 'football_players'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    position = db.Column(db.String(10))

    # foriegn keys
    football_team_id = db.Column(db.Integer,
                                 db.ForeignKey('football_teams.id'))

    # backrefs
    draft_picks = db.relationship('DraftPick', backref='football_player',
                                  lazy='dynamic')

    def to_json(self):
        json_football_player = {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'football_team_id': self.football_team_id,
        }
        return json_football_player

    @staticmethod
    def generate_fake(count=500):
        from random import seed, randint
        import forgery_py

        seed()
        team_count = FootballTeam.query.count()
        for i in range(count):
            ft = FootballTeam.query.offset(randint(0, team_count - 1)).first()
            fp = FootballPlayer(
                name=forgery_py.name.full_name(),
                position=POSITIONS[i % len(POSITIONS)],
                football_team=ft,
            )
            db.session.add(fp)


class FootballTeam(db.Model):
    __tablename__ = 'football_teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    # foriegn keys
    conference_id = db.Column(db.Integer,
                              db.ForeignKey('football_conferences.id'))

    # backrefs
    players = db.relationship('FootballPlayer', backref='football_team',
                              lazy='dynamic')

    def to_json(self):
        json_football_player = {
            'id': self.id,
            'name': self.name,
            'conference_id': self.conference_id,
        }
        return json_football_player

    @staticmethod
    def generate_fake(count=80):
        from random import seed, randint
        import forgery_py

        seed()
        conference_count = FootballConference.query.count()
        for i in range(count):
            fc = FootballConference.query.\
                offset(randint(0, conference_count - 1)).first()
            ft = FootballTeam(
                name=forgery_py.name.company_name(),
                conference=fc,
            )
            db.session.add(ft)


class FootballConference(db.Model):
    __tablename__ = 'football_conferences'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    # backrefs
    football_teams = db.relationship('FootballTeam', backref='conference',
                                     lazy='dynamic')
    fantasy_leagues = db.relationship('FantasyLeague', backref='conference',
                                      lazy='dynamic')

    @staticmethod
    def generate_fake(count=10):
        from sqlalchemy.exc import IntegrityError
        from random import seed
        import forgery_py

        seed()
        for i in range(count):
            fc = FootballConference(name=forgery_py.name.company_name())
            db.session.add(fc)
            # conference might not be random, in which case rollback
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()

    def to_json(self):
        json_football_conference = {
            'id': self.id,
            'name': self.name,
        }
        return json_football_conference


class DraftOrder(db.Model):
    __tablename__ = 'draft_orders'
    order = db.Column(db.Integer, primary_key=True)

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'),
                                  primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        primary_key=True)

    def to_json(self):
        json_draft_order = {
            'fantasy_league_id': self.fantasy_league_id,
            'order': self.order,
            'user_id': self.user_id,
        }
        return json_draft_order

    @staticmethod
    def generate_fake(rounds=5):
        # loop through every league, then every team and assign draft order
        leauges = FantasyLeague.query.all()
        for league in leauges:
            teams = league.fantasy_teams.all()

            round = 1
            while round <= rounds:
                for idx, team in enumerate(teams):
                    user = team.owner
                    do = DraftOrder(
                        order=(idx+1) + ((round-1)*len(teams)),
                        fantasy_league=league,
                        user=user,
                    )
                    db.session.add(do)
                round += 1


class DraftPick(db.Model):
    __tablename__ = 'draft_picks'
    order = db.Column(db.Integer, primary_key=True)

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'),
                                  primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        primary_key=True)
    football_player_id = db.Column(db.Integer,
                                   db.ForeignKey('football_players.id'),
                                   primary_key=True)

    def to_json(self):
        json_draft_pick = {
            'fantasy_league_id': self.fantasy_league_id,
            'order': self.order,
            'user_id': self.user_id,
            'football_player_id': self.football_player_id,
        }
        return json_draft_pick

    @classmethod
    def from_json(cls, json_draft_pick):
        """
        Convert a json request to a DraftPick
        """
        football_player_id = json_draft_pick.get('football_player_id')
        order = json_draft_pick.get('order')
        if football_player_id and order:
            return cls(football_player_id=football_player_id, order=order)
        else:
            raise ValidationError('insufficient data to create DraftPick')

    @staticmethod
    def generate_fake():
        # loop through every league, then every team and assign draft order
        leauges = FantasyLeague.query.all()
        for league in leauges:
            # get all draft orders for specific league
            draft_orders = league.draft_orders\
                .order_by(DraftOrder.order.asc()).all()

            # get all players from all teams in conference
            players = FootballPlayer.query.join(FootballTeam)\
                .filter(FootballTeam.conference == league.conference).all()

            # set the draft as being halfway done
            completed_draft_orders = draft_orders[:-len(draft_orders) / 2]
            for idx, pick in enumerate(completed_draft_orders):
                if players:  # check that there are players left in the draft
                    dp = DraftPick(
                        order=idx+1,
                        fantasy_league=league,
                        user=pick.user,
                        football_player=players.pop()
                    )
                    db.session.add(dp)

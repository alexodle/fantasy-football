import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask import current_app
from flask.ext.login import UserMixin, AnonymousUserMixin
from . import db, login_manager


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
    name = db.Column(db.String(255), unique=True, index=True)
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

    @staticmethod
    def generate_fake(count=10):
        from random import seed, randint
        import forgery_py

        seed()
        user_count = User.query.count()
        for i in range(count):
            u = User.query.offset(randint(0, user_count - 1)).first()
            f = FantasyLeague(
                name=forgery_py.lorem_ipsum.word(),
                commissioner=u,
                # TODO: add conference reference
                draft_start_date=forgery_py.date.date(past=False),
            )
            db.session.add(f)
            db.session.commit()


class FantasyTeam(db.Model):
    __tablename__ = 'fantasy_teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    short_name = db.Column(db.String(10))

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @staticmethod
    def generate_fake(count=10):
        pass


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

    @staticmethod
    def generate_fake(count=10):
        pass


class FootballTeam(db.Model):
    __tablename__ = 'football_teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    # foriegn keys
    conference_id = db.Column(db.Integer,
                              db.ForeignKey('football_conferences.id'))

    # backrefs
    players = db.relationship('FootballPlayer', backref='team', lazy='dynamic')

    @staticmethod
    def generate_fake(count=10):
        pass


class FootballConference(db.Model):
    __tablename__ = 'football_conferences'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    # backrefs
    football_teams = db.relationship('FootballTeam', backref='conference',
                                     lazy='dynamic')

    @staticmethod
    def generate_fake(count=10):
        pass


class DraftOrder(db.Model):
    __tablename__ = 'draft_orders'
    order = db.Column(db.Integer, primary_key=True)

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'),
                                  primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        primary_key=True)

    @staticmethod
    def generate_fake(count=10):
        pass


class DraftPick(db.Model):
    __tablename__ = 'draft_picks'
    pick_number = db.Column(db.Integer, primary_key=True)

    # foriegn keys
    fantasy_league_id = db.Column(db.Integer,
                                  db.ForeignKey('fantasy_leagues.id'),
                                  primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        primary_key=True)
    football_player_id = db.Column(db.Integer,
                                   db.ForeignKey('football_players.id'),
                                   primary_key=True)

    @staticmethod
    def generate_fake(count=10):
        pass

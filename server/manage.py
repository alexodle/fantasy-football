#!/usr/bin/env python
import os
from app import create_app, db
from app.models import User, FootballConference, FantasyLeague, FantasyTeam, \
    FootballPlayer, FootballTeam, DraftOrder, DraftPick
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand

# Add the python application root to the system path when deploying to elastic
# beanstalk. This allows mod_wsgi to know the location of the application.
# http://stackoverflow.com/questions/26810589/cannot-locate-modules-of-django-app-on-aws-elastic-beanstalk
if os.getenv('FLASK_CONFIG', 'default') == 'production':
    import sys
    sys.path.insert(0, '/opt/python/current/app/server')

application = create_app(os.getenv('FLASK_CONFIG', 'default'))
manager = Manager(application)
migrate = Migrate(application, db)


def make_shell_context():
    """
    Automatically import application, db, and model objects into interactive
    shell.
    """
    return dict(application=application, db=db, User=User,
                FootballConference=FootballConference,
                FantasyLeague=FantasyLeague, FantasyTeam=FantasyTeam,
                FootballPlayer=FootballPlayer, FootballTeam=FootballTeam,
                DraftOrder=DraftOrder, DraftPick=DraftPick)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """
    Run the unit tests.
    """
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


@manager.command
def db_rebuild():
    """
    Destroy and rebuild database with fake data.
    """
    # destroy and rebuild tables
    db.reflect()
    db.drop_all()
    db.create_all()

    # insert fake test users
    test_user_1 = User(
        email='salim@gmail.com',
        username='salim',
        password='password',
        confirmed=True,
    )
    test_user_2 = User(
        email='alex@gmail.com',
        username='aodle56',
        password='password',
        confirmed=True,
    )
    db.session.add_all([test_user_1, test_user_2])
    db.session.commit()

    # insert fake user data
    User.generate_fake(60)

    # insert fake conferences
    FootballConference.generate_fake(20)

    # insert fake fantasy leagues
    FantasyLeague.generate_fake(20)

    # insert fake fantasy teams
    FantasyTeam.generate_fake()

    # insert fake football teams
    FootballTeam.generate_fake(80)

    # insert fake football players
    FootballPlayer.generate_fake(3000)

    # insert fake draft orders
    DraftOrder.generate_fake(rounds=5)

    # complete draft
    # do not complete the draft when creating fake data
    # DraftPick.generate_fake()

    # print results
    inspector = db.inspect(db.engine)
    print 'The following tables were created.'
    print '-'*35
    for table in inspector.get_table_names():
        print table


if __name__ == '__main__':
    manager.run()

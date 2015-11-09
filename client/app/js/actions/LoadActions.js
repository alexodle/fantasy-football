import _ from 'lodash';
import Reflux from 'reflux';
import request from 'superagent';

const LoadActions = Reflux.createActions({
  loadUser: { asyncResult: true },
  loadMyLeagues: { asyncResult: true },
  loadFantasyPlayers: { asyncResult: true },
  loadDraftOrder: { asyncResult: true },
  loadDraftPicks: { asyncResult: true },
  loadFootballPlayers: { asyncResult: true }
});

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  return league;
}

LoadActions.loadUser.listen(function () {
  request
    .get('/api/auth/')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.user_id);
    });
});

LoadActions.loadMyLeagues.listen(function () {
  // Load all leagues for which I am a member
  request
    .get('/api/user/fantasy_leagues/')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        const parsedLeagues = _.map(res.body.fantasy_leagues, parseLeague);
        this.completed(parsedLeagues);
    });
});

LoadActions.loadFantasyPlayers.listen(function () {
  request
    .get('/api/league/1/fantasy_players/')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.fantasy_players);
    });
});

LoadActions.loadFootballPlayers.listen(function () {
  request
    .get('/api/league/1/football_players')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.football_players);
    });
});

LoadActions.loadDraftOrder.listen(function () {
  request
    .get('/api/league/1/draft_order')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.draft_order);
    });
});

LoadActions.loadDraftPicks.listen(function () {
  request
    .get('/api/league/1/draft_picks')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.draft_picks);
    });
});

export default LoadActions;

import Reflux from 'reflux';
import request from 'superagent';

const LoadActions = Reflux.createActions({
  loadUser: { asyncResult: true },
  loadLeague: { asyncResult: true },
  loadDraftOrder: { asyncResult: true },
  loadDraftPicks: { asyncResult: true },
  loadFootballPlayers: { asyncResult: true }
});

LoadActions.loadUser.listen(function () {
  request
    .get('/api/auth/')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.user_id);
    });
});

LoadActions.loadLeague.listen(function () {
  request
    .get('/api/league/1/')
    .set('Accept', 'application/json')
    .end((err, res) =>  {
        if (err) { this.failed(err); return; }
        this.completed(res.body.league);
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

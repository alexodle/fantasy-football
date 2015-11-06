import Reflux from 'reflux';
import request from 'superagent';

const LoadActions = Reflux.createActions({
  loadFootballPlayers: { asyncResult: true }
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

export default LoadActions;

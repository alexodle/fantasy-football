import _ from 'lodash';
import Reflux from 'reflux';
import request from 'superagent';
import DraftStore from '../stores/DraftStore';

const DraftActions = Reflux.createActions({
  draftPlayer: { asyncResult: true, children: ['activated'] }
});

DraftActions.draftPlayer.listen(function (pid) {
  const draftPicks = DraftStore.getState().draftPicks;
  if (!_.isArray(draftPicks)) {
    throw new Error('Cannot draft until draft picks are loaded');
  }

  const body = { football_player_id: pid, pick_number: draftPicks.length };
  this.activated(body);

  request
    .post('/api/league/1/draft_picks')
    .send({ football_player_id: pid, pick_number: draftPicks.length })
    .set('Accept', 'application/json')
    .end((err) =>  {
        if (err) { this.failed(err); return; }
        this.completed();
    });

});

export default DraftActions;

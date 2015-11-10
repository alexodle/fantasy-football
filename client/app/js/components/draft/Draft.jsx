//import _ from 'lodash';
import React from 'react';/*
import PlayerChooser from './PlayerChooser';
import AjaxComponent from '../AjaxComponent';
import FFPanel from '../FFPanel';
import DraftHistory from './DraftHistory';*/
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/actions';

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    dispatch: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadDraftOrder(1));
    dispatch(loadDraftPicks(1));
    dispatch(loadFantasyPlayers(1));
    dispatch(loadFootballPlayers(1));
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    return (
      <div>
        <h1>Here is the current state:</h1>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );

    /*const {footballPlayersStore, draftStore} = this.state;
    const {footballPlayers} = footballPlayersStore;
    const {draftPicks} = draftStore;

    // Filter out players who have already been picked
    let availableFootballPlayers = footballPlayers;
    if (!_.isEmpty(draftPicks)) {
      const draftPicksById = _.indexBy(draftPicks, 'football_player_id');
      availableFootballPlayers = _.reject(footballPlayers, function (fp) {
        return !!draftPicksById[fp.id];
      });
    }

    return (
      <div>
        <FFPanel title='Pick your player'>
          <AjaxComponent
              ChildClass={PlayerChooser}
              childClassProps={{ footballPlayers: availableFootballPlayers }}
          />
        </FFPanel>
        <FFPanel title='Draft history'>
          <AjaxComponent
              ChildClass={DraftHistory}
              childClassProps={{
                draftPicks: draftPicks,
                userLookup: userStore.userLookup
              }}
          />
        </FFPanel>
      </div>
    );*/
  }

});

function selectState(state) {
  return state;
}

export default connect(selectState)(Draft);

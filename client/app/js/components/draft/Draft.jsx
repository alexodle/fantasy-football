import _ from 'lodash';
import React, {PropTypes} from 'react';/*
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
import {hasLoaded} from '../../utils/loadingUtils';
import Loading from '../Loading';
import {ModelShapes} from '../../Constants';

const HACKHACK_LEAGUE_ID = 1;

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    availableFootballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer),
    dispatch: PropTypes.func.isRequired,
    draft: PropTypes.shape({
      picks: PropTypes.arrayOf(ModelShapes.DraftPick).isRequired,
      order: PropTypes.arrayOf(ModelShapes.DraftOrder).isRequired
    }),
    footballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer),
    loaded: PropTypes.bool.isRequired
  },

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadDraftOrder(HACKHACK_LEAGUE_ID));
    dispatch(loadDraftPicks(HACKHACK_LEAGUE_ID));
    dispatch(loadFantasyPlayers(HACKHACK_LEAGUE_ID));
    dispatch(loadFootballPlayers(HACKHACK_LEAGUE_ID));
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    if (!this.props.loaded) {
      return <Loading />;
    }

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
  const leagueMeta = state.meta.leagues[HACKHACK_LEAGUE_ID] || {};

  const loaded = (
    leagueMeta.draft &&
    hasLoaded(leagueMeta.football_players) &&
    hasLoaded(leagueMeta.draft.order) &&
    hasLoaded(leagueMeta.draft.picks)
  );

  let draft, footballPlayers, availableFootballPlayers;
  if (loaded) {
    draft = state.entities.drafts[HACKHACK_LEAGUE_ID];

    footballPlayers = _(state.entities.football_players)
      .pick(leagueMeta.football_players.items)
      .value();

    // Filter out players who have already been picked
    const availableFootballPlayerIds = _.difference(
      leagueMeta.football_players.items,
      _.pluck(draft.picks, 'football_player_id')
    );
    availableFootballPlayers = _(footballPlayers)
      .pick(availableFootballPlayerIds)
      .values()
      .value();
  }

  return {
    loaded,
    draft,
    footballPlayers,
    availableFootballPlayers
  };
}

export default connect(selectState)(Draft);

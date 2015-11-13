import _ from 'lodash';
import React, {PropTypes} from 'react';
import PlayerChooser from './PlayerChooser';
import FFPanel from '../FFPanel';
import DraftHistory from './DraftHistory';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/LoadActions';
import {draftFootballPlayer} from '../../actions/PostActions';
import {hasLoaded} from '../../utils/loadingUtils';
import Loading from '../Loading';
import {ModelShapes} from '../../Constants';
import TeamDraftView from './TeamDraftView';
import DraftStatus from './DraftStatus';

const HACKHACK_LEAGUE_ID = 1;

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    availableFootballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer),
    currentUser: ModelShapes.User,
    dispatch: PropTypes.func.isRequired,
    draft: PropTypes.shape({
      picks: PropTypes.arrayOf(ModelShapes.DraftPick).isRequired,
      order: PropTypes.arrayOf(ModelShapes.DraftOrder).isRequired
    }),
    fantasyLeague: ModelShapes.FantasyLeague,
    footballPlayers: PropTypes.objectOf(ModelShapes.FootballPlayer),
    loaded: PropTypes.bool.isRequired,
    users: PropTypes.objectOf(ModelShapes.User)
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
    const {
      availableFootballPlayers,
      currentUser,
      draft,
      fantasyLeague,
      footballPlayers,
      loaded,
      users
    } = this.props;

    let currentDraftOrder, isMyPick;
    if (loaded) {
      currentDraftOrder = draft.order[draft.picks.length];
      isMyPick = currentUser.id === currentDraftOrder.user_id;
    }

    return (
      <div>
        <FFPanel title='Draft HQ'>
          {!loaded ? <Loading /> :
            isMyPick ? (
              <PlayerChooser
                  onPick={this._onPick}
                  userLookup={users}
                  footballPlayers={availableFootballPlayers}
              />) : (
              <DraftStatus
                  currentDraftOrder={currentDraftOrder}
                  userLookup={users}
              />)
          }
        </FFPanel>

        <FFPanel title='My team'>
          {!loaded ? <Loading /> :
            <TeamDraftView
                draftPicks={draft.picks}
                fantasyLeague={fantasyLeague}
                footballPlayerLookup={footballPlayers}
                user={currentUser}
            />
          }
        </FFPanel>

        <FFPanel title='Draft history'>
          {!loaded ? <Loading /> :
            <DraftHistory
                draftPicks={draft.picks}
                userLookup={users}
                footballPlayerLookup={footballPlayers}
            />
          }
        </FFPanel>
      </div>
    );
  },

  _onPick: function (footballPlayerId) {
    this.props.dispatch(
      draftFootballPlayer(HACKHACK_LEAGUE_ID, footballPlayerId)
    );
  }

});

function selectState(state) {
  const leagueMeta = state.meta.leagues[HACKHACK_LEAGUE_ID] || {};

  const loaded = !!(
    leagueMeta.draft &&
    hasLoaded(state.meta.current_user) &&
    hasLoaded(state.meta.my_leagues) &&
    hasLoaded(leagueMeta.football_players) &&
    hasLoaded(leagueMeta.draft.order) &&
    hasLoaded(leagueMeta.draft.picks) &&
    hasLoaded(leagueMeta.fantasy_players)
  );

  let draft, footballPlayers, availableFootballPlayers, users, fantasyLeague, currentUser;
  if (loaded) {
    fantasyLeague = state.entities.fantasy_leagues[HACKHACK_LEAGUE_ID];
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

    users = state.entities.users;
    currentUser = users[state.meta.current_user.id];
  }

  return {
    availableFootballPlayers,
    currentUser,
    draft,
    fantasyLeague,
    footballPlayers,
    loaded,
    users
  };
}

export default connect(selectState)(Draft);

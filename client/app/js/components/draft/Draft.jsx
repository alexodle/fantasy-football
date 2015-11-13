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
import TeamDraftView from './TeamDraftView';
import DraftStatus from './DraftStatus';

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
      leagueId: PropTypes.string.isRequired
    }).isRequired,
    storeState: PropTypes.object.isRequired // TODO
  },

  componentWillMount() {
    const {dispatch, params} = this.props;
    const leagueId = _.parseInt(params.leagueId);

    dispatch(loadDraftOrder(leagueId));
    dispatch(loadDraftPicks(leagueId));
    dispatch(loadFantasyPlayers(leagueId));
    dispatch(loadFootballPlayers(leagueId));
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {storeState, params} = this.props;
    const leagueId = _.parseInt(params.leagueId);

    const leagueMeta = storeState.meta.leagues[leagueId] || {};

    const loaded = !!(
      leagueMeta.draft &&
      hasLoaded(storeState.meta.current_user) &&
      hasLoaded(storeState.meta.my_leagues) &&
      hasLoaded(leagueMeta.football_players) &&
      hasLoaded(leagueMeta.draft.order) &&
      hasLoaded(leagueMeta.draft.picks) &&
      hasLoaded(leagueMeta.fantasy_players)
    );

    let draft,
        footballPlayers,
        availableFootballPlayers,
        users,
        fantasyLeague,
        currentUser,
        currentDraftOrder,
        isMyPick;

    if (loaded) {
      fantasyLeague = storeState.entities.fantasy_leagues[leagueId];
      draft = storeState.entities.drafts[leagueId];

      footballPlayers = _(storeState.entities.football_players)
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

      users = storeState.entities.users;
      currentUser = users[storeState.meta.current_user.id];

      currentDraftOrder = draft.order[draft.picks.length];
      isMyPick = currentUser.id === currentDraftOrder.user_id;
    }

    return (
      <section>
        <div className='row'>
          <div className='col-md-6'>
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
          </div>
          <div className='col-md-6'>
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
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
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
        </div>
      </section>
    );
  },

  _onPick: function (footballPlayerId) {
    const {dispatch, params} = this.props;
    const leagueId = _.parseInt(params.leagueId);

    dispatch(draftFootballPlayer(leagueId, footballPlayerId));
  }

});

function selectState(state) {
  return { storeState: state };
}

export default connect(selectState)(Draft);

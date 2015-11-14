import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/LoadActions';
import {
  selectLeagueDraftOrder,
  selectLeagueDraftPicks,
  selectDraftableFootballPlayers,
  selectCurrentDraftOrder,
  selectIsMyPick
} from '../../selectors/draftSelectors';
import {
  selectLeagueUsers,
  selectFantasyLeague,
  selectCurrentUser,
  selectCurrentFantasyLeagueId,
  selectLeagueFootballPlayers
} from '../../selectors/selectors';
import React, {PropTypes} from 'react';
import PlayerChooser from './PlayerChooser';
import FFPanel from '../FFPanel';
import DraftHistory from './DraftHistory';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {draftFootballPlayer} from '../../actions/PostActions';
import Loading from '../Loading';
import TeamDraftView from './TeamDraftView';
import DraftStatus from './DraftStatus';
import {reduceEntityLoadState} from '../../selectors/selectorUtils';
import {ModelShapes} from '../../Constants';

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    allFootballPlayers: PropTypes.objectOf(ModelShapes.FootballPlayer),
    availableFootballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer),
    currentDraftOrder: ModelShapes.DraftOrder,
    currentUser: ModelShapes.User,
    dispatch: PropTypes.func.isRequired,
    draftOrder: PropTypes.arrayOf(ModelShapes.DraftOrder),
    draftPicks: PropTypes.arrayOf(ModelShapes.DraftPick),
    fantasyLeague: ModelShapes.FantasyLeague,
    isMyPick: PropTypes.bool,
    leagueId: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,
    users: PropTypes.objectOf(ModelShapes.User)
  },

  componentDidMount() {
    const {dispatch, leagueId} = this.props;
    dispatch(loadDraftOrder(leagueId));
    dispatch(loadDraftPicks(leagueId));
    dispatch(loadFantasyPlayers(leagueId));
    dispatch(loadFootballPlayers(leagueId));
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {
      allFootballPlayers,
      availableFootballPlayers,
      currentDraftOrder,
      currentUser,
      draftPicks,
      fantasyLeague,
      isMyPick,
      loaded,
      users
    } = this.props;
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
                    draftPicks={draftPicks}
                    fantasyLeague={fantasyLeague}
                    footballPlayerLookup={allFootballPlayers}
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
                    draftPicks={draftPicks}
                    userLookup={users}
                    footballPlayerLookup={allFootballPlayers}
                />
              }
            </FFPanel>
          </div>
        </div>
      </section>
    );
  },

  _onPick: function (footballPlayerId) {
    const {dispatch, leagueId} = this.props;
    dispatch(draftFootballPlayer(leagueId, footballPlayerId));
  }

});

function selectState(state) {
  var selection = {
    allFootballPlayers: selectLeagueFootballPlayers(state),
    availableFootballPlayers: selectDraftableFootballPlayers(state),
    currentDraftOrder: selectCurrentDraftOrder(state),
    currentUser: selectCurrentUser(state),
    draftOrder: selectLeagueDraftOrder(state),
    draftPicks: selectLeagueDraftPicks(state),
    fantasyLeague: selectFantasyLeague(state),
    isMyPick: selectIsMyPick(state),
    leagueId: selectCurrentFantasyLeagueId(state),
    loaded: true,
    users: selectLeagueUsers(state)
  };
  if (reduceEntityLoadState(selection)) {
    return { loaded: false, leagueId: selection.leagueId };
  }
  return selection;
}

export default connect(selectState)(Draft);

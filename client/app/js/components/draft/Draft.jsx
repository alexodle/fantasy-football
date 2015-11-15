import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/LoadActions';
import {
  selectLeagueDraftPicks,
  selectDraftableFootballPlayers,
  selectCurrentDraftOrder,
  selectIsMyPick,
  selectMyDraftPickBuckets,
  selectIneligibleDraftPositions
} from '../../selectors/draftSelectors';
import {
  selectLeagueUsers,
  selectFantasyLeague,
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
    dispatch: PropTypes.func.isRequired,
    draftPicks: PropTypes.arrayOf(ModelShapes.DraftPick),
    fantasyLeague: ModelShapes.FantasyLeague,
    ineligibleDraftPositions: PropTypes.arrayOf(PropTypes.string),
    isMyPick: PropTypes.bool,
    leagueId: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,
    myDraftPickBuckets: PropTypes.shape({
      picksByPosition: PropTypes.objectOf(PropTypes.arrayOf(ModelShapes.DraftPick)),
      bench: PropTypes.arrayOf(ModelShapes.DraftPick)
    }),
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
      draftPicks,
      fantasyLeague,
      ineligibleDraftPositions,
      isMyPick,
      loaded,
      myDraftPickBuckets,
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
                      footballPlayers={availableFootballPlayers}
                      ineligibleDraftPositions={ineligibleDraftPositions}
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
                    draftPickBuckets={myDraftPickBuckets}
                    footballPlayerLookup={allFootballPlayers}
                    league={fantasyLeague}
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
    ineligibleDraftPositions: selectIneligibleDraftPositions(state),
    currentDraftOrder: selectCurrentDraftOrder(state),
    draftPicks: selectLeagueDraftPicks(state),
    fantasyLeague: selectFantasyLeague(state),
    isMyPick: selectIsMyPick(state),
    leagueId: selectCurrentFantasyLeagueId(state),
    loaded: true,
    myDraftPickBuckets: selectMyDraftPickBuckets(state),
    users: selectLeagueUsers(state)
  };
  if (reduceEntityLoadState(selection)) {
    return { loaded: false, leagueId: selection.leagueId };
  }
  return selection;
}

export default connect(selectState)(Draft);

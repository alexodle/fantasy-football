import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFantasyTeams,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/LoadActions';
import {
  selectCurrentDraftOrder,
  selectDraftableFootballPlayers,
  selectIneligibleDraftPositions,
  selectIsMyPick,
  selectLeagueDraftOrder,
  selectLeagueDraftPicks,
  selectMaxBenchSize,
  selectMyDraftPickBuckets
} from '../../selectors/draftSelectors';
import {
  selectCurrentFantasyLeagueId,
  selectFantasyLeague,
  selectLeagueFootballPlayers,
  selectLeagueUsers
} from '../../selectors/selectors';
import DraftHistory from './DraftHistory';
import DraftOrderView from './DraftOrderView';
import DraftStatus from './DraftStatus';
import FFPanel from '../FFPanel';
import Loading from '../Loading';
import PlayerChooser from './PlayerChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import TeamDraftView from './TeamDraftView';
import {connect} from 'react-redux';
import {draftFootballPlayer} from '../../actions/PostActions';
import {ModelShapes} from '../../Constants';
import {reduceEntityLoadState} from '../../selectors/selectorUtils';

const Draft = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    allFootballPlayers: PropTypes.objectOf(ModelShapes.FootballPlayer),
    availableFootballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer),
    currentDraftOrder: ModelShapes.DraftOrder,
    dispatch: PropTypes.func.isRequired,
    draftOrder: PropTypes.arrayOf(ModelShapes.DraftOrder),
    draftPicks: PropTypes.arrayOf(ModelShapes.DraftPick),
    fantasyLeague: ModelShapes.FantasyLeague,
    ineligibleDraftPositions: PropTypes.arrayOf(PropTypes.string),
    isMyPick: PropTypes.bool,
    leagueId: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,
    maxBenchSize: PropTypes.number,
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
    dispatch(loadFantasyTeams(leagueId));
    dispatch(loadFootballPlayers(leagueId));
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {
      allFootballPlayers,
      availableFootballPlayers,
      currentDraftOrder,
      draftOrder,
      draftPicks,
      fantasyLeague,
      ineligibleDraftPositions,
      isMyPick,
      loaded,
      maxBenchSize,
      myDraftPickBuckets,
      users
    } = this.props;
    return (
      <section>
        <div className='row'>
          <div className='col-md-12'>
            <FFPanel title='Draft order'>
              {!loaded ? <Loading /> :
                <DraftOrderView
                    currentDraftOrder={currentDraftOrder}
                    draftOrder={draftOrder}
                    userLookup={users}
                />
              }
            </FFPanel>
          </div>
        </div>

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
                    maxBenchSize={maxBenchSize}
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
    draftOrder: selectLeagueDraftOrder(state),
    fantasyLeague: selectFantasyLeague(state),
    isMyPick: selectIsMyPick(state),
    leagueId: selectCurrentFantasyLeagueId(state),
    loaded: true,
    maxBenchSize: selectMaxBenchSize(state),
    myDraftPickBuckets: selectMyDraftPickBuckets(state),
    users: selectLeagueUsers(state)
  };
  if (reduceEntityLoadState(selection)) {
    return { loaded: false, leagueId: selection.leagueId };
  }
  return selection;
}

export default connect(selectState)(Draft);

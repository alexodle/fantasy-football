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
  selectIsMyPick,
  selectMaxBenchSize,
  selectMyDraftPickBuckets
} from '../../selectors/draftSelectors';
import {
  selectCurrentFantasyLeagueId,
  selectFantasyLeague,
  selectLeagueFootballPlayers
} from '../../selectors/selectors';
import DraftHistory, {draftHistorySelector} from './DraftHistory';
import DraftOrderView, {draftOrderViewSelector} from './DraftOrderView';
import DraftStatus, {draftStatusSelector} from './DraftStatus';
import FFPanel from '../FFPanel';
import Loading from '../Loading';
import PlayerChooser, {playerChooserSelector} from './PlayerChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import TeamDraftView from './TeamDraftView';
import {connect} from 'react-redux';
import {draftFootballPlayer} from '../../actions/PostActions';
import {ModelShapes} from '../../Constants';
import {reduceEntityLoadState} from '../../selectors/selectorUtils';

const Draft = React.createClass({

  displayName: 'Draft',

  mixins: [PureRenderMixin],

  propTypes: {
    allFootballPlayers: PropTypes.objectOf(ModelShapes.FootballPlayer),
    dispatch: PropTypes.func.isRequired,
    draftHistoryProps: PropTypes.any.isRequired,
    draftOrderViewProps: PropTypes.any.isRequired,
    draftStatusProps: PropTypes.any.isRequired,
    fantasyLeague: ModelShapes.FantasyLeague,
    isMyPick: PropTypes.bool,
    leagueId: PropTypes.number.isRequired,
    loaded: PropTypes.bool.isRequired,
    maxBenchSize: PropTypes.number,
    myDraftPickBuckets: PropTypes.shape({
      picksByPosition: PropTypes.objectOf(PropTypes.arrayOf(ModelShapes.DraftPick)),
      bench: PropTypes.arrayOf(ModelShapes.DraftPick)
    }),
    playerChooserProps: PropTypes.any.isRequired
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
      draftHistoryProps,
      draftOrderViewProps,
      draftStatusProps,
      fantasyLeague,
      isMyPick,
      loaded,
      maxBenchSize,
      myDraftPickBuckets,
      playerChooserProps
    } = this.props;
    return (
      <section>
        <div className='row'>
          <div className='col-md-12'>
            <FFPanel title='Draft order'>
              {!loaded ? <Loading /> :
                <DraftOrderView {...draftOrderViewProps} />
              }
            </FFPanel>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6'>
            <FFPanel title='Draft HQ'>
              {!loaded ? <Loading /> :
                isMyPick ? (
                  <PlayerChooser {...playerChooserProps} onPick={this._onPick} />
                ) : (
                  <DraftStatus {...draftStatusProps} />
                )
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
                <DraftHistory {...draftHistoryProps} />
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
    draftHistoryProps: draftHistorySelector(state),
    draftOrderViewProps: draftOrderViewSelector(state),
    draftStatusProps: draftStatusSelector(state),
    fantasyLeague: selectFantasyLeague(state),
    isMyPick: selectIsMyPick(state),
    leagueId: selectCurrentFantasyLeagueId(state),
    loaded: true,
    maxBenchSize: selectMaxBenchSize(state),
    myDraftPickBuckets: selectMyDraftPickBuckets(state),
    playerChooserProps: playerChooserSelector(state)
  };
  if (reduceEntityLoadState(selection)) {
    return { loaded: false, leagueId: selection.leagueId };
  }
  return selection;
}

export default connect(selectState)(Draft);

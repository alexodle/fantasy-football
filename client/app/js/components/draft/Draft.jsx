import {
  loadDraftOrder,
  loadDraftPicks,
  loadFantasyPlayers,
  loadFantasyTeams,
  loadFootballPlayers,
  loadMyLeagues,
  loadUser
} from '../../actions/LoadActions';
import DraftHistory, {draftHistorySelector} from './DraftHistory';
import DraftOrderView, {draftOrderViewSelector} from './DraftOrderView';
import DraftStatus, {draftStatusSelector} from './DraftStatus';
import FFPanel from '../FFPanel';
import Loading from '../Loading';
import PlayerChooser, {playerChooserSelector} from './PlayerChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import TeamDraftView, {teamDraftViewSelector} from './TeamDraftView';
import {connect} from 'react-redux';
import {draftFootballPlayer} from '../../actions/PostActions';
import {createFFComponentSelector} from '../../selectors/selectorUtils';
import {selectCurrentFantasyLeagueId} from '../../selectors/selectors';
import {selectIsMyPick} from '../../selectors/draftSelectors';

const Draft = React.createClass({

  displayName: 'Draft',

  mixins: [PureRenderMixin],

  propTypes: {
    dispatch: PropTypes.func.isRequired,
    draftHistoryProps: PropTypes.any,
    draftOrderViewProps: PropTypes.any,
    draftStatusProps: PropTypes.any,
    isMyPick: PropTypes.bool,
    leagueId: PropTypes.number.isRequired,
    loadState: PropTypes.bool.isRequired,
    playerChooserProps: PropTypes.any,
    teamDraftViewProps: PropTypes.any
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
      draftHistoryProps,
      draftOrderViewProps,
      draftStatusProps,
      isMyPick,
      loadState,
      playerChooserProps,
      teamDraftViewProps
    } = this.props;

    // TODO: distinguish between failed and loading loadState
    const loaded = !loadState;
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
                <TeamDraftView {...teamDraftViewProps} />
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

const selector = createFFComponentSelector({
  draftHistoryProps: draftHistorySelector,
  draftOrderViewProps: draftOrderViewSelector,
  draftStatusProps: draftStatusSelector,
  isMyPick: selectIsMyPick,
  leagueId: selectCurrentFantasyLeagueId,
  playerChooserProps: playerChooserSelector,
  teamDraftViewProps: teamDraftViewSelector
});

export default connect(selector)(Draft);

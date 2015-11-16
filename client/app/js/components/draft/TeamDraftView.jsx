import _ from 'lodash';
import React, {PropTypes} from 'react';
import {createFFSelector} from '../../selectors/selectorUtils';
import {ModelShapes, PositionDisplayOrder} from '../../Constants';
import {selectLeagueFootballPlayers, selectFantasyLeague, selectMaxBenchSize} from '../../selectors/selectors';
import {selectMyDraftPickBuckets} from '../../selectors/draftSelectors';

const POSITION_WIDTH='20%';
const PLAYER_WIDTH='60%';
const PICK_WIDTH='20%';

export const teamDraftViewSelector = createFFSelector({
  selectors: [
    selectMyDraftPickBuckets,
    selectLeagueFootballPlayers,
    selectFantasyLeague,
    selectMaxBenchSize
  ],
  selector: function (myDraftPickBuckets, leagueFootballPlayers, fantasyLeague, maxBenchSize) {
    return {
      draftPickBuckets: myDraftPickBuckets,
      footballPlayerLookup: leagueFootballPlayers,
      league: fantasyLeague,
      maxBenchSize
    };
  }
});

export default React.createClass({

  displayName: 'TeamDraftView',

  propTypes: {
    draftPickBuckets: PropTypes.shape({
      picksByPosition: PropTypes.objectOf(PropTypes.arrayOf(ModelShapes.DraftPick)).isRequired,
      bench: PropTypes.arrayOf(ModelShapes.DraftPick).isRequired
    }).isRequired,
    footballPlayerLookup: PropTypes.objectOf(ModelShapes.FootballPlayer).isRequired,
    league: ModelShapes.FantasyLeague.isRequired,
    maxBenchSize: PropTypes.number.isRequired
  },

  render() {
    const {draftPickBuckets, footballPlayerLookup, league, maxBenchSize} = this.props;
    const {picksByPosition, bench} = draftPickBuckets;
    const {team_reqs} = league.rules;

    return (
      <div>
        <table className='table table-condensed'>
          <caption>Starters</caption>
          <thead>
            <tr>
              <th style={{width: POSITION_WIDTH}}>Position</th>
              <th style={{width: PLAYER_WIDTH}}>Player</th>
              <th style={{width: PICK_WIDTH}}>Pick #</th>
            </tr>
          </thead>
          <tbody>
            {_.map(PositionDisplayOrder, function (p) {
              const positionPicks = picksByPosition[p] || [];
              return _.times(team_reqs[p], function (i) {
                const pick = positionPicks[i];
                const footballPlayer = pick && footballPlayerLookup[pick.football_player_id];
                return (
                  <tr key={p + i}>
                    <td>{p}</td>
                    <td>{footballPlayer && footballPlayer.name}</td>
                    <td>{pick && pick.pick_number + 1}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
        <table className='table table-condensed'>
          <caption>Bench</caption>
          <tbody>
            {_.times(maxBenchSize, function (i) {
              const pick = bench[i];
              if (pick) {
                const footballPlayer = footballPlayerLookup[pick.football_player_id];
                return (
                  <tr key={i}>
                    <td style={{width: POSITION_WIDTH}}>{footballPlayer.position}</td>
                    <td style={{width: PLAYER_WIDTH}}>{footballPlayer.name}</td>
                    <td style={{width: PICK_WIDTH}}>{pick.pick_number + 1}</td>
                  </tr>
                );
              } else {
                return (
                  <tr key={i}>
                    <td style={{width: POSITION_WIDTH}}>&nbsp;</td>
                    <td style={{width: PLAYER_WIDTH}}>&nbsp;</td>
                    <td style={{width: PICK_WIDTH}}>&nbsp;</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }

});

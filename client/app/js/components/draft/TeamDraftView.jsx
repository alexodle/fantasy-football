import _ from 'lodash';
import React, {PropTypes} from 'react';
import {ModelShapes, PositionDisplayOrder} from '../../Constants';

const POSITION_WIDTH='20%';
const PLAYER_WIDTH='60%';
const PICK_WIDTH='20%';

export default React.createClass({

  displayName: 'TeamDraftView',

  propTypes: {
    draftPickBuckets: PropTypes.shape({
      picksByPosition: PropTypes.objectOf(PropTypes.arrayOf(ModelShapes.DraftPick)),
      bench: PropTypes.arrayOf(ModelShapes.DraftPick)
    }),
    footballPlayerLookup: PropTypes.objectOf(ModelShapes.FootballPlayer).isRequired,
    league: ModelShapes.FantasyLeague
  },

  render() {
    const {draftPickBuckets, footballPlayerLookup, league} = this.props;
    const {picksByPosition, bench} = draftPickBuckets;
    const {team_reqs} = league.rules;

    /*// Ensure we draft positions of need if we're running out of picks
    const nPlayersNeeded = max_team_size - bench.length;
    const nPicksLeft = max_team_size - myPicks.length;
    if (nPicksLeft === nPlayersNeeded) {
      myPicksByPosition = _.pick(myPicksByPosition, function (picks, p) {
        return picks.length < team_reqs[p];
      });
    }*/

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
            {_.map(bench, function (pick) {
              const footballPlayer = footballPlayerLookup[pick.football_player_id];
              return (
                <tr key={pick.pick_number}>
                  <td style={{width: POSITION_WIDTH}}>{footballPlayer.position}</td>
                  <td style={{width: PLAYER_WIDTH}}>{footballPlayer.name}</td>
                  <td style={{width: PICK_WIDTH}}>{pick.pick_number + 1}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

});

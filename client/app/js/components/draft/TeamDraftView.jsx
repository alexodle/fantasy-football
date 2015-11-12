import _ from 'lodash';
import React from 'react';
import {ModelShapes, PositionDisplayOrder} from '../../Constants';

const POSITION_WIDTH='20%';
const PLAYER_WIDTH='60%';
const PICK_WIDTH='20%';

export default React.createClass({

  propTypes: {
    draftPicks: React.PropTypes.arrayOf(ModelShapes.DraftPick).isRequired,
    fantasyLeague: ModelShapes.FantasyLeague.isRequired,
    footballPlayerLookup: React.PropTypes.objectOf(ModelShapes.FootballPlayer).isRequired,
    user: ModelShapes.User.isRequired
  },

  render() {
    const {draftPicks, fantasyLeague, user, footballPlayerLookup} = this.props;
    const teamReqs = fantasyLeague.team_reqs;

    const myPicksByPosition = _(draftPicks)
      .where({ user_id: user.id })
      .groupBy(function (dp) {
        return footballPlayerLookup[dp.football_player_id].position;
      })
      .value();

    const bench = _(myPicksByPosition)
      .map(function (picks, p) {
        return _.drop(picks, teamReqs[p]);
      })
      .flatten()
      .sortBy('pick_number')
      .value();

    return (
      <div>
        <table className='table'>
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
              const positionPicks = myPicksByPosition[p] || [];
              return _.times(teamReqs[p], function (i) {
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
        <table className='table'>
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

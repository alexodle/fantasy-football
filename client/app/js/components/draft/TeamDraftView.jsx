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
    const {team_reqs, max_team_size} = fantasyLeague.rules;

    const myPicks = _.where(draftPicks, { user_id: user.id });

    let bench = [];
    let myPicksByPosition = _(myPicks)
      .groupBy(function (dp) {
        return footballPlayerLookup[dp.football_player_id].position;
      })

      // Shove excess players onto the bench
      .map(function (picks, p) {
        const nAllowed = team_reqs[p];
        bench.push.apply(bench, _.drop(picks, nAllowed));
        return _.take(picks, nAllowed);
      })
      .value();
    bench = _.sortBy(bench, 'pick_number');

    // Ensure we draft positions of need if we're running out of picks
    const nPlayersNeeded = max_team_size - bench.length;
    const nPicksLeft = max_team_size - myPicks.length;
    if (nPicksLeft === nPlayersNeeded) {
      myPicksByPosition = _.pick(myPicksByPosition, function (picks, p) {
        return picks.length < team_reqs[p];
      });
    }

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
              const positionPicks = myPicksByPosition[p] || [];
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

import _ from 'lodash';
import React from 'react';
import {ModelShapes, PositionDisplayOrder} from '../../Constants';

// TODO: bench position

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

    return (
      <table className='table'>
        <tbody>
          {_.map(PositionDisplayOrder, function (p) {
            const positionPicks = myPicksByPosition[p] || [];
            return _.times(teamReqs[p], function (i) {
              const pick = positionPicks[i] || {};
              const footballPlayer = footballPlayerLookup[pick.football_player_id] || {};
              return (
                <tr key={p + i}>
                  <td>{p}</td><td>{footballPlayer.name}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    );
  }

});

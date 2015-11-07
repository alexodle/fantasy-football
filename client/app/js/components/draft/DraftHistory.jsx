import _ from 'lodash';
import React from 'react';
import {ModelShapes} from '../../Constants';
import FootballPlayerStore from '../../stores/FootballPlayerStore';

const DraftHistory = React.createClass({

  propTypes: {
    draftPicks: React.PropTypes.arrayOf(ModelShapes.DraftPick).isRequired
  },

  render() {
    const {draftPicks} = this.props;
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>#</th><th>User</th><th>Player</th><th>Position</th>
          </tr>
        </thead>
        <tbody>
          {_.map(draftPicks, function (dp) {
            const footballPlayer = FootballPlayerStore.getPlayerById(dp.football_player_id);
            return (
              <tr key={dp.pick_number}>
                <td>{dp.pick_number}</td>
                <td>{dp.user_id}</td>
                <td>{footballPlayer.name}</td>
                <td>{footballPlayer.position}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

});

export default DraftHistory;

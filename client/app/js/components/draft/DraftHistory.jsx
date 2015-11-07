import _ from 'lodash';
import React from 'react';
import {ModelShapes} from '../../Constants';

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
            return (
              <tr key={dp.pick_number}>
                <td>{dp.pick_number}</td>
                <td>{dp.user_id}</td>
                <td>{dp.football_player_id}</td>
                <td>TODO</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

});

export default DraftHistory;

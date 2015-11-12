import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {ModelShapes} from '../../Constants';

const DraftHistory = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    draftPicks: React.PropTypes.arrayOf(ModelShapes.DraftPick).isRequired,
    footballPlayerLookup: React.PropTypes.objectOf(ModelShapes.FootballPlayer).isRequired,
    userLookup: React.PropTypes.objectOf(ModelShapes.User).isRequired
  },

  render() {
    const {draftPicks, footballPlayerLookup, userLookup} = this.props;

    const reverseDraftPicks = _(draftPicks)
      .sortBy('pick_number')
      .reverse()
      .value();
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>#</th><th>User</th><th>Player</th><th>Position</th>
          </tr>
        </thead>
        <tbody>
          {_.map(reverseDraftPicks, function (dp) {
            const footballPlayer = footballPlayerLookup[dp.football_player_id];
            const user = userLookup[dp.user_id];
            return (
              <tr key={dp.pick_number}>
                <td>{dp.pick_number + 1}</td>
                <td>{user.name}</td>
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

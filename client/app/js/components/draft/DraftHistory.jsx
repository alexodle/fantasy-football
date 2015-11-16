import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import {createFFSelector} from '../../selectors/selectorUtils';
import {ModelShapes} from '../../Constants';
import {selectLeagueUsers, selectLeagueFootballPlayers} from '../../selectors/selectors';
import {selectLeagueDraftPicks} from '../../selectors/draftSelectors';

export const draftHistorySelector = createFFSelector({
  selectors: [selectLeagueDraftPicks, selectLeagueUsers, selectLeagueFootballPlayers],
  selector: function (leagueDraftPicks, leagueUsers, leagueFootballPlayers) {
    return {
      draftPicks: leagueDraftPicks,
      userLookup: leagueUsers,
      footballPlayerLookup: leagueFootballPlayers
    };
  }
});

export default React.createClass({

  displayName: 'DraftHistory',

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
      <table className='table table-condensed'>
        <thead>
          <tr>
            <th>#</th><th>Team</th><th>Player</th><th>Position</th>
          </tr>
        </thead>
        <tbody>
          {_.map(reverseDraftPicks, function (dp) {
            const footballPlayer = footballPlayerLookup[dp.football_player_id];
            const user = userLookup[dp.user_id];
            return (
              <tr key={dp.pick_number}>
                <td>{dp.pick_number + 1}</td>
                <td>{user.team.name}</td>
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

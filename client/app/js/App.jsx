import _ from 'lodash';
import Actions from './actions/Actions';
import AjaxComponent from './components/AjaxComponent';
import FootballPlayerStore from './stores/FootballPlayerStore';
import React from 'react';
import Reflux from 'reflux';

const POSITON_DISPLAY_ORDER = ['QB', 'RB', 'WR', 'TE', 'K']

const App = React.createClass({

  mixins: [
    Reflux.connect(FootballPlayerStore, 'footballPlayers')
  ],

  render() {
    const {footballPlayers} = this.state;
    const playersByPosition = _.groupBy(footballPlayers.footballPlayers, 'position');
    return (
      <div>
        <AjaxComponent loadingState={footballPlayers.footballPlayers}>
          <div>
            {_.map(POSITON_DISPLAY_ORDER, function (pos) {
              const positonPlayers = _.sortBy(playersByPosition[pos], 'name');
              return (
                <div key={pos}>
                  <h2>{pos}s</h2>
                  {_.map(positonPlayers, function (fp) {
                    return (<span key={fp.id}>{fp.name}<br /></span>);
                  })}
                </div>
              );
            })}
          </div>
        </AjaxComponent>
      </div>
    );
  },

  onClick() {
    Actions.sayHello();
  }

});

export default App;

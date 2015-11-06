import _ from 'lodash';
import Actions from './actions/Actions';
import AjaxComponent from './components/AjaxComponent';
import FootballPlayerStore from './stores/FootballPlayerStore';
import LoadActions from './actions/LoadActions';
import RaisedButton from 'material-ui/lib/raised-button';
import React from 'react';
import Reflux from 'reflux';
import {Tab, Tabs} from 'material-ui/lib/tabs';

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
        <h1>Players</h1>
        <RaisedButton label="Refresh Players" primary={true} onClick={this.refreshPlayers} /><br /><br />
        <AjaxComponent loadingState={footballPlayers.footballPlayers}>
          <Tabs>
            {_.map(POSITON_DISPLAY_ORDER, function (pos) {
              const positonPlayers = _.sortBy(playersByPosition[pos], 'name');
              return (
                <Tab key={pos} label={pos}>
                  {_.map(positonPlayers, function (fp) {
                    return (<span key={fp.id}>{fp.name}<br /></span>);
                  })}
                </Tab>
              );
            })}
          </Tabs>
        </AjaxComponent>
      </div>
    );
  },

  onClick() {
    Actions.sayHello();
  },

  refreshPlayers() {
    LoadActions.loadFootballPlayers();
  }

});

export default App;

import _ from 'lodash';
import Actions from './actions/Actions';
import AjaxComponent from './components/AjaxComponent';
import FootballPlayerStore from './stores/FootballPlayerStore';
import HelloWorldStore from './stores/HelloWorldStore';
import React from 'react';
import Reflux from 'reflux';

const POSITON_DISPLAY_ORDER = ['QB', 'RB', 'WR', 'TE', 'K']

const App = React.createClass({

  mixins: [
    Reflux.connect(HelloWorldStore, 'helloWorld'),
    Reflux.connect(FootballPlayerStore, 'footballPlayers')
  ],

  render() {
    const {helloWorld, footballPlayers} = this.state;
    const playersByPosition = _.groupBy(footballPlayers.footballPlayers, 'position');
    return (
      <div>
        <p>Text: {helloWorld.text}</p>
        <p><button type='button' onClick={this.onClick}>Say hello</button></p>
        <br/>
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

import _ from 'lodash';
import Actions from './actions/Actions';
import AjaxComponent from './components/AjaxComponent';
import FootballPlayerStore from './stores/FootballPlayerStore';
import HelloWorldStore from './stores/HelloWorldStore';
import React from 'react';
import Reflux from 'reflux';

const App = React.createClass({

  mixins: [
    Reflux.connect(HelloWorldStore, 'helloWorld'),
    Reflux.connect(FootballPlayerStore, 'footballPlayers')
  ],

  render() {
    const {helloWorld, footballPlayers} = this.state;
    return (
      <div>
        <p>Text: {helloWorld.text}</p>
        <p><button type='button' onClick={this.onClick}>Say hello</button></p>
        <br/>
        <AjaxComponent loadingState={footballPlayers.footballPlayers}>
          <ul>
            {_.map(footballPlayers.footballPlayers, function (fp) {
              return (<li key={fp.id}>{fp.name} - {fp.position}</li>);
            })}
          </ul>
        </AjaxComponent>
      </div>
    );
  },

  onClick() {
    Actions.sayHello();
  }

});

export default App;

import Actions from './actions/Actions';
import HelloWorldStore from './stores/HelloWorldStore';
import React from 'react';
import Reflux from 'reflux';

const App = React.createClass({

  mixins: [Reflux.connect(HelloWorldStore)],

  render() {
    return (
      <div>
        <p>Text: {this.state.text}</p>
        <p><button type='button' onClick={this.onClick}>Say hello</button></p>
      </div>
    );
  },

  onClick() {
    Actions.sayHello();
  }

});

export default App;

import Actions from '../actions/Actions';
import Reflux from 'reflux';

const TEMP_PLAYERS = [
  { id: 1, name: "Football Player A", position: "QB", football_team_id: 1 }
];

let state = {
  index: 0
};

function getVisibleState() {
  return {
    text: TEXTS[state.index % TEXTS.length]
  };
}

const HelloWorldStore = Reflux.createStore({
  listenables: Actions,

  getInitialState() {
    return getVisibleState();
  },

  onSayHello() {
    state.index++;
    this.trigger(getVisibleState());
  }

});

export default HelloWorldStore;

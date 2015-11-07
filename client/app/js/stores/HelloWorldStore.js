import Actions from '../actions/Actions';
import Reflux from 'reflux';

const TEXTS = [
  "Hello World!",
  "Hi world!",
  "Hi guy!",
  "Hey you!"
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

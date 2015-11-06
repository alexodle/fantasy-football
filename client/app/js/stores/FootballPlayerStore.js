import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadMixin from '../utils/DelayLoadMixin';

let state = {
  footballPlayers: LoadingStates.NOT_LOADED
};

const FootballPlayerStore = Reflux.createStore({

  mixins: [DelayLoadMixin.create(state, 'footballPlayers', LoadActions, 'loadFootballPlayers')],

  listenables: LoadActions

});

export default FootballPlayerStore;

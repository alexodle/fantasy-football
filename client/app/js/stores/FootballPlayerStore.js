import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

let state = {
  footballPlayers: LoadingStates.NOT_LOADED
};

const FootballPlayerStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(
      state, 'footballPlayers',
      LoadActions, 'loadFootballPlayers'
    )
  ],

  listenables: LoadActions

});

export default FootballPlayerStore;

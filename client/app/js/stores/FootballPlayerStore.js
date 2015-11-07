import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

const state = {
  footballPlayers: LoadingStates.NOT_LOADED
};

const FootballPlayerStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(
      state, 'footballPlayers', LoadActions.loadFootballPlayers
    )
  ]

});

export default FootballPlayerStore;

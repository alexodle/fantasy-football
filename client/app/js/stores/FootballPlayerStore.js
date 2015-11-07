import _ from 'lodash';
import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

const state = {
  footballPlayers: LoadingStates.NOT_LOADED
};

let indexedPlayers = null;

const FootballPlayerStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(state, {
      stateKey: 'footballPlayers',
      action: LoadActions.loadFootballPlayers,
      onComplete: 'onLoadFootballPlayersCompleted'
    })
  ],

  onLoadFootballPlayersCompleted(footballPlayers) {
    indexedPlayers = _.indexBy(footballPlayers, 'id');
  },

  getPlayerById(id) {
    return indexedPlayers[id];
  }

});

export default FootballPlayerStore;

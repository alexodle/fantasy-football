import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

const state = {
  league: LoadingStates.NOT_LOADED
};

const FootballPlayerStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(state, 'draftPicks', LoadActions.loadLeague)
  ],

  listenables: LoadActions,

  getState() {
    return state;
  }

});

export default FootballPlayerStore;

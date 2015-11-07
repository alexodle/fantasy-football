import LoadActions from '../actions/LoadActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

const state = {
  user: LoadingStates.NOT_LOADED
};

const UserStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(state, 'user', LoadActions.loadUser)
  ],

  getState() {
    return state;
  }

});

export default UserStore;

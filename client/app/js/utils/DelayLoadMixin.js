import _ from 'lodash';
import {LoadingStates} from '../Constants';

export default {

  create(state, stateKey, actions, loadActionName) {

    const capitalizedActionName = _.capitalize(loadActionName);

    return {

      getInitialState() {
        if (state[stateKey] === LoadingStates.NOT_LOADED) {
          state[stateKey] = LoadingStates.LOADING;
          actions[loadActionName]();
        }
        return state;
      },

      [`on${capitalizedActionName}Completed`](value) {
        state[stateKey] = value;
        this.trigger(state);
      },

      [`on${capitalizedActionName}Failed`]() {
        state.footballPlayers = LoadingStates.LOAD_FAILED;
        this.trigger(state);
      }

    };

  }

};

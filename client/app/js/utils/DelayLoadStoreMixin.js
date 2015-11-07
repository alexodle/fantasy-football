import _ from 'lodash';
import {LoadingStates} from '../Constants';

function ensureLoaded(state, stateKey, action) {
  if (state[stateKey] === LoadingStates.NOT_LOADED) {
    state[stateKey] = LoadingStates.LOADING;
    action();
  }
  return state;
}

function listenTo(that, state, stateKey, action) {
  that.listenTo(action.completed, function (value) {
    state[stateKey] = value;
    that.trigger(state);
  });
  that.listenTo(action.failed, function () {
    state[stateKey] = LoadingStates.LOAD_FAILED;
    that.trigger(state);
  });
}

function create(state, stateKey, action) {
  return _.extend({

    init() {
      listenTo(this, state, stateKey, action);
    },

    ensureLoaded() {
      ensureLoaded(state, stateKey, action);
    },

    getInitialState() {
      this.ensureLoaded();
      return state;
    }

  });
}

export default {

  createMany(state, specs) {
    const mixins = _.map(specs, function ([stateKey, action]) {
      return create(state, stateKey, action);
    });

    return {
      init() {
        _.each(mixins, (impl) => impl.init.call(this));
      },

      ensureLoaded() {
        _.each(mixins, (impl) => impl.ensureLoaded.call(this));
      },

      getInitialState() {
        // Initialize fetch
        this.ensureLoaded();
        return state;
      }

    };
  },

  create: create

};

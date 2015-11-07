import _ from 'lodash';
import {LoadingStates} from '../Constants';

function ensureLoaded(state, stateKey, action) {
  if (state[stateKey] === LoadingStates.NOT_LOADED) {
    state[stateKey] = LoadingStates.LOADING;
    action();
  }
  return state;
}

function listenTo(that, state, stateKey, action, onComplete, onFailed) {
  that.listenTo(action.completed, function (value) {
    state[stateKey] = value;

    if (onComplete) {
      that[onComplete](value);
    }

    that.trigger(state);
  });
  that.listenTo(action.failed, function () {
    state[stateKey] = LoadingStates.LOAD_FAILED;

    if (onFailed) {
      that[onFailed]();
    }

    that.trigger(state);
  });
}

function create(state, {stateKey, action, onComplete, onFailed}) {
  return _.extend({

    init() {
      listenTo(this, state, stateKey, action, onComplete, onFailed);
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

function createMany(state, specs) {
  const mixins = _.map(specs, function (spec) {
    return create(state, spec);
  });

  return {
    init() {
      _.each(mixins, (impl) => impl.init.call(this));
    },

    ensureLoaded() {
      _.each(mixins, (impl) => impl.ensureLoaded.call(this));
    },

    getInitialState() {
      this.ensureLoaded();
      return state;
    }

  };
}

export default {

  create(state, specOrSpecs) {
    if (_.isArray(specOrSpecs)) {
      return createMany(state, specOrSpecs);
    } else {
      return create(state, specOrSpecs);
    }
  }

};

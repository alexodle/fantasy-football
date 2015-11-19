import _ from 'lodash';
import {hasLoaded, hasFailed} from '../utils/loadingUtils';
import {IS_LOADING, FAILED_LOADING} from '../Constants';
import {createSelector} from 'reselect';

/**
 * Fills in the given state map, and includes a 'loadState' property with either
 * false, IS_LOADING, or FAILED_LOADING. false indicates that everything has
 * loaded.
 */
export function createFFComponentSelector(stateMap) {
  return function (state) {
    let selection = _.mapValues(stateMap, function (v) {
      if (_.isFunction(v)) {
        return v(state);
      }
      return v;
    });

    // Reduce all load states down to the most significant
    const loadState = reduceEntityLoadState(selection);

    // Remove all load state values from the selection. That way components
    // don't have to handle load state strings in their propTypes.
    selection = _(selection)
      .omit(isLoadState)
      .mapValues(function (v) {
        if (v && _.isFunction(v.toJS)) {
          return v.toJS();
        }
        return v;
      })
      .value();

    // Include the loadState so components have a single property to decide what
    // to do
    selection.loadState = loadState;

    return selection;
  };
}

/**
 * Wraps reselect's createSelector function. Adds functionality to safely handle
 * load states. If a single entity hasn't loaded, the return value will simply
 * be the most significant load state of all the selectors. FAILED_LOADING is
 * more significant than IS_LOADING.
 *
 * In order to calculate the loading state, all meta selectors need to be
 * separated from entity selectors.
 */
export function createFFSelector({metaSelectors = [], selectors = [], selector}) {
  const wrappedHandler = ensureLoaded(metaSelectors.length, selectors.length, selector);
  return createSelector(metaSelectors.concat(selectors), wrappedHandler);
}

/**
 * Reduces a set of possible load states down to it's most signficant load
 * state. FAILED_LOADING is more significant than IS_LOADING. If there are no
 * load states, returns false.
 */
export function reduceEntityLoadState(possibleLoadStates) {
  let loadState = false;

  _.forEach(possibleLoadStates, function (testLoadState) {
    switch (testLoadState) {
      case IS_LOADING:
        loadState = IS_LOADING;
        break;
      case FAILED_LOADING:
        loadState = FAILED_LOADING;
        return false; // exit loop
    }
  });

  return loadState;
}

/**
 * Determines whether or not any of the given meta objects refer to a loading
 * object. If so, returns the most significant load state. FAILED_LOADING is
 * more significant than IS_LOADING.
 */
function reduceMetaLoadState(metas) {
  let loadState = false;

  _.forEach(metas, function (metaValue) {
    let testLoadState = calcMetaLoadState(metaValue);
    switch (testLoadState) {
      case IS_LOADING:
        loadState = IS_LOADING;
        break;
      case FAILED_LOADING:
        loadState = FAILED_LOADING;
        return false; // exit loop
    }
  });

  return loadState;
}

function reduceLoadState(metaLength, selectorLength, params) {
  const metaLoadState = reduceMetaLoadState(_.take(params, metaLength));
  if (metaLoadState === FAILED_LOADING) return metaLoadState;

  const entityLoadState = reduceEntityLoadState(_.takeRight(params, selectorLength));
  if (entityLoadState === FAILED_LOADING) return entityLoadState;

  if (metaLoadState === IS_LOADING) return metaLoadState;
  if (entityLoadState === IS_LOADING) return entityLoadState;

  return false;
}

function ensureLoaded(metaLength, selectorLength, selector) {
  return function (...params) {
    const loadState = reduceLoadState(metaLength, selectorLength, params);
    if (loadState) return loadState;

    return selector(...params);
  };
}

/**
 * Returns a IS_LOADING, FAILED_LOADING for the given meta. If the given meta is
 * not loading, returns false.
 */
function calcMetaLoadState(meta) {
  if (hasFailed(meta)) {
    return FAILED_LOADING;
  } else if (!meta || meta.isEmpty() || !hasLoaded(meta)) {
    return IS_LOADING;
  }
  return false;
}

function isLoadState(o) {
  return o === IS_LOADING || o === FAILED_LOADING;
}

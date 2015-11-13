import _ from 'lodash';
import {hasLoaded, hasFailed} from '../utils/loadingUtils';
import {IS_LOADING, FAILED_LOADING} from '../Constants';
import {createSelector} from 'reselect';

export function createFFSelector(selectors, handler) {
  const wrappedHandler = ensureLoaded(handler);
  return createSelector(selectors, wrappedHandler);
}

/**
 * For all possible load states, find the most important.
 * If none are found, return false.
 *
 * Order of importance: FAILED_LOADING, IS_LOADING
 */
export function reduceLoadState(...params) {
  var loadState = false;
  _.forEach(params, function (param) {
    if (_.isUndefined(param)) {
      loadState = IS_LOADING;
      return;
    }

    let testValue = isMeta(param) ? calcLoadState(testValue) : param;
    switch (testValue) {
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

function ensureLoaded(selector) {
  return function(...params) {
    const loadState = reduceLoadState(...params);
    if (loadState) return loadState;

    return selector(...params);
  };
}

/** Duck test for meta object */
function isMeta(possibleMeta) {
  return !!(possibleMeta && _.has(possibleMeta, 'isFetching'));
}

/**
 * Returns a IS_LOADING, FAILED_LOADING for the given meta. If the given meta is
 * not loading, returns false.
 */
function calcLoadState(meta) {
  if (hasLoaded(meta)) {
    return IS_LOADING;
  } else if (hasFailed(meta)) {
    return FAILED_LOADING;
  }
  return false;
}


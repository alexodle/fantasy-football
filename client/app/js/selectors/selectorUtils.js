import _ from 'lodash';
import {hasLoaded, hasFailed} from '../utils/loadingUtils';
import {IS_LOADING, FAILED_LOADING} from '../Constants';
import {createSelector} from 'reselect';

function isLoadState(o) {
  return o === IS_LOADING || o === FAILED_LOADING;
}

/**
 * Fills in the given state map, and includes a loadState property with either
 * false, IS_LOADING, or FAILED_LOADING
 */
export function createFFComponentSelector(stateMap) {
  return function (state) {
    let selection = _.mapValues(stateMap, function (v) {
      if (_.isFunction(v)) {
        return v(state);
      }
      return v;
    });

    const loadState = reduceEntityLoadState(selection);
    selection = _.omit(selection, isLoadState);

    selection.loadState = loadState;

    return selection;
  };
}

export function createFFSelector({metaSelectors = [], selectors = [], selector}) {
  const wrappedHandler = ensureLoaded(metaSelectors.length, selectors.length, selector);
  return createSelector(metaSelectors.concat(selectors), wrappedHandler);
}

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
  return function(...params) {
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
  } else if (!meta || _.isEmpty(meta) || !hasLoaded(meta)) {
    return IS_LOADING;
  }
  return false;
}


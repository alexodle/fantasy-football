import _ from 'lodash';
import request from 'superagent';
import {ACTIVE, SUCCEEDED, FAILED} from './AsyncActionStates';
import {hasLoaded} from '../utils/loadingUtils';
import {selectAuthMeta} from '../selectors/metaSelectors';

const DATA_KEY = 'data';

function redirectToLogin(reason) {
  // HACK - lazy-load AuthActions to avoid circular dependency
  return require('./AuthActions').redirectToLogin(reason);
}

export const AUTH_REQUIRED = 'AUTH_REQUIRED';

export function handleAsyncAction(dispatch, getState, {
  actionType,
  url,
  metaSelector,
  dataKey = DATA_KEY,
  extraProps = {},
  parser = _.identity,
  onSuccess = _.noop,

  /**
   * Two options:
   * - AUTH_REQUIRED - we will require auth and pull from current state
   * - { u: <username>, p: <password> } - we will use given auth (use for obtaining token)
   */
  auth = null
}) {
const authRequired = auth === AUTH_REQUIRED;
if (authRequired) {
  const authMeta = selectAuthMeta(getState());
  if (!hasLoaded(authMeta)) {
    dispatch(redirectToLogin());
    return;
  }

  auth = { u: authMeta.user, p: authMeta.token };
}

const meta = metaSelector(getState());
if (!shouldFetch(meta)) {
  return;
}

dispatch({ type: actionType, state: ACTIVE, ...extraProps });

let req = request.get(url);
req = (auth ? req.auth(auth.u, auth.p) : req);
req
  .set('Accept', 'application/json')
  .set('X-Requested-With', 'XMLHttpRequest')
  .end(function (err, res) {
    if (err) {
      if (authRequired && res.statusCode === 403) {
        dispatch(redirectToLogin('Your auth expired.'));
      } else {
        dispatch({
          type: actionType,
          state: FAILED,
          statusCode: res.statusCode,
          ...extraProps
        });
      }
      return;
    }

    let payload = res.body[dataKey];
    if (_.isArray(payload)) {
      payload = _.map(payload, parser);
    } else {
      payload = parser(payload);
    }
    dispatch({
      type: actionType,
      state: SUCCEEDED,
      lastUpdated: Date.now(),
      statusCode: res.statusCode,
      payload,
      ...extraProps
    });

    onSuccess && onSuccess(dispatch, getState);
  });
}

/**
 * Builds a standard REST async action
 *
 * TODO: Separate REST/auth/http logic into separate function/file
 */
export default function buildAsyncAction(options) {
  return function asyncAction(dispatch, getState) {
    return handleAsyncAction(dispatch, getState, options);
  };
}

function shouldFetch(meta) {
  if (!meta || !meta.lastUpdated) {
    return true;
  } else if (meta.isFetching) {
    return false;
  } else {
    return meta.didInvalidate;
  }
}


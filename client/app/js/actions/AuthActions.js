import {selectAuthMeta} from '../selectors/metaSelectors';
import {pushState} from 'redux-router';
import buildAsyncAction from './buildAsyncAction';
import {LOGIN, LOGOUT} from './ActionTypes';

export function login(username, password, nextPath = '/') {
  return buildAsyncAction({
    actionType: LOGIN,
    url: '/api/token',
    auth: { u: username, p: password },
    metaSelector: selectAuthMeta,
    dataKey: 'token',
    extraProps: { user: username },
    onSuccess: (dispatch, _getState) => dispatch(pushState(null, nextPath))
  });
}

export function logout() {
  return function (dispatch, _getState) {
    dispatch({ type: LOGOUT });
    dispatch(pushState(null, '/login'));
  };
}

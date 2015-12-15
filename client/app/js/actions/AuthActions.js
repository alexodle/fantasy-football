import {selectAuthMeta} from '../selectors/metaSelectors';
import {pushState} from 'redux-router';
import buildAsyncAction from './buildAsyncAction';
import {LOGIN, LOGOUT, LOAD_AUTH_FROM_LOCAL_STORAGE} from './ActionTypes';

export function loadAuthFromLocalStorage() {
  let auth = localStorage.getItem('auth');
  if (auth) {
    try {
      auth = JSON.parse(auth);
    } catch (e) {
      console.warn(`Could not parse auth: ${auth}, ${e}`);
      auth = null;
    }
  }

  return { type: LOAD_AUTH_FROM_LOCAL_STORAGE, auth };
}

export function login(username, password, nextPath = '/') {
  return buildAsyncAction({
    actionType: LOGIN,
    url: '/api/token',
    auth: { u: username, p: password },
    metaSelector: selectAuthMeta,
    extraProps: { user: username },
    onSuccess: function (dispatch, getState) {
      const auth = selectAuthMeta(getState());
      localStorage.setItem('auth', JSON.stringify(auth));

      dispatch(pushState(null, nextPath));
    }
  });
}

export function logout() {
  return function (dispatch, _getState) {
    localStorage.removeItem('auth');
    dispatch({ type: LOGOUT });
    dispatch(pushState(null, '/login'));
  };
}

export function redirectToLogin(reason) {
  return function (dispatch, getState) {
    const redirectAfterLogin = getState().router.location.pathname;
    if (redirectAfterLogin !== '/login') {
      localStorage.removeItem('auth');
      dispatch({ type: LOGOUT, reason: reason });
      dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
    }
  };
}

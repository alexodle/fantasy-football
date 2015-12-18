import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetch from './utils/preventsRefetch';
import {LOGIN, LOGOUT, LOAD_AUTH_FROM_LOCAL_STORAGE} from './ActionTypes';
import {fetchToken} from '../http/fetchers';
import {pushState} from 'redux-router';
import {selectAuthMeta} from '../selectors/metaSelectors';

export function loadAuthFromLocalStorage() {
  let auth = localStorage.getItem('auth');
  if (auth) {
    try {
      auth = JSON.parse(auth);
    } catch (e) {
      auth = null;
    }
  }

  return { type: LOAD_AUTH_FROM_LOCAL_STORAGE, auth };
}

export function login(username, password, nextPath = '/') {
  return preventsRefetch(selectAuthMeta, (dispatch, getState) => {
    const request = fetchToken(username, password);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOGIN,
      extraProps: { user: username },

      // We are already at the login page, so no need to force redirect
      allowLoginRedirect: false
    })
    .then(() => {
      const auth = selectAuthMeta(getState());
      localStorage.setItem('auth', JSON.stringify(auth));

      dispatch(pushState(null, nextPath));
    });
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

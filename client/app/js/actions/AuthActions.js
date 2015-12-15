import {pushState} from 'redux-router';
import {LOGOUT, LOAD_AUTH_FROM_LOCAL_STORAGE} from './ActionTypes';

// IN PROGRESS OF MOVING ALL THESE FUNCTIONS TO AuthActions2
export const login = require('./AuthActions2').login;

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

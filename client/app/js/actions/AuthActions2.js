import getToken from '../http/getToken';
import {LOGIN} from './ActionTypes';
import {pushState} from 'redux-router';
import {selectAuthMeta} from '../selectors/metaSelectors';
import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetch from './utils/preventsRefetch';

export function login(username, password, nextPath = '/') {
  return preventsRefetch(selectAuthMeta, (dispatch, getState) => {
    const request = getToken(username, password);
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

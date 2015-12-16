import _ from 'lodash';
import {ACTIVE, SUCCEEDED, FAILED} from '../AsyncActionStates';

const DATA_KEY = 'data';

function redirectToLogin(reason) {
  // HACK - lazy-load AuthActions to avoid circular dependency
  return require('../AuthActions').redirectToLogin(reason);
}

export default function handleHttpRequest({
  actionType,
  dispatch,
  request,
  dataKey = DATA_KEY,
  extraProps = {},
  parser = _.identity,
  allowLoginRedirect = true
}) {
  dispatch({ type: actionType, state: ACTIVE, ...extraProps });
  return request
    .then(({ res }) => {
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
    })
    .catch(({ err, res, authFailure }) => {
      if (allowLoginRedirect && authFailure) {
        dispatch(redirectToLogin('Your auth expired.'));
      } else {
        dispatch({
          type: actionType,
          state: FAILED,
          statusCode: res.statusCode,
          ...extraProps
        });
      }
      throw err;
    });
}

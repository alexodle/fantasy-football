import {LOGOUT} from '../actions/ActionTypes';

export default function clientReducer(client, action) {
  switch (action.type) {

    case LOGOUT:
      return { ...client, logoutReason: action.reason };

    default:
      return client;
  }
}

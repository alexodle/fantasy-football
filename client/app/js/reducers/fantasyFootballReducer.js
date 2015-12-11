import entitiesReducer from './entitiesReducer';
import initialState from '../initialState';
import metaReducer from './metaReducer';
import clientReducer from './clientReducer';
import {LOGOUT} from '../actions/ActionTypes';
import {routerStateReducer} from 'redux-router';

export default function fantasyFootballReducer(state = initialState, action) {
  const router = routerStateReducer(state.router, action);

  // Basically just hit the reset button for "LOGOUT"
  if (action.type === LOGOUT) {
    state = initialState;
  }

  return {
    client: clientReducer(state.client, action),
    entities: entitiesReducer(state.entities, action),
    meta: metaReducer(state.meta, action),
    router
  };
}

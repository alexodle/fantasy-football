import initialState from '../initialState';
import entitiesReducer from './entitiesReducer';
import metaReducer from './metaReducer';
import {routerStateReducer} from 'redux-router';

export default function fantasyFootballReducer(state = initialState, action) {
  return {
    client: state.client,
    entities: entitiesReducer(state.entities, action),
    meta: metaReducer(state.meta, action),
    router: routerStateReducer(state.router, action)
  };
}

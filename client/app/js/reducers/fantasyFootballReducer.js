import entitiesReducer from './entitiesReducer';
import initialState from '../initialState';
import metaReducer from './metaReducer';
import {routerStateReducer} from 'redux-router';

export default function fantasyFootballReducer(state = initialState, action) {
  return {
    immutable: state.immutable.merge({
      client: state.immutable.get('client'),
      entities: entitiesReducer(state.immutable.get('entities'), action),
      meta: metaReducer(state.immutable.get('meta'), action)
    }),
    router: routerStateReducer(state.router, action)
  };
}

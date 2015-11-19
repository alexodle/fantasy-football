import entitiesReducer from './entitiesReducer';
import Immutable from 'immutable';
import initialState from '../initialState';
import metaReducer from './metaReducer';
import {routerStateReducer} from 'redux-router';

export default function fantasyFootballReducer(state = initialState, action) {
  const router = routerStateReducer(state.router, action);
  const newMap = Immutable.Map({
    client: state.get('client'),
    entities: entitiesReducer(state.get('entities'), action),
    meta: metaReducer(state.get('meta'), action)
  });
  newMap.router = router;
  return newMap;
}

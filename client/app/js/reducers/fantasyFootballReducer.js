import initialState from '../initialState';
import entitiesReducer from './entitiesReducer';
import metaReducer from './metaReducer';

export default function fantasyFootballReducer(state = initialState, action) {
  return {
    client: state.client,
    entities: entitiesReducer(state.entities, action),
    meta: metaReducer(state.meta, action)
  };
}

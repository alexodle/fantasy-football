import _ from 'lodash';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import { SUCCEEDED } from '../actions/AsyncActionStates';

export default function entitiesReducer(entities, action) {
  if (action.state !== SUCCEEDED) {
    return entities;
  }

  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return _.merge({}, entities, { drafts: {
        [action.league_id]: { order: _.sortBy(action.result, 'order') }
      } });

    case LOAD_DRAFT_PICKS:
      return _.merge({}, entities, {
        [action.league_id]: { picks: _.sortBy(action.result, 'pick_number') }
      });

    case LOAD_FANTASY_PLAYERS:
      return _.merge({}, entities, {
        users: _.indexBy(action.result, 'id')
      });

    case LOAD_FOOTBALL_PLAYERS:
      return _.merge({}, entities, {
        football_players: _.indexBy(action.result, 'id')
      });

    case LOAD_MY_LEAGUES:
      return _.merge({}, entities, {
        fantasy_leagues: _.indexBy(action.result, 'id')
      });

    case LOAD_USER:
      return _.merge({}, entities, { current_user: action.result });

    default:
      return entities;
  }
}

import _ from 'lodash';
import {
  DRAFT_PLAYER,
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import {ACTIVE, FAILED} from '../actions/AsyncActionStates';

function activeStateReducer(entities, action) {
  switch (action.type) {

    case DRAFT_PLAYER:
      const newPicks = entities.drafts[action.league_id].picks.concat([action.data]);
      return _.merge({}, entities, { drafts: {
        [action.league_id]: { picks: newPicks }
      } });

    default:
      return entities;
  }
}

function failedStateReducer(entities, action) {
  switch (action.type) {

    case DRAFT_PLAYER:
      // HIHI TODO
      // (probably just going to show a global modal that has a refresh button)
      return entities;

    default:
      return entities;
  }
}

function successStateReducer(entities, action) {
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return _.merge({}, entities, { drafts: {
        [action.league_id]: { order: _.sortBy(action.result, 'order') }
      } });

    case LOAD_DRAFT_PICKS:
      return _.merge({}, entities, { drafts: {
        [action.league_id]: { picks: _.sortBy(action.result, 'pick_number') }
      } });

    case LOAD_FANTASY_PLAYERS:
      return _.merge({}, entities, {
        users: _.indexBy(action.result, 'id')
      });

    case LOAD_FANTASY_TEAMS:
      return _.merge({}, entities, {
        fantasy_teams: _.indexBy(action.result, 'id')
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
      return _.merge({}, entities, { users: {
        [action.result.id]: action.result
      } });

    default:
      return entities;
  }
}

export default function entitiesReducer(entities, action) {
  if (action.state === ACTIVE) {
    return activeStateReducer(entities, action);
  } else if (action.state === FAILED) {
    return failedStateReducer(entities, action);
  } else { // if (action.state === SUCCESS) {
    return successStateReducer(entities, action);
  }
}

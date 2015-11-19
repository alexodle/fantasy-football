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
import _ from 'lodash';
import {ACTIVE, FAILED} from '../actions/AsyncActionStates';

function activeStateReducer(entities, action) {
  switch (action.type) {

    case DRAFT_PLAYER:
      return entities.updateIn(['drafts', action.league_id, 'picks'], (picks) => picks.push(action.data));

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
      return entities.setIn(['drafts', action.league_id, 'order'], _.sortBy(action.result, 'order'));

    case LOAD_DRAFT_PICKS:
      return entities.setIn(['drafts', action.league_id, 'picks'], _.sortBy(action.result, 'pick_number'));

    case LOAD_FANTASY_PLAYERS:
      return entities.merge({ users: _.indexBy(action.result, 'id') });

    case LOAD_FANTASY_TEAMS:
      return entities.merge({ fantasy_teams: _.indexBy(action.result, 'id') });

    case LOAD_FOOTBALL_PLAYERS:
      return entities.merge({ football_players: _.indexBy(action.result, 'id') });

    case LOAD_MY_LEAGUES:
      return entities.merge({ fantasy_leagues: _.indexBy(action.result, 'id') });

    case LOAD_USER:
      return entities.setIn(['users', action.result.id], action.result);

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

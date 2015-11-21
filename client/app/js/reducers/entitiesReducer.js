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
import update from 'react-addons-update';
import {ACTIVE, FAILED} from '../actions/AsyncActionStates';

function activeStateReducer(entities, action) {
  switch (action.type) {

    case DRAFT_PLAYER:
      return update(entities, {
        drafts: { [action.league_id]: { picks: { $push: [action.data] } } }
      });

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

function ensureDraft(entities, action) {
  if (entities.drafts[action.league_id]) return entities;
  return update(entities, {
    drafts: { [action.league_id]: { $set: {} } }
  });
}

function successStateReducer(entities, action) {
  let value;
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      value = _.sortBy(action.result, 'order');
      return update(ensureDraft(entities, action), {
        drafts: { [action.league_id]: { order: { $set: value } } }
      });

    case LOAD_DRAFT_PICKS:
      value = _.sortBy(action.result, 'pick_number');
      return update(ensureDraft(entities, action), {
        drafts: { [action.league_id]: { picks: { $set: value } } }
      });

    case LOAD_FANTASY_PLAYERS:
      value = _.indexBy(action.result, 'id');
      return update(entities, { users: { $set: value } });

    case LOAD_FANTASY_TEAMS:
      value = _.indexBy(action.result, 'id');
      return update(entities, { fantasy_teams: { $set: value } });

    case LOAD_FOOTBALL_PLAYERS:
      value = _.indexBy(action.result, 'id');
      return update(entities, { football_players: { $set: value } });

    case LOAD_MY_LEAGUES:
      value = _.indexBy(action.result, 'id');
      return update(entities, { fantasy_leagues: { $set: value } });

    case LOAD_USER:
      value = action.result;
      return update(entities, { users: { [value.id]: { $set: value } } });

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

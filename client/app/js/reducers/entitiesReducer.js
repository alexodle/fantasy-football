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
import {ACTIVE, FAILED, SUCCEEDED, CLEAR} from '../actions/AsyncActionStates';

function clearStateReducer(entities, action) {
  switch (action.type) {

    case LOAD_DRAFT_PICKS:
      return update(entities, {
        drafts: { [action.league_id]: { picks: { $set: null } } }
      });

    default:
      return entities;
  }
}

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
      // TODO: probably just going to show a global modal that has a refresh
      // button
      return entities;

    default:
      return entities;
  }
}

function successStateReducer(entities, action) {
  return (
    loadBasicEntitiesReducer(entities, action) ||
    loadDraftEntitiesReducer(entities, action) ||
    loadUserReducer(entities, action) ||
    entities
  );
}

function ensureDraft(entities, action) {
  if (entities.drafts[action.league_id]) return entities;
  return update(entities, {
    drafts: { [action.league_id]: { $set: {} } }
  });
}

function loadBasicEntitiesReducer(entities, action) {
  const BASIC_ENTITIES_MAP = {
    [LOAD_FANTASY_PLAYERS]: 'users',
    [LOAD_FANTASY_TEAMS]: 'fantasy_teams',
    [LOAD_FOOTBALL_PLAYERS]: 'football_players',
    [LOAD_MY_LEAGUES]: 'fantasy_leagues'
  };
  const entityType = BASIC_ENTITIES_MAP[action.type];
  if (entityType) {
    const value = _.indexBy(action.payload, 'id');
    return update(entities, { [entityType]: { $set: value } });
  }
}

function loadDraftEntitiesReducer(entities, action) {
  const DRAFT_ENTITIES_MAP = {
    [LOAD_DRAFT_ORDER]: 'order',
    [LOAD_DRAFT_PICKS]: 'picks'
  };
  const entityType = DRAFT_ENTITIES_MAP[action.type];
  if (entityType) {
    entities = ensureDraft(entities, action);

    const value = _.sortBy(action.payload, 'order');
    return update(entities, {
      drafts: { [action.league_id]: { [entityType]: { $set: value } } }
    });
  }
}

function loadUserReducer(entities, action) {
  if (action.type === LOAD_USER) {
    const value = action.payload;
    return update(entities, { users: { [value.id]: { $set: value } } });
  }
}

export default function entitiesReducer(entities, action) {
  switch (action.state) {
    case ACTIVE:
      return activeStateReducer(entities, action);
    case FAILED:
      return failedStateReducer(entities, action);
    case SUCCEEDED:
      return successStateReducer(entities, action);
    case CLEAR:
      return clearStateReducer(entities, action);
    default:
      return entities;
  }
}

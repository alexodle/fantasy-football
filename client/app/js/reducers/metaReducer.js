import _ from 'lodash';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import update from 'react-addons-update';
import { ACTIVE, SUCCEEDED, FAILED } from '../actions/AsyncActionStates';
import {DEFAULT_FANTASY_LEAGUE} from '../initialState';

export default function metaReducer(meta, action) {
  const metaUpdate = getMetaUpdate(action);
  return {
    current_user: currentUserReducer(meta.current_user, action, metaUpdate),
    my_leagues: myLeaguesReducer(meta.my_leagues, action, metaUpdate),
    fantasy_leagues: leaguesReducer(ensureLeague(meta.fantasy_leagues, action), action, metaUpdate)
  };
}

function currentUserReducer(current_user, action, metaUpdate) {
  switch (action.type) {

    case LOAD_USER:
      if (action.state === SUCCEEDED) {
        return { ...metaUpdate, id: action.result.id };
      }
      return { ...current_user, ...metaUpdate };

    default:
      return current_user;
  }
}

function myLeaguesReducer(myLeagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_MY_LEAGUES:
      if (action.state === SUCCEEDED) {
        return { ...metaUpdate, items: _.pluck(action.result, 'id') };
      }
      return { ...myLeagues, ...metaUpdate };

    default:
      return myLeagues;
  }
}

function ensureLeague(leagues, action) {
  if (!action.league_id || leagues[action.league_id]) return leagues;
  return update(leagues, { [action.league_id]: { $set: DEFAULT_FANTASY_LEAGUE } } );
}

function updateLeagueEntity(leagues, entityType, action, metaUpdate) {
  let value = metaUpdate;
  if (action.state === SUCCEEDED) {
    value = { ...metaUpdate, items: _.pluck(action.result, 'id') };
  }

  return update(leagues, {
    [action.league_id]: { [entityType]: { $merge: value } }
  });
}

function leaguesReducer(leagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return update(leagues, {
        [action.league_id]: { draft: { order: { $merge: metaUpdate } } }
      });

    case LOAD_DRAFT_PICKS:
      return update(leagues, {
        [action.league_id]: { draft: { picks: { $merge: metaUpdate } } }
      });

    case LOAD_FANTASY_PLAYERS:
      return updateLeagueEntity(leagues, 'fantasy_players', action, metaUpdate);

    case LOAD_FANTASY_TEAMS:
      return updateLeagueEntity(leagues, 'fantasy_teams', action, metaUpdate);

    case LOAD_FOOTBALL_PLAYERS:
      return updateLeagueEntity(leagues, 'football_players', action, metaUpdate);

    default:
      return leagues;
  }
}

function getMetaUpdate(action) {
  switch (action.state) {
    case ACTIVE:
      return { isFetching: true };
    case SUCCEEDED:
      return {
        isFetching: false,
        didInvalidate: false,
        didFailFetching: false,
        lastUpdated: action.lastUpdated
      };
    case FAILED:
      return {
        isFetching: false,
        didFailFetching: true
      };
    default:
      return;
  }
}

import _ from 'lodash';
import update from 'react-addons-update';
import { ACTIVE, SUCCEEDED, FAILED } from '../actions/AsyncActionStates';
import {DEFAULT_FANTASY_LEAGUE, DEFAULT_META} from '../initialState';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER,
  LOGIN,
  LOGOUT,
  SET_UNAUTHENTICATED
} from '../actions/ActionTypes';

const DRAFT_ENTITY_MAP = {
  [LOAD_DRAFT_ORDER]: 'order',
  [LOAD_DRAFT_PICKS]: 'picks'
};

const LEAGUE_ENTITY_MAP = {
  [LOAD_FANTASY_PLAYERS]: 'fantasy_players',
  [LOAD_FANTASY_TEAMS]: 'fantasy_teams',
  [LOAD_FOOTBALL_PLAYERS]: 'football_players'
};

export default function metaReducer(meta, action) {
  const metaUpdate = getAsyncMetaUpdate(action);
  return {
    auth: authReducer(meta.auth, action, metaUpdate),
    current_user: currentUserReducer(meta.current_user, action, metaUpdate),
    my_leagues: myLeaguesReducer(meta.my_leagues, action, metaUpdate),
    fantasy_leagues: leaguesReducer(ensureLeague(meta.fantasy_leagues, action), action, metaUpdate)
  };
}

function authReducer(auth, action, metaUpdate) {
  switch (action.type) {

    case LOGIN:
      if (action.state === SUCCEEDED) {
        const newAuth = { ...metaUpdate, token: action.payload, user: action.user };
        localStorage.setItem('auth', JSON.stringify(newAuth));
        return newAuth;
      }
      return { ...auth, ...metaUpdate };

    case LOGOUT:
      localStorage.removeItem('auth');
      return { ...DEFAULT_META };

    case SET_UNAUTHENTICATED:
      return { ...auth, didInvalidate: true };

    default:
      return auth;
  }
}

function currentUserReducer(current_user, action, metaUpdate) {
  switch (action.type) {

    case LOAD_USER:
      if (action.state === SUCCEEDED) {
        return { ...metaUpdate, id: action.payload.id };
      }
      return { ...current_user, ...metaUpdate };

    case LOGOUT:
      return { ...DEFAULT_META };

    default:
      return current_user;
  }
}

function myLeaguesReducer(myLeagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_MY_LEAGUES:
      if (action.state === SUCCEEDED) {
        return { ...metaUpdate, items: _.pluck(action.payload, 'id') };
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

function leagueEntityReducer(leagues, action, metaUpdate) {
  const leagueEntity = LEAGUE_ENTITY_MAP[action.type];
  if (leagueEntity) {
    let value = metaUpdate;
    if (action.state === SUCCEEDED) {
      value = { ...metaUpdate, items: _.pluck(action.payload, 'id') };
    }

    return update(leagues, {
      [action.league_id]: { [leagueEntity]: { $merge: value } }
    });
  }
}

function draftEntityReducer(leagues, action, metaUpdate) {
  const draftEntity = DRAFT_ENTITY_MAP[action.type];
  if (draftEntity) {
   return update(leagues, {
      [action.league_id]: { draft: { [draftEntity]: { $merge: metaUpdate } } }
    });
  }
}

function leaguesReducer(leagues, action, metaUpdate) {
  return (
    leagueEntityReducer(leagues, action, metaUpdate) ||
    draftEntityReducer(leagues, action, metaUpdate) ||
    leagues
  );
}

function getAsyncMetaUpdate(action) {
  switch (action.state) {
    case ACTIVE:
      return { isFetching: true };
    case SUCCEEDED:
      return {
        isFetching: false,
        didInvalidate: false,
        didFailFetching: false,
        lastUpdated: action.lastUpdated,
        statusCode: action.statusCode
      };
    case FAILED:
      return {
        isFetching: false,
        didFailFetching: true,
        statusCode: action.statusCode
      };
    default:
      return;
  }
}

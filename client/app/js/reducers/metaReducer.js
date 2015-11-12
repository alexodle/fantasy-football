import _ from 'lodash';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import { ACTIVE, SUCCEEDED, FAILED } from '../actions/AsyncActionStates';

export default function metaReducer(meta, action) {
  const metaUpdate = getMetaUpdate(action);
  return {
    current_user: currentUserReducer(meta.current_user, action, metaUpdate),
    my_leagues: myLeaguesReducer(meta.my_leagues, action, metaUpdate),
    leagues: leaguesReducer(meta.leagues, action, metaUpdate)
  };
}

function currentUserReducer(current_user, action, metaUpdate) {
  switch (action.type) {

    case LOAD_USER:
      if (action.state === SUCCEEDED) {
        return { ...metaUpdate, id: action.result.id };
      }
      return metaUpdate;

    default:
      return current_user;
  }
}

function myLeaguesReducer(myLeagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_MY_LEAGUES:
      return { ...metaUpdate, items: _.pluck(action.result, 'id') };

    default:
      return myLeagues;
  }
}

function leaguesReducer(leagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return _.merge({}, leagues, {
        [action.league_id]: { draft: { order: metaUpdate } }
       });

    case LOAD_DRAFT_PICKS:
      return _.merge({}, leagues, {
        [action.league_id]: { draft: { picks: metaUpdate } }
       });

    case LOAD_FANTASY_PLAYERS:
      return _.merge({}, leagues, { [action.league_id]: { fantasy_players: {
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      } } });

    case LOAD_FOOTBALL_PLAYERS:
      return _.merge({}, leagues, { [action.league_id]: { football_players: {
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      } } });

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

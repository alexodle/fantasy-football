import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import Immutable from 'immutable';
import { ACTIVE, SUCCEEDED, FAILED } from '../actions/AsyncActionStates';

export default function metaReducer(meta, action) {
  const metaUpdate = getMetaUpdate(action);
  return meta.merge({
    current_user: currentUserReducer(meta.get('current_user'), action, metaUpdate),
    my_leagues: myLeaguesReducer(meta.get('my_leagues'), action, metaUpdate),
    fantasy_leagues: leaguesReducer(meta.get('fantasy_leagues'), action, metaUpdate)
  });
}

function currentUserReducer(current_user, action, metaUpdate) {
  switch (action.type) {

    case LOAD_USER:
      if (action.state === SUCCEEDED) {
        return metaUpdate.set('id', action.result.id);
      }
      return metaUpdate;

    default:
      return current_user;
  }
}

function myLeaguesReducer(myLeagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_MY_LEAGUES:
      return Immutable.fromJS(includeItems(metaUpdate, action));

    default:
      return myLeagues;
  }
}

function includeItems(metaUpdate, action) {
  if (action.result) {
    return metaUpdate.set('items', action.result
      .toSeq()
      .map(v => v.get('id'))
      .toList());
  }
  return metaUpdate;
}

function leaguesReducer(leagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return leagues.setIn([action.league_id, 'draft', 'order'], metaUpdate);

    case LOAD_DRAFT_PICKS:
      return leagues.setIn([action.league_id, 'draft', 'picks'], metaUpdate);

    case LOAD_FANTASY_PLAYERS:
      return leagues.setIn([action.league_id, 'fantasy_players'], includeItems(metaUpdate, action));

    case LOAD_FANTASY_TEAMS:
      return leagues.setIn([action.league_id, 'fantasy_teams'], includeItems(metaUpdate, action));

    case LOAD_FOOTBALL_PLAYERS:
      return leagues.setIn([action.league_id, 'football_players'], includeItems(metaUpdate, action));

    default:
      return leagues;
  }
}

function getMetaUpdate(action) {
  switch (action.state) {
    case ACTIVE:
      return Immutable.Map({ isFetching: true });
    case SUCCEEDED:
      return Immutable.Map({
        isFetching: false,
        didInvalidate: false,
        didFailFetching: false,
        lastUpdated: action.lastUpdated
      });
    case FAILED:
      return Immutable.Map({
        isFetching: false,
        didFailFetching: true
      });
    default:
      return;
  }
}

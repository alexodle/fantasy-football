import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../actions/ActionTypes';
import _ from 'lodash';
import Immutable from 'immutable';
import { ACTIVE, SUCCEEDED, FAILED } from '../actions/AsyncActionStates';

export default function metaReducer(meta, action) {
  const metaUpdate = getMetaUpdate(action);
  return Immutable.Map({
    current_user: currentUserReducer(meta.get('current_user'), action, metaUpdate),
    my_leagues: myLeaguesReducer(meta.get('my_leagues'), action, metaUpdate),
    fantasy_leagues: leaguesReducer(meta.get('fantasy_leagues'), action, metaUpdate)
  });
}

function currentUserReducer(current_user, action, metaUpdate) {
  switch (action.type) {

    case LOAD_USER:
      if (action.state === SUCCEEDED) {
        return Immutable.fromJS({ ...metaUpdate, id: action.result.id });
      }
      return Immutable.Map(metaUpdate);

    default:
      return current_user;
  }
}

function myLeaguesReducer(myLeagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_MY_LEAGUES:
      return Immutable.fromJS({
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      });

    default:
      return myLeagues;
  }
}

function leaguesReducer(leagues, action, metaUpdate) {
  switch (action.type) {

    case LOAD_DRAFT_ORDER:
      return leagues.setIn([action.league_id, 'draft', 'order'], metaUpdate);

    case LOAD_DRAFT_PICKS:
      return leagues.setIn([action.league_id, 'draft', 'picks'], metaUpdate);

    case LOAD_FANTASY_PLAYERS:
      return leagues.setIn([action.league_id, 'fantasy_players'], {
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      });

    case LOAD_FANTASY_TEAMS:
      return leagues.setIn([action.league_id, 'fantasy_teams'], {
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      });

    case LOAD_FOOTBALL_PLAYERS:
      return leagues.setIn([action.league_id, 'football_players'], {
        ...metaUpdate,
        items: _.pluck(action.result, 'id')
      });

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

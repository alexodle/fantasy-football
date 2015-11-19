import {selectFantasyLeague} from './selectors';
import Immutable from 'immutable';

function getMetaFromCurrentLeague(state, path) {
  const leagueId = selectFantasyLeague(state).id;
  if (leagueId) {
    return state.getIn(['meta', 'fantasy_leagues', leagueId].concat(path), Immutable.Map());
  }
  return Immutable.Map();
}

export function selectCurrentUserMeta(state) {
  return state.getIn(['meta', 'current_user']);
}

export function selectMyLeaguesMeta(state) {
  return state.getIn(['meta', 'my_leagues']);
}

export function selectLeagueFootballPlayersMeta(state) {
  return getMetaFromCurrentLeague(state, 'football_players');
}

export function selectLeagueFantasyPlayersMeta(state) {
  return getMetaFromCurrentLeague(state, 'fantasy_players');
}

export function selectLeagueFantasyTeamsMeta(state) {
  return getMetaFromCurrentLeague(state, 'fantasy_teams');
}

export function selectLeagueDraftOrderMeta(state) {
  return getMetaFromCurrentLeague(state, 'draft.order');
}

export function selectLeagueDraftPicksMeta(state) {
  return getMetaFromCurrentLeague(state, 'draft.picks');
}

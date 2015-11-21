import {selectFantasyLeague} from './selectors';
import Immutable from 'immutable';

function getMetaFromCurrentLeague(state, path, leagueId) {
  leagueId = leagueId || selectFantasyLeague(state).get('id');
  if (leagueId) {
    return state.immutable.getIn(['meta', 'fantasy_leagues', leagueId].concat(path), Immutable.Map());
  }
  return Immutable.Map();
}

export function selectCurrentUserMeta(state) {
  return state.immutable.getIn(['meta', 'current_user']);
}

export function selectMyLeaguesMeta(state) {
  return state.immutable.getIn(['meta', 'my_leagues']);
}

export function selectLeagueFootballPlayersMeta(state, leagueId = null) {
  return getMetaFromCurrentLeague(state, ['football_players'], leagueId);
}

export function selectLeagueFantasyPlayersMeta(state, leagueId = null) {
  return getMetaFromCurrentLeague(state, ['fantasy_players'], leagueId);
}

export function selectLeagueFantasyTeamsMeta(state, leagueId = null) {
  return getMetaFromCurrentLeague(state, ['fantasy_teams'], leagueId);
}

export function selectLeagueDraftOrderMeta(state, leagueId = null) {
  return getMetaFromCurrentLeague(state, ['draft', 'order'], leagueId);
}

export function selectLeagueDraftPicksMeta(state, leagueId = null) {
  return getMetaFromCurrentLeague(state, ['draft', 'picks'], leagueId);
}

import _ from 'lodash';
import {selectFantasyLeague} from './selectors';

function getMetaFromCurrentLeague(state, path) {
  const leagueId = selectFantasyLeague(state);
  if (leagueId) {
    return _.get(state, `state.meta.fantasy_leagues[${leagueId}].${path}`, {});
  }
  return {};
}

export const selectCurrentUserMeta = state => state.meta.current_user;
export const selectMyLeaguesMeta = state => state.meta.my_leagues;

export function selectLeagueFootballPlayersMeta(state) {
  return getMetaFromCurrentLeague(state, 'football_players');
}

export function selectLeagueFantasyPlayersMeta(state) {
  return getMetaFromCurrentLeague(state, 'fantasy_players');
}

export function selectLeagueDraftOrderMeta(state) {
  return getMetaFromCurrentLeague(state, 'draft.order');
}

export function selectLeagueDraftPicksMeta(state) {
  return getMetaFromCurrentLeague(state, 'draft.picks');
}

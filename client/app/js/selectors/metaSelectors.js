import _ from 'lodash';
import {selectCurrentFantasyLeagueId} from './routeSelectors';

function getMetaFromLeague(state, leagueId, path) {
  return _.get(state, `meta.fantasy_leagues[${leagueId}].${path}`, {});
}

function ensureFantasyLeagueId(fn) {
  return function (state, leagueId = null) {
    leagueId = leagueId || selectCurrentFantasyLeagueId(state);
    if (!leagueId) return {};

    return fn(state, leagueId);
  };
}

export function selectCurrentUserMeta(state) {
  return state.meta.current_user;
}

export function selectMyLeaguesMeta(state) {
  return state.meta.my_leagues;
}

export const selectLeagueFootballPlayersMeta = ensureFantasyLeagueId(function (state, leagueId) {
  return getMetaFromLeague(state, leagueId, 'football_players');
});

export const selectLeagueFantasyPlayersMeta = ensureFantasyLeagueId(function (state, leagueId) {
  return getMetaFromLeague(state, leagueId, 'fantasy_players');
});

export const selectLeagueFantasyTeamsMeta = ensureFantasyLeagueId(function (state, leagueId) {
  return getMetaFromLeague(state, leagueId, 'fantasy_teams');
});

export const selectLeagueDraftOrderMeta = ensureFantasyLeagueId(function (state, leagueId) {
  return getMetaFromLeague(state, leagueId, 'draft.order');
});

export const selectLeagueDraftPicksMeta = ensureFantasyLeagueId(function (state, leagueId) {
  return getMetaFromLeague(state, leagueId, 'draft.picks');
});

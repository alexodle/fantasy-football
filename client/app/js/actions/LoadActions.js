import buildAsyncAction, {AUTH_REQUIRED} from './buildAsyncAction';
import {
  LOAD_FANTASY_PLAYERS,
  LOAD_FOOTBALL_PLAYERS
} from './ActionTypes';
import {
  selectLeagueFantasyPlayersMeta,
  selectLeagueFootballPlayersMeta
} from '../selectors/metaSelectors';

// IN PROGRESS OF MOVING ALL THESE FUNCTIONS TO LoadActions2
export const loadMyLeagues = require('./LoadActions2').loadMyLeagues;
export const loadUserAndLeagues = require('./LoadActions2').loadUserAndLeagues;
export const loadFantasyTeams = require('./LoadActions2').loadFantasyTeams;

export function loadFantasyPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    auth: AUTH_REQUIRED,
    url: `/dev_api/fantasy_leagues/${fantasyLeagueId}/users/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFantasyPlayersMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFootballPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FOOTBALL_PLAYERS,
    auth: AUTH_REQUIRED,
    url: `/dev_api/league/${fantasyLeagueId}/football_players/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFootballPlayersMeta(state, fantasyLeagueId);
    }
  });
}

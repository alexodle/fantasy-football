import buildAsyncAction, {AUTH_REQUIRED} from './buildAsyncAction';
import {
  LOAD_FOOTBALL_PLAYERS
} from './ActionTypes';
import {
  selectLeagueFootballPlayersMeta
} from '../selectors/metaSelectors';

// IN PROGRESS OF MOVING ALL THESE FUNCTIONS TO LoadActions2
export const loadMyLeagues = require('./LoadActions2').loadMyLeagues;
export const loadUserAndLeagues = require('./LoadActions2').loadUserAndLeagues;
export const loadFantasyTeams = require('./LoadActions2').loadFantasyTeams;
export const loadFantasyPlayers = require('./LoadActions2').loadFantasyPlayers;

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

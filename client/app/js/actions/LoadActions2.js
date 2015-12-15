import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetchAndRequiresAuth from './utils/preventsRefetchAndRequiresAuth';
import {Positions} from '../Constants';
import {
  selectCurrentUserMeta,
  selectMyLeaguesMeta,
  selectLeagueFantasyTeamsMeta,
  selectLeagueFantasyPlayersMeta
} from '../selectors/metaSelectors';
import {
  LOAD_MY_LEAGUES,
  LOAD_USER, LOAD_FANTASY_TEAMS,
  LOAD_FANTASY_PLAYERS
} from '../actions/ActionTypes';
import {
  getCurrentUser,
  getUserLeagues,
  getLeagueFantasyTeams,
  getLeagueFantasyPlayers
} from '../http/fetchers';

const TEMPTEMP_HARDCODED_LEAGUE_RULES = {
  max_team_size: 11,
  team_reqs: {
    [Positions.QB]: 1,
    [Positions.RB]: 2,
    [Positions.WR]: 2,
    [Positions.TE]: 1,
    [Positions.FLEX]: 1,
    [Positions.K]: 1,
    [Positions['D/ST']]: 1
  }
};

export function loadFantasyPlayers(fantasyLeagueId) {
  const metaSelector = (state) => {
    return selectLeagueFantasyPlayersMeta(state, fantasyLeagueId);
  };
  return preventsRefetchAndRequiresAuth(metaSelector, (dispatch, getState, token) => {
    const request = getLeagueFantasyPlayers(fantasyLeagueId, token);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOAD_FANTASY_PLAYERS,
      extraProps: { league_id: fantasyLeagueId }
    });
  });
}

export function loadFantasyTeams(fantasyLeagueId) {
  const metaSelector = (state) => {
    return selectLeagueFantasyTeamsMeta(state, fantasyLeagueId);
  };
  return preventsRefetchAndRequiresAuth(metaSelector, (dispatch, getState, token) => {
    const request = getLeagueFantasyTeams(fantasyLeagueId, token);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOAD_FANTASY_TEAMS,
      extraProps: { league_id: fantasyLeagueId }
    });
  });
}

export function loadMyLeagues() {
  return preventsRefetchAndRequiresAuth(selectMyLeaguesMeta, (dispatch, getState, token) => {
    const user = selectCurrentUserMeta(getState());
    if (!user || !user.id) return false;

    const request = getUserLeagues(user.id, token);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOAD_MY_LEAGUES,
      parser: parseLeague
    });
  });
}

export function loadUserAndLeagues() {
  return preventsRefetchAndRequiresAuth(selectCurrentUserMeta, (dispatch, getState, token) => {
    const request = getCurrentUser(token);
    handleHttpRequest({ dispatch, request, actionType: LOAD_USER })
      .then(() => dispatch(loadMyLeagues()));
  });
}

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  league.rules = { ...TEMPTEMP_HARDCODED_LEAGUE_RULES };
  return league;
}

import {Positions} from '../Constants';
import buildAsyncAction, {handleAsyncAction, AUTH_REQUIRED} from './buildAsyncAction';
import {
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from './ActionTypes';
import {
  selectCurrentUserMeta,
  selectLeagueFantasyPlayersMeta,
  selectLeagueFantasyTeamsMeta,
  selectLeagueFootballPlayersMeta,
  selectMyLeaguesMeta
} from '../selectors/metaSelectors';

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
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    auth: AUTH_REQUIRED,
    url: `/api/fantasy_leagues/${fantasyLeagueId}/users/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFantasyPlayersMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFantasyTeams(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_TEAMS,
    auth: AUTH_REQUIRED,
    url: `/dev_api/league/${fantasyLeagueId}/fantasy_teams/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFantasyTeamsMeta(state, fantasyLeagueId);
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

export function loadMyLeagues() {
  return function (dispatch, getState) {
    const user = selectCurrentUserMeta(getState());
    if (!user || !user.id) return false;

    return handleAsyncAction(dispatch, getState, {
      actionType: LOAD_MY_LEAGUES,
      auth: AUTH_REQUIRED,
      url: `/api/users/${user.id}/fantasy_leagues/`,
      parser: parseLeague,
      metaSelector: selectMyLeaguesMeta
    });
  };
}

export function loadUserAndLeagues() {
  return buildAsyncAction({
    actionType: LOAD_USER,
    auth: AUTH_REQUIRED,
    url: '/api/current_user',
    metaSelector: selectCurrentUserMeta,
    onSuccess: function (dispatch, _getState) {
      dispatch(loadMyLeagues());
    }
  });
}

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  league.rules = { ...TEMPTEMP_HARDCODED_LEAGUE_RULES };
  return league;
}

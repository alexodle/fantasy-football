import getCurrentUser from '../http/getCurrentUser';
import getUserLeagues from '../http/getUserLeagues';
import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetchAndRequiresAuth from './utils/preventsRefetchAndRequiresAuth';
import {LOAD_MY_LEAGUES, LOAD_USER} from '../actions/ActionTypes';
import {Positions} from '../Constants';
import {selectCurrentUserMeta, selectMyLeaguesMeta} from '../selectors/metaSelectors';

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

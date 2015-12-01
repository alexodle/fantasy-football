import _ from 'lodash';
import request from 'superagent';
import {ACTIVE, SUCCEEDED, FAILED} from './AsyncActionStates';
import {hasLoaded} from '../utils/loadingUtils';
import {Positions} from '../Constants';
import {pushState} from 'redux-router';
import {
  LOAD_AUTH,
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER,
  SET_UNAUTHENTICATED
} from './ActionTypes';
import {
  selectAuthMeta,
  selectCurrentUserMeta,
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta,
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

const DATA_KEY = 'data';
const AUTH_REQUIRED = 'AUTH_REQUIRED';

export function loadAuth(username, password, nextPath = '/') {
  return buildAsyncAction({
    actionType: LOAD_AUTH,
    url: '/api/token',
    auth: { u: username, p: password },
    metaSelector: selectAuthMeta,
    dataKey: 'token',
    extraProps: { user: username },
    onSuccess: (dispatch, _getState) => dispatch(pushState(null, nextPath))
  });
}

export function loadDraftOrder(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_ORDER,
    auth: AUTH_REQUIRED,
    url: `/dev_api/league/${fantasyLeagueId}/draft_order/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueDraftOrderMeta(state, fantasyLeagueId);
    }
  });
}

export function loadDraftPicks(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_PICKS,
    auth: AUTH_REQUIRED,
    url: `/dev_api/league/${fantasyLeagueId}/draft_picks/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueDraftPicksMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFantasyPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    auth: AUTH_REQUIRED,
    url: `/dev_api/league/${fantasyLeagueId}/fantasy_players/`,
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
  return buildAsyncAction({
    actionType: LOAD_MY_LEAGUES,
    auth: AUTH_REQUIRED,
    url: '/dev_api/user/fantasy_leagues/',
    parser: parseLeague,
    metaSelector: selectMyLeaguesMeta
  });
}

export function loadUser() {
  return buildAsyncAction({
    actionType: LOAD_USER,
    auth: AUTH_REQUIRED,
    url: '/dev_api/user/',
    metaSelector: selectCurrentUserMeta
  });
}

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  league.rules = { ...TEMPTEMP_HARDCODED_LEAGUE_RULES };
  return league;
}

function shouldFetch(meta) {
  if (!meta || !meta.lastUpdated) {
    return true;
  } else if (meta.isFetching) {
    return false;
  } else {
    return meta.didInvalidate;
  }
}

// TODO: Separate REST/auth/http logic into separate function/file
function buildAsyncAction({
  actionType,
  url,
  metaSelector,
  dataKey = DATA_KEY,
  extraProps = {},
  parser = _.identity,
  onSuccess = _.noop,

  /**
   * Two options:
   * - AUTH_REQUIRED - we will require auth and pull from current state
   * - { u: <username>, p: <password> } - we will use given auth (use for obtaining token)
   */
  auth = null
}) {
  return function asyncAction(dispatch, getState) {
    if (auth === AUTH_REQUIRED) {
      const authMeta = selectAuthMeta(getState());
      if (!hasLoaded(authMeta)) {
        dispatch({ type: SET_UNAUTHENTICATED });
        return;
      }

      auth = { u: authMeta.user, p: authMeta.token };
    }

    const meta = metaSelector(getState());
    if (!shouldFetch(meta)) {
      return;
    }

    dispatch({ type: actionType, state: ACTIVE, ...extraProps });

    let req = request.get(url);
    req = (auth ? req.auth(auth.u, auth.p) : req);
    req
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .end(function (err, res) {
        if (err) {
          dispatch({
            type: actionType,
            state: FAILED,
            statusCode: res.statusCode,
            ...extraProps
          });
          return;
        }

        let payload = res.body[dataKey];
        if (_.isArray(payload)) {
          payload = _.map(payload, parser);
        } else {
          payload = parser(payload);
        }
        dispatch({
          type: actionType,
          state: SUCCEEDED,
          lastUpdated: Date.now(),
          statusCode: res.statusCode,
          payload,
          ...extraProps
        });

        onSuccess && onSuccess(dispatch, getState);
      });
  };
}

import _ from 'lodash';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from './ActionTypes';
import request from 'superagent';
import { ACTIVE, SUCCEEDED, FAILED } from './AsyncActionStates';

const DEFAULT_BODY_KEY = 'data';

export function loadDraftOrder(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_ORDER,
    url: `/api/league/${fantasyLeagueId}/draft_order/`,
    extraProps: { league_id: fantasyLeagueId }
  });
}

export function loadDraftPicks(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_PICKS,
    url: `/api/league/${fantasyLeagueId}/draft_picks/`,
    extraProps: { league_id: fantasyLeagueId }
  });
}

export function loadFantasyPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/fantasy_players/`,
    extraProps: { league_id: fantasyLeagueId }
  });
}

export function loadFootballPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FOOTBALL_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/football_players/`,
    extraProps: { league_id: fantasyLeagueId }
  });
}

export function loadMyLeagues() {
  return buildAsyncAction({
    actionType: LOAD_MY_LEAGUES,
    url: '/api/user/fantasy_leagues/',
    parser: parseLeague
  });
}

export const loadUser = function () {
  return buildAsyncAction({
    actionType: LOAD_USER,
    url: '/api/auth/',
    bodyKey: 'user_id'
  });
};

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  return league;
}

function buildAsyncAction({
  actionType,
  url,
  extraProps = {},
  bodyKey = DEFAULT_BODY_KEY,
  parser = _.identity
}) {
  return function (dispatch) {
    dispatch({ type: actionType, state: ACTIVE, ...extraProps });
    request
      .get(url)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          dispatch({ type: actionType, state: FAILED, ...extraProps });
          return;
        }

        let result = res.body[bodyKey];
        if (_.isArray(result)) {
          result = _.map(result, parser);
        } else {
          result = parser(result);
        }
        dispatch({
          type: actionType,
          state: SUCCEEDED,
          lastUpdated: Date.now(),
          result,
          ...extraProps
        });
      });
  };
}

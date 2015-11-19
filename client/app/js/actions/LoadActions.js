import _ from 'lodash';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from './ActionTypes';
import request from 'superagent';
import {ACTIVE, SUCCEEDED, FAILED} from './AsyncActionStates';
import {Positions} from '../Constants';

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

export function loadDraftOrder(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_ORDER,
    url: `/api/league/${fantasyLeagueId}/draft_order/`,
    extraProps: { league_id: fantasyLeagueId },
    getMeta: function (state) {
      return (
        state.meta[fantasyLeagueId] &&
        state.meta[fantasyLeagueId].draft.order
      );
    }
  });
}

export function loadDraftPicks(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_PICKS,
    url: `/api/league/${fantasyLeagueId}/draft_picks/`,
    extraProps: { league_id: fantasyLeagueId },
    getMeta: function (state) {
      return (
        state.meta[fantasyLeagueId] &&
        state.meta[fantasyLeagueId].draft.picks
      );
    }
  });
}

export function loadFantasyPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/fantasy_players/`,
    extraProps: { league_id: fantasyLeagueId },
    getMeta: function (state) {
      return (
        state.meta[fantasyLeagueId] &&
        state.meta[fantasyLeagueId].fantasy_players
      );
    }
  });
}

export function loadFantasyTeams(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_TEAMS,
    url: `/api/league/${fantasyLeagueId}/fantasy_teams/`,
    extraProps: { league_id: fantasyLeagueId },
    getMeta: function (state) {
      return (
        state.meta[fantasyLeagueId] &&
        state.meta[fantasyLeagueId].fantasy_teams
      );
    }
  });
}

export function loadFootballPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FOOTBALL_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/football_players/`,
    extraProps: { league_id: fantasyLeagueId },
    getMeta: function (state) {
      return (
        state.meta[fantasyLeagueId] &&
        state.meta[fantasyLeagueId].football_players
      );
    }
  });
}

export function loadMyLeagues() {
  return buildAsyncAction({
    actionType: LOAD_MY_LEAGUES,
    url: '/api/user/fantasy_leagues/',
    parser: parseLeague,
    getMeta: function (state) {
      return state.getIn(['meta', 'my_leagues']);
    }
  });
}

export function loadUser() {
  return buildAsyncAction({
    actionType: LOAD_USER,
    url: '/api/user/',
    getMeta: function (state) {
      return state.getIn(['meta', 'my_leagues']);
    }
  });
}

function parseLeague(league) {
  league.draft_start_date = new Date(league.draft_start_date);
  league.rules = { ...TEMPTEMP_HARDCODED_LEAGUE_RULES };
  return league;
}

function shouldFetch(meta) {
  if (!meta || !meta.get('lastUpdated')) {
    return true;
  } else if (meta.get('isFetching')) {
    return false;
  } else {
    return meta.get('didInvalidate');
  }
}

function buildAsyncAction({
  actionType,
  url,
  getMeta,
  extraProps = {},
  parser = _.identity
}) {
  return function (dispatch, getState) {
    const meta = getMeta(getState());
    if (!shouldFetch(meta)) {
      return;
    }

    dispatch({ type: actionType, state: ACTIVE, ...extraProps });
    request
      .get(url)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          dispatch({ type: actionType, state: FAILED, ...extraProps });
          return;
        }

        let result = res.body[DATA_KEY];
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

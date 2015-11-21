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
import {
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta,
  selectLeagueFantasyPlayersMeta,
  selectLeagueFantasyTeamsMeta,
  selectLeagueFootballPlayersMeta,
  selectMyLeaguesMeta,
  selectCurrentUserMeta
} from '../selectors/metaSelectors';

const DATA_KEY = 'data';

export function loadDraftOrder(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_ORDER,
    url: `/api/league/${fantasyLeagueId}/draft_order/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueDraftOrderMeta(state, fantasyLeagueId);
    }
  });
}

export function loadDraftPicks(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_DRAFT_PICKS,
    url: `/api/league/${fantasyLeagueId}/draft_picks/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueDraftPicksMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFantasyPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/fantasy_players/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFantasyPlayersMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFantasyTeams(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FANTASY_TEAMS,
    url: `/api/league/${fantasyLeagueId}/fantasy_teams/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFantasyTeamsMeta(state, fantasyLeagueId);
    }
  });
}

export function loadFootballPlayers(fantasyLeagueId) {
  return buildAsyncAction({
    actionType: LOAD_FOOTBALL_PLAYERS,
    url: `/api/league/${fantasyLeagueId}/football_players/`,
    extraProps: { league_id: fantasyLeagueId },
    metaSelector: function (state) {
      return selectLeagueFootballPlayersMeta(state, fantasyLeagueId);
    }
  });
}

export function loadMyLeagues() {
  return buildAsyncAction({
    actionType: LOAD_MY_LEAGUES,
    url: '/api/user/fantasy_leagues/',
    parser: parseLeague,
    metaSelector: selectMyLeaguesMeta
  });
}

export function loadUser() {
  return buildAsyncAction({
    actionType: LOAD_USER,
    url: '/api/user/',
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

function buildAsyncAction({
  actionType,
  url,
  metaSelector,
  extraProps = {},
  parser = _.identity
}) {
  return function (dispatch, getState) {
    const meta = metaSelector(getState());
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

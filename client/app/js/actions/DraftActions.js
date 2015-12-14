import {
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta
} from '../selectors/metaSelectors';
import buildAsyncAction, {AUTH_REQUIRED} from './buildAsyncAction';
import {CLEAR, INVALIDATE} from './AsyncActionStates';
import {LOAD_DRAFT_ORDER, LOAD_DRAFT_PICKS} from './ActionTypes';

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

export function clearDraftPicks(fantasyLeagueId) {
  return { type: LOAD_DRAFT_PICKS, state: CLEAR, league_id: fantasyLeagueId };
}

export function invalidateDraftPicks(fantasyLeagueId) {
  return { type: LOAD_DRAFT_PICKS, state: INVALIDATE, league_id: fantasyLeagueId };
}

export function forceLoadDraftPicks(fantasyLeagueId) {
  const loadDraftPicksAction = loadDraftPicks(fantasyLeagueId);
  return function (dispatch, getState) {
    dispatch(invalidateDraftPicks(fantasyLeagueId));
    loadDraftPicksAction(dispatch, getState);
  };
}

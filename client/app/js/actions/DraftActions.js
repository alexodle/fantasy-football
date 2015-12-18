import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetchAndRequiresAuth from './utils/preventsRefetchAndRequiresAuth';
import {CLEAR, INVALIDATE} from './AsyncActionStates';
import {LOAD_DRAFT_ORDER, LOAD_DRAFT_PICKS} from './ActionTypes';
import {
  fetchDraftOrder,
  fetchDraftPicks
} from '../http/fetchers';
import {
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta
} from '../selectors/metaSelectors';

export function loadDraftOrder(fantasyLeagueId) {
  const metaSelector = (state) => {
    return selectLeagueDraftOrderMeta(state, fantasyLeagueId);
  };
  return preventsRefetchAndRequiresAuth(metaSelector, (dispatch, getState, token) => {
    const request = fetchDraftOrder(fantasyLeagueId, token);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOAD_DRAFT_ORDER,
      extraProps: { league_id: fantasyLeagueId }
    });
  });
}

export function loadDraftPicks(fantasyLeagueId) {
  const metaSelector = (state) => {
    return selectLeagueDraftPicksMeta(state, fantasyLeagueId);
  };
  return preventsRefetchAndRequiresAuth(metaSelector, (dispatch, getState, token) => {
    const request = fetchDraftPicks(fantasyLeagueId, token);
    handleHttpRequest({
      dispatch,
      request,
      actionType: LOAD_DRAFT_PICKS,
      extraProps: { league_id: fantasyLeagueId }
    });
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

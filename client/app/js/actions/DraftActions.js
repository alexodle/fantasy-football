import handleHttpRequest from './utils/handleHttpRequest';
import preventsRefetchAndRequiresAuth from './utils/preventsRefetchAndRequiresAuth';
import requiresAuth from './utils/requiresAuth';
import {CLEAR, INVALIDATE} from './AsyncActionStates';
import {LOAD_DRAFT_ORDER, LOAD_DRAFT_PICKS, DRAFT_PLAYER} from './ActionTypes';
import {
  fetchDraftOrder,
  fetchDraftPicks
} from '../http/fetchers';
import {
  postDraftPick
} from '../http/posters';
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

export function draftFootballPlayer(fantasyLeagueId, footballPlayerId) {
  return requiresAuth((dispatch, getState, token) => {
    const state = getState();
    const pickNumber = state.entities.drafts[fantasyLeagueId].picks.length;
    const currentUserId = state.meta.current_user.id;
    const data = {
      fantasy_league_id: fantasyLeagueId,
      user_id: currentUserId,
      football_player_id: footballPlayerId,
      order: pickNumber
    };

    const request = postDraftPick(fantasyLeagueId, token, data);
    handleHttpRequest({
      dispatch,
      request,
      actionType: DRAFT_PLAYER,
      extraProps: { league_id: fantasyLeagueId, data: data }
    });
  });
}

import {DRAFT_PLAYER} from './ActionTypes';
import request from 'superagent';
import {ACTIVE, SUCCEEDED, FAILED} from './AsyncActionStates';

export function draftFootballPlayer(fantasyLeagueId, footballPlayerId) {
  return function (dispatch, getState) {
    const pickNumber = getState().entities.drafts[fantasyLeagueId].picks.length;
    const data = {
      football_player_id: footballPlayerId,
      pick_number: pickNumber
    };
    dispatch({ type: DRAFT_PLAYER, state: ACTIVE, data: data });
    request
      .post(`/api/league/${fantasyLeagueId}/draft_picks`)
      .send(data)
      .set('Accept', 'application/json')
      .end(function (err, _res) {
        if (err) {
          dispatch({ type: DRAFT_PLAYER, state: FAILED, data: data });
          return;
        }
        dispatch({
          type: DRAFT_PLAYER,
          state: SUCCEEDED,
          data: data,
          lastUpdated: Date.now()
        });
      });
  };
}

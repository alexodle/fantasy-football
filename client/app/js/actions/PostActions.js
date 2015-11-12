import {DRAFT_PLAYER} from './ActionTypes';
import request from 'superagent';
import {ACTIVE, SUCCEEDED, FAILED} from './AsyncActionStates';

export function draftFootballPlayer(fantasyLeagueId, footballPlayerId) {
  return function (dispatch, getState) {
    const state = getState();
    const pickNumber = state.entities.drafts[fantasyLeagueId].picks.length;
    const currentUserId = state.meta.current_user.id;
    const data = {
      fantasy_league_id: fantasyLeagueId,
      football_player_id: footballPlayerId,
      pick_number: pickNumber,
      user_id: currentUserId
    };
    dispatch({
      type: DRAFT_PLAYER,
      state: ACTIVE,
      league_id: fantasyLeagueId,
      data: data
    });
    request
      .post(`/api/league/${fantasyLeagueId}/draft_picks`)
      .send(data)
      .set('Accept', 'application/json')
      .end(function (err, _res) {
        if (err) {
          dispatch({
            type: DRAFT_PLAYER,
            state: FAILED,
            league_id: fantasyLeagueId,
            data: data
          });
          return;
        }
        dispatch({
          type: DRAFT_PLAYER,
          state: SUCCEEDED,
          league_id: fantasyLeagueId,
          data: data,
          lastUpdated: Date.now()
        });
      });
  };
}

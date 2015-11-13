import _ from 'lodash';
import {
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta
} from './metaSelectors';
import {
  selectCurrentFantasyLeagueId,
  selectLeagueFootballPlayers,
  selectCurrentUser
} from './selectors';
import {createFFSelector} from './selectorUtils';

export const selectDrafts = state => state.entities.drafts;

export const selectLeagueDraftPicks = createFFSelector([
  selectLeagueDraftPicksMeta,
  selectDrafts,
  selectCurrentFantasyLeagueId
  ], function (_draftPicksMeta, drafts, currentFantasyLeagueId) {
    return drafts[currentFantasyLeagueId].draft.picks;
  });

export const selectLeagueDraftOrder = createFFSelector([
  selectLeagueDraftOrderMeta,
  selectDrafts,
  selectCurrentFantasyLeagueId
  ], function (_draftOrderMeta, drafts, currentFantasyLeagueId) {
    return drafts[currentFantasyLeagueId].draft.order;
  });

export const selectDraftableFootballPlayers = createFFSelector([
  selectLeagueFootballPlayers,
  selectLeagueDraftPicks
  ], function (leagueFootballPlayers, leagueDraftPicks) {
    const draftedPlayerIds = _.pluck(leagueDraftPicks, 'football_player_id');
    return _.omit(leagueFootballPlayers, draftedPlayerIds);
  });

export const selectCurrentDraftOrder = createFFSelector([
  selectLeagueDraftOrder,
  selectLeagueDraftPicks
  ], function (leagueDraftOrder, leagueDraftPicks) {
    return leagueDraftOrder[leagueDraftPicks.length];
  });

export const selectIsMyPick = createFFSelector([
  selectCurrentDraftOrder,
  selectCurrentUser
  ], function (currentDraftOrder, currentUser) {
    return currentDraftOrder.user_id === currentUser.id;
  });

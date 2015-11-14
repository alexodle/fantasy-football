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

export const selectLeagueDraftPicks = createFFSelector({
  metaSelectors: [selectLeagueDraftPicksMeta],
  selectors: [selectDrafts, selectCurrentFantasyLeagueId],
  selector: function (_draftPicksMeta, drafts, currentFantasyLeagueId) {
    return drafts[currentFantasyLeagueId].picks;
  }
});

export const selectLeagueDraftOrder = createFFSelector({
  metaSelectors: [selectLeagueDraftOrderMeta],
  selectors: [selectDrafts, selectCurrentFantasyLeagueId],
  selector: function (_draftOrderMeta, drafts, currentFantasyLeagueId) {
    return drafts[currentFantasyLeagueId].order;
  }
});

export const selectDraftableFootballPlayers = createFFSelector({
  selectors: [selectLeagueFootballPlayers, selectLeagueFootballPlayers],
  selector: function (leagueFootballPlayers, leagueDraftPicks) {
    const draftedPlayerIds = _.pluck(leagueDraftPicks, 'football_player_id');
    return _(leagueFootballPlayers)
      .omit(draftedPlayerIds)
      .values()
      .value();
  }
});

export const selectCurrentDraftOrder = createFFSelector({
  selectors: [selectLeagueDraftOrder, selectLeagueDraftPicks],
  selector: function (leagueDraftOrder, leagueDraftPicks) {
    return leagueDraftOrder[leagueDraftPicks.length];
  }
});

export const selectIsMyPick = createFFSelector({
  selectors: [selectCurrentDraftOrder, selectCurrentUser],
  selector: function (currentDraftOrder, currentUser) {
    return currentDraftOrder.user_id === currentUser.id;
  }
});

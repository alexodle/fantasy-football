import _ from 'lodash';
import {
  selectLeagueDraftOrderMeta,
  selectLeagueDraftPicksMeta
} from './metaSelectors';
import {
  selectCurrentFantasyLeagueId,
  selectCurrentUser,
  selectFantasyLeague,
  selectLeagueFootballPlayers,
  selectMaxBenchSize
} from './selectors';
import {createFFSelector} from './selectorUtils';
import {bucketTeam} from '../logic/draftLogic';
import {Positions, FlexPositions} from '../Constants';
import Immutable from 'immutable';
import {keyIn} from '../utils/immutableUtils';

export const selectDrafts = state => state.immutable.getIn(['entities', 'drafts']);

export const selectLeagueDraftPicks = createFFSelector({
  metaSelectors: [selectLeagueDraftPicksMeta],
  selectors: [selectDrafts, selectCurrentFantasyLeagueId],
  selector: function (_draftPicksMeta, drafts, currentFantasyLeagueId) {
    return drafts.getIn([currentFantasyLeagueId, 'picks']);
  }
});

export const selectLeagueDraftOrder = createFFSelector({
  metaSelectors: [selectLeagueDraftOrderMeta],
  selectors: [selectDrafts, selectCurrentFantasyLeagueId],
  selector: function (_draftOrderMeta, drafts, currentFantasyLeagueId) {
    return drafts.getIn([currentFantasyLeagueId, 'order']);
  }
});

export const selectCurrentDraftOrder = createFFSelector({
  selectors: [selectLeagueDraftOrder, selectLeagueDraftPicks],
  selector: function (leagueDraftOrder, leagueDraftPicks) {
    return leagueDraftOrder.get(leagueDraftPicks.length);
  }
});

export const selectIsMyPick = createFFSelector({
  selectors: [selectCurrentDraftOrder, selectCurrentUser],
  selector: function (currentDraftOrder, currentUser) {
    return currentDraftOrder.get('user_id') === currentUser.get('id');
  }
});

export const selectMyDraftPicks = createFFSelector({
 selectors: [selectLeagueDraftPicks, selectCurrentUser],
 selector: function (leagueDraftPicks, currentUser) {
    return leagueDraftPicks.filter(dp => dp.user_id === currentUser.get('id'));
 }
});

export const selectMyDraftPickBuckets = createFFSelector({
  selectors: [
    selectLeagueFootballPlayers,
    selectFantasyLeague,
    selectMyDraftPicks
  ],
  selector: function (leagueFootballPlayers, fantasyLeague, myDraftPicks) {
    return bucketTeam({
      userDraftPicks: myDraftPicks,
      footballPlayerLookup: leagueFootballPlayers,
      teamReqs: fantasyLeague.get('rules').get('team_reqs')
    });
  }
});

/**
 * Ensure we draft positions of need if we're running out of picks
 */
export const selectIneligibleDraftPositions = createFFSelector({
  selectors: [
    selectMyDraftPickBuckets,
    selectFantasyLeague,
    selectMyDraftPicks,
    selectMaxBenchSize
  ],
  selector: function (myDraftPickBuckets, fantasyLeague, myDraftPicks, maxBenchSize) {
    const {picksByPosition, bench} = myDraftPickBuckets;
    if (bench.size() < maxBenchSize) {
      return Immutable.List();
    } else {
      const teamReqs = fantasyLeague.getIn(['rules', 'team_reqs']);
      const flexIsOpen = (
        !picksByPosition.get(Positions.FLEX) ||
        picksByPosition.get(Positions.FLEX).size() < teamReqs.get(Positions.FLEX)
      );
      return Immutable.Set(_.reject(Positions, function (p) {
        return (
          !picksByPosition.get(p) ||
          picksByPosition.get(p).size() < teamReqs.get(p) ||
          (flexIsOpen && _.contains(FlexPositions, p))
        );
      }));
    }
  }
});

export const selectDraftableFootballPlayers = createFFSelector({
  selectors: [
    selectLeagueFootballPlayers,
    selectLeagueDraftPicks,
    selectIneligibleDraftPositions
  ],
  selector: function (leagueFootballPlayers, leagueDraftPicks, ineligibleDraftPositions) {
    const draftedPlayerIds = leagueDraftPicks.toSeq()
      .map(dp => dp.get('football_player_id'))
      .toList();

    return leagueFootballPlayers.toSeq()
      .filter(keyIn(draftedPlayerIds))
      .filter(fp => ineligibleDraftPositions.has(fp.get('position')))
      .toList();
  }
});

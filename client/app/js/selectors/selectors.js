import _ from 'lodash';
import {
  selectLeagueFootballPlayersMeta,
  selectCurrentUserMeta,
  selectMyLeaguesMeta,
  selectLeagueFantasyPlayersMeta
} from './metaSelectors';
import {createFFSelector} from './selectorUtils';

const selectUsers = state => state.entities.users;
const selectFootballPlayers = state => state.entities.football_players;
const selectFantasyLeagues = state => state.entities.fantasy_leagues;

export function selectCurrentFantasyLeagueId(state) {
  return _.parseInt(state.router.params.leagueId);
}

export const selectCurrentUser = createFFSelector({
  metaSelectors: [selectCurrentUserMeta],
  selectors: [selectUsers],
  selector: function (currentUserMeta, users) {
    return users[currentUserMeta.id];
  }
});

export const selectMyLeagues = createFFSelector({
  metaSelectors: [selectMyLeaguesMeta],
  selectors: [selectFantasyLeagues],
  selector: function (myLeaguesMeta, fantasyLeagues) {
    return _.pick(fantasyLeagues, myLeaguesMeta.items);
  }
});

export const selectLeagueUsers = createFFSelector({
  metaSelectors: [selectLeagueFantasyPlayersMeta],
  selectors: [selectCurrentFantasyLeagueId, selectUsers],
  selector: function (leagueFantasyPlayersMeta, currentFantasyLeagueId, users) {
    return _.pick(users, leagueFantasyPlayersMeta.items);
  }
});

export const selectFantasyLeague = createFFSelector({
  metaSelectors: [selectMyLeaguesMeta],
  selectors: [selectCurrentFantasyLeagueId, selectFantasyLeagues],
  selector: function (myLeaguesMeta, currentFantasyLeagueId, fantasyLeagues) {
    return fantasyLeagues[currentFantasyLeagueId];
  }
});

export const selectLeagueFootballPlayers = createFFSelector({
  metaSelectors: [selectLeagueFootballPlayersMeta],
  selectors: [selectFootballPlayers],
  selector: function (footballPlayersMeta, footballPlayers) {
    return _.pick(footballPlayers, footballPlayersMeta.items);
  }
});

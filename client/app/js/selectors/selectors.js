import _ from 'lodash';
import {
  selectLeagueFootballPlayersMeta,
  selectCurrentUserMeta,
  selectMyLeaguesMeta
} from './metaSelectors';
import {createFFSelector} from './selectorUtils';

const selectUsers = state => state.entities.users;
const selectCurrentFantasyLeagueId = state => state.router.params.leagueId;
const selectFootballPlayers = state => state.entities.football_players;
const selectFantasyLeagues = state => state.entities.fantasy_leagues;

export const selectCurrentUser = createFFSelector([
  selectCurrentUserMeta,
  selectUsers
  ], function (currentUserMeta, users) {
    return users[currentUserMeta.id];
  });

export const selectMyLeagues = createFFSelector([
  selectMyLeaguesMeta,
  selectFantasyLeagues
  ], function (myLeaguesMeta, fantasyLeagues) {
    return _.pick(fantasyLeagues, myLeaguesMeta.items);
  });

export const selectFantasyLeague = createFFSelector([
  selectMyLeaguesMeta,
  selectCurrentFantasyLeagueId,
  selectFantasyLeagues
  ], function (myLeaguesMeta, currentFantasyLeagueId, fantasyLeagues) {
    return fantasyLeagues[currentFantasyLeagueId];
  });

export const selectLeagueFootballPlayers = createFFSelector([
  selectLeagueFootballPlayersMeta,
  selectFootballPlayers
  ], function (footballPlayersMeta, footballPlayers) {
    return _.pick(footballPlayers, footballPlayersMeta.items);
  });

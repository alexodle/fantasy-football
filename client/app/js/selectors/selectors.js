import _ from 'lodash';
import {
  selectCurrentUserMeta,
  selectLeagueFantasyPlayersMeta,
  selectLeagueFantasyTeamsMeta,
  selectLeagueFootballPlayersMeta,
  selectMyLeaguesMeta
} from './metaSelectors';
import {createFFSelector} from './selectorUtils';
import {selectCurrentFantasyLeagueId} from './routeSelectors';

const selectUsers = state => state.entities.users;
const selectFootballPlayers = state => state.entities.football_players;
const selectFantasyLeagues = state => state.entities.fantasy_leagues;
const selectFantasyTeams = state => state.entities.fantasy_teams;

const selectLeagueFantasyTeamsByUser = createFFSelector({
  metaSelectors: [selectLeagueFantasyTeamsMeta],
  selectors: [selectFantasyTeams],
  selector: function (leagueFantasyTeamsMeta, fantasyTeams) {
    return _(fantasyTeams)
      .pick(leagueFantasyTeamsMeta.items)
      .indexBy('owner_id')
      .value();
  }
});

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

export const selectFantasyLeague = createFFSelector({
  metaSelectors: [selectMyLeaguesMeta],
  selectors: [selectCurrentFantasyLeagueId, selectFantasyLeagues],
  selector: function (myLeaguesMeta, currentFantasyLeagueId, fantasyLeagues) {
    return fantasyLeagues[currentFantasyLeagueId];
  }
});

export const selectLeagueUsers = createFFSelector({
  metaSelectors: [selectLeagueFantasyPlayersMeta],
  selectors: [selectUsers, selectLeagueFantasyTeamsByUser],
  selector: function (leagueFantasyPlayersMeta, users, leagueFantasyTeamsByUser) {
    return _(users)
      .pick(leagueFantasyPlayersMeta.items)
      .mapValues(function (user) {
        return { ...user, team: leagueFantasyTeamsByUser[user.id] };
      })
      .value();
  }
});

export const selectLeagueFootballPlayers = createFFSelector({
  metaSelectors: [selectLeagueFootballPlayersMeta],
  selectors: [selectFootballPlayers],
  selector: function (footballPlayersMeta, footballPlayers) {
    return _.pick(footballPlayers, footballPlayersMeta.items);
  }
});

export const selectMaxBenchSize = createFFSelector({
  selectors: [selectFantasyLeague],
  selector: function (fantasyLeague) {
    const {rules} = fantasyLeague;
    const {team_reqs, max_team_size} = rules;
    const nonBenchMaxSize = _.reduce(team_reqs, function (total, n) {
      return total + n;
    });
    return max_team_size - nonBenchMaxSize;
  }
});

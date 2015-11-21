import _ from 'lodash';
import {
  selectCurrentUserMeta,
  selectLeagueFantasyPlayersMeta,
  selectLeagueFantasyTeamsMeta,
  selectLeagueFootballPlayersMeta,
  selectMyLeaguesMeta
} from './metaSelectors';
import {createFFSelector} from './selectorUtils';
import {keyIn} from '../utils/immutableUtils';

const selectUsers = state => state.immutable.getIn(['entities', 'users']);
const selectFootballPlayers = state => state.immutable.getIn(['entities', 'football_players']);
const selectFantasyLeagues = state => state.immutable.getIn(['entities', 'fantasy_leagues']);
const selectFantasyTeams = state => state.immutable.getIn(['entities', 'fantasy_teams']);

const selectLeagueFantasyTeamsByUser = createFFSelector({
  metaSelectors: [selectLeagueFantasyTeamsMeta],
  selectors: [selectFantasyTeams],
  selector: function (leagueFantasyTeamsMeta, fantasyTeams) {
    return fantasyTeams.toSeq()
      .filter(keyIn(leagueFantasyTeamsMeta.get('items')))
      .mapKeys((k, v) => v.get('owner_id'))
      .toMap();
  }
});

export function selectCurrentFantasyLeagueId(state) {
  return _.parseInt(state.router.params.leagueId);
}

export const selectCurrentUser = createFFSelector({
  metaSelectors: [selectCurrentUserMeta],
  selectors: [selectUsers],
  selector: function (currentUserMeta, users) {
    return users.get(currentUserMeta.get('id'));
  }
});

export const selectMyLeagues = createFFSelector({
  metaSelectors: [selectMyLeaguesMeta],
  selectors: [selectFantasyLeagues],
  selector: function (myLeaguesMeta, fantasyLeagues) {
    return fantasyLeagues.filter(keyIn(myLeaguesMeta.get('items')));
  }
});

export const selectFantasyLeague = createFFSelector({
  metaSelectors: [selectMyLeaguesMeta],
  selectors: [selectCurrentFantasyLeagueId, selectFantasyLeagues],
  selector: function (myLeaguesMeta, currentFantasyLeagueId, fantasyLeagues) {
    return fantasyLeagues.get(currentFantasyLeagueId.toString());
  }
});

export const selectLeagueUsers = createFFSelector({
  metaSelectors: [selectLeagueFantasyPlayersMeta],
  selectors: [selectUsers, selectLeagueFantasyTeamsByUser],
  selector: function (leagueFantasyPlayersMeta, users, leagueFantasyTeamsByUser) {
    return users.toSeq()
      .filter(keyIn(leagueFantasyPlayersMeta.get('items')))
      .map(function (user) {
        return user.set('team', leagueFantasyTeamsByUser.get(user.id));
      })
      .toMap();
  }
});

export const selectLeagueFootballPlayers = createFFSelector({
  metaSelectors: [selectLeagueFootballPlayersMeta],
  selectors: [selectFootballPlayers],
  selector: function (footballPlayersMeta, footballPlayers) {
    return footballPlayers.filter(keyIn(footballPlayersMeta.get('items')));
  }
});

export const selectMaxBenchSize = createFFSelector({
  selectors: [selectFantasyLeague],
  selector: function (fantasyLeague) {
    const rules = fantasyLeague.get('rules');
    const teamReqs = rules.get('team_reqs');
    const maxTeamSize = rules.get('max_team_size');
    const nonBenchMaxSize = teamReqs.reduce((total, n) => total + n);
    return maxTeamSize - nonBenchMaxSize;
  }
});

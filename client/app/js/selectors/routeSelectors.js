import _ from 'lodash';

export function selectCurrentFantasyLeagueId(state) {
  return _.parseInt(state.router.params.leagueId);
}

export function selectNextPath(state) {
  return state.router.location.query.next;
}

import httpGet from './httpGet';

export default function getLeagueFantasyTeams(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/league/${fantasyLeagueId}/fantasy_teams/`,
    token
  });
}

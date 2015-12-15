import httpGet from './utils/httpGet';

export function getToken(email, password) {
  return httpGet({ url: '/api/token', auth: { u: email, p: password } });
}

export function getCurrentUser(token) {
  return httpGet({ url: '/api/current_user', token });
}

export function getUserLeagues(userId, token) {
  return httpGet({ url: `/api/users/${userId}/fantasy_leagues/`, token });
}

export function getLeagueFantasyTeams(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/league/${fantasyLeagueId}/fantasy_teams/`,
    token
  });
}

export function getLeagueFantasyPlayers(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/fantasy_leagues/${fantasyLeagueId}/users/`,
    token
  });
}

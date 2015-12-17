import httpGet from './utils/httpGet';

export function fetchToken(email, password) {
  return httpGet({ url: '/api/token', auth: { u: email, p: password } });
}

export function fetchCurrentUser(token) {
  return httpGet({ url: '/api/current_user', token });
}

export function fetchUserLeagues(userId, token) {
  return httpGet({ url: `/api/users/${userId}/fantasy_leagues/`, token });
}

export function fetchLeagueFantasyTeams(fantasyLeagueId, token) {
  return httpGet({
    url: `/api/fantasy_leagues/${fantasyLeagueId}/fantasy_teams/`,
    token
  });
}

export function fetchLeagueFootballPlayers(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/league/${fantasyLeagueId}/football_players/`,
    token
  });
}

export function fetchLeagueFantasyPlayers(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/fantasy_leagues/${fantasyLeagueId}/users/`,
    token
  });
}

export function fetchDraftOrder(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/league/${fantasyLeagueId}/draft_order/`,
    token
  });
}

export function fetchDraftPicks(fantasyLeagueId, token) {
  return httpGet({
    url: `/dev_api/league/${fantasyLeagueId}/draft_picks/`,
    token
  });
}
